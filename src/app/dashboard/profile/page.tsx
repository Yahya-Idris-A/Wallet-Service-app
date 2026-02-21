import { Metadata } from "next";
import { ProfileContent } from "@/components/dashboard/profile-content";

export const metadata: Metadata = {
  title: "Profil Saya | Wallet Service",
  description: "Kelola informasi akun dompet digital Anda.",
};

export default function ProfilePage() {
  return (
    <div className="pt-4 tablet:pt-8">
      <ProfileContent />
    </div>
  );
}