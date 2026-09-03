"use client";

import { useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";
import {
  applyLineIndent,
  consumeImageCommand,
  insertIndent,
  insertSnippet,
  PAIRS,
  shouldSkipCloser,
  wrapPair,
} from "../utils/keys";

export function useWriteBody(initial: string) {
  const [body, setBody] = useState(initial);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const bodyRef = useRef(body);
  const selectionRef = useRef<{ start: number; end: number } | null>(null);

  bodyRef.current = body;

  useLayoutEffect(() => {
    const el = textareaRef.current;
    const selection = selectionRef.current;
    if (!el || !selection) return;
    el.setSelectionRange(selection.start, selection.end);
    selectionRef.current = null;
  }, [body]);

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
    const result = insertSnippet(current, start, end, snippet);
    replaceBody(result.next, result.start, result.end);
  }

  function onChange(value: string) {
    bodyRef.current = value;
    setBody(value);
  }

  function onKeyDown(
    event: KeyboardEvent<HTMLTextAreaElement>,
    pickFile: (asThumbnail?: boolean) => void,
  ) {
    const modified = event.ctrlKey || event.metaKey || event.altKey;
    const el = event.currentTarget;
    const current = el.value;
    const start = el.selectionStart;
    const end = el.selectionEnd;

    if (PAIRS[event.key] && !modified) {
      event.preventDefault();
      const next = wrapPair(current, start, end, event.key);
      replaceBody(next.next, next.start, next.end);
      return;
    }

    if (!modified && shouldSkipCloser(current, start, end, event.key)) {
      event.preventDefault();
      el.setSelectionRange(start + 1, start + 1);
      return;
    }

    if (event.key === "Tab") {
      event.preventDefault();

      if (!event.shiftKey && start === end) {
        const next = insertIndent(current, start);
        replaceBody(next.next, next.start, next.end);
        return;
      }

      const next = applyLineIndent(
        current,
        start,
        end,
        event.shiftKey ? "out" : "in",
      );
      replaceBody(next.next, next.start, next.end);
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

    const command = consumeImageCommand(current, start, end);
    if (!command) return;

    event.preventDefault();
    replaceBody(command.next, command.start, command.end);
    pickFile();
  }

  return { body, textareaRef, insertAtCursor, onChange, onKeyDown };
}
