import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb";
import Tugas from "../../../../models/Tugas";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();

    const tugas = await Tugas.find({})
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      tugas: tugas.map((item) => ({
        ...item,
        _id: item._id.toString(),
      })),
    });
  } catch (error) {
    console.error("GET TUGAS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil data tugas.",
      },
      {
        status: 500,
      }
    );
  }
}