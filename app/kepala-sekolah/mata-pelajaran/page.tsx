import ReadOnlyData from "../../kurikulum/components/ReadOnlyData";

export default function MataPelajaranKepalaSekolahPage() {
  return <ReadOnlyData title="Data Mata Pelajaran" description="Preview dan unduh mata pelajaran, kelompok, dan guru pengampu." endpoint="/api/admin/mata-pelajaran" responseKey="data" columns={[{ key: "kodeMapel", label: "Kode Mata Pelajaran" }, { key: "namaMapel", label: "Nama Mata Pelajaran" }, { key: "kelompok", label: "Kelompok Mata Pelajaran" }, { key: "guruPengampu", label: "Guru Pengampu" }, { key: "aktif", label: "Status" }]} />;
}
