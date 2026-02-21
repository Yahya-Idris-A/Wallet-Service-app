"use client";

import { motion, Variants } from "framer-motion";
import { ArrowRightLeft, EyeOff, Eye, PlusCircle } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import { useState } from "react";

export function DashboardContent() {
  const user = useAuthStore((state) => state.user);
  const [showBalance, setShowBalance] = useState<boolean>(false);

  const formattedBalance = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(user?.balance || 0);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <motion.div
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold tracking-tight mb-2 text-zinc-900 dark:text-zinc-50">
          Dashboard
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          Selamat datang kembali,{" "}
          <span className="font-medium text-zinc-900 dark:text-zinc-300">
            {user?.customer_name || "Guest"}
          </span>
          . Berikut adalah ringkasan dompet digital Anda.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 gap-6">
        <motion.div variants={itemVariants}>
          <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden bg-white dark:bg-zinc-950">
            <div className="absolute top-0 right-0 p-6 opacity-5 dark:opacity-10 pointer-events-none z-0">
              <svg
                width="120"
                height="120"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="50" cy="50" r="50" fill="currentColor" />
              </svg>
            </div>
            {/* Header Card (Tombol mata dipindah dari sini) */}
            <CardHeader className="pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                Total Saldo
              </CardTitle>
            </CardHeader>
            
            {/* Konten Card */}
            <CardContent className="relative z-10">
              <div className="flex items-center gap-3">
                {/* Nominal saldo (tanpa pr-8) */}
                <div className="text-3xl tablet:text-4xl desktop:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white truncate">
                  {showBalance ? formattedBalance : "Rp •••••••"}
                </div>
                
                {/* Tombol Mata dipindah ke sini, ukuran sedikit diperbesar dan warna dipertajam */}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-9 w-9 shrink-0 rounded-full text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-zinc-800 transition-colors"
                  onClick={() => setShowBalance(!showBalance)}
                >
                  {showBalance ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div variants={itemVariants} className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Aksi Cepat
        </h2>
        <div className="flex flex-wrap gap-4">
          <Link href="/dashboard/topup">
            <Button className="h-12 px-6 bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors shadow-sm">
              <PlusCircle className="mr-2 h-5 w-5" />
              Top Up Saldo
            </Button>
          </Link>
          <Link href="/dashboard/transfer">
            <Button
              variant="outline"
              className="h-12 px-6 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors shadow-sm bg-transparent"
            >
              <ArrowRightLeft className="mr-2 h-5 w-5" />
              Transfer Dana
            </Button>
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}
