import { resolveTextSegments } from "@/components/reader/text-link-segments";
import type { PublicTextLink } from "@/components/reader/types";
import { resolveLinkedTextOffsets } from "@/convex/textLinks";
import { describe, expect, it } from "vitest";

function makeLink(
  overrides: Partial<PublicTextLink> & Pick<PublicTextLink, "linkedText">,
): PublicTextLink {
  return {
    _id: overrides._id ?? `link-${overrides.linkedText}`,
    anchorKind: overrides.anchorKind ?? "primary",
    displayLabel: overrides.displayLabel ?? overrides.linkedText,
    linkedText: overrides.linkedText,
    startOffset: overrides.startOffset ?? 0,
    endOffset: overrides.endOffset ?? overrides.linkedText.length,
    contextLabel: overrides.contextLabel ?? null,
    displayOrder: overrides.displayOrder ?? 10,
    verseKey: overrides.verseKey ?? "ruth.1.1",
    passage: {
      _id: "passage-1",
      slug: "ruth-1",
      title: "Ruth 1",
      summary: null,
      kind: "chapter",
      chapterNumber: 1,
    },
    node: {
      _id: "node-1",
      slug: "moab",
      nodeType: "place",
      displayName: "Moab",
      shortLabel: "Moab",
      summary: "Moab",
      boundaryNote: null,
      externalReference: null,
      displayOrder: 10,
    },
  };
}

describe("inline text links", () => {
  it("resolves duplicate linked text by requested occurrence", () => {
    const offsets = resolveLinkedTextOffsets({
      text: "Moab, then another mention of Moab.",
      linkedText: "Moab",
      occurrenceNumber: 2,
    });

    expect(offsets).toEqual({ startOffset: 30, endOffset: 34 });
  });

  it("preserves verse text exactly while segmenting links", () => {
    const text = "A certain man went to Moab.";
    const startOffset = text.indexOf("Moab");
    const segments = resolveTextSegments({
      text,
      density: "focused",
      links: [
        makeLink({
          linkedText: "Moab",
          startOffset,
          endOffset: startOffset + "Moab".length,
        }),
      ],
    });

    expect(segments.map((segment) => segment.text).join("")).toBe(text);
    expect(segments.filter((segment) => segment.kind === "link")).toHaveLength(1);
  });

  it("suppresses overlapping links by anchor priority before display order", () => {
    const text = "Ruth the Moabitess returned.";
    const segments = resolveTextSegments({
      text,
      density: "full",
      links: [
        makeLink({
          linkedText: "Ruth",
          anchorKind: "mention",
          startOffset: 0,
          endOffset: 4,
          displayOrder: 1,
        }),
        makeLink({
          linkedText: "Ruth the Moabitess",
          anchorKind: "primary",
          startOffset: 0,
          endOffset: 18,
          displayOrder: 50,
        }),
      ],
    });

    expect(segments.filter((segment) => segment.kind === "link")).toHaveLength(1);
    expect(segments.find((segment) => segment.kind === "link")?.text).toBe(
      "Ruth the Moabitess",
    );
  });

  it("filters background links unless all paths are visible", () => {
    const text = "David closes the genealogy.";
    const startOffset = text.indexOf("David");
    const link = makeLink({
      linkedText: "David",
      anchorKind: "background",
      startOffset,
      endOffset: startOffset + "David".length,
    });

    expect(
      resolveTextSegments({ text, links: [link], density: "focused" }).filter(
        (segment) => segment.kind === "link",
      ),
    ).toHaveLength(0);
    expect(
      resolveTextSegments({ text, links: [link], density: "full" }).filter(
        (segment) => segment.kind === "link",
      ),
    ).toHaveLength(1);
  });

  it("omits invalid offsets without changing the text", () => {
    const text = "Ruth stayed.";
    const segments = resolveTextSegments({
      text,
      density: "focused",
      links: [
        makeLink({
          linkedText: "Naomi",
          startOffset: 0,
          endOffset: 5,
        }),
      ],
    });

    expect(segments).toEqual([{ kind: "text", text }]);
  });
});
