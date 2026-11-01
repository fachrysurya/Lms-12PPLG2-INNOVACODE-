"use client";

import { useState } from "react";
import { buatPDF } from "../../../lib/pdf";

export type DataColumn = { key: string; label: string };
export type DataRow = Record<string, string | number | boolean | null | undefined>;

function downloadPdf(title: string, columns: DataColumn[], rows: DataRow[]) {
  const blob = buatPDF(title, columns, rows);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${new Date().toISOString().slice(0, 10)}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function DownloadDataButton({ title, columns, rows, label = "Download PDF" }: {
  title: string;
  columns: DataColumn[];
  rows: DataRow[];
  label?: string;
}) {
  return (
    <button type="button" className="add-button" onClick={() => downloadPdf(title, columns, rows)}>
      {label}
    </button>
  );
}

export default function DataActions({ title, columns, row }: {
  title: string;
  columns: DataColumn[];
  row: DataRow;
}) {
  const [preview, setPreview] = useState(false);

  return (
    <>
      <div style={{ display: "flex", gap: "8px" }}>
        <button type="button" className="view-button" onClick={() => setPreview(true)}>Lihat</button>
        <button type="button" className="view-button" onClick={() => downloadPdf(title, columns, [row])}>Download</button>
      </div>

      {preview && (
        <div className="kurikulum-preview-overlay" role="dialog" aria-modal="true">
          <div className="kurikulum-preview-modal">
            <div className="kurikulum-preview-header">
              <h3>Preview {title}</h3>
              <button type="button" aria-label="Tutup" onClick={() => setPreview(false)}>×</button>
            </div>
            <dl>
              {columns.map((column) => (
                <div key={column.key}>
                  <dt>{column.label}</dt>
                  <dd>{row[column.key] === null || row[column.key] === undefined || row[column.key] === "" ? "-" : String(row[column.key])}</dd>
                </div>
              ))}
            </dl>
            <div className="kurikulum-preview-actions">
              <button type="button" className="view-button" onClick={() => setPreview(false)}>Tutup</button>
              <button type="button" className="download-button" onClick={() => downloadPdf(title, columns, [row])}>Download PDF</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
