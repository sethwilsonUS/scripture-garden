# PRD.md

> This PRD operationalizes the Ruth-first manifesto constraints supplied in the brief and is intended to be reconciled against `MASTER_PROJECT_MANIFEST.md` before implementation freeze. The technical and accessibility assumptions below also align with adjacent project materials in the current file library that favor focused, accessibility-first builds on Next.js, TypeScript, Tailwind, and Convex, with WCAG 2.2 AA as the baseline accessibility target. fileciteturn9file2 fileciteturn10file5

## Product overview

Hyperlink Bible / Semantic Scripture is a handcrafted Scripture exploration product. The MVP is a Ruth-first reading and discovery environment where a reader begins in Ruth and follows a small, human-curated semantic layer across people, places, things, practices, themes, and passage links.

The product is **not** an answer engine. It is a traversable Scripture environment. The central experience is not “ask a question and get a summary,” but “start in Ruth, click into the text, and discover how Scripture opens relationally.”

The MVP should feel:

- traversable rather than searchable,
- exploratory rather than task-oriented,
- delightful rather than productivity-focused,
- handcrafted rather than AI-generated,
- editorially trustworthy rather than algorithmically mysterious.

The first magic moment is specific and non-negotiable: a reader begins in Ruth, opens a person/place/thing connection, follows one or more approved pathways, and experiences Scripture as alive, connected, and explorable.

## Mission and product promise

### Mission

Help people quench their thirst for Biblical connection through exploration, curiosity, and discovery.

### Product promise

The product promises that a reader can:

- begin in Scripture, not in a blank chatbot box;
- move through meaningful connections, not generic “related content” guesses;
- trust that public semantic relationships were approved by a human editor;
- explore without getting lost, overwhelmed, or preached at by software;
- read and discover in an interface that is calm, accessible, and mobile-friendly.

### Product posture

The MVP must keep a narrow and stable posture:

- **Scripture-first**: the text remains the center of gravity.
- **Editorially visible**: the product should feel authored and cared for.
- **Small on purpose**: build the first well-made gate into Ruth before trying to raise Minas Tirith around the whole canon.
- **Interpretively honest**: the app may surface editorial judgments, but it may not disguise them as unquestionable machine truth.

## Target users

### Primary readers

The core reader is a person who wants to explore Scripture relationally rather than consume pre-packaged doctrinal output. This includes:

- curious Bible readers who like following names, places, and motifs;
- students and teachers who want to discover connections organically;
- readers who are more energized by movement and discovery than by top-down study tools;
- people who want Scripture to feel inhabited and interconnected, not flat.

### Accessibility-first readers

Accessibility is not a side audience. It is a core audience. The MVP should explicitly serve readers who need:

- keyboard-first navigation,
- screen reader compatibility,
- predictable focus behavior,
- low visual clutter,
- larger tap targets,
- reduced eye strain,
- calmer reading surfaces on mobile.

### Secondary internal users

The secondary user is the editor or curator who authors the semantic layer. This user needs a lightweight internal workbench to:

- create and revise nodes,
- tag Ruth content,
- approve or reject semantic relationships,
- create cross-book stubs,
- preview public output,
- review AI suggestions without letting AI publish anything.

### Users this MVP is not for

This MVP is not designed primarily for:

- users seeking instant doctrinal answers,
- users wanting sermon generation,
- pastors looking for an AI theologian,
- organizations seeking church-management, CRM, or enterprise Bible software,
- users looking for a broad Christian productivity platform.

## MVP scope

### In scope

The MVP includes a **public reader** and an **editorial/admin workbench**.

#### Public reader

The public reader must include:

- a Ruth-first entry point;
- full MVP coverage of the book of Ruth;
- chapter and verse navigation for Ruth;
- editor-approved semantic overlays that let readers open people, places, things, practices, and limited themes;
- entity detail surfaces;
- passage-to-passage links within Ruth where approved;
- curated cross-book stubs where approved;
- backtracking, breadcrumbs, deep linking, and preserved reading context;
- mobile-responsive presentation;
- strong accessibility support;
- no required account for public reading.

#### Semantic layer

The semantic layer for MVP must include:

- typed public nodes;
- typed public relationships;
- editorial provenance and approval state;
- explicit distinction between direct textual facts and editorially interpretive links;
- limited cross-book connections through stubs, not a fully generalized Bible graph.

