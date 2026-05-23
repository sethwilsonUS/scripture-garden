/* eslint-disable @typescript-eslint/no-explicit-any */
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import {
  anchorKind,
  evidenceClass,
  nodeType,
  readerSurface,
  relationshipTypeKey,
  requireAdminSecret,
  workflowStatus,
} from "./model";
import { resolveLinkedTextOffsets } from "./textLinks";

async function getAdminUser(ctx: { db: any }) {
  const existing = await ctx.db
    .query("adminUsers")
    .withIndex("by_authSubject", (q: any) => q.eq("authSubject", "admin:mvp"))
    .first();

  if (existing) {
    return existing;
  }

  const id = await ctx.db.insert("adminUsers", {
    authSubject: "admin:mvp",
    email: "admin@scripture-garden.local",
    displayName: "MVP Editor",
    role: "admin",
    status: "active",
    createdAt: Date.now(),
  });

  return await ctx.db.get(id);
}

async function audit(
  ctx: { db: any },
  args: {
    action: string;
    targetTable: string;
    targetId: string;
    actorAdminUserId?: string;
    before?: unknown;
    after?: unknown;
  },
) {
  await ctx.db.insert("auditLog", {
    actorType: "admin",
    actorAdminUserId: args.actorAdminUserId,
    action: args.action,
    targetTable: args.targetTable,
    targetId: args.targetId,
    beforeJson: args.before ? JSON.stringify(args.before) : undefined,
    afterJson: args.after ? JSON.stringify(args.after) : undefined,
    occurredAt: Date.now(),
  });
}

async function getBySlug(ctx: { db: any }, table: string, slug: string) {
  return await ctx.db
    .query(table)
    .withIndex("by_slug", (q: any) => q.eq("slug", slug))
    .first();
}

async function getVerseByKey(ctx: { db: any }, verseKey: string) {
  return await ctx.db
    .query("verses")
    .withIndex("by_verseKey", (q: any) => q.eq("verseKey", verseKey))
    .first();
}

async function getWebTranslation(ctx: { db: any }) {
  return await ctx.db
    .query("translations")
    .withIndex("by_key", (q: any) => q.eq("key", "WEB"))
    .first();
}

function verseIsInPassage(verse: any, startVerse: any, endVerse: any) {
  if (!verse || !startVerse || !endVerse) {
    return false;
  }

  if (verse.bookId !== startVerse.bookId || verse.bookId !== endVerse.bookId) {
    return false;
  }

  const versePosition = verse.chapterNumber * 1000 + verse.verseNumber;
  const startPosition = startVerse.chapterNumber * 1000 + startVerse.verseNumber;
  const endPosition = endVerse.chapterNumber * 1000 + endVerse.verseNumber;

  return versePosition >= startPosition && versePosition <= endPosition;
}

export const listWorkbench = query({
  args: {
    adminSecret: v.string(),
  },
  handler: async (ctx, args) => {
    requireAdminSecret(args.adminSecret);

    const [
      nodes,
      relationships,
      approvals,
      passages,
      suggestions,
      auditEntries,
    ] = await Promise.all([
      ctx.db.query("nodes").collect(),
      ctx.db.query("relationships").collect(),
      ctx.db.query("relationshipApprovals").collect(),
      ctx.db.query("passages").collect(),
      ctx.db.query("aiSuggestions").collect(),
      ctx.db
        .query("auditLog")
        .withIndex("by_occurredAt")
        .order("desc")
        .take(12),
    ]);

    const nodeById = new Map(nodes.map((node: any) => [node._id, node]));
    const passageById = new Map(passages.map((passage: any) => [passage._id, passage]));
    const approvalCounts = new Map<string, number>();
    for (const approval of approvals) {
      approvalCounts.set(
        approval.relationshipId,
        (approvalCounts.get(approval.relationshipId) ?? 0) + 1,
      );
    }

    return {
      nodes: nodes.sort((a: any, b: any) => a.displayOrder - b.displayOrder),
      passages: passages.sort((a: any, b: any) => a.sortOrder - b.sortOrder),
      relationships: relationships
        .sort((a: any, b: any) => a.displayOrder - b.displayOrder)
        .map((relationship: any) => ({
          ...relationship,
          sourceNode: nodeById.get(relationship.sourceNodeId) ?? null,
          targetNode: nodeById.get(relationship.targetNodeId) ?? null,
          sourcePassage: relationship.sourcePassageId
            ? passageById.get(relationship.sourcePassageId) ?? null
            : null,
          approvalCount: approvalCounts.get(relationship._id) ?? 0,
        })),
      suggestions: suggestions.sort((a: any, b: any) => b.createdAt - a.createdAt),
      auditEntries,
    };
  },
});

