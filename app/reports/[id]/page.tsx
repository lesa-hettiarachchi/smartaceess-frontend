import { notFound } from "next/navigation";
import { Check, TriangleAlert, X, ArrowLeft, ArrowUpRight } from "lucide-react";
import { reports } from "../../../data/reports";
import Link from "next/link";

export default async function ReportDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const report = reports.find((r) => r.id === id);

  if (!report) {
    notFound();
  }

  return (
    <div className="p-10 max-w-6xl mx-auto">
      <div className="mb-8">
        <Link href="/reports" className="inline-flex items-center gap-2 text-indigo-500 font-medium hover:text-indigo-600 mb-4 transition-colors">
          <ArrowLeft size={16} /> Back to Reports
        </Link>
        <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-slate-800 tracking-tight flex items-center gap-4">
            {report.name}
            <span className="px-3 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 text-indigo-600 rounded-full text-xs font-bold uppercase tracking-wider border border-indigo-100/50 shadow-sm">
                Audit Report
            </span>
            </h2>
            <div className="px-4 py-2 bg-white rounded-xl border border-slate-200 shadow-sm text-sm font-semibold text-slate-600">
                ID: {report.id}
            </div>
        </div>
      </div>

      <div className="glass-card rounded-[32px] p-8 space-y-4">
        {report.items.length === 0 ? (
          <div className="bg-slate-50/50 border border-slate-200 border-dashed rounded-[24px] p-16 text-slate-500 text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-5 shadow-sm border border-slate-100">
              <X className="text-slate-300" size={40} strokeWidth={1.5} />
            </div>
            <p className="text-xl font-semibold text-slate-700">No detailed items available</p>
            <p className="text-slate-400 mt-2">There are currently no report metrics generated for this audit.</p>
          </div>
        ) : (
          report.items.map((item, index) => {
            const isGreen = item.type === "green";
            const isYellow = item.type === "yellow";
            const isRed = item.type === "red";

            const cardStyle = isGreen
              ? "bg-emerald-50/50 border-emerald-100/50 hover:border-emerald-200"
              : isYellow
              ? "bg-amber-50/50 border-amber-100/50 hover:border-amber-200"
              : "bg-rose-50/50 border-rose-100/50 hover:border-rose-200";

            const iconBg = isGreen
              ? "bg-emerald-100 text-emerald-600"
              : isYellow
              ? "bg-amber-100 text-amber-600 shadow-amber-500/10"
              : "bg-rose-100 text-rose-600 shadow-rose-500/10";

            return (
              <div
                key={index}
                className={`${cardStyle} border rounded-2xl p-5 flex items-center justify-between gap-8 transition-all duration-300 hover:shadow-sm group`}
              >
                <div className="flex-[0.8] min-w-[300px]">
                  <h3 className="text-lg font-bold text-slate-800 flex items-center justify-between">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-2.5 py-1 bg-white rounded-md text-[11px] font-bold uppercase tracking-wider text-slate-500 shadow-sm border border-slate-100">
                      Clause {item.clause}
                    </span>
                  </div>
                </div>

                <div className="flex-1 text-sm font-medium text-slate-600 max-w-[380px] leading-relaxed bg-white/40 p-3 rounded-xl border border-white/60">
                  {item.statusText}
                </div>

                <div className="min-w-[160px] flex flex-col items-center justify-center gap-2 border-l border-slate-200/50 pl-6 shrink-0">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm ${iconBg} transition-transform duration-300 group-hover:scale-110`}>
                    {isGreen && <Check size={24} strokeWidth={3} />}
                    {isYellow && <TriangleAlert size={22} strokeWidth={3} />}
                    {isRed && <X size={24} strokeWidth={3} />}
                  </div>
                  <p className={`text-[13px] font-bold tracking-wide uppercase ${
                    isGreen ? "text-emerald-700" : isYellow ? "text-amber-700" : "text-rose-700"
                  }`}>
                    {item.result}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}