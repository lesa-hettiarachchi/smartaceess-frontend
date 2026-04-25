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
      <div className="p-6 md:p-10 max-w-6xl mx-auto">
        <p className="text-slate-400 text-center py-16">Loading measurements…</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6 md:p-10 max-w-6xl mx-auto">
        <p className="text-slate-400 text-center py-16">Report not found.</p>
      </div>
    );
  }

  const measured   = data.items.filter((i) => i.measurement);
  const unmeasured = data.items.filter((i) => !i.measurement);

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

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
              {data.report_name}
            </h2>
            <p className="text-slate-500 mt-1 text-sm md:text-base">
              Physical measurements required for DSAPT compliance
            </p>
          </div>

          <div className="self-start flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-sm font-semibold shrink-0">
            <TriangleAlert size={15} />
            {unmeasured.length} item{unmeasured.length !== 1 ? "s" : ""} pending
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-6">

        {/* ── Items to measure ───────────────────────────────────── */}
        <div className="glass-card rounded-[24px] md:rounded-[32px] p-4 sm:p-6 md:p-8">
          <div className="flex items-center gap-2 mb-5">
            <ClipboardList className="text-indigo-500" size={20} />
            <h3 className="text-lg font-semibold text-slate-800">Items to Measure</h3>
          </div>

          {data.items.length === 0 ? (
            <p className="text-slate-400 text-sm py-8 text-center">
              No measurement items for this report.
            </p>
          ) : (
            <div className="space-y-3">
              {data.items.map((item, index) => (
                <div
                  key={index}
                  className={`rounded-[18px] border p-4 md:p-5 transition-all ${
                    item.measurement
                      ? "bg-emerald-50/50 border-emerald-100"
                      : "bg-amber-50/50 border-amber-100"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-bold text-slate-800 text-[15px] md:text-base">
                        {fmt(item.item_name)}
                      </p>
                      <p className="text-xs md:text-sm text-slate-500 mt-1 leading-relaxed">
                        {item.description}
                      </p>

                      {/* Inspection checklist */}
                      {item.inspection_items.length > 0 && (
                        <ul className="mt-2.5 space-y-1">
                          {item.inspection_items.map((check, ci) => (
                            <li key={ci} className="flex items-start gap-2 text-xs text-amber-700">
                              <span className="mt-0.5 shrink-0">•</span>
                              {check}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <div className="shrink-0 mt-0.5">
                      {item.measurement ? (
                        <CheckCircle className="text-emerald-500" size={22} />
                      ) : (
                        <TriangleAlert className="text-amber-500" size={20} />
                      )}
                    </div>
                  </div>

                  {item.measurement && (
                    <div className="mt-3 px-3 py-2 bg-emerald-100/60 rounded-xl border border-emerald-200/60">
                      <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-0.5">
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
            <div className="mt-5 pt-5 border-t border-slate-200/60">
              <div className="flex justify-between text-xs font-semibold text-slate-500 mb-2">
                <span>Progress</span>
                <span>{measured.length} / {data.items.length} measured</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${data.items.length ? (measured.length / data.items.length) * 100 : 0}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* ── Measurement form ───────────────────────────────────── */}
        <div className="glass-card rounded-[24px] md:rounded-[32px] p-4 sm:p-6 md:p-8 h-fit">
          <h3 className="text-lg font-semibold text-slate-800 mb-5">Record Measurement</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Item <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={selectedItem}
                  onChange={(e) => setSelectedItem(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white/60 px-5 py-4 outline-none focus-ring text-slate-700 appearance-none shadow-sm cursor-pointer transition-all text-sm"
                >
                  <option value="">Select item…</option>
                  {data.items.map((item) => (
                    <option key={item.item_name} value={item.item_name}>
                      {fmt(item.item_name)}{item.measurement ? " ✓" : ""}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 text-slate-500">
                  <svg className="fill-current h-4 w-4" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Measured Value <span className="text-rose-500">*</span>
              </label>
              <input
                value={measuredValue}
                onChange={(e) => setMeasuredValue(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white/60 px-5 py-4 outline-none focus-ring text-slate-700 shadow-sm transition-all text-sm"
                placeholder="e.g. 1:16, 820 mm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="w-full rounded-2xl border border-slate-200 bg-white/60 px-5 py-4 outline-none focus-ring text-slate-700 shadow-sm transition-all text-sm resize-none"
                placeholder="e.g. Checked with inclinometer"
              />
            </div>

            {saved && (
              <div className="flex items-center gap-2 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm font-semibold">
                <CheckCircle size={16} />
                Measurement saved successfully.
              </div>
            )}

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full relative group overflow-hidden rounded-2xl p-[1px] shadow-sm hover:shadow-lg transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-2xl opacity-90 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative bg-white/10 backdrop-blur-sm flex items-center justify-center gap-2 text-white font-semibold text-base px-8 py-3.5 rounded-2xl transition-transform duration-300 active:scale-95">
                {isSaving ? "Saving…" : "Save Measurement"}
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
