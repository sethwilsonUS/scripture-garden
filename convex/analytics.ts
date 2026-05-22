/* eslint-disable @typescript-eslint/no-explicit-any */
import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { analyticsEventName } from "./model";

const allowedMetadataKeys = new Set([
  "chapterNumber",
  "nodeSlug",
  "relationshipId",
  "overlayDensity",
  "from",
  "to",
]);

export const record = mutation({
  args: {
    eventName: analyticsEventName,
    sessionId: v.string(),
    anonymousUserId: v.optional(v.string()),
    pageSlug: v.optional(v.string()),
    passageSlug: v.optional(v.string()),
    nodeSlug: v.optional(v.string()),
    relationshipId: v.optional(v.id("relationships")),
    metadata: v.optional(v.record(v.string(), v.union(v.string(), v.number(), v.boolean()))),
  },
  handler: async (ctx, args) => {
    const metadata = args.metadata ?? {};
    const safeMetadata = Object.fromEntries(
      Object.entries(metadata).filter(([key]) => allowedMetadataKeys.has(key)),
    );

    const [passage, node] = await Promise.all([
      args.passageSlug
        ? ctx.db
            .query("passages")
            .withIndex("by_slug", (q: any) => q.eq("slug", args.passageSlug))
            .first()
        : null,
      args.nodeSlug
        ? ctx.db
            .query("nodes")
            .withIndex("by_slug", (q: any) => q.eq("slug", args.nodeSlug))
            .first()
        : null,
    ]);

    await ctx.db.insert("analyticsEvents", {
      eventName: args.eventName,
      occurredAt: Date.now(),
      sessionId: args.sessionId,
      anonymousUserId: args.anonymousUserId,
      pageSlug: args.pageSlug,
      passageId: passage?._id,
      nodeId: node?._id,
      relationshipId: args.relationshipId,
      metadataJson: JSON.stringify(safeMetadata),
      payloadVersion: 1,
    });

    return { ok: true };
  },
});
