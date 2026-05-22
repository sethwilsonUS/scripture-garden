# Scripture Garden Build Plan

> This is the phase-by-phase build roadmap for Scripture Garden. It should be used with `MASTER_PROJECT_MANIFEST.md`, `PRD.md`, `TECHNICAL_PLAN.md`, `DATA_MODEL.md`, and `AGENTS.md` before starting implementation work.

## Summary

Scripture Garden is a handcrafted, Ruth-first semantic Scripture exploration environment. The MVP should help readers begin in Ruth, open curated semantic connections, and follow approved pathways without turning the product into search-first Bible software, an AI chatbot, a sermon generator, a note-taking system, or a whole-Bible graph platform.

This plan creates the build sequence for the actual project. It keeps design and accessibility first, then moves through data, reader traversal, semantic curation, admin tooling, governance, measurement, and release hardening.

## Authority And Working Rules

Use project sources in this order when making implementation decisions:

1. Explicit human instructions for the current task.
2. `MASTER_PROJECT_MANIFEST.md`.
3. `PRD.md`.
4. `TECHNICAL_PLAN.md`.
5. `DATA_MODEL.md`.
6. `AGENTS.md`.
7. Existing code patterns once the app exists.

If sources conflict, follow the higher-authority source and document the conflict in the implementation notes or pull request summary.

## Locked Decisions

- Product name: Scripture Garden. "Hyperlink Bible" is historical/working-title language only.
- MVP Scripture source: World English Bible, standard 66-book Protestant canon.
- Build order: design/accessibility foundation first, then data, reader slice, admin, governance, measurement, and release hardening.
- Admin auth: environment password plus secure cookie for MVP.
- Future auth: keep the auth boundary provider-agnostic so Clerk can be added later without rewriting admin flows.
- AI: include schema/provenance hooks only in MVP. Defer AI suggestion UI until after the manual editorial workflow works.
- Plan file: this root-level `BUILD_PLAN.md`.

## Public Interfaces And Architecture

- Stack: Next.js App Router, React, TypeScript, Tailwind CSS v4 with CSS-first `@theme`, Convex, and shadcn/ui as open-code scaffolding.
- UI primitives: use native semantic HTML first. Prefer Base UI for complex accessible primitives when suitable. Use Radix only where Base UI is missing, unsuitable, or testing proves Radix is the better choice.
- Theme: use the local `garden-theme` guidance from the first implementation phase.
- Reader routes: stable, shareable, Ruth-first routes with route-backed detail states for entities and stubs.
- Admin routes: `/admin` protected by MVP password/cookie auth. Public readers do not need accounts.
- Data ownership: keep Scripture text separate from semantic overlays, entity definitions, approvals, AI suggestions, and analytics.
- Public relationship rule: no public semantic relationship may appear without human approval.
- Cross-book rule: outside-Ruth content is bounded stub territory, not a whole-Bible graph.

## WEB Scripture Text Rules

Use the World English Bible as the real MVP text source, not placeholder text.

Implementation requirements:

- Store translation metadata with abbreviation `WEB`, full name `World English Bible`, source URL, public-domain/license note, import timestamp, and source file/version identifier when available.
- Store Scripture text separately from semantic overlays and entity definitions.
- Treat imported verse text as immutable application data unless a deliberate re-import or migration is performed.
- Do not rewrite, paraphrase, or alter WEB verse text while still labeling it as World English Bible.
- Display appropriate WEB attribution in the app footer, about page, or Scripture source note.
- Keep the schema translation-aware enough to add another translation later.
- Do not build multi-translation UI in MVP.
- Cross-book stubs may use WEB references and WEB passage text only within Ruth-first bounded-stub rules.
- Do not import or display copyrighted/licensed Bible translations without a future explicit licensing approval.

## Phase 1: Foundation, Theme, And Accessibility

### Goal

Create the project foundation and make the garden feel like Scripture Garden before building feature depth.

### Build

- Scaffold the Next.js App Router application with TypeScript.
- Configure Tailwind CSS v4 using CSS-first `@theme` tokens.
- Apply the garden-theme direction:
  - warm stone surfaces,
  - controlled emerald accent,
  - Fraunces for display,
  - DM Sans for body,
  - JetBrains Mono for technical metadata,
  - dark/light classes on `<html>`,
  - local storage theme persistence with system preference fallback.
