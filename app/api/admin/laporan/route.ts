import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb";
import Laporan from "../../../../models/Laporan";
import { getSession } from "../../../../lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || !["admin", "kurikulum", "kepala-sekolah"].includes(session.role)) {
      return NextResponse.json(
        { success: false, message: "Akses ditolak." },
        { status: 403 }
      );
    }

    await connectDB();

    const laporan = await Laporan.find({})
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      laporan: laporan.map((item) => ({
        ...item,
        _id: item._id.toString(),
      })),
    });
  } catch (error) {
    console.error("GET LAPORAN ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil data laporan.",
      },
      {
        status: 500,
      }
    );
  }
}