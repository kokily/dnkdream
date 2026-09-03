"use client";

import type { ClipboardEvent, KeyboardEvent, RefObject } from "react";
import { useBodyPane } from "../hooks/use-body-pane";

interface WriteBodyPane {
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  body: string;
  preview: string;
  thumbnail: string;
  dragging: boolean;
  onChange: (value: string) => void;
  onPaste: (event: ClipboardEvent<HTMLTextAreaElement>) => void;
  onKeyDown: (event: KeyboardEvent<HTMLTextAreaElement>) => void;
  onClearThumbnail: () => void;
}

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
}: WriteBodyPane) {
  const { onEditorScroll, previewRef, onPreviewScroll } = useBodyPane({
    body,
    textareaRef,
  });

  return (
    <>
      <div className="grid min-h-0 flex-1 grid-rows-2 overflow-hidden md:grid-cols-2 md:grid-rows-1">
        <textarea
          ref={textareaRef}
          name="body"
          value={body}
          onChange={(e) => onChange(e.target.value)}
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
