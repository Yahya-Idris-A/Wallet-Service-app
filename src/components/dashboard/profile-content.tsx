"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Mail, ShieldCheck, KeyRound } from "lucide-react";
import { api } from "@/services/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface UserProfile {
  id: number;
  name: string;
  email: string;
  // Tambahkan field lain jika ada dari backend (misal: created_at)
}

export function ProfileContent() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await api.get('/api/v1/user');
        // Sesuaikan jika data dibungkus dalam properti 'data' (misal: response.data.data)
        setProfile(response.data);
      } catch (error) {
        console.error("Gagal mengambil data profil");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const initials = profile?.name ? profile.name.substring(0, 2).toUpperCase() : "US";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2 text-zinc-900 dark:text-zinc-50">
          Profil Saya
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          Kelola informasi pribadi dan keamanan akun Anda.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Kartu Informasi Utama */}
        <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
          <CardHeader className="bg-zinc-50/50 dark:bg-zinc-900/20 border-b border-zinc-100 dark:border-zinc-800 pb-8">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20 border-2 border-white dark:border-zinc-950 shadow-md">
                <AvatarFallback className="bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-2xl font-medium">
                  {isLoading ? "..." : initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{isLoading ? "Memuat..." : profile?.name}</CardTitle>
                <CardDescription className="flex items-center gap-1.5 mt-1.5 text-zinc-500">
                  <ShieldCheck className="w-4 h-4 text-green-500" />
                  Akun Terverifikasi
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-md">
                    <Mail className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Alamat Email</p>
                    <p className="text-sm text-zinc-500">{isLoading ? "Memuat..." : profile?.email}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" disabled>Terkunci</Button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-md">
                    <KeyRound className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Password</p>
                    {/* <p className="text-sm text-zinc-500">Terakhir diubah beberapa hari yang lalu</p> */}
                  </div>
                </div>
                {/* <Button variant="outline" size="sm">Ubah</Button> */}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}