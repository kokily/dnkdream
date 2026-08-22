import { Marked } from "marked";
import GithubSlugger from "github-slugger";
import DOMPurify from "isomorphic-dompurify";
import { extractYoutubeId, youtubeEmbed } from "@/lib/youtube";

export type TocItem = {
  id: string;
  text: string;
  depth: 2 | 3;
};

function escapeAttr(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;");
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

export function sanitizeMarkdownHtml(html: string) {
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
      "style",
      "tabindex",
    ],
  });
}

export function createMarkdownParser(options?: {
  highlight?: (text: string, lang: string) => string;
}) {
  const toc: TocItem[] = [];
  const slugger = new GithubSlugger();
  const highlight = options?.highlight;

  const marked = new Marked({
    gfm: true,
    breaks: true,
    renderer: {
      heading({ text, depth }) {
        const id = slugger.slug(text);

        if (depth === 2 || depth === 3) {
          toc.push({ id, text, depth });
        }

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
      code({ text, lang }) {
        const highlighted = highlight?.(text, lang ?? "");
        if (highlighted) return highlighted;

        const language = lang ? ` class="language-${escapeAttr(lang)}"` : "";
        return `<pre><code${language}>${escapeHtml(text)}</code></pre>\n`;
      },
    },
  });

  return { marked, toc };
}

export function renderMarkdown(source: string) {
  const { marked } = createMarkdownParser();
  const html = marked.parse(source, { async: false }) as string;
  return sanitizeMarkdownHtml(html);
}
