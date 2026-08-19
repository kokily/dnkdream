import GithubSlugger from "github-slugger";

export function slugifyTitle(title: string) {
  const slug = new GithubSlugger().slug(title.trim());

  return slug || `post-${crypto.randomUUID().slice(0, 8)}`;
}
