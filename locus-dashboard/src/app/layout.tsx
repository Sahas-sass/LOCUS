import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "LOCUS Dashboard",
  description: "Neuro-Symbolic BGP Honeynet",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex h-screen overflow-hidden antialiased">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-(--background)">
          {children}
        </main>
      </body>
    </html>
  );
}