import { NextResponse } from "next/server";
import { getSession } from "../../../../lib/auth";
import { connectDB } from "../../../../lib/mongodb";
import PengumpulanTugas from "../../../../models/Pengumpulan";
import Tugas from "../../../../models/Tugas";
import { getSiswaIdentity } from "../../../actions/siswaIdentity";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSession();

    if (!session || session.role !== "siswa") {
      return NextResponse.json(
        {
          success: false,
          message: "Akses ditolak. Halaman ini hanya untuk siswa.",
        },
        { status: 403 }
      );
    }

    await connectDB();

    const identitas = await getSiswaIdentity();

    if (!identitas) {
      return NextResponse.json(
        {
          success: false,
          message: "Identitas siswa tidak ditemukan.",
        },
        { status: 403 }
      );
    }

    const pengumpulan = await PengumpulanTugas.find({
      siswaId: identitas.siswaId,
      dinilai: true,
    })
      .sort({ updatedAt: -1, createdAt: -1 })
      .select("tugasId mataPelajaran nilai umpanBalik updatedAt createdAt")
      .lean();

    const tugasIds = [...new Set(pengumpulan.map((item) => item.tugasId))];
    const tugas = await Tugas.find({ _id: { $in: tugasIds } })
      .select("judul")
      .lean();
    const tugasPerId = new Map(
      tugas.map((item) => [item._id.toString(), item.judul])
    );

    return NextResponse.json({
      success: true,
      nilai: pengumpulan.map((item) => ({
        tugasId: item.tugasId,
        judulTugas: tugasPerId.get(item.tugasId) || "Tugas tidak tersedia",
        mataPelajaran: item.mataPelajaran,
        nilai: item.nilai,
        umpanBalik: item.umpanBalik,
        dinilaiPada: item.updatedAt || item.createdAt,
      })),
    });
  } catch (error) {
    console.error("GET NILAI SISWA ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil data nilai tugas.",
      },
      { status: 500 }
    );
  }
}
