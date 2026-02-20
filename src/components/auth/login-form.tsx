"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
// Gunakan relative path jika @/lib/api masih error
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
import { Checkbox } from "@/components/ui/checkbox";
import { useAuthStore } from "@/store/useAuthStore";
import Cookies from "js-cookie";

export function LoginForm() {
  const router = useRouter();
  const setIsAuthenticated = useAuthStore((state) => state.setAuth);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    // Menggunakan FormData adalah cara paling bersih dan aman di React
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const remember_me = formData.get("remember_me") === "on";

    try {
      const response = await api.post("/api/v1/login", {
        email,
        password,
        remember_me,
      });

      // Ekstrak access_token dari response backend Go
      const { access_token } = response.data;

      useAuthStore.getState().setAccessToken(access_token);

      const userResponse = await api.get("/api/v1/wallet");

      setIsAuthenticated(
        {
          customer_name: userResponse.data.customer_name,
          balance: userResponse.data.balance,
        },
        access_token,
      );

      router.push("/dashboard");
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage("Login gagal. Periksa kembali kredensial Anda.");
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
      className="w-full max-w-sm tablet:max-w-md desktop:max-w-lg"
    >
      <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-semibold tracking-tight">
            Welcome back
          </CardTitle>
          <CardDescription className="text-zinc-500 dark:text-zinc-400">
            Masukkan kredensial Anda untuk mengakses dompet digital
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email" /* Atribut name wajib ditambahkan untuk FormData */
                type="email"
                placeholder="nama@perusahaan.com"
                required
                disabled={isLoading}
                className="bg-white dark:bg-zinc-900"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                id="password"
                name="password" /* Atribut name wajib ditambahkan untuk FormData */
                type="password"
                required
                disabled={isLoading}
                className="bg-white dark:bg-zinc-900"
              />
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox
                id="remember_me"
                name="remember_me"
                className="border-zinc-300 dark:border-zinc-700"
              />
              <Label
                htmlFor="remember_me"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-zinc-600 dark:text-zinc-400"
              >
                Remember me
              </Label>
            </div>

            {errorMessage && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-red-500 text-center"
              >
                {errorMessage}
              </motion.p>
            )}

            <Button
              type="submit"
              className="w-full bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
