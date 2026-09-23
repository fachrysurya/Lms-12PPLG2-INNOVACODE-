"use client";

import Link from "next/link";
import { useState } from "react";

type Report = {
  id: number;
  title: string;
  description: string;
  period: string;
  type: string;
};

const reports: Report[] = [
  {
    id: 1,
    title: "Laporan Akademik",
    description: "Rekapitulasi kegiatan dan kondisi akademik sekolah.",
    period: "Tahun Ajaran 2025/2026",
    type: "Akademik",
  },
  {
    id: 2,
    title: "Laporan Data Siswa",
    description: "Rekapitulasi data keseluruhan siswa sekolah.",
    period: "Tahun Ajaran 2025/2026",
    type: "Data Siswa",
  },
  {
    id: 3,
    title: "Laporan Data Guru",
    description: "Rekapitulasi data keseluruhan guru sekolah.",
    period: "Tahun Ajaran 2025/2026",
    type: "Data Guru",
  },
];

export default function LaporanKepalaSekolah() {
  const [previewReport, setPreviewReport] = useState<Report | null>(null);

  const handleDownload = (report: Report) => {
    const content = `
EDU CLASS
${report.title.toUpperCase()}

Periode: ${report.period}

${report.description}

----------------------------------------

Total Guru       : 24
Total Siswa      : 320
Total Kelas      : 12
Mata Pelajaran   : 18

----------------------------------------

Laporan dibuat melalui sistem Edu Class.
`;

    const blob = new Blob([content], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${report.type
      .replaceAll(" ", "-")
      .toLowerCase()}-2025-2026.txt`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          Edu<span>Class</span>
        </div>

        <div className="sidebar-role">KEPALA SEKOLAH</div>

        <nav className="sidebar-menu">
          <Link href="/kepala-sekolah/dashboard">
            <span>▣</span>
            Dashboard
          </Link>

          <Link href="/kepala-sekolah/monitoring">
            <span>◉</span>
            Monitoring
          </Link>

          <Link href="/kepala-sekolah/laporan" className="active">
            <span>▤</span>
            Laporan
          </Link>

          <Link href="/kepala-sekolah/profile">
            <span>◯</span>
            Profile
          </Link>
        </nav>

        <button
          className="logout-button"
          onClick={() => {
            localStorage.removeItem("user");
            window.location.href = "/login";
          }}
        >
          <span>↪</span>
          Logout
        </button>
      </aside>

      <main className="dashboard-content">
        <header className="dashboard-header">
          <div>
            <p className="dashboard-header-label">
              KEPALA SEKOLAH
            </p>

            <h1>Laporan</h1>

            <p>
              Lihat dan download laporan sekolah.
            </p>
          </div>

          <div className="profile-mini">
            <div className="profile-avatar">KS</div>

            <div>
              <strong>Kepala Sekolah</strong>
              <span>Administrator Sekolah</span>
            </div>
          </div>
        </header>

        <section className="dashboard-main">
          <div className="report-header">
            <div>
              <h2>Daftar Laporan</h2>

              <p>
                Pilih laporan untuk melihat preview atau
                mendownload laporan.
              </p>
            </div>
          </div>

          <div className="report-grid">
            {reports.map((report) => (
              <div className="report-card" key={report.id}>
                <div className="report-icon">▤</div>

                <div className="report-card-content">
                  <h3>{report.title}</h3>

                  <p>{report.description}</p>

                  <span className="report-period">
                    {report.period}
                  </span>
                </div>

                <div className="report-actions">
                  <button
                    type="button"
                    className="report-preview-button"
                    onClick={() => setPreviewReport(report)}
                  >
                    Preview
                  </button>

                  <button
                    type="button"
                    className="report-download-button"
                    onClick={() => handleDownload(report)}
                  >
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {previewReport && (
        <div
          className="report-modal-overlay"
          onClick={() => setPreviewReport(null)}
        >
          <div
            className="report-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="report-modal-header">
              <div>
                <span>LAPORAN SEKOLAH</span>

                <h2>{previewReport.title}</h2>
              </div>

              <button
                type="button"
                className="report-close-button"
                onClick={() => setPreviewReport(null)}
              >
                ×
              </button>
            </div>

            <div className="report-document">
              <div className="report-document-title">
                <h1>EDU CLASS</h1>

                <h2>{previewReport.title}</h2>

                <p>{previewReport.period}</p>
              </div>

              <div className="report-document-line"></div>

              <div className="report-document-section">
                <h3>Ringkasan Laporan</h3>

                <p>{previewReport.description}</p>
              </div>

              <div className="report-summary">
                <div>
                  <span>Total Guru</span>
                  <strong>24</strong>
                </div>

                <div>
                  <span>Total Siswa</span>
                  <strong>320</strong>
                </div>

                <div>
                  <span>Total Kelas</span>
                  <strong>12</strong>
                </div>

                <div>
                  <span>Mata Pelajaran</span>
                  <strong>18</strong>
                </div>
              </div>

              <div className="report-document-section">
                <h3>Keterangan</h3>

                <p>
                  Laporan ini merupakan ringkasan data sekolah
                  yang dapat digunakan oleh Kepala Sekolah
                  untuk melakukan monitoring dan evaluasi.
                </p>
              </div>
            </div>

            <div className="report-modal-footer">
              <button
                type="button"
                className="report-cancel-button"
                onClick={() => setPreviewReport(null)}
              >
                Tutup
              </button>

              <button
                type="button"
                className="report-download-button"
                onClick={() => handleDownload(previewReport)}
              >
                Download Laporan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}