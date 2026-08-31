// simulasi databse + api (untuk pengajuan kredit)

export type Status = "PENDING" | "APPROVED" | "REJECTED"

export type Pengajuan = {
  id: number
  nama: string
  nik: string
  tanggalLahir: string
  statusKawin: string
  dealer: string
  merk: string
  model: string
  tipe: string
  warna: string
  harga: string
  asuransi: string
  downPayment: string
  lamaKredit: string
  angsuran: string
  status: Status
}

// inmemory

const g = globalThis as unknown as {
  __data?: Pengajuan[];
  __nextId?: number;
};

g.__data ??= [];
g.__nextId ??= 1;

export function listPengajuan(): Pengajuan[] {
  return g.__data!;
}

export function createPengajuan(input: Omit<Pengajuan, "id" | "status">): Pengajuan {
    const p: Pengajuan = { ...input, id: g.__nextId!, status: "PENDING" }
    g.__nextId!++
    g.__data!.push(p)
    return p
}

export function setStatus(id: number, status: Status): Pengajuan | null {
    const p = g.__data!.find((x) => x.id === id)
    if (!p || p.status !== "PENDING") return null
    p.status = status
    return p
}