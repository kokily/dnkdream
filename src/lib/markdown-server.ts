import "server-only";
import { lexer, type Token } from "marked";
import { createHighlighter, type Highlighter } from "shiki";
import { createMarkdownParser, sanitizeMarkdownHtml } from "@/lib/markdown";

let highlighterPromise: Promise<Highlighter> | undefined;

function getHighlighter() {
  highlighterPromise ??= createHighlighter({
    themes: ["github-dark"],
    langs: [
      "javascript",
      "typescript",
      "tsx",
      "jsx",
      "json",
      "html",
      "css",
      "bash",
      "shell",
      "python",
      "sql",
      "markdown",
      "yaml",
      "diff",
      "text",
    ],
  });

  return highlighterPromise;
}

async function highlight(text: string, lang: string) {
  const highlighter = await getHighlighter();

  try {
    return highlighter.codeToHtml(text, {
      lang: lang.trim() || "text",
      theme: "github-dark",
    });
  } catch {
    return highlighter.codeToHtml(text, {
      lang: "text",
      theme: "github-dark",
    });
  }
}

function codeKey(lang: string, text: string) {
  return `${lang}\0${text}`;
}

async function collectCode(tokens: Token[], cache: Map<string, string>) {
  for (const token of tokens) {
    if (token.type === "code") {
      const lang = token.lang ?? "";
      const key = codeKey(lang, token.text);
      if (!cache.has(key)) {
        cache.set(key, await highlight(token.text, lang));
      }
    }

    if ("tokens" in token && token.tokens) {
      await collectCode(token.tokens, cache);
    }

    if ("items" in token && token.items) {
      await collectCode(token.items, cache);
    }
  }
}

export async function renderMarkdownWithToc(source: string) {
  const cache = new Map<string, string>();
  await collectCode(lexer(source, { gfm: true, breaks: true }), cache);

  const { marked, toc } = createMarkdownParser({
    highlight: (text, lang) => cache.get(codeKey(lang, text)) ?? "",
  });
  const html = marked.parse(source, { async: false }) as string;

  return {
    toc,
    html: sanitizeMarkdownHtml(html),
  };
}
