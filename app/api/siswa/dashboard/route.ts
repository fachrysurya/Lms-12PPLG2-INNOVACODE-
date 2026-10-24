import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb";
import { getSession } from "../../../../lib/auth";
import { getSiswaIdentity } from "../../../actions/siswaIdentity";
import Asesmen from "../../../../models/Asesmen";
import HasilAsesmen from "../../../../models/HasilAsesmen";
import Materi from "../../../../models/Materi";
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

    if (!kelas || !identitas) {
      return NextResponse.json({
        success: true,
        nama: identitas?.nama || session.nama,
        kelas,
        message:
          "Data kelas akun siswa belum tersedia. Hubungi administrator untuk memperbarui data kelas.",
        ringkasan: {
          totalMateri: 0,
          totalTugas: 0,
          tugasBelumDikerjakan: 0,
          totalAsesmen: 0,
          asesmenBelumDikerjakan: 0,
          nilaiRataRata: null,
        },
        materiTerbaru: [],
        tugasAktif: [],
        asesmenAktif: [],
      });
    }

    const [materi, tugas, asesmen, pengumpulan, hasilAsesmen, nilaiTugas] =
      await Promise.all([
        Materi.find({ aktif: true, kelas })
          .sort({ createdAt: -1 })
          .limit(5)
          .select("judul mataPelajaran tipe createdAt")
          .lean(),
        Tugas.find({ aktif: true, kelas })
          .sort({ tenggat: 1, createdAt: -1 })
          .select("judul mataPelajaran tenggat")
          .lean(),
        Asesmen.find({ aktif: true, kelas })
          .sort({ createdAt: -1 })
          .select("judul mataPelajaran createdAt")
          .lean(),
        PengumpulanTugas.find({ siswaId: identitas.siswaId })
          .select("tugasId")
          .lean(),
        HasilAsesmen.find({ siswaId: identitas.siswaId })
          .select("asesmenId")
          .lean(),
        PengumpulanTugas.find({
          siswaId: identitas.siswaId,
          dinilai: true,
        })
          .select("nilai")
          .lean(),
      ]);

    const tugasSelesai = new Set(pengumpulan.map((item) => item.tugasId));
    const asesmenSelesai = new Set(
      hasilAsesmen.map((item) => item.asesmenId)
    );
    const tugasAktif = tugas.map((item) => ({
      _id: item._id.toString(),
      judul: item.judul,
      mataPelajaran: item.mataPelajaran,
      tenggat: item.tenggat || "",
      selesai: tugasSelesai.has(item._id.toString()),
    }));
    const asesmenAktif = asesmen.map((item) => ({
      _id: item._id.toString(),
      judul: item.judul,
      mataPelajaran: item.mataPelajaran,
      selesai: asesmenSelesai.has(item._id.toString()),
    }));
    const nilaiValid = nilaiTugas
      .map((item) => item.nilai)
      .filter((item) => Number.isFinite(item));

    return NextResponse.json({
      success: true,
      nama: identitas.nama,
      kelas,
      ringkasan: {
        totalMateri: await Materi.countDocuments({ aktif: true, kelas }),
        totalTugas: tugas.length,
        tugasBelumDikerjakan: tugasAktif.filter((item) => !item.selesai).length,
        totalAsesmen: asesmen.length,
        asesmenBelumDikerjakan: asesmenAktif.filter((item) => !item.selesai)
          .length,
        nilaiRataRata:
          nilaiValid.length > 0
            ? Math.round(
                (nilaiValid.reduce((total, item) => total + item, 0) /
                  nilaiValid.length) *
                  10
              ) / 10
            : null,
      },
      materiTerbaru: materi.map((item) => ({
        _id: item._id.toString(),
        judul: item.judul,
        mataPelajaran: item.mataPelajaran,
        tipe: item.tipe,
        createdAt: item.createdAt,
      })),
      tugasAktif,
      asesmenAktif,
    });
  } catch (error) {
    console.error("GET DASHBOARD SISWA ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil ringkasan dashboard siswa.",
      },
      { status: 500 }
    );
  }
}
