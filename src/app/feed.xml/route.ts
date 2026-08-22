import { prisma } from "@/lib/db";

const site = "https://dnkdream.com";

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export async function GET() {
  const posts = await prisma.post.findMany({
    where: { publishedAt: { not: null } },
    select: {
      slug: true,
      title: true,
      category: true,
      body: true,
      publishedAt: true,
      updatedAt: true,
    },
    orderBy: { publishedAt: "desc" },
  });

  const items = posts
    .map((post) => {
      const url = `${site}/post/${encodeURIComponent(post.slug)}`;
      const date = (post.publishedAt ?? post.updatedAt).toUTCString();
      const summary = escapeXml(
        post.body.replace(/\s+/g, " ").trim().slice(0, 180),
      );

      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid>${url}</guid>
      <category>${escapeXml(post.category)}</category>
      <pubDate>${date}</pubDate>
      <description>${summary}</description>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>D&amp;K Dreams Blog</title>
    <link>${site}</link>
    <description>개발과 일상을 기록하는 D&amp;K Dreams 블로그</description>
    <language>ko</language>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "s-maxage=600, stale-while-revalidate",
    },
  });
}
