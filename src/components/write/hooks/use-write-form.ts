import type { WriteDraft } from "../utils/types";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef, useState } from "react";
import { createPostAction, saveDraftAction } from "@/lib/actions/posts";
import { useWriteBody } from "./use-body";
import { useWriteImages } from "./use-images";
import { useWritePreview } from "./use-preview";

interface UseWriteFormProps {
  draft?: WriteDraft;
}

export function useWriteForm({ draft }: UseWriteFormProps) {
  const router = useRouter();
  const [error, formAction, pending] = useActionState(createPostAction, null);

  const [category, setCategory] = useState(draft?.category ?? "");
  const [title, setTitle] = useState(draft?.title ?? "");
  const [tags, setTags] = useState(draft?.tags.map((tag) => tag.name) ?? []);

  const [draftId, setDraftId] = useState(draft?.id ?? "");
  const [status, setStatus] = useState<string | null>(null);

  const formRef = useRef<HTMLFormElement>(null);

  const { body, textareaRef, insertAtCursor, onChange, onKeyDown } =
    useWriteBody(draft?.body ?? "");

  const { thumbnail, dragging, pickFile, clearThumbnail, onPaste } =
    useWriteImages(draft?.thumbnail ?? "", insertAtCursor, setStatus);

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
        ? "임시글로 되돌렸습니다. 홈에서는 더 이상 보이지 않습니다"
        : "임시 저장했습니다",
    );

    if (!draft?.id) {
      router.replace(`/write/${result.id}`);
    }
  }

  useEffect(() => {
    const onSave = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLocaleLowerCase() === "s") {
        e.preventDefault();
        void saveDraft();
      }
    };

    window.addEventListener("keydown", onSave);

    return () => window.removeEventListener("keydown", onSave);
  });

  return {
    formRef,
    formAction,
    draftId,
    thumbnail,
    category,
    title,
    tags,
    pending,
    setCategory,
    setTitle,
    setTags,
    pickFile,
    saveDraft,
    error,
    status,
    textareaRef,
    body,
    onChange,
    onPaste,
    clearThumbnail,
    dragging,
    onKeyDown,
    preview,
  };
}
