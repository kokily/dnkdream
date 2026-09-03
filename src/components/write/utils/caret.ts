const MIRROR_STYLES = [
  "box-sizing",
  "width",
  "padding-top",
  "padding-right",
  "padding-bottom",
  "padding-left",
  "border-top-width",
  "border-right-width",
  "border-bottom-width",
  "border-left-width",
  "font-style",
  "font-variant",
  "font-weight",
  "font-stretch",
  "font-size",
  "font-family",
  "line-height",
  "letter-spacing",
  "text-align",
  "text-transform",
  "word-spacing",
  "white-space",
  "word-wrap",
  "overflow-wrap",
] as const;

export function caretOffsetTop(el: HTMLTextAreaElement) {
  const style = window.getComputedStyle(el);
  const mirror = document.createElement("div");

  mirror.setAttribute("aria-hidden", "true");
  mirror.style.position = "absolute";
  mirror.style.visibility = "hidden";
  mirror.style.overflow = "hidden";
  mirror.style.whiteSpace = "pre-wrap";
  mirror.style.wordWrap = "break-word";
  mirror.style.top = "0";
  mirror.style.left = "0";

  for (const name of MIRROR_STYLES) {
    mirror.style.setProperty(name, style.getPropertyValue(name));
  }

  mirror.style.width = `${el.clientWidth}px`;
  mirror.textContent = el.value.slice(0, el.selectionEnd);

  const marker = document.createElement("span");
  marker.textContent = "\u200b";
  mirror.append(marker);
  document.body.append(mirror);

  const top = marker.offsetTop;
  mirror.remove();
  return top;
}
