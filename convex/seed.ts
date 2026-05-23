/* eslint-disable @typescript-eslint/no-explicit-any */
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAdminSecret } from "./model";
import { ruthWebSeed } from "./seedData/ruthWeb";
import { resolveLinkedTextOffsets } from "./textLinks";

const RUTH_BOOK = {
  canonKey: "ruth",
  osisId: "Ruth",
  displayName: "Ruth",
  chapterCount: 4,
  curatedScope: "full" as const,
  sortOrder: 8,
};

const chapterPassages = [
  ["ruth-1", "Ruth 1", "Loss, loyalty, and the long road back to Bethlehem.", 1, 1, 22],
  ["ruth-2", "Ruth 2", "Ruth enters the fields and finds unexpected kindness.", 2, 1, 23],
  ["ruth-3", "Ruth 3", "A nighttime request rests on courage, wisdom, and care.", 3, 1, 18],
  ["ruth-4", "Ruth 4", "A public act of redemption opens toward a larger family story.", 4, 1, 22],
] as const;

const sectionPassages = [
  ["ruth-1-1-5", "Famine and Loss", "A Bethlehem family leaves for Moab, where grief narrows Naomi's world.", 1, 1, 5],
  ["ruth-1-16-17", "Ruth Clings to Naomi", "Ruth binds her path to Naomi with language of people, place, and God.", 1, 16, 17],
  ["ruth-2-1-13", "Ruth Meets Boaz", "Ruth enters Boaz's field and receives unexpected protection.", 2, 1, 13],
  ["ruth-2-14-23", "Provision in the Field", "Boaz's generosity and Naomi's recognition turn gleaning into a path of hope.", 2, 14, 23],
  ["ruth-3-1-13", "At the Threshing Floor", "Ruth asks Boaz to act as redeemer, and Boaz answers with care.", 3, 1, 13],
  ["ruth-4-1-12", "Redemption at the Gate", "Boaz completes the public act of redemption at Bethlehem's gate.", 4, 1, 12],
  ["ruth-4-13-22", "A Line Toward David", "Ruth and Boaz become part of the family line that leads toward David.", 4, 13, 22],
] as const;

const nodeSeeds = [
  {
    slug: "ruth",
    nodeType: "person",
    displayName: "Ruth",
    shortLabel: "Ruth",
    summary:
      "A Moabite widow who binds herself to Naomi and becomes central to the story's movement from loss toward provision.",
    displayOrder: 10,
  },
  {
    slug: "naomi",
    nodeType: "person",
    displayName: "Naomi",
    shortLabel: "Naomi",
    summary:
      "Ruth's mother-in-law, whose grief and return to Bethlehem shape the opening path of the book.",
    displayOrder: 20,
  },
  {
    slug: "boaz",
    nodeType: "person",
    displayName: "Boaz",
    shortLabel: "Boaz",
    summary:
      "A Bethlehem landowner and near kinsman who protects Ruth and acts publicly to redeem Naomi's family line.",
    displayOrder: 30,
  },
  {
    slug: "orpah",
    nodeType: "person",
    displayName: "Orpah",
    shortLabel: "Orpah",
    summary:
      "Naomi's daughter-in-law who turns back to Moab after Naomi urges both women to return home.",
    displayOrder: 40,
  },
  {
    slug: "bethlehem",
    nodeType: "place",
    displayName: "Bethlehem",
    shortLabel: "Bethlehem",
    summary:
      "The Judahite town Naomi leaves in famine and returns to at the beginning of barley harvest.",
    displayOrder: 50,
  },
  {
    slug: "moab",
    nodeType: "place",
    displayName: "Moab",
    shortLabel: "Moab",
    summary:
      "The country where Naomi's family sojourns and where Ruth enters the story as a Moabite widow.",
    displayOrder: 60,
  },
  {
    slug: "gleaning",
    nodeType: "thing_practice",
    displayName: "Gleaning",
    shortLabel: "Gleaning",
    summary:
      "The harvest practice Ruth uses to seek food and favor in Boaz's field.",
    displayOrder: 70,
  },
  {
    slug: "threshing-floor",
    nodeType: "thing_practice",
    displayName: "Threshing Floor",
    shortLabel: "Threshing floor",
    summary:
      "The nighttime setting where Ruth asks Boaz to spread his garment over her as a redeemer.",
    displayOrder: 80,
  },
  {
    slug: "redemption-custom",
    nodeType: "thing_practice",
    displayName: "Redemption Custom",
    shortLabel: "Redemption",
    summary:
      "The public family obligation Boaz takes up at the city gate in Ruth 4.",
    displayOrder: 90,
  },
  {
    slug: "return",
    nodeType: "theme_motif",
    displayName: "Return",
    shortLabel: "Return",
    summary:
      "A repeated movement in Ruth 1 that traces Naomi's grief and Ruth's chosen loyalty.",
    displayOrder: 100,
  },
  {
    slug: "gleaning-law-stub",
    nodeType: "external_stub",
    displayName: "Gleaning Laws",
    shortLabel: "Gleaning laws",
    summary:
      "A nearby reference for the law that leaves harvest edges for vulnerable neighbors.",
    externalReference: "Leviticus 19:9-10; Deuteronomy 24:19-22",
    boundaryNote:
      "This path steps outside Ruth for a moment so the field scene has a little more light around it.",
    displayOrder: 110,
  },
  {
    slug: "david-lineage-stub",
    nodeType: "external_stub",
    displayName: "Line Toward David",
    shortLabel: "Line toward David",
    summary:
      "A nearby reference for the genealogy at the end of Ruth that points toward David.",
    externalReference: "Ruth 4:17-22",
    boundaryNote:
      "This path stays close to Ruth's closing genealogy and does not try to follow every later branch.",
    displayOrder: 120,
  },
  {
    slug: "matthew-genealogy-stub",
    nodeType: "external_stub",
    displayName: "Matthew's Genealogy",
    shortLabel: "Matthew 1",
    summary:
      "A nearby reference for the later genealogy where Ruth and Boaz are named in Matthew 1.",
    externalReference: "Matthew 1:5-6",
    boundaryNote:
      "This path only points to the later mention; the garden is still rooted here in Ruth.",
    displayOrder: 130,
  },
] as const;

