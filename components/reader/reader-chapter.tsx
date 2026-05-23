"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { recordClientEvent } from "@/components/analytics/track-event";
import { DetailPanel } from "@/components/reader/detail-panel";
import type {
  NodeDetailData,
  PublicTextLink,
  ReaderChapterData,
} from "@/components/reader/types";
import {
  type OverlayDensity,
  resolveTextSegments,
  visibleNoteAnchorsForVerse,
} from "@/components/reader/text-link-segments";

const densityOptions = [
  { value: "focused", label: "Quiet" },
  { value: "full", label: "All paths" },
  { value: "hidden", label: "Text only" },
] as const;

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

  const textLinksByVerse = useMemo(() => {
    const grouped = new Map<string, PublicTextLink[]>();

    for (const textLink of data.textLinks) {
      grouped.set(textLink.verseKey, [
        ...(grouped.get(textLink.verseKey) ?? []),
        textLink,
      ]);
    }

    return grouped;
  }, [data.textLinks]);

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
              Read the chapter, then open a few paths through people, places,
              practices, and echoes in the story.
            </p>
          </div>

          <fieldset className="overlay-control">
            <legend>Garden paths</legend>
            {densityOptions.map((option) => (
              <label key={option.value}>
                <input
                  type="radio"
                  name="overlay-density"
                  value={option.value}
                  checked={density === option.value}
                  onChange={() => {
                    setDensity(option.value);
                    recordOverlayChange(option.value, data.chapter.number);
                  }}
                />
                <span>{option.label}</span>
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
            const textSegments = resolveTextSegments({
              text: verse.text,
              links: textLinksByVerse.get(verse.verseKey) ?? [],
              density,
            });
            const noteAnchors = visibleNoteAnchorsForVerse({
              anchors: data.anchors,
              density,
              verseKey: verse.verseKey,
            });

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
                  {textSegments.map((segment, index) => {
                    if (segment.kind === "text") {
                      return (
                        <span key={`${verse.verseKey}-text-${index}`}>
                          {segment.text}
                        </span>
                      );
                    }

                    const labelTarget =
                      segment.link.contextLabel ?? segment.link.node.displayName;

                    return (
                      <Link
                        key={segment.link._id}
                        href={`/ruth/${data.chapter.number}?node=${segment.link.node.slug}#reader-detail`}
                        className={`scripture-link scripture-link--${segment.link.node.nodeType}`}
                        scroll={false}
                        aria-label={`Open ${labelTarget} detail from "${segment.text}"`}
                      >
                        {segment.text}
                      </Link>
                    );
                  })}
                </p>

                {noteAnchors.length > 0 ? (
                  <ul className="verse-notes" aria-label={`Garden notes from ${verse.osisRef}`}>
                    {noteAnchors.map((anchor) => (
                      <li key={anchor._id}>
                        <Link
                          href={`/ruth/${data.chapter.number}?node=${anchor.node.slug}#reader-detail`}
                          className={`garden-note-link garden-note-link--${anchor.node.nodeType}`}
                          scroll={false}
                        >
                          <span>{anchor.displayLabel}</span>
                          <small>{anchor.node.shortLabel}</small>
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
            Paths are waiting nearby.
          </h2>
          <p className="reader-detail__summary">
            Choose a marker in the text to open a small note without losing
            your place in Ruth.
          </p>
        </aside>
      )}
    </div>
  );
}
