"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, ClipboardList, CheckCircle, TriangleAlert } from "lucide-react";
import { getMeasure, saveMeasurement, type MeasureData } from "../../../lib/api";

function fmt(cls: string) {
  return cls.split("_").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");
}

export default function MeasurePage() {
  const params   = useParams();
  const id       = params.id as string;

  const [data, setData]             = useState<MeasureData | null>(null);
  const [isLoading, setIsLoading]   = useState(true);
  const [selectedItem, setSelectedItem] = useState("");
  const [measuredValue, setMeasuredValue] = useState("");
  const [notes, setNotes]           = useState("");
  const [isSaving, setIsSaving]     = useState(false);
  const [saved, setSaved]           = useState(false);

  const fetchData = () =>
    getMeasure(id)
      .then(setData)
      .catch(console.error)
      .finally(() => setIsLoading(false));

  useEffect(() => { fetchData(); }, [id]);

  const handleSave = async () => {
    if (!selectedItem || !measuredValue.trim()) {
      alert("Please select an item and enter a measured value.");
      return;
    }
    setIsSaving(true);
    setSaved(false);
    try {
      await saveMeasurement(id, selectedItem, measuredValue, notes);
      setSelectedItem("");
      setMeasuredValue("");
      setNotes("");
      setSaved(true);
      await fetchData();
      setTimeout(() => setSaved(false), 3000);
    } catch {
      alert("Failed to save measurement. Is the backend running?");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-5 sm:p-6 md:p-10 max-w-5xl mx-auto">
        <div className="space-y-4 page-enter">
          <div className="skeleton h-8 w-48 rounded-lg" />
          <div className="skeleton h-5 w-72 rounded-lg" />
          <div className="skeleton h-64 w-full rounded-2xl mt-6" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-5 sm:p-6 md:p-10 max-w-5xl mx-auto">
        <p className="text-slate-400 text-center py-16">Report not found.</p>
      </div>
    );
  }

  const measured   = data.items.filter((i) => i.measurement);
  const unmeasured = data.items.filter((i) => !i.measurement);

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

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
              {data.report_name}
            </h2>
            <p className="text-slate-400 mt-1 text-sm">
              Physical measurements required for DSAPT compliance
            </p>
          </div>

          <div className="self-start flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200/70 rounded-lg text-amber-700 text-sm font-semibold shrink-0">
            <TriangleAlert size={14} />
            {unmeasured.length} item{unmeasured.length !== 1 ? "s" : ""} pending
          </div>
        </div>
      </div>

      {/* ── Mobile: Form first, then items ─────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-5">

        {/* ── Measurement form (shows first on mobile via order) ── */}
        <div className="glass-card rounded-2xl p-4 sm:p-6 md:p-7 h-fit order-1 xl:order-2 page-enter-delay-1">
          <h3 className="text-base font-semibold text-slate-800 mb-4">Record Measurement</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Item <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <select
                  value={selectedItem}
                  onChange={(e) => setSelectedItem(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white/70 px-4 py-3.5 outline-none focus-ring text-slate-700 appearance-none shadow-xs cursor-pointer transition-all text-sm"
                >
                  <option value="">Select item…</option>
                  {data.items.map((item) => (
                    <option key={item.item_name} value={item.item_name}>
                      {fmt(item.item_name)}{item.measurement ? " ✓" : ""}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                  <svg className="fill-current h-4 w-4" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Measured Value <span className="text-red-400">*</span>
              </label>
              <input
                value={measuredValue}
                onChange={(e) => setMeasuredValue(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white/70 px-4 py-3.5 outline-none focus-ring text-slate-700 shadow-xs transition-all text-sm"
                placeholder="e.g. 1:16, 820 mm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-slate-200 bg-white/70 px-4 py-3.5 outline-none focus-ring text-slate-700 shadow-xs transition-all text-sm resize-none"
                placeholder="e.g. Checked with inclinometer"
              />
            </div>

            {saved && (
              <div className="flex items-center gap-2 px-3.5 py-2.5 bg-emerald-50 border border-emerald-200/70 rounded-lg text-emerald-700 text-sm font-semibold">
                <CheckCircle size={15} />
                Measurement saved successfully.
              </div>
            )}

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-[15px] px-6 py-3.5 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? "Saving…" : "Save Measurement"}
            </button>
          </div>
        </div>

        {/* ── Items to measure ───────────────────────────────────── */}
        <div className="glass-card rounded-2xl p-4 sm:p-6 md:p-7 order-2 xl:order-1 page-enter-delay-2">
          <div className="flex items-center gap-2 mb-4">
            <ClipboardList className="text-indigo-500" size={18} />
            <h3 className="text-base font-semibold text-slate-800">Items to Measure</h3>
          </div>

          {data.items.length === 0 ? (
            <p className="text-slate-400 text-sm py-8 text-center">
              No measurement items for this report.
            </p>
          ) : (
            <div className="space-y-2.5">
              {data.items.map((item, index) => (
                <div
                  key={index}
                  className={`rounded-xl border p-3.5 md:p-4 transition-all ${
                    item.measurement
                      ? "bg-emerald-50/40 border-emerald-100/60 accent-left-green"
                      : "bg-amber-50/40 border-amber-100/60 accent-left-amber"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-slate-800 text-sm md:text-[15px]">
                        {fmt(item.item_name)}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed line-clamp-2">
                        {item.description}
                      </p>

                      {/* Inspection checklist */}
                      {item.inspection_items.length > 0 && (
                        <ul className="mt-2 space-y-1">
                          {item.inspection_items.map((check, ci) => (
                            <li key={ci} className="flex items-start gap-1.5 text-[11px] text-amber-700">
                              <span className="mt-0.5 shrink-0">•</span>
                              {check}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <div className="shrink-0 mt-0.5">
                      {item.measurement ? (
                        <CheckCircle className="text-emerald-500" size={20} />
                      ) : (
                        <TriangleAlert className="text-amber-500" size={18} />
                      )}
                    </div>
                  </div>

                  {item.measurement && (
                    <div className="mt-2.5 px-3 py-2 bg-emerald-100/50 rounded-lg border border-emerald-200/50">
                      <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider mb-0.5">
                        Measurement recorded
                      </p>
                      <p className="text-sm font-semibold text-emerald-800">
                        {item.measurement.measured_value}
                      </p>
                      {item.measurement.notes && (
                        <p className="text-xs text-emerald-600 mt-0.5">{item.measurement.notes}</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Progress */}
          {data.items.length > 0 && (
            <div className="mt-5 pt-4 border-t border-slate-100">
              <div className="flex justify-between text-[11px] font-semibold text-slate-400 mb-2">
                <span>Progress</span>
                <span className="tabular-nums">{measured.length} / {data.items.length} measured</span>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${data.items.length ? (measured.length / data.items.length) * 100 : 0}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
