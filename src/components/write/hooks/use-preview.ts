"use client";

import { useEffect, useMemo, useState } from "react";
import { renderMarkdown } from "@/lib/shared/markdown";

export function useWritePreview(body: string) {
  const plainPreview = useMemo(() => renderMarkdown(body), [body]);
  const [preview, setPreview] = useState(plainPreview);

  useEffect(() => {
    setPreview(plainPreview);

    if (!body.includes("```")) return;

    let cancelled = false;
    const timer = window.setTimeout(() => {
      void import("@/lib/shared/markdown-highlight").then(({ renderMarkdownHtml }) =>
        renderMarkdownHtml(body).then((html) => {
          if (!cancelled) setPreview(html);
        }),
      );
    }, 250);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [body, plainPreview]);

  return preview;
}
