import { notFound } from "next/navigation";
import { Check, TriangleAlert, X, ArrowLeft, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { getReport } from "../../../lib/api";

function fmt(cls: string) {
  return cls.split("_").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");
}

export default async function ReportDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let data: Awaited<ReturnType<typeof getReport>>;
  try {
    data = await getReport(id);
  } catch {
    notFound();
  }

  const items = [
    ...data.detected.map((i) => ({
      title: fmt(i.class),
      clause: (i.sections ?? []).join(", "),
      statusText: i.description,
      result: "Detected",
      type: "green" as const,
    })),
    ...data.needs_inspection.map((i) => ({
      title: fmt(i.class),
      clause: (i.sections ?? []).join(", "),
      statusText: i.description,
      result: "Needs Inspection",
      type: "yellow" as const,
    })),
    ...data.missing.map((i) => ({
      title: fmt(i.class),
      clause: (i.sections ?? []).join(", "),
      statusText: i.description,
      result: "Missing",
      type: "red" as const,
    })),
  ];

  return (
    <div className="p-4 sm:p-6 md:p-10 max-w-6xl mx-auto">
      <div className="mb-6 md:mb-8">
        <Link href="/reports" className="inline-flex items-center gap-2 text-indigo-500 font-medium hover:text-indigo-600 mb-4 transition-colors">
          <ArrowLeft size={16} /> Back to Reports
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight flex flex-wrap items-center gap-3">
            {data.report_name}
            <span className="px-3 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 text-indigo-600 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider border border-indigo-100/50 shadow-sm shrink-0">
              Audit Report
            </span>
          </h2>
          <div className="self-start md:self-auto px-3 py-1.5 md:px-4 md:py-2 bg-white rounded-xl border border-slate-200 shadow-sm text-xs md:text-sm font-semibold text-slate-600 shrink-0">
            {data.audit_date}
          </div>
        </div>
      </div>

      {data.violations && data.violations.length > 0 && (
        <div className="mb-6 space-y-3">
          {data.violations.map((v, i) => (
            <div
              key={i}
              className="flex items-start gap-4 bg-rose-50 border border-rose-200 border-l-4 border-l-rose-500 rounded-2xl p-4 md:p-5"
            >
              <div className="shrink-0 w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center mt-0.5">
                <ShieldAlert className="text-rose-600" size={20} />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-rose-800 text-sm md:text-base">
                  Potential DSAPT Violation
                  <span className="ml-2 px-2 py-0.5 bg-rose-100 text-rose-700 rounded text-[10px] font-bold uppercase tracking-wider border border-rose-200">
                    Critical
                  </span>
                </p>
                <p className="text-xs md:text-sm font-semibold text-rose-600 mt-1">{v.dsapt_clause}</p>
                <p className="text-sm text-rose-700 mt-1 leading-relaxed">{v.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="glass-card rounded-[24px] md:rounded-[32px] p-4 sm:p-6 md:p-8 space-y-4">
        {items.length === 0 ? (
          <div className="bg-slate-50/50 border border-slate-200 border-dashed rounded-[24px] p-10 md:p-16 text-slate-500 text-center flex flex-col items-center">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center mb-5 shadow-sm border border-slate-100">
              <X className="text-slate-300" size={32} strokeWidth={1.5} />
            </div>
            <p className="text-lg md:text-xl font-semibold text-slate-700">No detailed items available</p>
            <p className="text-sm md:text-base text-slate-400 mt-2 max-w-sm mx-auto">There are currently no report metrics generated for this audit.</p>
          </div>
        ) : (
          items.map((item, index) => {
            const isGreen = item.type === "green";
            const isYellow = item.type === "yellow";

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
                className={`${cardStyle} border rounded-[20px] p-4 md:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 md:gap-8 transition-all duration-300 hover:shadow-sm group`}
              >
                <div className="flex items-start justify-between gap-4 lg:contents">
                  <div className="flex-1 min-w-0 lg:min-w-[300px]">
                    <h3 className="text-[17px] md:text-lg font-bold text-slate-800 flex items-center justify-between break-words">
                      {item.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className="px-2.5 py-1 bg-white rounded-md text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-slate-500 shadow-sm border border-slate-100">
                        {item.clause}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-1.5 lg:min-w-[160px] lg:border-l lg:border-slate-200/50 lg:pl-6 shrink-0 mt-1 lg:mt-0">
                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-sm ${iconBg} transition-transform duration-300 group-hover:scale-110`}>
                      {isGreen && <Check size={20} className="md:w-6 md:h-6" strokeWidth={3} />}
                      {isYellow && <TriangleAlert size={18} className="md:w-[22px] md:h-[22px]" strokeWidth={3} />}
                      {!isGreen && !isYellow && <X size={20} className="md:w-6 md:h-6" strokeWidth={3} />}
                    </div>
                    <p className={`text-[10px] md:text-[13px] font-bold tracking-wide uppercase ${
                      isGreen ? "text-emerald-700" : isYellow ? "text-amber-700" : "text-rose-700"
                    }`}>
                      {item.result}
                    </p>
                  </div>
                </div>

                <div className="flex-1 text-sm font-medium text-slate-600 w-full lg:max-w-[400px] leading-relaxed bg-white/50 p-3.5 rounded-xl border border-white/60 mt-1 lg:mt-0">
                  {item.statusText}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
