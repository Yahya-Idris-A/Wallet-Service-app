"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { api } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/store/useAuthStore";

export function TopUpForm() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleTopUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);
    const amountStr = formData.get("amount") as string;
    const amount = parseInt(amountStr, 10);

    if (isNaN(amount) || amount <= 0) {
      setErrorMessage("Masukkan nominal top up yang valid.");
      setIsLoading(false);
      return;
    }

    try {
      // Hit endpoint top up
      await api.post('/api/v1/wallet/topup', { amount });
      
      // Ambil data terbaru agar saldo di Zustand langsung ter-update
      const userResponse = await api.get('/api/v1/wallet');
      setUser({
        customer_name: userResponse.data.customer_name,
        balance: userResponse.data.balance,
      });

      // Kembali ke dashboard
      router.push("/dashboard");
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage("Gagal melakukan top up. Pastikan server sedang berjalan.");
      } else {
        setErrorMessage("Terjadi kesalahan yang tidak terduga.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-sm tablet:max-w-md"
    >
      <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold tracking-tight">Top Up Saldo</CardTitle>
          <CardDescription className="text-zinc-500 dark:text-zinc-400">
            Masukkan nominal untuk menambah saldo dompet digital Anda.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleTopUp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Nominal Top Up (IDR)</Label>
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
              <p className="text-xs text-zinc-500">Minimal top up Rp 10.000</p>
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
                {isLoading ? "Memproses..." : "Konfirmasi Top Up"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}