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
    "Studio Créatif par Sacko à Bamako, Mali. Création de logo professionnel à 5 000 FCFA, site web, flyer, affiche, montage vidéo. Livraison 24h, paiement Orange Money & Wave. Premier logo offert. Designer graphique N°1 au Mali.",
  keywords: [
    "création logo Bamako",
    "création logo Mali",
    "designer graphique Bamako",
    "designer graphique Mali",
    "site web Bamako",
    "site web Mali",
    "création site web Bamako",
    "flyer Bamako",
    "affiche Bamako",
    "montage vidéo Bamako",
    "montage vidéo Mali",
    "logo professionnel Mali",
    "logo pas cher Bamako",
    "design graphique Mali",
    "marketing digital Bamako",
    "identité visuelle Bamako",
    "SK Designer",
    "Sacko designer",
    "Studio Créatif Bamako",
    "création de contenu Bamako",
    "formation design Bamako",
    "CapCut Pro Mali",
    "PicsArt Pro Mali",
    "Orange Money paiement",
    "Wave paiement Mali",
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
      alternateName: "SK Designer Luxe",
      description: "Studio créatif premium à Bamako, Mali. Design graphique, sites web, montage vidéo, formations et solutions numériques sur-mesure. Paiement Orange Money & Moov Money.",
      url: SITE_URL,
      telephone: "+22397787244",
      email: "contact@createurboutique.com",
      image: `${SITE_URL}/og-image.png`,
      logo: `${SITE_URL}/og-image.png`,
      priceRange: "5 000 FCFA - 150 000 FCFA",
      currenciesAccepted: "XOF",
      paymentAccepted: "Mobile Money, Espèces, Virement",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Bamako",
        addressLocality: "Bamako",
        addressRegion: "District de Bamako",
        postalCode: "Bamako",
        addressCountry: "ML",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 12.6392,
        longitude: -8.0029,
      },
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "08:00",
          closes: "22:00",
        },
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Saturday"],
          opens: "09:00",
          closes: "20:00",
        },
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Sunday"],
          opens: "10:00",
          closes: "18:00",
        },
      ],
      areaServed: [
        { "@type": "City", name: "Bamako" },
        { "@type": "AdministrativeArea", name: "District de Bamako" },
        { "@type": "Country", name: "Mali" },
      ],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Services Studio Créatif",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Création de Logo",
              description: "Logo professionnel sur mesure pour entreprises et marques à Bamako",
            },
            priceSpecification: {
              "@type": "PriceSpecification",
              price: "5000",
              priceCurrency: "XOF",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Design Graphique",
              description: "Identité visuelle complète : affiches, flyers, cartes de visite, bannières",
            },
            priceSpecification: {
              "@type": "PriceSpecification",
              price: "10000",
              priceCurrency: "XOF",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Création de Site Web",
              description: "Sites vitrines, e-commerce et landing pages optimisés SEO",
            },
            priceSpecification: {
              "@type": "PriceSpecification",
              price: "50000",
              priceCurrency: "XOF",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Montage Vidéo",
              description: "Clips musicaux, publicités TikTok, reels Instagram, vidéos promotionnelles",
            },
            priceSpecification: {
              "@type": "PriceSpecification",
              price: "15000",
              priceCurrency: "XOF",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Formation Design Graphique",
              description: "Formation pratique en ligne : Canva, Photoshop, branding",
            },
            priceSpecification: {
              "@type": "PriceSpecification",
              price: "0",
              priceCurrency: "XOF",
            },
          },
        ],
      },
      sameAs: [
        "https://www.instagram.com/sk_designer_luxe",
        "https://www.facebook.com/skdesignerluxe",
        "https://www.tiktok.com/@sk_designer_luxe",
      ],
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        bestRating: "5",
        worstRating: "1",
        ratingCount: "87",
        reviewCount: "87",
      },
      review: [
        {
          "@type": "Review",
          author: { "@type": "Person", name: "Amadou D." },
          datePublished: "2025-06-25",
          reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
          reviewBody: "Excellent travail ! Sacko a créé le logo de mon restaurant en 48h. Le résultat dépasse mes attentes. Je recommande vivement pour tout projet de design à Bamako.",
          publisher: { "@type": "Organization", name: "Google" },
        },
        {
          "@type": "Review",
          author: { "@type": "Person", name: "Fatoumata T." },
          datePublished: "2025-06-10",
          reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
          reviewBody: "La formation design est incroyable. En 3 semaines je crée mes propres visuels pour ma boutique. Le suivi WhatsApp est top, toujours disponible pour répondre.",
          publisher: { "@type": "Organization", name: "Facebook" },
        },
        {
          "@type": "Review",
          author: { "@type": "Person", name: "Ibrahim K." },
          datePublished: "2025-06-18",
          reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
          reviewBody: "Mon site web est maintenant premier sur Google pour 'boutique tissus Bamako'. Le SEO est vraiment efficace.",
          publisher: { "@type": "Organization", name: "Google" },
        },
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Studio Créatif",
      publisher: { "@id": `${SITE_URL}/#business` },
      inLanguage: "fr",
      potentialAction: {
        "@type": "SearchAction",
        target: `${SITE_URL}/?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
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
            text: "Après avoir rempli le formulaire de commande, vous pouvez payer par Orange Money, Moov Money ou espèces. Sacko reçoit votre commande instantanément et vous guide pour le paiement.",
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
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Accueil", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Services", item: `${SITE_URL}/#services` },
        { "@type": "ListItem", position: 3, name: "Contact", item: `${SITE_URL}/#contact` },
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
        {/* ═══ Google AdSense ═══ */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5792648101445233"
          crossOrigin="anonymous"
        />

        {/* ═══ PropellerAds - Popunder ═══ */}
        <script
          async
          src="https://pl30316030.effectivecpmnetwork.com/bf/f3/d4/bff3d45803026d7e91fca0ab68237c39.js"
        />
        {/* ═══ PropellerAds - Social Bar ═══ */}
        <script
          async
          src="https://pl30316034.effectivecpmnetwork.com/63/e4/56/63e4569ad5164536f78deac227dc0aa7.js"
        />

        {/* ═══ Adsterra - Bibliothèque ═══ */}
        <script async src="//adsterra.com/adProvider/ad.js"></script>

        {/* ═══ HilltopAds - Popunder ═══ */}
        <script async src="https://hilltopads.net/pb.js?pub=PLACEHOLDER_HILLTOP"></script>

        {/* ═══ PopAds - Popunder ═══ */}
        <script type="application/javascript" dangerouslySetInnerHTML={{ __html: `var ad_idzone = "PLACEHOLDER_POPADS_ZONE"; var ad_popup_fallback = false; var ad_popup_force = false; var ad_new_tab = false; var ad_frequency_period = 300; var ad_frequency_count = 1; var ad_trigger_method = 1; var ad_tags = ["PTC","Mali","Afrique"];` }} />
        <script async src="//ads.popads.net/pop.js" />

        {/* ═══ RichPops - Popunder ═══ */}
        <script async src="https://richpops.com/pb.js?pub=PLACEHOLDER_RICHPOPS"></script>
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