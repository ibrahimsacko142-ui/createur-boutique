import type { Metadata } from 'next'
import { articles } from '@/lib/articles'
import BlogIndexClient from './BlogIndexClient'

const SITE_URL = 'https://createur-boutique.vercel.app'

export const metadata: Metadata = {
  title: 'Blog — Conseils Design & Marketing | Studio Créatif Bamako',
  description: 'Articles et conseils pratiques en design graphique, marketing digital et création web pour les entrepreneurs et créatifs au Mali. Boostez votre visibilité avec Studio Créatif.',
  openGraph: {
    title: 'Blog — Conseils Design & Marketing | Studio Créatif',
    description: 'Articles et conseils pratiques en design graphique, marketing digital et création web pour les entrepreneurs au Mali.',
    url: `${SITE_URL}/blog`,
    type: 'website',
    locale: 'fr_ML',
    siteName: 'Studio Créatif',
  },
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
}

export default function BlogIndexPage() {
  return <BlogIndexClient articles={articles} />
}