"use server";

import { connectDB } from "../../lib/mongodb";
import User from "../../models/User";
import Siswa from "../../models/Siswa";
import { getSession } from "../../lib/auth";

export type SiswaIdentity = {
  nama: string;
  username: string;
  /** Kunci relasi nilai / pengumpulan (id user bila ada) */
  siswaId: string;
  nis: string;
  kelas: string;
  email: string;
};

/**
 * Ambil identitas siswa yang sedang login.
 * Nama & username berasal dari sesi; nis, kelas, dan email
 * dilengkapi dari collection Siswa bila datanya tersedia.
 */
export async function getSiswaIdentity(): Promise<SiswaIdentity | null> {
  const session = await getSession();

  if (!session || session.role !== "siswa") {
    return null;
  }

  const dasar: SiswaIdentity = {
    nama: session.nama,
    username: session.username,
    siswaId: session.id || session.username,
    nis: "",
    kelas: "",
    email: "",
  };

  try {
    await connectDB();

    const user = await User.findOne({
      username: session.username,
    })
      .select("_id nama username email")
      .lean();

    if (user) {
      dasar.siswaId = user._id.toString();
      dasar.nama = user.nama || dasar.nama;
      dasar.email = user.email ?? "";
    }

    const siswa = await Siswa.findOne({
      nama: session.nama,
    })
      .select("nama nis kelas email")
      .lean();

    if (siswa) {
      dasar.nama = siswa.nama;
      dasar.nis = siswa.nis;
      dasar.kelas = siswa.kelas;
      dasar.email = siswa.email || dasar.email;
      dasar.siswaId = session.id || siswa.nis;
    }

    return dasar;
  } catch (error) {
    console.error("GET SISWA IDENTITY ERROR:", error);

    return dasar;
  }
}
