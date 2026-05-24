import { forwardRef, type ReactNode } from "react";

type DossierChapterProps = {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  id: string;
  labelledBy: string;
  layoutClassName?: string;
  rail: ReactNode;
  railClassName?: string;
};

function cx(...classes: Array<string | undefined>) {
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
    },
    ref
  ) {
    return (
      <section
        ref={ref}
        id={id}
        aria-labelledby={labelledBy}
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
            data-testid="dossier-chapter-rail"
            className={cx(
              "dossier-rail-scroll z-20 w-full min-w-0 space-y-4 text-left lg:sticky lg:top-28 lg:max-h-[calc(100svh-8rem)] lg:self-start lg:overflow-y-auto lg:overscroll-contain lg:pr-2",
              railClassName
            )}
          >
            {rail}
          </aside>

          <div
            data-testid="dossier-chapter-content"
            className={cx(
              "dossier-chapter-pane w-full min-w-0 overflow-x-clip",
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
