import { redirect } from "next/navigation";

export default function Home() {
  // Langsung arahkan pengunjung rute "/" ke halaman "/login"
  redirect("/login");
}