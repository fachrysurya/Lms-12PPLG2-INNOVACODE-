"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Icon from "../../components/Icon";

type Statistik = {
  totalSiswa: number;
  siswaAktif: number;
  totalGuru: number;
  guruAktif: number;
  totalKelas: number;
  kelasAktif: number;
  totalMapel: number;
  mapelAktif: number;
  totalUser: number;
  userAktif: number;
  akunSiswa: number;
  akunGuru: number;
  akunAdmin: number;
  materiAktif: number;
  tugasAktif: number;
  asesmenAktif: number;
};

type Pengguna = {
  _id: string;
  nama: string;
  username: string;
  role: string;
  aktif: boolean;
  createdAt?: string;
};

type DashboardResponse = {
  success: boolean;
  message?: string;
  statistik: Statistik;
  penggunaTerbaru: Pengguna[];
};

type FilterRole = "semua" | "admin" | "guru" | "siswa" | "lainnya";

const menu = [
  {
    href: "/admin/manajemen-user",
    icon: "users" as const,
    title: "Manajemen User",
    desc: "Kelola akun pengguna",
  },
  {
    href: "/admin/data-siswa",
    icon: "user" as const,
    title: "Data Siswa",
    desc: "Kelola data siswa",
  },
  {
    href: "/admin/data-guru",
    icon: "guru" as const,
    title: "Data Guru",
    desc: "Kelola data guru",
  },
  {
    href: "/admin/manajemen-kelas",
    icon: "kelas" as const,
    title: "Manajemen Kelas",
    desc: "Kelola data kelas",
  },
  {
    href: "/admin/mata-pelajaran",
    icon: "book" as const,
    title: "Mata Pelajaran",
    desc: "Kelola mata pelajaran",
  },
  {
    href: "/admin/laporan",
    icon: "tugas" as const,
    title: "Laporan",
    desc: "Lihat laporan sistem",
  },
];

