export type ParsedVerse = {
  chapterNumber: number;
  verseNumber: number;
  verseKey: string;
  osisRef: string;
  text: string;
};

function cleanVerseText(source: string) {
  return source
    .replace(/\\f \+[\s\S]*?\\f\*/g, "")
    .replace(/\\w ([^|\\]+)(?:\|[^\\]*)?\\w\*/g, "$1")
    .replace(/\\\+?wh ([^\\]+)\\\+?wh\*/g, "$1")
    .replace(/\\[a-z0-9]+\*?/gi, " ")
    .replace(/\s+([,.;:?!])/g, "$1")
    .replace(/\s+([”’])/g, "$1")
    .replace(/([“‘])\s+/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

export function parseRuthUsfm(usfm: string): ParsedVerse[] {
  const verses: ParsedVerse[] = [];
  let currentChapter = 0;
  let currentVerse: number | null = null;
  let currentText = "";

  function flushVerse() {
    if (!currentChapter || currentVerse === null) {
      return;
    }

    const text = cleanVerseText(currentText);

    if (text.length === 0) {
      return;
    }

    verses.push({
      chapterNumber: currentChapter,
      verseNumber: currentVerse,
      verseKey: `ruth.${currentChapter}.${currentVerse}`,
      osisRef: `Ruth.${currentChapter}.${currentVerse}`,
      text,
    });
  }

  for (const rawLine of usfm.split(/\r?\n/)) {
    const line = rawLine.trim();

    if (line.startsWith("\\c ")) {
      flushVerse();
      currentVerse = null;
      currentText = "";
      currentChapter = Number.parseInt(line.replace("\\c", "").trim(), 10);
      continue;
    }

    const verseMatch = line.match(/^\\v\s+(\d+)\s*(.*)$/);

    if (verseMatch) {
      flushVerse();
      currentVerse = Number.parseInt(verseMatch[1], 10);
      currentText = verseMatch[2] ?? "";
      continue;
    }

    if (currentVerse !== null && line.length > 0) {
      currentText += ` ${line}`;
    }
  }

  flushVerse();

  return verses;
}
