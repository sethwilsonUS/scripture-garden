/* eslint-disable @typescript-eslint/no-explicit-any */
import { v } from "convex/values";
import { query } from "./_generated/server";
import { isPublishedPublic } from "./model";

function publicNode(node: any) {
  return {
    _id: node._id,
    slug: node.slug,
    nodeType: node.nodeType,
    displayName: node.displayName,
    shortLabel: node.shortLabel ?? node.displayName,
    summary: node.summary,
    boundaryNote: node.boundaryNote ?? null,
    externalReference: node.externalReference ?? null,
    displayOrder: node.displayOrder,
  };
}

function publicPassage(passage: any) {
  return {
    _id: passage._id,
    slug: passage.slug,
    title: passage.title,
    summary: passage.summary ?? null,
    kind: passage.kind,
    chapterNumber: passage.chapterNumber ?? null,
  };
}

async function getPublicNode(ctx: { db: any }, nodeId: string) {
  const node = await ctx.db.get(nodeId);
  return node && isPublishedPublic(node) ? node : null;
}

async function hydrateRelationship(ctx: { db: any }, relationship: any) {
  if (!isPublishedPublic(relationship)) {
    return null;
  }

  const [sourceNode, targetNode, sourcePassage, targetPassage] = await Promise.all([
    getPublicNode(ctx, relationship.sourceNodeId),
    getPublicNode(ctx, relationship.targetNodeId),
    relationship.sourcePassageId
      ? ctx.db.get(relationship.sourcePassageId)
      : null,
    relationship.targetPassageId
      ? ctx.db.get(relationship.targetPassageId)
      : null,
  ]);

  if (!sourceNode || !targetNode) {
    return null;
  }

  return {
    _id: relationship._id,
    relationshipTypeKey: relationship.relationshipTypeKey,
    evidenceClass: relationship.evidenceClass,
    publicLabel: relationship.publicLabel,
    rationale: relationship.rationale,
    displayOrder: relationship.displayOrder,
    sourceNode: publicNode(sourceNode),
    targetNode: publicNode(targetNode),
    sourcePassage:
      sourcePassage && sourcePassage.status === "published"
        ? publicPassage(sourcePassage)
        : null,
    targetPassage:
      targetPassage && targetPassage.status === "published"
        ? publicPassage(targetPassage)
        : null,
  };
}

export const getNodeDetail = query({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    const node = await ctx.db
      .query("nodes")
      .withIndex("by_slug", (q: any) => q.eq("slug", args.slug))
      .first();

    if (!node || !isPublishedPublic(node)) {
      return null;
    }

    const anchors = await ctx.db
      .query("nodePassageAnchors")
      .withIndex("by_node", (q: any) => q.eq("nodeId", node._id))
      .collect();

    const hydratedAnchors = (
      await Promise.all(
        anchors.map(async (anchor: any) => {
          const [passage, startVerse, endVerse] = (await Promise.all([
            ctx.db.get(anchor.passageId),
            anchor.startVerseId ? ctx.db.get(anchor.startVerseId) : null,
            anchor.endVerseId ? ctx.db.get(anchor.endVerseId) : null,
          ])) as any[];

          if (!passage || passage.status !== "published") {
            return null;
          }

          return {
            _id: anchor._id,
            anchorKind: anchor.anchorKind,
            displayLabel: anchor.displayLabel,
            displayOrder: anchor.displayOrder,
            passage: publicPassage(passage),
            startVerseKey: startVerse?.verseKey ?? null,
            endVerseKey: endVerse?.verseKey ?? null,
          };
        }),
      )
    )
      .filter(Boolean)
      .sort((a: any, b: any) => a.displayOrder - b.displayOrder);

    const outgoing = await ctx.db
      .query("relationships")
      .withIndex("by_source_status", (q: any) =>
        q.eq("sourceNodeId", node._id).eq("approvalStatus", "published"),
      )
      .collect();

    const incoming = await ctx.db
      .query("relationships")
      .withIndex("by_target_status", (q: any) =>
        q.eq("targetNodeId", node._id).eq("approvalStatus", "published"),
      )
      .collect();

    const relationships = (
      await Promise.all(
        [...outgoing, ...incoming].map((relationship: any) =>
          hydrateRelationship(ctx, relationship),
        ),
      )
    )
      .filter(Boolean)
      .sort((a: any, b: any) => a.displayOrder - b.displayOrder);

    return {
      node: publicNode(node),
      anchors: hydratedAnchors,
      relationships,
    };
  },
});
