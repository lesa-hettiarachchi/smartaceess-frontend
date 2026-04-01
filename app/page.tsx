"use client";

import { Upload, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function HomePage() {
  const router = useRouter();

  const [locationType, setLocationType] = useState("");
  const [reportName, setReportName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isHovering, setIsHovering] = useState(false);

  const handleGenerate = () => {
    if (!file) {
      alert("Please select an image or PDF file.");
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

    alert("Frontend only: report generated successfully.");
    router.push("/reports");
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto">
      <div className="mb-6 md:mb-8 text-center md:text-left">
        <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Generate New Report</h2>
        <p className="text-slate-500 mt-2 text-md md:text-lg">Upload an image to start an accessibility audit.</p>
      </div>

      <div className="glass-card rounded-[24px] md:rounded-[32px] p-6 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8 lg:gap-10 items-stretch">
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold mb-1 text-slate-800">Source Material</h3>
            <p className="text-slate-500 mb-4 md:mb-6 text-sm">
              Upload the image or document you want to base the report on.
            </p>

            <div 
              className={`flex-1 border-2 border-dashed rounded-[20px] md:rounded-[24px] flex flex-col items-center justify-center text-center px-4 py-8 md:px-6 transition-all duration-300 min-h-[300px] md:min-h-[460px] relative overflow-hidden group ${
                isHovering ? "border-indigo-400 bg-indigo-50/50" : "border-slate-300 bg-slate-50/50 hover:bg-slate-50 hover:border-indigo-300"
              }`}
              onDragOver={(e) => { e.preventDefault(); setIsHovering(true); }}
              onDragLeave={() => setIsHovering(false)}
              onDrop={(e) => { e.preventDefault(); setIsHovering(false); setFile(e.dataTransfer.files?.[0] || null); }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 to-purple-100/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 md:mb-6 relative z-10 group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
                <Upload className="text-indigo-500" size={28} />
              </div>

              <p className="text-lg md:text-xl font-medium text-slate-700 mb-2 relative z-10">Select or drop file</p>

              <p className="text-xs md:text-sm text-slate-400 mb-6 md:mb-8 relative z-10 font-medium hidden sm:block">
                SVG, PNG, JPG or PDF (max. 10MB)
              </p>

              <input
                type="file"
                accept="image/*,.pdf"
                id="fileUpload"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />

              <label
                htmlFor="fileUpload"
                className="bg-white border border-slate-200 text-slate-700 px-6 py-2.5 rounded-full font-medium cursor-pointer hover:bg-slate-50 hover:border-indigo-200 hover:text-indigo-600 shadow-sm transition-all duration-200 relative z-10 text-sm md:text-base w-full sm:w-auto"
              >
                Browse Files
              </label>

              {file && (
                <div className="mt-6 px-4 py-2 bg-green-50 rounded-xl border border-green-100 relative z-10 flex items-center gap-2 max-w-[90%]">
                  <div className="w-2 h-2 rounded-full bg-green-500 shrink-0"></div>
                  <p className="text-sm text-green-700 font-medium truncate">
                    {file.name}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <div className="mb-6 md:mb-8">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Location Type <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={locationType}
                    onChange={(e) => setLocationType(e.target.value)}
                    className="w-full rounded-[16px] md:rounded-2xl border border-slate-200 bg-white/60 px-5 py-4 outline-none focus-ring text-slate-700 appearance-none shadow-sm cursor-pointer transition-all text-sm md:text-base"
                  >
                    <option value="" disabled>Select transportation type...</option>
                    <option value="bus-stop">Bus Stop</option>
                    <option value="train-platform">Train Platform</option>
                    <option value="tram-stop">Tram Stop</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 text-slate-500">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Report Name <span className="text-red-500">*</span>
                </label>
                <input
                  value={reportName}
                  onChange={(e) => setReportName(e.target.value)}
                  className="w-full rounded-[16px] md:rounded-2xl border border-slate-200 bg-white/60 px-5 py-4 outline-none focus-ring text-slate-700 shadow-sm transition-all text-sm md:text-base"
                  placeholder="E.g., Central Station Platform 2"
                />
              </div>
            </div>

            <div className="pt-4 md:pt-8 mt-auto">
              <button
                onClick={handleGenerate}
                className="w-full relative group overflow-hidden rounded-[16px] md:rounded-2xl p-[1px] shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-[16px] md:rounded-2xl opacity-90 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative bg-white/10 backdrop-blur-sm flex items-center justify-center gap-2 text-white font-semibold text-base md:text-lg px-8 py-3.5 md:py-4 rounded-[16px] md:rounded-2xl transition-transform duration-300 active:scale-95 group-hover:scale-[0.99] md:group-hover:scale-[0.98]">
                  <Sparkles size={18} className="text-white/90" />
                  <span>Generate Report</span>
                </div>
              </button>
              <p className="text-center text-xs text-slate-400 mt-3 md:mt-4 font-medium hidden sm:block">Estimated AI processing time: ~45s</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}