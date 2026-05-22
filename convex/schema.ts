import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import {
  anchorKind,
  analyticsEventName,
  approvalDecision,
  editorialNoteType,
  evidenceClass,
  nodeType,
  relationshipTypeKey,
  suggestionReviewStatus,
  translationStatus,
  workflowStatus,
} from "./model";

export default defineSchema({
  translations: defineTable({
    key: v.string(),
    name: v.string(),
    languageCode: v.string(),
    sourceUrl: v.string(),
    detailsUrl: v.optional(v.string()),
    sourceFile: v.optional(v.string()),
    sourceVersion: v.optional(v.string()),
    importedAt: v.number(),
    licenseName: v.string(),
    licenseNote: v.string(),
    canPublishText: v.boolean(),
    status: translationStatus,
  })
    .index("by_key", ["key"])
    .index("by_status", ["status"]),

  books: defineTable({
    canonKey: v.string(),
    osisId: v.string(),
    displayName: v.string(),
    chapterCount: v.number(),
    curatedScope: v.union(
      v.literal("full"),
      v.literal("stub"),
      v.literal("none"),
    ),
    sortOrder: v.number(),
  })
    .index("by_canonKey", ["canonKey"])
    .index("by_osisId", ["osisId"])
    .index("by_sortOrder", ["sortOrder"]),

  verses: defineTable({
    verseKey: v.string(),
    osisRef: v.string(),
    bookId: v.id("books"),
    chapterNumber: v.number(),
    verseNumber: v.number(),
  })
    .index("by_verseKey", ["verseKey"])
    .index("by_book_chapter_verse", ["bookId", "chapterNumber", "verseNumber"])
    .index("by_osisRef", ["osisRef"]),

  verseTexts: defineTable({
    verseId: v.id("verses"),
    translationId: v.id("translations"),
    text: v.string(),
    textVersion: v.optional(v.string()),
    licenseSnapshot: v.optional(v.string()),
    checksum: v.optional(v.string()),
    status: translationStatus,
  })
    .index("by_verse_translation", ["verseId", "translationId"])
    .index("by_translation_verse", ["translationId", "verseId"]),

  passages: defineTable({
    slug: v.string(),
    title: v.string(),
    summary: v.optional(v.string()),
    kind: v.union(v.literal("chapter"), v.literal("section"), v.literal("stub")),
    bookId: v.id("books"),
    startVerseId: v.id("verses"),
    endVerseId: v.id("verses"),
    chapterNumber: v.optional(v.number()),
    status: workflowStatus,
    publishedAt: v.optional(v.number()),
    sortOrder: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_book_startVerse", ["bookId", "startVerseId"])
    .index("by_status", ["status"])
    .index("by_chapter", ["bookId", "chapterNumber"]),

  adminUsers: defineTable({
    authSubject: v.string(),
    email: v.string(),
    displayName: v.string(),
    role: v.union(v.literal("editor"), v.literal("reviewer"), v.literal("admin")),
    status: v.union(v.literal("active"), v.literal("disabled")),
    createdAt: v.number(),
  })
    .index("by_authSubject", ["authSubject"])
    .index("by_email", ["email"])
    .index("by_role", ["role"]),

  nodes: defineTable({
    slug: v.string(),
    nodeType,
    displayName: v.string(),
    shortLabel: v.optional(v.string()),
    summary: v.string(),
    boundaryNote: v.optional(v.string()),
    externalReference: v.optional(v.string()),
    passageId: v.optional(v.id("passages")),
    status: workflowStatus,
    isPublic: v.boolean(),
    publishedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
    createdByAdminUserId: v.optional(v.id("adminUsers")),
    displayOrder: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_type", ["nodeType"])
    .index("by_status", ["status"])
    .index("by_passageId", ["passageId"])
    .index("by_public", ["isPublic", "status"]),

  nodeAliases: defineTable({
    nodeId: v.id("nodes"),
    alias: v.string(),
    normalizedAlias: v.string(),
    locale: v.string(),
    aliasType: v.union(
      v.literal("display"),
      v.literal("alternate"),
      v.literal("transliteration"),
      v.literal("search"),
    ),
    isPrimary: v.boolean(),
  })
    .index("by_node", ["nodeId"])
    .index("by_normalizedAlias", ["normalizedAlias"])
    .index("by_primaryAlias", ["nodeId", "locale", "isPrimary"]),

  nodePassageAnchors: defineTable({
    nodeId: v.id("nodes"),
    passageId: v.id("passages"),
    startVerseId: v.optional(v.id("verses")),
    endVerseId: v.optional(v.id("verses")),
    anchorKind,
    displayLabel: v.string(),
    strength: v.optional(v.number()),
    displayOrder: v.number(),
  })
    .index("by_node", ["nodeId"])
    .index("by_passage", ["passageId"])
    .index("by_node_passage", ["nodeId", "passageId"]),

  relationships: defineTable({
    sourceNodeId: v.id("nodes"),
    targetNodeId: v.id("nodes"),
    relationshipTypeKey,
    subtype: v.optional(v.string()),
    evidenceClass,
    publicLabel: v.string(),
    rationale: v.string(),
    sourcePassageId: v.optional(v.id("passages")),
    targetPassageId: v.optional(v.id("passages")),
    approvalStatus: workflowStatus,
    currentApprovalId: v.optional(v.id("relationshipApprovals")),
    isPublic: v.boolean(),
    publishedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
    displayOrder: v.number(),
  })
    .index("by_source", ["sourceNodeId"])
    .index("by_target", ["targetNodeId"])
    .index("by_source_status", ["sourceNodeId", "approvalStatus"])
    .index("by_target_status", ["targetNodeId", "approvalStatus"])
    .index("by_public", ["isPublic", "approvalStatus"]),

  relationshipApprovals: defineTable({
    relationshipId: v.id("relationships"),
    decision: approvalDecision,
    decidedByAdminUserId: v.id("adminUsers"),
    decidedAt: v.number(),
    rationale: v.string(),
    evidenceSummary: v.optional(v.string()),
    version: v.number(),
    supersedesApprovalId: v.optional(v.id("relationshipApprovals")),
  })
    .index("by_relationship", ["relationshipId"])
    .index("by_decider", ["decidedByAdminUserId"])
    .index("by_decision_date", ["decision", "decidedAt"]),

  editorialNotes: defineTable({
    targetTable: v.string(),
    targetId: v.string(),
    noteType: editorialNoteType,
    body: v.string(),
    visibility: v.union(v.literal("internal"), v.literal("approval_packet")),
    authorAdminUserId: v.id("adminUsers"),
    createdAt: v.number(),
  })
    .index("by_target", ["targetTable", "targetId"])
    .index("by_author", ["authorAdminUserId"])
    .index("by_visibility", ["visibility"]),

  aiSuggestions: defineTable({
    suggestionType: v.union(
      v.literal("node"),
      v.literal("relationship"),
      v.literal("alias"),
      v.literal("anchor"),
      v.literal("theme"),
    ),
    targetTable: v.optional(v.string()),
    candidatePayloadJson: v.string(),
    modelProvider: v.string(),
    modelName: v.string(),
    promptVersion: v.string(),
    sourceRefKeys: v.array(v.string()),
    confidenceScore: v.optional(v.number()),
    reviewStatus: suggestionReviewStatus,
    reviewedByAdminUserId: v.optional(v.id("adminUsers")),
    reviewedAt: v.optional(v.number()),
    derivedRecordTable: v.optional(v.string()),
    derivedRecordId: v.optional(v.string()),
    publishBlocked: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_type", ["suggestionType"])
    .index("by_reviewStatus", ["reviewStatus"])
    .index("by_targetTable", ["targetTable"]),

  auditLog: defineTable({
    actorType: v.union(v.literal("admin"), v.literal("system"), v.literal("ai")),
    actorAdminUserId: v.optional(v.id("adminUsers")),
    action: v.string(),
    targetTable: v.string(),
    targetId: v.string(),
    beforeJson: v.optional(v.string()),
    afterJson: v.optional(v.string()),
    requestId: v.optional(v.string()),
    occurredAt: v.number(),
  })
    .index("by_target", ["targetTable", "targetId"])
    .index("by_actor", ["actorAdminUserId"])
    .index("by_action", ["action"])
    .index("by_occurredAt", ["occurredAt"]),

  analyticsEvents: defineTable({
    eventName: analyticsEventName,
    occurredAt: v.number(),
    sessionId: v.string(),
    anonymousUserId: v.optional(v.string()),
    pageSlug: v.optional(v.string()),
    passageId: v.optional(v.id("passages")),
    nodeId: v.optional(v.id("nodes")),
    relationshipId: v.optional(v.id("relationships")),
    metadataJson: v.optional(v.string()),
    payloadVersion: v.number(),
  })
    .index("by_eventName", ["eventName"])
    .index("by_sessionId", ["sessionId"])
    .index("by_occurredAt", ["occurredAt"])
    .index("by_pageSlug", ["pageSlug"]),
});
