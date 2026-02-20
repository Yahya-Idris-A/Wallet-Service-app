"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Wallet } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { api } from "@/services/api";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isInitialized, setInitialized, setAuth, clearAuth } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();
  
  // State untuk menahan loading screen saat Next.js memproses perpindahan halaman
  const [isRouting, setIsRouting] = useState(false);
  
  // useRef mencegah useEffect melakukan double-hit ke API saat StrictMode aktif
  const initRef = useRef(false);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    const initAuth = async () => {
      try {
        const refreshResponse = await api.post('/api/v1/refresh');
        const token = refreshResponse.data.access_token;
        useAuthStore.getState().setAccessToken(token);

        const userResponse = await api.get('/api/v1/wallet');
        setAuth(
          {
            customer_name: userResponse.data.customer_name,
            balance: userResponse.data.balance,
          },
          token
        );

        // Jika silent refresh sukses DAN kita sedang di halaman login/root
        if (pathname.startsWith('/login') || pathname === '/') {
          setIsRouting(true); // TAHAN loading screen
          router.replace('/dashboard'); // Gunakan replace agar riwayat back rapi
        }
      } catch (error) {
        clearAuth();
      } finally {
        // Apapun hasilnya, tandai inisialisasi selesai
        setInitialized(true);
      }
    };

    if (!isInitialized) {
      initAuth();
    }
  }, [isInitialized, pathname, router, setAuth, clearAuth, setInitialized]);

  // Effect kedua: Mematikan penahan loading HANYA setelah rute URL benar-benar berubah
  useEffect(() => {
    if (isRouting && pathname.startsWith('/dashboard')) {
      setIsRouting(false);
    }
  }, [pathname, isRouting]);

  // Tampilkan loading screen jika belum inisialisasi ATAU sedang proses redirect
  if (!isInitialized || isRouting) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="p-4 bg-zinc-900 dark:bg-zinc-100 rounded-2xl mb-4 shadow-sm"
        >
          <Wallet className="w-8 h-8 text-white dark:text-zinc-900" />
        </motion.div>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium animate-pulse">
          Menyiapkan ruang kerja Anda...
        </p>
      </div>
    );
  }

  return <>{children}</>;
}