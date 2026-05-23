import type {
  PublicAnchor,
  PublicTextLink,
} from "@/components/reader/types";

export type OverlayDensity = "focused" | "full" | "hidden";

export type TextSegment =
  | { kind: "text"; text: string }
  | { kind: "link"; text: string; link: PublicTextLink };

const anchorKindRank: Record<PublicAnchor["anchorKind"], number> = {
  primary: 0,
  context: 1,
  mention: 2,
  background: 3,
};

export function isVisibleForDensity(
  anchorKind: PublicAnchor["anchorKind"],
  density: OverlayDensity,
) {
  if (density === "hidden") {
    return false;
  }

  if (density === "full") {
    return true;
  }

  return anchorKind === "primary" || anchorKind === "context";
}

export function textLinkIsValid(text: string, link: PublicTextLink) {
  return (
    Number.isInteger(link.startOffset) &&
    Number.isInteger(link.endOffset) &&
    link.startOffset >= 0 &&
    link.endOffset > link.startOffset &&
    link.endOffset <= text.length &&
    text.slice(link.startOffset, link.endOffset) === link.linkedText
  );
}

function overlaps(first: PublicTextLink, second: PublicTextLink) {
  return (
    first.startOffset < second.endOffset &&
    second.startOffset < first.endOffset
  );
}

export function visibleNoteAnchorsForVerse({
  anchors,
  density,
  verseKey,
}: {
  anchors: PublicAnchor[];
  density: OverlayDensity;
  verseKey: string;
}) {
  return anchors
    .filter((anchor) => anchor.startVerseKey === verseKey)
    .filter((anchor) => isVisibleForDensity(anchor.anchorKind, density))
    .sort((a, b) => a.displayOrder - b.displayOrder);
}

export function resolveTextSegments({
  text,
  links,
  density,
}: {
  text: string;
  links: PublicTextLink[];
  density: OverlayDensity;
}): TextSegment[] {
  const prioritized = links
    .filter((link) => isVisibleForDensity(link.anchorKind, density))
    .filter((link) => textLinkIsValid(text, link))
    .sort((a, b) => {
      const priority = anchorKindRank[a.anchorKind] - anchorKindRank[b.anchorKind];

      if (priority !== 0) {
        return priority;
      }

      if (a.displayOrder !== b.displayOrder) {
        return a.displayOrder - b.displayOrder;
      }

      return a.startOffset - b.startOffset;
    });

  const selected: PublicTextLink[] = [];

  for (const link of prioritized) {
    if (!selected.some((selectedLink) => overlaps(selectedLink, link))) {
      selected.push(link);
    }
  }

  selected.sort((a, b) => a.startOffset - b.startOffset);

  if (selected.length === 0) {
    return [{ kind: "text", text }];
  }

  const segments: TextSegment[] = [];
  let cursor = 0;

  for (const link of selected) {
    if (link.startOffset > cursor) {
      segments.push({ kind: "text", text: text.slice(cursor, link.startOffset) });
    }

    segments.push({
      kind: "link",
      link,
      text: text.slice(link.startOffset, link.endOffset),
    });
    cursor = link.endOffset;
  }

  if (cursor < text.length) {
    segments.push({ kind: "text", text: text.slice(cursor) });
  }

  return segments;
}
