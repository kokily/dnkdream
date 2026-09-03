export function excerpt(body: string, max = 140) {
  const text = body
    .replace(/[#*_`>~\[\]()]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  return text.length > max ? `${text.slice(0, max)}…` : text;
}
