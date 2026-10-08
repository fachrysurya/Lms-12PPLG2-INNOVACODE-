"use server";

import { revalidatePath } from "next/cache";
import { connectDB } from "../../../lib/mongodb";
import Nilai, {
  hitungNilaiAkhir,
  SemesterNilai,
} from "../../../models/Nilai";
import { getSession } from "../../../lib/auth";

function bersihkan(value: FormDataEntryValue | null): string {
  return String(value || "").trim();
}

function angka(
  value: FormDataEntryValue | null,
  fallback = 0
): number {
  const n = Number(value);

  if (!Number.isFinite(n)) {
    return fallback;
  }

  return Math.min(100, Math.max(0, n));
}

function validSemester(value: string): SemesterNilai {
  return value === "2" ? 2 : 1;
}

function bobot(value: FormDataEntryValue | null, fallback: number) {
  const n = Number(value);

  if (!Number.isFinite(n)) {
    return fallback;
  }

  return Math.min(100, Math.max(0, n));
}

export async function createNilai(formData: FormData) {
  try {
    await connectDB();

    const session = await getSession();

    const siswaId = bersihkan(formData.get("siswaId"));
    const namaSiswa = bersihkan(formData.get("namaSiswa"));
    const nis = bersihkan(formData.get("nis"));
    const kelas = bersihkan(formData.get("kelas"));
    const mataPelajaran = bersihkan(
      formData.get("mataPelajaran")
    );
    const semester = validSemester(
      bersihkan(formData.get("semester"))
    );

    const nilaiTugas = angka(formData.get("nilaiTugas"));
    const nilaiAsesmen = angka(formData.get("nilaiAsesmen"));

    const bobotTugas = bobot(formData.get("bobotTugas"), 40);
    const bobotAsesmen = bobot(formData.get("bobotAsesmen"), 60);

    const catatan = bersihkan(formData.get("catatan"));

    if (!namaSiswa || !kelas || !mataPelajaran) {
      return {
        success: false,
        message:
          "Nama siswa, kelas, dan mata pelajaran wajib diisi.",
      };
    }

    await Nilai.create({
      siswaId: siswaId || namaSiswa,
      namaSiswa,
      nis,
      kelas,
      mataPelajaran,
      semester,
      nilaiTugas,
      nilaiAsesmen,
      semesterSelesai: false,
      nilaiAkhir: 0,
      bobotTugas,
      bobotAsesmen,
      catatan,
      guru: session?.nama || "",
    });

    revalidatePath("/guru/nilai");

    return {
      success: true,
      message: "Nilai berhasil ditambahkan.",
    };
  } catch (error) {
    console.error("CREATE NILAI ERROR:", error);

    return {
      success: false,
      message: "Gagal menambahkan nilai.",
    };
  }
}

export async function updateNilai(formData: FormData) {
  try {
    await connectDB();

    const id = bersihkan(formData.get("id"));

    if (!id) {
      return {
        success: false,
        message: "ID nilai tidak ditemukan.",
      };
    }

    const data = await Nilai.findById(id);

    if (!data) {
      return {
        success: false,
        message: "Nilai tidak ditemukan.",
      };
    }

    const namaSiswa = bersihkan(formData.get("namaSiswa"));
    const nis = bersihkan(formData.get("nis"));
    const kelas = bersihkan(formData.get("kelas"));
    const mataPelajaran = bersihkan(
      formData.get("mataPelajaran")
    );
    const semester = validSemester(
      bersihkan(formData.get("semester"))
    );

    const nilaiTugas = angka(formData.get("nilaiTugas"));
    const nilaiAsesmen = angka(formData.get("nilaiAsesmen"));

    const bobotTugas = bobot(formData.get("bobotTugas"), 40);
    const bobotAsesmen = bobot(formData.get("bobotAsesmen"), 60);

    const catatan = bersihkan(formData.get("catatan"));

    if (!namaSiswa || !kelas || !mataPelajaran) {
      return {
        success: false,
        message:
          "Nama siswa, kelas, dan mata pelajaran wajib diisi.",
      };
    }

    data.namaSiswa = namaSiswa;
    data.nis = nis;
    data.kelas = kelas;
    data.mataPelajaran = mataPelajaran;
    data.semester = semester;
    data.nilaiTugas = nilaiTugas;
    data.nilaiAsesmen = nilaiAsesmen;
    data.bobotTugas = bobotTugas;
    data.bobotAsesmen = bobotAsesmen;
    data.catatan = catatan;

    // Bila semester sudah selesai, hitung ulang nilai akhir
    if (data.semesterSelesai) {
      data.nilaiAkhir = hitungNilaiAkhir(
        nilaiTugas,
        nilaiAsesmen,
        bobotTugas,
        bobotAsesmen
      );
    }

    await data.save();

    revalidatePath("/guru/nilai");

    return {
      success: true,
      message: "Nilai berhasil diperbarui.",
    };
  } catch (error) {
    console.error("UPDATE NILAI ERROR:", error);

    return {
      success: false,
      message: "Gagal memperbarui nilai.",
    };
  }
}

