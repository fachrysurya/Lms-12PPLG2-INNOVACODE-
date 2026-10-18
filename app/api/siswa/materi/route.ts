import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb";
import Materi from "../../../../models/Materi";
import { getSession } from "../../../../lib/auth";
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

    const kelas = identitas?.kelas.trim() || "";

    if (!kelas) {
      return NextResponse.json({
        success: true,
        kelas: "",
        materi: [],
        message:
          "Data kelas akun siswa belum tersedia. Hubungi administrator untuk memperbarui data kelas.",
      });
    }

    const materi = await Materi.find({ aktif: true, kelas })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      kelas,
      materi: materi.map((item) => ({
        ...item,
        _id: item._id.toString(),
      })),
    });
  } catch (error) {
    console.error("GET MATERI SISWA ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil data materi.",
      },
      { status: 500 }
    );
  }
}
