const YOUTUBE_ID = /^[\w-]{11}$/;

export function extractYoutubeId(url: string) {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^ww\./, "");

    if (host === "youtu.be") {
      const id = parsed.pathname.split("/").filter(Boolean)[0];

      return id && YOUTUBE_ID.test(id) ? id : null;
    }

    if (
      host === "youtube.com" ||
      host === "m.youtube.com" ||
      host === "youtube-nocookie.com"
    ) {
      const fromQuery = parsed.searchParams.get("v");

      if (fromQuery && YOUTUBE_ID.test(fromQuery)) return fromQuery;

      const parts = parsed.pathname.split("/").filter(Boolean);

      if (
        parts[1] &&
        ["embed", "shorts", "live", "v"].includes(parts[0]) &&
        YOUTUBE_ID.test(parts[1])
      ) {
        return parts[1];
      }
    }
  } catch {
    return null;
  }

  return null;
}

export function youtubeEmbed(id: string) {
  return `<iframe class="markdown-video" src="https://www.youtube-nocookie.com/embed/${id}" title="YouTube video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>`;
}
