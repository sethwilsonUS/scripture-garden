import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchQuery } from "convex/nextjs";
import { TrackEvent } from "@/components/analytics/track-event";
import { ReaderChapter } from "@/components/reader/reader-chapter";
import type {
  NodeDetailData,
  ReaderChapterData,
} from "@/components/reader/types";
import { api } from "@/convex/_generated/api";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ chapter: string }>;
}): Promise<Metadata> {
  const { chapter } = await params;
  return {
    title: `Ruth ${chapter}`,
    description: `Read Ruth ${chapter} in the World English Bible with curated Scripture Garden paths.`,
  };
}

export default async function RuthChapterPage({
  params,
  searchParams,
}: {
  params: Promise<{ chapter: string }>;
  searchParams: Promise<{ node?: string }>;
}) {
  const [{ chapter }, query] = await Promise.all([params, searchParams]);
  const chapterNumber = Number(chapter);

  if (!Number.isInteger(chapterNumber)) {
    notFound();
  }

  const data = (await fetchQuery(api.scripture.getRuthChapter, {
    chapterNumber,
  })) as ReaderChapterData | null;

  if (!data) {
    notFound();
  }

  const selectedDetail = query.node
    ? ((await fetchQuery(api.semantic.getNodeDetail, {
        slug: query.node,
      })) as NodeDetailData | null)
    : null;

  return (
    <>
      <TrackEvent
        eventName="chapter_viewed"
        pageSlug={`ruth-${chapterNumber}`}
        metadata={{ chapterNumber }}
      />
      <ReaderChapter data={data} selectedDetail={selectedDetail} />
    </>
  );
}
