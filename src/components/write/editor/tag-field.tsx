"use client";

import { useRef, useState } from "react";

function normalize(value: string) {
  return value.trim();
}

export default function TagField({
  tags,
  onChange,
}: {
  tags: string[];
  onChange: (tags: string[]) => void;
}) {
  const [draft, setDraft] = useState("");
  const composing = useRef(false);

  function add(raw: string) {
    const name = normalize(raw);
    if (!name) return;
    if (
      tags.some(
        (tag) => tag.toLocaleLowerCase("ko") === name.toLocaleLowerCase("ko"),
      )
    ) {
      setDraft("");
      return;
    }
    onChange([...tags, name]);
    setDraft("");
  }

  function remove(name: string) {
    onChange(tags.filter((tag) => tag !== name));
  }

  return (
    <div className="flex min-w-48 flex-1 flex-wrap items-center gap-1.5">
      <input type="hidden" name="tags" value={tags.join(",")} />
      <input
        value={draft}
        autoComplete="off"
        placeholder="태그 입력 후 Enter"
        onChange={(event) => setDraft(event.target.value)}
        onCompositionStart={() => {
          composing.current = true;
        }}
        onCompositionEnd={() => {
          composing.current = false;
        }}
        onKeyDown={(event) => {
          if (event.key === "Backspace" && !draft && tags.length > 0) {
            event.preventDefault();
            onChange(tags.slice(0, -1));
            return;
          }

          if (event.key !== "Enter") return;
          if (event.nativeEvent.isComposing || composing.current) return;

          event.preventDefault();
          add(draft);
        }}
        className="min-w-28 flex-1 rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-mint"
      />
      {tags.map((name) => (
        <button
          key={name}
          type="button"
          aria-label={`${name} 삭제`}
          onClick={() => remove(name)}
          className="rounded-full bg-mint-soft/70 px-2.5 py-1 text-sm text-charcoal hover:bg-red-100 hover:text-red-700"
        >
          {name}
        </button>
      ))}
    </div>
  );
}
