import seed from "../data/ruth-web.json" with { type: "json" };
import {
  assertRuthCorpusShape,
  assertWebMetadataShape,
} from "../lib/scripture/corpus.ts";

assertWebMetadataShape();
assertRuthCorpusShape(seed.verses);

const byChapter = seed.verses.reduce((counts, verse) => {
  counts[verse.chapterNumber] = (counts[verse.chapterNumber] ?? 0) + 1;
  return counts;
}, {});

console.log(
  `PASS Ruth WEB corpus: ${seed.verses.length} verses (${Object.entries(
    byChapter,
  )
    .map(([chapter, count]) => `${chapter}:${count}`)
    .join(", ")})`,
);
