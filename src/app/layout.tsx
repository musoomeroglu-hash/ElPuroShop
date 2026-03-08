import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: '--font-playfair'
});

const inter = Inter({
  subsets: ["latin"],
  variable: '--font-inter'
});

export const metadata: Metadata = {
  title: "El Puro Shop - Premium Puro ve Sigara",
  description: "El Puro Shop - Lüks puro, mentollü sigara, pipo ve aksesuarlar.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${inter.variable} ${playfair.variable} font-sans`}>{children}</body>
    </html>
  );
}
