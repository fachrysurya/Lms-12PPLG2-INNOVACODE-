import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb";
import Guru from "../../../../models/Guru";

export async function GET() {
  try {
    await connectDB();

    const guru = await Guru.find({})
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      guru: guru.map((item) => ({
        ...item,
        _id: item._id.toString(),
      })),
    });
  } catch (error) {
    console.error("GET DATA GURU ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil data guru.",
      },
      {
        status: 500,
      }
    );
  }
}