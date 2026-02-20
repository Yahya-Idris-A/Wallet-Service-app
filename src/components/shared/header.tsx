"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/useAuthStore";
import { api } from "@/services/api";

export function Header() {
  const { setTheme, theme } = useTheme();
  const { user, setUser } = useAuthStore();

  useEffect(() => {
    // Re-fetch data jika user me-refresh halaman dan state Zustand hilang
    const fetchUser = async () => {
      if (!user) {
        try {
          const response = await api.get('/api/v1/wallet');
          setUser({
            customer_name: response.data.customer_name,
            balance: response.data.balance,
          });
        } catch (error) {
          console.error("Gagal mengambil data user");
        }
      }
    };
    fetchUser();
  }, [user, setUser]);

  const initials = user?.customer_name
    ? user.customer_name.substring(0, 2).toUpperCase()
    : "US";

  return (
    <header className="h-16 border-b border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-md flex items-center justify-between px-4 tablet:px-8 sticky top-0 z-50">
      <div className="flex items-center gap-4 tablet:hidden">
        {/* Placeholder untuk Mobile Sidebar Toggle */}
        <Button variant="ghost" size="icon">
          <Menu className="w-5 h-5" />
        </Button>
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>

        <div className="flex items-center gap-3 border-l border-zinc-200 dark:border-zinc-800 pl-4">
          <div className="flex flex-col items-end">
            <span className="text-sm font-medium leading-none">
              {user?.customer_name || "Loading..."}
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Personal Account
            </span>
          </div>
          <Avatar className="h-8 w-8 rounded-md">
            <AvatarFallback className="bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 rounded-md text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}