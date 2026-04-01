"use client";

import { Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function HomePage() {
  const router = useRouter();

  const [locationType, setLocationType] = useState("");
  const [reportName, setReportName] = useState("");
  const [file, setFile] = useState<File | null>(null);

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
    <div className="min-h-screen bg-[#f3f6fb] p-8">
      <h2 className="text-[24px] font-bold mb-8">Generate New Report</h2>

      <div className="bg-[#e9eef7] rounded-[24px] p-8">
        <div className="grid grid-cols-[1.7fr_0.8fr] gap-8 items-stretch">
          <div className="bg-white rounded-[24px] p-8">
            <h3 className="text-[18px] font-semibold mb-2">Source Material</h3>
            <p className="text-gray-500 mb-6">
              Upload the image, you want to base the report on.
            </p>

            <div className="border-2 border-dashed border-gray-300 rounded-[20px] min-h-[480px] flex flex-col items-center justify-center text-center px-6">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-5">
                <Upload className="text-blue-600" size={28} />
              </div>

              <p className="text-[18px] mb-2">Click to upload or drag and drop</p>

              <p className="text-sm text-gray-400 mb-6">
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
                className="border border-gray-300 px-5 py-2 rounded-lg cursor-pointer bg-white hover:bg-gray-50"
              >
                Browse Files
              </label>

              {file && (
                <p className="mt-4 text-sm text-green-600 font-medium">
                  Selected: {file.name}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <label className="block text-[16px] font-semibold mb-3">
                Location Type <span className="text-red-500">*</span>
              </label>

              <select
                value={locationType}
                onChange={(e) => setLocationType(e.target.value)}
                className="w-full rounded-[14px] border border-gray-300 bg-white px-4 py-4 mb-10 outline-none"
              >
                <option value="">--- Select Type ---</option>
                <option value="bus-stop">Bus Stop</option>
                <option value="train-platform">Train Platform</option>
                <option value="tram-stop">Tram Stop</option>
              </select>

              <label className="block text-[16px] font-semibold mb-3">
                Report Name <span className="text-red-500">*</span>
              </label>

              <input
                value={reportName}
                onChange={(e) => setReportName(e.target.value)}
                className="w-full rounded-[14px] border border-gray-300 bg-white px-4 py-4 outline-none"
                placeholder="Enter report name"
              />
            </div>

            <div className="flex justify-end pt-10">
              <button
                onClick={handleGenerate}
                className="bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white font-semibold px-10 py-4 rounded-[18px] shadow-sm hover:opacity-95"
              >
                Generate
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}