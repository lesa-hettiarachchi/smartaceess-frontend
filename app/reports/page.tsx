"use client";

import Link from "next/link";
import { Download, TriangleAlert, FileSymlink, ChevronRight } from "lucide-react";
import { reports } from "../../data/reports";

export default function ReportsPage() {
  const handleDownload = (report: (typeof reports)[number]) => {
    const content = `
Report Name: ${report.name}
Detected: ${report.detected}/10
Needs Measurement: ${report.needsMeasurement}/10
Manual Inspection: ${report.manualInspection}/10

Detailed Items:
${
  report.items.length > 0
    ? report.items
        .map(
          (item, index) =>
            `${index + 1}. ${item.title}
Clause: ${item.clause}
Status: ${item.statusText}
Result: ${item.result}
Type: ${item.type}
`
        )
        .join("\n")
    : "No detailed items available."
}
    `.trim();

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${report.id}.txt`;
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-10 max-w-7xl mx-auto">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">My Reports</h2>
          <p className="text-slate-500 mt-2 text-lg">View and manage your recent accessibility audits.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {reports.map((report) => (
          <div
            key={report.id}
            className="glass-card glass-card-hover rounded-3xl p-6 flex items-center justify-between gap-6 border-transparent hover:border-indigo-100"
          >
            <div className="flex-1 min-w-[200px]">
              <Link href={`/reports/${report.id}`} className="group flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100/50 flex items-center justify-center group-hover:from-blue-100 group-hover:to-indigo-100 transition-colors">
                  <FileSymlink className="text-indigo-500" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                    {report.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs font-semibold">
                      ID: {report.id}
                    </span>
                    <span className="text-sm text-slate-400">•</span>
                    <span className="text-sm text-slate-500 font-medium">10 metrics</span>
                  </div>
                </div>
              </Link>
            </div>

            <div className="flex gap-10 px-8 border-x border-slate-200/50">
              <div className="text-center">
                <p className="text-3xl font-bold text-slate-800 tracking-tight">
                  {report.detected}<span className="text-slate-400 text-lg font-medium">/10</span>
                </p>
                <p className="text-slate-500 font-bold text-[10px] uppercase tracking-wider mt-1.5">Detected</p>
              </div>

              <div className="text-center">
                <p className="text-3xl font-bold text-amber-500 tracking-tight">
                  {report.needsMeasurement}<span className="text-slate-400 text-lg font-medium">/10</span>
                </p>
                <p className="text-slate-500 font-bold text-[10px] uppercase tracking-wider mt-1.5">
                  Needs Measure
                </p>
              </div>

              <div className="text-center">
                <p className="text-3xl font-bold text-blue-500 tracking-tight">
                  {report.manualInspection}<span className="text-slate-400 text-lg font-medium">/10</span>
                </p>
                <p className="text-slate-500 font-bold text-[10px] uppercase tracking-wider mt-1.5">
                  Manual Insp.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 pl-2">
              {report.needsMeasurement > 0 && (
                <Link
                  href={`/measure/${report.id}`}
                  className="flex items-center gap-2 bg-amber-50 text-amber-600 px-4 py-2.5 rounded-xl font-semibold hover:bg-amber-100 transition-colors border border-amber-200/50 text-sm"
                >
                  <TriangleAlert size={16} />
                  Measure
                </Link>
              )}
              
              <button
                onClick={() => handleDownload(report)}
                className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-semibold hover:bg-slate-50 hover:border-slate-300 transition-colors text-sm shadow-sm"
              >
                <Download size={16} />
                Export
              </button>

              <Link href={`/reports/${report.id}`} className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-colors ml-1 border border-transparent shadow-sm">
                <ChevronRight size={20} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}