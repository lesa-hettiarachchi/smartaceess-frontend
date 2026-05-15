"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Check, TriangleAlert, X, ArrowLeft, ShieldAlert, ClipboardList } from "lucide-react";
import Link from "next/link";
import { getReport, type ReportDetail } from "../../../lib/api";

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

export default function ReportDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const [data, setData] = useState<ReportDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    getReport(id)
      .then(setData)
      .catch(() => setError(true))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 md:p-10 max-w-5xl mx-auto">
        <div className="space-y-4 page-enter">
          <div className="skeleton h-8 w-48 rounded-lg" />
          <div className="skeleton h-5 w-72 rounded-lg" />
          <div className="skeleton h-64 w-full rounded-2xl mt-6" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-4 sm:p-6 md:p-10 max-w-5xl mx-auto">
        <Link
          href="/reports"
          className="inline-flex items-center gap-1.5 text-sm text-indigo-500 font-medium hover:text-indigo-600 mb-4 transition-colors"
        >
          <ArrowLeft size={15} /> Back to Reports
        </Link>
        <div className="glass-card rounded-2xl p-10 text-center">
          <p className="text-lg font-semibold text-slate-700">Report not found</p>
          <p className="text-sm text-slate-400 mt-2">
            We couldn&apos;t load report #{id}. It may have been removed.
          </p>
        </div>
      </div>
    );
  }

  // Classes in needs_inspection always show yellow — even if also in detected[].
  // detected[] drives the compliance score; needs_inspection[] drives the display.
  // If a class is in both (dual-bucket), only show the yellow entry to avoid
  // showing the same feature as both green and yellow at the same time.
  const inspectionClasses = new Set(data.needs_inspection.map((i) => i.class));

  const items = [
    ...data.detected
      .filter((i) => !inspectionClasses.has(i.class))   // skip — shown as yellow below
      .map((i) => ({
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
      ? "text-red-700 bg-red-50 border-red-200"
      : data.summary.risk_level === "Medium"
      ? "text-amber-700 bg-amber-50 border-amber-200"
      : "text-emerald-700 bg-emerald-50 border-emerald-200";

  return (
    <div className="p-4 sm:p-6 md:p-10 max-w-5xl mx-auto">

      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="mb-6 md:mb-8 page-enter">
        <Link
          href="/reports"
          className="inline-flex items-center gap-1.5 text-sm text-indigo-500 font-medium hover:text-indigo-600 mb-4 transition-colors"
        >
          <ArrowLeft size={15} /> Back to Reports
        </Link>

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight flex flex-wrap items-center gap-2.5">
              {data.report_name}
              <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-indigo-100/60 shrink-0">
                Audit Report
              </span>
            </h2>
            <p className="mt-1.5 text-sm font-medium text-slate-400">
              {fmtLocation(data.location_type)}&nbsp;&nbsp;·&nbsp;&nbsp;{fmtDate(data.audit_date)}
            </p>
          </div>

          <span className={`self-start shrink-0 px-3 py-1.5 rounded-lg border text-xs font-bold uppercase tracking-wider ${riskColour}`}>
            {data.summary.risk_level} Risk
          </span>
        </div>
      </div>

      {/* ── Scorecard ──────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-3 md:gap-4 mb-6 page-enter-delay-1">
        {[
          { value: data.summary.detected_count, label: "Detected", color: "border-l-emerald-500 text-emerald-600" },
          { value: data.summary.needs_inspection_count, label: "Need Inspection", color: "border-l-amber-500 text-amber-600" },
          { value: data.summary.missing_count, label: "Missing", color: "border-l-red-500 text-red-500" },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`glass-card rounded-xl border-l-[3px] ${stat.color} p-4 md:p-5 text-center`}
          >
            <p className={`text-2xl md:text-3xl font-bold tracking-tight tabular-nums`}>
              {stat.value}
            </p>
            <p className="text-[10px] md:text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-1">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* ── Violations banner ──────────────────────────────────── */}
      {data.violations && data.violations.length > 0 && (
        <div className="mb-6 space-y-3 page-enter-delay-2">
          {data.violations.map((v, i) => (
            <div
              key={i}
              className="flex items-start gap-3.5 bg-red-50/80 border border-red-200/80 rounded-xl p-4 md:p-5"
            >
              <div className="shrink-0 w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center mt-0.5">
                <ShieldAlert className="text-red-600" size={18} />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-red-800 text-sm md:text-[15px] flex flex-wrap items-center gap-2">
                  Potential DSAPT Violation
                  <span className="px-1.5 py-0.5 bg-red-100 text-red-700 rounded text-[9px] font-bold uppercase tracking-wider border border-red-200/60">
                    Critical
                  </span>
                </p>
                <p className="text-xs font-semibold text-red-600/80 mt-1">{v.dsapt_clause}</p>
                <p className="text-sm text-red-700/90 mt-1 leading-relaxed">{v.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Annotated image ────────────────────────────────────── */}
      {data.annotated_image_base64 && (
        <div className="glass-card rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 mb-6 page-enter-delay-2">
          <h3 className="text-base md:text-lg font-semibold text-slate-700 mb-4">
            Site Image — Detected Features
          </h3>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`data:image/jpeg;base64,${data.annotated_image_base64}`}
            alt="Annotated site image showing detected accessibility features"
            className="w-full rounded-xl border border-slate-200/80 max-w-2xl mx-auto block"
          />
          <p className="text-xs text-slate-400 text-center mt-3 font-medium">
            <span className="text-[#1D9E75] font-bold">■</span> Teal = detected &nbsp;|&nbsp;
            <span className="text-[#BA7517] font-bold">■</span> Amber = needs inspection
          </p>
        </div>
      )}

      {/* ── Items list ─────────────────────────────────────────── */}
      <div className="glass-card rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 page-enter-delay-3">
        {items.length === 0 ? (
          <div className="bg-slate-50/50 border border-slate-200 border-dashed rounded-2xl p-10 md:p-16 text-slate-500 text-center flex flex-col items-center">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm border border-slate-100">
              <X className="text-slate-300" size={28} strokeWidth={1.5} />
            </div>
            <p className="text-lg font-semibold text-slate-700">No detailed items available</p>
            <p className="text-sm text-slate-400 mt-1.5 max-w-sm mx-auto">
              There are currently no report metrics generated for this audit.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item, index) => {
              const isGreen  = item.type === "green";
              const isYellow = item.type === "yellow";

              const accentBorder = isGreen
                ? "accent-left-green"
                : isYellow
                ? "accent-left-amber"
                : "accent-left-red";

              const iconBg = isGreen
                ? "bg-emerald-100 text-emerald-600"
                : isYellow
                ? "bg-amber-100 text-amber-600"
                : "bg-red-100 text-red-500";

              return (
                <div
                  key={index}
                  className={`${accentBorder} bg-white/60 border border-slate-100 rounded-xl p-4 md:p-5 transition-all duration-200 hover:shadow-sm group`}
                >
                  {/* Top row: title + clause + status icon */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[15px] md:text-base font-bold text-slate-800">
                        {item.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                        {item.clause && (
                          <span className="px-2 py-0.5 bg-slate-50 rounded text-[10px] font-bold uppercase tracking-wider text-slate-400 border border-slate-100">
                            {item.clause}
                          </span>
                        )}
                        {item.confidence !== undefined && (
                          <span className="px-2 py-0.5 bg-slate-50 rounded text-[10px] font-semibold text-slate-400 border border-slate-100">
                            {Math.round(item.confidence * 100)}% conf.
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-center gap-1 shrink-0 mt-0.5">
                      <div className={`w-9 h-9 md:w-10 md:h-10 rounded-lg flex items-center justify-center ${iconBg} transition-transform duration-200 group-hover:scale-105`}>
                        {isGreen  && <Check size={18} strokeWidth={3} />}
                        {isYellow && <TriangleAlert size={16} strokeWidth={2.5} />}
                        {!isGreen && !isYellow && <X size={18} strokeWidth={3} />}
                      </div>
                      <p className={`text-[9px] md:text-[10px] font-bold tracking-wide uppercase ${
                        isGreen ? "text-emerald-600" : isYellow ? "text-amber-600" : "text-red-500"
                      }`}>
                        {item.result}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mt-3 text-sm text-slate-600 leading-relaxed bg-slate-50/60 p-3 rounded-lg border border-slate-100/60">
                    {item.statusText}
                  </div>

                  {/* Inspection checklist (needs_inspection items only) */}
                  {item.inspectionItems.length > 0 && (
                    <div className="mt-3 bg-amber-50/60 border border-amber-200/50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <ClipboardList size={13} className="text-amber-600 shrink-0" />
                        <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">
                          Physical Checks Required
                        </p>
                      </div>
                      <ul className="space-y-1.5">
                        {item.inspectionItems.map((check, ci) => (
                          <li key={ci} className="flex items-start gap-2 text-xs md:text-sm text-amber-800">
                            <span className="mt-0.5 shrink-0 w-4 h-4 rounded border border-amber-300 bg-white flex items-center justify-center text-[8px] text-amber-400">□</span>
                            {check}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
