import ReadOnlyData from "../../kurikulum/components/ReadOnlyData";

export default function DataSiswaKepalaSekolahPage() {
  return <ReadOnlyData title="Data Siswa" description="Preview dan unduh data siswa berdasarkan kelas, jurusan, dan status." endpoint="/api/admin/data-siswa" responseKey="siswa" rowFormatter="siswa" columns={[{ key: "nisn", label: "NIS/NISN" }, { key: "nama", label: "Nama Siswa" }, { key: "kelas", label: "Kelas" }, { key: "jurusan", label: "Jurusan" }, { key: "aktif", label: "Status" }]} />;
}
