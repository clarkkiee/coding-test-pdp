"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Pengajuan, Status } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Card, CardContent, CardHeader, CardTitle,
} from "@/components/ui/card";

const badgeVariant: Record<Status, "secondary" | "default" | "destructive"> = {
  PENDING: "secondary",
  APPROVED: "default",
  REJECTED: "destructive",
};

export default function Home() {
  const [items, setItems] = useState<Pengajuan[]>([]);
  const [loading, setLoading] = useState(true);

  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/pengajuan")
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        setItems(data);
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  async function act(id: number, status: Status) {
    await fetch(`/api/pengajuan/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setReloadKey((k) => k + 1);
  }

  return (
    <main className="mx-auto max-w-5xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Pengajuan Kredit Kendaraan — PT. JKL</h1>
        <Link href="/new">
          <Button>+ Input Pengajuan</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Pengajuan</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Memuat…</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>NIK</TableHead>
                  <TableHead>Kendaraan</TableHead>
                  <TableHead>Harga</TableHead>
                  <TableHead>Angsuran</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground">
                      Belum ada pengajuan.
                    </TableCell>
                  </TableRow>
                )}
                {items.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>{p.id}</TableCell>
                    <TableCell>{p.nama}</TableCell>
                    <TableCell>{p.nik}</TableCell>
                    <TableCell>{p.merk} {p.model} {p.tipe}</TableCell>
                    <TableCell>{p.harga}</TableCell>
                    <TableCell>{p.angsuran}</TableCell>
                    <TableCell>
                      <Badge variant={badgeVariant[p.status]}>{p.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      {p.status === "PENDING" ? (
                        <>
                          <Button size="sm" onClick={() => act(p.id, "APPROVED")}>
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => act(p.id, "REJECTED")}
                          >
                            Reject
                          </Button>
                        </>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </main>
  );
}