const anchorSeeds = [
  ["ruth", "ruth-1-16-17", "primary", "Ruth's commitment", "ruth.1.16", "ruth.1.17", 10],
  ["ruth", "ruth-2-1-13", "primary", "Ruth enters Boaz's field", "ruth.2.2", "ruth.2.13", 20],
  ["ruth", "ruth-3-1-13", "primary", "Ruth at the threshing floor", "ruth.3.6", "ruth.3.13", 30],
  ["ruth", "ruth-4-13-22", "primary", "Ruth in the family line", "ruth.4.13", "ruth.4.17", 40],
  ["naomi", "ruth-1-1-5", "primary", "Naomi's loss", "ruth.1.2", "ruth.1.5", 10],
  ["naomi", "ruth-1-16-17", "primary", "Ruth clings to Naomi", "ruth.1.16", "ruth.1.17", 20],
  ["boaz", "ruth-2-1-13", "primary", "Boaz meets Ruth", "ruth.2.1", "ruth.2.13", 10],
  ["boaz", "ruth-4-1-12", "primary", "Boaz redeems at the gate", "ruth.4.1", "ruth.4.12", 20],
  ["orpah", "ruth-1-16-17", "mention", "Orpah turns back", "ruth.1.14", "ruth.1.15", 10],
  ["bethlehem", "ruth-1", "primary", "Return to Bethlehem", "ruth.1.19", "ruth.1.22", 10],
  ["bethlehem", "ruth-4-1-12", "context", "Public gate scene", "ruth.4.1", "ruth.4.12", 20],
  ["moab", "ruth-1-1-5", "primary", "Sojourn in Moab", "ruth.1.1", "ruth.1.5", 10],
  ["gleaning", "ruth-2-1-13", "primary", "Ruth asks to glean", "ruth.2.2", "ruth.2.3", 10],
  ["gleaning", "ruth-2-14-23", "context", "Provision through gleaning", "ruth.2.15", "ruth.2.23", 20],
  ["threshing-floor", "ruth-3-1-13", "primary", "Threshing floor request", "ruth.3.6", "ruth.3.13", 10],
  ["redemption-custom", "ruth-4-1-12", "primary", "Redeemer at the gate", "ruth.4.1", "ruth.4.12", 10],
  ["return", "ruth-1", "primary", "Returning from Moab", "ruth.1.6", "ruth.1.22", 10],
  ["gleaning-law-stub", "ruth-2-1-13", "background", "Law behind the field edge", "ruth.2.2", "ruth.2.3", 10],
  ["david-lineage-stub", "ruth-4-13-22", "background", "Genealogy toward David", "ruth.4.17", "ruth.4.22", 10],
  ["matthew-genealogy-stub", "ruth-4-13-22", "background", "Ruth and Boaz named later", "ruth.4.17", "ruth.4.22", 20],
] as const;

