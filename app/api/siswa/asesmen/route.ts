import { NextResponse } from "next/server";
import { getSession } from "../../../../lib/auth";
import { connectDB } from "../../../../lib/mongodb";
import Asesmen from "../../../../models/Asesmen";
import HasilAsesmen from "../../../../models/HasilAsesmen";
import { getSiswaIdentity } from "../../../actions/siswaIdentity";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSession();

    if (!session || session.role !== "siswa") {
      return NextResponse.json(
        {
          success: false,
          message: "Akses ditolak. Halaman ini hanya untuk siswa.",
        },
        { status: 403 }
      );
    }

    await connectDB();

    const identitas = await getSiswaIdentity();
    const kelas = identitas?.kelas.trim() || "";

    if (!identitas || !kelas) {
      return NextResponse.json({
        success: true,
        kelas,
        asesmen: [],
        message:
          "Data kelas akun siswa belum tersedia. Hubungi administrator untuk memperbarui data kelas.",
      });
    }

    const asesmen = await Asesmen.find({ aktif: true, kelas })
      .sort({ createdAt: -1 })
      .select("judul deskripsi mataPelajaran kelas jenis durasi poin soal.pertanyaan soal.opsi guru createdAt")
      .lean();

    const asesmenIds = asesmen.map((item) => item._id.toString());
    const hasilAsesmen = await HasilAsesmen.find({
      siswaId: identitas.siswaId,
      asesmenId: { $in: asesmenIds },
    })
      .select("asesmenId jawaban createdAt")
      .lean();
    const hasilPerAsesmen = new Map(
      hasilAsesmen.map((hasil) => [hasil.asesmenId, hasil])
    );

    return NextResponse.json({
      success: true,
      kelas,
      asesmen: asesmen.map((item) => {
        const id = item._id.toString();
        const hasil = hasilPerAsesmen.get(id);

        return {
          _id: id,
          judul: item.judul,
          deskripsi: item.deskripsi,
          mataPelajaran: item.mataPelajaran,
          kelas: item.kelas,
          jenis: item.jenis,
          durasi: item.durasi,
          poin: item.poin,
          soal: (item.soal || []).map((soal) => ({
            pertanyaan: soal.pertanyaan,
            opsi: soal.opsi,
          })),
          guru: item.guru,
          createdAt: item.createdAt,
          hasil: hasil
            ? {
                jawaban: hasil.jawaban,
                dikerjakanPada: hasil.createdAt,
              }
            : null,
        };
      }),
    });
  } catch (error) {
    console.error("GET ASESMEN SISWA ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil data asesmen.",
      },
      { status: 500 }
    );
  }
}
