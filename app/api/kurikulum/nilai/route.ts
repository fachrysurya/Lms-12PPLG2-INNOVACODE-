import { NextResponse } from "next/server";
import { getSession } from "../../../../lib/auth";
import { connectDB } from "../../../../lib/mongodb";
import Nilai from "../../../../models/Nilai";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();

  if (!session || session.role !== "kurikulum") {
    return NextResponse.json(
      { success: false, message: "Akses ditolak." },
      { status: 403 }
    );
  }

  try {
    await connectDB();
    const nilai = await Nilai.find({}).sort({ kelas: 1, namaSiswa: 1 }).lean();

    return NextResponse.json({
      success: true,
      nilai: nilai.map((item) => ({
        ...item,
        _id: item._id.toString(),
      })),
    });
  } catch (error) {
    console.error("GET LAPORAN AKADEMIK ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengambil laporan nilai." },
      { status: 500 }
    );
  }
}
