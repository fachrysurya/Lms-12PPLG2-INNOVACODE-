import ReadOnlyData from "../components/ReadOnlyData";

export default function DataGuruKurikulumPage() {
  return <ReadOnlyData title="Data Guru" description="Preview dan unduh data guru beserta mata pelajaran yang diampu." endpoint="/api/admin/data-guru" responseKey="guru" columns={[{ key: "nama", label: "Nama Guru" }, { key: "nip", label: "NIP" }, { key: "mataPelajaran", label: "Mata Pelajaran" }, { key: "email", label: "Email" }, { key: "aktif", label: "Status" }]} />;
}
