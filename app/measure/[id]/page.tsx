"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getMeasure, saveMeasurement, type MeasureData } from "../../../lib/api";

function fmt(cls: string) {
  return cls.split("_").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");
}

export default function MeasurePage() {
  const params = useParams();
  const id = params.id as string;

  const [data, setData] = useState<MeasureData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState("");
  const [measuredValue, setMeasuredValue] = useState("");
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);

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
    try {
      await saveMeasurement(id, selectedItem, measuredValue, notes);
      setSelectedItem("");
      setMeasuredValue("");
      setNotes("");
      await fetchData();
    } catch {
      alert("Failed to save measurement. Is the backend running?");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="p-8 text-slate-500">Loading...</div>;
  if (!data) return <div className="p-8 text-slate-500">Report not found.</div>;

  return (
    <div className="min-h-screen bg-[#f3f6fb] p-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-[24px] font-bold">Measure Report</h2>
        <Link
          href="/reports"
          className="bg-white border border-gray-300 px-5 py-2 rounded-lg hover:bg-gray-50"
        >
          Back to Reports
        </Link>
      </div>

      <div className="bg-[#e9eef7] rounded-[24px] p-8 space-y-8">
        <div className="bg-white rounded-[20px] p-6">
          <h3 className="text-[22px] font-semibold mb-2">{data.report_name}</h3>
          <p className="text-gray-600">
            Items below need physical measurement to confirm DSAPT compliance.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white rounded-[20px] p-6">
            <h4 className="text-[18px] font-semibold mb-4">Items To Measure</h4>
            <div className="space-y-4">
              {data.items.length === 0 ? (
                <p className="text-gray-500">No measurement items for this report.</p>
              ) : (
                data.items.map((item, index) => (
                  <div key={index} className="rounded-[14px] bg-yellow-100 px-4 py-3">
                    <p className="font-semibold">{fmt(item.item_name)}</p>
                    <p className="text-sm text-gray-700 mt-1">{item.description}</p>
                    {item.measurement && (
                      <p className="text-sm text-green-700 mt-2 font-medium">
                        ✓ Measured: {item.measurement.measured_value}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white rounded-[20px] p-6">
            <h4 className="text-[18px] font-semibold mb-4">Measurement Form</h4>
            <div className="space-y-4">
              <div>
                <label className="block font-medium mb-2">Item Name</label>
                <select
                  value={selectedItem}
                  onChange={(e) => setSelectedItem(e.target.value)}
                  className="w-full border border-gray-300 rounded-[12px] px-4 py-3"
                >
                  <option value="">Select item...</option>
                  {data.items.map((item) => (
                    <option key={item.item_name} value={item.item_name}>
                      {fmt(item.item_name)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium mb-2">Measured Value</label>
                <input
                  value={measuredValue}
                  onChange={(e) => setMeasuredValue(e.target.value)}
                  className="w-full border border-gray-300 rounded-[12px] px-4 py-3"
                  placeholder="e.g. 1:16, 820mm"
                />
              </div>

              <div>
                <label className="block font-medium mb-2">Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full border border-gray-300 rounded-[12px] px-4 py-3 min-h-[120px]"
                  placeholder="Enter notes"
                />
              </div>

              <button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-purple-600 text-white px-6 py-3 rounded-[14px] hover:bg-purple-700 disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save Measurement"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
