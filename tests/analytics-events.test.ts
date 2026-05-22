import {
  isAnalyticsEventName,
  sanitizeAnalyticsPayload,
} from "@/lib/analytics/events";
import { describe, expect, it } from "vitest";

describe("analytics event validation", () => {
  it("accepts only bounded MVP event names", () => {
    expect(isAnalyticsEventName("ruth_entry")).toBe(true);
    expect(isAnalyticsEventName("search_performed")).toBe(false);
    expect(isAnalyticsEventName("ai_chat_prompted")).toBe(false);
  });

  it("sanitizes payloads before recording", () => {
    const payload = sanitizeAnalyticsPayload({
      eventName: "entity_opened",
      sessionId: " session-1 ",
      pageSlug: "ruth-1",
      nodeSlug: "ruth",
      metadata: {
        nodeSlug: "ruth",
        count: 1,
        public: true,
        nested: { no: "thanks" },
      },
    });

    expect(payload).toEqual({
      eventName: "entity_opened",
      sessionId: "session-1",
      pageSlug: "ruth-1",
      nodeSlug: "ruth",
      metadata: {
        nodeSlug: "ruth",
        count: 1,
        public: true,
      },
    });
  });
});
