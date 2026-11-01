import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb";
import Kelas from "../../../../models/Kelas";
import Siswa from "../../../../models/Siswa";

export async function GET() {
  try {
    await connectDB();

    const kelas = await Kelas.find({})
      .sort({ createdAt: -1 })
      .lean();

    const kelasDenganJumlah = await Promise.all(
      kelas.map(async (item) => ({
        ...item,
        _id: item._id.toString(),
        jumlahSiswa: await Siswa.countDocuments({ kelas: item.namaKelas }),
      }))
    );

    return NextResponse.json({
      success: true,
      kelas: kelasDenganJumlah,
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