#### Editorial/workbench layer

The editor-facing workbench must include:

- node creation and editing,
- relationship creation and review,
- passage tagging,
- stub creation,
- draft/approved/published states,
- AI suggestion review,
- preview before publish,
- approval logging.

### Scope discipline rules

The MVP must remain intentionally small.

That means:

- Ruth is the only fully curated book in MVP.
- Cross-book material may appear only as approved stubs or carefully bounded linked passages.
- The public product should avoid generalized infrastructure that only becomes necessary at whole-Bible scale.
- Build for a handcrafted Ruth-first experience, not for theoretical future scale.

## Explicit non-goals

The following are out of scope for MVP and should be treated as explicit non-goals:

- a generic AI Bible chatbot;
- sermon generation;
- devotion, outline, or ministry-content generation;
- note-taking ecosystems;
- personal knowledge management features;
- church-management features;
- donor, member, or volunteer CRM features;
- a broad Christian SaaS suite;
- public social/community features;
- comments, likes, or collaborative annotation;
- marketplace/plugin architecture;
- generalized CMS abstraction;
- enterprise multi-tenant architecture;
- graph database adoption;
- automated theology generation;
- silent or automatic publication of semantic relationships;
- fully open-ended whole-Bible search or recommendation systems;
- a flashy graph canvas as the primary reading surface;
- any AI behavior that positions the system as pastor, theologian, or spiritual authority.

## Core user journeys

### First-time discovery from Ruth

A first-time reader lands in the product and is brought quickly into Ruth. They encounter the text clearly, notice a small number of meaningful interactive elements, open one, and discover a new entity or passage without losing their place.

**Acceptance outcome:** within a short first session, the reader can move from Ruth to at least one entity and at least one additional connected passage or stub without confusion.

### Organic exploration path

A reader opens a person, place, thing, or practice from Ruth and sees:

- who/what this is,
- where it appears in Ruth,
- what nearby approved pathways are available,
- why a deeper click matters.

The reader continues exploring, not because the product gave them a task list, but because the next path feels inviting.

**Acceptance outcome:** at least one three-step exploration path can begin from each Ruth chapter.

### Cross-book boundary traversal

A reader follows a Ruth-linked connection that leaves the fully curated Ruth space. The destination is presented as a stub or bounded external passage surface. The reader understands that they have crossed a boundary and can always return to Ruth cleanly.

**Acceptance outcome:** users are never surprised about whether they are inside Ruth-first curated territory or outside it.

### Editor creates and publishes a relationship

An editor creates or revises a node, links it to Ruth passages, adds relationship typing and rationale, previews the result, and publishes it. If AI suggested the relationship, approval still requires a human action.

**Acceptance outcome:** no public relationship can exist without an approval record.

### Accessible traversal

A keyboard-only or screen-reader user can traverse the same core path: enter Ruth, open a node, follow a connection, return, and continue reading.

**Acceptance outcome:** the first magic moment is not visually exclusive.

## Reader experience requirements

### Entry and wayfinding

The public experience must place Ruth at the center. Whether the landing surface is a Ruth overview page or a direct entry into Ruth 1 is open, but the user must be able to begin reading Ruth immediately.

The reader experience must provide:

- clear book/chapter/verse orientation,
- stable URLs for key states,
- breadcrumbs or equivalent wayfinding,
- a predictable back path,
- preserved scroll position when leaving and returning to a reading surface.

### Reading surface

The reading surface must prioritize legibility and calm. It should:

- present the text cleanly,
- avoid visual soup,
- use interaction sparingly,
- keep surrounding chrome minimal,
- allow the text to remain primary even when semantic overlays are active.

The UI must not hyperlink every possible noun. Visible semantic density should be selective and curated.

### Semantic overlays and interaction

The reading surface must support semantic interactions that are:

- explicit,
- intentional,
- human-approved,
- easy to reverse.

Requirements:

- Readers must be able to open entity or passage detail without losing reading position.
- There must be a way to reduce or hide semantic clutter, such as an overlay toggle or comparable display control.
- Different categories of interaction must be legible without relying on color alone.
- Hover-only affordances are not sufficient; mobile and keyboard users must have equivalent access.

