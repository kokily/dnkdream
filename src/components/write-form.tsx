"use client";

import {
  useActionState,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ClipboardEvent,
  type KeyboardEvent,
} from "react";
import { useRouter } from "next/navigation";
import { createPostAction, saveDraftAction } from "@/lib/actions/posts";
import { uploadImageAction } from "@/lib/actions/upload";
import { renderMarkdown } from "@/lib/markdown";

type Draft = {
  id: string;
  category: string;
  title: string;
  body: string;
  thumbnail: string | null;
  publishedAt: Date | null;
  tags: { name: string }[];
};

const PAIRS: Record<string, string> = {
  "(": ")",
  "[": "]",
  "{": "}",
  "<": ">",
  '"': '"',
  "'": "'",
};

export default function WriteForm({ draft }: { draft?: Draft }) {
  const router = useRouter();
  const [error, formAction, pending] = useActionState(createPostAction, null);
  const [category, setCategory] = useState(draft?.category ?? "");
  const [title, setTitle] = useState(draft?.title ?? "");
  const [tags, setTags] = useState(
    draft?.tags.map((tag) => tag.name).join(", ") ?? "",
  );
  const [body, setBody] = useState(draft?.body ?? "");
  const [thumbnail, setThumbnail] = useState(draft?.thumbnail ?? "");
  const [draftId, setDraftId] = useState(draft?.id ?? "");
  const [status, setStatus] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [isPublished, setIsPublished] = useState(!!draft?.publishedAt);
  const formRef = useRef<HTMLFormElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const bodyRef = useRef(body);
  const dragCount = useRef(0);
  const selectionRef = useRef<{ start: number; end: number } | null>(null);

  bodyRef.current = body;

  useLayoutEffect(() => {
    const el = textareaRef.current;
    const selection = selectionRef.current;
    if (!el || !selection) return;
    el.setSelectionRange(selection.start, selection.end);
    selectionRef.current = null;
  }, [body]);

  const plainPreview = useMemo(() => renderMarkdown(body), [body]);
  const [preview, setPreview] = useState(plainPreview);

  useEffect(() => {
    setPreview(plainPreview);

    if (!body.includes("```")) return;

    let cancelled = false;
    const timer = window.setTimeout(() => {
      void import("@/lib/markdown-highlight").then(({ renderMarkdownHtml }) =>
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

  function replaceBody(next: string, start: number, end: number) {
    bodyRef.current = next;
    selectionRef.current = { start, end };
    setBody(next);
  }

  function insertAtCursor(snippet: string) {
    const el = textareaRef.current;
    const current = el?.value ?? bodyRef.current;
    const start = el?.selectionStart ?? current.length;
    const end = el?.selectionEnd ?? start;
    const next = `${current.slice(0, start)}\n\n${snippet}\n${current.slice(end)}`;
    const pos = start + snippet.length + 3;
    replaceBody(next, pos, pos);
  }

  async function uploadFile(file: File, asThumbnail = false) {
    setStatus("이미지 올리는 중...");

    const data = new FormData();
    data.append("file", file);

    const result = await uploadImageAction(data);

    if ("error" in result && result.error) {
      setStatus(result.error);
      return;
    }

    if (!("url" in result) || !result.url) {
      setStatus("업로드에 실패했습니다");
      return;
    }

    if (asThumbnail) {
      setThumbnail(result.url);
      setStatus("썸네일을 넣었습니다");
      return;
    }

    insertAtCursor(`![](${result.url})`);
    setStatus(null);
  }

  function pickFile(asThumbnail = false) {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/jpeg,image/png,image/gif,image/webp,image/avif";
    input.onchange = () => {
      const file = input.files?.[0];
      if (file) void uploadFile(file, asThumbnail);
    };
    input.click();
  }

  async function saveDraft() {
    const form = formRef.current;

    if (!form) {
      return;
    }

    setStatus("임시 저장 중...");

    const result = await saveDraftAction(new FormData(form));

    if (!result.id) {
      setStatus(result.error ?? "임시 저장에 실패했습니다");
      return;
    }

    setDraftId(result.id);
    setIsPublished(false);
    setStatus(
      result.unpublished
        ? "임시글로 되돌렸습니다. 홈에서는 더 이상 보이지 않습니다."
        : "임시 저장했습니다",
    );

    if (!draft?.id) {
      router.replace(`/write/${result.id}`);
    }
  }

  useEffect(() => {
    const onDragOver = (event: DragEvent) => {
      event.preventDefault();
      if (event.dataTransfer) event.dataTransfer.dropEffect = "copy";
    };

    const onDragEnter = () => {
      dragCount.current += 1;
      setDragging(true);
    };

    const onDragLeave = () => {
      dragCount.current -= 1;
      if (dragCount.current <= 0) {
        dragCount.current = 0;
        setDragging(false);
      }
    };

    const onDrop = (event: DragEvent) => {
      event.preventDefault();
      dragCount.current = 0;
      setDragging(false);

      const files = [...(event.dataTransfer?.files ?? [])].filter((file) =>
        file.type.startsWith("image/"),
      );

      void files.reduce(
        (chain, file) => chain.then(() => uploadFile(file)),
        Promise.resolve(),
      );
    };

    window.addEventListener("dragover", onDragOver);
    window.addEventListener("dragenter", onDragEnter);
    window.addEventListener("dragleave", onDragLeave);
    window.addEventListener("drop", onDrop);

    return () => {
      window.removeEventListener("dragover", onDragOver);
      window.removeEventListener("dragenter", onDragEnter);
      window.removeEventListener("dragleave", onDragLeave);
      window.removeEventListener("drop", onDrop);
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        void saveDraft();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  });

  function onPaste(event: ClipboardEvent<HTMLTextAreaElement>) {
    const files = [...event.clipboardData.files].filter((file) =>
      file.type.startsWith("image/"),
    );
    if (files.length === 0) return;

    event.preventDefault();
    void files.reduce(
      (chain, file) => chain.then(() => uploadFile(file)),
      Promise.resolve(),
    );
  }

  function applyLineIndent(direction: "in" | "out") {
    const el = textareaRef.current;
    if (!el) return;

    const current = el.value;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const indent = "  ";
    const lineStart = current.lastIndexOf("\n", start - 1) + 1;
    const nextBreak = current.indexOf("\n", end);
    const blockEnd = nextBreak === -1 ? current.length : nextBreak;
    const lines = current.slice(lineStart, blockEnd).split("\n");

    let startDelta = 0;
    let endDelta = 0;

    const nextLines = lines.map((line, index) => {
      if (direction === "in") {
        if (index === 0) startDelta = indent.length;
        endDelta += indent.length;
        return `${indent}${line}`;
      }

      if (line.startsWith(indent)) {
        if (index === 0) startDelta = -indent.length;
        endDelta -= indent.length;
        return line.slice(indent.length);
      }

      if (line.startsWith("\t")) {
        if (index === 0) startDelta = -1;
        endDelta -= 1;
        return line.slice(1);
      }

      return line;
    });

    replaceBody(
      `${current.slice(0, lineStart)}${nextLines.join("\n")}${current.slice(blockEnd)}`,
      Math.max(lineStart, start + startDelta),
      Math.max(lineStart, end + endDelta),
    );
  }

  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    const closer = PAIRS[event.key];
    const modified = event.ctrlKey || event.metaKey || event.altKey;

    if (closer && !modified) {
      event.preventDefault();
      const el = event.currentTarget;
      const current = el.value;
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const selected = current.slice(start, end);
      const next = `${current.slice(0, start)}${event.key}${selected}${closer}${current.slice(end)}`;
      replaceBody(next, start + 1, start + 1 + selected.length);
      return;
    }

    if (
      !modified &&
      Object.values(PAIRS).includes(event.key) &&
      event.currentTarget.selectionStart === event.currentTarget.selectionEnd &&
      event.currentTarget.value[event.currentTarget.selectionStart] ===
        event.key
    ) {
      event.preventDefault();
      const pos = event.currentTarget.selectionStart + 1;
      event.currentTarget.setSelectionRange(pos, pos);
      return;
    }

    if (event.key === "Tab") {
      event.preventDefault();

      const el = event.currentTarget;

      if (!event.shiftKey && el.selectionStart === el.selectionEnd) {
        const start = el.selectionStart;
        const current = el.value;
        const indent = "  ";
        replaceBody(
          `${current.slice(0, start)}${indent}${current.slice(start)}`,
          start + indent.length,
          start + indent.length,
        );
        return;
      }

      applyLineIndent(event.shiftKey ? "out" : "in");
      return;
    }

    if (
      (event.ctrlKey || event.metaKey) &&
      event.shiftKey &&
      event.key.toLowerCase() === "u"
    ) {
      event.preventDefault();
      pickFile();
      return;
    }

    if (event.key !== "Enter") return;

    const el = event.currentTarget;
    const current = el.value;
    const untilCursor = current.slice(0, el.selectionStart);
    const line = untilCursor.split("\n").at(-1)?.trim() ?? "";

    if (line !== "/image" && line !== "/이미지") return;

    event.preventDefault();
    const lineStart = untilCursor.lastIndexOf("\n") + 1;
    const next = current.slice(0, lineStart) + current.slice(el.selectionEnd);
    replaceBody(next, lineStart, lineStart);
    pickFile();
  }

  return (
    <form
      ref={formRef}
      action={formAction}
      className="relative flex min-h-0 flex-1 flex-col"
    >
      <input type="hidden" name="id" value={draftId} />
      <input type="hidden" name="thumbnail" value={thumbnail} />

      <div className="flex flex-wrap items-center gap-3 border-b border-line px-4 py-3">
        <input
          name="category"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          placeholder="카테고리"
          className="w-36 rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-mint"
        />
        <input
          name="title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="제목"
          className="min-w-60 flex-1 rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-mint"
        />
        <input
          name="tags"
          value={tags}
          onChange={(event) => setTags(event.target.value)}
          placeholder="태그, 쉼표로 구분"
          className="min-w-48 flex-1 rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-mint"
        />
        <button
          type="button"
          onClick={() => pickFile(true)}
          className="rounded-md border border-line px-3 py-2 text-sm hover:border-mint"
        >
          {thumbnail ? "썸네일 변경" : "썸네일"}
        </button>
        <button
          type="button"
          onClick={() => pickFile()}
          className="rounded-md border border-line px-3 py-2 text-sm hover:border-mint"
        >
          이미지
        </button>
        <button
          type="button"
          onClick={() => void saveDraft()}
          className="rounded-md border border-line px-3 py-2 text-sm hover:border-mint"
        >
          임시저장
        </button>
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-charcoal px-4 py-2 text-sm text-white hover:bg-ink disabled:opacity-60"
        >
          {pending ? "저장 중..." : "발행"}
        </button>
      </div>

      {(error || status) && (
        <p className="border-b border-line px-4 py-2 text-sm text-red-600">
          {error ?? status}
        </p>
      )}

      <div className="grid min-h-0 flex-1 md:grid-cols-2">
        <textarea
          ref={textareaRef}
          name="body"
          value={body}
          onChange={(event) => {
            bodyRef.current = event.target.value;
            setBody(event.target.value);
          }}
          onPaste={onPaste}
          onKeyDown={onKeyDown}
          placeholder="마크다운으로 작성하세요. Ctrl+S 임시저장. 이미지: 드래그, Ctrl+Shift+U, /image 후 Enter."
          className="min-h-[60vh] resize-none border-r border-line bg-white p-4 font-mono outline-none"
        />
        <div
          className="markdown min-h-[60vh] overflow-auto p-4"
          dangerouslySetInnerHTML={{ __html: preview }}
        />
      </div>

      {dragging && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-mint/20 text-lg font-semibold text-charcoal">
          이미지를 놓으면 본문에 넣습니다
        </div>
      )}
    </form>
  );
}
