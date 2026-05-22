import {
  RUTH_CHAPTER_VERSE_COUNTS,
  RUTH_TOTAL_VERSES,
  WEB_TRANSLATION,
  makeOsisRef,
  makeVerseKey,
} from "@/lib/scripture/constants";
import type { ParsedVerse } from "@/lib/scripture/usfm";

export function assertRuthCorpusShape(verses: ParsedVerse[]) {
  if (verses.length !== RUTH_TOTAL_VERSES) {
    throw new Error(
      `Expected ${RUTH_TOTAL_VERSES} Ruth verses, received ${verses.length}.`,
    );
  }

  for (const [chapter, expectedCount] of Object.entries(
    RUTH_CHAPTER_VERSE_COUNTS,
  )) {
    const chapterNumber = Number(chapter);
    const actualCount = verses.filter(
      (verse) => verse.chapterNumber === chapterNumber,
    ).length;

    if (actualCount !== expectedCount) {
      throw new Error(
        `Expected Ruth ${chapterNumber} to have ${expectedCount} verses, received ${actualCount}.`,
      );
    }
  }

  for (const verse of verses) {
    if (
      verse.verseKey !== makeVerseKey(verse.chapterNumber, verse.verseNumber)
    ) {
      throw new Error(`Invalid verseKey for ${JSON.stringify(verse)}.`);
    }

    if (verse.osisRef !== makeOsisRef(verse.chapterNumber, verse.verseNumber)) {
      throw new Error(`Invalid osisRef for ${JSON.stringify(verse)}.`);
    }

    if (verse.text.includes("\\") || verse.text.includes("|strong=")) {
      throw new Error(`USFM markup leaked into ${verse.osisRef}.`);
    }
  }
}

export function assertWebMetadataShape() {
  if (WEB_TRANSLATION.key !== "WEB") {
    throw new Error("WEB translation key must remain WEB.");
  }

  if (!WEB_TRANSLATION.canPublishText) {
    throw new Error("WEB translation must be publishable for the MVP.");
  }

  if (WEB_TRANSLATION.licenseName !== "Public Domain") {
    throw new Error("WEB license metadata should remain public-domain.");
  }
}
