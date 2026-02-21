"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, ArrowRightLeft, PlusCircle, History } from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { name: "Home", href: "/dashboard", icon: Home },
  { name: "Transfer", href: "/dashboard/transfer", icon: ArrowRightLeft },
  { name: "Top Up", href: "/dashboard/topup", icon: PlusCircle },
  { name: "History", href: "/dashboard/transactions", icon: History },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="tablet:hidden fixed bottom-0 left-0 right-0 z-50">
      {/* Area aman untuk perangkat iOS yang memiliki garis Home di bawah (safe-area) */}
      <div className="bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-t border-zinc-200 dark:border-zinc-800 flex justify-around items-center h-16 px-2 pb-safe">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link 
              key={item.name} 
              href={item.href} 
              className="flex-1 flex flex-col items-center justify-center h-full relative"
            >
              <div
                className={cn(
                  "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors duration-200",
                  isActive
                    ? "text-zinc-900 dark:text-zinc-50"
                    : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                )}
              >
                <Icon className="w-5 h-5 z-10" />
                <span className="text-[10px] font-medium z-10">{item.name}</span>
                
                {/* Indikator aktif di bagian atas icon (Apple Style) */}
                {isActive && (
                  <motion.div
                    layoutId="bottom-nav-indicator"
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.75 bg-zinc-900 dark:bg-zinc-50 rounded-b-full z-0"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}