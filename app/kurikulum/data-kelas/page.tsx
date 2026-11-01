import ReadOnlyData from "../components/ReadOnlyData";

export default function DataKelasKurikulumPage() {
  return <ReadOnlyData title="Data Kelas" description="Preview dan unduh informasi kelas, wali kelas, dan jumlah siswa." endpoint="/api/admin/kelas" responseKey="kelas" rowFormatter="kelas" columns={[{ key: "namaKelas", label: "Nama Kelas" }, { key: "tingkat", label: "Tingkat" }, { key: "jurusan", label: "Jurusan" }, { key: "waliKelas", label: "Wali Kelas" }, { key: "jumlahSiswa", label: "Jumlah Siswa" }]} />;
}
