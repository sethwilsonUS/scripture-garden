import { fetchMutation } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { sanitizeAnalyticsPayload } from "@/lib/analytics/events";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const payload = sanitizeAnalyticsPayload(body);

  if (!payload) {
    return Response.json({ ok: false }, { status: 400 });
  }

  await fetchMutation(api.analytics.record, {
    eventName: payload.eventName,
    sessionId: payload.sessionId,
    pageSlug: payload.pageSlug,
    nodeSlug: payload.nodeSlug,
    metadata: payload.metadata,
  });

  return Response.json({ ok: true });
}
