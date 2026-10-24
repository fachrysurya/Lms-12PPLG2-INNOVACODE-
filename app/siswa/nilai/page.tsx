"use client";

import { useEffect, useState } from "react";

type NilaiTugas = {
  tugasId: string;
  judulTugas: string;
  mataPelajaran: string;
  nilai: number;
  umpanBalik: string;
  dinilaiPada?: string;
};

type NilaiResponse = {
  success: boolean;
  message?: string;
  nilai?: NilaiTugas[];
};

function formatTanggal(value?: string): string {
  if (!value) return "-";

  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "-"
    : new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(date);
}

export default function NilaiSiswaPage() {
  const [nilai, setNilai] = useState<NilaiTugas[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/siswa/nilai", {
      cache: "no-store",
      signal: controller.signal,
    })
      .then(async (response) => {
        const data: NilaiResponse = await response.json();
        if (!response.ok || !data.success) {
          throw new Error(data.message || "Gagal mengambil data nilai tugas.");
        }
        if (!controller.signal.aborted) {
          setNilai(Array.isArray(data.nilai) ? data.nilai : []);
          setError("");
        }
      })
      .catch((fetchError: unknown) => {
        if (controller.signal.aborted) return;
        console.error("GET NILAI SISWA ERROR:", fetchError);
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "Gagal mengambil data nilai tugas."
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [reloadKey]);

  return (
    <div className="management-page">
      <div className="management-header">
        <div>
          <h2>Nilai</h2>
          <p>Tugas yang sudah dinilai oleh guru.</p>
        </div>
        <button
          type="button"
          className="add-button"
          onClick={() => {
            setLoading(true);
            setReloadKey((current) => current + 1);
          }}
          disabled={loading}
        >
          {loading ? "Memuat..." : "Muat ulang"}
        </button>
      </div>

      {error && (
        <div className="management-message" role="alert">
          <span>{error}</span>
        </div>
      )}

      <div className="dashboard-panel">
        <div className="dashboard-table">
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Mata Pelajaran</th>
                <th>Tugas</th>
                <th>Nilai</th>
                <th>Umpan Balik</th>
                <th>Tanggal Dinilai</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6}>Memuat nilai tugas...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6}>Nilai tugas gagal dimuat.</td>
                </tr>
              ) : nilai.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    Belum ada nilai tugas yang diberikan oleh guru.
                  </td>
                </tr>
              ) : (
                nilai.map((item, index) => (
                  <tr key={`${item.tugasId}-${index}`}>
                    <td>{index + 1}</td>
                    <td>{item.mataPelajaran || "-"}</td>
                    <td>{item.judulTugas}</td>
                    <td>{item.nilai}</td>
                    <td>{item.umpanBalik || "-"}</td>
                    <td>{formatTanggal(item.dinilaiPada)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}