const textLinkSeeds = [
  ["bethlehem", "ruth-1", "ruth.1.1", "Bethlehem Judah", 1, "primary", "Bethlehem Judah", undefined, 1010],
  ["moab", "ruth-1", "ruth.1.1", "Moab", 1, "primary", "Moab", undefined, 1020],
  ["naomi", "ruth-1", "ruth.1.2", "Naomi", 1, "primary", "Naomi", undefined, 1030],
  ["bethlehem", "ruth-1", "ruth.1.2", "Bethlehem Judah", 1, "primary", "Bethlehem Judah", undefined, 1040],
  ["moab", "ruth-1", "ruth.1.2", "Moab", 1, "primary", "Moab", undefined, 1050],
  ["naomi", "ruth-1", "ruth.1.3", "Naomi", 1, "context", "Naomi", undefined, 1060],
  ["moab", "ruth-1", "ruth.1.4", "Moab", 1, "primary", "Moab", undefined, 1070],
  ["orpah", "ruth-1", "ruth.1.4", "Orpah", 1, "mention", "Orpah", undefined, 1080],
  ["ruth", "ruth-1", "ruth.1.4", "Ruth", 1, "primary", "Ruth", undefined, 1090],
  ["naomi", "ruth-1", "ruth.1.6", "she", 1, "context", "Naomi", "Naomi", 1100],
  ["moab", "ruth-1", "ruth.1.6", "Moab", 1, "primary", "Moab", undefined, 1110],
  ["moab", "ruth-1", "ruth.1.6", "Moab", 2, "context", "Moab", undefined, 1120],
  ["naomi", "ruth-1", "ruth.1.8", "Naomi", 1, "primary", "Naomi", undefined, 1130],
  ["naomi", "ruth-1", "ruth.1.11", "Naomi", 1, "primary", "Naomi", undefined, 1140],
  ["orpah", "ruth-1", "ruth.1.14", "Orpah", 1, "mention", "Orpah", undefined, 1150],
  ["naomi", "ruth-1", "ruth.1.14", "her", 2, "context", "Naomi", "Naomi", 1160],
  ["ruth", "ruth-1", "ruth.1.14", "Ruth", 1, "primary", "Ruth", undefined, 1170],
  ["ruth", "ruth-1", "ruth.1.16", "Ruth", 1, "primary", "Ruth", undefined, 1180],
  ["naomi", "ruth-1", "ruth.1.18", "Naomi", 1, "primary", "Naomi", undefined, 1190],
  ["bethlehem", "ruth-1", "ruth.1.19", "Bethlehem", 1, "primary", "Bethlehem", undefined, 1200],
  ["naomi", "ruth-1", "ruth.1.19", "Naomi", 1, "primary", "Naomi", undefined, 1210],
  ["naomi", "ruth-1", "ruth.1.20", "Naomi", 1, "primary", "Naomi", undefined, 1220],
  ["naomi", "ruth-1", "ruth.1.21", "Naomi", 1, "primary", "Naomi", undefined, 1230],
  ["naomi", "ruth-1", "ruth.1.22", "Naomi", 1, "primary", "Naomi", undefined, 1240],
  ["ruth", "ruth-1", "ruth.1.22", "Ruth the Moabitess", 1, "primary", "Ruth the Moabitess", "Ruth", 1250],
  ["moab", "ruth-1", "ruth.1.22", "Moab", 1, "primary", "Moab", undefined, 1260],
  ["bethlehem", "ruth-1", "ruth.1.22", "Bethlehem", 1, "primary", "Bethlehem", undefined, 1270],
  ["naomi", "ruth-2", "ruth.2.1", "Naomi", 1, "primary", "Naomi", undefined, 2010],
  ["boaz", "ruth-2", "ruth.2.1", "Boaz", 1, "primary", "Boaz", undefined, 2020],
  ["ruth", "ruth-2", "ruth.2.2", "Ruth the Moabitess", 1, "primary", "Ruth the Moabitess", "Ruth", 2030],
  ["naomi", "ruth-2", "ruth.2.2", "Naomi", 1, "primary", "Naomi", undefined, 2040],
  ["gleaning", "ruth-2", "ruth.2.2", "glean", 1, "primary", "glean", "Gleaning", 2050],
  ["ruth", "ruth-2", "ruth.2.3", "She", 1, "context", "Ruth", "Ruth", 2060],
  ["gleaning", "ruth-2", "ruth.2.3", "gleaned", 1, "primary", "gleaned", "Gleaning", 2070],
  ["boaz", "ruth-2", "ruth.2.3", "Boaz", 1, "primary", "Boaz", undefined, 2080],
  ["boaz", "ruth-2", "ruth.2.4", "Boaz", 1, "primary", "Boaz", undefined, 2090],
  ["bethlehem", "ruth-2", "ruth.2.4", "Bethlehem", 1, "context", "Bethlehem", undefined, 2100],
  ["boaz", "ruth-2", "ruth.2.5", "Boaz", 1, "primary", "Boaz", undefined, 2110],
  ["ruth", "ruth-2", "ruth.2.6", "Moabite lady", 1, "context", "Moabite lady", "Ruth", 2120],
  ["naomi", "ruth-2", "ruth.2.6", "Naomi", 1, "primary", "Naomi", undefined, 2130],
  ["moab", "ruth-2", "ruth.2.6", "Moab", 1, "context", "Moab", undefined, 2140],
  ["gleaning", "ruth-2", "ruth.2.7", "glean", 1, "primary", "glean", "Gleaning", 2150],
  ["boaz", "ruth-2", "ruth.2.8", "Boaz", 1, "primary", "Boaz", undefined, 2160],
  ["ruth", "ruth-2", "ruth.2.8", "Ruth", 1, "primary", "Ruth", undefined, 2170],
  ["boaz", "ruth-2", "ruth.2.11", "Boaz", 1, "primary", "Boaz", undefined, 2180],
  ["boaz", "ruth-2", "ruth.2.14", "Boaz", 1, "primary", "Boaz", undefined, 2190],
  ["gleaning", "ruth-2", "ruth.2.15", "glean", 1, "primary", "glean", "Gleaning", 2200],
  ["boaz", "ruth-2", "ruth.2.15", "Boaz", 1, "primary", "Boaz", undefined, 2210],
  ["gleaning", "ruth-2", "ruth.2.17", "gleaned", 1, "primary", "gleaned", "Gleaning", 2220],
  ["boaz", "ruth-2", "ruth.2.19", "Boaz", 1, "primary", "Boaz", undefined, 2230],
  ["naomi", "ruth-2", "ruth.2.20", "Naomi", 1, "primary", "Naomi", undefined, 2240],
  ["ruth", "ruth-2", "ruth.2.21", "Ruth the Moabitess", 1, "primary", "Ruth the Moabitess", "Ruth", 2250],
  ["naomi", "ruth-2", "ruth.2.22", "Naomi", 1, "primary", "Naomi", undefined, 2260],
  ["ruth", "ruth-2", "ruth.2.22", "Ruth", 1, "primary", "Ruth", undefined, 2270],
  ["boaz", "ruth-2", "ruth.2.23", "Boaz", 1, "primary", "Boaz", undefined, 2280],
  ["gleaning", "ruth-2", "ruth.2.23", "glean", 1, "primary", "glean", "Gleaning", 2290],
  ["naomi", "ruth-3", "ruth.3.1", "Naomi", 1, "primary", "Naomi", undefined, 3010],
  ["boaz", "ruth-3", "ruth.3.2", "Boaz", 1, "primary", "Boaz", undefined, 3020],
  ["threshing-floor", "ruth-3", "ruth.3.2", "threshing floor", 1, "primary", "threshing floor", undefined, 3030],
  ["threshing-floor", "ruth-3", "ruth.3.3", "threshing floor", 1, "primary", "threshing floor", undefined, 3040],
  ["ruth", "ruth-3", "ruth.3.6", "She", 1, "context", "Ruth", "Ruth", 3050],
  ["threshing-floor", "ruth-3", "ruth.3.6", "threshing floor", 1, "primary", "threshing floor", undefined, 3060],
  ["boaz", "ruth-3", "ruth.3.7", "Boaz", 1, "primary", "Boaz", undefined, 3070],
  ["ruth", "ruth-3", "ruth.3.7", "She", 1, "context", "Ruth", "Ruth", 3080],
  ["ruth", "ruth-3", "ruth.3.9", "Ruth", 1, "primary", "Ruth", undefined, 3090],
  ["redemption-custom", "ruth-3", "ruth.3.9", "near kinsman", 1, "context", "near kinsman", "Redemption custom", 3100],
  ["redemption-custom", "ruth-3", "ruth.3.12", "near kinsman", 1, "context", "near kinsman", "Redemption custom", 3110],
  ["redemption-custom", "ruth-3", "ruth.3.13", "kinsman", 1, "context", "kinsman", "Redemption custom", 3120],
  ["threshing-floor", "ruth-3", "ruth.3.14", "threshing floor", 1, "primary", "threshing floor", undefined, 3130],
  ["naomi", "ruth-3", "ruth.3.16", "mother-in-law", 1, "context", "mother-in-law", "Naomi", 3140],
  ["boaz", "ruth-3", "ruth.3.18", "the man", 1, "context", "the man", "Boaz", 3150],
  ["boaz", "ruth-4", "ruth.4.1", "Boaz", 1, "primary", "Boaz", undefined, 4010],
  ["redemption-custom", "ruth-4", "ruth.4.1", "near kinsman", 1, "context", "near kinsman", "Redemption custom", 4020],
  ["naomi", "ruth-4", "ruth.4.3", "Naomi", 1, "primary", "Naomi", undefined, 4030],
  ["moab", "ruth-4", "ruth.4.3", "Moab", 1, "context", "Moab", undefined, 4040],
  ["redemption-custom", "ruth-4", "ruth.4.4", "redeem", 1, "primary", "redeem", "Redemption custom", 4050],
  ["boaz", "ruth-4", "ruth.4.5", "Boaz", 1, "primary", "Boaz", undefined, 4060],
  ["naomi", "ruth-4", "ruth.4.5", "Naomi", 1, "primary", "Naomi", undefined, 4070],
  ["ruth", "ruth-4", "ruth.4.5", "Ruth the Moabitess", 1, "primary", "Ruth the Moabitess", "Ruth", 4080],
  ["redemption-custom", "ruth-4", "ruth.4.6", "redemption", 1, "primary", "redemption", "Redemption custom", 4090],
  ["redemption-custom", "ruth-4", "ruth.4.7", "redeeming", 1, "primary", "redeeming", "Redemption custom", 4100],
  ["boaz", "ruth-4", "ruth.4.8", "Boaz", 1, "primary", "Boaz", undefined, 4110],
  ["boaz", "ruth-4", "ruth.4.9", "Boaz", 1, "primary", "Boaz", undefined, 4120],
  ["naomi", "ruth-4", "ruth.4.9", "Naomi", 1, "primary", "Naomi", undefined, 4130],
  ["ruth", "ruth-4", "ruth.4.10", "Ruth the Moabitess", 1, "primary", "Ruth the Moabitess", "Ruth", 4140],
  ["bethlehem", "ruth-4", "ruth.4.11", "Bethlehem", 1, "primary", "Bethlehem", undefined, 4150],
  ["boaz", "ruth-4", "ruth.4.13", "Boaz", 1, "primary", "Boaz", undefined, 4160],
  ["ruth", "ruth-4", "ruth.4.13", "Ruth", 1, "primary", "Ruth", undefined, 4170],
  ["naomi", "ruth-4", "ruth.4.14", "Naomi", 1, "primary", "Naomi", undefined, 4180],
  ["redemption-custom", "ruth-4", "ruth.4.14", "near kinsman", 1, "context", "near kinsman", "Redemption custom", 4190],
  ["naomi", "ruth-4", "ruth.4.16", "Naomi", 1, "primary", "Naomi", undefined, 4200],
  ["naomi", "ruth-4", "ruth.4.17", "Naomi", 1, "primary", "Naomi", undefined, 4210],
  ["david-lineage-stub", "ruth-4", "ruth.4.17", "David", 1, "background", "David", "Line toward David", 4220],
  ["boaz", "ruth-4", "ruth.4.21", "Boaz", 1, "primary", "Boaz", undefined, 4230],
  ["david-lineage-stub", "ruth-4", "ruth.4.22", "David", 1, "background", "David", "Line toward David", 4240],
] as const;