### Panel and route behavior

Entity and stub detail may open in a side panel, sheet, or dedicated route, but the system must preserve accessibility and shareability.

Preferred behavior for MVP:

- desktop: route-backed side panel or detail view;
- mobile: route-backed full-screen sheet/page;
- all states deep-linkable;
- browser back/forward works naturally.

### Delight, not busywork

The reader experience should use invitational language rather than productivity language. Microcopy should sound like a good guide, not a dashboard. Avoid task framing such as “complete,” “optimize,” “finish,” or “boost.”

The product should feel like walking a path through a field, not filling out a workflow.

## Semantic exploration requirements

### Public relationship model

Every public semantic relationship must be:

- explicitly typed,
- attached to stable source and target nodes,
- approved by a human editor,
- represented honestly in the UI.

No public relationship may be:

- silently machine-generated,
- published without approval,
- presented without enough context to understand why it exists.

### Evidence classes

Each relationship must carry an evidence class so the UI and editors can distinguish kinds of meaning.

#### Textual

Directly grounded in the text itself.

Examples:
- a person appears in a passage,
- a place is named in a verse,
- a kinship relation is explicitly stated.

#### Contextual

Grounded in narrative or structural context.

Examples:
- a journey from one place to another,
- a thing/practice associated with a passage,
- a person linked to a location through the story.

#### Editorial

An interpretive or cross-book connection approved by an editor.

Examples:
- an editorially approved thematic resonance,
- a cross-book lineage pointer,
- a bounded canonical echo surfaced for exploration.

Editorial relationships must be visibly labeled as editorial or equivalent. They must never masquerade as direct textual facts.

### Relationship display rules

Public relationship displays must follow these rules:

- textual and contextual links may be shown more directly;
- editorial links must surface a short “why this is connected” explanation;
- any cross-book move must be clearly labeled;
- relationship ordering should be editorially controlled, not heavily algorithmic;
- relationship count alone is not the product; direction and meaning matter more than volume.

### No hidden theology

The product may aid discovery. It may not smuggle theology through invisible ranking, silent auto-linking, or autogenerated interpretive chains.

If a connection is interpretive, the product must say so.

## Ruth-first content requirements

### Canonical scope of the MVP

Ruth is the only fully curated book in the MVP.

This means the MVP must include:

- the full text of Ruth,
- chapter and verse structure for all four chapters,
- editor-approved semantic layers throughout the book,
- enough public nodes and relationships to produce real exploration, not a demo shell.

### Ruth coverage standard

Coverage is complete for MVP when:

- every Ruth chapter is available and readable;
- each chapter contains at least one meaningful exploration path;
- all public nodes are anchored to Ruth;
- there are no orphan public nodes with no Ruth presence;
- cross-book connections exist only where editorially justified by Ruth material.

### Editorial seeding priority

To keep scope disciplined, content should be seeded in this order:

- major people,
- major places,
- key things/practices,
- high-value groups/lineages,
- only then themes/motifs,
- only then cross-book stubs.

This prevents the MVP from becoming an abstract taxonomy project before it becomes a compelling reading product.

### Ruth-first quality bar

Each public node connected to Ruth should answer, at minimum:

- Who or what is this?
- Where does it appear in Ruth?
- Why does it matter in this reading context?
- Where can I go next?

Public summaries should be concise, clear, and human-authored or human-edited.

## Semantic stubs and cross-book boundary rules

### Definition of a stub

A semantic stub is a lightweight public node outside the fully curated Ruth scope. A stub may represent:

- a person,
- a place,
- a passage,
- a group or lineage,
- a theme or motif.

A stub is not a promise of whole-book coverage. It is a bounded doorway.

### Required contents of a stub

A public stub should contain only the minimum needed for trustworthy traversal:

- title,
- type,
- short summary,
- linked Ruth anchor or anchors,
- brief reason for connection,
- target passage reference or references,
- clear return path back into Ruth-first territory.

### Boundary rules

Cross-book boundary behavior must obey these rules:

- No outside-the-scope node may appear publicly without deliberate editorial approval.
- A reader must be told when they have crossed outside the fully curated Ruth space.
- A stub may link onward only where those onward links are also explicitly approved.
- Do not allow an uncontrolled cascade into a pseudo-global Bible graph.