export const createNode = mutation({
  args: {
    adminSecret: v.string(),
    slug: v.string(),
    nodeType,
    displayName: v.string(),
    summary: v.string(),
    boundaryNote: v.optional(v.string()),
    externalReference: v.optional(v.string()),
    status: workflowStatus,
    isPublic: v.boolean(),
  },
  handler: async (ctx, args) => {
    requireAdminSecret(args.adminSecret);
    const adminUser = await getAdminUser(ctx);
    const existing = await getBySlug(ctx, "nodes", args.slug);

    if (existing) {
      throw new Error(`Node slug already exists: ${args.slug}`);
    }

    const now = Date.now();
    const nodeId = await ctx.db.insert("nodes", {
      slug: args.slug,
      nodeType: args.nodeType,
      displayName: args.displayName,
      shortLabel: args.displayName,
      summary: args.summary,
      boundaryNote: args.boundaryNote || undefined,
      externalReference: args.externalReference || undefined,
      status: args.status,
      isPublic: args.isPublic && args.status === "published",
      publishedAt: args.isPublic && args.status === "published" ? now : undefined,
      createdAt: now,
      updatedAt: now,
      createdByAdminUserId: adminUser._id,
      displayOrder: now,
    });

    await ctx.db.insert("nodeAliases", {
      nodeId,
      alias: args.displayName,
      normalizedAlias: args.displayName.toLowerCase(),
      locale: "en-US",
      aliasType: "display",
      isPrimary: true,
    });

    await audit(ctx, {
      action: "create_node",
      targetTable: "nodes",
      targetId: nodeId,
      actorAdminUserId: adminUser._id,
      after: await ctx.db.get(nodeId),
    });

    return nodeId;
  },
});

export const createAnchor = mutation({
  args: {
    adminSecret: v.string(),
    nodeSlug: v.string(),
    passageSlug: v.string(),
    anchorKind,
    displayLabel: v.string(),
    readerSurface: v.optional(readerSurface),
  },
  handler: async (ctx, args) => {
    requireAdminSecret(args.adminSecret);
    const adminUser = await getAdminUser(ctx);
    const node = await getBySlug(ctx, "nodes", args.nodeSlug);
    const passage = await getBySlug(ctx, "passages", args.passageSlug);

    if (!node || !passage) {
      throw new Error("Node and passage are required to create an anchor.");
    }

    const anchorId = await ctx.db.insert("nodePassageAnchors", {
      nodeId: node._id,
      passageId: passage._id,
      startVerseId: passage.startVerseId,
      endVerseId: passage.endVerseId,
      anchorKind: args.anchorKind,
      displayLabel: args.displayLabel,
      readerSurface: args.readerSurface ?? "detail_only",
      strength: 3,
      displayOrder: Date.now(),
    });

    await audit(ctx, {
      action: "create_anchor",
      targetTable: "nodePassageAnchors",
      targetId: anchorId,
      actorAdminUserId: adminUser._id,
      after: await ctx.db.get(anchorId),
    });

    return anchorId;
  },
});

