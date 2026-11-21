import Link from "next/link";

export default function DataSekolahKurikulumPage() {
  const options = [
    {
      href: "/kurikulum/data-guru",
      icon: "👨‍🏫",
      title: "Data Guru",
      description: "Lihat data guru, NIP, mata pelajaran, dan status aktif.",
    },
    {
      href: "/kurikulum/data-siswa",
      icon: "👨‍🎓",
      title: "Data Siswa",
      description: "Lihat data siswa, kelas, jurusan, dan status aktif.",
    },
    {
      href: "/kurikulum/data-kelas",
      icon: "▤",
      title: "Data Kelas",
      description: "Lihat informasi kelas, wali kelas, dan jumlah siswa.",
    },
  ];

  return (
    <div className="data-sekolah-page kurikulum-data-sekolah-page">
      <div className="dashboard-welcome kurikulum-data-sekolah-heading">
        <h1>Data Sekolah</h1>
        <p>Pilih kategori data sekolah yang ingin dilihat.</p>
      </div>

      <div className="kurikulum-data-sekolah-grid">
        {options.map((option) => (
          <Link key={option.href} href={option.href} className="kurikulum-data-sekolah-card">
            <div className="kurikulum-data-sekolah-card-top">
              <div className="kurikulum-data-sekolah-card-icon">{option.icon}</div>
              <span className="kurikulum-data-sekolah-card-arrow">→</span>
            </div>
            <div className="kurikulum-data-sekolah-card-content">
              <h2>{option.title}</h2>
              <p>{option.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
