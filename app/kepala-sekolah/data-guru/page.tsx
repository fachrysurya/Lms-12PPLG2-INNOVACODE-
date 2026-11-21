import Link from "next/link";
import ReadOnlyData from "../../kurikulum/components/ReadOnlyData";

export default function DataGuruKepalaSekolahPage() {
  return (
    <div className="data-sekolah-detail">
      <ReadOnlyData title="Data Guru" description="Preview dan unduh data guru beserta mata pelajaran yang diampu." endpoint="/api/admin/data-guru" responseKey="guru" columns={[{ key: "nama", label: "Nama Guru" }, { key: "nip", label: "NIP" }, { key: "mataPelajaran", label: "Mata Pelajaran" }, { key: "email", label: "Email" }, { key: "aktif", label: "Status" }]} />
      <Link href="/kepala-sekolah/data-sekolah" className="data-sekolah-back">
        ← Kembali ke Data Sekolah
      </Link>
    </div>
  );
}
