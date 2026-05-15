const API_URL = "/api/proxy";

// This file defines TypeScript types and API functions for interacting with the backend service.
export type ReportSummary = {
  id: string;
  report_name: string;
  location_type: string;
  audit_date: string;
  detected_count: number;
  needs_measure_count: number;
  manual_count: number;
};

export type ReportItem = {
  class: string;
  dsapt_part: string;
  sections: string[];
  description: string;
  status: string;
  confidence?: number;
  inspection_items?: string[];
};

export type ReportDetail = {
  id: string;
  report_name: string;
  location_type: string;
  audit_date: string;
  summary: {
    detected_count: number;
    missing_count: number;
    needs_inspection_count: number;
    compliance_score: number;
    risk_level: string;
  };
  detected: ReportItem[];
  missing: ReportItem[];
  needs_inspection: ReportItem[];
  violations: { rule: string; dsapt_clause: string; description: string; severity: string }[];
  annotated_image_base64?: string;
};

export type MeasureData = {
  report_id: string;
  report_name: string;
  items: {
    item_name: string;
    description: string;
    inspection_items: string[];
    measurement: { measured_value: string; notes: string; created_at: string } | null;
  }[];
};

export async function submitAudit(
  file: File,
  locationType: string,
  reportName: string,
): Promise<ReportDetail & { id: string }> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("location_type", locationType);
  formData.append("report_name", reportName);

  const res = await fetch(`${API_URL}/audit`, { method: "POST", body: formData });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Audit failed" }));
    throw new Error(err.detail || "Audit failed");
  }
  return res.json();
}

export async function getReports(): Promise<ReportSummary[]> {
  const res = await fetch(`${API_URL}/reports`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch reports");
  return res.json();
}

export async function getReport(id: string): Promise<ReportDetail> {
  const res = await fetch(`${API_URL}/reports/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Report not found");
  return res.json();
}

export async function getMeasure(id: string): Promise<MeasureData> {
  const res = await fetch(`${API_URL}/measure/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch measure data");
  return res.json();
}

export async function saveMeasurement(
  reportId: string,
  itemName: string,
  measuredValue: string,
  notes: string,
) {
  const res = await fetch(`${API_URL}/measure/${reportId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ item_name: itemName, measured_value: measuredValue, notes }),
  });
  if (!res.ok) throw new Error("Failed to save measurement");
  return res.json();
}
