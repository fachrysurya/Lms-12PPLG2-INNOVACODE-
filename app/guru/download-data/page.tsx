"use client";

import { useEffect, useState } from "react";

import Icon from "../../components/Icon";
import { buatPDF } from "../../../lib/pdf";
import { buatExcel } from "../../../lib/excel";

type FormatUnduh = "pdf" | "excel";

type BarisData = Record<string, unknown>;

type Kolom = {
  key: string;
  label: string;
};

type JenisData = {
  id: string;
  nama: string;
  deskripsi: string;
  icon: "nilai" | "tugas" | "asesmen" | "book";
  endpoint: string;
  listKey: string;
  kolom: Kolom[];
};

const daftarData: JenisData[] = [
  {
    id: "nilai",
    nama: "Data Nilai",
    deskripsi:
      "Nilai tugas, asesmen, dan nilai akhir siswa.",
    icon: "nilai",
    endpoint: "/api/guru/nilai",
    listKey: "nilai",
    kolom: [
      { key: "namaSiswa", label: "Nama Siswa" },
      { key: "nis", label: "NIS" },
      { key: "kelas", label: "Kelas" },
      { key: "mataPelajaran", label: "Mata Pelajaran" },
      { key: "semester", label: "Semester" },
      { key: "nilaiTugas", label: "Nilai Tugas" },
      { key: "nilaiAsesmen", label: "Nilai Asesmen" },
      { key: "nilaiAkhir", label: "Nilai Akhir" },
      { key: "semesterSelesai", label: "Status" },
    ],
  },
  {
    id: "tugas",
    nama: "Data Tugas",
    deskripsi:
      "Daftar tugas beserta mapel, kelas, dan poin.",
    icon: "tugas",
    endpoint: "/api/guru/tugas",
    listKey: "tugas",
    kolom: [
      { key: "judul", label: "Judul" },
      { key: "mataPelajaran", label: "Mata Pelajaran" },
      { key: "kelas", label: "Kelas" },
      { key: "jenis", label: "Jenis" },
      { key: "tenggat", label: "Tenggat" },
      { key: "poin", label: "Poin" },
      { key: "aktif", label: "Status" },
    ],
  },
  {
    id: "asesmen",
    nama: "Data Asesmen",
    deskripsi:
      "Daftar asesmen pilihan ganda & esai.",
    icon: "asesmen",
    endpoint: "/api/guru/asesmen",
    listKey: "asesmen",
    kolom: [
      { key: "judul", label: "Judul" },
      { key: "mataPelajaran", label: "Mata Pelajaran" },
      { key: "kelas", label: "Kelas" },
      { key: "jenis", label: "Jenis" },
      { key: "durasi", label: "Durasi (menit)" },
      { key: "poin", label: "Poin" },
      { key: "aktif", label: "Status" },
    ],
  },
  {
    id: "materi",
    nama: "Data Materi",
    deskripsi:
      "Materi pembelajaran yang Anda kelola.",
    icon: "book",
    endpoint: "/api/guru/materi",
    listKey: "materi",
    kolom: [
      { key: "judul", label: "Judul" },
      { key: "mataPelajaran", label: "Mata Pelajaran" },
      { key: "kelas", label: "Kelas" },
      { key: "jenis", label: "Jenis" },
      { key: "deskripsi", label: "Deskripsi" },
      { key: "aktif", label: "Status" },
    ],
  },
];

function ambilNilai(
  baris: BarisData,
  key: string
): string {
  const nilai = baris[key];

  if (nilai === null || nilai === undefined) {
    return "";
  }

  if (typeof nilai === "boolean") {
    return nilai ? "Aktif" : "Nonaktif";
  }

  return String(nilai);
}

export default function GuruDownloadPage() {
  const [catatan, setCatatan] = useState("");
  const [sedangProses, setSedangProses] = useState<{
    id: string;
    format: FormatUnduh;
  } | null>(null);
  const [jumlah, setJumlah] = useState<
    Record<string, number | null>
  >({});

  useEffect(() => {
    async function hitung() {
      const hasil: Record<string, number | null> = {};

      await Promise.all(
        daftarData.map(async (item) => {
          try {
            const res = await fetch(item.endpoint, {
              cache: "no-store",
            });

            const data = await res.json();

            hasil[item.id] = data.success
              ? (data[item.listKey] as BarisData[])?.length ?? 0
              : null;
          } catch {
            hasil[item.id] = null;
          }
        })
      );

      setJumlah(hasil);
    }

    hitung();
  }, []);

  async function unduh(item: JenisData, format: FormatUnduh) {
    try {
      setSedangProses({ id: item.id, format });
      setCatatan("");

      const res = await fetch(item.endpoint, {
        cache: "no-store",
      });

      const data = await res.json();

      if (!data.success) {
        setCatatan(
          data.message || `Gagal mengambil ${item.nama}.`
        );
        return;
      }

      const baris = (data[item.listKey] as BarisData[]) ?? [];

      if (baris.length === 0) {
        setCatatan(
          `${item.nama} masih kosong, tidak ada yang bisa diunduh.`
        );
        return;
      }

      const blob =
        format === "excel"
          ? buatExcel(item.nama, item.kolom, baris)
          : buatPDF(item.nama, item.kolom, baris);

      const ekstensi = format === "excel" ? "xls" : "pdf";

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `${item.id}-${new Date()
        .toISOString()
        .slice(0, 10)}.${ekstensi}`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);

      const label = format === "excel" ? "Excel" : "PDF";

      setCatatan(
        `${item.nama} berhasil diunduh sebagai ${label} (${baris.length} baris).`
      );
    } catch (error) {
      console.error(error);
      setCatatan(`Gagal mengunduh ${item.nama}.`);
    } finally {
      setSedangProses(null);
    }
  }

  return (
    <div className="management-page">
      <div className="management-header">
        <div>
          <h1>Download Data</h1>

          <p>
            Unduh data pembelajaran dalam format PDF atau Excel.
          </p>
        </div>
      </div>

      <div className="download-grid">
        {daftarData.map((item) => (
          <div className="download-card" key={item.id}>
            <div className="download-card-head">
              <div className="download-icon">
                <Icon name={item.icon} />
              </div>

              <div>
                <h3>{item.nama}</h3>

                <p>{item.deskripsi}</p>

                <small>
                  {jumlah[item.id] === undefined
                    ? "Menghitung..."
                    : jumlah[item.id] === null
                      ? "Tidak tersedia"
                      : `${jumlah[item.id]} baris data`}
                </small>
              </div>
            </div>

            <div className="download-opsi">
              <button
                type="button"
                className="download-button"
                disabled={sedangProses?.id === item.id}
                onClick={() => unduh(item, "pdf")}
              >
                <Icon name="download" />

                {sedangProses?.id === item.id &&
                  sedangProses.format === "pdf"
                  ? "Menyiapkan..."
                  : "PDF"}
              </button>

              <button
                type="button"
                className="download-button excel"
                disabled={sedangProses?.id === item.id}
                onClick={() => unduh(item, "excel")}
              >
                <Icon name="download" />

                {sedangProses?.id === item.id &&
                  sedangProses.format === "excel"
                  ? "Menyiapkan..."
                  : "Excel"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {catatan && (
        <div className="download-note">{catatan}</div>
      )}
    </div>
  );
}
