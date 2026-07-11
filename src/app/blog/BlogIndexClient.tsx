'use client'

import { motion } from 'framer-motion'
import { Clock, ArrowRight, BookOpen, MessageCircle, Search } from 'lucide-react'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AdBanner from '@/components/AdBanner'
import type { ArticleData } from '@/lib/articles'

const WHATSAPP_NUMBER = '22397787244'

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
}

export default function BlogIndexClient({ articles }: { articles: ArticleData[] }) {
  const [search, setSearch] = useState('')

  const filtered = search.trim()
    ? articles.filter(
        a =>
          a.title.toLowerCase().includes(search.toLowerCase()) ||
          a.description.toLowerCase().includes(search.toLowerCase()) ||
          a.category.toLowerCase().includes(search.toLowerCase())
      )
    : articles

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-amber-950/20 dark:via-orange-950/10 dark:to-red-950/20">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-orange-400/10 rounded-full blur-3xl" />
          </div>
          <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-100 dark:bg-amber-900/20 px-4 py-1.5 mb-6">
                <BookOpen className="h-4 w-4 text-amber-500" />
                <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">Blog & Actualités</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
                Conseils en{' '}
                <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 bg-clip-text text-transparent">
                  Design & Marketing
                </span>
              </h1>
              <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
                Astuces pratiques pour les entrepreneurs et créatifs au Mali. Boostez votre visibilité et votre business.
              </p>

              {/* Search */}
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un article..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-10 h-11 rounded-full border-amber-500/20 focus:border-amber-500"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Top ad */}
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 mt-8">
          <AdBanner />
        </div>

        {/* Articles grid */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">Aucun article trouvé pour « {search} »</p>
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filtered.map((article, i) => (
                <motion.div key={article.slug} variants={cardVariants}>
                  <a
                    href={`/blog/${article.slug}`}
                    className="group relative flex flex-col rounded-2xl border border-border/60 bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/5 hover:border-amber-500/20 hover:-translate-y-1 overflow-hidden h-full"
                  >
                    <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${article.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                    <div className={`absolute -top-20 -right-20 h-40 w-40 rounded-full bg-gradient-to-br ${article.gradient} opacity-0 group-hover:opacity-[0.04] blur-3xl transition-opacity duration-500 pointer-events-none`} />

                    <div className="flex items-center justify-between mb-4">
                      <Badge variant="secondary" className={`gap-1.5 px-2.5 py-1 text-[11px] font-semibold rounded-full ${article.iconBg} border-0`}>
                        {article.category}
                      </Badge>
                      <span className="text-[11px] text-muted-foreground font-medium">{article.date}</span>
                    </div>

                    <h3 className="text-base font-bold leading-snug text-foreground mb-3 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-2 flex-1">
                      {article.title}
                    </h3>

                    <p className="text-sm text-muted-foreground leading-relaxed mb-5 line-clamp-3">
                      {article.description}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-border/40 mt-auto">
                      <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {article.readingTime}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400 group-hover:gap-2 transition-all">
                        Lire
                        <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </a>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Mid-section ad */}
          <div className="my-10">
            <AdBanner />
          </div>
        </section>

        {/* CTA */}
        <section className="border-t bg-muted/20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 text-center">
            <h2 className="text-2xl font-bold mb-4">
              Besoin d&apos;aide pour votre projet ?
            </h2>
            <p className="text-muted-foreground mb-8">
              Discutez directement avec Sacko sur WhatsApp. Réponse rapide, 7j/7.
            </p>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Bonjour Sacko ! J'ai lu vos articles et j'aimerais discuter de mon projet.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-105 transition-all"
            >
              <MessageCircle className="h-5 w-5" />
              Contacter sur WhatsApp
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}