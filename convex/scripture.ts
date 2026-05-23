/* eslint-disable @typescript-eslint/no-explicit-any */
import { v } from "convex/values";
import { query } from "./_generated/server";
import { isPublishedPublic } from "./model";

async function getWebTranslation(ctx: { db: any }) {
  const translation = await ctx.db
    .query("translations")
    .withIndex("by_key", (q: any) => q.eq("key", "WEB"))
    .first();

  if (!translation || translation.status !== "active" || !translation.canPublishText) {
    return null;
  }

  return translation;
}

async function getRuthBook(ctx: { db: any }) {
  return await ctx.db
    .query("books")
    .withIndex("by_canonKey", (q: any) => q.eq("canonKey", "ruth"))
    .first();
}

async function getNode(nodeId: string, ctx: { db: any }) {
  const node = await ctx.db.get(nodeId);
  return node && isPublishedPublic(node) ? node : null;
}

async function getPassage(passageId: string, ctx: { db: any }) {
  const passage = await ctx.db.get(passageId);
  return passage && passage.status === "published" ? passage : null;
}

async function hydrateRelationship(relationship: any, ctx: { db: any }) {
  if (!isPublishedPublic(relationship)) {
    return null;
  }

  const [sourceNode, targetNode, sourcePassage, targetPassage] = await Promise.all([
    getNode(relationship.sourceNodeId, ctx),
    getNode(relationship.targetNodeId, ctx),
    relationship.sourcePassageId
      ? getPassage(relationship.sourcePassageId, ctx)
      : null,
    relationship.targetPassageId
      ? getPassage(relationship.targetPassageId, ctx)
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
    sourcePassage: sourcePassage ? publicPassage(sourcePassage) : null,
    targetPassage: targetPassage ? publicPassage(targetPassage) : null,
  };
}

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
    sortOrder: passage.sortOrder,
  };
}

async function listChapterPassages(ctx: { db: any }, bookId: string, chapterNumber: number) {
  const passages = await ctx.db
    .query("passages")
    .withIndex("by_chapter", (q: any) =>
      q.eq("bookId", bookId).eq("chapterNumber", chapterNumber),
    )
    .collect();

  return passages
    .filter((passage: any) => passage.status === "published")
    .sort((a: any, b: any) => a.sortOrder - b.sortOrder);
}

async function hydrateAnchorsForPassages(ctx: { db: any }, passages: any[]) {
  const anchors = (
    await Promise.all(
      passages.map((passage) =>
        ctx.db
          .query("nodePassageAnchors")
          .withIndex("by_passage", (q: any) => q.eq("passageId", passage._id))
          .collect(),
      ),
    )
  ).flat();

  const hydrated = await Promise.all(
    anchors.map(async (anchor: any) => {
      const node = await getNode(anchor.nodeId, ctx);
      const passage = await getPassage(anchor.passageId, ctx);
      const startVerse = anchor.startVerseId ? await ctx.db.get(anchor.startVerseId) : null;
      const endVerse = anchor.endVerseId ? await ctx.db.get(anchor.endVerseId) : null;

      if (!node || !passage) {
        return null;
      }

      return {
        _id: anchor._id,
        anchorKind: anchor.anchorKind,
        displayLabel: anchor.displayLabel,
        readerSurface: anchor.readerSurface ?? "detail_only",
        displayOrder: anchor.displayOrder,
        startVerseKey: startVerse?.verseKey ?? null,
        endVerseKey: endVerse?.verseKey ?? null,
        passage: publicPassage(passage),
        node: publicNode(node),
      };
    }),
  );

  return hydrated
    .filter(Boolean)
    .sort((a: any, b: any) => a.displayOrder - b.displayOrder);
}

async function hydrateTextLinksForPassages(ctx: { db: any }, passages: any[]) {
  const textLinks = (
    await Promise.all(
      passages.map((passage) =>
        ctx.db
          .query("nodeTextLinks")
          .withIndex("by_passage", (q: any) => q.eq("passageId", passage._id))
          .collect(),
      ),
    )
  ).flat();

  const hydrated = await Promise.all(
    textLinks.map(async (textLink: any) => {
      const [node, passage, verse] = await Promise.all([
        getNode(textLink.nodeId, ctx),
        getPassage(textLink.passageId, ctx),
        ctx.db.get(textLink.verseId),
      ]);

      if (!node || !passage || !verse) {
        return null;
      }

      return {
        _id: textLink._id,
        anchorKind: textLink.anchorKind,
        displayLabel: textLink.displayLabel,
        linkedText: textLink.linkedText,
        startOffset: textLink.startOffset,
        endOffset: textLink.endOffset,
        contextLabel: textLink.contextLabel ?? null,
        displayOrder: textLink.displayOrder,
        verseKey: verse.verseKey,
        passage: publicPassage(passage),
        node: publicNode(node),
      };
    }),
  );

  return hydrated
    .filter(Boolean)
    .sort((a: any, b: any) => a.displayOrder - b.displayOrder);
}

