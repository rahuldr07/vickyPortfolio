"use client";

import { useReportWebVitals } from "next/web-vitals";

type ReportCallback = Parameters<typeof useReportWebVitals>[0];

const reportWebVitals: ReportCallback = (metric) => {
  if (process.env.NODE_ENV !== "development") return;
  // Keeps visibility in local dev until analytics destination is wired.
  console.info("[web-vitals]", metric.name, Math.round(metric.value), metric);
};

export default function WebVitals() {
  useReportWebVitals(reportWebVitals);
  return null;
}
