import Link from "next/link";
import { notFound } from "next/navigation";
import { reports } from "../../../data/reports";

export default async function MeasurePage({
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
          <h3 className="text-[22px] font-semibold mb-2">{report.name}</h3>
          <p className="text-gray-600">
            This is a frontend-only measurement screen for items that need manual
            measurement or inspection.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white rounded-[20px] p-6">
            <h4 className="text-[18px] font-semibold mb-4">Items To Measure</h4>

            <div className="space-y-4">
              {report.items.filter((item) => item.type === "yellow").length === 0 ? (
                <p className="text-gray-500">No measurement items for this report.</p>
              ) : (
                report.items
                  .filter((item) => item.type === "yellow")
                  .map((item, index) => (
                    <div
                      key={index}
                      className="rounded-[14px] bg-yellow-100 px-4 py-3"
                    >
                      <p className="font-semibold">{item.title}</p>
                      <p className="text-sm text-gray-700 mt-1">{item.statusText}</p>
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
                <input
                  className="w-full border border-gray-300 rounded-[12px] px-4 py-3"
                  placeholder="Enter item name"
                />
              </div>

              <div>
                <label className="block font-medium mb-2">Measured Value</label>
                <input
                  className="w-full border border-gray-300 rounded-[12px] px-4 py-3"
                  placeholder="Enter value"
                />
              </div>

              <div>
                <label className="block font-medium mb-2">Notes</label>
                <textarea
                  className="w-full border border-gray-300 rounded-[12px] px-4 py-3 min-h-[120px]"
                  placeholder="Enter notes"
                />
              </div>

              <button className="bg-purple-600 text-white px-6 py-3 rounded-[14px] hover:bg-purple-700">
                Save Measurement
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}