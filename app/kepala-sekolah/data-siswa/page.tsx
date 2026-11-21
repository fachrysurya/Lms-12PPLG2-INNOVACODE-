import Link from "next/link";
import ReadOnlyData from "../../kurikulum/components/ReadOnlyData";

export default function DataSiswaKepalaSekolahPage() {
  return (
    <div className="data-sekolah-detail">
      <ReadOnlyData title="Data Siswa" description="Preview dan unduh data siswa berdasarkan kelas, jurusan, dan status." endpoint="/api/admin/data-siswa" responseKey="siswa" rowFormatter="siswa" columns={[{ key: "nisn", label: "NIS/NISN" }, { key: "nama", label: "Nama Siswa" }, { key: "kelas", label: "Kelas" }, { key: "jurusan", label: "Jurusan" }, { key: "aktif", label: "Status" }]} />
      <Link href="/kepala-sekolah/data-sekolah" className="data-sekolah-back">
        ← Kembali ke Data Sekolah
      </Link>
    </div>
  );
}
