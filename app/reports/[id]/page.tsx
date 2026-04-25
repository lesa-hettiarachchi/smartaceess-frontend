import { notFound } from "next/navigation";
import { Check, TriangleAlert, X, ArrowLeft, ShieldAlert, ClipboardList } from "lucide-react";
import Link from "next/link";
import { getReport } from "../../../lib/api";

function fmt(cls: string) {
  return cls.split("_").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");
}

function fmtLocation(loc: string) {
  const map: Record<string, string> = {
    bus_stop: "Bus Stop",
    tram_stop: "Tram Stop",
    railway_platform: "Railway Platform",
    station_entrance: "Station Entrance",
  };
  return map[loc] ?? loc.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function fmtDate(iso: string) {
  try {
    return new Date(iso + "T00:00:00").toLocaleDateString("en-AU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return iso;
  }
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
      confidence: i.confidence,
      result: "Detected",
      type: "green" as const,
      inspectionItems: [] as string[],
    })),
    ...data.needs_inspection.map((i) => ({
      title: fmt(i.class),
      clause: (i.sections ?? []).join(", "),
      statusText: i.description,
      confidence: i.confidence,
      result: "Needs Inspection",
      type: "yellow" as const,
      inspectionItems: i.inspection_items ?? [],
    })),
    ...data.missing.map((i) => ({
      title: fmt(i.class),
      clause: (i.sections ?? []).join(", "),
      statusText: i.description,
      confidence: undefined,
      result: "Missing",
      type: "red" as const,
      inspectionItems: [] as string[],
    })),
  ];

  const riskColour =
    data.summary.risk_level === "High"
      ? "text-rose-600 bg-rose-50 border-rose-200"
      : data.summary.risk_level === "Medium"
      ? "text-amber-600 bg-amber-50 border-amber-200"
      : "text-emerald-600 bg-emerald-50 border-emerald-200";

  return (
    <div className="p-4 sm:p-6 md:p-10 max-w-6xl mx-auto">

      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="mb-6 md:mb-8">
        <Link
          href="/reports"
          className="inline-flex items-center gap-2 text-indigo-500 font-medium hover:text-indigo-600 mb-4 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Reports
        </Link>

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight flex flex-wrap items-center gap-3">
              {data.report_name}
              <span className="px-3 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 text-indigo-600 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider border border-indigo-100/50 shadow-sm shrink-0">
                Audit Report
              </span>
            </h2>
            <p className="mt-2 text-sm md:text-base font-medium text-slate-500">
              {fmtLocation(data.location_type)}&nbsp;&nbsp;—&nbsp;&nbsp;{fmtDate(data.audit_date)}
            </p>
          </div>

          <span className={`self-start shrink-0 px-3 py-1.5 rounded-xl border text-xs md:text-sm font-bold uppercase tracking-wider ${riskColour}`}>
            {data.summary.risk_level} Risk
          </span>
        </div>
      </div>

      {/* ── Scorecard ──────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-3 md:gap-5 mb-6">
        <div className="glass-card rounded-2xl p-4 md:p-6 text-center">
          <p className="text-3xl md:text-4xl font-bold text-emerald-600 tracking-tight">
            {data.summary.detected_count}
          </p>
          <p className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-wider mt-1.5">
            Detected
          </p>
        </div>
        <div className="glass-card rounded-2xl p-4 md:p-6 text-center">
          <p className="text-3xl md:text-4xl font-bold text-amber-500 tracking-tight">
            {data.summary.needs_inspection_count}
          </p>
          <p className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-wider mt-1.5">
            Need Inspection
          </p>
        </div>
        <div className="glass-card rounded-2xl p-4 md:p-6 text-center">
          <p className="text-3xl md:text-4xl font-bold text-rose-500 tracking-tight">
            {data.summary.missing_count}
          </p>
          <p className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-wider mt-1.5">
            Missing
          </p>
        </div>
      </div>

      {/* ── Violations banner ──────────────────────────────────── */}
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

      {/* ── Annotated image ────────────────────────────────────── */}
      {data.annotated_image_base64 && (
        <div className="glass-card rounded-[24px] md:rounded-[32px] p-4 sm:p-6 md:p-8 mb-6">
          <h3 className="text-base md:text-lg font-semibold text-slate-700 mb-4">
            Site Image — Detected Features
          </h3>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`data:image/jpeg;base64,${data.annotated_image_base64}`}
            alt="Annotated site image showing detected accessibility features"
            className="w-full rounded-xl border border-slate-200 max-w-2xl mx-auto block"
          />
          <p className="text-xs md:text-sm text-slate-500 text-center mt-3 font-medium">
            <span className="text-[#1D9E75] font-bold">■</span> Teal = detected &nbsp;|&nbsp;
            <span className="text-[#BA7517] font-bold">■</span> Amber = needs inspection
          </p>
        </div>
      )}

      {/* ── Items list ─────────────────────────────────────────── */}
      <div className="glass-card rounded-[24px] md:rounded-[32px] p-4 sm:p-6 md:p-8 space-y-4">
        {items.length === 0 ? (
          <div className="bg-slate-50/50 border border-slate-200 border-dashed rounded-[24px] p-10 md:p-16 text-slate-500 text-center flex flex-col items-center">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center mb-5 shadow-sm border border-slate-100">
              <X className="text-slate-300" size={32} strokeWidth={1.5} />
            </div>
            <p className="text-lg md:text-xl font-semibold text-slate-700">No detailed items available</p>
            <p className="text-sm md:text-base text-slate-400 mt-2 max-w-sm mx-auto">
              There are currently no report metrics generated for this audit.
            </p>
          </div>
        ) : (
          items.map((item, index) => {
            const isGreen  = item.type === "green";
            const isYellow = item.type === "yellow";

            const cardStyle = isGreen
              ? "bg-emerald-50/50 border-emerald-100/50 hover:border-emerald-200"
              : isYellow
              ? "bg-amber-50/50 border-amber-100/50 hover:border-amber-200"
              : "bg-rose-50/50 border-rose-100/50 hover:border-rose-200";

            const iconBg = isGreen
              ? "bg-emerald-100 text-emerald-600"
              : isYellow
              ? "bg-amber-100 text-amber-600"
              : "bg-rose-100 text-rose-600";

            return (
              <div
                key={index}
                className={`${cardStyle} border rounded-[20px] p-4 md:p-5 transition-all duration-300 hover:shadow-sm group`}
              >
                {/* Top row: title + clause + status icon */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[17px] md:text-lg font-bold text-slate-800">
                      {item.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      {item.clause && (
                        <span className="px-2.5 py-1 bg-white rounded-md text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-slate-500 shadow-sm border border-slate-100">
                          {item.clause}
                        </span>
                      )}
                      {item.confidence !== undefined && (
                        <span className="px-2.5 py-1 bg-white rounded-md text-[10px] md:text-[11px] font-semibold text-slate-400 border border-slate-100">
                          {Math.round(item.confidence * 100)}% confidence
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-1.5 shrink-0 mt-1">
                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-sm ${iconBg} transition-transform duration-300 group-hover:scale-110`}>
                      {isGreen  && <Check size={20} strokeWidth={3} />}
                      {isYellow && <TriangleAlert size={18} strokeWidth={3} />}
                      {!isGreen && !isYellow && <X size={20} strokeWidth={3} />}
                    </div>
                    <p className={`text-[10px] md:text-[13px] font-bold tracking-wide uppercase ${
                      isGreen ? "text-emerald-700" : isYellow ? "text-amber-700" : "text-rose-700"
                    }`}>
                      {item.result}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <div className="mt-3 text-sm font-medium text-slate-600 leading-relaxed bg-white/50 p-3.5 rounded-xl border border-white/60">
                  {item.statusText}
                </div>

                {/* Inspection checklist (needs_inspection items only) */}
                {item.inspectionItems.length > 0 && (
                  <div className="mt-3 bg-amber-50/70 border border-amber-200/60 rounded-xl p-3.5">
                    <div className="flex items-center gap-2 mb-2">
                      <ClipboardList size={14} className="text-amber-600 shrink-0" />
                      <p className="text-[11px] md:text-xs font-bold text-amber-700 uppercase tracking-wider">
                        Physical Checks Required
                      </p>
                    </div>
                    <ul className="space-y-1.5">
                      {item.inspectionItems.map((check, ci) => (
                        <li key={ci} className="flex items-start gap-2 text-xs md:text-sm text-amber-800">
                          <span className="mt-0.5 shrink-0 w-4 h-4 rounded border border-amber-400 bg-white flex items-center justify-center text-[8px] text-amber-500">□</span>
                          {check}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