export const createNodeTextLink = mutation({
  args: {
    adminSecret: v.string(),
    nodeSlug: v.string(),
    passageSlug: v.string(),
    verseKey: v.string(),
    linkedText: v.string(),
    occurrenceNumber: v.optional(v.number()),
    anchorKind,
    displayLabel: v.string(),
    contextLabel: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    requireAdminSecret(args.adminSecret);
    const adminUser = await getAdminUser(ctx);
    const [node, passage, verse, translation] = await Promise.all([
      getBySlug(ctx, "nodes", args.nodeSlug),
      getBySlug(ctx, "passages", args.passageSlug),
      getVerseByKey(ctx, args.verseKey),
      getWebTranslation(ctx),
    ]);

    if (!node || !passage || !verse || !translation) {
      throw new Error("Node, passage, verse, and WEB translation are required.");
    }

    const [startVerse, endVerse, verseText] = await Promise.all([
      ctx.db.get(passage.startVerseId),
      ctx.db.get(passage.endVerseId),
      ctx.db
        .query("verseTexts")
        .withIndex("by_verse_translation", (q: any) =>
          q.eq("verseId", verse._id).eq("translationId", translation._id),
        )
        .first(),
    ]);

    if (!verseIsInPassage(verse, startVerse, endVerse)) {
      throw new Error(`${args.verseKey} is not inside ${args.passageSlug}.`);
    }

    if (!verseText?.text) {
      throw new Error(`WEB text was not found for ${args.verseKey}.`);
    }

    const offsets = resolveLinkedTextOffsets({
      text: verseText.text,
      linkedText: args.linkedText,
      occurrenceNumber: args.occurrenceNumber ?? 1,
    });

    if (!offsets) {
      throw new Error(
        `Could not find occurrence ${args.occurrenceNumber ?? 1} of "${args.linkedText}" in ${args.verseKey}.`,
      );
    }

    const existingLinks = await ctx.db
      .query("nodeTextLinks")
      .withIndex("by_node_verse", (q: any) =>
        q.eq("nodeId", node._id).eq("verseId", verse._id),
      )
      .collect();

    const duplicate = existingLinks.find(
      (link: any) =>
        link.startOffset === offsets.startOffset &&
        link.endOffset === offsets.endOffset,
    );

    if (duplicate) {
      throw new Error("This node already has an inline link at that span.");
    }

    const linkId = await ctx.db.insert("nodeTextLinks", {
      nodeId: node._id,
      passageId: passage._id,
      verseId: verse._id,
      anchorKind: args.anchorKind,
      displayLabel: args.displayLabel,
      linkedText: args.linkedText,
      startOffset: offsets.startOffset,
      endOffset: offsets.endOffset,
      contextLabel: args.contextLabel || undefined,
      displayOrder: Date.now(),
    });

    await audit(ctx, {
      action: "create_node_text_link",
      targetTable: "nodeTextLinks",
      targetId: linkId,
      actorAdminUserId: adminUser._id,
      after: await ctx.db.get(linkId),
    });

    return linkId;
  },
});

export const createRelationship = mutation({
  args: {
    adminSecret: v.string(),
    sourceNodeSlug: v.string(),
    targetNodeSlug: v.string(),
    relationshipTypeKey,
    evidenceClass,
    publicLabel: v.string(),
    rationale: v.string(),
    sourcePassageSlug: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    requireAdminSecret(args.adminSecret);
    const adminUser = await getAdminUser(ctx);
    const sourceNode = await getBySlug(ctx, "nodes", args.sourceNodeSlug);
    const targetNode = await getBySlug(ctx, "nodes", args.targetNodeSlug);
    const sourcePassage = args.sourcePassageSlug
      ? await getBySlug(ctx, "passages", args.sourcePassageSlug)
      : null;

    if (!sourceNode || !targetNode) {
      throw new Error("Source and target nodes are required.");
    }

    const now = Date.now();
    const relationshipId = await ctx.db.insert("relationships", {
      sourceNodeId: sourceNode._id,
      targetNodeId: targetNode._id,
      relationshipTypeKey: args.relationshipTypeKey,
      evidenceClass: args.evidenceClass,
      publicLabel: args.publicLabel,
      rationale: args.rationale,
      sourcePassageId: sourcePassage?._id,
      approvalStatus: "draft",
      isPublic: false,
      createdAt: now,
      updatedAt: now,
      displayOrder: now,
    });

    await audit(ctx, {
      action: "create_relationship",
      targetTable: "relationships",
      targetId: relationshipId,
      actorAdminUserId: adminUser._id,
      after: await ctx.db.get(relationshipId),
    });

    return relationshipId;
  },
});

