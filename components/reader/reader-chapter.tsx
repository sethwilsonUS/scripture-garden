"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { recordClientEvent } from "@/components/analytics/track-event";
import { DetailPanel } from "@/components/reader/detail-panel";
import type {
  NodeDetailData,
  PublicAnchor,
  ReaderChapterData,
} from "@/components/reader/types";

type OverlayDensity = "focused" | "full" | "hidden";

function verseNumberFromKey(verseKey: string | null) {
  if (!verseKey) {
    return null;
  }

  const [, , verse] = verseKey.split(".");
  return Number(verse);
}

function anchorTouchesVerse(anchor: PublicAnchor, verseNumber: number) {
  const start = verseNumberFromKey(anchor.startVerseKey);
  const end = verseNumberFromKey(anchor.endVerseKey);

  if (!start || !end) {
    return false;
  }

  return verseNumber >= start && verseNumber <= end;
}

function visibleAnchorsForDensity(
  anchors: PublicAnchor[],
  density: OverlayDensity,
) {
  if (density === "hidden") {
    return [];
  }

  if (density === "full") {
    return anchors;
  }

  return anchors.filter((anchor) =>
    ["primary", "context"].includes(anchor.anchorKind),
  );
}

function recordOverlayChange(density: OverlayDensity, chapterNumber: number) {
  recordClientEvent({
    eventName: "overlay_density_changed",
    pageSlug: `ruth-${chapterNumber}`,
    metadata: { overlayDensity: density },
  });
}

export function ReaderChapter({
  data,
  selectedDetail,
}: {
  data: ReaderChapterData;
  selectedDetail: NodeDetailData | null;
}) {
  const [density, setDensity] = useState<OverlayDensity>("focused");

  useEffect(() => {
    window.sessionStorage.setItem(
      "scripture-garden-last-location",
      `/ruth/${data.chapter.number}`,
    );
  }, [data.chapter.number]);

  const anchorsByVerse = useMemo(() => {
    const visibleAnchors = visibleAnchorsForDensity(data.anchors, density);

    return new Map(
      data.verses.map((verse) => [
        verse.verseNumber,
        visibleAnchors.filter((anchor) =>
          anchorTouchesVerse(anchor, verse.verseNumber),
        ),
      ]),
    );
  }, [data.anchors, data.verses, density]);

  return (
    <div className="reader-layout">
      <article className="reader-surface" aria-labelledby="reader-title">
        <nav className="breadcrumb-nav" aria-label="Reader breadcrumb">
          <Link href="/">Scripture Garden</Link>
          <span aria-hidden="true">/</span>
          <Link href="/ruth">Ruth</Link>
          <span aria-hidden="true">/</span>
          <span>Chapter {data.chapter.number}</span>
        </nav>

        <header className="reader-header">
          <div>
            <p className="eyebrow">World English Bible</p>
            <h1 id="reader-title" className="reader-title">
              Ruth {data.chapter.number}
            </h1>
            <p className="reader-lede">
              Read the chapter, then follow a few approved paths through people,
              places, practices, and bounded stubs.
            </p>
          </div>

          <fieldset className="overlay-control">
            <legend>Semantic paths</legend>
            {(["focused", "full", "hidden"] as const).map((value) => (
              <label key={value}>
                <input
                  type="radio"
                  name="overlay-density"
                  value={value}
                  checked={density === value}
                  onChange={() => {
                    setDensity(value);
                    recordOverlayChange(value, data.chapter.number);
                  }}
                />
                <span>{value}</span>
              </label>
            ))}
          </fieldset>
        </header>

        <nav className="chapter-nav" aria-label="Ruth chapter navigation">
          {Array.from({ length: data.book.chapterCount }, (_, index) => {
            const chapter = index + 1;
            const active = chapter === data.chapter.number;

            return (
              <Link
                key={chapter}
                href={`/ruth/${chapter}`}
                aria-current={active ? "page" : undefined}
                className={active ? "chapter-nav__link is-active" : "chapter-nav__link"}
              >
                Ruth {chapter}
              </Link>
            );
          })}
        </nav>

        <div className="scripture-text" aria-label={`Ruth ${data.chapter.number} text`}>
          {data.verses.map((verse) => {
            const anchors = anchorsByVerse.get(verse.verseNumber) ?? [];

            return (
              <section
                key={verse.verseKey}
                id={verse.verseKey}
                className="verse-row"
                aria-labelledby={`${verse.verseKey}-label`}
              >
                <p className="verse-copy">
                  <span id={`${verse.verseKey}-label`} className="verse-number">
                    {verse.verseNumber}
                  </span>
                  {verse.text}
                </p>

                {anchors.length > 0 ? (
                  <ul className="verse-paths" aria-label={`Curated paths from ${verse.osisRef}`}>
                    {anchors.map((anchor) => (
                      <li key={anchor._id}>
                        <Link
                          href={`/ruth/${data.chapter.number}?node=${anchor.node.slug}#reader-detail`}
                          className={`entity-chip entity-chip--${anchor.node.nodeType}`}
                          scroll={false}
                        >
                          <span>{anchor.node.shortLabel}</span>
                          <small>{anchor.displayLabel}</small>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </section>
            );
          })}
        </div>

        <nav className="reader-pager" aria-label="Previous and next Ruth chapter">
          {data.chapter.previous ? (
            <Link href={`/ruth/${data.chapter.previous}`} className="btn-secondary">
              <ArrowLeft aria-hidden="true" className="size-4" />
              Ruth {data.chapter.previous}
            </Link>
          ) : (
            <span />
          )}
          {data.chapter.next ? (
            <Link href={`/ruth/${data.chapter.next}`} className="btn-primary">
              Ruth {data.chapter.next}
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          ) : (
            <Link href="/ruth" className="btn-secondary">
              Return to Ruth overview
            </Link>
          )}
        </nav>
      </article>

      {selectedDetail ? (
        <DetailPanel
          detail={selectedDetail}
          chapterNumber={data.chapter.number}
        />
      ) : (
        <aside className="reader-detail reader-detail--empty" aria-labelledby="paths-title">
          <h2 id="paths-title" className="reader-detail__title">
            Paths are ready when you are.
          </h2>
          <p className="reader-detail__summary">
            Choose a chip in the text to open a curated, human-approved doorway
            without losing your place in Ruth.
          </p>
        </aside>
      )}
    </div>
  );
}
