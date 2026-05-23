"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, X } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  recordClientEvent,
  TrackEvent,
} from "@/components/analytics/track-event";
import type { NodeDetailData, PublicRelationship } from "@/components/reader/types";

function relationshipTarget(
  relationship: PublicRelationship,
  currentSlug: string,
) {
  return relationship.sourceNode.slug === currentSlug
    ? relationship.targetNode
    : relationship.sourceNode;
}

function focusableElements(container: HTMLElement) {
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      [
        "a[href]",
        "button:not([disabled])",
        "input:not([disabled])",
        "select:not([disabled])",
        "textarea:not([disabled])",
        "[tabindex]:not([tabindex='-1'])",
      ].join(","),
    ),
  ).filter((element) => !element.hasAttribute("disabled"));
}

export function DetailPanel({
  detail,
  chapterNumber,
}: {
  detail: NodeDetailData;
  chapterNumber: number;
}) {
  const router = useRouter();
  const [isCompact, setIsCompact] = useState(false);
  const panelRef = useRef<HTMLElement>(null);
  const openerRef = useRef<Element | null>(null);

  useLayoutEffect(() => {
    openerRef.current = document.activeElement;

    const frame = window.requestAnimationFrame(() => {
      panelRef.current?.focus({ preventScroll: true });
    });

    return () => {
      window.cancelAnimationFrame(frame);

      if (openerRef.current instanceof HTMLElement && openerRef.current.isConnected) {
        openerRef.current.focus({ preventScroll: true });
      }
    };
  }, [detail.node.slug]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 760px)");
    const updateCompactMode = () => setIsCompact(mediaQuery.matches);

    updateCompactMode();
    mediaQuery.addEventListener("change", updateCompactMode);

    return () => mediaQuery.removeEventListener("change", updateCompactMode);
  }, []);

  useEffect(() => {
    if (!isCompact) {
      return;
    }

    const inertElements = document.querySelectorAll<HTMLElement>(
      ".site-header, .reader-surface, .site-footer",
    );
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    inertElements.forEach((element) => element.setAttribute("inert", ""));

    return () => {
      document.body.style.overflow = previousOverflow;
      inertElements.forEach((element) => element.removeAttribute("inert"));
    };
  }, [isCompact]);

  const isStub = detail.node.nodeType === "external_stub";
  const closeHref = `/ruth/${chapterNumber}`;

  function recordReturnToRuth() {
    recordClientEvent({
      eventName: "return_to_ruth",
      pageSlug: `ruth-${chapterNumber}`,
      nodeSlug: detail.node.slug,
      metadata: { fromNodeSlug: detail.node.slug },
    });
  }

  function closeDetail() {
    recordReturnToRuth();
    router.push(closeHref, { scroll: false });
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLElement>) {
    if (event.key === "Escape" && isCompact) {
      event.preventDefault();
      closeDetail();
      return;
    }

    if (event.key !== "Tab" || !isCompact || !panelRef.current) {
      return;
    }

    const focusable = focusableElements(panelRef.current);

    if (focusable.length === 0) {
      event.preventDefault();
      panelRef.current.focus({ preventScroll: true });
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  return (
    <>
      <button
        className="reader-detail-backdrop"
        type="button"
        aria-label={`Close ${detail.node.displayName} detail`}
        tabIndex={-1}
        onClick={closeDetail}
      />
      <aside
        ref={panelRef}
        id="reader-detail"
        className="reader-detail reader-detail--selected"
        aria-labelledby="reader-detail-title"
        aria-describedby="reader-detail-summary"
        aria-modal={isCompact ? "true" : undefined}
        role={isCompact ? "dialog" : undefined}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
      >
        <TrackEvent
          eventName={isStub ? "stub_opened" : "entity_opened"}
          pageSlug={`ruth-${chapterNumber}`}
          nodeSlug={detail.node.slug}
          metadata={{ nodeSlug: detail.node.slug }}
        />

        <div className="reader-detail__topline">
          <p className="eyebrow">{isStub ? "Bounded stub" : detail.node.nodeType.replace("_", " ")}</p>
          <Link
            href={closeHref}
            className="icon-button"
            aria-label={`Close ${detail.node.displayName} detail`}
            scroll={false}
            onClick={recordReturnToRuth}
          >
            <X aria-hidden="true" className="size-4" />
          </Link>
        </div>

        <h2 id="reader-detail-title" className="reader-detail__title">
          {detail.node.displayName}
        </h2>
        <p id="reader-detail-summary" className="reader-detail__summary">
          {detail.node.summary}
        </p>

        {detail.node.externalReference ? (
          <p className="reference-note">
            Reference: <span>{detail.node.externalReference}</span>
          </p>
        ) : null}

        {detail.node.boundaryNote ? (
          <div className="boundary-note" role="note">
            <strong>Crossing the Ruth boundary</strong>
            <p>{detail.node.boundaryNote}</p>
          </div>
        ) : null}

        <section aria-labelledby="detail-anchors-title" className="detail-stack">
          <h3 id="detail-anchors-title" className="detail-section-title">
            Where this appears in Ruth
          </h3>
          <ul className="detail-list">
            {detail.anchors.map((anchor) => (
              <li key={anchor._id}>
                <Link
                  href={`/ruth/${anchor.passage.chapterNumber ?? chapterNumber}`}
                  className="detail-link"
                >
                  <span>{anchor.displayLabel}</span>
                  <small>
                    {anchor.startVerseKey === anchor.endVerseKey
                      ? anchor.startVerseKey
                      : `${anchor.startVerseKey} to ${anchor.endVerseKey}`}
                  </small>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="detail-paths-title" className="detail-stack">
          <h3 id="detail-paths-title" className="detail-section-title">
            Approved paths from here
          </h3>
          <ul className="detail-list">
            {detail.relationships.map((relationship) => {
              const target = relationshipTarget(relationship, detail.node.slug);

              return (
                <li key={relationship._id}>
                  <Link
                    href={`/ruth/${chapterNumber}?node=${target.slug}#reader-detail`}
                    className="relationship-link"
                    scroll={false}
                    onClick={() => {
                      recordClientEvent({
                        eventName: "relationship_followed",
                        pageSlug: `ruth-${chapterNumber}`,
                        nodeSlug: target.slug,
                        metadata: {
                          relationshipId: relationship._id,
                          fromNodeSlug: detail.node.slug,
                          toNodeSlug: target.slug,
                        },
                      });
                    }}
                  >
                    <span className="relationship-link__main">
                      {relationship.publicLabel}
                      <ArrowRight aria-hidden="true" className="size-4" />
                      {target.displayName}
                    </span>
                    <span className="evidence-badge">
                      {relationship.evidenceClass}
                    </span>
                    <span className="relationship-link__why">
                      {relationship.rationale}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      </aside>
    </>
  );
}