export const decideRelationship = mutation({
  args: {
    adminSecret: v.string(),
    relationshipId: v.id("relationships"),
    decision: v.union(v.literal("approved"), v.literal("rejected"), v.literal("revoked")),
    rationale: v.string(),
  },
  handler: async (ctx, args) => {
    requireAdminSecret(args.adminSecret);
    const adminUser = await getAdminUser(ctx);
    const relationship = await ctx.db.get(args.relationshipId);

    if (!relationship) {
      throw new Error("Relationship not found.");
    }

    const previousApprovals = await ctx.db
      .query("relationshipApprovals")
      .withIndex("by_relationship", (q: any) =>
        q.eq("relationshipId", args.relationshipId),
      )
      .collect();
    const latestApproval = previousApprovals.sort(
      (a: any, b: any) => b.version - a.version,
    )[0];
    const version = latestApproval ? latestApproval.version + 1 : 1;

    const approvalId = await ctx.db.insert("relationshipApprovals", {
      relationshipId: args.relationshipId,
      decision: args.decision,
      decidedByAdminUserId: adminUser._id,
      decidedAt: Date.now(),
      rationale: args.rationale,
      evidenceSummary: relationship.rationale,
      version,
      supersedesApprovalId: latestApproval?._id,
    });

    if (args.decision === "approved") {
      await ctx.db.patch(args.relationshipId, {
        approvalStatus: "published",
        currentApprovalId: approvalId,
        isPublic: true,
        publishedAt: Date.now(),
        updatedAt: Date.now(),
      });
    } else {
      await ctx.db.patch(args.relationshipId, {
        approvalStatus: args.decision === "rejected" ? "rejected" : "archived",
        currentApprovalId: approvalId,
        isPublic: false,
        publishedAt: undefined,
        updatedAt: Date.now(),
      });
    }

    await audit(ctx, {
      action: `relationship_${args.decision}`,
      targetTable: "relationships",
      targetId: args.relationshipId,
      actorAdminUserId: adminUser._id,
      before: relationship,
      after: await ctx.db.get(args.relationshipId),
    });

    return approvalId;
  },
});

export const reviewSuggestion = mutation({
  args: {
    adminSecret: v.string(),
    suggestionId: v.id("aiSuggestions"),
    reviewStatus: v.union(v.literal("reviewed"), v.literal("accepted"), v.literal("rejected"), v.literal("expired")),
  },
  handler: async (ctx, args) => {
    requireAdminSecret(args.adminSecret);
    const adminUser = await getAdminUser(ctx);
    const suggestion = await ctx.db.get(args.suggestionId);

    if (!suggestion) {
      throw new Error("Suggestion not found.");
    }

    await ctx.db.patch(args.suggestionId, {
      reviewStatus: args.reviewStatus,
      reviewedByAdminUserId: adminUser._id,
      reviewedAt: Date.now(),
      publishBlocked: true,
    });

    await audit(ctx, {
      action: `ai_suggestion_${args.reviewStatus}`,
      targetTable: "aiSuggestions",
      targetId: args.suggestionId,
      actorAdminUserId: adminUser._id,
      before: suggestion,
      after: await ctx.db.get(args.suggestionId),
    });

    return { ok: true };
  },
});
