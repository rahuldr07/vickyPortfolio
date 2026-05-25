import { forwardRef, type ReactNode } from "react";

type DossierChapterProps = {
  children: ReactNode;
  className?: string;
  contentScrollable?: boolean;
  contentClassName?: string;
  id: string;
  labelledBy: string;
  layoutClassName?: string;
  rail: ReactNode;
  railClassName?: string;
  viewportChapter?: boolean;
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const DossierChapter = forwardRef<HTMLElement, DossierChapterProps>(
  function DossierChapter(
    {
      children,
      className,
      contentClassName,
      id,
      labelledBy,
      layoutClassName,
      rail,
      railClassName,
      viewportChapter = false,
      contentScrollable = false,
    },
    ref
  ) {
    return (
      <section
        ref={ref}
        id={id}
        aria-labelledby={labelledBy}
        data-scroll-chapter={viewportChapter ? "true" : undefined}
        className={cx(
          "relative mx-auto w-full max-w-none scroll-mt-24 bg-transparent px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12",
          "py-14 md:py-16",
          viewportChapter && "min-h-[100svh]",
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
            data-testid="dossier-chapter-rail"
            className={cx(
              "z-20 w-full min-w-0 space-y-4 text-left lg:sticky lg:top-28 lg:self-start lg:pr-2",
              railClassName
            )}
          >
            {rail}
          </aside>

          <div
            data-testid="dossier-chapter-content"
            data-native-scroll={viewportChapter && contentScrollable ? "true" : undefined}
            className={cx(
              "dossier-chapter-pane w-full min-w-0 overflow-x-clip",
              viewportChapter && contentScrollable && "lg:max-h-[calc(100svh-8rem)] lg:overflow-y-auto",
              contentClassName
            )}
          >
            {children}
          </div>
        </div>
      </section>
    );
  }
);

export default DossierChapter;
