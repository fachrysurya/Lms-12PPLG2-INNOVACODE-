import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb";
import Materi from "../../../../models/Materi";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();

    const materi = await Materi.find({})
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
    console.error("GET MATERI ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil data materi.",
      },
      {
        status: 500,
      }
    );
  }
}