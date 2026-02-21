"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { Sun, Moon, Wallet, LogOut, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/useAuthStore";
import { api } from "@/services/api";

export function Header() {
  const { setTheme, theme } = useTheme();
  const { user, setUser, clearAuth } = useAuthStore();
  const router = useRouter();

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

    const handleLogout = async () => {
    try {
      // Hit endpoint backend agar server menghapus HttpOnly cookie
      await api.post("/api/v1/logout");
    } catch (error) {
      console.error("Gagal melakukan logout di sisi server");
    } finally {
      // Bersihkan state Zustand
      clearAuth();
      // Arahkan kembali ke halaman login
      router.push("/login");
    }
  };

  const initials = user?.customer_name
    ? user.customer_name.substring(0, 2).toUpperCase()
    : "US";

  return (
    <header className="h-16 border-b border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-md flex items-center justify-between px-4 tablet:px-8 sticky top-0 z-50">
      <div className="flex items-center gap-4 tablet:hidden">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-zinc-900 dark:bg-zinc-100 rounded-md shadow-sm">
            <Wallet className="w-4 h-4 text-white dark:text-zinc-900" />
          </div>
          <span className="text-md font-semibold tracking-tight">MyWallet</span>
        </div>
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

        {/* Pembatas vertikal */}
        <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800 hidden tablet:block" />

        {/* Dropdown Profil User */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-auto flex items-center gap-3 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 pl-2 pr-2 tablet:pr-4 transition-all">
              <Avatar className="h-8 w-8 rounded-full border border-zinc-200 dark:border-zinc-800">
                <AvatarFallback className="bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-xs font-medium">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="hidden tablet:flex flex-col items-start">
                <span className="text-sm font-medium leading-none">
                  {user?.customer_name || "Loading..."}
                </span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  Personal Account
                </span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent className="w-56 mt-2" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.customer_name}</p>
                <p className="text-xs leading-none text-zinc-500 dark:text-zinc-400 mt-1">
                  Pengguna Terverifikasi
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link href="/dashboard/profile" passHref>
              <DropdownMenuItem className="cursor-pointer">
                <UserIcon className="mr-2 h-4 w-4" />
                <span>Profil Saya</span>
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={handleLogout}
              className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:text-red-400 dark:focus:bg-red-950/30 cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}