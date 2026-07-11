'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, Clock, Calendar, MessageCircle, ArrowRight, Share2, Palette, TrendingUp, GraduationCap, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AdBanner from '@/components/AdBanner'
import type { ArticleData } from '@/lib/articles'

const WHATSAPP_NUMBER = '22397787244'

const categoryIcons: Record<string, React.ReactNode> = {
  Design: <Palette className="h-4 w-4" />,
  Marketing: <TrendingUp className="h-4 w-4" />,
  Formation: <GraduationCap className="h-4 w-4" />,
  Web: <Globe className="h-4 w-4" />,
}

function shareArticle(article: ArticleData) {
  if (typeof navigator === 'undefined') return
  const url = window.location.href
  if (navigator.share) {
    navigator.share({ title: article.title, text: article.description, url })
  } else {
    navigator.clipboard.writeText(url)
  }
}

export default function ArticlePageClient({
  article,
  relatedArticles,
}: {
  article: ArticleData
  relatedArticles: ArticleData[]
}) {
  const whatsappMsg = encodeURIComponent(
    `Bonjour Sacko ! J'ai lu votre article "${article.title}" et j'aimerais en savoir plus sur vos services.`
  )

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero header */}
        <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-amber-950/20 dark:via-orange-950/10 dark:to-red-950/20">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-400/10 rounded-full blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
            <motion.a
              href="/blog"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-amber-600 transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour au blog
            </motion.a>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Badge variant="secondary" className={`gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full mb-5 border-0 ${article.iconBg}`}>
                {categoryIcons[article.category] || <Globe className="h-4 w-4" />}
                {article.category}
              </Badge>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-tight mb-6">
                {article.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {article.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {article.readingTime}
                </span>
                <span className="font-medium text-foreground">Par Sacko — Studio Créatif</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Ad: banner + interstitial (only loads once) */}
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 mt-6">
          <AdBanner />
        </div>

        {/* Article content */}
        <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="prose prose-lg dark:prose-invert max-w-none
              prose-headings:font-bold prose-headings:tracking-tight
              prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
              prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
              prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-5
              prose-a:text-amber-600 dark:prose-a:text-amber-400
              prose-strong:text-foreground
              prose-li:text-muted-foreground
              [&>h2]:text-foreground [&>h2]:bg-gradient-to-r [&>h2]:from-amber-500 [&>h2]:to-orange-500 [&>h2]:bg-clip-text [&>h2]:text-transparent
            "
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Mid-article ad */}
          <div className="my-10">
            <AdBanner />
          </div>

          {/* Share + CTA */}
          <div className="mt-12 pt-8 border-t border-border/60">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <Button variant="outline" onClick={() => shareArticle(article)} className="gap-2">
                <Share2 className="h-4 w-4" />
                Partager l&apos;article
              </Button>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-105 transition-all"
              >
                <MessageCircle className="h-4 w-4" />
                En discuter sur WhatsApp
              </a>
            </div>
          </div>

          {/* Bottom ad */}
          <div className="mt-10">
            <AdBanner />
          </div>
        </section>

        {/* Related articles */}
        {relatedArticles.length > 0 && (
          <section className="border-t bg-muted/20">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
              <h2 className="text-2xl font-bold mb-8">
                Articles{' '}
                <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">recommandés</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedArticles.map((related) => (
                  <a
                    key={related.slug}
                    href={`/blog/${related.slug}`}
                    className="group rounded-xl border border-border/60 bg-card p-5 shadow-sm hover:shadow-lg hover:border-amber-500/20 transition-all hover:-translate-y-1"
                  >
                    <Badge variant="secondary" className={`gap-1.5 px-2 py-0.5 text-[11px] font-semibold rounded-full mb-3 border-0 ${related.iconBg}`}>
                      {related.category}
                    </Badge>
                    <h3 className="font-bold text-sm leading-snug mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-2">
                      {related.title}
                    </h3>
                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{related.readingTime}</span>
                      <span>{related.date}</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}