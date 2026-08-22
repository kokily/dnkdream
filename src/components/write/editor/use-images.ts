"use client";

import { useEffect, useRef, useState, type ClipboardEvent } from "react";
import { uploadImageAction } from "@/lib/actions/upload";

export function useWriteImages(
  initialThumbnail: string,
  insertAtCursor: (snippet: string) => void,
  setStatus: (status: string | null) => void,
) {
  const [thumbnail, setThumbnail] = useState(initialThumbnail);
  const [dragging, setDragging] = useState(false);
  const dragCount = useRef(0);

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

  return { thumbnail, dragging, pickFile, onPaste };
}
