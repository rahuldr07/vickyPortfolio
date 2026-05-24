"use client";

import { forwardRef, type ReactNode } from "react";

type PinnedDossierChapterProps = {
  id?: string;
  labelledBy?: string;
  rail: ReactNode;
  children: ReactNode;
  className?: string;
  layoutClassName?: string;
  railClassName?: string;
  contentClassName?: string;
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const PinnedDossierChapter = forwardRef<HTMLElement, PinnedDossierChapterProps>(
  function PinnedDossierChapter(
    {
      id,
      labelledBy,
      rail,
      children,
      className,
      layoutClassName,
      railClassName,
      contentClassName,
    },
    forwardedRef
  ) {
    return (
      <section
        ref={forwardedRef}
        id={id}
        aria-labelledby={labelledBy}
        data-testid="pinned-dossier-chapter"
        data-pinned-chapter-id={id}
        className={cx(
          "relative mx-auto w-full max-w-none scroll-mt-24 bg-transparent px-4 py-14 sm:px-6 md:py-16 lg:px-8 xl:px-10 2xl:px-12",
          className
        )}
      >
        <div
          className={cx(
            "grid min-w-0 items-start gap-7 lg:grid-cols-[clamp(190px,17vw,260px)_minmax(0,1fr)] lg:gap-8 xl:gap-10",
            layoutClassName
          )}
        >
          <aside
            data-testid="pinned-dossier-chapter-rail"
            className={cx(
              "z-20 w-full min-w-0 space-y-4 text-left lg:sticky lg:top-28 lg:self-start lg:pr-2",
              railClassName
            )}
          >
            {rail}
          </aside>

          <div
            data-testid="pinned-dossier-chapter-content"
            className={cx("dossier-chapter-pane w-full min-w-0 overflow-x-clip", contentClassName)}
          >
            {children}
          </div>
        </div>
      </section>
    );
  }
);

export default PinnedDossierChapter;
