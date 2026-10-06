"use client";

import { useEffect, useState } from "react";

import Icon from "../../components/Icon";
import { buatPDF } from "../../../lib/pdf";

type BarisData = Record<string, unknown>;

type Kolom = {
  key: string;
  label: string;
};

type JenisData = {
  id: string;
  nama: string;
  deskripsi: string;
  icon: "user" | "guru" | "kelas" | "book" | "users";
  endpoint: string;
  listKey: string;
  kolom: Kolom[];
};

const daftarData: JenisData[] = [
  {
    id: "siswa",
    nama: "Data Siswa",
    deskripsi:
      "Nama, NIS, jenis kelamin, kelas, dan kontak siswa.",
    icon: "user",
    endpoint: "/api/admin/data-siswa",
    listKey: "siswa",
    kolom: [
      { key: "nama", label: "Nama" },
      { key: "nis", label: "NIS" },
      {
        key: "jenisKelamin",
        label: "Jenis Kelamin",
      },
      { key: "kelas", label: "Kelas" },
      { key: "email", label: "Email" },
      { key: "noTelepon", label: "No Telepon" },
      { key: "aktif", label: "Status" },
    ],
  },
  {
    id: "guru",
    nama: "Data Guru",
    deskripsi:
      "Nama, NIP, email, dan mata pelajaran yang diampu.",
    icon: "guru",
    endpoint: "/api/admin/data-guru",
    listKey: "guru",
    kolom: [
      { key: "nama", label: "Nama" },
      { key: "nip", label: "NIP" },
      { key: "email", label: "Email" },
      { key: "noTelepon", label: "No Telepon" },
      {
        key: "mataPelajaran",
        label: "Mata Pelajaran",
      },
      { key: "aktif", label: "Status" },
    ],
  },
  {
    id: "kelas",
    nama: "Data Kelas",
    deskripsi:
      "Nama kelas, tingkat, jurusan, dan wali kelas.",
    icon: "kelas",
    endpoint: "/api/admin/kelas",
    listKey: "kelas",
    kolom: [
      { key: "namaKelas", label: "Nama Kelas" },
      { key: "tingkat", label: "Tingkat" },
      { key: "jurusan", label: "Jurusan" },
      { key: "waliKelas", label: "Wali Kelas" },
      { key: "aktif", label: "Status" },
    ],
  },
  {
    id: "mapel",
    nama: "Data Mata Pelajaran",
    deskripsi:
      "Nama mapel, kode, kelompok, dan guru pengampu.",
    icon: "book",
    endpoint: "/api/admin/mata-pelajaran",
    listKey: "data",
    kolom: [
      { key: "namaMapel", label: "Nama Mapel" },
      { key: "kodeMapel", label: "Kode" },
      { key: "kelompok", label: "Kelompok" },
      {
        key: "guruPengampu",
        label: "Guru Pengampu",
      },
      { key: "aktif", label: "Status" },
    ],
  },
  {
    id: "user",
    nama: "Data User",
    deskripsi:
      "Akun pengguna sistem beserta rolenya.",
    icon: "users",
    endpoint: "/api/admin/users",
    listKey: "users",
    kolom: [
      { key: "nama", label: "Nama" },
      { key: "username", label: "Username" },
      { key: "email", label: "Email" },
      { key: "role", label: "Role" },
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

export default function DownloadDataPage() {
  const [catatan, setCatatan] = useState("");
  const [sedangProses, setSedangProses] =
    useState<string | null>(null);
  const [jumlah, setJumlah] = useState<
    Record<string, number | null>
  >({});

  useEffect(() => {
    // Ambil jumlah baris tiap jenis data untuk ditampilkan
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
              ? (data[item.listKey] as BarisData[])
                  ?.length ?? 0
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

  async function unduh(item: JenisData) {
    try {
      setSedangProses(item.id);
      setCatatan("");

      const res = await fetch(item.endpoint, {
        cache: "no-store",
      });

      const data = await res.json();

      if (!data.success) {
        setCatatan(
          data.message ||
            `Gagal mengambil ${item.nama}.`
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

      const blob = buatPDF(item.nama, item.kolom, baris);

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `${item.id}-${new Date()
        .toISOString()
        .slice(0, 10)}.pdf`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);

      setCatatan(
        `${item.nama} berhasil diunduh (${baris.length} baris).`
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
            Unduh data sistem dalam format PDF.
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

            <button
              type="button"
              className="download-button"
              disabled={sedangProses === item.id}
              onClick={() => unduh(item)}
            >
              <Icon name="download" />

              {sedangProses === item.id
                ? "Menyiapkan..."
                : "Download PDF"}
            </button>
          </div>
        ))}
      </div>

      {catatan && (
        <div className="download-note">{catatan}</div>
      )}
    </div>
  );
}