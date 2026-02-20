import { Metadata } from "next";
import { TransactionsList } from "@/components/dashboard/transactions-list";

export const metadata: Metadata = {
  title: "Transaksi | Wallet Service",
  description: "Lihat riwayat transaksi dompet digital Anda.",
};

export default function TransactionsPage() {
  return (
    <div className="pt-4 tablet:pt-8">
      <TransactionsList />
    </div>
  );
}