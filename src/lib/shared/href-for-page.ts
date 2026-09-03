export function hrefForPage(basePath: string, page: number, query: string) {
  const params = new URLSearchParams();

  if (query) params.set("q", query);
  if (page > 1) params.set("page", String(page));

  const qs = params.toString();

  return qs ? `${basePath}?${qs}` : basePath;
}
