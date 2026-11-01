"use client";

import { useEffect, useMemo, useState } from "react";
import { buatExcel } from "../../../lib/excel";
import { buatPDF } from "../../../lib/pdf";

type Nilai = {
  _id: string;
  siswaId?: string;
  namaSiswa: string;
  nis: string;
  kelas: string;
  mataPelajaran: string;
  semester: number;
  nilaiTugas: number;
  nilaiAsesmen: number;
  nilaiAkhir: number;
  semesterSelesai: boolean;
  guru: string;
  catatan: string;
};

type Rekap = Record<string, string | number>;
type Tampilan = "siswa" | "kelas" | "mapel";

const kolomSiswa = [
  { key: "namaSiswa", label: "Nama Siswa" },
  { key: "nis", label: "NIS" },
  { key: "kelas", label: "Kelas" },
  { key: "mataPelajaran", label: "Mata Pelajaran" },
  { key: "semester", label: "Semester" },
  { key: "nilaiTugas", label: "Nilai Tugas" },
  { key: "nilaiAsesmen", label: "Nilai Asesmen" },
  { key: "nilaiAkhir", label: "Nilai Akhir" },
  { key: "guru", label: "Guru" },
];

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

function rataRata(rows: Nilai[]) {
  if (!rows.length) return 0;
  return Math.round((rows.reduce((total, row) => total + Number(row.nilaiAkhir || 0), 0) / rows.length) * 100) / 100;
}

export default function LaporanAkademikKurikulumPage() {
  const [nilai, setNilai] = useState<Nilai[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tampilan, setTampilan] = useState<Tampilan>("siswa");
  const [preview, setPreview] = useState<Nilai | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/kurikulum/nilai", { cache: "no-store" })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok || !data.success) throw new Error(data.message || "Gagal mengambil laporan nilai.");
        setNilai(Array.isArray(data.nilai) ? data.nilai : []);
      })
      .catch((fetchError: unknown) => {
        setError(fetchError instanceof Error ? fetchError.message : "Gagal mengambil laporan nilai.");
      })
      .finally(() => setLoading(false));
  }, []);

  const rowsSiswa = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return nilai;
    return nilai.filter((row) =>
      [row.namaSiswa, row.nis, row.kelas, row.mataPelajaran, row.guru]
        .some((value) => String(value || "").toLowerCase().includes(keyword))
    );
  }, [nilai, search]);

  const rowsRekap = useMemo(() => {
    const key = tampilan === "kelas" ? "kelas" : "mataPelajaran";
      const grouped = new Map<string, Nilai[]>();

    rowsSiswa.forEach((row) => {
      const nama = String(row[key] || "-");
      grouped.set(nama, [...(grouped.get(nama) || []), row]);
    });

    return Array.from(grouped.entries())
      .map(([nama, rows], index) => ({
        no: index + 1,
        [key]: nama,
        jumlahSiswa: new Set(rows.map((row) => row.siswaId || row.nis || row.namaSiswa)).size,
        jumlahNilai: rows.length,
        nilaiTertinggi: Math.max(...rows.map((row) => Number(row.nilaiAkhir || 0))),
        nilaiTerendah: Math.min(...rows.map((row) => Number(row.nilaiAkhir || 0))),
        nilaiRataRata: rataRata(rows),
      })) as Rekap[];
  }, [rowsSiswa, tampilan]);

  const kolomAktif = tampilan === "siswa"
    ? kolomSiswa
    : [
        { key: tampilan === "kelas" ? "kelas" : "mataPelajaran", label: tampilan === "kelas" ? "Kelas" : "Mata Pelajaran" },
        { key: "jumlahSiswa", label: "Jumlah Siswa" },
        { key: "jumlahNilai", label: "Jumlah Nilai" },
        { key: "nilaiTertinggi", label: "Nilai Tertinggi" },
        { key: "nilaiTerendah", label: "Nilai Terendah" },
        { key: "nilaiRataRata", label: "Rata-rata" },
      ];

  const rowsAktif = tampilan === "siswa" ? rowsSiswa : rowsRekap;

  function download(format: "pdf" | "excel") {
    const judul = `Laporan Akademik - ${tampilan === "siswa" ? "Nilai Siswa" : tampilan === "kelas" ? "Rekap Per Kelas" : "Rekap Per Mata Pelajaran"}`;
    const blob = format === "pdf" ? buatPDF(judul, kolomAktif, rowsAktif) : buatExcel(judul, kolomAktif, rowsAktif);
    saveBlob(blob, `laporan-akademik-${tampilan}.${format === "pdf" ? "pdf" : "xls"}`);
  }

  return (
    <div className="management-page">
      <div className="management-header">
        <div>
          <h2>Laporan Akademik</h2>
          <p>Preview nilai siswa dan rekap nilai berdasarkan kelas maupun mata pelajaran.</p>
        </div>
        <div className="kurikulum-download-actions">
          <button type="button" className="view-button" onClick={() => download("excel")}>Download Excel</button>
          <button type="button" className="download-button" onClick={() => download("pdf")}>Download PDF</button>
        </div>
      </div>

      <div className="dashboard-panel">
        <div className="kurikulum-download-actions">
          <button type="button" className={tampilan === "siswa" ? "add-button" : "view-button"} onClick={() => setTampilan("siswa")}>Nilai Siswa</button>
          <button type="button" className={tampilan === "kelas" ? "add-button" : "view-button"} onClick={() => setTampilan("kelas")}>Rekap Per Kelas</button>
          <button type="button" className={tampilan === "mapel" ? "add-button" : "view-button"} onClick={() => setTampilan("mapel")}>Rekap Per Mata Pelajaran</button>
        </div>

        {tampilan === "siswa" && (
          <input className="kurikulum-search akademik-search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cari nama siswa, kelas, mata pelajaran..." />
        )}

        <div className="dashboard-table">
          <table>
            <thead><tr><th>No</th>{kolomAktif.map((kolom) => <th key={kolom.key}>{kolom.label}</th>)}{tampilan === "siswa" && <th>Aksi</th>}</tr></thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={kolomAktif.length + 1}>Memuat laporan akademik...</td></tr>
              ) : error ? (
                <tr><td colSpan={kolomAktif.length + 1}>{error}</td></tr>
              ) : rowsAktif.length === 0 ? (
                <tr><td colSpan={kolomAktif.length + 1}>Data nilai belum tersedia.</td></tr>
              ) : rowsAktif.map((row, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  {kolomAktif.map((kolom) => <td key={kolom.key}>{String((row as Record<string, string | number>)[kolom.key] ?? "-")}</td>)}
                  {tampilan === "siswa" && <td><button type="button" className="view-button" onClick={() => setPreview(row as Nilai)}>Preview</button></td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {preview && (
        <div className="kurikulum-preview-overlay" onMouseDown={() => setPreview(null)}>
          <div className="kurikulum-preview-modal" onMouseDown={(event) => event.stopPropagation()}>
            <div className="kurikulum-preview-header"><h3>Preview Nilai Siswa</h3><button type="button" aria-label="Tutup" onClick={() => setPreview(null)}>×</button></div>
            <dl>{kolomSiswa.map((kolom) => <div key={kolom.key}><dt>{kolom.label}</dt><dd>{String(preview[kolom.key as keyof Nilai] ?? "-")}</dd></div>)}</dl>
            <div className="kurikulum-preview-actions"><button type="button" className="view-button" onClick={() => setPreview(null)}>Tutup</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
