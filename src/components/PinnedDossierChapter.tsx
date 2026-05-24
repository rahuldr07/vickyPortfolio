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
          "relative mx-auto min-h-screen w-full max-w-none scroll-mt-28 bg-transparent px-4 py-20 sm:px-6 md:py-24 lg:px-8 xl:px-10 2xl:px-12",
          className
        )}
      >
        <div
          className={cx(
            "grid min-w-0 items-start gap-10 lg:grid-cols-[clamp(220px,20vw,300px)_minmax(0,1fr)] lg:gap-10 xl:gap-12",
            layoutClassName
          )}
        >
          <aside
            data-testid="pinned-dossier-chapter-rail"
            className={cx(
              "dossier-rail-scroll z-20 w-full min-w-0 space-y-4 text-left lg:sticky lg:top-28 lg:max-h-[calc(100svh-8rem)] lg:self-start lg:overflow-y-auto lg:overscroll-contain lg:pr-2",
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
