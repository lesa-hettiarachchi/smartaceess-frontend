"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Download, TriangleAlert, FileSymlink, ChevronRight } from "lucide-react";
import { getReports, type ReportSummary } from "../../lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

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
    a.download = `${report.report_name}_${report.audit_date}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight text-center md:text-left">My Reports</h2>
          <p className="text-slate-500 mt-2 text-md md:text-lg text-center md:text-left">View and manage your recent audits.</p>
        </div>
      </div>

      {isLoading && (
        <p className="text-slate-400 text-center py-16">Loading reports...</p>
      )}

      {!isLoading && reports.length === 0 && (
        <p className="text-slate-400 text-center py-16">No reports yet. Generate your first audit.</p>
      )}

      <div className="grid grid-cols-1 gap-5 md:gap-6">
        {reports.map((report) => (
          <div
            key={report.id}
            className="glass-card glass-card-hover rounded-3xl p-5 md:p-6 flex flex-col xl:flex-row xl:items-center justify-between gap-6 border-transparent hover:border-indigo-100"
          >
            <div className="flex-1 min-w-0 md:min-w-[200px] w-full">
              <Link href={`/reports/${report.id}`} className="group flex items-center gap-4">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100/50 flex shrink-0 items-center justify-center group-hover:from-blue-100 group-hover:to-indigo-100 transition-colors">
                  <FileSymlink className="text-indigo-500" size={24} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg md:text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors truncate">
                    {report.report_name}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[11px] md:text-xs font-semibold">
                      ID: {report.id}
                    </span>
                    <span className="text-sm text-slate-400 hidden sm:inline">•</span>
                    <span className="text-[13px] md:text-sm text-slate-500 font-medium">{report.audit_date}</span>
                  </div>
                </div>
              </Link>
            </div>

            <div className="flex justify-between md:justify-start gap-4 sm:gap-8 md:gap-10 px-2 md:px-8 border-y md:border-y-0 md:border-x border-slate-200/50 py-4 md:py-0 w-full xl:w-auto">
              <div className="text-center flex-1 md:flex-none">
                <p className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
                  {report.detected_count}<span className="text-slate-400 text-sm md:text-lg font-medium">/10</span>
                </p>
                <p className="text-slate-500 font-bold text-[9px] md:text-[10px] uppercase tracking-wider mt-1 md:mt-1.5 line-clamp-1">Detected</p>
              </div>

              <div className="text-center flex-1 md:flex-none">
                <p className="text-2xl md:text-3xl font-bold text-amber-500 tracking-tight">
                  {report.needs_measure_count}<span className="text-slate-400 text-sm md:text-lg font-medium">/10</span>
                </p>
                <p className="text-slate-500 font-bold text-[9px] md:text-[10px] uppercase tracking-wider mt-1 md:mt-1.5 line-clamp-1">
                  Needs Measure
                </p>
              </div>

              <div className="text-center flex-1 md:flex-none">
                <p className="text-2xl md:text-3xl font-bold text-blue-500 tracking-tight">
                  {report.manual_count}<span className="text-slate-400 text-sm md:text-lg font-medium">/10</span>
                </p>
                <p className="text-slate-500 font-bold text-[9px] md:text-[10px] uppercase tracking-wider mt-1 md:mt-1.5 line-clamp-1">
                  Manual Insp.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between xl:justify-end gap-3 xl:pl-2 w-full xl:w-auto">
              {report.needs_measure_count > 0 && (
                <Link
                  href={`/measure/${report.id}`}
                  className="flex-1 xl:flex-none flex items-center justify-center gap-2 bg-amber-50 text-amber-700 px-4 py-2.5 rounded-xl font-semibold hover:bg-amber-100 transition-colors border border-amber-200/70 text-sm"
                >
                  <TriangleAlert size={16} />
                  Measure
                </Link>
              )}

              <button
                onClick={() => handleDownload(report)}
                className="flex-1 xl:flex-none flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-semibold hover:bg-slate-50 hover:border-slate-300 transition-colors text-sm shadow-sm"
              >
                <Download size={16} />
                Export
              </button>

              <Link href={`/reports/${report.id}`} className="shrink-0 w-11 h-11 md:w-10 md:h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 transition-colors xl:ml-1 border border-transparent shadow-sm">
                <ChevronRight size={20} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
