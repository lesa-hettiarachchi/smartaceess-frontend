"use client";

import { Upload, Sparkles, WifiOff, FileText, X as XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { submitAudit } from "../lib/api";
import AuditLoadingOverlay from "../components/AuditLoadingOverlay";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

export default function HomePage() {
  const router = useRouter();

  const [locationType, setLocationType] = useState("");
  const [reportName, setReportName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [backendOk, setBackendOk] = useState<boolean | null>(null);

  // Generate preview URL for image files
  const previewUrl = useMemo(() => {
    if (!file) return null;
    if (file.type.startsWith("image/")) {
      return URL.createObjectURL(file);
    }
    return null;
  }, [file]);

  // Cleanup object URL on unmount or file change
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  useEffect(() => {
    fetch(`${API_URL}/health`)
      .then((r) => setBackendOk(r.ok))
      .catch(() => setBackendOk(false));
  }, []);

  const handleGenerate = async () => {
    if (!file) {
      alert("Please select a jpg, png, or pdf file.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("File is too large. Maximum size is 10 MB.");
      return;
    }

    if (!locationType) {
      alert("Please select a location type.");
      return;
    }

    if (!reportName.trim()) {
      alert("Please enter a report name.");
      return;
    }

    setIsLoading(true);
    try {
      const result = await submitAudit(file, locationType, reportName);
      router.push(`/reports/${result.id}`);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Audit failed. Is the backend running?");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <AuditLoadingOverlay />}
      <div className="p-5 sm:p-6 md:p-10 max-w-5xl mx-auto">

        {/* Backend warning */}
        {backendOk === false && (
          <div className="mb-5 page-enter flex items-center gap-3 bg-red-50 border border-red-200/80 rounded-xl px-4 py-3.5">
            <WifiOff className="shrink-0 text-red-500" size={18} />
            <p className="text-red-700 font-medium text-sm">
              Audit service unavailable — please try again later.
            </p>
          </div>
        )}

        {/* Page header */}
        <div className="mb-6 md:mb-8 page-enter">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
            Generate New Report
          </h2>
          <p className="text-slate-500 mt-1.5 text-sm md:text-[15px]">
            Upload an image to start an accessibility audit.
          </p>
        </div>

        {/* Main card */}
        <div className="glass-card rounded-2xl md:rounded-3xl p-5 sm:p-6 md:p-8 page-enter-delay-1">
          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6 lg:gap-10 items-stretch">

            {/* ── Upload area ──────────────────────────────────────────────── */}
            <div className="flex flex-col">
              <h3 className="text-base font-semibold mb-1 text-slate-800">Source Material</h3>
              <p className="text-slate-400 mb-4 text-sm">
                Upload the image or document for your audit.
              </p>

              <div
                className={`
                  flex-1 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center
                  text-center px-5 py-8 transition-all duration-300 relative overflow-hidden
                  min-h-[260px] md:min-h-[380px] group cursor-pointer
                  ${isHovering
                    ? "border-indigo-400 bg-indigo-50/40"
                    : "border-slate-200 bg-slate-50/40 hover:bg-slate-50/70 hover:border-slate-300"
                  }
                `}
                onDragOver={(e) => { e.preventDefault(); setIsHovering(true); }}
                onDragLeave={() => setIsHovering(false)}
                onDrop={(e) => { e.preventDefault(); setIsHovering(false); setFile(e.dataTransfer.files?.[0] || null); }}
                onClick={() => document.getElementById("fileUpload")?.click()}
              >
                {/* Hover gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/10 to-violet-100/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {file ? (
                  /* ── File selected state ─────────────────────────────────── */
                  <div className="relative z-10 flex flex-col items-center w-full">
                    {previewUrl ? (
                      /* Image preview */
                      <div className="w-full max-w-[280px] md:max-w-[320px] mb-4 rounded-xl overflow-hidden border border-slate-200/80 shadow-sm">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={previewUrl}
                          alt="Upload preview"
                          className="w-full h-auto max-h-[200px] md:max-h-[280px] object-contain bg-white"
                        />
                      </div>
                    ) : (
                      /* PDF / non-image fallback icon */
                      <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center mb-4 shadow-sm">
                        <FileText className="text-emerald-600" size={24} />
                      </div>
                    )}
                    <p className="text-base font-semibold text-slate-800 mb-1 max-w-[280px] truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-slate-400 font-medium mb-4">
                      {formatFileSize(file.size)}
                    </p>
                    <button
                      onClick={(e) => { e.stopPropagation(); setFile(null); }}
                      className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-red-600 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-red-200 hover:bg-red-50 transition-all shadow-xs"
                    >
                      <XIcon size={13} />
                      Remove
                    </button>
                  </div>
                ) : (
                  /* ── Empty upload state ──────────────────────────────────── */
                  <>
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white border border-slate-200/80 flex items-center justify-center mb-4 shadow-sm relative z-10 group-hover:shadow-md group-hover:border-indigo-200 transition-all duration-300">
                      <Upload className="text-indigo-500" size={24} />
                    </div>

                    <p className="text-base font-semibold text-slate-700 mb-1 relative z-10">
                      Drop file here or browse
                    </p>

                    <p className="text-xs text-slate-400 relative z-10 font-medium">
                      PNG, JPG or PDF — max 10 MB
                    </p>
                  </>
                )}

                <input
                  type="file"
                  accept="image/jpeg,image/png,application/pdf"
                  id="fileUpload"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
              </div>
            </div>

            {/* ── Form area ────────────────────────────────────────────────── */}
            <div className="flex flex-col justify-between">
              <div>
                {/* Location Type */}
                <div className="mb-5">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Location Type <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={locationType}
                      onChange={(e) => setLocationType(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white/70 px-4 py-3.5 outline-none focus-ring text-slate-700 appearance-none shadow-xs cursor-pointer transition-all text-sm"
                    >
                      <option value="" disabled>Select transportation type...</option>
                      <option value="bus_stop">Bus Stop</option>
                      <option value="tram_stop">Tram Stop</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                  </div>
                </div>

                {/* Report Name */}
                <div className="mb-5">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Report Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    value={reportName}
                    onChange={(e) => setReportName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white/70 px-4 py-3.5 outline-none focus-ring text-slate-700 shadow-xs transition-all text-sm placeholder:text-slate-350"
                    placeholder="E.g., Central Station Platform 2"
                  />
                </div>
              </div>

              {/* Generate button */}
              <div className="pt-4 mt-auto">
                <button
                  onClick={handleGenerate}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-[15px] px-6 py-3.5 md:py-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-indigo-600"
                >
                  <Sparkles size={17} className="text-white/80" />
                  {isLoading ? "Running Audit…" : "Generate Report"}
                </button>
                <p className="text-center text-xs text-slate-400 mt-3 font-medium">
                  Estimated AI processing time: ~45s
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}