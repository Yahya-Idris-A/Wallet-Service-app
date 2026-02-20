"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { api } from "@/services/api";
// import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Mendefinisikan interface yang ketat (tanpa 'any')
interface Transaction {
  id: string;
  transaction_type: "TOPUP" | "TRANSFER_OUT" | "TRANSFER_IN";
  amount: number;
  created_at: string;
}

export function TransactionsList() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await api.get('/api/v1/transactions?limit=10&page=1');
        // Sesuaikan mapping data dengan struktur JSON dari backend Go
        setTransactions(response.data.data || response.data);
      } catch (error) {
        console.error("Gagal mengambil data transaksi");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full"
    >
      <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold tracking-tight">Riwayat Transaksi</CardTitle>
          <CardDescription className="text-zinc-500 dark:text-zinc-400">
            Daftar semua aktivitas dana masuk dan keluar dari dompet Anda.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8 text-zinc-500">Memuat data...</div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-8 text-zinc-500">Belum ada transaksi.</div>
          ) : (
            <div className="rounded-md border border-zinc-200 dark:border-zinc-800 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-zinc-200 dark:border-zinc-800 hover:bg-transparent">
                    <TableHead className="w-25">Tanggal</TableHead>
                    <TableHead>Tipe</TableHead>
                    <TableHead className="text-right">Nominal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((tx) => (
                    <TableRow key={tx.id} className="border-zinc-200 dark:border-zinc-800">
                      <TableCell className="font-medium text-zinc-600 dark:text-zinc-400 whitespace-nowrap">
                        {new Date(tx.created_at).toLocaleDateString("id-ID", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric"
                        })}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={tx.transaction_type === "TRANSFER_OUT" ? "destructive" : "default"}
                          className={
                            tx.transaction_type === "TOPUP" || tx.transaction_type === "TRANSFER_IN" 
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-100" 
                              : ""
                          }
                        >
                          {tx.transaction_type.replace("_", " ").toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className={`text-right font-semibold ${
                        tx.transaction_type === "TRANSFER_OUT" ? "text-red-500" : "text-green-600 dark:text-green-400"
                      }`}>
                        {tx.transaction_type === "TRANSFER_OUT" ? "-" : "+"}{formatRupiah(tx.amount)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}