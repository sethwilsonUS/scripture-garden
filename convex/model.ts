import { v } from "convex/values";

export const workflowStatus = v.union(
  v.literal("draft"),
  v.literal("suggested"),
  v.literal("approved"),
  v.literal("published"),
  v.literal("archived"),
  v.literal("rejected"),
);

export const translationStatus = v.union(
  v.literal("active"),
  v.literal("disabled"),
);

export const nodeType = v.union(
  v.literal("passage"),
  v.literal("person"),
  v.literal("place"),
  v.literal("group_lineage"),
  v.literal("thing_practice"),
  v.literal("theme_motif"),
  v.literal("external_stub"),
);

export const evidenceClass = v.union(
  v.literal("textual"),
  v.literal("contextual"),
  v.literal("editorial"),
);

export const anchorKind = v.union(
  v.literal("primary"),
  v.literal("mention"),
  v.literal("context"),
  v.literal("background"),
);

export const relationshipTypeKey = v.union(
  v.literal("appears_in"),
  v.literal("alias_of"),
  v.literal("kinship"),
  v.literal("located_in"),
  v.literal("movement"),
  v.literal("associated_with"),
  v.literal("linked_passage"),
  v.literal("cross_book_stub_link"),
  v.literal("thematic_resonance"),
);

export const approvalDecision = v.union(
  v.literal("approved"),
  v.literal("rejected"),
  v.literal("revoked"),
);

export const suggestionReviewStatus = v.union(
  v.literal("suggested"),
  v.literal("reviewed"),
  v.literal("accepted"),
  v.literal("rejected"),
  v.literal("expired"),
);

export const editorialNoteType = v.union(
  v.literal("research"),
  v.literal("copyedit"),
  v.literal("licensing"),
  v.literal("approval"),
  v.literal("todo"),
);

export const analyticsEventName = v.union(
  v.literal("ruth_entry"),
  v.literal("chapter_viewed"),
  v.literal("entity_opened"),
  v.literal("relationship_followed"),
  v.literal("stub_opened"),
  v.literal("return_to_ruth"),
  v.literal("overlay_density_changed"),
);

export function requireAdminSecret(adminSecret: string) {
  const expected = process.env.ADMIN_MUTATION_SECRET;

  if (!expected || adminSecret !== expected) {
    throw new Error("Unauthorized admin operation.");
  }
}

export function isPublishedPublic(record: {
  status?: string;
  approvalStatus?: string;
  isPublic?: boolean;
  currentApprovalId?: unknown;
}) {
  if (record.approvalStatus !== undefined) {
    return (
      record.approvalStatus === "published" &&
      record.isPublic === true &&
      record.currentApprovalId !== undefined
    );
  }

  return record.status === "published" && record.isPublic === true;
}
