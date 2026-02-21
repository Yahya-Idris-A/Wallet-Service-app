"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { api } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";

export function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      await api.post('/api/v1/register', { name, email, password });
      
      // Setelah berhasil register, arahkan ke halaman login
      router.push("/login?registered=true");
    } catch (error) {
      setErrorMessage("Registrasi gagal. Email mungkin sudah digunakan atau server sedang bermasalah.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-sm tablet:max-w-md desktop:max-w-lg"
    >
      <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-semibold tracking-tight">Buat Akun Baru</CardTitle>
          <CardDescription className="text-zinc-500 dark:text-zinc-400">
            Daftarkan diri Anda untuk mulai menggunakan layanan dompet digital.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Lengkap</Label>
              <Input 
                id="name" 
                name="name" 
                type="text" 
                placeholder="John Doe" 
                required 
                disabled={isLoading}
                className="bg-white dark:bg-zinc-900"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                placeholder="nama@perusahaan.com" 
                required 
                disabled={isLoading}
                className="bg-white dark:bg-zinc-900"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                name="password" 
                type="password" 
                required 
                disabled={isLoading}
                className="bg-white dark:bg-zinc-900"
              />
            </div>
            
            {errorMessage && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-red-500 text-center">
                {errorMessage}
              </motion.p>
            )}

            <Button 
              type="submit" 
              className="w-full bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors mt-2"
              disabled={isLoading}
            >
              {isLoading ? "Membuat akun..." : "Daftar"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t border-zinc-100 dark:border-zinc-800/50 pt-4">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Sudah punya akun?{" "}
            <Link href="/login" className="font-medium text-zinc-900 hover:underline dark:text-zinc-50 transition-all">
              Masuk di sini
            </Link>
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  );
}