"use client";

import { useEffect } from "react";
import type {
  AnalyticsEventName,
  AnalyticsMetadata,
} from "@/lib/analytics/events";

type TrackEventProps = {
  eventName: AnalyticsEventName;
  pageSlug?: string;
  nodeSlug?: string;
  metadata?: AnalyticsMetadata;
};

function getSessionId() {
  const key = "scripture-garden-session";
  const existing = window.sessionStorage.getItem(key);

  if (existing) {
    return existing;
  }

  const next = window.crypto.randomUUID();
  window.sessionStorage.setItem(key, next);
  return next;
}

export function recordClientEvent({
  eventName,
  pageSlug,
  nodeSlug,
  metadata,
}: TrackEventProps) {
  const payload = JSON.stringify({
    eventName,
    sessionId: getSessionId(),
    pageSlug,
    nodeSlug,
    metadata,
  });

  if (navigator.sendBeacon) {
    navigator.sendBeacon(
      "/api/analytics",
      new Blob([payload], { type: "application/json" }),
    );
    return;
  }

  void fetch("/api/analytics", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: payload,
    keepalive: true,
  });
}

export function TrackEvent({
  eventName,
  pageSlug,
  nodeSlug,
  metadata,
}: TrackEventProps) {
  useEffect(() => {
    recordClientEvent({ eventName, pageSlug, nodeSlug, metadata });
  }, [eventName, metadata, nodeSlug, pageSlug]);

  return null;
}
