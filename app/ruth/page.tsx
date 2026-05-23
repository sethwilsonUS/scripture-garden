import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { fetchQuery } from "convex/nextjs";
import { TrackEvent } from "@/components/analytics/track-event";
import { api } from "@/convex/_generated/api";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Ruth",
  description: "Read Ruth in the World English Bible and follow gentle paths through the story.",
};

export default async function RuthOverviewPage() {
  const overview = await fetchQuery(api.scripture.getRuthOverview, {});

  if (!overview) {
    return (
      <section className="garden-bed" role="status">
        <p className="eyebrow">Ruth</p>
        <h1 className="section-heading">The garden bed is still being planted.</h1>
        <p className="section-copy">
          The reader is ready, but the Ruth text has not arrived yet.
        </p>
      </section>
    );
  }

  return (
    <>
      <TrackEvent eventName="ruth_entry" pageSlug="ruth" />
      <section className="ruth-overview" aria-labelledby="ruth-title">
        <div>
          <p className="eyebrow">Book of Ruth</p>
          <h1 id="ruth-title" className="hero-title">
            Begin in Ruth.
          </h1>
          <p className="hero-lede">
            Read the World English Bible text and open quiet paths as the story
            moves from famine to harvest, from grief to provision, and from
            Bethlehem toward a larger family line.
          </p>
          <div className="hero-actions">
            <Link href="/ruth/1" className="btn-primary">
              Start Ruth 1
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
        </div>

        <div className="garden-bed source-card">
          <p className="eyebrow">Source text</p>
          <h2 className="garden-card-title">{overview.translation.name}</h2>
          <p className="garden-card-body">
            {overview.translation.licenseNote} Scripture Garden keeps the text
            in view and lets the side paths stay secondary.
          </p>
        </div>
      </section>

      <section className="garden-grid" aria-label="Ruth chapters">
        {overview.chapters.map((chapter) => (
          <Link
            key={chapter.slug}
            href={`/ruth/${chapter.chapterNumber}`}
            className="chapter-card garden-bed"
          >
            <span className="eyebrow">Chapter {chapter.chapterNumber}</span>
            <span className="garden-card-title">{chapter.title}</span>
            <span className="garden-card-body">{chapter.summary}</span>
          </Link>
        ))}
      </section>
    </>
  );
}
