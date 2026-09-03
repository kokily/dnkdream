import type { MetadataRoute } from "next";
import { listCategories, listPublishedForSitemap, listTags } from "@/lib/queries/posts";

const site = "https://dnkdream.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, categories, tags] = await Promise.all([
    listPublishedForSitemap(),
    listCategories(),
    listTags(),
  ]);

  return [
    {
      url: site,
      lastModified: posts[0]?.updatedAt,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${site}/about`,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    ...categories.map((category) => ({
      url: `${site}/category/${encodeURIComponent(category)}`,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    })),
    ...tags.map((tag) => ({
      url: `${site}/tag/${encodeURIComponent(tag)}`,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    })),
    ...posts.map((post) => ({
      url: `${site}/post/${encodeURIComponent(post.slug)}`,
      lastModified: post.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
