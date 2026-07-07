import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Arcant — Discord Bot & Custom AI",
  description: "Gérez vos serveurs Discord, construisez des communautés de A à Z avec une IA sur mesure et protégez vos membres grâce aux outils de sécurité avancés d'Arcant.",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

import { NextAuthProvider } from "@/components/providers/SessionProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <NextAuthProvider>{children}</NextAuthProvider>
      </body>
    </html>
  );
}