const relationshipSeeds = [
  ["ruth", "naomi", "associated_with", "textual", "clings to", "Ruth 1:16-17 directly records Ruth binding her path to Naomi.", "ruth-1-16-17", undefined, 10],
  ["ruth", "moab", "movement", "contextual", "comes from", "Ruth is repeatedly identified as the Moabitess who returns with Naomi.", "ruth-1-1-5", undefined, 20],
  ["naomi", "bethlehem", "movement", "contextual", "returns to", "Naomi returns to Bethlehem as the barley harvest begins.", "ruth-1", undefined, 30],
  ["ruth", "boaz", "associated_with", "contextual", "meets in the field of", "Ruth 2 brings Ruth into Boaz's field and protection.", "ruth-2-1-13", undefined, 40],
  ["ruth", "gleaning", "associated_with", "contextual", "seeks provision through", "Ruth asks to glean among the ears of grain in Ruth 2.", "ruth-2-1-13", undefined, 50],
  ["gleaning", "gleaning-law-stub", "cross_book_stub_link", "editorial", "has a law in the background", "Ruth's field scene carries echoes of harvest laws that leave room for the poor and the foreigner.", "ruth-2-1-13", undefined, 60],
  ["ruth", "threshing-floor", "associated_with", "contextual", "goes to", "Ruth 3 places Ruth at the threshing floor for a careful request.", "ruth-3-1-13", undefined, 70],
  ["boaz", "redemption-custom", "associated_with", "textual", "acts as redeemer through", "Ruth 4 explicitly shows Boaz taking up the redeemer role at the gate.", "ruth-4-1-12", undefined, 80],
  ["redemption-custom", "david-lineage-stub", "cross_book_stub_link", "editorial", "opens toward David's line", "Ruth 4's redemption scene leads directly into the genealogy ending with David.", "ruth-4-13-22", undefined, 90],
  ["david-lineage-stub", "matthew-genealogy-stub", "cross_book_stub_link", "editorial", "is echoed in", "Matthew 1 later names Boaz and Ruth in a genealogy.", "ruth-4-13-22", undefined, 100],
  ["boaz", "bethlehem", "located_in", "textual", "acts in", "Boaz's public redemption occurs in Bethlehem's gate scene.", "ruth-4-1-12", undefined, 110],
  ["ruth", "return", "thematic_resonance", "editorial", "embodies return with loyalty", "The repeated language of returning in Ruth 1 is given a human center in Ruth's decision to stay with Naomi.", "ruth-1", undefined, 120],
] as const;

