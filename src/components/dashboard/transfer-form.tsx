"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, Variants } from "framer-motion";
import { api } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/store/useAuthStore";

export function TransferForm() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const currentBalance = useAuthStore((state) => state.user?.balance || 0);
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleTransfer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);
    const destination = formData.get("destination") as string;
    const amountStr = formData.get("amount") as string;
    const amount = parseInt(amountStr, 10);

    // Validasi dasar di sisi frontend
    if (!destination) {
      setErrorMessage("Tujuan transfer tidak boleh kosong.");
      setIsLoading(false);
      return;
    }

    if (isNaN(amount) || amount <= 0) {
      setErrorMessage("Masukkan nominal transfer yang valid.");
      setIsLoading(false);
      return;
    }

    if (amount > currentBalance) {
      setErrorMessage("Saldo Anda tidak mencukupi untuk transfer ini.");
      setIsLoading(false);
      return;
    }

    try {
      // Hit endpoint transfer (sesuaikan key payload dengan backend Go kamu)
      await api.post('/api/v1/wallet/transfer', { 
        destination: destination, 
        amount: amount 
      });
      
      // Ambil data terbaru agar saldo di Zustand langsung ter-update (berkurang)
      const userResponse = await api.get('/api/v1/wallet');
      setUser({
        customer_name: userResponse.data.customer_name,
        balance: userResponse.data.balance,
      });

      // Kembali ke dashboard
      router.push("/dashboard");
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage("Gagal melakukan transfer. Periksa kembali tujuan atau koneksi server.");
      } else {
        setErrorMessage("Terjadi kesalahan yang tidak terduga.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const formVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <motion.div
      variants={formVariants}
      initial="hidden"
      animate="show"
      className="w-full max-w-sm tablet:max-w-md"
    >
      <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold tracking-tight">Transfer Dana</CardTitle>
          <CardDescription className="text-zinc-500 dark:text-zinc-400">
            Kirimkan uang ke pengguna lain dengan aman dan instan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleTransfer} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="destination">Tujuan Transfer</Label>
              <Input 
                id="destination" 
                name="destination" 
                type="text" 
                placeholder="Nama Pengguna atau ID" 
                required 
                disabled={isLoading}
                className="bg-white dark:bg-zinc-900"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Nominal Transfer (IDR)</Label>
              <Input 
                id="amount" 
                name="amount" 
                type="number" 
                min="10000"
                step="1000"
                placeholder="Contoh: 50000" 
                required 
                disabled={isLoading}
                className="bg-white dark:bg-zinc-900"
              />
              <p className="text-xs text-zinc-500">
                Saldo Anda saat ini: Rp {currentBalance.toLocaleString('id-ID')}
              </p>
            </div>
            
            {errorMessage && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-red-500"
              >
                {errorMessage}
              </motion.p>
            )}

            <div className="flex gap-3 pt-2">
              <Button 
                type="button" 
                variant="outline"
                className="w-full"
                onClick={() => router.push("/dashboard")}
                disabled={isLoading}
              >
                Batal
              </Button>
              <Button 
                type="submit" 
                className="w-full bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors"
                disabled={isLoading}
              >
                {isLoading ? "Memproses..." : "Kirim Dana"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}