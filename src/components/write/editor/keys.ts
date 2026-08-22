export const PAIRS: Record<string, string> = {
  "(": ")",
  "[": "]",
  "{": "}",
  "<": ">",
  '"': '"',
  "'": "'",
};

const CLOSERS = Object.values(PAIRS);
const INDENT = "  ";

export function insertSnippet(
  current: string,
  start: number,
  end: number,
  snippet: string,
) {
  const next = `${current.slice(0, start)}\n\n${snippet}\n${current.slice(end)}`;
  const pos = start + snippet.length + 3;
  return { next, start: pos, end: pos };
}

export function wrapPair(
  current: string,
  start: number,
  end: number,
  opener: string,
) {
  const closer = PAIRS[opener];
  const selected = current.slice(start, end);
  const next = `${current.slice(0, start)}${opener}${selected}${closer}${current.slice(end)}`;
  return { next, start: start + 1, end: start + 1 + selected.length };
}

export function shouldSkipCloser(
  current: string,
  start: number,
  end: number,
  key: string,
) {
  return start === end && CLOSERS.includes(key) && current[start] === key;
}

export function insertIndent(current: string, start: number) {
  const next = `${current.slice(0, start)}${INDENT}${current.slice(start)}`;
  const pos = start + INDENT.length;
  return { next, start: pos, end: pos };
}

export function applyLineIndent(
  current: string,
  start: number,
  end: number,
  direction: "in" | "out",
) {
  const lineStart = current.lastIndexOf("\n", start - 1) + 1;
  const nextBreak = current.indexOf("\n", end);
  const blockEnd = nextBreak === -1 ? current.length : nextBreak;
  const lines = current.slice(lineStart, blockEnd).split("\n");

  let startDelta = 0;
  let endDelta = 0;

  const nextLines = lines.map((line, index) => {
    if (direction === "in") {
      if (index === 0) startDelta = INDENT.length;
      endDelta += INDENT.length;
      return `${INDENT}${line}`;
    }

    if (line.startsWith(INDENT)) {
      if (index === 0) startDelta = -INDENT.length;
      endDelta -= INDENT.length;
      return line.slice(INDENT.length);
    }

    if (line.startsWith("\t")) {
      if (index === 0) startDelta = -1;
      endDelta -= 1;
      return line.slice(1);
    }

    return line;
  });

  return {
    next: `${current.slice(0, lineStart)}${nextLines.join("\n")}${current.slice(blockEnd)}`,
    start: Math.max(lineStart, start + startDelta),
    end: Math.max(lineStart, end + endDelta),
  };
}

export function consumeImageCommand(
  current: string,
  start: number,
  end: number,
) {
  const untilCursor = current.slice(0, start);
  const line = untilCursor.split("\n").at(-1)?.trim() ?? "";

  if (line !== "/image" && line !== "/이미지") {
    return null;
  }

  const lineStart = untilCursor.lastIndexOf("\n") + 1;
  return {
    next: current.slice(0, lineStart) + current.slice(end),
    start: lineStart,
    end: lineStart,
  };
}
