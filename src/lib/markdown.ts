import { Marked } from "marked";
import GithubSlugger from "github-slugger";
import DOMPurify from "isomorphic-dompurify";
import { extractYoutubeId, youtubeEmbed } from "@/lib/youtube";

function escapeAttr(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;");
}

export function renderMarkdown(source: string) {
  const slugger = new GithubSlugger();
  const marked = new Marked({
    gfm: true,
    breaks: true,
    renderer: {
      heading({ text, depth }) {
        const id = slugger.slug(text);
        return `<h${depth} id="${id}">${text}</h${depth}>\n`;
      },
      image({ href, text }) {
        if (!href) return text;
        const id = extractYoutubeId(href);
        if (id) return youtubeEmbed(id);
        return `<img src="${escapeAttr(href)}" alt="${escapeAttr(text)}" />`;
      },
      link({ href, title, text }) {
        if (!href) return text;
        const id = extractYoutubeId(href);
        if (id) return youtubeEmbed(id);
        const titleAttr = title ? ` title="${escapeAttr(title)}"` : "";
        return `<a href="${escapeAttr(href)}"${titleAttr}>${text}</a>`;
      },
    },
  });

  const html = marked.parse(source, { async: false }) as string;

  return DOMPurify.sanitize(html, {
    ADD_TAGS: ["iframe"],
    ADD_ATTR: [
      "allow",
      "allowfullscreen",
      "frameborder",
      "loading",
      "referrerpolicy",
      "id",
      "class",
    ],
  });
}
