import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AuthProvider from "@/components/providers/AuthProvider";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Hưng Badminton | Cửa Hàng Vợt & Dụng Cụ Cầu Lông Chuyên Nghiệp",
  description:
    "Hệ sinh thái cầu lông cao cấp: Vợt thi đấu, giày bám sân, cước chuyên dụng và phụ kiện chính hãng Yonex, Victor, Li-Ning, Mizuno. Tư vấn chọn vợt chuẩn trình độ.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={inter.variable}>
      <body className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased selection:bg-red-500 selection:text-white flex flex-col">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster position="top-right" richColors />
        </AuthProvider>
      </body>
    </html>
  );
}