"use client";

import {
  useActionState,
  useEffect,
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
  tags: { name: string }[];
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
  const [draftId, setDraftId] = useState(draft?.id ?? ""); // 임시저장: 첫 저장 후 id 유지
  const [status, setStatus] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const bodyRef = useRef(body);
  const dragCount = useRef(0);

  bodyRef.current = body;

  const preview = useMemo(() => renderMarkdown(body), [body]);

  function insertAtCursor(snippet: string) {
    const current = bodyRef.current;
    const el = textareaRef.current;
    const start = el?.selectionStart ?? current.length;
    const end = el?.selectionEnd ?? start;
    const next = `${current.slice(0, start)}\n\n${snippet}\n${current.slice(end)}`;

    setBody(next);

    requestAnimationFrame(() => {
      if (!el) return;
      const pos = start + snippet.length + 3;
      el.focus();
      el.setSelectionRange(pos, pos);
    });
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

  // 임시저장: 브라우저 저장 대신 DB에 임시글 저장
  async function saveDraft() {
    const form = formRef.current;

    if (!form) {
      return;
    }

    setStatus("임시 저장 중...");

    const result = await saveDraftAction(new FormData(form));

    if ("error" in result && result.error) {
      setStatus(result.error);
      return;
    }

    setDraftId(result.id);
    setStatus("임시 저장했습니다");

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

  // 임시저장: 제목 칸에 포커스가 있어도 Ctrl+S 동작
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

  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
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
    const untilCursor = body.slice(0, el.selectionStart);
    const line = untilCursor.split("\n").at(-1)?.trim() ?? "";

    if (line !== "/image" && line !== "/이미지") return;

    event.preventDefault();
    const lineStart = untilCursor.lastIndexOf("\n") + 1;
    setBody(body.slice(0, lineStart) + body.slice(el.selectionEnd));
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
          onChange={(event) => setBody(event.target.value)}
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
