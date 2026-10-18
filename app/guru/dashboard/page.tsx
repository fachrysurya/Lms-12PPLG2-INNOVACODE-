"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import Icon from "../../components/Icon";

type TipeAktivitas = "Materi" | "Tugas" | "Asesmen";

type Aktivitas = {
  id: string;
  tipe: TipeAktivitas;
  judul: string;
  mataPelajaran: string;
  kelas: string;
  aktif: boolean;
  waktu?: string;
  href: string;
};

type DashboardGuruData = {
  success: boolean;
  message?: string;
  nama: string;
  ringkasan: {
    totalMateri: number;
    totalTugas: number;
    totalAsesmen: number;
    totalSoal: number;
    mataPelajaran: number;
    tugasBerjalan: number;
    totalPengumpulan: number;
    totalHasilAsesmen: number;
  };
  aktivitas: Aktivitas[];
};

type FilterAktivitas = "Semua" | TipeAktivitas;

function tanggal(value?: string): string {
  if (!value) return "Tanggal tidak tersedia";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Tanggal tidak tersedia"
    : new Intl.DateTimeFormat("id-ID", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(date);
}

export default function GuruDashboard() {
  const [data, setData] = useState<DashboardGuruData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<FilterAktivitas>("Semua");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/guru/dashboard", {
      cache: "no-store",
      signal: controller.signal,
    })
      .then(async (response) => {
        const result = (await response.json()) as DashboardGuruData;
        if (!response.ok || !result.success) {
          throw new Error(result.message || "Gagal memuat dashboard guru.");
        }
        if (!controller.signal.aborted) {
          setData(result);
          setError("");
        }
      })
      .catch((fetchError: unknown) => {
        if (controller.signal.aborted) return;
        console.error("GET DASHBOARD GURU ERROR:", fetchError);
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "Gagal memuat dashboard guru."
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [reloadKey]);

  const statistik = data?.ringkasan;
  const kartu = [
    {
      label: "Total Materi",
      nilai: statistik?.totalMateri,
      icon: "book" as const,
      href: "/guru/materi",
      detail: "Materi yang Anda buat",
    },
    {
      label: "Total Tugas",
      nilai: statistik?.totalTugas,
      icon: "edit" as const,
      href: "/guru/tugas",
      detail: "Tugas untuk siswa",
    },
    {
      label: "Total Asesmen",
      nilai: statistik?.totalAsesmen,
      icon: "kelas" as const,
      href: "/guru/asesmen",
      detail: "Asesmen yang dibuat",
    },
    {
      label: "Total Soal",
      nilai: statistik?.totalSoal,
      icon: "users" as const,
      href: "/guru/asesmen",
      detail: "Soal dalam asesmen",
    },
  ];

  const aktivitas = useMemo(() => {
    if (!data) return [];
    return filter === "Semua"
      ? data.aktivitas
      : data.aktivitas.filter((item) => item.tipe === filter);
  }, [data, filter]);

  return (
    <div className="guru-dashboard">
      <section className="guru-dashboard-welcome">
        <div>
          <p className="guru-dashboard-eyebrow">RINGKASAN PEMBELAJARAN</p>
          <h1>Selamat Datang, {data?.nama || "Guru"}</h1>
          <p>Kelola materi, tugas, asesmen, dan pantau aktivitas siswa.</p>
        </div>
        <button
          type="button"
          className="guru-dashboard-refresh"
          disabled={loading}
          onClick={() => {
            setLoading(true);
            setReloadKey((current) => current + 1);
          }}
        >
          {loading ? "Memuat..." : "Muat ulang"}
        </button>
      </section>

      {error && (
        <div className="guru-dashboard-alert" role="alert">
          <span>{error}</span>
          <button
            type="button"
            onClick={() => {
              setLoading(true);
              setReloadKey((current) => current + 1);
            }}
          >
            Coba lagi
          </button>
        </div>
      )}

      <section className="dashboard-cards guru-dashboard-cards">
        {kartu.map((item) => (
          <Link
            href={item.href}
            className="dashboard-card guru-stat-card"
            key={item.label}
          >
            <div className="dashboard-card-icon">
              <Icon name={item.icon} />
            </div>
            <div className="dashboard-card-body">
              <span>{item.label}</span>
              <strong>{loading ? "—" : item.nilai ?? 0}</strong>
              <small>{item.detail}</small>
            </div>
            <span className="guru-dashboard-arrow" aria-hidden="true">
              →
            </span>
          </Link>
        ))}
      </section>

      <section className="guru-dashboard-summary">
        <Link href="/guru/nilai">
          <span>Jawaban tugas terkumpul</span>
          <strong>{loading ? "—" : statistik?.totalPengumpulan ?? 0}</strong>
        </Link>
        <Link href="/guru/nilai">
          <span>Hasil asesmen masuk</span>
          <strong>{loading ? "—" : statistik?.totalHasilAsesmen ?? 0}</strong>
        </Link>
        <Link href="/guru/tugas">
          <span>Tugas berjalan</span>
          <strong>{loading ? "—" : statistik?.tugasBerjalan ?? 0}</strong>
        </Link>
        <div>
          <span>Mata pelajaran</span>
          <strong>{loading ? "—" : statistik?.mataPelajaran ?? 0}</strong>
        </div>
      </section>

      <section className="guru-dashboard-grid">
        <div className="guru-panel guru-dashboard-activity-panel">
          <div className="guru-panel-head guru-dashboard-panel-head">
            <div>
              <h2>Aktivitas Terbaru</h2>
              <p>Materi, tugas, dan asesmen yang Anda buat.</p>
            </div>
            <span>{aktivitas.length} aktivitas</span>
          </div>

          <div className="guru-dashboard-filters" aria-label="Filter aktivitas">
            {(["Semua", "Materi", "Tugas", "Asesmen"] as const).map(
              (tipe) => (
                <button
                  type="button"
                  key={tipe}
                  className={filter === tipe ? "active" : ""}
                  aria-pressed={filter === tipe}
                  onClick={() => setFilter(tipe)}
                >
                  {tipe}
                </button>
              )
            )}
          </div>

          {loading ? (
            <p className="guru-panel-empty" role="status">
              Memuat data...
            </p>
          ) : aktivitas.length === 0 ? (
            <p className="guru-panel-empty">
              {data?.aktivitas.length
                ? "Tidak ada aktivitas untuk filter ini."
                : "Belum ada aktivitas. Mulai dengan membuat materi atau tugas."}
            </p>
          ) : (
            <ul className="guru-aktivitas guru-dashboard-activity-list">
              {aktivitas.map((item) => (
                <li key={item.id}>
                  <span
                    className={`guru-tag guru-tag-${item.tipe.toLowerCase()}`}
                  >
                    {item.tipe}
                  </span>
                  <div className="guru-dashboard-activity-info">
                    <strong>{item.judul}</strong>
                    <small>
                      {item.mataPelajaran} · {item.kelas} ·{" "}
                      {tanggal(item.waktu)}
                    </small>
                  </div>
                  <span
                    className={`guru-dashboard-active-badge ${
                      item.aktif ? "is-active" : "is-inactive"
                    }`}
                  >
                    {item.aktif ? "Aktif" : "Nonaktif"}
                  </span>
                  <Link
                    className="guru-dashboard-open"
                    href={item.href}
                    aria-label={`Kelola ${item.tipe}: ${item.judul}`}
                  >
                    Buka
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="guru-panel">
          <div className="guru-panel-head">
            <div>
              <h2>Ringkasan</h2>
              <p>Ikhtisar kegiatan mengajar Anda.</p>
            </div>
          </div>

          <div className="guru-ringkasan">
            <div>
              <span>Mata Pelajaran Diampu</span>
              <strong>{loading ? "—" : statistik?.mataPelajaran ?? 0}</strong>
            </div>
            <div>
              <span>Tugas Berjalan</span>
              <strong>{loading ? "—" : statistik?.tugasBerjalan ?? 0}</strong>
            </div>
            <div>
              <span>Total Soal Asesmen</span>
              <strong>{loading ? "—" : statistik?.totalSoal ?? 0}</strong>
            </div>
          </div>

          <div className="guru-panel-aksi">
            <Link href="/guru/materi" className="quick-link">
              <Icon name="book" />
              <div>
                <strong>Tambah Materi</strong>
                <small>PDF, YouTube, atau teks</small>
              </div>
            </Link>
            <Link href="/guru/tugas" className="quick-link">
              <Icon name="edit" />
              <div>
                <strong>Buat Tugas</strong>
                <small>Kelola tugas siswa</small>
              </div>
            </Link>
            <Link href="/guru/asesmen" className="quick-link">
              <Icon name="kelas" />
              <div>
                <strong>Buat Asesmen</strong>
                <small>Esai &amp; pilihan ganda</small>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}