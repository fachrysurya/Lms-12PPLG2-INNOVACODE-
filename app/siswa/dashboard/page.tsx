"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type DashboardData = {
  success: boolean;
  message?: string;
  nama: string;
  kelas: string;
  ringkasan: {
    totalMateri: number;
    totalTugas: number;
    tugasBelumDikerjakan: number;
    totalAsesmen: number;
    asesmenBelumDikerjakan: number;
    nilaiRataRata: number | null;
  };
  materiTerbaru: {
    _id: string;
    judul: string;
    mataPelajaran: string;
    tipe: string;
    createdAt?: string;
  }[];
  tugasAktif: {
    _id: string;
    judul: string;
    mataPelajaran: string;
    tenggat: string;
    selesai: boolean;
  }[];
  asesmenAktif: {
    _id: string;
    judul: string;
    mataPelajaran: string;
    selesai: boolean;
  }[];
};

type FilterPekerjaan = "semua" | "belum" | "selesai";

function formatTanggal(value?: string): string {
  if (!value) return "Tanpa tenggat";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(date);
}

export default function SiswaDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<FilterPekerjaan>("semua");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/siswa/dashboard", {
      cache: "no-store",
      signal: controller.signal,
    })
      .then(async (response) => {
        const result = (await response.json()) as DashboardData & {
          message?: string;
        };
        if (!response.ok || !result.success) {
          throw new Error(result.message || "Gagal memuat dashboard.");
        }
        if (!controller.signal.aborted) {
          setData(result);
          setError("");
        }
      })
      .catch((fetchError: unknown) => {
        if (controller.signal.aborted) return;
        console.error("GET DASHBOARD SISWA ERROR:", fetchError);
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "Gagal memuat dashboard."
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [reloadKey]);

  const daftarPekerjaan = useMemo(() => {
    if (!data) return [];
    const items = [
      ...data.tugasAktif.map((item) => ({
        ...item,
        jenis: "Tugas" as const,
        href: "/siswa/tugas",
      })),
      ...data.asesmenAktif.map((item) => ({
        ...item,
        jenis: "Asesmen" as const,
        tenggat: "",
        href: "/siswa/asesment",
      })),
    ];
    return filter === "semua"
      ? items
      : items.filter((item) =>
          filter === "selesai" ? item.selesai : !item.selesai
        );
  }, [data, filter]);

  return (
    <div className="siswa-dashboard">
      <section className="siswa-dashboard-welcome">
        <div>
          <p className="siswa-dashboard-eyebrow">RINGKASAN BELAJAR</p>
          <h1>
            {data?.nama ? `Halo, ${data.nama}!` : "Dashboard Siswa"}
          </h1>
          <p>
            Pantau materi, tugas, dan asesmen kamu dalam satu tempat.
          </p>
          {data?.kelas && (
            <span className="siswa-dashboard-class">Kelas {data.kelas}</span>
          )}
        </div>
        <button
          type="button"
          className="siswa-dashboard-refresh"
          onClick={() => {
            setLoading(true);
            setReloadKey((current) => current + 1);
          }}
          disabled={loading}
        >
          {loading ? "Memuat..." : "Muat ulang"}
        </button>
      </section>

      {error && (
        <div className="siswa-dashboard-alert" role="alert">
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

      {data?.message && !error && (
        <div className="siswa-dashboard-alert" role="status">
          {data.message}
        </div>
      )}

      <section className="siswa-dashboard-cards" aria-label="Ringkasan belajar">
        <Link className="siswa-dashboard-card" href="/siswa/materi">
          <span className="siswa-dashboard-card-icon">M</span>
          <span className="siswa-dashboard-card-label">Materi tersedia</span>
          <strong>{loading ? "—" : data?.ringkasan.totalMateri ?? 0}</strong>
          <small>Buka materi pembelajaran →</small>
        </Link>
        <Link className="siswa-dashboard-card" href="/siswa/tugas">
          <span className="siswa-dashboard-card-icon">T</span>
          <span className="siswa-dashboard-card-label">Tugas belum selesai</span>
          <strong>
            {loading ? "—" : data?.ringkasan.tugasBelumDikerjakan ?? 0}
          </strong>
          <small>
            Dari {data?.ringkasan.totalTugas ?? 0} tugas aktif →
          </small>
        </Link>
        <Link className="siswa-dashboard-card" href="/siswa/asesment">
          <span className="siswa-dashboard-card-icon">A</span>
          <span className="siswa-dashboard-card-label">
            Asesmen belum selesai
          </span>
          <strong>
            {loading ? "—" : data?.ringkasan.asesmenBelumDikerjakan ?? 0}
          </strong>
          <small>
            Dari {data?.ringkasan.totalAsesmen ?? 0} asesmen aktif →
          </small>
        </Link>
        <Link className="siswa-dashboard-card" href="/siswa/nilai">
          <span className="siswa-dashboard-card-icon">N</span>
          <span className="siswa-dashboard-card-label">Rata-rata nilai</span>
          <strong>
            {loading
              ? "—"
              : data?.ringkasan.nilaiRataRata == null
                ? "—"
                : data.ringkasan.nilaiRataRata}
          </strong>
          <small>Lihat hasil belajarmu →</small>
        </Link>
      </section>

      <section className="siswa-dashboard-panel">
        <div className="siswa-dashboard-panel-heading">
          <div>
            <h2>Aktivitas belajar</h2>
            <p>Pantau tugas dan asesmen yang perlu kamu kerjakan.</p>
          </div>
          <div className="siswa-dashboard-filters" aria-label="Filter aktivitas">
            {(
              [
                ["semua", "Semua"],
                ["belum", "Belum selesai"],
                ["selesai", "Selesai"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                className={filter === value ? "active" : ""}
                aria-pressed={filter === value}
                onClick={() => setFilter(value)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <p className="siswa-dashboard-empty" role="status">
            Memuat aktivitas...
          </p>
        ) : daftarPekerjaan.length === 0 ? (
          <p className="siswa-dashboard-empty">
            {filter === "belum"
              ? "Tidak ada tugas atau asesmen yang menunggu."
              : filter === "selesai"
                ? "Belum ada aktivitas yang selesai."
                : "Belum ada tugas atau asesmen untuk kelasmu."}
          </p>
        ) : (
          <div className="siswa-dashboard-activity-list">
            {daftarPekerjaan.slice(0, 6).map((item) => (
              <article
                className="siswa-dashboard-activity"
                key={`${item.jenis}-${item._id}`}
              >
                <div className="siswa-dashboard-activity-mark">
                  {item.jenis === "Tugas" ? "T" : "A"}
                </div>
                <div className="siswa-dashboard-activity-info">
                  <strong>{item.judul}</strong>
                  <span>
                    {item.jenis} · {item.mataPelajaran}
                    {item.jenis === "Tugas" && item.tenggat
                      ? ` · Tenggat ${formatTanggal(item.tenggat)}`
                      : ""}
                  </span>
                </div>
                <span
                  className={`siswa-dashboard-status ${
                    item.selesai ? "is-done" : "is-pending"
                  }`}
                >
                  {item.selesai ? "Selesai" : "Belum selesai"}
                </span>
                <Link className="siswa-dashboard-open" href={item.href}>
                  Buka
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="siswa-dashboard-panel">
        <div className="siswa-dashboard-panel-heading">
          <div>
            <h2>Materi terbaru</h2>
            <p>Materi terbaru yang dibagikan untuk kelasmu.</p>
          </div>
          <Link className="siswa-dashboard-text-link" href="/siswa/materi">
            Lihat semua →
          </Link>
        </div>

        {loading ? (
          <p className="siswa-dashboard-empty" role="status">
            Memuat materi...
          </p>
        ) : !data?.materiTerbaru.length ? (
          <p className="siswa-dashboard-empty">
            Belum ada materi yang tersedia untuk kelasmu.
          </p>
        ) : (
          <div className="siswa-dashboard-material-list">
            {data.materiTerbaru.map((item) => (
              <Link
                className="siswa-dashboard-material"
                href="/siswa/materi"
                key={item._id}
              >
                <span className="siswa-dashboard-material-type">
                  {item.tipe === "youtube"
                    ? "Video"
                    : item.tipe === "pdf"
                      ? "PDF"
                      : "Teks"}
                </span>
                <span className="siswa-dashboard-material-info">
                  <strong>{item.judul}</strong>
                  <small>
                    {item.mataPelajaran} · {formatTanggal(item.createdAt)}
                  </small>
                </span>
                <span aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
