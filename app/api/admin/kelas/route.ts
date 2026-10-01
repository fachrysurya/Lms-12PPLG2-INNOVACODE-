import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb";
import Kelas from "../../../../models/Kelas";

export async function GET() {
  try {
    await connectDB();

    const kelas = await Kelas.find({})
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      kelas: kelas.map((item) => ({
        ...item,
        _id: item._id.toString(),
      })),
    });
  } catch (error) {
    console.error("GET KELAS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil data kelas.",
      },
      {
        status: 500,
      }
    );
  }
}