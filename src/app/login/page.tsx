import { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Sign In | Wallet Service",
  description: "Masuk ke akun Wallet Service Anda untuk mengelola keuangan digital dengan aman dan mudah.",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
      <LoginForm />
    </div>
  );
}