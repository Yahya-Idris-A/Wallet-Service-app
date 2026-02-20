import { Metadata } from "next";
import { TransferForm } from "@/components/dashboard/transfer-form";

export const metadata: Metadata = {
  title: "Transfer | Wallet Service",
  description: "Kirim dana ke pengguna Wallet Service lainnya.",
};

export default function TransferPage() {
  return (
    <div className="flex flex-col items-center justify-center pt-10">
      <TransferForm />
    </div>
  );
}