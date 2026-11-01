"use client";

import { useEffect, useMemo, useState } from "react";
import { buatPDF } from "../../../lib/pdf";
import { buatExcel } from "../../../lib/excel";

export type DataRow = Record<string, unknown>;
export type DataColumn = { key: string; label: string };

type Props = {
  title: string;
  description: string;
  endpoint?: string;
  responseKey?: string;
  columns: DataColumn[];
  staticRows?: DataRow[];
  rowFormatter?: "siswa" | "kelas" | "jadwal";
  searchableKeys?: string[];
};

function text(value: unknown) {
  if (value === null || value === undefined || value === "") return "-";
  if (typeof value === "boolean") return value ? "Aktif" : "Tidak Aktif";
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export default function ReadOnlyData({ title, description, endpoint, responseKey, columns, staticRows = [], rowFormatter, searchableKeys = [] }: Props) {
  const [rows, setRows] = useState<DataRow[]>(staticRows);
  const [loading, setLoading] = useState(Boolean(endpoint));
  const [search, setSearch] = useState("");
  const [preview, setPreview] = useState<DataRow | null>(null);

  useEffect(() => {
    if (!endpoint) return;
    fetch(endpoint, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        const source = responseKey ? data[responseKey] : data;
        setRows(Array.isArray(source) ? source.map((row) => {
          if (rowFormatter === "siswa") {
            const kelas = String(row.kelas || "").toUpperCase();
            return { ...row, nisn: row.nis, jurusan: kelas.includes("RPL") ? "Rekayasa Perangkat Lunak" : String(row.jurusan || "-") };
          }
          if (rowFormatter === "kelas") return { ...row, jumlahSiswa: row.jumlahSiswa ?? "-" };
          if (rowFormatter === "jadwal") return { ...row, jam: `${String(row.jamMulai || "-")} - ${String(row.jamSelesai || "-")}` };
          return row;
        }) : []);
      })
      .catch(() => setRows([]))
      .finally(() => setLoading(false));
  }, [endpoint, responseKey, rowFormatter]);

  const filteredRows = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return rows;
    const keys = searchableKeys.length ? searchableKeys : columns.map((column) => column.key);
    return rows.filter((row) => keys.some((key) => text(row[key]).toLowerCase().includes(keyword)));
  }, [rows, search, columns, searchableKeys]);

  function downloadPdf() {
    saveBlob(buatPDF(title, columns, rows), `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.pdf`);
  }

  function downloadExcel() {
    saveBlob(buatExcel(title, columns, rows), `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.xls`);
  }

  return (
    <div className="management-page">
      <div className="management-header">
        <div><h2>{title}</h2><p>{description}</p></div>
        <div className="kurikulum-download-actions">
          <button type="button" className="view-button" onClick={downloadExcel}>Download Excel</button>
          <button type="button" className="download-button" onClick={downloadPdf}>Download PDF</button>
        </div>
      </div>

      <div className="dashboard-panel">
        <input className="kurikulum-search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder={`Cari ${title.toLowerCase()}...`} />
        <div className="dashboard-table">
          <table><thead><tr><th>No</th>{columns.map((column) => <th key={column.key}>{column.label}</th>)}<th>Aksi</th></tr></thead>
            <tbody>{loading ? <tr><td colSpan={columns.length + 2}>Memuat data...</td></tr> : filteredRows.length === 0 ? <tr><td colSpan={columns.length + 2}>Data tidak tersedia.</td></tr> : filteredRows.map((row, index) => <tr key={index}>
              <td>{index + 1}</td>{columns.map((column) => <td key={column.key}>{text(row[column.key])}</td>)}<td><button type="button" className="view-button" onClick={() => setPreview(row)}>Preview</button></td>
            </tr>)}</tbody>
          </table>
        </div>
      </div>

      {preview && <div className="kurikulum-preview-overlay" onMouseDown={() => setPreview(null)}>
        <div className="kurikulum-preview-modal" onMouseDown={(event) => event.stopPropagation()}>
          <div className="kurikulum-preview-header"><h3>Preview {title}</h3><button type="button" aria-label="Tutup" onClick={() => setPreview(null)}>×</button></div>
          <dl>{columns.map((column) => <div key={column.key}><dt>{column.label}</dt><dd>{text(preview[column.key])}</dd></div>)}</dl>
          <div className="kurikulum-preview-actions"><button type="button" className="view-button" onClick={() => setPreview(null)}>Tutup</button></div>
        </div>
      </div>}
    </div>
  );
}
