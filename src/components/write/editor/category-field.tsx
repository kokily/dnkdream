"use client";

import { useMemo, useState } from "react";

export default function CategoryField({
  categories,
  value,
  onChange,
}: {
  categories: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);

  const options = useMemo(() => {
    const query = value.trim().toLocaleLowerCase("ko");
    return categories.filter((name) =>
      query ? name.toLocaleLowerCase("ko").includes(query) : true,
    );
  }, [categories, value]);

  return (
    <div className="relative w-36">
      <input
        name="category"
        value={value}
        autoComplete="off"
        placeholder="카테고리"
        onChange={(event) => onChange(event.target.value)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={(event) => {
          if (event.key === "Enter") event.preventDefault();
        }}
        className="w-full cursor-pointer rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-mint"
      />
      {open && options.length > 0 && (
        <ul className="absolute top-full z-20 mt-1 max-h-48 w-full overflow-auto rounded-md border border-line bg-white py-1 shadow-sm">
          {options.map((name) => (
            <li key={name}>
              <button
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  onChange(name);
                  setOpen(false);
                }}
                className="block w-full cursor-pointer px-3 py-1.5 text-left text-sm hover:bg-mint-soft/60"
              >
                {name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
