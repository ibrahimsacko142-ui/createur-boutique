import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { articles, getArticleBySlug, getAllSlugs } from '@/lib/articles'
import ArticlePageClient from './ArticlePageClient'

const SITE_URL = 'https://createur-boutique.vercel.app'

export async function generateStaticParams() {
  return getAllSlugs().map(slug => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const article = getArticleBySlug(slug)
  if (!article) return {}

  return {
    title: `${article.title} — Studio Créatif`,
    description: article.description,
    keywords: [article.category, 'Bamako', 'Mali', 'Studio Créatif', article.title],
    openGraph: {
      title: article.title,
      description: article.description,
      url: `${SITE_URL}/blog/${slug}`,
      type: 'article',
      locale: 'fr_ML',
      publishedTime: article.date,
      authors: ['Sacko'],
      siteName: 'Studio Créatif',
    },
    alternates: {
      canonical: `${SITE_URL}/blog/${slug}`,
    },
  }
}

export default async function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = getArticleBySlug(slug)
  if (!article) notFound()

  const relatedArticles = articles.filter(a => a.slug !== slug).slice(0, 3)

  return <ArticlePageClient article={article} relatedArticles={relatedArticles} />
}