export const getRuthOverview = query({
  args: {},
  handler: async (ctx) => {
    const [translation, book] = await Promise.all([
      getWebTranslation(ctx),
      getRuthBook(ctx),
    ]);

    if (!translation || !book) {
      return null;
    }

    const chapterPassages = await ctx.db
      .query("passages")
      .withIndex("by_chapter", (q: any) => q.eq("bookId", book._id))
      .collect();

    return {
      translation,
      book,
      chapters: chapterPassages
        .filter((passage: any) => passage.kind === "chapter" && passage.status === "published")
        .sort((a: any, b: any) => (a.chapterNumber ?? 0) - (b.chapterNumber ?? 0))
        .map(publicPassage),
    };
  },
});

export const getRuthChapter = query({
  args: {
    chapterNumber: v.number(),
  },
  handler: async (ctx, args) => {
    const [translation, book] = await Promise.all([
      getWebTranslation(ctx),
      getRuthBook(ctx),
    ]);

    if (!translation || !book || args.chapterNumber < 1 || args.chapterNumber > book.chapterCount) {
      return null;
    }

    const verses = await ctx.db
      .query("verses")
      .withIndex("by_book_chapter_verse", (q: any) =>
        q.eq("bookId", book._id).eq("chapterNumber", args.chapterNumber),
      )
      .collect();

    const sortedVerses = verses.sort(
      (a: any, b: any) => a.verseNumber - b.verseNumber,
    );

    const verseTexts = await Promise.all(
      sortedVerses.map((verse: any) =>
        ctx.db
          .query("verseTexts")
          .withIndex("by_verse_translation", (q: any) =>
            q.eq("verseId", verse._id).eq("translationId", translation._id),
          )
          .first(),
      ),
    );

    const passages = await listChapterPassages(ctx, book._id, args.chapterNumber);
    const anchors = await hydrateAnchorsForPassages(ctx, passages);
    const textLinks = await hydrateTextLinksForPassages(ctx, passages);
    const noteAnchors = anchors.filter(
      (anchor: any) => anchor.readerSurface === "note",
    );
    const nodeIds = new Set([
      ...anchors.map((anchor: any) => anchor.node._id),
      ...textLinks.map((textLink: any) => textLink.node._id),
    ]);
    const relationships = (
      await Promise.all(
        [...nodeIds].map((nodeId) =>
          ctx.db
            .query("relationships")
            .withIndex("by_source_status", (q: any) =>
              q.eq("sourceNodeId", nodeId).eq("approvalStatus", "published"),
            )
            .collect(),
        ),
      )
    ).flat();

    const hydratedRelationships = (
      await Promise.all(
        relationships.map((relationship: any) =>
          hydrateRelationship(relationship, ctx),
        ),
      )
    )
      .filter(Boolean)
      .sort((a: any, b: any) => a.displayOrder - b.displayOrder);

    return {
      translation: {
        key: translation.key,
        name: translation.name,
        licenseName: translation.licenseName,
        licenseNote: translation.licenseNote,
        sourceUrl: translation.sourceUrl,
        detailsUrl: translation.detailsUrl ?? null,
      },
      book,
      chapter: {
        number: args.chapterNumber,
        title: `Ruth ${args.chapterNumber}`,
        previous: args.chapterNumber > 1 ? args.chapterNumber - 1 : null,
        next:
          args.chapterNumber < book.chapterCount
            ? args.chapterNumber + 1
            : null,
      },
      passages: passages.map(publicPassage),
      verses: sortedVerses.map((verse: any, index: number) => ({
        _id: verse._id,
        verseKey: verse.verseKey,
        osisRef: verse.osisRef,
        chapterNumber: verse.chapterNumber,
        verseNumber: verse.verseNumber,
        text: verseTexts[index]?.text ?? "",
      })),
      anchors: noteAnchors,
      textLinks,
      relationships: hydratedRelationships,
    };
  },
});

export const getPassageBySlug = query({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    const passage = await ctx.db
      .query("passages")
      .withIndex("by_slug", (q: any) => q.eq("slug", args.slug))
      .first();

    if (!passage || passage.status !== "published") {
      return null;
    }

    const startVerse = await ctx.db.get(passage.startVerseId);
    const endVerse = await ctx.db.get(passage.endVerseId);

    return {
      ...publicPassage(passage),
      startVerseKey: startVerse?.verseKey ?? null,
      endVerseKey: endVerse?.verseKey ?? null,
    };
  },
});
