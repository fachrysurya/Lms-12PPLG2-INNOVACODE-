import { NextResponse } from "next/server";
import { getSiswaIdentity } from "../../../actions/siswaIdentity";
import { getSession } from "../../../../lib/auth";
import { connectDB } from "../../../../lib/mongodb";
import PengumpulanTugas from "../../../../models/Pengumpulan";
import Tugas from "../../../../models/Tugas";

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
        tugas: [],
        message:
          "Data kelas akun siswa belum tersedia. Hubungi administrator untuk memperbarui data kelas.",
      });
    }

    const tugas = await Tugas.find({ aktif: true, kelas })
      .sort({ createdAt: -1 })
      .select(
        "judul deskripsi mataPelajaran kelas jenis pdfUrl pdfNama linkUrl konten tenggat poin soal.pertanyaan guru createdAt"
      )
      .lean();

    const tugasIds = tugas.map((item) => item._id.toString());
    const pengumpulan = await PengumpulanTugas.find({
      siswaId: identitas.siswaId,
      tugasId: { $in: tugasIds },
    })
      .select(
        "tugasId jawaban catatan linkJawaban pdfUrl pdfNama dinilai nilai umpanBalik createdAt updatedAt"
      )
      .lean();
    const pengumpulanPerTugas = new Map(
      pengumpulan.map((item) => [item.tugasId, item])
    );

    return NextResponse.json({
      success: true,
      kelas,
      tugas: tugas.map((item) => {
        const id = item._id.toString();
        const hasil = pengumpulanPerTugas.get(id);

        return {
          _id: id,
          judul: item.judul,
          deskripsi: item.deskripsi,
          mataPelajaran: item.mataPelajaran,
          kelas: item.kelas,
          jenis: item.jenis,
          pdfUrl: item.pdfUrl,
          pdfNama: item.pdfNama,
          linkUrl: item.linkUrl,
          konten: item.konten,
          tenggat: item.tenggat,
          poin: item.poin,
          soal: (item.soal || []).map((soal) => ({
            pertanyaan: soal.pertanyaan,
          })),
          guru: item.guru,
          createdAt: item.createdAt,
          pengumpulan: hasil
            ? {
                jawaban: hasil.jawaban.map((jawaban) => ({
                  pertanyaan: jawaban.pertanyaan,
                  jawaban: jawaban.jawaban,
                })),
                catatan: hasil.catatan,
                linkJawaban: hasil.linkJawaban,
                pdfUrl: hasil.pdfUrl,
                pdfNama: hasil.pdfNama,
                dinilai: hasil.dinilai,
                nilai: hasil.nilai,
                umpanBalik: hasil.umpanBalik,
                dikumpulkanPada: hasil.updatedAt || hasil.createdAt,
              }
            : null,
        };
      }),
    });
  } catch (error) {
    console.error("GET TUGAS SISWA ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil data tugas.",
      },
      { status: 500 }
    );
  }
}
