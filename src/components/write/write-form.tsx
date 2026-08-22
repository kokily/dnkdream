"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createPostAction, saveDraftAction } from "@/lib/actions/posts";
import WriteBodyPane from "./editor/body-pane";
import { useWriteBody } from "./editor/use-body";
import { useWriteImages } from "./editor/use-images";
import { useWritePreview } from "./editor/use-preview";
import WriteToolbar from "./editor/toolbar";
import type { WriteDraft } from "./editor/types";

export default function WriteForm({ draft }: { draft?: WriteDraft }) {
  const router = useRouter();
  const [error, formAction, pending] = useActionState(createPostAction, null);
  const [category, setCategory] = useState(draft?.category ?? "");
  const [title, setTitle] = useState(draft?.title ?? "");
  const [tags, setTags] = useState(
    draft?.tags.map((tag) => tag.name).join(", ") ?? "",
  );
  const [draftId, setDraftId] = useState(draft?.id ?? "");
  const [status, setStatus] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const { body, textareaRef, insertAtCursor, onChange, onKeyDown } =
    useWriteBody(draft?.body ?? "");
  const { thumbnail, dragging, pickFile, onPaste } = useWriteImages(
    draft?.thumbnail ?? "",
    insertAtCursor,
    setStatus,
  );
  const preview = useWritePreview(body);

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
    const onSave = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        void saveDraft();
      }
    };

    window.addEventListener("keydown", onSave);

    return () => window.removeEventListener("keydown", onSave);
  });

  return (
    <form
      ref={formRef}
      action={formAction}
      className="relative flex min-h-0 flex-1 flex-col overflow-hidden"
    >
      <input type="hidden" name="id" value={draftId} />
      <input type="hidden" name="thumbnail" value={thumbnail} />

      <WriteToolbar
        category={category}
        title={title}
        tags={tags}
        thumbnail={thumbnail}
        pending={pending}
        onCategory={setCategory}
        onTitle={setTitle}
        onTags={setTags}
        onThumbnail={() => pickFile(true)}
        onImage={() => pickFile()}
        onDraft={() => void saveDraft()}
      />

      {(error || status) && (
        <p className="border-b border-line px-4 py-2 text-sm text-red-600">
          {error ?? status}
        </p>
      )}

      <WriteBodyPane
        textareaRef={textareaRef}
        body={body}
        preview={preview}
        dragging={dragging}
        onChange={onChange}
        onPaste={onPaste}
        onKeyDown={(event) => onKeyDown(event, pickFile)}
      />
    </form>
  );
}
