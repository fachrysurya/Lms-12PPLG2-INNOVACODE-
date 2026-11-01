"use client";

import { useEffect, useState } from "react";

export default function KurikulumDashboard() {
  const [ringkasan, setRingkasan] = useState({ totalGuru: 0, totalSiswa: 0, totalKelas: 0, totalMapel: 0 });
  useEffect(() => { fetch("/api/admin/ringkasan", { cache: "no-store" }).then((res) => res.json()).then((data) => { if (data.success) setRingkasan(data.ringkasan); }).catch(() => undefined); }, []);
  return (
    <div className="kurikulum-dashboard">
      <div className="dashboard-welcome"><h1>Dashboard Kurikulum</h1><p>Ringkasan data akademik dan kurikulum sekolah.</p></div>
      <div className="dashboard-cards">
        <div className="dashboard-card"><span>Total Guru</span><strong>{ringkasan.totalGuru}</strong><small>Guru terdaftar</small></div>
        <div className="dashboard-card"><span>Total Siswa</span><strong>{ringkasan.totalSiswa}</strong><small>Siswa terdaftar</small></div>
        <div className="dashboard-card"><span>Total Kelas</span><strong>{ringkasan.totalKelas}</strong><small>Kelas aktif</small></div>
        <div className="dashboard-card"><span>Total Mata Pelajaran</span><strong>{ringkasan.totalMapel}</strong><small>Mata pelajaran</small></div>
      </div>
      <div className="dashboard-panel"><h2>Tahun Ajaran Aktif</h2><p><strong>2025/2026</strong> — Semester aktif sesuai pengaturan akademik sekolah.</p></div>
    </div>
  );
}