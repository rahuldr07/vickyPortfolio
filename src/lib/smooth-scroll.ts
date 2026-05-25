const LINE_DELTA = 16;
const PAGE_DELTA_RATIO = 0.8;
const FRAME_MS = 16.67;
const WHEEL_SECTION_SNAP_DELTA = 160;

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

  if (target.getAttribute("data-scroll-chapter") === "true") {
    return target.getBoundingClientRect().top + currentScrollY;
  }

  const scrollMarginTop = Number.parseFloat(
    window.getComputedStyle(target).scrollMarginTop
  );
  const offset = Number.isNaN(scrollMarginTop) ? 0 : scrollMarginTop;

  return target.getBoundingClientRect().top + currentScrollY - offset;
}

export function getDirectionalSectionScrollTarget(
  sectionTops: readonly number[],
  currentScrollY: number,
  direction: number,
  threshold = 2
) {
  if (!sectionTops.length || direction === 0) return null;

  if (direction > 0) {
    return sectionTops.find((top) => top > currentScrollY + threshold) ?? null;
  }

  for (let index = sectionTops.length - 1; index >= 0; index -= 1) {
    const top = sectionTops[index];
    if (top < currentScrollY - threshold) {
      return top;
    }
  }

  return null;
}

export function getWheelSectionScrollTarget(
  sectionTops: readonly number[],
  currentScrollY: number,
  deltaY: number,
  minDelta = WHEEL_SECTION_SNAP_DELTA
) {
  if (Math.abs(deltaY) < minDelta) return null;

  return getDirectionalSectionScrollTarget(sectionTops, currentScrollY, deltaY);
}

function canScrollInDirection(node: Element, deltaY: number) {
  const maxScrollTop = node.scrollHeight - node.clientHeight;
  if (maxScrollTop <= 0) return false;

  if (deltaY > 0) return node.scrollTop < maxScrollTop - 1;
  if (deltaY < 0) return node.scrollTop > 1;

  return true;
}

export function isNativeScrollableTarget(
  target: EventTarget | null,
  deltaY = 0
) {
  if (!(target instanceof Element)) return false;

  let node: Element | null = target;
  while (node && node !== document.body && node !== document.documentElement) {
    if (node.getAttribute("data-native-scroll") === "true") {
      return canScrollInDirection(node, deltaY);
    }

    const style = window.getComputedStyle(node);
    const canScrollY =
      /(auto|scroll|overlay)/.test(style.overflowY) &&
      canScrollInDirection(node, deltaY);
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
