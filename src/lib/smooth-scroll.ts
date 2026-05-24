const LINE_DELTA = 16;
const PAGE_DELTA_RATIO = 0.8;
const FRAME_MS = 16.67;

export function clampScrollTarget(value: number, maxScroll: number) {
  if (Number.isNaN(value)) return 0;
  return Math.min(Math.max(value, 0), Math.max(maxScroll, 0));
}

export function getLerpScrollStep(
  current: number,
  target: number,
  deltaMs: number,
  lerp: number
) {
  if (!Number.isFinite(current) || !Number.isFinite(target)) return 0;
  if (!Number.isFinite(deltaMs) || deltaMs <= 0) deltaMs = FRAME_MS;
  if (!Number.isFinite(lerp) || lerp <= 0) return current;
  if (lerp >= 1) return target;

  const frameRatio = Math.max(deltaMs, FRAME_MS) / FRAME_MS;
  const easedLerp = 1 - Math.pow(1 - lerp, frameRatio);

  return current + (target - current) * easedLerp;
}

export function isScrollSettled(
  current: number,
  target: number,
  threshold = 0.5
) {
  return Math.abs(target - current) <= threshold;
}

export function normalizeWheelDelta(
  deltaY: number,
  deltaMode: number,
  viewportHeight: number
) {
  if (deltaMode === 1) return deltaY * LINE_DELTA;
  if (deltaMode === 2) return deltaY * viewportHeight;
  return deltaY;
}

export function getAnchorScrollTarget(hash: string, currentScrollY: number) {
  if (!hash || hash === "#") return null;

  const id = decodeURIComponent(hash.slice(1));
  const target = document.getElementById(id);
  if (!target) return null;

  const scrollMarginTop = Number.parseFloat(
    window.getComputedStyle(target).scrollMarginTop
  );
  const offset = Number.isNaN(scrollMarginTop) ? 0 : scrollMarginTop;

  return target.getBoundingClientRect().top + currentScrollY - offset;
}

export function isNativeScrollableTarget(target: EventTarget | null) {
  if (!(target instanceof Element)) return false;

  let node: Element | null = target;
  while (node && node !== document.body && node !== document.documentElement) {
    if (node.getAttribute("data-native-scroll") === "true") return true;

    const style = window.getComputedStyle(node);
    const canScrollY =
      /(auto|scroll|overlay)/.test(style.overflowY) &&
      node.scrollHeight > node.clientHeight;
    const canScrollX =
      /(auto|scroll|overlay)/.test(style.overflowX) &&
      node.scrollWidth > node.clientWidth;

    if (canScrollY || canScrollX) return true;
    node = node.parentElement;
  }

  return false;
}

export function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;

  const tagName = target.tagName.toLowerCase();
  return (
    target.isContentEditable ||
    tagName === "input" ||
    tagName === "textarea" ||
    tagName === "select"
  );
}

export function getKeyboardScrollDestination(
  key: string,
  currentScrollY: number,
  viewportHeight: number,
  maxScroll: number
) {
  const pageDelta = viewportHeight * PAGE_DELTA_RATIO;

  switch (key) {
    case "ArrowDown":
      return clampScrollTarget(currentScrollY + 80, maxScroll);
    case "ArrowUp":
      return clampScrollTarget(currentScrollY - 80, maxScroll);
    case "PageDown":
    case " ":
      return clampScrollTarget(currentScrollY + pageDelta, maxScroll);
    case "PageUp":
      return clampScrollTarget(currentScrollY - pageDelta, maxScroll);
    case "Home":
      return 0;
    case "End":
      return clampScrollTarget(maxScroll, maxScroll);
    default:
      return null;
  }
}
