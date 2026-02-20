import { Metadata } from "next";
import { TopUpForm } from "@/components/dashboard/topup-form";

export const metadata: Metadata = {
  title: "Top Up | Wallet Service",
  description: "Tambah saldo dompet digital Anda.",
};

export default function TopUpPage() {
  return (
    <div className="flex flex-col items-center justify-center pt-10">
      <TopUpForm />
    </div>
  );
}