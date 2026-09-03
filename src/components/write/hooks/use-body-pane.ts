import type { RefObject, UIEvent } from "react";
import { useLayoutEffect, useRef } from "react";
import { caretOffsetTop } from "../utils/caret";

interface UseBodyPaneProps {
  body: string;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
}

export function useBodyPane({ body, textareaRef }: UseBodyPaneProps) {
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
  }

  useLayoutEffect(() => {
    followCaret();
  }, [body]);

  function onEditorScroll(e: UIEvent<HTMLTextAreaElement>) {
    const previewEl = previewRef.current;

    if (previewEl) syncFrom(e.currentTarget, previewEl);
  }

  function onPreviewScroll(e: UIEvent<HTMLDivElement>) {
    const editor = textareaRef.current;

    if (editor) syncFrom(e.currentTarget, editor);
  }

  return {
    onEditorScroll,
    previewRef,
    onPreviewScroll,
  };
}
