import Link from "next/link";

import Icon from "../../components/Icon";
import { connectDB } from "../../../lib/mongodb";

import User from "../../../models/User";
import Siswa from "../../../models/Siswa";
import Guru from "../../../models/Guru";
import Kelas from "../../../models/Kelas";
import MataPelajaran from "../../../models/MataPelajaran";

export const dynamic = "force-dynamic";

async function getStatistik() {
  try {
    await connectDB();

    const [
      totalSiswa,
      totalGuru,
      totalKelas,
      totalMapel,
      totalUser,
    ] = await Promise.all([
      Siswa.countDocuments(),
      Guru.countDocuments(),
      Kelas.countDocuments(),
      MataPelajaran.countDocuments(),
      User.countDocuments(),
    ]);

    return {
      totalSiswa,
      totalGuru,
      totalKelas,
      totalMapel,
      totalUser,
    };
  } catch (error) {
    console.error("GET STATISTIK ADMIN ERROR:", error);

    return {
      totalSiswa: 0,
      totalGuru: 0,
      totalKelas: 0,
      totalMapel: 0,
      totalUser: 0,
    };
  }
}

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

export default async function AdminDashboard() {
  const stat = await getStatistik();

  const kartu = [
    {
      icon: "user" as const,
      label: "Total Siswa",
      nilai: stat.totalSiswa,
    },
    {
      icon: "guru" as const,
      label: "Total Guru",
      nilai: stat.totalGuru,
    },
    {
      icon: "kelas" as const,
      label: "Total Kelas",
      nilai: stat.totalKelas,
    },
    {
      icon: "book" as const,
      label: "Mata Pelajaran",
      nilai: stat.totalMapel,
    },
  ];

  return (
    <div className="admin-dashboard">
      <div className="dashboard-welcome">
        <h1>Selamat Datang, Administrator</h1>

        <p>
          Kelola sistem pendidikan melalui dashboard
          admin.
        </p>
      </div>

      <div className="dashboard-cards">
        {kartu.map((item) => (
          <div
            className="dashboard-card"
            key={item.label}
          >
            <div className="dashboard-card-icon">
              <Icon name={item.icon} />
            </div>

            <div className="dashboard-card-body">
              <span>{item.label}</span>
              <strong>{item.nilai}</strong>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-panel">
        <div className="dashboard-panel-header">
          <h2>Akses Cepat</h2>
          <p>
            Kelola data dan pengguna sistem dengan
            cepat.
          </p>
        </div>

        <div className="quick-links">
          {menu.map((item) => (
            <Link
              href={item.href}
              className="quick-link"
              key={item.href}
            >
              <div className="stat-icon">
                <Icon name={item.icon} />
              </div>

              <div>
                <strong>{item.title}</strong>
                <small>{item.desc}</small>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}