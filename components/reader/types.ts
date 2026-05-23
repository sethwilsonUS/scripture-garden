export type PublicNode = {
  _id: string;
  slug: string;
  nodeType:
    | "passage"
    | "person"
    | "place"
    | "group_lineage"
    | "thing_practice"
    | "theme_motif"
    | "external_stub";
  displayName: string;
  shortLabel: string;
  summary: string;
  boundaryNote: string | null;
  externalReference: string | null;
  displayOrder: number;
};

export type PublicPassage = {
  _id: string;
  slug: string;
  title: string;
  summary: string | null;
  kind: "chapter" | "section" | "stub";
  chapterNumber: number | null;
  sortOrder?: number;
};

export type PublicAnchor = {
  _id: string;
  anchorKind: "primary" | "mention" | "context" | "background";
  displayLabel: string;
  readerSurface: "detail_only" | "note";
  displayOrder: number;
  startVerseKey: string | null;
  endVerseKey: string | null;
  passage: PublicPassage;
  node: PublicNode;
};

export type PublicTextLink = {
  _id: string;
  anchorKind: PublicAnchor["anchorKind"];
  displayLabel: string;
  linkedText: string;
  startOffset: number;
  endOffset: number;
  contextLabel: string | null;
  displayOrder: number;
  verseKey: string;
  passage: PublicPassage;
  node: PublicNode;
};

export type PublicRelationship = {
  _id: string;
  relationshipTypeKey:
    | "appears_in"
    | "alias_of"
    | "kinship"
    | "located_in"
    | "movement"
    | "associated_with"
    | "linked_passage"
    | "cross_book_stub_link"
    | "thematic_resonance";
  evidenceClass: "textual" | "contextual" | "editorial";
  publicLabel: string;
  rationale: string;
  displayOrder: number;
  sourceNode: PublicNode;
  targetNode: PublicNode;
  sourcePassage: PublicPassage | null;
  targetPassage: PublicPassage | null;
};

export type ReaderChapterData = {
  translation: {
    key: string;
    name: string;
    licenseName: string;
    licenseNote: string;
    sourceUrl: string;
    detailsUrl: string | null;
  };
  book: {
    displayName: string;
    chapterCount: number;
  };
  chapter: {
    number: number;
    title: string;
    previous: number | null;
    next: number | null;
  };
  passages: PublicPassage[];
  verses: Array<{
    _id: string;
    verseKey: string;
    osisRef: string;
    chapterNumber: number;
    verseNumber: number;
    text: string;
  }>;
  anchors: PublicAnchor[];
  textLinks: PublicTextLink[];
  relationships: PublicRelationship[];
};

export type NodeDetailData = {
  node: PublicNode;
  anchors: Array<{
    _id: string;
    anchorKind: PublicAnchor["anchorKind"];
    displayLabel: string;
    displayOrder: number;
    passage: PublicPassage;
    startVerseKey: string | null;
    endVerseKey: string | null;
  }>;
  relationships: PublicRelationship[];
};
