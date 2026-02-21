"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Home,
  ArrowRightLeft,
  PlusCircle,
  History,
  Wallet,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import Cookies from "js-cookie";
import { api } from "@/services/api";

const menuItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Transfer", href: "/dashboard/transfer", icon: ArrowRightLeft },
  { name: "Top Up", href: "/dashboard/topup", icon: PlusCircle },
  { name: "Transactions", href: "/dashboard/transactions", icon: History },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const handleLogout = async () => {
    try {
      // Hit endpoint backend agar server menghapus HttpOnly cookie
      await api.post("/api/v1/logout");
    } catch (error) {
      console.error("Gagal melakukan logout di sisi server");
    } finally {
      // Hapus access token dan flag sesi di sisi klien
      Cookies.remove("access_token");

      // Bersihkan state Zustand
      clearAuth();

      // Arahkan kembali ke halaman login
      router.push("/login");
    }
  };

  return (
    <aside className="hidden tablet:flex flex-col w-64 border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 min-h-screen p-4">
      <div className="flex items-center gap-2 px-2 mb-8">
        <div className="p-2 bg-zinc-900 dark:bg-zinc-100 rounded-lg">
          <Wallet className="w-5 h-5 text-white dark:text-zinc-900" />
        </div>
        <span className="text-lg font-semibold tracking-tight">MyWallet</span>
      </div>

      <nav className="flex flex-col gap-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link key={item.name} href={item.href}>
              <div
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 relative group",
                  isActive
                    ? "text-zinc-900 dark:text-zinc-50"
                    : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50",
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active-indicator"
                    className="absolute inset-0 bg-zinc-200/50 dark:bg-zinc-800/50 rounded-md z-0"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon className="w-4 h-4 z-10" />
                <span className="text-sm font-medium z-10">{item.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto pt-4 border-t border-zinc-200 dark:border-zinc-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 w-full rounded-md transition-all duration-200 text-zinc-500 hover:text-red-600 hover:bg-red-50 dark:text-zinc-400 dark:hover:text-red-400 dark:hover:bg-red-950/30"
        >
          <LogOut className="w-4 h-4 z-10" />
          <span className="text-sm font-medium z-10">Log Out</span>
        </button>
      </div>
    </aside>
  );
}
