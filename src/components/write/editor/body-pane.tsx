"use client";

import {
  useLayoutEffect,
  useRef,
  type ClipboardEvent,
  type KeyboardEvent,
  type RefObject,
  type UIEvent,
} from "react";
import { caretOffsetTop } from "./caret";

export default function WriteBodyPane({
  textareaRef,
  body,
  preview,
  thumbnail,
  dragging,
  onChange,
  onPaste,
  onKeyDown,
  onClearThumbnail,
}: {
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  body: string;
  preview: string;
  thumbnail: string;
  dragging: boolean;
  onChange: (value: string) => void;
  onPaste: (event: ClipboardEvent<HTMLTextAreaElement>) => void;
  onKeyDown: (event: KeyboardEvent<HTMLTextAreaElement>) => void;
  onClearThumbnail: () => void;
}) {
  const previewRef = useRef<HTMLDivElement>(null);
  const syncing = useRef(false);

  function syncFrom(source: HTMLElement, target: HTMLElement) {
    if (syncing.current) return;

    const sourceMax = source.scrollHeight - source.clientHeight;
    const targetMax = target.scrollHeight - target.clientHeight;

    if (sourceMax <= 0 || targetMax <= 0) return;

    syncing.current = true;
    target.scrollTop = (source.scrollTop / sourceMax) * targetMax;
    requestAnimationFrame(() => {
      syncing.current = false;
    });
  }

  function followCaret() {
    const editor = textareaRef.current;
    const previewEl = previewRef.current;
    if (!editor) return;

    const caretTop = caretOffsetTop(editor);
    const nextTop = caretTop - editor.clientHeight * 0.38;
    editor.scrollTop = Math.max(0, nextTop);

    if (previewEl) syncFrom(editor, previewEl);
  }

  useLayoutEffect(() => {
    followCaret();
  }, [body]);

  function onEditorScroll(event: UIEvent<HTMLTextAreaElement>) {
    const previewEl = previewRef.current;
    if (previewEl) syncFrom(event.currentTarget, previewEl);
  }

  function onPreviewScroll(event: UIEvent<HTMLDivElement>) {
    const editor = textareaRef.current;
    if (editor) syncFrom(event.currentTarget, editor);
  }

  return (
    <>
      <div className="grid min-h-0 flex-1 grid-rows-2 overflow-hidden md:grid-cols-2 md:grid-rows-1">
        <textarea
          ref={textareaRef}
          name="body"
          value={body}
          onChange={(event) => onChange(event.target.value)}
          onPaste={onPaste}
          onKeyDown={onKeyDown}
          onScroll={onEditorScroll}
          placeholder="마크다운으로 작성하세요. Ctrl+S 임시저장. 이미지: 드래그, Ctrl+Shift+U, /image 후 Enter."
          className="h-full min-h-0 overflow-auto border-r border-line bg-white px-4 pt-4 pb-[45vh] font-mono outline-none"
        />
        <div
          ref={previewRef}
          onScroll={onPreviewScroll}
          className="h-full min-h-0 overflow-auto px-4 pt-4 pb-[45vh]"
        >
          {thumbnail ? (
            <button
              type="button"
              onClick={onClearThumbnail}
              className="mb-4 block w-full cursor-pointer"
            >
              <img
                src={thumbnail}
                alt="썸네일"
                className="max-h-56 w-full rounded-xl object-cover"
              />
              <span className="mt-2 block text-xs text-neutral-500">
                클릭하면 썸네일을 지웁니다
              </span>
            </button>
          ) : null}
          <div
            className="markdown"
            dangerouslySetInnerHTML={{ __html: preview }}
          />
        </div>
      </div>

      {dragging && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-mint/20 text-lg font-semibold text-charcoal">
          이미지를 놓으면 본문에 넣습니다
        </div>
      )}
    </>
  );
}
