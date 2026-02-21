"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { api } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuthStore } from "@/store/useAuthStore";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

export function TransferForm() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const currentBalance = useAuthStore((state) => state.user?.balance || 0);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // State khusus untuk User Lookup
  const [emailInput, setEmailInput] = useState<string>("");
  const [receiverName, setReceiverName] = useState<string | null>(null);
  const [isLookingUp, setIsLookingUp] = useState<boolean>(false);
  const [lookupError, setLookupError] = useState<boolean>(false);

  // Efek Debounce untuk mencari user otomatis saat berhenti mengetik
  useEffect(() => {
    const timer = setTimeout(async () => {
      console.log("debounce");

      if (emailInput.includes("@") && emailInput.length > 5) {
        setIsLookingUp(true);
        setLookupError(false);
        setReceiverName(null);

        try {
          const res = await api.get(`/api/v1/user/lookup?email=${emailInput}`);
          // Asumsi response backend: { name: "Nama User" } atau { data: { name: "Nama User" } }
          setReceiverName(res.data.name || res.data.data?.name);
        } catch (error) {
          setLookupError(true);
        } finally {
          setIsLookingUp(false);
        }
      } else {
        setReceiverName(null);
        setLookupError(false);
      }
    }, 600); // Tunggu 600ms setelah user berhenti ngetik

    return () => clearTimeout(timer);
  }, [emailInput]);

  const handleTransfer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);
    const amountStr = formData.get("amount") as string;
    const amount = parseInt(amountStr, 10);

    if (!receiverName) {
      setErrorMessage("Silakan pastikan email penerima valid terlebih dahulu.");
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
      await api.post("/api/v1/wallet/transfer", {
        receiver_email: emailInput,
        amount: amount,
      });

      // Ambil data terbaru agar saldo di Zustand langsung ter-update (berkurang)
      const userResponse = await api.get("/api/v1/wallet");
      setUser({
        customer_name: userResponse.data.customer_name,
        balance: userResponse.data.balance,
      });

      // Kembali ke dashboard
      router.push("/dashboard");
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(
          "Gagal melakukan transfer. Periksa kembali tujuan atau koneksi server.",
        );
      } else {
        setErrorMessage("Terjadi kesalahan yang tidak terduga.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const formVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
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
          <CardTitle className="text-2xl font-semibold tracking-tight">
            Transfer Dana
          </CardTitle>
          <CardDescription className="text-zinc-500 dark:text-zinc-400">
            Kirimkan uang ke pengguna lain dengan aman dan instan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleTransfer} className="space-y-4">
            <div className="space-y-2 relative">
              <Label htmlFor="receiver_email">Email Penerima</Label>
              <Input
                id="receiver_email"
                name="receiver_email"
                type="email"
                placeholder="Email penerima"
                required
                disabled={isLoading}
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="bg-white dark:bg-zinc-900"
              />
              {/* Animasi smooth untuk memunculkan nama penerima */}
              <AnimatePresence>
                {receiverName && !isLookingUp && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden relative"
                  >
                    <p className="text-sm text-green-600 dark:text-green-400 font-medium pt-1">
                      Penerima: {receiverName}
                    </p>
                    <div className="absolute right-3 top-1/2 -translate-y-1">
                      {isLookingUp && (
                        <Loader2 className="w-4 h-4 animate-spin text-zinc-400" />
                      )}
                      {!isLookingUp && receiverName && (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      )}
                      {!isLookingUp && lookupError && (
                        <XCircle className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                  </motion.div>
                )}
                {lookupError && !isLookingUp && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden relative"
                  >
                    <p className="text-sm text-red-500 pt-1">
                      Pengguna tidak ditemukan.
                    </p>
                    <div className="absolute right-3 top-1/2 -translate-y-1">
                      {isLookingUp && (
                        <Loader2 className="w-4 h-4 animate-spin text-zinc-400" />
                      )}
                      {!isLookingUp && receiverName && (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      )}
                      {!isLookingUp && lookupError && (
                        <XCircle className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
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
                Saldo Anda saat ini: Rp {currentBalance.toLocaleString("id-ID")}
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

            <div className="flex flex-col gap-3 pt-2">
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
