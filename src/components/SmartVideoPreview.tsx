"use client";

import { useEffect, useRef } from "react";

interface SmartVideoPreviewProps {
  src: string;
  className?: string;
  shouldReduceMotion?: boolean;
}

export default function SmartVideoPreview({
  src,
  className,
  shouldReduceMotion = false,
}: SmartVideoPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (shouldReduceMotion) {
      video.pause();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            void video.play().catch(() => {
              // Ignore autoplay interruption errors.
            });
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.35 }
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
      video.pause();
    };
  }, [shouldReduceMotion]);

  return (
    <video
      ref={videoRef}
      src={src}
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden="true"
      className={className}
    />
  );
}
