"use client";

import { usePathname } from "next/navigation";
import Header from "./header";
import Footer from "./footer";
import FloatingWhatsApp from "./floating-whatsapp";

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <Header />}
      {children}
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <FloatingWhatsApp />}
    </>
  );
}
