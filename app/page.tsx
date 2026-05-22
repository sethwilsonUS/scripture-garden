import { ArrowRight } from "lucide-react";
import { GardenCard } from "@/components/ui/garden-card";
import { StatusBanner } from "@/components/ui/status-banner";

const foundationItems = [
  "Semantic HTML landmarks are present before reader depth arrives.",
  "Theme tokens use warm stone surfaces and a restrained emerald accent.",
  "Focus, contrast, reduced motion, and large targets are treated as release gates.",
];

export default function Home() {
  return (
    <>
      <section className="hero-section" aria-labelledby="page-title">
        <div className="hero-copy">
          <p className="eyebrow">Ruth-first Scripture traversal</p>
          <h1 id="page-title" className="hero-title">
            Scripture Garden
          </h1>
          <p className="hero-lede">
            A calm, handcrafted place for beginning in Ruth and following
            carefully approved paths through people, places, practices, and
            passages.
          </p>
          <div className="hero-actions" aria-label="Primary page links">
            <a className="btn-primary" href="#ruth-preview">
              Begin with Ruth
              <ArrowRight aria-hidden="true" className="size-4" />
            </a>
            <a className="btn-secondary" href="#source">
              Source posture
            </a>
          </div>
        </div>

        <aside className="garden-bed reader-preview" aria-labelledby="preview-title">
          <p className="reader-preview__meta">Phase 1 shell</p>
          <h2 id="preview-title" className="reader-preview__title">
            The path starts small on purpose.
          </h2>
          <p className="reader-preview__text">
            This foundation sets the page structure, theme, and accessibility
            primitives that the Ruth reader will inherit in the next phases.
          </p>
        </aside>
      </section>

      <div className="garden-grid" id="ruth-preview">
        <GardenCard eyebrow="Entry" title="Ruth stays central">
          <p>
            The public experience begins from Ruth rather than a blank prompt,
            a generic search box, or an unbounded graph.
          </p>
        </GardenCard>

        <GardenCard eyebrow="Trust" title="Human-approved paths">
          <p>
            Public semantic relationships will be curated and approved before
            they appear in the reader.
          </p>
        </GardenCard>

        <GardenCard eyebrow="Access" title="Keyboard-visible by default">
          <p>
            The shell supports skip navigation, clear landmarks, visible focus,
            and theme persistence from the first phase.
          </p>
        </GardenCard>
      </div>

      <div className="section-stack">
        <section
          id="foundation"
          className="split-section"
          aria-labelledby="foundation-title"
        >
          <div>
            <p className="eyebrow">Foundation</p>
            <h2 id="foundation-title" className="section-heading">
              Built for calm traversal before feature depth.
            </h2>
            <p className="section-copy">
              Phase 1 keeps the product narrow and sets reusable surface,
              control, status, and form recipes for later reader and admin work.
            </p>
          </div>

          <div className="garden-bed">
            <ul className="foundation-list">
              {foundationItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <hr className="garden-divider" />

        <section id="source" className="split-section" aria-labelledby="source-title">
          <div>
            <p className="eyebrow">Source</p>
            <h2 id="source-title" className="section-heading">
              Scripture text is not mocked here.
            </h2>
            <p className="section-copy">
              The WEB corpus import and attribution belong to Phase 2, so this
              shell avoids presenting placeholder verse text as if it were the
              real reader.
            </p>
          </div>

          <StatusBanner title="Foundation shell ready for corpus work">
            <p>
              Next up: load Ruth from the World English Bible, keep verse text
              separate from semantic overlays, and show attribution in the
              public experience.
            </p>
          </StatusBanner>
        </section>

        <section className="garden-grid" aria-label="Phase 1 assurances">
          <GardenCard eyebrow="Scope" title="No public AI chatbot">
            <p>
              AI remains internal and assistive in the project direction. This
              phase adds no public AI behavior.
            </p>
          </GardenCard>

          <GardenCard eyebrow="Model" title="No graph database">
            <p>
              The MVP direction remains simple Convex tables and explicit
              relationships when data work begins.
            </p>
          </GardenCard>

          <GardenCard eyebrow="Tone" title="No productivity dashboard">
            <p>
              The interface is tuned for reading and discovery, not task
              completion theatre in a Bible costume.
            </p>
          </GardenCard>
        </section>
      </div>
    </>
  );
}
