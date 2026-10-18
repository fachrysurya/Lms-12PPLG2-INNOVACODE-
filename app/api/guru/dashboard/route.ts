import { NextResponse } from "next/server";
import { getSession } from "../../../../lib/auth";
import { connectDB } from "../../../../lib/mongodb";
import Asesmen from "../../../../models/Asesmen";
import HasilAsesmen from "../../../../models/HasilAsesmen";
import Materi from "../../../../models/Materi";
import PengumpulanTugas from "../../../../models/Pengumpulan";
import Tugas from "../../../../models/Tugas";

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

    const [tugasIds, asesmenIds] = await Promise.all([
      Tugas.find({ guru: session.nama }).distinct("_id"),
      Asesmen.find({ guru: session.nama }).distinct("_id"),
    ]);
    const [
      materi,
      tugas,
      asesmen,
      totalPengumpulan,
      totalHasilAsesmen,
      totalSoalRows,
      mapelMateri,
      mapelTugas,
      mapelAsesmen,
      tugasBerjalanRows,
    ] = await Promise.all([
        Materi.find({ guru: session.nama })
          .sort({ createdAt: -1 })
          .limit(10)
          .select("judul mataPelajaran kelas tipe aktif createdAt")
          .lean(),
        Tugas.find({ guru: session.nama })
          .sort({ createdAt: -1 })
          .limit(10)
          .select("judul mataPelajaran kelas tenggat aktif createdAt")
          .lean(),
        Asesmen.find({ guru: session.nama })
          .sort({ createdAt: -1 })
          .limit(10)
          .select("judul mataPelajaran kelas soal aktif createdAt")
          .lean(),
        PengumpulanTugas.countDocuments({
          tugasId: { $in: tugasIds.map((id) => id.toString()) },
        }),
        HasilAsesmen.countDocuments({
          asesmenId: { $in: asesmenIds.map((id) => id.toString()) },
        }),
        Asesmen.aggregate<{ _id: null; total: number }>([
          { $match: { guru: session.nama } },
          {
            $project: {
              jumlah: { $size: { $ifNull: ["$soal", []] } },
            },
          },
          { $group: { _id: null, total: { $sum: "$jumlah" } } },
        ]),
        Materi.distinct("mataPelajaran", { guru: session.nama }),
        Tugas.distinct("mataPelajaran", { guru: session.nama }),
        Asesmen.distinct("mataPelajaran", { guru: session.nama }),
        Tugas.find({ guru: session.nama, aktif: true })
          .select("tenggat")
          .lean(),
      ]);

    const mapel = new Set(
      [...mapelMateri, ...mapelTugas, ...mapelAsesmen]
        .map((item) => item.trim())
        .filter(Boolean)
    );
    const totalSoal = totalSoalRows[0]?.total || 0;
    const sekarang = Date.now();
    const tugasBerjalan = tugasBerjalanRows.filter((item) => {
      if (!item.tenggat) return true;
      const tenggat = new Date(item.tenggat).getTime();
      return !Number.isNaN(tenggat) && tenggat >= sekarang;
    }).length;

    const aktivitas = [
      ...materi.map((item) => ({
        id: `materi-${item._id.toString()}`,
        tipe: "Materi",
        judul: item.judul,
        mataPelajaran: item.mataPelajaran,
        kelas: item.kelas,
        aktif: item.aktif,
        waktu: item.createdAt,
        href: "/guru/materi",
      })),
      ...tugas.map((item) => ({
        id: `tugas-${item._id.toString()}`,
        tipe: "Tugas",
        judul: item.judul,
        mataPelajaran: item.mataPelajaran,
        kelas: item.kelas,
        aktif: item.aktif,
        waktu: item.createdAt,
        href: "/guru/tugas",
      })),
      ...asesmen.map((item) => ({
        id: `asesmen-${item._id.toString()}`,
        tipe: "Asesmen",
        judul: item.judul,
        mataPelajaran: item.mataPelajaran,
        kelas: item.kelas,
        aktif: item.aktif,
        waktu: item.createdAt,
        href: "/guru/asesmen",
      })),
    ]
      .sort(
        (a, b) =>
          new Date(b.waktu || 0).getTime() - new Date(a.waktu || 0).getTime()
      )
      .slice(0, 8);

    return NextResponse.json({
      success: true,
      nama: session.nama,
      ringkasan: {
        totalMateri: await Materi.countDocuments({ guru: session.nama }),
        totalTugas: await Tugas.countDocuments({ guru: session.nama }),
        totalAsesmen: await Asesmen.countDocuments({ guru: session.nama }),
        totalSoal,
        mataPelajaran: mapel.size,
        tugasBerjalan,
        totalPengumpulan,
        totalHasilAsesmen,
      },
      aktivitas,
    });
  } catch (error) {
    console.error("GET DASHBOARD GURU ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil data dashboard guru.",
      },
      { status: 500 }
    );
  }
}