- Build the root layout with:
  - skip link,
  - `header`,
  - labeled `nav`,
  - `main id="main-content"`,
  - `footer`,
  - document language and metadata.
- Add base CSS primitives:
  - focus-visible outline,
  - screen-reader-only utility,
  - primary and secondary buttons,
  - input field,
  - status/error banner,
  - garden surface/card primitive,
  - reduced-motion rules.
- Add initial component recipes for buttons, links, form fields, cards, status messages, and shell navigation.

### Acceptance Criteria

- The app shell renders on desktop and mobile.
- Keyboard users can reach the skip link, main navigation, theme control, and main content.
- Focus indicators are visible and not obscured by fixed UI.
- Text and UI contrast meet WCAG 2.2 AA targets.
- Decorative motion honors `prefers-reduced-motion`.
- Screen reader landmark structure is coherent.

### Tests And Checks

- Run lint, typecheck, and build.
- Run a contrast check for core theme foreground/background pairs.
- Manually test keyboard navigation through the shell.
- Smoke test landmarks and heading order with a screen reader or accessibility tooling.

## Phase 2: Scripture Corpus And WEB Import

### Goal

Load Ruth from the World English Bible into a stable, translation-aware Scripture corpus.

### Build

- Add Convex schema for:
  - `translations`,
  - `books`,
  - `verses`,
  - `verseTexts`,
  - `passages`.
- Seed WEB translation metadata.
- Seed the Ruth book record with `curatedScope="full"`.
- Import Ruth 1-4 as canonical verse records plus WEB-specific verse text records.
- Create initial passage groupings for Ruth chapters and key reading sections.
- Add public query functions that fetch published Ruth text by book/chapter and passage slug.
- Add attribution copy for WEB in a footer, about surface, or Scripture source note.

### Acceptance Criteria

- Ruth 1-4 render from stored WEB text.
- Verse identity is stable through `verseKey` and `osisRef`.
- WEB text is not mixed with semantic overlays.
- The app displays WEB attribution.
- No licensed Bible translation is imported or displayed.
- Chapter navigation can be derived from stored Ruth data.

### Tests And Checks

- Unit test WEB metadata shape.
- Unit test verse identity generation.
- Unit test that verse text cannot be updated through normal editorial mutations.
- Verify imported Ruth verse count and chapter coverage.
- Verify no non-WEB translation seed records are public.

## Phase 3: Reader Vertical Slice

### Goal

Build the first public Ruth reading experience, including one working semantic traversal path.

### Build

- Add public reader routes for Ruth:
  - Ruth overview or direct Ruth 1 entry,
  - chapter route,
  - passage route where needed,
  - route-backed entity/stub detail state.
- Build the reading surface with:
  - chapter and verse orientation,
  - comfortable reading measure,
  - calm spacing,
  - mobile-friendly text layout,
  - no visual soup.
- Add semantic overlay controls:
  - show curated links,
  - reduce/hide overlay density,
  - distinguish categories without color alone.
- Add route-backed detail behavior:
  - desktop side panel or adjacent detail view,
  - mobile full-screen sheet/page,
  - natural browser back/forward,
  - focus moves predictably into detail view and returns on close.
- Preserve reading position when opening/closing detail states.

### Acceptance Criteria

- A reader can enter Ruth immediately.
- A reader can navigate Ruth chapters.
- A reader can open one entity from the text.
- A reader can follow one approved relationship to another passage or stub.
- A reader can return to Ruth without losing context.
- Browser back/forward works for detail states.
- The same path works by keyboard.

### Tests And Checks

- E2E test the first magic moment: Ruth entry, entity open, relationship follow, return.
- E2E test browser back/forward through route-backed details.
- Keyboard-only test for the same journey.
- Verify focus restore after closing entity/stub detail.
- Verify overlay toggle state does not break reading order.

## Phase 4: Semantic Seed Layer

### Goal

Add the minimum curated semantic layer needed for Ruth to feel alive, connected, and trustworthy.

### Build

- Add Convex schema and query/mutation surfaces for:
  - `nodes`,
  - `nodeAliases`,
  - `nodePassageAnchors`,
  - `relationships`,
  - `relationshipApprovals`.
