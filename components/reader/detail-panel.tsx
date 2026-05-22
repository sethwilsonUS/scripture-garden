"use client";

import Link from "next/link";
import { ArrowRight, X } from "lucide-react";
import { useLayoutEffect, useRef } from "react";
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

export function DetailPanel({
  detail,
  chapterNumber,
}: {
  detail: NodeDetailData;
  chapterNumber: number;
}) {
  const panelRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      panelRef.current?.focus({ preventScroll: true });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [detail.node.slug]);

  const isStub = detail.node.nodeType === "external_stub";

  return (
    <aside
      ref={panelRef}
      id="reader-detail"
      className="reader-detail"
      aria-labelledby="reader-detail-title"
      tabIndex={-1}
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
          href={`/ruth/${chapterNumber}`}
          className="icon-button"
          aria-label={`Close ${detail.node.displayName} detail`}
          scroll={false}
          onClick={() => {
            recordClientEvent({
              eventName: "return_to_ruth",
              pageSlug: `ruth-${chapterNumber}`,
              nodeSlug: detail.node.slug,
              metadata: { fromNodeSlug: detail.node.slug },
            });
          }}
        >
          <X aria-hidden="true" className="size-4" />
        </Link>
      </div>

      <h2 id="reader-detail-title" className="reader-detail__title">
        {detail.node.displayName}
      </h2>
      <p className="reader-detail__summary">{detail.node.summary}</p>

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
  );
}
