import { NextResponse } from "next/server";
import { getSession } from "../../../../../lib/auth";
import { connectDB } from "../../../../../lib/mongodb";
import Asesmen from "../../../../../models/Asesmen";
import HasilAsesmen from "../../../../../models/HasilAsesmen";

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

    const asesmen = await Asesmen.find({ guru: session.nama })
      .select("judul mataPelajaran kelas jenis soal.pertanyaan soal.opsi")
      .lean();
    const asesmenPerId = new Map(
      asesmen.map((item) => [item._id.toString(), item])
    );
    const asesmenIds = [...asesmenPerId.keys()];

    const hasil = asesmenIds.length
      ? await HasilAsesmen.find({ asesmenId: { $in: asesmenIds } })
          .sort({ updatedAt: -1, createdAt: -1 })
          .select(
            "asesmenId siswaId namaSiswa kelas mataPelajaran jawaban skor dinilai umpanBalik createdAt updatedAt"
          )
          .lean()
      : [];

    return NextResponse.json({
      success: true,
      hasil: hasil.map((item) => {
        const asesmenItem = asesmenPerId.get(item.asesmenId);

        return {
          _id: item._id.toString(),
          siswaId: item.siswaId,
          namaSiswa: item.namaSiswa,
          kelas: item.kelas || asesmenItem?.kelas || "",
          mataPelajaran:
            item.mataPelajaran || asesmenItem?.mataPelajaran || "",
          asesmenId: item.asesmenId,
          judulAsesmen: asesmenItem?.judul || "Asesmen tidak tersedia",
          jenis: asesmenItem?.jenis || "esai",
          soal: (asesmenItem?.soal || []).map((soal, index) => {
            const jawaban = item.jawaban[index] || "";
            const opsiIndex = Number(jawaban);

            return {
              pertanyaan: soal.pertanyaan,
              jawaban:
                asesmenItem?.jenis === "pg" &&
                Number.isInteger(opsiIndex) &&
                opsiIndex >= 0
                  ? soal.opsi[opsiIndex] || "Jawaban tidak tersedia"
                  : jawaban,
            };
          }),
          skor: item.skor,
          dinilai: item.dinilai,
          umpanBalik: item.umpanBalik,
          dikerjakanPada: item.createdAt,
          dinilaiPada: item.updatedAt || item.createdAt,
        };
      }),
    });
  } catch (error) {
    console.error("GET HASIL ASESMEN GURU ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil hasil asesmen siswa.",
      },
      { status: 500 }
    );
  }
}