- Implement shared enums or validator constants for:
  - workflow status,
  - node type,
  - evidence class,
  - anchor kind,
  - relationship type key.
- Seed Ruth semantic content in this priority order:
  1. major people,
  2. major places,
  3. key things/practices,
  4. high-value groups/lineages,
  5. limited themes/motifs,
  6. bounded cross-book stubs.
- Ensure every public node is anchored to Ruth.
- Ensure every public relationship is:
  - typed,
  - evidence-classed,
  - approved,
  - connected to stable source and target nodes,
  - ordered intentionally for display.
- Label editorial relationships clearly in public UI.

### Acceptance Criteria

- Every Ruth chapter has at least one meaningful exploration path.
- Every public node has a Ruth anchor.
- Every public relationship has a human approval record.
- Editorial links show a concise reason for connection.
- Cross-book movement is labeled as leaving fully curated Ruth territory.
- Stubs do not create uncontrolled onward traversal.

### Tests And Checks

- Unit test relationship publication guard.
- Unit test public queries exclude unapproved relationships.
- Unit test node publication requires Ruth anchoring.
- E2E test a cross-book stub path and return-to-Ruth path.
- Verify evidence class display does not rely on color alone.

## Phase 5: MVP Admin Workbench

### Goal

Give editors a simple, protected workbench for creating and approving Ruth-first semantic content.

### Build

- Add `/admin/login`.
- Implement MVP auth:
  - password from environment variable,
  - secure HTTP-only session cookie,
  - session validation helper,
  - logout action,
  - route protection for `/admin`.
- Keep auth isolated behind provider-agnostic helpers so Clerk can replace it later.
- Add admin shell with accessible navigation and clear page titles.
- Add workbench surfaces for:
  - node creation/editing,
  - passage/anchor editing,
  - relationship creation/editing,
  - stub creation/editing,
  - preview before publish,
  - approval and rejection.
- Add form validation with visible labels, useful error messages, and focus management on submit errors.
- Add internal search/filtering for type, status, chapter anchor, recently changed, AI-suggested, missing rationale, and missing summary where data exists.

### Acceptance Criteria

- An editor can log in and log out.
- `/admin` is inaccessible without a valid session.
- An editor can create or revise a node.
- An editor can create or revise a relationship.
- An editor can preview public rendering before publish.
- An editor can approve or reject a relationship.
- No public relationship can be published without approval.
- The core admin approval flow works by keyboard.

### Tests And Checks

- Unit test auth helpers and cookie/session behavior.
- E2E test admin login, protected route access, logout, and rejected unauthenticated access.
- E2E test relationship create, preview, approve, and public visibility.
- Keyboard-only test for admin approval flow.
- Verify form labels, errors, and status messages are screen-reader friendly.

## Phase 6: Editorial Governance And Audit

### Goal

Make public trust enforceable in code, not just promised in docs.

### Build

- Add append-only approval history behavior for relationship decisions.
- Add `editorialNotes` for internal notes.
- Add `auditLog` for sensitive admin mutations.
- Add `aiSuggestions` schema/provenance hooks without public UI and without direct publication paths.
- Add mutation guards so:
  - public relationships require approval,
  - approval history is append-only,
  - audit history is append-only,
  - AI suggestions never appear in public reader queries,
  - drafts and rejected records stay internal.
- Add review-friendly admin views for approval history and audit context where useful for MVP.

### Acceptance Criteria

- Public queries cannot expose drafts, rejected records, AI suggestions, or internal notes.
- Approval history persists across edits.
- Sensitive admin changes create audit entries.
- AI-derived records remain blocked from public visibility unless converted through normal human-reviewed editorial mutations.
- Relationship meaning is not silently changed after publication without new approval history.

### Tests And Checks

- Unit test public query filters.
- Unit test append-only approval behavior.
- Unit test append-only audit behavior.
- Unit test AI suggestion publish blocking.
- E2E test that rejected or draft relationships do not appear publicly.

## Phase 7: Measurement And Hardening

### Goal

Measure whether readers reach the first magic moment without turning Scripture Garden into surveillance Mordor.

### Build

- Add minimal anonymous analytics for:
  - Ruth entry,
  - chapter viewed,
  - entity opened,
  - relationship followed,
  - stub opened,
  - return-to-Ruth action,
  - overlay density changed.
