import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb";
import Asesmen from "../../../../models/Asesmen";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();

    const asesmen = await Asesmen.find({})
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      asesmen: asesmen.map((item) => ({
        ...item,
        _id: item._id.toString(),
      })),
    });
  } catch (error) {
    console.error("GET ASESMEN ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil data asesmen.",
      },
      {
        status: 500,
      }
    );
  }
}