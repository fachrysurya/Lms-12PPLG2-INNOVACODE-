import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb";
import Laporan from "../../../../models/Laporan";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
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