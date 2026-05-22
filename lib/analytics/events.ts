export const ANALYTICS_EVENT_NAMES = [
  "ruth_entry",
  "chapter_viewed",
  "entity_opened",
  "relationship_followed",
  "stub_opened",
  "return_to_ruth",
  "overlay_density_changed",
] as const;

export type AnalyticsEventName = (typeof ANALYTICS_EVENT_NAMES)[number];

export type AnalyticsMetadata = Record<string, string | number | boolean>;

export type AnalyticsPayload = {
  eventName: AnalyticsEventName;
  sessionId: string;
  pageSlug?: string;
  nodeSlug?: string;
  metadata?: AnalyticsMetadata;
};

const eventNameSet = new Set<string>(ANALYTICS_EVENT_NAMES);

export function isAnalyticsEventName(value: unknown): value is AnalyticsEventName {
  return typeof value === "string" && eventNameSet.has(value);
}

function sanitizeString(value: unknown) {
  return typeof value === "string" && value.trim().length > 0
    ? value.trim().slice(0, 80)
    : undefined;
}

function sanitizeMetadata(value: unknown): AnalyticsMetadata | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return undefined;
  }

  const entries = Object.entries(value).filter(([, entryValue]) =>
    ["string", "number", "boolean"].includes(typeof entryValue),
  );

  if (entries.length === 0) {
    return undefined;
  }

  return Object.fromEntries(entries.slice(0, 8)) as AnalyticsMetadata;
}

export function sanitizeAnalyticsPayload(value: unknown): AnalyticsPayload | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const raw = value as Record<string, unknown>;
  const sessionId = sanitizeString(raw.sessionId);

  if (!isAnalyticsEventName(raw.eventName) || !sessionId) {
    return null;
  }

  return {
    eventName: raw.eventName,
    sessionId,
    pageSlug: sanitizeString(raw.pageSlug),
    nodeSlug: sanitizeString(raw.nodeSlug),
    metadata: sanitizeMetadata(raw.metadata),
  };
}
