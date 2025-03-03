import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Layout from "../components/Layout/Layout";
// Уведомления
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chess.skibidi",
  description: "Лютые скибиди шахматы",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Layout>
          {children}
          <ToastContainer />
        </Layout>
        
      </body>
    </html>
  );
}
