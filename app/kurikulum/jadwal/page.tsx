import ReadOnlyData from "../components/ReadOnlyData";

export default function JadwalKurikulumPage() {
  return <ReadOnlyData title="Jadwal Pelajaran" description="Preview dan unduh jadwal pelajaran beserta guru dan ruang kelas." endpoint="/api/admin/jadwal" responseKey="jadwal" rowFormatter="jadwal" columns={[{ key: "hari", label: "Hari" }, { key: "jam", label: "Jam Pelajaran" }, { key: "kelas", label: "Kelas" }, { key: "mataPelajaran", label: "Mata Pelajaran" }, { key: "guru", label: "Guru Pengajar" }, { key: "ruang", label: "Ruang Kelas" }]} />;
}