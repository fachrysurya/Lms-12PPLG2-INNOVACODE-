import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb";
import Siswa from "../../../../models/Siswa";

export async function GET() {
  try {
    await connectDB();

    const siswa = await Siswa.find({})
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      siswa: siswa.map((item) => ({
        ...item,
        _id: item._id.toString(),
      })),
    });
  } catch (error) {
    console.error("GET DATA SISWA ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil data siswa.",
      },
      {
        status: 500,
      }
    );
  }
}
