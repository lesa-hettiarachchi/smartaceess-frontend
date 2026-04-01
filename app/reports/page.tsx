"use client";

import Link from "next/link";
import { Download, TriangleAlert } from "lucide-react";
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
    <div className="min-h-screen bg-[#f3f6fb] p-8">
      <h2 className="text-[24px] font-bold mb-8">My Reports</h2>

      <div className="bg-[#e9eef7] rounded-[24px] p-8 space-y-6">
        {reports.map((report) => (
          <div
            key={report.id}
            className="bg-[#f7f7f8] rounded-[20px] px-8 py-6 flex items-center justify-between gap-6"
          >
            <div className="min-w-[160px]">
              <Link href={`/reports/${report.id}`}>
                <h3 className="text-[24px] font-semibold hover:text-blue-600 cursor-pointer">
                  {report.name}
                </h3>
              </Link>
            </div>

            <div className="text-center min-w-[120px]">
              <p className="text-[28px] font-bold leading-none">
                {report.detected}/10
              </p>
              <p className="text-gray-400 italic text-sm mt-1">Detected</p>
            </div>

            <div className="text-center min-w-[150px]">
              <p className="text-[28px] font-bold leading-none">
                {report.needsMeasurement}/10
              </p>
              <p className="text-gray-400 italic text-sm mt-1">
                Needs Measurement
              </p>
            </div>

            <div className="text-center min-w-[140px]">
              <p className="text-[28px] font-bold leading-none">
                {report.manualInspection}/10
              </p>
              <p className="text-gray-400 italic text-sm mt-1">
                Manual Inspection
              </p>
            </div>

            <div className="flex flex-col items-end gap-3 min-w-[150px]">
              <button
                onClick={() => handleDownload(report)}
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-full font-semibold hover:bg-blue-700"
              >
                <Download size={16} />
                Download
              </button>

              {report.needsMeasurement > 0 && (
                <Link
                  href={`/measure/${report.id}`}
                  className="inline-flex items-center gap-2 bg-yellow-300 px-5 py-2 rounded-full font-semibold hover:bg-yellow-400"
                >
                  <TriangleAlert size={16} />
                  Measure
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}