async function getByIndex<T extends string>(
  ctx: { db: any },
  table: T,
  indexName: string,
  fieldName: string,
  value: string,
) {
  return await ctx.db
    .query(table)
    .withIndex(indexName, (q: any) => q.eq(fieldName, value))
    .first();
}

async function getVerseByKey(ctx: { db: any }, verseKey: string) {
  const verse = await getByIndex(ctx, "verses", "by_verseKey", "verseKey", verseKey);
  if (!verse) {
    throw new Error(`Missing verse ${verseKey}`);
  }
  return verse;
}

async function getPassageBySlug(ctx: { db: any }, slug: string) {
  const passage = await getByIndex(ctx, "passages", "by_slug", "slug", slug);
  if (!passage) {
    throw new Error(`Missing passage ${slug}`);
  }
  return passage;
}

async function getNodeBySlug(ctx: { db: any }, slug: string) {
  const node = await getByIndex(ctx, "nodes", "by_slug", "slug", slug);
  if (!node) {
    throw new Error(`Missing node ${slug}`);
  }
  return node;
}

async function getVerseTextForSeed(
  ctx: { db: any },
  verseId: string,
  translationId: string,
) {
  const verseText = await ctx.db
    .query("verseTexts")
    .withIndex("by_verse_translation", (q: any) =>
      q.eq("verseId", verseId).eq("translationId", translationId),
    )
    .first();

  if (!verseText) {
    throw new Error(`Missing verse text for ${verseId}`);
  }

  return verseText;
}

