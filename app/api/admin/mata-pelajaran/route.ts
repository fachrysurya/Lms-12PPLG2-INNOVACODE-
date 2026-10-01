import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import MataPelajaran from "@/models/MataPelajaran";

// GET - mengambil semua mata pelajaran
export async function GET() {
  try {
    await connectDB();

    const data = await MataPelajaran.find().sort({
      createdAt: -1,
    });

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("GET Mata Pelajaran Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil data mata pelajaran",
      },
      { status: 500 }
    );
  }
}

// POST - menambah mata pelajaran
export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();

    const {
      namaMapel,
      kodeMapel,
      kelompok,
      guruPengampu,
      aktif,
    } = body;

    if (
      !namaMapel ||
      !kodeMapel ||
      !kelompok ||
      !guruPengampu
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Semua data wajib diisi",
        },
        { status: 400 }
      );
    }

    const existing = await MataPelajaran.findOne({
      kodeMapel: kodeMapel.toUpperCase(),
    });

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          message: "Kode mata pelajaran sudah digunakan",
        },
        { status: 400 }
      );
    }

    const data = await MataPelajaran.create({
      namaMapel,
      kodeMapel,
      kelompok,
      guruPengampu,
      aktif: aktif ?? true,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Mata pelajaran berhasil ditambahkan",
        data,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST Mata Pelajaran Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal menambahkan mata pelajaran",
      },
      { status: 500 }
    );
  }
}

// PUT - mengubah mata pelajaran
export async function PUT(request: Request) {
  try {
    await connectDB();

    const body = await request.json();

    const {
      id,
      namaMapel,
      kodeMapel,
      kelompok,
      guruPengampu,
      aktif,
    } = body;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "ID mata pelajaran wajib diisi",
        },
        { status: 400 }
      );
    }

    if (
      !namaMapel ||
      !kodeMapel ||
      !kelompok ||
      !guruPengampu
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Semua data wajib diisi",
        },
        { status: 400 }
      );
    }

    const existing = await MataPelajaran.findOne({
      kodeMapel: kodeMapel.toUpperCase(),
      _id: { $ne: id },
    });

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          message: "Kode mata pelajaran sudah digunakan",
        },
        { status: 400 }
      );
    }

    const data = await MataPelajaran.findByIdAndUpdate(
      id,
      {
        namaMapel,
        kodeMapel,
        kelompok,
        guruPengampu,
        aktif: aktif ?? true,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!data) {
      return NextResponse.json(
        {
          success: false,
          message: "Mata pelajaran tidak ditemukan",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Mata pelajaran berhasil diperbarui",
      data,
    });
  } catch (error) {
    console.error("PUT Mata Pelajaran Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal memperbarui mata pelajaran",
      },
      { status: 500 }
    );
  }
}

// DELETE - menghapus mata pelajaran
export async function DELETE(request: Request) {
  try {
    await connectDB();

    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "ID mata pelajaran wajib diisi",
        },
        { status: 400 }
      );
    }

    const data = await MataPelajaran.findByIdAndDelete(id);

    if (!data) {
      return NextResponse.json(
        {
          success: false,
          message: "Mata pelajaran tidak ditemukan",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Mata pelajaran berhasil dihapus",
    });
  } catch (error) {
    console.error("DELETE Mata Pelajaran Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal menghapus mata pelajaran",
      },
      { status: 500 }
    );
  }
}