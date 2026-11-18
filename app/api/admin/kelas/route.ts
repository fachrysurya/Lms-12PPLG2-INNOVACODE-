import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb";
import Kelas from "../../../../models/Kelas";
import Siswa from "../../../../models/Siswa";
import User from "../../../../models/User";

export async function GET(request: Request) {
  try {
    await connectDB();

    const searchParams = new URL(request.url).searchParams;
    const jurusan = searchParams.get("jurusan")?.trim();
    const tingkat = searchParams.get("tingkat")?.trim();
    const kelasId = searchParams.get("kelasId");

    if (jurusan && tingkat) {
      const kelasDipilih = await Kelas.find({ jurusan, tingkat })
        .select("namaKelas")
        .lean();
      const namaKelas = kelasDipilih.map((item) => item.namaKelas);

      if (namaKelas.length === 0) {
        return NextResponse.json({ success: true, siswa: [] });
      }

      const [akunSiswa, dataSiswa] = await Promise.all([
        User.find({
          role: "siswa",
          jurusan,
          kelas: { $in: namaKelas },
        })
          .select("nama")
          .lean(),
        Siswa.find({ kelas: { $in: namaKelas } })
          .select("nama")
          .lean(),
      ]);

      const siswa = Array.from(
        new Set(
          [...akunSiswa, ...dataSiswa]
            .map((item) => item.nama.trim())
            .filter(Boolean)
        )
      ).sort((a, b) => a.localeCompare(b, "id"));

      return NextResponse.json({ success: true, siswa });
    }

    if (kelasId) {
      const kelasDipilih = await Kelas.findById(kelasId).lean();

      if (!kelasDipilih) {
        return NextResponse.json(
          {
            success: false,
            message: "Data kelas tidak ditemukan.",
          },
          { status: 404 }
        );
      }

      const [akunSiswa, dataSiswa] = await Promise.all([
        User.find({
          role: "siswa",
          kelas: kelasDipilih.namaKelas,
          jurusan: kelasDipilih.jurusan,
        })
          .select("nama")
          .lean(),
        Siswa.find({ kelas: kelasDipilih.namaKelas })
          .select("nama")
          .lean(),
      ]);

      const siswa = Array.from(
        new Set(
          [...akunSiswa, ...dataSiswa]
            .map((item) => item.nama.trim())
            .filter(Boolean)
        )
      ).sort((a, b) => a.localeCompare(b, "id"));

      return NextResponse.json({ success: true, siswa });
    }

    const [kelas, akunSiswa, dataSiswa] = await Promise.all([
      Kelas.find({}).sort({ createdAt: -1 }).lean(),
      User.find({ role: "siswa" }).select("nama kelas jurusan").lean(),
      Siswa.find({}).select("nama kelas").lean(),
    ]);

    const kelasDenganJumlah = await Promise.all(
      kelas.map((item) => {
        const namaSiswa = new Set(
          [
            ...akunSiswa
              .filter(
                (siswa) =>
                  siswa.kelas === item.namaKelas &&
                  siswa.jurusan === item.jurusan
              )
              .map((siswa) => siswa.nama),
            ...dataSiswa
              .filter((siswa) => siswa.kelas === item.namaKelas)
              .map((siswa) => siswa.nama),
          ]
            .map((nama) => nama.trim())
            .filter(Boolean)
        );

        return {
          ...item,
          _id: item._id.toString(),
          jumlahSiswa: namaSiswa.size,
        };
      })
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