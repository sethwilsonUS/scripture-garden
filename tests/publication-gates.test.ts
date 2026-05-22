import { isPublishedPublic } from "@/convex/model";
import { describe, expect, it } from "vitest";

describe("publication gates", () => {
  it("exposes public nodes only when published and explicitly public", () => {
    expect(isPublishedPublic({ status: "published", isPublic: true })).toBe(true);
    expect(isPublishedPublic({ status: "draft", isPublic: true })).toBe(false);
    expect(isPublishedPublic({ status: "published", isPublic: false })).toBe(false);
  });

  it("requires approved publication state and approval history for relationships", () => {
    expect(
      isPublishedPublic({
        approvalStatus: "published",
        isPublic: true,
        currentApprovalId: "approval-1",
      }),
    ).toBe(true);

    expect(
      isPublishedPublic({
        approvalStatus: "approved",
        isPublic: true,
        currentApprovalId: "approval-1",
      }),
    ).toBe(false);

    expect(
      isPublishedPublic({
        approvalStatus: "published",
        isPublic: true,
      }),
    ).toBe(false);
  });
});
