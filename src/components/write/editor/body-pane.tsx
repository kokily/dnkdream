import type { ClipboardEvent, KeyboardEvent, RefObject } from "react";

export default function WriteBodyPane({
  textareaRef,
  body,
  preview,
  dragging,
  onChange,
  onPaste,
  onKeyDown,
}: {
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  body: string;
  preview: string;
  dragging: boolean;
  onChange: (value: string) => void;
  onPaste: (event: ClipboardEvent<HTMLTextAreaElement>) => void;
  onKeyDown: (event: KeyboardEvent<HTMLTextAreaElement>) => void;
}) {
  return (
    <>
      <div className="grid min-h-0 flex-1 md:grid-cols-2">
        <textarea
          ref={textareaRef}
          name="body"
          value={body}
          onChange={(event) => onChange(event.target.value)}
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
    </>
  );
}
