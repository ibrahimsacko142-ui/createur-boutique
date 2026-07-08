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

const SITE_URL = "https://createur-boutique.vercel.app";

export const metadata: Metadata = {
  title: "Studio Créatif — Design Graphique, Sites Web & Solutions Numériques à Bamako | Sacko",
  description:
    "Studio Créatif par Sacko : votre studio créatif premium à Bamako, Mali. Design graphique professionnel, création de logos, sites web, montage vidéo, outils numériques (CapCut Pro, PicsArt Pro, IPTV Pro). Paiement Orange Money, Moov Money. Livraison rapide 24h.",
  keywords: [
    "Studio Créatif",
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
  other: {
    'google-adsense-account': 'ca-pub-5792648101445233',
  },
  openGraph: {
    title: "Studio Créatif — Design & Digital Premium à Bamako | Sacko",
    description: "Studio Créatif par Sacko — Services professionnels de design graphique, sites web, montage vidéo et outils numériques. L'excellence du design digital en Afrique.",
    locale: "fr_ML",
    type: "website",
    url: SITE_URL,
    siteName: "Studio Créatif — Sacko",
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Studio Créatif — Design Graphique & Solutions Numériques à Bamako",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Studio Créatif — Design & Digital Premium à Bamako | Sacko",
    description: "Design graphique, sites web, montage vidéo et outils numériques à Bamako, Mali.",
    images: [`${SITE_URL}/og-image.png`],
  },
  alternates: {
    canonical: SITE_URL,
  },
  robots: {
    index: true,
    follow: true,
  },
};

/* ─── JSON-LD Structured Data ─── */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LocalBusiness",
      "@id": `${SITE_URL}/#business`,
      name: "Studio Créatif — Sacko",
      description: "Studio créatif premium à Bamako, Mali. Design graphique, sites web, montage vidéo, formations et solutions numériques sur-mesure.",
      url: SITE_URL,
      telephone: "+22397787244",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Bamako",
        addressCountry: "ML",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 12.6392,
        longitude: -8.0029,
      },
      image: `${SITE_URL}/og-image.png`,
      priceRange: "$$",
      openingHoursSpecification: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "08:00",
        closes: "22:00",
      },
      sameAs: [
        "https://www.instagram.com/sk_designer_luxe",
        "https://www.facebook.com/skdesignerluxe",
        "https://www.tiktok.com/@sk_designer_luxe",
      ],
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        reviewCount: "87",
        bestRating: "5",
        worstRating: "1",
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Studio Créatif",
      publisher: { "@id": `${SITE_URL}/#business` },
      inLanguage: "fr",
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "L'Offre Découverte est-elle vraiment 100% gratuite ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Oui, totalement. C'est ma manière de vous prouver la qualité de mon travail avant que vous ne décidiez de passer à une offre Premium payante. Aucun engagement requis, aucun frais caché.",
          },
        },
        {
          "@type": "Question",
          name: "Quels sont les délais de livraison ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Les services Carrière Pro (CV, Lettres) sont livrés en moins de 24h. Pour les logos simples, comptez 48h, et pour un site web complet, entre 3 et 7 jours selon la complexité.",
          },
        },
        {
          "@type": "Question",
          name: "Puis-je demander des modifications si le résultat ne me plaît pas ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Absolument. Pour l'Offre Découverte, une révision est incluse. Pour les offres Premium, les révisions sont illimitées jusqu'à ce que le résultat vous corresponde parfaitement.",
          },
        },
        {
          "@type": "Question",
          name: "Comment se passe le paiement ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Après avoir rempli le formulaire de commande, vous êtes redirigé vers WhatsApp. Sacko reçoit votre commande instantanément et vous guide pour le paiement via Orange Money, Moov Money ou tout autre moyen.",
          },
        },
        {
          "@type": "Question",
          name: "Les formations sont-elles en ligne ou en présentiel ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Les formations sont 100% en ligne via WhatsApp et supports vidéo. Vous apprenez à votre rythme, avec un suivi personnalisé et un groupe WhatsApp pour poser vos questions.",
          },
        },
        {
          "@type": "Question",
          name: "Pourquoi limitez-vous les commandes à 5 par jour ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Je privilégie la qualité à la quantité. Travailler avec un nombre limité de clients me permet de dédier toute mon attention et mon expertise à chaque pixel de votre projet.",
          },
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5792648101445233"
          crossOrigin="anonymous"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {/* Skip to content - accessibility */}
        <a
          href="#accueil"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-amber-500 focus:text-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:shadow-lg"
        >
          Aller au contenu principal
        </a>
        {children}
        <Toaster />
      </body>
    </html>
  );
}