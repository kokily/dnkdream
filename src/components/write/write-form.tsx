"use client";

import type { WriteDraft } from "./utils/types";
import { useWriteForm } from "./hooks/use-write-form";
import WriteBodyPane from "./editor/body-pane";
import WriteToolbar from "./editor/toolbar";

interface WriteFormProps {
  draft?: WriteDraft;
  categories: string[];
}

export default function WriteForm({ draft, categories }: WriteFormProps) {
  const {
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
  } = useWriteForm({ draft });

  return (
    <form
      ref={formRef}
      action={formAction}
      className="relative flex min-h-0 flex-1 flex-col overflow-hidden"
    >
      <input type="hidden" name="id" value={draftId} />
      <input type="hidden" name="thumbnail" value={thumbnail} />

      <WriteToolbar
        categories={categories}
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
        thumbnail={thumbnail}
        dragging={dragging}
        onChange={onChange}
        onPaste={onPaste}
        onKeyDown={(event) => onKeyDown(event, pickFile)}
        onClearThumbnail={clearThumbnail}
      />
    </form>
  );
}
