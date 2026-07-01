import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Créateur Boutique — Design Graphique, Sites Web & Outils Numériques à Bamako",
  description:
    "Créateur Boutique : votre partenaire digital à Bamako, Mali. Design graphique professionnel, création de logos, sites web, montage vidéo, outils numériques (CapCut Pro, PicsArt Pro, IPTV Pro). Paiement Wave. Livraison rapide 24h.",
  keywords: [
    "Créateur Boutique",
    "design graphique Bamako",
    "création de logo Mali",
    "site web Bamako",
    "montage vidéo",
    "CapCut Pro Mali",
    "PicsArt Pro",
    "IPTV Pro",
    "marketing digital Mali",
    "design professionnel",
    "Bamako",
    "Mali",
    "freelance digital",
    "formation design",
    "outils numériques",
  ],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "Créateur Boutique — Design & Digital à Bamako",
    description: "Services professionnels de design graphique, sites web, montage vidéo et outils numériques. Qualité, Créativité, Satisfaction.",
    locale: "fr_ML",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}