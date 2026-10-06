"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import Icon from "../../components/Icon";

type MateriItem = {
  _id: string;
  judul: string;
  mataPelajaran: string;
  kelas: string;
  tipe: string;
  createdAt?: string;
};

type TugasItem = {
  _id: string;
  judul: string;
  mataPelajaran: string;
  kelas: string;
  jenis: string;
  tenggat?: string;
  poin: number;
  createdAt?: string;
};

type AsesmenItem = {
  _id: string;
  judul: string;
  mataPelajaran: string;
  kelas: string;
  soal: unknown[];
  createdAt?: string;
};

export default function GuruDashboard() {
  const [materi, setMateri] = useState<MateriItem[]>([]);
  const [tugas, setTugas] = useState<TugasItem[]>([]);
  const [asesmen, setAsesmen] = useState<AsesmenItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function muat() {
      try {
        const [m, t, a] = await Promise.all([
          fetch("/api/guru/materi", { cache: "no-store" }).then(
            (r) => r.json()
          ),
          fetch("/api/guru/tugas", { cache: "no-store" }).then(
            (r) => r.json()
          ),
          fetch("/api/guru/asesmen", { cache: "no-store" }).then(
            (r) => r.json()
          ),
        ]);

        if (m.success) setMateri(m.materi || []);
        if (t.success) setTugas(t.tugas || []);
        if (a.success) setAsesmen(a.asesmen || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    muat();
  }, []);

  const totalSoal = useMemo(
    () =>
      asesmen.reduce(
        (total, item) => total + (item.soal?.length || 0),
        0
      ),
    [asesmen]
  );

  const tugasAktif = useMemo(
    () =>
      tugas.filter(
        (item) =>
          item.tenggat &&
          new Date(item.tenggat).getTime() > Date.now()
      ).length,
    [tugas]
  );

  const mapelUnik = useMemo(() => {
    const semua = [
      ...materi.map((m) => m.mataPelajaran),
      ...tugas.map((t) => t.mataPelajaran),
      ...asesmen.map((a) => a.mataPelajaran),
    ];

    return new Set(semua.filter(Boolean)).size;
  }, [materi, tugas, asesmen]);

  const aktivitas = useMemo(() => {
    const gabung = [
      ...materi.map((item) => ({
        id: `m-${item._id}`,
        tipe: "Materi",
        judul: item.judul,
        mapel: item.mataPelajaran,
        waktu: item.createdAt || "",
      })),
      ...tugas.map((item) => ({
        id: `t-${item._id}`,
        tipe: "Tugas",
        judul: item.judul,
        mapel: item.mataPelajaran,
        waktu: item.createdAt || "",
      })),
      ...asesmen.map((item) => ({
        id: `a-${item._id}`,
        tipe: "Asesmen",
        judul: item.judul,
        mapel: item.mataPelajaran,
        waktu: item.createdAt || "",
      })),
    ];

    return gabung
      .filter((item) => item.waktu)
      .sort(
        (a, b) =>
          new Date(b.waktu).getTime() -
          new Date(a.waktu).getTime()
      )
      .slice(0, 6);
  }, [materi, tugas, asesmen]);

  const stat = [
    {
      label: "Total Materi",
      nilai: materi.length,
      icon: "book" as const,
      href: "/guru/materi",
    },
    {
      label: "Total Tugas",
      nilai: tugas.length,
      icon: "edit" as const,
      href: "/guru/tugas",
    },
    {
      label: "Total Asesmen",
      nilai: asesmen.length,
      icon: "kelas" as const,
      href: "/guru/asesmen",
    },
    {
      label: "Total Soal",
      nilai: totalSoal,
      icon: "users" as const,
      href: "/guru/asesmen",
    },
  ];

  return (
    <div className="guru-dashboard">
      <div className="dashboard-welcome">
        <h1>Selamat Datang, Guru</h1>

        <p>
          Kelola proses pembelajaran dan aktivitas siswa.
        </p>
      </div>

      <div className="dashboard-cards">
        {stat.map((item) => (
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
              <strong>
                {loading ? "..." : item.nilai}
              </strong>
            </div>
          </Link>
        ))}
      </div>

      <div className="guru-dashboard-grid">
        <div className="guru-panel">
          <div className="guru-panel-head">
            <h2>Aktivitas Terbaru</h2>
            <span>{aktivitas.length} item</span>
          </div>

          {loading ? (
            <p className="guru-panel-empty">Memuat data...</p>
          ) : aktivitas.length === 0 ? (
            <p className="guru-panel-empty">
              Belum ada aktivitas. Mulai dengan menambahkan
              materi atau tugas.
            </p>
          ) : (
            <ul className="guru-aktivitas">
              {aktivitas.map((item) => (
                <li key={item.id}>
                  <span
                    className={`guru-tag guru-tag-${item.tipe.toLowerCase()}`}
                  >
                    {item.tipe}
                  </span>

                  <div>
                    <strong>{item.judul}</strong>
                    <small>{item.mapel}</small>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="guru-panel">
          <div className="guru-panel-head">
            <h2>Ringkasan</h2>
          </div>

          <div className="guru-ringkasan">
            <div>
              <span>Mata Pelajaran Diampu</span>
              <strong>{loading ? "..." : mapelUnik}</strong>
            </div>

            <div>
              <span>Tugas Berjalan</span>
              <strong>{loading ? "..." : tugasAktif}</strong>
            </div>

            <div>
              <span>Total Soal Asesmen</span>
              <strong>{loading ? "..." : totalSoal}</strong>
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
                <small>Esai &amp; soal isian</small>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}