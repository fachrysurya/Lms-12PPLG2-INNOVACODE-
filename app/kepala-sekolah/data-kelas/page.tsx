import Link from "next/link";
import ReadOnlyData from "../../kurikulum/components/ReadOnlyData";

export default function DataKelasKepalaSekolahPage() {
  return (
    <div className="data-sekolah-detail">
      <ReadOnlyData title="Data Kelas" description="Preview dan unduh informasi kelas, wali kelas, dan jumlah siswa." endpoint="/api/admin/kelas" responseKey="kelas" rowFormatter="kelas" columns={[{ key: "namaKelas", label: "Nama Kelas" }, { key: "tingkat", label: "Tingkat" }, { key: "jurusan", label: "Jurusan" }, { key: "waliKelas", label: "Wali Kelas" }, { key: "jumlahSiswa", label: "Jumlah Siswa" }]} />
      <Link href="/kepala-sekolah/data-sekolah" className="data-sekolah-back">
        ← Kembali ke Data Sekolah
      </Link>
    </div>
  );
}