export async function deleteNilai(formData: FormData) {
  try {
    await connectDB();

    const id = bersihkan(formData.get("id"));

    if (!id) {
      return {
        success: false,
        message: "ID nilai tidak ditemukan.",
      };
    }

    const deleted = await Nilai.findByIdAndDelete(id);

    if (!deleted) {
      return {
        success: false,
        message: "Nilai tidak ditemukan.",
      };
    }

    revalidatePath("/guru/nilai");

    return {
      success: true,
      message: "Nilai berhasil dihapus.",
    };
  } catch (error) {
    console.error("DELETE NILAI ERROR:", error);

    return {
      success: false,
      message: "Gagal menghapus nilai.",
    };
  }
}

/**
 * Finalisasi semester: hitung nilai akhir otomatis dari
 * nilaiTugas & nilaiAsesmen untuk SEMUA data nilai pada
 * mapel/kelas/semester tertentu (atau satu id bila diberikan).
 */
export async function finalisasiSemester(formData: FormData) {
  try {
    await connectDB();

    const id = bersihkan(formData.get("id"));
    const kelas = bersihkan(formData.get("kelas"));
    const mataPelajaran = bersihkan(
      formData.get("mataPelajaran")
    );
    const semester = validSemester(
      bersihkan(formData.get("semester"))
    );

    const filter: Record<string, unknown> = {};

    if (id) {
      filter._id = id;
    } else {
      if (!kelas || !mataPelajaran) {
        return {
          success: false,
          message:
            "Kelas dan mata pelajaran wajib diisi untuk finalisasi.",
        };
      }

      filter.kelas = kelas;
      filter.mataPelajaran = mataPelajaran;
      filter.semester = semester;
    }

    const daftar = await Nilai.find(filter);

    if (daftar.length === 0) {
      return {
        success: false,
        message: "Tidak ada data nilai untuk difinalisasi.",
      };
    }

    for (const data of daftar) {
      data.semesterSelesai = true;
      data.nilaiAkhir = hitungNilaiAkhir(
        data.nilaiTugas,
        data.nilaiAsesmen,
        data.bobotTugas,
        data.bobotAsesmen
      );
      await data.save();
    }

    revalidatePath("/guru/nilai");

    return {
      success: true,
      message: `Sekolah selesai. Nilai akhir dihitung untuk ${daftar.length} siswa.`,
    };
  } catch (error) {
    console.error("FINALISASI SEMESTER ERROR:", error);

    return {
      success: false,
      message: "Gagal memfinalisasi semester.",
    };
  }
}

/**
 * Batalkan finalisasi: nilai akhir dikembalikan ke 0 dan
 * semester ditandai belum selesai (nilai dipisah kembali).
 */
export async function bukaFinalisasi(formData: FormData) {
  try {
    await connectDB();

    const id = bersihkan(formData.get("id"));

    if (!id) {
      return {
        success: false,
        message: "ID nilai tidak ditemukan.",
      };
    }

    const data = await Nilai.findById(id);

    if (!data) {
      return {
        success: false,
        message: "Nilai tidak ditemukan.",
      };
    }

    data.semesterSelesai = false;
    data.nilaiAkhir = 0;

    await data.save();

    revalidatePath("/guru/nilai");

    return {
      success: true,
      message: "Finalisasi dibuka. Nilai dipisah kembali.",
    };
  } catch (error) {
    console.error("BUKA FINALISASI ERROR:", error);

    return {
      success: false,
      message: "Gagal membuka finalisasi.",
    };
  }
}
