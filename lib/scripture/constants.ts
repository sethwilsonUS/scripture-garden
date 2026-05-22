export const WEB_SOURCE_URL = "https://ebible.org/Scriptures/engwebp_usfm.zip";
export const WEB_DETAILS_URL = "https://ebible.org/details.php?id=engwebp";
export const WEB_SOURCE_FILE = "09-RUTengwebp.usfm";

export const WEB_TRANSLATION = {
  key: "WEB",
  name: "World English Bible",
  languageCode: "en",
  sourceUrl: WEB_SOURCE_URL,
  detailsUrl: WEB_DETAILS_URL,
  sourceFile: WEB_SOURCE_FILE,
  licenseName: "Public Domain",
  licenseNote:
    "World English Bible text is public domain. Source imported from eBible.org.",
  canPublishText: true,
  status: "active",
} as const;

export const RUTH_CHAPTER_VERSE_COUNTS = {
  1: 22,
  2: 23,
  3: 18,
  4: 22,
} as const;

export const RUTH_TOTAL_VERSES = Object.values(RUTH_CHAPTER_VERSE_COUNTS).reduce(
  (total, count) => total + count,
  0,
);

export type RuthChapterNumber = keyof typeof RUTH_CHAPTER_VERSE_COUNTS;

export function makeVerseKey(chapterNumber: number, verseNumber: number) {
  return `ruth.${chapterNumber}.${verseNumber}`;
}

export function makeOsisRef(chapterNumber: number, verseNumber: number) {
  return `Ruth.${chapterNumber}.${verseNumber}`;
}