export const status = query({
  args: {},
  handler: async (ctx) => {
    return await collectSeedStatus(ctx);
  },
});

async function collectSeedStatus(ctx: { db: any }) {
  const translations = await ctx.db.query("translations").collect();
  const books = await ctx.db.query("books").collect();
  const verses = await ctx.db.query("verses").collect();
  const verseTexts = await ctx.db.query("verseTexts").collect();
  const passages = await ctx.db.query("passages").collect();
  const nodes = await ctx.db.query("nodes").collect();
  const nodeTextLinks = await ctx.db.query("nodeTextLinks").collect();
  const relationships = await ctx.db.query("relationships").collect();
  const approvals = await ctx.db.query("relationshipApprovals").collect();

  return {
    translations: translations.length,
    books: books.length,
    verses: verses.length,
    verseTexts: verseTexts.length,
    passages: passages.length,
    nodes: nodes.length,
    nodeTextLinks: nodeTextLinks.length,
    relationships: relationships.length,
    approvals: approvals.length,
  };
}

export const seedRuthMvp = mutation({
  args: {
    adminSecret: v.string(),
  },
  handler: async (ctx, args) => {
    requireAdminSecret(args.adminSecret);
    const now = Date.now();

    let adminUser = await getByIndex(
      ctx,
      "adminUsers",
      "by_authSubject",
      "authSubject",
      "system:initial-seed",
    );

    if (!adminUser) {
      const adminUserId = await ctx.db.insert("adminUsers", {
        authSubject: "system:initial-seed",
        email: "seed@scripture-garden.local",
        displayName: "Initial Seed Approval",
        role: "admin",
        status: "active",
        createdAt: now,
      });
      adminUser = await ctx.db.get(adminUserId);
    }

    let translation = await getByIndex(ctx, "translations", "by_key", "key", "WEB");
    if (!translation) {
      const translationId = await ctx.db.insert("translations", {
        ...ruthWebSeed.translation,
        sourceVersion: ruthWebSeed.importedAt,
        importedAt: Date.parse(ruthWebSeed.importedAt),
      });
      translation = await ctx.db.get(translationId);
    }

    let book = await getByIndex(ctx, "books", "by_canonKey", "canonKey", "ruth");
    if (!book) {
      const bookId = await ctx.db.insert("books", RUTH_BOOK);
      book = await ctx.db.get(bookId);
    }

    for (const seedVerse of ruthWebSeed.verses) {
      let verse = await getByIndex(
        ctx,
        "verses",
        "by_verseKey",
        "verseKey",
        seedVerse.verseKey,
      );

      if (!verse) {
        const verseId = await ctx.db.insert("verses", {
          verseKey: seedVerse.verseKey,
          osisRef: seedVerse.osisRef,
          bookId: book!._id,
          chapterNumber: seedVerse.chapterNumber,
          verseNumber: seedVerse.verseNumber,
        });
        verse = await ctx.db.get(verseId);
      }

      const existingText = await ctx.db
        .query("verseTexts")
        .withIndex("by_verse_translation", (q: any) =>
          q.eq("verseId", verse!._id).eq("translationId", translation!._id),
        )
        .first();

      if (!existingText) {
        await ctx.db.insert("verseTexts", {
          verseId: verse!._id,
          translationId: translation!._id,
          text: seedVerse.text,
          textVersion: ruthWebSeed.importedAt,
          licenseSnapshot: ruthWebSeed.translation.licenseNote,
          checksum: `${seedVerse.osisRef}:${seedVerse.text.length}`,
          status: "active",
        });
      }
    }

    let passageOrder = 10;
    for (const [slug, title, summary, chapter, startVerse, endVerse] of [
      ...chapterPassages,
      ...sectionPassages,
    ]) {
      const existing = await getByIndex(ctx, "passages", "by_slug", "slug", slug);
      if (existing) {
        await ctx.db.patch(existing._id, {
          title,
          summary,
          sortOrder: passageOrder,
        });
        passageOrder += 10;
        continue;
      }

      await ctx.db.insert("passages", {
        slug,
        title,
        summary,
        kind: slug === `ruth-${chapter}` ? "chapter" : "section",
        bookId: book!._id,
        startVerseId: (await getVerseByKey(ctx, `ruth.${chapter}.${startVerse}`))._id,
        endVerseId: (await getVerseByKey(ctx, `ruth.${chapter}.${endVerse}`))._id,
        chapterNumber: chapter,
        status: "published",
        publishedAt: now,
        sortOrder: passageOrder,
      });
      passageOrder += 10;
    }

    for (const seedNode of nodeSeeds) {
      let node = await getByIndex(ctx, "nodes", "by_slug", "slug", seedNode.slug);
      if (!node) {
        const nodeId = await ctx.db.insert("nodes", {
          ...seedNode,
          status: "published",
          isPublic: true,
          publishedAt: now,
          createdAt: now,
          updatedAt: now,
          createdByAdminUserId: adminUser!._id,
        });
        node = await ctx.db.get(nodeId);
      } else {
        await ctx.db.patch(node._id, {
          ...seedNode,
          updatedAt: now,
        });
        node = await ctx.db.get(node._id);
      }

      const primaryAlias = await ctx.db
        .query("nodeAliases")
        .withIndex("by_primaryAlias", (q: any) =>
          q.eq("nodeId", node!._id).eq("locale", "en-US").eq("isPrimary", true),
        )
        .first();

      if (!primaryAlias) {
        await ctx.db.insert("nodeAliases", {
          nodeId: node!._id,
          alias: seedNode.displayName,
          normalizedAlias: seedNode.displayName.toLowerCase(),
          locale: "en-US",
          aliasType: "display",
          isPrimary: true,
        });
      }
    }

    for (const [
      nodeSlug,
      passageSlug,
      kind,
      displayLabel,
      startVerseKey,
      endVerseKey,
      displayOrder,
    ] of anchorSeeds) {
      const node = await getNodeBySlug(ctx, nodeSlug);
      const passage = await getPassageBySlug(ctx, passageSlug);
      const surface = [
        "return",
        "gleaning-law-stub",
        "david-lineage-stub",
        "matthew-genealogy-stub",
      ].includes(nodeSlug)
        ? "note"
        : "detail_only";
      const existing = await ctx.db
        .query("nodePassageAnchors")
        .withIndex("by_node_passage", (q: any) =>
          q.eq("nodeId", node._id).eq("passageId", passage._id),
        )
        .first();

      if (!existing) {
        await ctx.db.insert("nodePassageAnchors", {
          nodeId: node._id,
          passageId: passage._id,
          startVerseId: (await getVerseByKey(ctx, startVerseKey))._id,
          endVerseId: (await getVerseByKey(ctx, endVerseKey))._id,
          anchorKind: kind,
          displayLabel,
          readerSurface: surface,
          strength: 4,
          displayOrder,
        });
      } else {
        await ctx.db.patch(existing._id, {
          anchorKind: kind,
          displayLabel,
          startVerseId: (await getVerseByKey(ctx, startVerseKey))._id,
          endVerseId: (await getVerseByKey(ctx, endVerseKey))._id,
          strength: 4,
          readerSurface: surface,
          displayOrder,
        });
      }
    }

    for (const [
      nodeSlug,
      passageSlug,
      verseKey,
      linkedText,
      occurrenceNumber,
      kind,
      displayLabel,
      contextLabel,
      displayOrder,
    ] of textLinkSeeds) {
      const node = await getNodeBySlug(ctx, nodeSlug);
      const passage = await getPassageBySlug(ctx, passageSlug);
      const verse = await getVerseByKey(ctx, verseKey);
      const verseText = await getVerseTextForSeed(
        ctx,
        verse._id,
        translation!._id,
      );
      const offsets = resolveLinkedTextOffsets({
        text: verseText.text,
        linkedText,
        occurrenceNumber,
      });

      if (!offsets) {
        throw new Error(
          `Could not seed text link "${linkedText}" occurrence ${occurrenceNumber} in ${verseKey}.`,
        );
      }

      const existingLinks = await ctx.db
        .query("nodeTextLinks")
        .withIndex("by_node_verse", (q: any) =>
          q.eq("nodeId", node._id).eq("verseId", verse._id),
        )
        .collect();
      const existing = existingLinks.find(
        (link: any) =>
          link.startOffset === offsets.startOffset &&
          link.endOffset === offsets.endOffset,
      );
      const nextTextLink = {
        nodeId: node._id,
        passageId: passage._id,
        verseId: verse._id,
        anchorKind: kind,
        displayLabel,
        linkedText,
        startOffset: offsets.startOffset,
        endOffset: offsets.endOffset,
        contextLabel,
        displayOrder,
      };

      if (!existing) {
        await ctx.db.insert("nodeTextLinks", nextTextLink);
      } else {
        await ctx.db.patch(existing._id, nextTextLink);
      }
    }

    for (const [
      sourceSlug,
      targetSlug,
      relationshipType,
      evidence,
      label,
      rationale,
      sourcePassageSlug,
      targetPassageSlug,
      displayOrder,
    ] of relationshipSeeds) {
      const sourceNode = await getNodeBySlug(ctx, sourceSlug);
      const targetNode = await getNodeBySlug(ctx, targetSlug);
      const existing = await ctx.db
        .query("relationships")
        .withIndex("by_source", (q: any) => q.eq("sourceNodeId", sourceNode._id))
        .filter((q: any) =>
          q.and(
            q.eq(q.field("targetNodeId"), targetNode._id),
            q.eq(q.field("relationshipTypeKey"), relationshipType),
          ),
        )
        .first();

      if (existing) {
        await ctx.db.patch(existing._id, {
          evidenceClass: evidence,
          publicLabel: label,
          rationale,
          sourcePassageId: sourcePassageSlug
            ? (await getPassageBySlug(ctx, sourcePassageSlug))._id
            : undefined,
          targetPassageId: targetPassageSlug
            ? (await getPassageBySlug(ctx, targetPassageSlug))._id
            : undefined,
          updatedAt: now,
          displayOrder,
        });

        if (existing.currentApprovalId) {
          await ctx.db.patch(existing.currentApprovalId, {
            evidenceSummary: rationale,
          });
        }
        continue;
      }

      const relationshipId = await ctx.db.insert("relationships", {
        sourceNodeId: sourceNode._id,
        targetNodeId: targetNode._id,
        relationshipTypeKey: relationshipType,
        evidenceClass: evidence,
        publicLabel: label,
        rationale,
        sourcePassageId: sourcePassageSlug
          ? (await getPassageBySlug(ctx, sourcePassageSlug))._id
          : undefined,
        targetPassageId: targetPassageSlug
          ? (await getPassageBySlug(ctx, targetPassageSlug))._id
          : undefined,
        approvalStatus: "approved",
        isPublic: false,
        createdAt: now,
        updatedAt: now,
        displayOrder,
      });

      const approvalId = await ctx.db.insert("relationshipApprovals", {
        relationshipId,
        decision: "approved",
        decidedByAdminUserId: adminUser!._id,
        decidedAt: now,
        rationale: "Initial conservative seed approved by the project owner.",
        evidenceSummary: rationale,
        version: 1,
      });

      await ctx.db.patch(relationshipId, {
        approvalStatus: "published",
        currentApprovalId: approvalId,
        isPublic: true,
        publishedAt: now,
      });
    }

    const existingSuggestion = await ctx.db
      .query("aiSuggestions")
      .withIndex("by_reviewStatus", (q: any) => q.eq("reviewStatus", "suggested"))
      .first();

    if (!existingSuggestion) {
      await ctx.db.insert("aiSuggestions", {
        suggestionType: "relationship",
        targetTable: "relationships",
        candidatePayloadJson: JSON.stringify({
          sourceNodeSlug: "ruth",
          targetNodeSlug: "return",
          note: "Seed example only. AI suggestions remain internal.",
        }),
        modelProvider: "seed",
        modelName: "manual-placeholder",
        promptVersion: "seed-v1",
        sourceRefKeys: ["ruth.1.6", "ruth.1.16", "ruth.1.22"],
        reviewStatus: "suggested",
        publishBlocked: true,
        createdAt: now,
      });
    }

    await ctx.db.insert("auditLog", {
      actorType: "system",
      actorAdminUserId: adminUser!._id,
      action: "seed_ruth_mvp",
      targetTable: "books",
      targetId: book!._id,
      afterJson: JSON.stringify(await collectSeedStatus(ctx)),
      occurredAt: now,
    });

    return await collectSeedStatus(ctx);
  },
});
