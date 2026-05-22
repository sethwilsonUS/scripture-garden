# AGENTS.md

This repository is for a handcrafted semantic Scripture exploration environment. Keep changes small, reviewable, and tightly within the documented MVP.

## Project authority order

Use this order when making decisions:

- Follow explicit human instructions for the current task first.
- Then follow `MASTER_PROJECT_MANIFEST.md`.
- Then follow `PRD.md`.
- Then follow `TECHNICAL_PLAN.md`.
- Then follow existing repository conventions and code patterns.
- Use this file as operating guidance, not as a replacement for the source documents.

If any higher-authority source conflicts with a lower one, follow the higher source and document the conflict.

## Required source documents to read before coding

Before changing code, read:

- `MASTER_PROJECT_MANIFEST.md`
- `PRD.md`
- `TECHNICAL_PLAN.md`

Also read the files directly related to your task before editing:

- adjacent routes, components, models, and tests
- any existing accessibility helpers, editor/workbench code, and approval logic
- any schema or data model files touched by the task

If you have not read the source docs, do not start implementation.

## Core project rules

- Keep the product Ruth-first. Do not make whole-Bible assumptions unless the source docs explicitly require them.
- Preserve the core product shape: semantic Scripture traversal, not search-first Bible software.
- Protect the intended feel: traversable, exploratory, delightful, calm, accessible, and handcrafted.
- Keep scope tight to the MVP. Do not expand product scope without explicit human instruction.
- Prefer small, reviewable changes over broad rewrites.
- Do not overengineer. Avoid premature abstraction, framework churn, or architecture for hypothetical future scale.
- Do not invent schema, routes, product features, public AI behavior, or theological content beyond the source docs.

## Technical stack rules

- Stay within the stack and architectural direction defined in `TECHNICAL_PLAN.md`.
- Default to the existing repository choices for Next.js, TypeScript, Tailwind, Convex, and shadcn/ui.
- Do not replace core stack choices without explicit approval.
- Keep TypeScript strict and explicit. Prefer clear types over clever inference.
- Keep server/client boundaries clear. Do not move logic across that boundary casually.
- Reuse existing utilities, patterns, and folder structure before creating new ones.
- Avoid adding infrastructure for scale the MVP does not yet need.
- Avoid plugin systems, enterprise architecture, generalized CMS patterns, and graph-database-driven design unless the source docs explicitly call for them.

## Accessibility rules

- Treat accessibility as a release gate, not a cleanup pass.
- Use native semantic HTML first.
- Preserve and test keyboard navigation, focus order, focus visibility, labels, headings, landmarks, and screen-reader compatibility.
- Keep interactions usable without a mouse.
- Maintain accessible names, descriptions, error states, and loading states.
- Do not assume a component library solves accessibility automatically.
- If a change harms accessibility, redesign it instead of patching around it later.

## Component-system rules

- Prefer native semantic HTML first.
- For complex accessible primitives, prefer Base UI when available and suitable.
- Use Radix only when Base UI is unavailable, unsuitable, or testing proves Radix is the better option.
- Treat `shadcn/ui` as open-code scaffolding in the repo, not a black-box dependency.
- Edit scaffolded components directly when needed for this product’s UX and accessibility.
- Keep components understandable and close to their usage. Avoid wrapper pyramids and abstraction for its own sake.
- Do not introduce a second or third component strategy without explicit approval.

## Data and modeling rules

- Model the MVP that exists now, not the platform you imagine later.
- Keep Ruth-first assumptions explicit in schema, seed data, UI states, copy, and traversal logic.
- Do not assume whole-Bible completeness, generalized canon coverage, or universal relationship types unless the source docs require them.
- Keep one clear source of truth for each entity.
- Do not introduce a graph database or graph-shaped complexity unless the source docs explicitly require it.
- Do not invent editorial states, public relationship types, provenance fields, or workflow states beyond the documented model.
- Preserve approval boundaries around anything that can become public.
- If a task needs new schema and the source docs do not define it clearly, ask for clarification or leave a clearly labeled TODO rather than guessing.

## AI feature rules

- Keep AI strictly assistive and internal unless the source docs explicitly say otherwise.
- AI may help with suggestions, summaries, accessibility checks, and semantic discovery.
- AI may not publish public theology, public semantic links, public recommendations, or interpretive content without human approval.
- Do not turn the product into a generic AI Bible chatbot, sermon generator, devotional generator, or auto-interpreter.
- Do not add autonomous public-facing AI behavior.
- Keep any AI output clearly reviewable, reversible, and non-authoritative.

## Editorial and workbench rules

- Maintain a clear boundary between internal workbench/editorial tooling and the public experience.
- Assume all public semantic relationships require human editorial approval before publication.
- Keep draft, suggestion, and review states private unless explicitly approved for public display.
- Build workflows that support human review rather than bypassing it.
- Do not expose internal suggestions, unreviewed links, or provisional theology in the public UI.
- Preserve provenance and review context if the existing model supports it.

## Explicit forbidden changes

Do not:

- turn the project into generic Bible search software
- turn the project into an AI chatbot or assistant-first product
- add sermon generation, devotional generation, or public theological generation
- add note-taking, social, church-management, enterprise admin, or generalized CMS product scope
- assume the app should immediately handle the entire Bible
- introduce plugin systems, graph databases, enterprise patterns, or speculative platform abstractions
- invent public semantic relationships or interpretive content
- auto-publish AI-generated theology or relationship suggestions
- add routes, schemas, data flows, or major features not grounded in the source docs
- replace core stack choices or add large dependencies without approval
- do broad refactors unrelated to the assigned task

## Testing expectations

For every meaningful change:

- run or update the relevant tests
- add tests for changed behavior, not just happy paths
- verify lint, typecheck, and build for the affected area
- test keyboard-only navigation for affected UI
- test focus behavior, accessible names, error states, and screen-reader impact for affected UI
- test loading, empty, and failure states
- test approval gating for anything that affects public semantic content
- test authorization and data validation for any schema, mutation, or server logic changes

If you cannot fully test something, say so explicitly and list the gap.

## Dependency rules

- Prefer existing dependencies and platform capabilities first.
- Add a new dependency only if it is justified by `TECHNICAL_PLAN.md` or explicitly approved by a human.
- Keep bundle, complexity, and maintenance costs low.
- Favor small, boring, well-understood dependencies over clever ones.
- Do not introduce overlapping UI primitive libraries without a strong documented reason.
- Do not treat shadcn-generated code as untouchable vendor code; it is repo code.
- If a dependency can be avoided with native HTML, browser APIs, Next.js, Tailwind, or existing repo utilities, avoid it.

## How to handle uncertainty

- Stop and check the source docs before guessing.
- If the docs conflict, ask for clarification or leave a clearly labeled TODO that names the conflict.
- If the repo and docs conflict, do not silently “fix” the repo at large; make the smallest safe change and note the mismatch.
- Do not invent missing theology, UX intent, schema, or product behavior.
- Default to the narrowest interpretation that preserves MVP scope and accessibility.

## Preferred task style for Codex

Work like this:

- Read the source docs and the relevant local files first.
- Restate the task to yourself in a small, concrete scope.
- Make the smallest viable diff.
- Touch as few files as practical.
- Avoid unrelated cleanup, renames, formatting churn, and speculative refactors.
- Preserve existing conventions unless they conflict with higher-authority docs.
- Add or update targeted tests.
- Leave concise TODOs where human product or editorial decisions are required.
- End with a short summary of what changed, what was tested, and any open questions.