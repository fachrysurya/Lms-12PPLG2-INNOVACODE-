import { NextResponse } from "next/server";
import { getSession } from "../../../../../lib/auth";
import { connectDB } from "../../../../../lib/mongodb";
import PengumpulanTugas from "../../../../../models/Pengumpulan";
import Tugas from "../../../../../models/Tugas";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSession();

    if (!session || session.role !== "guru") {
      return NextResponse.json(
        {
          success: false,
          message: "Akses ditolak. Halaman ini hanya untuk guru.",
        },
        { status: 403 }
      );
    }

    await connectDB();

    const tugas = await Tugas.find({ guru: session.nama })
      .select("judul mataPelajaran kelas soal.pertanyaan soal.kunciJawaban")
      .lean();
    const tugasPerId = new Map(
      tugas.map((item) => [item._id.toString(), item])
    );
    const tugasIds = [...tugasPerId.keys()];

    const pengumpulan = tugasIds.length
      ? await PengumpulanTugas.find({ tugasId: { $in: tugasIds } })
          .sort({ updatedAt: -1, createdAt: -1 })
          .select(
            "tugasId siswaId namaSiswa kelas mataPelajaran jawaban catatan linkJawaban pdfUrl pdfNama dinilai nilai metodePenilaian umpanBalik createdAt updatedAt"
          )
          .lean()
      : [];

    return NextResponse.json({
      success: true,
      pengumpulan: pengumpulan.map((item) => {
        const tugasItem = tugasPerId.get(item.tugasId);
        const kunciJawaban = new Set(
          (tugasItem?.soal || [])
            .filter((soal) => soal.kunciJawaban.trim().length > 0)
            .map((soal) => soal.pertanyaan)
        );

        return {
          _id: item._id.toString(),
          siswaId: item.siswaId,
          namaSiswa: item.namaSiswa,
          kelas: item.kelas || tugasItem?.kelas || "",
          mataPelajaran:
            item.mataPelajaran || tugasItem?.mataPelajaran || "",
          tugasId: item.tugasId,
          judulTugas: tugasItem?.judul || "Tugas tidak tersedia",
          jawaban: item.jawaban.map((jawaban) => ({
            pertanyaan: jawaban.pertanyaan,
            jawaban: jawaban.jawaban,
          })),
          catatan: item.catatan,
          linkJawaban: item.linkJawaban,
          pdfUrl: item.pdfUrl,
          pdfNama: item.pdfNama,
          dapatDinilaiOtomatis: kunciJawaban.size > 0,
          dinilai: item.dinilai,
          nilai: item.nilai,
          metodePenilaian: item.metodePenilaian || "",
          umpanBalik: item.umpanBalik,
          dikumpulkanPada: item.createdAt,
          dinilaiPada: item.updatedAt || item.createdAt,
        };
      }),
    });
  } catch (error) {
    console.error("GET PENGUMPULAN NILAI GURU ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil pengumpulan tugas siswa.",
      },
      { status: 500 }
    );
  }
}
