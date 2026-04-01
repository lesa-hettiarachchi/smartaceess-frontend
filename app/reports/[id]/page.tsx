import { notFound } from "next/navigation";
import { Check, TriangleAlert, X } from "lucide-react";
import { reports } from "../../../data/reports";

export default async function ReportDetailsPage({
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
      <h2 className="text-[24px] font-bold mb-8">{report.name}</h2>

      <div className="bg-[#e9eef7] rounded-[24px] p-8 space-y-6">
        {report.items.length === 0 ? (
          <div className="bg-white rounded-[18px] p-8 text-gray-500 text-center">
            No detailed items available for this report yet.
          </div>
        ) : (
          report.items.map((item, index) => {
            const cardColor =
              item.type === "green"
                ? "bg-[#d9efc2]"
                : item.type === "yellow"
                ? "bg-[#f3e59d]"
                : "bg-[#ef8d8d]";

            return (
              <div
                key={index}
                className={`${cardColor} rounded-[18px] px-6 py-5 flex items-center justify-between gap-6`}
              >
                <div className="min-w-[280px]">
                  <h3 className="text-[20px] font-medium">{item.title}</h3>
                  <p className="text-[16px] mt-2">{item.clause}</p>
                </div>

                <div className="flex-1 text-[16px] leading-5 text-left max-w-[260px]">
                  {item.statusText}
                </div>

                <div className="min-w-[120px] flex flex-col items-center justify-center">
                  {item.type === "green" && <Check size={28} />}
                  {item.type === "yellow" && <TriangleAlert size={24} />}
                  {item.type === "red" && <X size={28} />}
                  <p className="mt-1 text-[14px] font-medium">{item.result}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}