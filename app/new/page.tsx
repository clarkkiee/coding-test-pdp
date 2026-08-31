"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card, CardContent, CardHeader, CardTitle,
} from "@/components/ui/card";

const fields = {
  konsumen: [
    ["nama", "Nama"],
    ["nik", "NIK"],
    ["tanggalLahir", "Tanggal Lahir"],
    ["statusKawin", "Status Perkawinan"],
  ],
  kendaraan: [
    ["dealer", "Dealer"],
    ["merk", "Merk"],
    ["model", "Model"],
    ["tipe", "Tipe"],
    ["warna", "Warna"],
    ["harga", "Harga"],
  ],
  pinjaman: [
    ["asuransi", "Asuransi"],
    ["downPayment", "Down Payment"],
    ["lamaKredit", "Lama Kredit (bulan)"],
    ["angsuran", "Angsuran / bulan"],
  ],
} as const;

function Section({
  title,
  keys,
  form,
  onChange,
}: {
  title: string;
  keys: readonly (readonly [string, string])[];
  form: Record<string, string>;
  onChange: (name: string, value: string) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        {keys.map(([name, label]) => (
          <div key={name} className="space-y-1">
            <Label htmlFor={name}>{label}</Label>
            <Input
              id={name}
              type={name === "tanggalLahir" ? "date" : "text"}
              value={form[name] ?? ""}
              onChange={(e) => onChange(name, e.target.value)}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default function NewPengajuan() {
  const router = useRouter();
  const [form, setForm] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  function set(name: string, value: string) {
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function submit() {
    setSaving(true);
    await fetch("/api/pengajuan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    router.push("/");
  }

  return (
    <main className="mx-auto max-w-3xl p-6 space-y-6">
      <h1 className="text-2xl font-bold">Input Pengajuan</h1>
      <Section title="Data Konsumen" keys={fields.konsumen} form={form} onChange={set} />
      <Section title="Data Kendaraan" keys={fields.kendaraan} form={form} onChange={set} />
      <Section title="Data Pinjaman" keys={fields.pinjaman} form={form} onChange={set} />
      <div className="flex gap-2">
        <Button onClick={submit} disabled={saving}>
          {saving ? "Menyimpan…" : "Submit Pengajuan"}
        </Button>
        <Button variant="outline" onClick={() => router.push("/")}>
          Batal
        </Button>
      </div>
    </main>
  );
}