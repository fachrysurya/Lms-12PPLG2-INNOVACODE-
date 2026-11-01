import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb";
import Jadwal from "../../../../models/Jadwal";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();
    const jadwal = await Jadwal.find({}).sort({ hari: 1, jamMulai: 1 }).lean();
    return NextResponse.json({ success: true, jadwal: jadwal.map((item) => ({ ...item, _id: item._id.toString() })) });
  } catch (error) {
    console.error("GET JADWAL ERROR:", error);
    return NextResponse.json({ success: false, message: "Gagal mengambil jadwal pelajaran." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    if (!body.hari || !body.jamMulai || !body.jamSelesai || !body.kelas || !body.mataPelajaran || !body.guru || !body.ruang) {
      return NextResponse.json({ success: false, message: "Semua kolom jadwal wajib diisi." }, { status: 400 });
    }
    const jadwal = await Jadwal.create({ ...body, aktif: body.aktif ?? true });
    return NextResponse.json({ success: true, message: "Jadwal berhasil ditambahkan.", jadwal }, { status: 201 });
  } catch (error) {
    console.error("POST JADWAL ERROR:", error);
    return NextResponse.json({ success: false, message: "Gagal menambahkan jadwal pelajaran." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    if (!body.id) return NextResponse.json({ success: false, message: "ID jadwal wajib diisi." }, { status: 400 });
    await Jadwal.findByIdAndUpdate(body.id, { $set: { hari: body.hari, jamMulai: body.jamMulai, jamSelesai: body.jamSelesai, kelas: body.kelas, mataPelajaran: body.mataPelajaran, guru: body.guru, ruang: body.ruang, aktif: body.aktif } });
    return NextResponse.json({ success: true, message: "Jadwal berhasil diperbarui." });
  } catch (error) {
    console.error("PUT JADWAL ERROR:", error);
    return NextResponse.json({ success: false, message: "Gagal memperbarui jadwal pelajaran." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await connectDB();
    const { id } = await request.json();
    if (!id) return NextResponse.json({ success: false, message: "ID jadwal wajib diisi." }, { status: 400 });
    await Jadwal.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Jadwal berhasil dihapus." });
  } catch (error) {
    console.error("DELETE JADWAL ERROR:", error);
    return NextResponse.json({ success: false, message: "Gagal menghapus jadwal pelajaran." }, { status: 500 });
  }
}
