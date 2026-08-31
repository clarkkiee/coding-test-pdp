import { NextRequest, NextResponse } from "next/server";
import { listPengajuan, createPengajuan } from "@/lib/store";

export async function GET() {
    return NextResponse.json(listPengajuan())
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const p = createPengajuan({
    nama: body.nama ?? "",
    nik: body.nik ?? "",
    tanggalLahir: body.tanggalLahir ?? "",
    statusKawin: body.statusKawin ?? "",
    dealer: body.dealer ?? "",
    merk: body.merk ?? "",
    model: body.model ?? "",
    tipe: body.tipe ?? "",
    warna: body.warna ?? "",
    harga: body.harga ?? "",
    asuransi: body.asuransi ?? "",
    downPayment: body.downPayment ?? "",
    lamaKredit: body.lamaKredit ?? "",
    angsuran: body.angsuran ?? "",
  });
  return NextResponse.json(p, { status: 201 });
}