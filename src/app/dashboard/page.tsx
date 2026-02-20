import { Metadata } from "next";
import { DashboardContent } from "@/components/dashboard/dashboard-content";

export const metadata: Metadata = {
  title: "Dashboard | Wallet Service",
  description: "Ringkasan saldo dan aksi cepat dompet digital Anda.",
};

export default function DashboardPage() {
  return <DashboardContent />;
}