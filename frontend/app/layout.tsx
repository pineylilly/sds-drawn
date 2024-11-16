"use client";

import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { useEffect } from "react";
import { UserProvider } from "@/lib/hooks/UserContext";
import { Toaster } from "@/components/ui/toaster";
import { StorageProvider } from "@/lib/hooks/StorageContext";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// export const metadata: Metadata = {
//   title: "Drawn",
//   description: "Collaboration Web App",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  useEffect(() => {
    window.document.title = "Drawn"
  }, [])

  return (
    <html lang="en">
      <UserProvider>
        <StorageProvider>
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            {children}
            <Toaster />
          </body>
        </StorageProvider>
      </UserProvider>
    </html>
  );
}
