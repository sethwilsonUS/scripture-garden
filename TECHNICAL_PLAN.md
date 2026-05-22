I am building the Hyperlink Bible / Semantic Scripture project.

Please use the project source files `MASTER_PROJECT_MANIFEST.md` and `PRD.md` as the authoritative grounding documents for this task.

Your job is to generate a full technical planning document:

# TECHNICAL_PLAN.md

This document should translate the manifesto and PRD into a practical, implementation-ready technical plan for building the Ruth-first MVP.

Core project grounding:

- This is a handcrafted semantic Scripture exploration environment.
- It is not a generic AI Bible chatbot, sermon generator, productivity app, note-taking ecosystem, church-management tool, enterprise Bible platform, or “Christian SaaS.”
- The MVP is intentionally small and Ruth-first.
- The central user experience is semantic traversal: a reader begins in Ruth, clicks into people/places/things/practices/themes, and discovers approved Scriptural pathways.
- The public product must feel traversable rather than searchable, exploratory rather than task-oriented, delightful rather than productivity-focused, and handcrafted rather than AI-generated.
- The semantic layer must be human-curated, objective/restrained, and editorially approved.
- AI may assist internally, but may not autonomously publish theology, semantic relationships, summaries, interpretive links, or public-facing recommendations.
- Accessibility is a release gate, not a cleanup pass.
- The product should resist over-engineering and avoid premature graph-database complexity, enterprise architecture, generalized CMS abstraction, plugin systems, and whole-Bible platform assumptions.

Important stack direction:

- Use Next.js, TypeScript, Tailwind, Convex, and shadcn/ui as the likely MVP foundation.
- Treat shadcn/ui as an open-code component distribution/design-system approach, not as a black-box component library.
- For UI primitives:
  - prefer native semantic HTML wherever possible;
  - prefer Base UI primitives for complex accessible components where appropriate and available;
  - use Radix only where Base UI support is missing, where a Radix primitive is demonstrably more stable, or where testing proves it is the better choice;
  - do not hard-code Radix as the default primitive layer.
- Component primitives are helpers, not guarantees. All complex interaction patterns must be tested with keyboard and screen-reader workflows.
- The reader and admin workbench must be designed around predictable focus management, keyboard access, reduced visual clutter, large tap targets, mobile usability, and screen-reader compatibility.

Please produce a clean, implementation-ready Markdown document titled:

# TECHNICAL_PLAN.md

The document should include:

1. Technical overview
2. Architecture principles
3. MVP architecture diagram or textual architecture map
4. Recommended stack and rationale
5. Frontend architecture
6. Routing strategy
7. Reader experience technical design
8. Entity/detail panel or route-backed sheet strategy
9. Admin/editorial workbench technical design
10. Convex data architecture
11. Core data model overview
12. Scripture text storage strategy
13. Semantic overlay storage strategy
14. Entity and relationship modeling
15. Editorial approval and provenance modeling
16. AI suggestion pipeline and boundaries
17. Authentication and authorization assumptions
18. Accessibility architecture
19. Component system strategy
20. Styling and design-system strategy
21. State management strategy
22. Search and traversal strategy
23. Analytics and event tracking strategy
24. Testing strategy
25. Performance considerations
26. Deployment assumptions
27. Security and privacy considerations
28. Migration/seed-data strategy
29. Explicit technical non-goals
30. Risks and mitigations
31. Open technical questions
32. Implementation phases
33. Codex implementation guidance

Specific technical expectations:

- Keep the architecture as a single focused web app unless a concrete requirement forces otherwise.
- Public reader routes should be stable, shareable, and cache-friendly where possible.
- Admin/editorial routes should be authenticated.
- Public readers should not need accounts.
- Use route-backed UI state where practical so node/detail states can be shared and browser navigation works.
- Preserve reading position when users open/close entity details or return from stubs.
- Model Ruth as the only fully curated MVP book.
- Model cross-book material as bounded semantic stubs, not as a fully generalized Bible graph.
- Use simple Convex tables/documents and explicit relationships rather than a graph database.
- Separate immutable Scripture text from semantic overlays and entity definitions.
- Every public semantic relationship must have an approval record.
- AI suggestions must remain draft/internal until human-approved.
- Include enough schema detail to guide implementation, but do not overdesign the schema beyond MVP needs.
- Include route examples and table examples where helpful.
- Include suggested file/folder structure for a Next.js app.
- Include concrete guidance for Codex or another coding agent so it does not overbuild.

Accessibility requirements to include:

- WCAG 2.2 AA baseline.
- Keyboard-only completion of the core public reader journey.
- Keyboard-only completion of the core admin approval journey.
- Predictable focus management for panels, dialogs, sheets, menus, and route transitions.
- Screen-reader-friendly headings, landmarks, labels, and announcements.
- No hover-only interactions.
- No color-only status communication.
- Large/friendly mobile tap targets.
- Reduced motion support.
- Testing requirements for VoiceOver, TalkBack or equivalent, keyboard-only navigation, contrast, and focus behavior.
- Component primitives must be selected and tested based on actual accessibility behavior, not reputation.

Component-system guidance to include:

- Use native HTML first.
- Use shadcn/ui for open-code component scaffolding and design-system consistency.
- Prefer Base UI for complex accessible primitives when available and suitable.
- Use Radix selectively, not automatically.
- Avoid custom complex widgets unless native/Base UI/Radix options fail and the custom implementation is fully tested.
- Keep component code inspectable and modifiable.
- Do not rely on a component library to “solve accessibility” without project-specific testing.

Technical non-goals to explicitly include:

- No graph database in MVP.
- No generalized CMS.
- No plugin architecture.
- No enterprise/multi-tenant architecture.
- No public AI chatbot.
- No whole-Bible semantic graph.
- No social/community layer.
- No note-taking system.
- No native mobile app.
- No overbuilt search engine as the primary interaction model.
- No visual graph canvas as the main MVP interface.

Tone and style:

- Clear
- Practical
- Engineering-focused
- Grounded
- Specific enough for implementation
- Faith-literate only where relevant to project constraints
- No generic SaaS jargon
- No hype
- No vague “best practices” filler
- Optimized for implementation by Codex or a future engineering collaborator

Important output constraints:

- Do not write another research report.
- Do not re-litigate the product vision except where needed to explain technical decisions.
- Do not expand beyond the Ruth-first MVP.
- Do not introduce new major product features beyond `PRD.md`.
- Where the source docs leave something unresolved, place it under “Open technical questions” rather than inventing certainty.
- Return only the finished `TECHNICAL_PLAN.md` document in Markdown.
