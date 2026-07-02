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
  title: "SK Designer Luxe — Design Graphique, Sites Web & Solutions Numériques à Bamako | Sacko",
  description:
    "SK Designer Luxe par Sacko : votre partenaire digital premium à Bamako, Mali. Design graphique professionnel, création de logos, sites web, montage vidéo, outils numériques (CapCut Pro, PicsArt Pro, IPTV Pro). Paiement Wave. Livraison rapide 24h.",
  keywords: [
    "SK Designer Luxe",
    "Sacko",
    "design Mali",
    "SK Designer",
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
    title: "SK Designer Luxe — Design & Digital Premium à Bamako | Sacko",
    description: "SK Designer Luxe par Sacko — Services professionnels de design graphique, sites web, montage vidéo et outils numériques. L'excellence du design digital en Afrique.",
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