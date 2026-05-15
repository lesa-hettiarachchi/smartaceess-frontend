"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Download, TriangleAlert, FileSymlink, ChevronRight, FolderOpen } from "lucide-react";
import { getReports, type ReportSummary } from "../../lib/api";

const API_URL = "/api/proxy";

/* ── Skeleton card for loading state ─────────────────────────────────────── */
function ReportSkeleton() {
  return (
    <div className="glass-card rounded-2xl p-5 md:p-6 flex flex-col xl:flex-row xl:items-center gap-5">
      <div className="flex items-center gap-4 flex-1">
        <div className="skeleton w-12 h-12 rounded-xl shrink-0" />
        <div className="flex-1 space-y-2.5">
          <div className="skeleton h-5 w-3/4 rounded-lg" />
          <div className="skeleton h-3.5 w-1/2 rounded-lg" />
        </div>
      </div>
      <div className="flex gap-6 px-2">
        <div className="skeleton h-10 w-14 rounded-lg" />
        <div className="skeleton h-10 w-14 rounded-lg" />
        <div className="skeleton h-10 w-14 rounded-lg" />
      </div>
      <div className="flex gap-3">
        <div className="skeleton h-10 w-24 rounded-xl" />
        <div className="skeleton h-10 w-20 rounded-xl" />
      </div>
    </div>
  );
}

export default function ReportsPage() {
  const [reports, setReports] = useState<ReportSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getReports()
      .then(setReports)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const handleDownload = async (report: ReportSummary) => {
    const res = await fetch(`${API_URL}/reports/${report.id}/export`);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${report.report_name}_${report.audit_date}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-5 sm:p-6 md:p-10 max-w-6xl mx-auto">

      {/* Header */}
      <div className="mb-6 md:mb-8 page-enter">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
          My Reports
        </h2>
        <p className="text-slate-500 mt-1.5 text-sm md:text-[15px]">
          View and manage your recent audits.
        </p>
      </div>

      {/* Loading skeletons */}
      {isLoading && (
        <div className="grid grid-cols-1 gap-4 page-enter-delay-1">
          <ReportSkeleton />
          <ReportSkeleton />
          <ReportSkeleton />
        </div>
      )}

      {/* Empty state */}
      {!isLoading && reports.length === 0 && (
        <div className="page-enter-delay-1 glass-card rounded-2xl p-10 md:p-16 text-center flex flex-col items-center">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-slate-100 flex items-center justify-center mb-5">
            <FolderOpen className="text-slate-300" size={32} strokeWidth={1.5} />
          </div>
          <p className="text-lg font-semibold text-slate-700">No reports yet</p>
          <p className="text-sm text-slate-400 mt-2 max-w-xs mx-auto">
            Generate your first audit to see it here.
          </p>
          <Link
            href="/"
            className="mt-5 inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all"
          >
            Create Audit
          </Link>
        </div>
      )}

      {/* Report cards */}
      <div className="grid grid-cols-1 gap-4 page-enter-delay-1">
        {reports.map((report) => (
          <div
            key={report.id}
            className="glass-card glass-card-hover rounded-2xl p-4 sm:p-5 md:p-6 flex flex-col xl:flex-row xl:items-center justify-between gap-5"
          >
            {/* Report info */}
            <div className="flex-1 min-w-0">
              <Link href={`/reports/${report.id}`} className="group flex items-center gap-3.5">
                <div className="w-11 h-11 md:w-12 md:h-12 rounded-xl bg-indigo-50 border border-indigo-100/60 flex shrink-0 items-center justify-center group-hover:bg-indigo-100 transition-colors">
                  <FileSymlink className="text-indigo-500" size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base md:text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors truncate">
                    {report.report_name}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 mt-0.5">
                    <span className="text-xs text-slate-400 font-medium">
                      {report.audit_date}
                    </span>
                    <span className="text-slate-300 hidden sm:inline">·</span>
                    <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-semibold tracking-wide hidden sm:inline">
                      #{report.id}
                    </span>
                  </div>
                </div>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex justify-between sm:justify-start gap-4 sm:gap-6 md:gap-8 px-1 md:px-6 border-y xl:border-y-0 xl:border-x border-slate-100 py-3 xl:py-0 w-full xl:w-auto">
              <div className="text-center flex-1 sm:flex-none">
                <p className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight tabular-nums">
                  {report.detected_count}<span className="text-slate-300 text-sm font-medium">/7</span>
                </p>
                <p className="text-slate-400 font-semibold text-[9px] md:text-[10px] uppercase tracking-wider mt-0.5">
                  Detected
                </p>
              </div>

              <div className="text-center flex-1 sm:flex-none">
                <p className="text-xl md:text-2xl font-bold text-amber-500 tracking-tight tabular-nums">
                  {report.needs_measure_count}<span className="text-slate-300 text-sm font-medium">/7</span>
                </p>
                <p className="text-slate-400 font-semibold text-[9px] md:text-[10px] uppercase tracking-wider mt-0.5">
                  Needs Measure
                </p>
              </div>

              <div className="text-center flex-1 sm:flex-none">
                <p className="text-xl md:text-2xl font-bold text-blue-500 tracking-tight tabular-nums">
                  {report.manual_count}<span className="text-slate-300 text-sm font-medium">/7</span>
                </p>
                <p className="text-slate-400 font-semibold text-[9px] md:text-[10px] uppercase tracking-wider mt-0.5">
                  Manual Insp.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2.5 w-full xl:w-auto">
              {report.needs_measure_count > 0 && (
                <Link
                  href={`/measure/${report.id}`}
                  className="flex-1 xl:flex-none flex items-center justify-center gap-2 bg-amber-50 text-amber-700 px-4 py-2.5 rounded-xl font-semibold hover:bg-amber-100 transition-colors border border-amber-200/70 text-sm active:scale-[0.98]"
                >
                  <TriangleAlert size={15} />
                  Measure
                </Link>
              )}

              <button
                onClick={() => handleDownload(report)}
                className="flex-1 xl:flex-none flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-600 px-4 py-2.5 rounded-xl font-semibold hover:bg-slate-50 hover:border-slate-300 transition-colors text-sm shadow-xs active:scale-[0.98]"
              >
                <Download size={15} />
                Export
              </button>

              <Link
                href={`/reports/${report.id}`}
                className="shrink-0 w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-colors border border-slate-100"
              >
                <ChevronRight size={18} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