### Expansion rule

Default MVP rule: **Ruth is full scope; anything outside Ruth is bounded scope**.

Practical implementation rule:

- Ruth nodes may link to stubs.
- Stubs may link back into Ruth.
- Stubs may expose additional onward links only if explicitly curated.
- Unlimited graph traversal across the canon is post-MVP.

### Licensing-aware behavior

If translation licensing or text rights for non-Ruth passages are unresolved, the stub may show:

- reference only,
- brief summary only,
- or limited approved excerpting,

rather than full destination passage text.

## Entity types and relationship types for MVP

### Public node types

| Public node type | Purpose in MVP | Examples in Ruth-first scope | Notes |
|---|---|---|---|
| Passage | Primary explorable reading unit | Ruth 1:1–5, Ruth 2:1–13 | Editor-defined grouping of one or more verses |
| Person | Personal and familial exploration | Ruth, Naomi, Boaz, Orpah | First-class public type |
| Place | Geographic and narrative orientation | Bethlehem, Moab | First-class public type |
| Group or lineage | Shared identity where editorially useful | Moabites, lineage-related nodes | Use sparingly |
| Thing or practice | Material or customary discovery | gleaning, threshing-floor context, redemption custom | Include only when it deepens exploration |
| Theme or motif | Curated abstract discovery | loyalty, return, provision, kinship, etc. | Use sparingly; do not over-abstract |
| External stub | Bounded out-of-scope doorway | cross-book passage/person/place stub | Not full-scope coverage |

### Relationship types

| Relationship type | Typical direction | Evidence class | Notes |
|---|---|---|---|
| appears_in | node ↔ passage | Textual | Basic presence relationship |
| alias_of | node ↔ node | Textual | For alternate names where needed |
| kinship | person ↔ person | Textual or contextual | Support subtype such as spouse, parent, child, relative |
| located_in | node ↔ place | Textual or contextual | For places and place-linked entities |
| movement | person/passage ↔ place | Contextual | For from/to/journey relationships |
| associated_with | node ↔ node | Contextual | For meaningful but non-kin relational ties |
| linked_passage | passage ↔ passage | Contextual or editorial | For intra-Ruth traversal |
| cross_book_stub_link | Ruth node/passage ↔ stub | Editorial | Always bounded and labeled |
| thematic_resonance | node/passage ↔ node/passage | Editorial | Use sparingly and always label as editorial |

### Schema discipline

For MVP, relationship variety should be intentionally limited. It is better to have a small, crisp relationship vocabulary than a sprawling semantic taxonomy.

Every public relationship record should include:

- source ID,
- target ID,
- relationship type,
- optional subtype,
- evidence class,
- public label,
- short rationale,
- status,
- created by,
- approved by,
- created at,
- approved at.

## Editorial/admin workbench requirements

### Admin posture

The editorial workbench should be app-specific, plain, and practical. It should not become a generalized CMS or low-code builder. The goal is to support careful human curation of Ruth-first semantic content.

### Required admin surfaces

The workbench must include the following minimum surfaces:

#### Node editor

For creating and editing:

- name/title,
- type,
- slug,
- aliases,
- summary,
- Ruth anchors,
- stub status,
- publish status.

#### Passage/anchor editor

For:

- defining passage groupings,
- attaching nodes to Ruth verses/passages,
- controlling display order and relationship priority.

#### Relationship editor

For:

- selecting source and target,
- choosing relationship type,
- choosing evidence class,
- writing public label,
- writing editor rationale,
- setting publish status.

#### Stub editor

For:

- creating bounded cross-book nodes,
- attaching Ruth origin points,
- writing concise public rationale,
- controlling onward links.

#### Review queue

For:

- drafts awaiting approval,
- AI suggestions awaiting triage,
- recently changed public content,
- rejected or archived suggestions.

#### Preview mode

Editors must be able to preview public rendering before publishing, including desktop and mobile states.

### Workflow states

Minimum states:

- draft,
- suggested,
- approved,
- published,
- archived,
- rejected.

### Approval and audit requirements

The workbench must log enough information to answer:

- who created this node/relationship,
- who approved it,
- when it changed,
- whether AI was involved in suggesting it.

No public relationship may appear without an approval record.

### Search and filtering for editors

Admin users should be able to filter by:

- type,
- status,
- book/chapter anchor,
- recently changed,
- AI-suggested,
- missing rationale,
- missing summary.

This is editor search, not public search.

## AI-assistance requirements and boundaries

### Permitted AI assistance

AI may assist with internal workflows such as:

- candidate entity extraction,
- candidate relationship suggestion,
- neutral summary drafting,
- duplicate detection,
- editorial QA support,
- accessibility workflows such as alt-text drafts or label checks,
- semantic discovery suggestions for editor review.

### Prohibited AI behavior

AI may not:

- invent theology and publish it;
- create public semantic relationships automatically;
- silently add interpretive links;
- act as an “AI pastor” or “AI theologian”;
- generate sermons or devotionals as a product feature;
- publish summaries or connections without human review;
- rewrite Scripture text;
- replace the editorial role.

### Public-facing AI boundaries

The MVP must not include:

- an open-ended public chat interface,
- “Ask AI about this verse,”
- AI-generated recommendations presented as authoritative,
- AI-generated relationship graphs shown without editorial labeling.

### Human review requirements

Any AI-derived suggestion that reaches a reader-facing surface must have:

- human review,
- human approval,
- editable text,
- provenance retained internally.

### Provenance requirements

AI-assisted artifacts should retain internal provenance fields such as:

- suggestion source,
- model/provider,
- timestamp,
- reviewing editor,
- final disposition.

The product’s public trust depends on editorial traceability.

## Accessibility requirements

### Accessibility standard

The baseline accessibility target for the MVP is WCAG 2.2 AA, with semantic HTML, consistent heading structure, visible focus states, meaningful labels, large touch targets, and text alternatives treated as defaults rather than extras. fileciteturn10file5

### Keyboard requirements

Every core reader and editor journey must be keyboard-completable.

That includes:

- entering Ruth,
- moving through chapter navigation,
- opening a node,
- following a relationship,
- closing a panel/sheet,
- returning to reading context,
- completing admin edits and approvals.

### Screen reader requirements

The product must use semantic structure that makes sense in a screen reader:

- landmarks,
- heading hierarchy,
- labeled controls,
- clear route titles,
- accessible names for interactive chips/buttons,
- meaningful announcements for dynamic changes where needed.

Verse references, entity triggers, and stub links must have understandable accessible labels.

### Focus management

Focus management is a hard requirement.

If a panel, sheet, or dialog opens:

- focus must move predictably into it,
- escape/close behavior must be clear,
- focus must return to the invoking element when closed,
- users must not become trapped or dropped into unpredictable positions.

### Visual clutter and eye strain

The interface must actively reduce strain through:

- selective semantic density,
- comfortable default type sizing,
- generous spacing,
- calm contrast choices,
- restrained motion,
- avoidance of visual noise.

If semantic overlays are visually dense, the reader must have a way to reduce them.

### Touch target and mobile requirements

Interactive targets must be large and forgiving. The mobile experience must not rely on tiny inline hotspots.

Minimum expectations:

- comfortable tap targets,
- forgiving hit areas,
- no hover dependency,
- no interaction patterns that collapse on narrow screens.

### Additional requirements

The MVP must also support:

- reduced motion preference,
- visible focus indication at all times,
- no color-only status communication,
- predictable reading order,
- mobile portrait use,
- screen-reader-friendly error and status messaging.

### Accessibility QA requirements

Before MVP release, test at minimum:

- keyboard-only public journey,
- keyboard-only editor journey,
- VoiceOver or equivalent screen reader smoke pass,
- TalkBack or equivalent screen reader smoke pass,
- mobile tap-target audit,
- contrast and focus audit.

## UX principles

### Scripture stays central

The semantic layer must deepen reading, not compete with it.

### Progressive disclosure

Show only enough to invite the next step. Hide complexity until it becomes useful.

### Traversal over query

The default interaction is following paths, not typing requests.

### Handcrafted edges

The product should feel edited, chosen, and cared for. Sparse, good curation beats maximal linkage.

### Honest interpretation

If a connection is interpretive, label it clearly.

### Calm delight

Use quiet delight: thoughtful microcopy, satisfying transitions, stable structure, and zero gamified gimmicks.

### Accessibility is part of beauty

