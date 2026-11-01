"use client";

import { useEffect, useState } from "react";

type Ringkasan = {
  totalGuru: number;
  totalSiswa: number;
  totalKelas: number;
  totalMapel: number;
};

const initialRingkasan: Ringkasan = {
  totalGuru: 0,
  totalSiswa: 0,
  totalKelas: 0,
  totalMapel: 0,
};

export default function KepalaSekolahDashboard() {
  const [ringkasan, setRingkasan] = useState(initialRingkasan);
  const [preview, setPreview] = useState<"guru" | "siswa" | "kelas" | "mapel" | "ringkasan" | null>(null);

  useEffect(() => {
    fetch("/api/admin/ringkasan", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => {
        if (data.success && data.ringkasan) {
          setRingkasan({
            totalGuru: data.ringkasan.totalGuru ?? 0,
            totalSiswa: data.ringkasan.totalSiswa ?? 0,
            totalKelas: data.ringkasan.totalKelas ?? 0,
            totalMapel: data.ringkasan.totalMapel ?? 0,
          });
        }
      })
      .catch(() => setRingkasan(initialRingkasan));
  }, []);

  const previewData: Record<NonNullable<typeof preview>, { label: string; value: string }> = {
    guru: { label: "Jumlah Guru", value: `${ringkasan.totalGuru} guru` },
    siswa: { label: "Jumlah Siswa", value: `${ringkasan.totalSiswa} siswa` },
    kelas: { label: "Jumlah Kelas", value: `${ringkasan.totalKelas} kelas` },
    mapel: { label: "Jumlah Mata Pelajaran", value: `${ringkasan.totalMapel} mata pelajaran` },
    ringkasan: {
      label: "Ringkasan Data Sekolah",
      value: `${ringkasan.totalGuru} guru, ${ringkasan.totalSiswa} siswa, ${ringkasan.totalKelas} kelas, dan ${ringkasan.totalMapel} mata pelajaran`,
    },
  };

  return (
    <div className="kepala-sekolah-dashboard">

      {/* WELCOME */}
      <div className="dashboard-welcome">
        <h1>
          Selamat Datang, Kepala Sekolah
        </h1>

        <p>
          Pantau kondisi dan aktivitas sekolah melalui dashboard.
        </p>
      </div>


      {/* STATISTIK */}
      <div className="dashboard-cards">

        <button type="button" className="dashboard-card" onClick={() => setPreview("guru")}>

          <div className="dashboard-card-icon">
            👨‍🏫
          </div>

          <div>
            <span>Total Guru</span>
            <strong>{ringkasan.totalGuru}</strong>
            <small>Guru aktif</small>
          </div>
        </button>


        <button type="button" className="dashboard-card" onClick={() => setPreview("siswa")}>

          <div className="dashboard-card-icon">
            👨‍🎓
          </div>

          <div>
            <span>Total Siswa</span>
            <strong>{ringkasan.totalSiswa}</strong>
            <small>Siswa aktif</small>
          </div>
        </button>


        <button type="button" className="dashboard-card" onClick={() => setPreview("kelas")}>

          <div className="dashboard-card-icon">
            ▤
          </div>

          <div>
            <span>Total Kelas</span>
            <strong>{ringkasan.totalKelas}</strong>
            <small>Kelas aktif</small>
          </div>
        </button>


        <button type="button" className="dashboard-card" onClick={() => setPreview("mapel")}>

          <div className="dashboard-card-icon">
            📚
          </div>

          <div>
            <span>Total Mata Pelajaran</span>
            <strong>{ringkasan.totalMapel}</strong>
            <small>Mata pelajaran tersedia</small>
          </div>
        </button>

      </div>


      {/* RINGKASAN SEKOLAH */}
      <div className="dashboard-panel">

        <div className="dashboard-panel-header">

          <div>

            <h2>
              Ringkasan Sekolah
            </h2>

            <p>
              Informasi umum kondisi sekolah
            </p>

          </div>


          <button type="button" className="panel-action" onClick={() => setPreview("ringkasan")}>
            Preview Ringkasan
          </button>

        </div>


        <div className="school-summary">

          <div className="summary-item">
            <span>Guru Aktif</span>
            <strong>{ringkasan.totalGuru} Guru</strong>
            <small>Seluruh guru terdaftar</small>
          </div>


          <div className="summary-item">
            <span>Siswa Aktif</span>
            <strong>{ringkasan.totalSiswa} Siswa</strong>
            <small>Seluruh siswa terdaftar</small>
          </div>


          <div className="summary-item">
            <span>Kelas Aktif</span>
            <strong>{ringkasan.totalKelas} Kelas</strong>
            <small>Kelas yang tersedia</small>
          </div>


          <div className="summary-item">
            <span>Mata Pelajaran</span>
            <strong>{ringkasan.totalMapel} Mata Pelajaran</strong>
            <small>Materi pembelajaran</small>
          </div>

        </div>

      </div>


      {preview && (
        <div className="kurikulum-preview-overlay" onMouseDown={() => setPreview(null)}>
          <div className="kurikulum-preview-modal" onMouseDown={(event) => event.stopPropagation()}>
            <div className="kurikulum-preview-header">
              <h3>{previewData[preview].label}</h3>
              <button type="button" aria-label="Tutup" onClick={() => setPreview(null)}>×</button>
            </div>
            <p>{previewData[preview].value}</p>
            <div className="kurikulum-preview-actions">
              <button type="button" className="view-button" onClick={() => setPreview(null)}>Tutup</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}