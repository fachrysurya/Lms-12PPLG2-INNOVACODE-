"use client";

import { useEffect, useState } from "react";

type Laporan = {
  _id: string;
  judul: string;
  jenis: string;
  periode: string;
  deskripsi: string;
  dibuatOleh: string;
  aktif: boolean;
  createdAt?: string;
};

export default function IncomingReports() {
  const [laporan, setLaporan] = useState<Laporan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<Laporan | null>(null);

  useEffect(() => {
    fetch("/api/admin/laporan", { cache: "no-store" })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok || !data.success) throw new Error(data.message || "Gagal memuat laporan.");
        setLaporan((data.laporan as Laporan[]).filter((item) => item.aktif));
      })
      .catch((fetchError: unknown) => setError(fetchError instanceof Error ? fetchError.message : "Gagal memuat laporan."))
      .finally(() => setLoading(false));
  }, []);

  function download(item: Laporan) {
    const isi = [
      "========================================",
      "EDU CLASS",
      "========================================",
      "",
      item.judul.toUpperCase(),
      "",
      `Jenis Laporan : ${item.jenis}`,
      `Periode       : ${item.periode}`,
      `Dikirim Oleh  : ${item.dibuatOleh}`,
      `Tanggal       : ${item.createdAt ? new Date(item.createdAt).toLocaleDateString("id-ID") : "-"}`,
      "",
      "----------------------------------------",
      "ISI LAPORAN",
      "----------------------------------------",
      "",
      item.deskripsi || "-",
      "",
      "========================================",
      "Dokumen laporan dari Administrator.",
      "========================================",
    ].join("\n");

    const blob = new Blob([isi], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${item.judul.replaceAll(/[^a-z0-9]+/gi, "-").replaceAll(/^-|-$/g, "").toLowerCase() || "laporan"}.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="management-page incoming-report-page">
      <div className="management-header">
        <div>
          <h2>Laporan Masuk</h2>
          <p>Lihat pembaruan dan pemberitahuan yang dikirim Administrator.</p>
        </div>
      </div>

      {loading ? (
        <div className="management-card">Memuat laporan...</div>
      ) : error ? (
        <div className="management-message">{error}</div>
      ) : laporan.length === 0 ? (
        <div className="management-card">
          <div className="empty-table">Belum ada laporan yang diterima.</div>
        </div>
      ) : (
        <div className="incoming-report-grid">
          {laporan.map((item) => (
            <article className="incoming-report-card" key={item._id}>
              <div className="incoming-report-card-header">
                <span className="incoming-report-icon">▤</span>
                <span className="incoming-report-type">{item.jenis}</span>
              </div>
              <h3>{item.judul}</h3>
              <p>{item.deskripsi || "Tidak ada detail tambahan."}</p>
              <div className="incoming-report-meta">
                <span>{item.periode}</span>
                <span>{item.createdAt ? new Date(item.createdAt).toLocaleDateString("id-ID") : "-"}</span>
              </div>
              <div className="incoming-report-actions">
                <button type="button" className="report-preview-button" onClick={() => setPreview(item)}>Lihat Informasi</button>
                <button type="button" className="report-download-button" onClick={() => download(item)}>Download</button>
              </div>
            </article>
          ))}
        </div>
      )}

      {preview && (
        <div className="report-modal-overlay" onClick={() => setPreview(null)}>
          <div className="report-modal" onClick={(event) => event.stopPropagation()}>
            <div className="report-modal-header">
              <div><span>INFO LAPORAN</span><h2>{preview.judul}</h2></div>
              <button type="button" className="report-close-button" onClick={() => setPreview(null)}>×</button>
            </div>
            <div className="report-document">
              <div className="report-document-title">
                <h1>EDU CLASS</h1>
                <h2>{preview.judul}</h2>
                <p>{preview.periode}</p>
              </div>
              <div className="report-document-line" />
              <div className="report-document-section">
                <h3>Informasi Pemberitahuan</h3>
                <p>Jenis: {preview.jenis}</p>
                <p>Dikirim oleh: {preview.dibuatOleh}</p>
              </div>
              <div className="report-document-section">
                <h3>Isi Laporan</h3>
                <p>{preview.deskripsi || "-"}</p>
              </div>
            </div>
            <div className="report-modal-footer">
              <button type="button" className="report-cancel-button" onClick={() => setPreview(null)}>Tutup</button>
              <button type="button" className="report-download-button" onClick={() => download(preview)}>Download Laporan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