function formatTanggal(value?: string): string {
  if (!value) return "Tanggal tidak tersedia";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Tanggal tidak tersedia"
    : new Intl.DateTimeFormat("id-ID", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(date);
}

function labelRole(role: string): string {
  if (role === "kepala-sekolah") return "Kepala Sekolah";
  if (role === "kurikulum") return "Kurikulum";
  return role.charAt(0).toUpperCase() + role.slice(1);
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cari, setCari] = useState("");
  const [filterRole, setFilterRole] = useState<FilterRole>("semua");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/admin/dashboard", {
      cache: "no-store",
      signal: controller.signal,
    })
      .then(async (response) => {
        const result = (await response.json()) as DashboardResponse;
        if (!response.ok || !result.success) {
          throw new Error(result.message || "Gagal memuat dashboard admin.");
        }
        if (!controller.signal.aborted) {
          setData(result);
          setError("");
        }
      })
      .catch((fetchError: unknown) => {
        if (controller.signal.aborted) return;
        console.error("GET DASHBOARD ADMIN ERROR:", fetchError);
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "Gagal memuat dashboard admin."
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [reloadKey]);

  const statistik = data?.statistik;
  const kartu = [
    {
      icon: "user" as const,
      label: "Total Siswa",
      nilai: statistik?.totalSiswa,
      keterangan: `${statistik?.siswaAktif ?? 0} aktif`,
      href: "/admin/data-siswa",
    },
    {
      icon: "guru" as const,
      label: "Total Guru",
      nilai: statistik?.totalGuru,
      keterangan: `${statistik?.guruAktif ?? 0} aktif`,
      href: "/admin/data-guru",
    },
    {
      icon: "kelas" as const,
      label: "Total Kelas",
      nilai: statistik?.totalKelas,
      keterangan: `${statistik?.kelasAktif ?? 0} aktif`,
      href: "/admin/manajemen-kelas",
    },
    {
      icon: "book" as const,
      label: "Mata Pelajaran",
      nilai: statistik?.totalMapel,
      keterangan: `${statistik?.mapelAktif ?? 0} aktif`,
      href: "/admin/mata-pelajaran",
    },
  ];

  const penggunaTersaring = useMemo(() => {
    if (!data) return [];
    const query = cari.trim().toLocaleLowerCase("id-ID");
    return data.penggunaTerbaru.filter((user) => {
      const cocokCari =
        !query ||
        user.nama.toLocaleLowerCase("id-ID").includes(query) ||
        user.username.toLocaleLowerCase("id-ID").includes(query);
      const cocokRole =
        filterRole === "semua" ||
        (filterRole === "lainnya"
          ? !["admin", "guru", "siswa"].includes(user.role)
          : user.role === filterRole);
      return cocokCari && cocokRole;
    });
  }, [data, cari, filterRole]);

  const totalPengguna = statistik?.totalUser ?? 0;
  const roleSummary = [
    { label: "Siswa", total: statistik?.akunSiswa ?? 0, color: "siswa" },
    { label: "Guru", total: statistik?.akunGuru ?? 0, color: "guru" },
    {
      label: "Lainnya",
      total: Math.max(
        totalPengguna -
          (statistik?.akunSiswa ?? 0) -
          (statistik?.akunGuru ?? 0),
        0
      ),
      color: "lainnya",
    },
  ];

  return (
    <div className="admin-dashboard">
      <section className="admin-dashboard-welcome">
        <div>
          <p className="admin-dashboard-eyebrow">PUSAT KENDALI EDUCLASS</p>
          <h1>Selamat Datang, Administrator</h1>
          <p>Ringkasan data dan aktivitas sistem sekolah.</p>
        </div>
        <button
          type="button"
          className="admin-dashboard-refresh"
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
        <div className="admin-dashboard-alert" role="alert">
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

      <section className="dashboard-cards admin-dashboard-cards">
        {kartu.map((item) => (
          <Link
            className="dashboard-card admin-dashboard-stat-card"
            href={item.href}
            key={item.label}
          >
            <div className="dashboard-card-icon">
              <Icon name={item.icon} />
            </div>
            <div className="dashboard-card-body">
              <span>{item.label}</span>
              <strong>{loading ? "—" : item.nilai ?? 0}</strong>
              <small>{item.keterangan}</small>
            </div>
            <span className="admin-dashboard-card-arrow" aria-hidden="true">
              →
            </span>
          </Link>
        ))}
      </section>

      <section className="admin-dashboard-secondary-stats">
        <Link href="/admin/manajemen-user">
          <span>Pengguna aktif</span>
          <strong>
            {loading ? "—" : `${statistik?.userAktif ?? 0} / ${totalPengguna}`}
          </strong>
        </Link>
        <Link href="/admin/laporan">
          <span>Materi aktif</span>
          <strong>{loading ? "—" : statistik?.materiAktif ?? 0}</strong>
        </Link>
        <Link href="/admin/laporan">
          <span>Tugas aktif</span>
          <strong>{loading ? "—" : statistik?.tugasAktif ?? 0}</strong>
        </Link>
        <Link href="/admin/laporan">
          <span>Asesmen aktif</span>
          <strong>{loading ? "—" : statistik?.asesmenAktif ?? 0}</strong>
        </Link>
      </section>

      <section className="admin-dashboard-grid">
        <div className="dashboard-panel admin-dashboard-users-panel">
          <div className="admin-dashboard-panel-heading">
            <div>
              <h2>Pengguna Terbaru</h2>
              <p>Akun terbaru yang terdaftar di sistem.</p>
            </div>
            <Link href="/admin/manajemen-user">Kelola pengguna →</Link>
          </div>

          <div className="admin-dashboard-user-controls">
            <input
              type="search"
              aria-label="Cari pengguna"
              placeholder="Cari nama atau username..."
              value={cari}
              onChange={(event) => setCari(event.target.value)}
            />
            <select
              aria-label="Filter berdasarkan peran"
              value={filterRole}
              onChange={(event) =>
                setFilterRole(event.target.value as FilterRole)
              }
            >
              <option value="semua">Semua peran</option>
              <option value="admin">Admin</option>
              <option value="guru">Guru</option>
              <option value="siswa">Siswa</option>
              <option value="lainnya">Peran lainnya</option>
            </select>
          </div>

          {loading ? (
            <p className="admin-dashboard-empty">Memuat pengguna...</p>
          ) : penggunaTersaring.length === 0 ? (
            <p className="admin-dashboard-empty">
              {data?.penggunaTerbaru.length
                ? "Tidak ada pengguna yang cocok dengan pencarian."
                : "Belum ada data pengguna."}
            </p>
          ) : (
            <div className="admin-dashboard-user-list">
              {penggunaTersaring.map((user) => (
                <article className="admin-dashboard-user" key={user._id}>
                  <span className="admin-dashboard-user-avatar">
                    {user.nama.charAt(0).toLocaleUpperCase("id-ID")}
                  </span>
                  <div className="admin-dashboard-user-info">
                    <strong>{user.nama}</strong>
                    <small>
                      @{user.username} · {formatTanggal(user.createdAt)}
                    </small>
                  </div>
                  <span className={`admin-dashboard-role role-${user.role}`}>
                    {labelRole(user.role)}
                  </span>
                  <span
                    className={`admin-dashboard-user-status ${
                      user.aktif ? "is-active" : "is-inactive"
                    }`}
                  >
                    {user.aktif ? "Aktif" : "Nonaktif"}
                  </span>
                </article>
              ))}
            </div>
          )}
        </div>

        <div className="dashboard-panel admin-dashboard-side-panel">
          <div className="admin-dashboard-panel-heading">
            <div>
              <h2>Komposisi Pengguna</h2>
              <p>Perbandingan akun berdasarkan peran.</p>
            </div>
          </div>
          {loading ? (
            <p className="admin-dashboard-empty">Memuat ringkasan...</p>
          ) : (
            <div className="admin-dashboard-role-summary">
              {roleSummary.map((role) => {
                const persen =
                  totalPengguna > 0
                    ? Math.round((role.total / totalPengguna) * 100)
                    : 0;
                return (
                  <div className="admin-dashboard-role-row" key={role.label}>
                    <div>
                      <span>{role.label}</span>
                      <strong>{role.total}</strong>
                    </div>
                    <div
                      className="admin-dashboard-role-track"
                      role="progressbar"
                      aria-label={`${role.label}, ${persen}%`}
                      aria-valuenow={persen}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      <span
                        className={`role-fill-${role.color}`}
                        style={{ width: `${persen}%` }}
                      />
                    </div>
                    <small>{persen}%</small>
                  </div>
                );
              })}
            </div>
          )}

          <div className="admin-dashboard-panel-heading admin-dashboard-shortcut-heading">
            <div>
              <h2>Akses Cepat</h2>
              <p>Pilih pengelolaan yang ingin dibuka.</p>
            </div>
          </div>
          <div className="admin-dashboard-shortcuts">
            {menu.map((item) => (
              <Link href={item.href} key={item.href}>
                <span className="admin-dashboard-shortcut-icon">
                  <Icon name={item.icon} />
                </span>
                <span>
                  <strong>{item.title}</strong>
                  <small>{item.desc}</small>
                </span>
                <span aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
