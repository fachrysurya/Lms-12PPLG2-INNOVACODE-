import { NextResponse } from "next/server";
import { getSession } from "../../../../lib/auth";
import { connectDB } from "../../../../lib/mongodb";
import Asesmen from "../../../../models/Asesmen";
import Guru from "../../../../models/Guru";
import Kelas from "../../../../models/Kelas";
import MataPelajaran from "../../../../models/MataPelajaran";
import Materi from "../../../../models/Materi";
import Siswa from "../../../../models/Siswa";
import Tugas from "../../../../models/Tugas";
import User from "../../../../models/User";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSession();

    if (!session || session.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Akses ditolak." },
        { status: 403 }
      );
    }

    await connectDB();

    const [
      totalSiswa,
      siswaAktif,
      totalGuru,
      guruAktif,
      totalKelas,
      kelasAktif,
      totalMapel,
      mapelAktif,
      totalUser,
      userAktif,
      akunSiswa,
      akunGuru,
      akunAdmin,
      materiAktif,
      tugasAktif,
      asesmenAktif,
      penggunaTerbaru,
    ] = await Promise.all([
      Siswa.countDocuments(),
      Siswa.countDocuments({ aktif: true }),
      Guru.countDocuments(),
      Guru.countDocuments({ aktif: true }),
      Kelas.countDocuments(),
      Kelas.countDocuments({ aktif: true }),
      MataPelajaran.countDocuments(),
      MataPelajaran.countDocuments({ aktif: true }),
      User.countDocuments(),
      User.countDocuments({ aktif: true }),
      User.countDocuments({ role: "siswa" }),
      User.countDocuments({ role: "guru" }),
      User.countDocuments({ role: "admin" }),
      Materi.countDocuments({ aktif: true }),
      Tugas.countDocuments({ aktif: true }),
      Asesmen.countDocuments({ aktif: true }),
      User.find({})
        .select("nama username role aktif createdAt")
        .sort({ createdAt: -1, _id: -1 })
        .limit(12)
        .lean(),
    ]);

    return NextResponse.json({
      success: true,
      statistik: {
        totalSiswa,
        siswaAktif,
        totalGuru,
        guruAktif,
        totalKelas,
        kelasAktif,
        totalMapel,
        mapelAktif,
        totalUser,
        userAktif,
        akunSiswa,
        akunGuru,
        akunAdmin,
        materiAktif,
        tugasAktif,
        asesmenAktif,
      },
      penggunaTerbaru: penggunaTerbaru.map((user) => ({
        _id: user._id.toString(),
        nama: user.nama,
        username: user.username,
        role: user.role,
        aktif: user.aktif,
        createdAt: user.createdAt,
      })),
    });
  } catch (error) {
    console.error("GET DASHBOARD ADMIN ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil data dashboard admin.",
      },
      { status: 500 }
    );
  }
}
