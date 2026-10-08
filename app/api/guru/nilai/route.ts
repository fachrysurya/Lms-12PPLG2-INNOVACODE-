import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb";
import Nilai from "../../../../models/Nilai";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();

    const nilai = await Nilai.find({})
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      nilai: nilai.map((item) => ({
        ...item,
        _id: item._id.toString(),
      })),
    });
  } catch (error) {
    console.error("GET NILAI ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil data nilai.",
      },
      {
        status: 500,
      }
    );
  }
}
