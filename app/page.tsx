import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { GardenCard } from "@/components/ui/garden-card";
import { StatusBanner } from "@/components/ui/status-banner";

const foundationItems = [
  "Read the text first, then follow gentle paths when curiosity rises.",
  "Warm stone surfaces and a restrained emerald accent keep the page quiet.",
  "Keyboard access, visible focus, contrast, and reduced motion are cared for from the start.",
];

export default function Home() {
  return (
    <>
      <section className="hero-section" aria-labelledby="page-title">
        <div className="hero-copy">
          <p className="eyebrow">A quiet Bible garden</p>
          <h1 id="page-title" className="hero-title">
            Scripture Garden
          </h1>
          <p className="hero-lede">
            Begin in Ruth. Read slowly. When a name, place, or custom catches
            your attention, open a small path and keep your place in the story.
          </p>
          <div className="hero-actions" aria-label="Primary page links">
            <Link className="btn-primary" href="/ruth/1">
              Begin with Ruth
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
            <Link className="btn-secondary" href="/ruth">
              See the garden
            </Link>
            <a className="btn-secondary" href="#source">
              Source text
            </a>
          </div>
        </div>

        <aside className="garden-bed reader-preview" aria-labelledby="preview-title">
          <p className="reader-preview__meta">Ruth is open</p>
          <h2 id="preview-title" className="reader-preview__title">
            The path starts in the text.
          </h2>
          <p className="reader-preview__text">
            Four short chapters, a few tender paths, and enough room to notice
            what the story is doing.
          </p>
        </aside>
      </section>

      <div className="garden-grid" id="ruth-preview">
        <GardenCard eyebrow="Begin" title="Start with the story">
          <p>
            Scripture Garden opens in Ruth, with the text kept clear and the
            extra paths tucked close to the verses.
          </p>
        </GardenCard>

        <GardenCard eyebrow="Notice" title="Follow what catches light">
          <p>
            Tap a person, place, or practice to see where it appears and what it
            gently connects to nearby.
          </p>
        </GardenCard>

        <GardenCard eyebrow="Rest" title="Built for slow reading">
          <p>
            The layout is calm, keyboard-friendly, and careful with contrast,
            motion, and focus.
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
            <p className="eyebrow">How it feels</p>
            <h2 id="foundation-title" className="section-heading">
              A reader that lets the text breathe.
            </h2>
            <p className="section-copy">
              The garden is intentionally small right now. It gives Ruth room to
              speak before asking you to explore anything else.
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
              The words are here in the open.
            </h2>
            <p className="section-copy">
              Scripture text comes from the World English Bible, a public-domain
              translation distributed through eBible.org.
            </p>
          </div>

          <StatusBanner title="Ruth is ready to read">
            <p>
              Chapters 1-4 are available now, with gentle paths through Ruth,
              Naomi, Boaz, Moab, Bethlehem, gleaning, redemption, and return.
            </p>
          </StatusBanner>
        </section>

        <section className="garden-grid" aria-label="Scripture Garden qualities">
          <GardenCard eyebrow="Pace" title="No hurry">
            <p>
              The garden invites reading, pausing, and following one path at a
              time.
            </p>
          </GardenCard>

          <GardenCard eyebrow="Shape" title="Small by design">
            <p>
              The first garden bed is Ruth. More can grow later, but the first
              care is depth, not sprawl.
            </p>
          </GardenCard>

          <GardenCard eyebrow="Tone" title="Made for attention">
            <p>
              Warm surfaces, readable type, and modest controls keep the page
              quiet around the text.
            </p>
          </GardenCard>
        </section>
      </div>
    </>
  );
}
