import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { getBosDashboardUrl } from "@/lib/bos-dashboard-config";
import { BosDashboardEmbed } from "./BosDashboardEmbed";

export const metadata: Metadata = {
  title: "BOS Dashboard",
  robots: { index: false, follow: false },
};

export default async function BosDashboardPage() {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    redirect("/admin");
  }

  return <BosDashboardEmbed url={getBosDashboardUrl()} />;
}
