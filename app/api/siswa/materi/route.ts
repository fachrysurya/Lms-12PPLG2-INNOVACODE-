import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb";
import Materi from "../../../../models/Materi";
import { getSession } from "../../../../lib/auth";

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

    const materi = await Materi.find({ aktif: true })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
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
