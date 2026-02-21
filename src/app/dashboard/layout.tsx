import { Metadata } from "next";
import { Sidebar } from "@/components/shared/sidebar";
import { Header } from "@/components/shared/header";
import { BottomNav } from "@/components/shared/bottom-nav";

export const metadata: Metadata = {
  title: "Dashboard | Wallet Service",
  description: "Kelola saldo dan transaksi Anda.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 pb-20 tablet:pb-0">
        <Header />
        <main className="flex-1 p-4 tablet:p-8 desktop:p-10 overflow-y-auto">
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}