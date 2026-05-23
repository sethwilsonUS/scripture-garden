export function resolveLinkedTextOffsets({
  text,
  linkedText,
  occurrenceNumber = 1,
}: {
  text: string;
  linkedText: string;
  occurrenceNumber?: number;
}) {
  if (!linkedText || occurrenceNumber < 1 || !Number.isInteger(occurrenceNumber)) {
    return null;
  }

  let searchFrom = 0;
  let currentOccurrence = 0;

  while (searchFrom <= text.length) {
    const startOffset = text.indexOf(linkedText, searchFrom);

    if (startOffset === -1) {
      return null;
    }

    currentOccurrence += 1;
    const endOffset = startOffset + linkedText.length;

    if (currentOccurrence === occurrenceNumber) {
      return { startOffset, endOffset };
    }

    searchFrom = endOffset;
  }

  return null;
}
