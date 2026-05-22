import seed from "@/data/ruth-web.json";
import {
  RUTH_CHAPTER_VERSE_COUNTS,
  RUTH_TOTAL_VERSES,
  WEB_TRANSLATION,
  makeOsisRef,
  makeVerseKey,
} from "@/lib/scripture/constants";
import {
  assertRuthCorpusShape,
  assertWebMetadataShape,
} from "@/lib/scripture/corpus";
import { parseRuthUsfm } from "@/lib/scripture/usfm";
import { describe, expect, it } from "vitest";

describe("WEB Ruth corpus", () => {
  it("keeps WEB metadata publishable and public-domain", () => {
    expect(WEB_TRANSLATION).toMatchObject({
      key: "WEB",
      name: "World English Bible",
      licenseName: "Public Domain",
      canPublishText: true,
    });
    expect(() => assertWebMetadataShape()).not.toThrow();
  });

  it("uses stable verse identities", () => {
    expect(makeVerseKey(1, 16)).toBe("ruth.1.16");
    expect(makeOsisRef(1, 16)).toBe("Ruth.1.16");
  });

  it("contains all Ruth verses with expected chapter counts", () => {
    expect(seed.verses).toHaveLength(RUTH_TOTAL_VERSES);
    expect(() => assertRuthCorpusShape(seed.verses)).not.toThrow();

    for (const [chapter, expectedCount] of Object.entries(
      RUTH_CHAPTER_VERSE_COUNTS,
    )) {
      expect(
        seed.verses.filter(
          (verse) => verse.chapterNumber === Number(chapter),
        ).length,
      ).toBe(expectedCount);
    }
  });

  it("strips USFM word, paragraph, and footnote markup without rewriting verse text", () => {
    const [verse] = parseRuthUsfm(String.raw`\c 1
\v 1 \w Ruth|strong="H7327"\w* said,\f + \fr 1:1 \ft note\f* “Go.”
\p Then she stayed.`);

    expect(verse).toMatchObject({
      chapterNumber: 1,
      verseNumber: 1,
      verseKey: "ruth.1.1",
      osisRef: "Ruth.1.1",
      text: "Ruth said, “Go.” Then she stayed.",
    });
  });
});