- Keep analytics payloads bounded, versioned, and non-PII.
- Add analytics retention/cleanup assumptions.
- Add error and empty-state handling for reader and admin surfaces.
- Add loading states that preserve layout and announce important status changes.
- Review performance for Ruth reader routes and admin workflows.

### Acceptance Criteria

- Analytics can measure whether a reader completes the core traversal path.
- Analytics events do not collect Scripture notes, personal reflections, or unnecessary identifiers.
- Reader and admin errors have understandable recovery paths.
- Loading and empty states are accessible and calm.
- Public reader routes remain fast enough for mobile use.

### Tests And Checks

- Unit test analytics event payload validation.
- E2E test that core traversal emits expected anonymous events.
- Verify raw analytics are not exposed publicly.
- Test loading, empty, and error states.
- Run build and inspect route performance basics.

## Phase 8: Release Gate

### Goal

Make the MVP shippable, honest, accessible, and aligned with the Ruth-first product promise.

### Release Checklist

- Ruth 1-4 are fully readable from WEB data.
- WEB attribution is visible and accurate.
- Every public node is anchored to Ruth.
- Every public relationship is typed, evidence-classed, and approved.
- Each Ruth chapter supports at least one meaningful exploration path.
- Cross-book content is limited to approved bounded stubs.
- Public reader has no account requirement.
- `/admin` is protected.
- MVP auth is documented as temporary and replaceable.
- No public AI chat exists.
- AI suggestions, drafts, internal notes, and unapproved relationships are not publicly exposed.
- No graph database, generalized CMS, plugin system, note-taking system, social layer, or whole-Bible graph scope has been introduced.

### QA Checklist

- Run lint.
- Run typecheck.
- Run production build.
- Run unit/schema tests.
- Run component tests.
- Run E2E public traversal tests.
- Run E2E admin approval tests.
- Run keyboard-only public reader test.
- Run keyboard-only admin approval test.
- Run VoiceOver or equivalent smoke pass.
- Run TalkBack or equivalent mobile smoke pass when practical.
- Run mobile tap-target audit.
- Run contrast and focus audit.
- Verify reduced-motion behavior.
- Verify browser back/forward through reader detail routes.
- Verify WEB source/attribution review.

### Acceptance Criteria

- No critical accessibility defects remain open.
- No approval-gating defects remain open.
- No licensing or attribution blockers remain open.
- The first magic moment works without guided intervention.
- The product still feels like Scripture Garden: calm, readable, exploratory, editorially trustworthy, and small on purpose.

## Global Test Plan

- Unit/schema tests for validators, publication guards, relationship approval rules, WEB metadata, and auth helpers.
- Component tests for buttons, links, overlay controls, panels/sheets, forms, status messages, and theme behavior.
- E2E tests for Ruth traversal, route-backed details, return behavior, admin login, admin approval, and public query filtering.
- Accessibility checks for WCAG 2.2 AA basics:
  - keyboard completion,
  - focus restore,
  - focus not obscured,
  - landmarks,
  - labels,
  - contrast,
  - touch targets,
  - reduced motion,
  - screen-reader route/detail announcements.

## Assumptions

- `DATA_MODEL.md` is the actual repo file despite the internal heading saying `DATA_MODELS.md`.
- The NRSVUE examples in `DATA_MODEL.md` are illustrative and must be replaced by WEB-specific seed examples.
- Clerk is explicitly post-MVP.
- MVP auth must remain simple but isolated behind replaceable helpers.
- No multi-translation UI belongs in MVP.
- No public AI chat belongs in MVP.
- No graph database belongs in MVP.
- No generalized CMS belongs in MVP.
- No social features, notes system, native mobile app, or whole-Bible semantic graph belongs in MVP.

## Phase Execution Guidance

Build one phase at a time. At the start of each phase:

1. Re-read `AGENTS.md` and the source docs relevant to that phase.
2. Restate the phase goal in the implementation session.
3. Make the smallest coherent diff.
4. Add or update tests for changed behavior.
5. Run the phase checks before moving on.
6. Record any source-doc conflict or human decision in the final implementation summary.

Do not start the next phase until the current phase meets its acceptance criteria or the remaining gap is explicitly accepted by the human owner.
