"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function KepalaSekolahSidebar() {
  const pathname = usePathname();
  const dataSekolahActive =
    pathname.startsWith("/kepala-sekolah/data-sekolah") ||
    pathname.startsWith("/kepala-sekolah/data-siswa") ||
    pathname.startsWith("/kepala-sekolah/data-guru") ||
    pathname.startsWith("/kepala-sekolah/data-kelas");

  return (
    <aside className="kepsek-sidebar">
      <div className="kepsek-logo">
        Edu<span>Class</span>
      </div>

      <div className="kepsek-role">KEPALA SEKOLAH</div>

      <nav className="kepsek-sidebar-menu">
        <Link
          href="/kepala-sekolah/dashboard"
          className={pathname === "/kepala-sekolah/dashboard" ? "active" : ""}
        >
          Dashboard
        </Link>

        <Link
          href="/kepala-sekolah/data-sekolah"
          className={dataSekolahActive ? "active" : ""}
        >
          Data Sekolah
        </Link>

        <Link
          href="/kepala-sekolah/mata-pelajaran"
          className={pathname.startsWith("/kepala-sekolah/mata-pelajaran") ? "active" : ""}
        >
          Mata Pelajaran
        </Link>

        <Link
          href="/kepala-sekolah/jadwal"
          className={pathname.startsWith("/kepala-sekolah/jadwal") ? "active" : ""}
        >
          Jadwal Pelajaran
        </Link>

        <Link
          href="/kepala-sekolah/laporan"
          className={pathname.startsWith("/kepala-sekolah/laporan") ? "active" : ""}
        >
          Laporan
        </Link>

        <Link
          href="/kepala-sekolah/profile"
          className={pathname.startsWith("/kepala-sekolah/profile") ? "active" : ""}
        >
          Profile
        </Link>
      </nav>

      <div className="kepsek-sidebar-bottom">
        <Link href="/login">Logout</Link>
      </div>
    </aside>
  );
}
