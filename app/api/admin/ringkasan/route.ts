import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb";

import User from "../../../../models/User";
import Siswa from "../../../../models/Siswa";
import Guru from "../../../../models/Guru";
import Kelas from "../../../../models/Kelas";
import MataPelajaran from "../../../../models/MataPelajaran";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();

    const [
      totalSiswa,
      totalGuru,
      totalKelas,
      totalMapel,
      totalUser,
    ] = await Promise.all([
      Siswa.countDocuments(),
      Guru.countDocuments(),
      Kelas.countDocuments(),
      MataPelajaran.countDocuments(),
      User.countDocuments(),
    ]);

    return NextResponse.json({
      success: true,
      ringkasan: {
        totalSiswa,
        totalGuru,
        totalKelas,
        totalMapel,
        totalUser,
      },
    });
  } catch (error) {
    console.error("GET RINGKASAN ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil ringkasan data.",
      },
      {
        status: 500,
      }
    );
  }
}