A calm, predictable, low-friction interface is not a concession. It is part of the product’s aesthetic and theological trustworthiness.

## Technical assumptions

### Stack

The likely MVP stack is:

- Next.js,
- TypeScript,
- Tailwind,
- Convex,
- shadcn/ui.

This implementation direction also aligns with nearby project materials that favor focused, accessibility-first builds on Next.js, TypeScript, Tailwind, and Convex rather than sprawling enterprise architecture. fileciteturn9file2

### Architecture shape

Use a single web application for:

- public reading surfaces,
- editor/admin surfaces,
- semantic content delivery.

Do not introduce the following in MVP unless forced by a concrete blocker:

- graph database,
- separate CMS,
- plugin architecture,
- multi-backend content ownership,
- native app shell.

### Runtime assumptions

Recommended MVP posture:

- public reading is route-driven and cache-friendly;
- editor/admin is authenticated;
- public users do not need accounts;
- minimal anonymous analytics are acceptable for experience learning;
- no multi-tenant enterprise concerns should drive architecture yet.

### UI architecture

Use route-backed UI states where practical, so that:

- passage and node states are linkable,
- browser navigation works,
- a desktop panel and mobile page can share one URL model.

### Data ownership rule

Use a single source of truth for semantic runtime content. Avoid dual-write patterns and avoid splitting the same editorial record across multiple systems.

### Testing expectations

At minimum, the implementation should include:

- component tests for major UI primitives,
- end-to-end tests for the core Ruth traversal path,
- end-to-end tests for editor approval flow,
- accessibility checks integrated into QA.

## Data/content assumptions

### Text and licensing

The MVP requires a legally usable Bible text for Ruth. If the intended translation is not yet licensed or settled, a legally safe fallback must be chosen for MVP.

Cross-book stub rendering must also respect licensing constraints. Where needed, show:

- reference only,
- summary only,
- or a limited approved excerpt.

### Core content model

The MVP should assume at least the following content records:

- books,
- chapters,
- verses,
- passages,
- public nodes,
- relationships,
- stubs,
- editorial notes,
- AI suggestions,
- approval logs.

### Stability assumptions

- Verse IDs should be stable and essentially immutable.
- Passage groupings may be editorial and revisable.
- Node slugs should be stable once public.
- Relationship IDs and approval history must persist across edits.

### Public copy assumptions

Public summaries should be short and useful. As a guideline:

- node summary: concise,
- stub summary: even shorter,
- interpretive rationale: one sentence where possible,
- no mini-commentaries or lengthy essays in MVP.

### Editorial curation assumptions

The MVP assumes manual curation is the norm, especially for Ruth-first content. AI may accelerate editorial work, but it does not reduce the requirement for human review.

### Content quality rule

Every public node and relationship should have a real purpose in the traversal experience. No filler ontology. No collectible taxonomy for its own sake.

## Success criteria

### Experience success

The MVP is successful if pilot users can reliably reach the first magic moment.

Suggested targets:

- at least 80% of pilot users can start in Ruth and complete a three-step exploration path without guided intervention;
- median first-session path depth reaches at least three meaningful semantic interactions;
- a strong majority of pilot readers describe the product as exploratory rather than search-first.

### Emotional/product success

In pilot feedback, readers should report that the product made Scripture feel:

- more connected,
- more alive,
- easier to explore relationally,
- less flat or isolated.

This matters more than generic engagement vanity metrics.

### Editorial success

The editorial workflow is successful if:

- 100% of public relationships have an approval record,
- editors can create or revise a node and relationship without engineering help,
- AI suggestions never bypass human approval,
- editorial review remains practical at Ruth-first scale.

### Accessibility success

The accessibility posture is successful if:

- core public and admin flows pass keyboard-only QA,
- screen-reader smoke tests pass on the main exploration journey,
- no critical accessibility defects remain open at release,
- pilot feedback from accessibility-minded users does not flag structural blockers.

### Technical/operational success

The system is successful operationally if:

- reader routes are stable and shareable,
- mobile use is comfortable,
- the public experience remains calm and fast,
- errors are observable,
- the MVP can be maintained without introducing heavy architecture.

## MVP release criteria

### Content release criteria

Release only when all of the following are true:

- Ruth is fully present in the product;
- every public node is anchored to Ruth;
- every public relationship is typed and approved;
- each Ruth chapter supports at least one meaningful exploration path;
- cross-book links are limited to curated stubs or explicitly bounded destinations.

### Reader release criteria

Release only when a reader can:

- reach Ruth immediately,
- navigate chapters and verses,
- open entity details,
- follow linked pathways,
- cross into a stub and return cleanly,
- toggle or reduce semantic clutter,
- use browser navigation without confusion.

### Editorial release criteria

Release only when editors can:

- create and edit nodes,
- create and review relationships,
- create stubs,
- preview before publish,
- approve or reject AI suggestions,
- audit who approved what.

### Accessibility release criteria

Release only when:

- keyboard-only traversal of the core public journey passes;
- keyboard-only traversal of the core editor journey passes;
- focus management is stable for panels/sheets/dialogs;
- screen-reader smoke tests pass on core flows;
- touch targets and contrast meet the accessibility bar.

### Governance release criteria

Release only when:

- there is no public AI chat,
- no public relationship can bypass approval,
- editorial relationships are visually labeled as such,
- provenance for AI-assisted suggestions exists internally,
- public trust boundaries are clear in the UI.

### Technical release criteria

Release only when:

- route structure is stable,
- error monitoring is enabled,
- basic interaction analytics are in place,
- mobile and desktop layouts both work,
- the MVP does not depend on unfinished generalized architecture.

## Open questions

- What exact wording and structural choices in this PRD need reconciliation against `MASTER_PROJECT_MANIFEST.md` before build freeze?
- Which Bible translation will be used for Ruth in MVP, and what are the licensing implications for cross-book stub text?
- Should the public entry point be a Ruth overview page, direct entry into Ruth 1, or both?
- How much of the “why this link exists” rationale should be shown by default in the public UI, especially for editorial links?
- What is the exact boundary rule for second-order traversal beyond a stub: none, very limited, or editor-by-editor?
- Which theme/motif nodes truly belong in MVP, and which should remain editorial-only until later?
- What is the simplest acceptable editor authentication approach for MVP?
- Should the reader experience remember last location via local storage only, or is that unnecessary at launch?
- What minimal analytics event set is necessary to measure the first magic moment without turning the product into surveillance software?
- Should public stubs expose destination passage text when licensing allows, or always remain summary/reference-first in MVP?

## Deferred post-MVP ideas

The following ideas are intentionally deferred:

- expanding full curation beyond Ruth into adjacent books or carefully chosen next scopes;
- richer canonical pathing beyond bounded stubs;
- a visual graph or map view, if it serves traversal rather than spectacle;
- saved exploration trails or shareable pathways;
- richer editorial provenance surfaced publicly;
- more advanced AI-assisted editorial clustering and triage tools;
- optional public direct-navigation search that supports traversal without becoming the dominant paradigm;
- audio-enhanced reading and additional accessibility modes;
- more robust editorial collaboration features.

None of these should be allowed to distort the Ruth-first MVP.

## Risks and mitigations

| Risk | What it looks like | Mitigation |
|---|---|---|
| Scope creep | MVP grows from Ruth-first explorer into whole-Bible platform | Ruth is the only full-scope book; everything else is bounded |
| Semantic overgrowth | Too many node types or relationship types make the product muddy | Keep the semantic vocabulary intentionally small |
| Interpretive overreach | Editorial or AI-created links feel like hidden theology | Label editorial links clearly; require human approval |
| Accessibility regression | Panels, chips, or mobile interactions become hard to use | Make accessibility a release gate, not a cleanup pass |
| Visual clutter | Too many visible links make the reading experience noisy | Keep overlay density low and provide clutter-reduction controls |
| AI trust failure | Users feel the product is inventing meaning | No public AI chat; no auto-published links; retain provenance |
| Editorial bottleneck | Too much manual work slows progress | Seed Ruth in priority order; use AI only for triage and drafting |
| Architecture drift | Engineering starts designing for a future enterprise product | Hold to a single app, small scope, and no graph database |
| Licensing blockage | Chosen translation or cross-book text rights slow launch | Decide early; use legal fallback options for MVP |
| Manifest mismatch | Build-ready details diverge from the governing manifesto | Run a final reconciliation pass against `MASTER_PROJECT_MANIFEST.md` before implementation begins |