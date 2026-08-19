import { marked } from "marked";
import GithubSlugger from "github-slugger";
import DOMPurify from "isomorphic-dompurify";

marked.setOptions({
  gfm: true,
  breaks: true,
});

export async function renderMarkdown(source: string) {
  const slugger = new GithubSlugger();

  marked.use({
    hooks: {
      preprocess(markdown) {
        slugger.reset();

        return markdown;
      },
    },
    renderer: {
      heading({ text, depth }) {
        const id = slugger.slug(text);

        return `<h${depth} id="${id}">${text}</h${depth}>\n`;
      },
    },
  });

  const html = await marked.parse(source);

  return DOMPurify.sanitize(html, {
    ADD_ATTR: ["id"],
  });
}
