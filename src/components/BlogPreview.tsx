'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Clock, ArrowRight, BookOpen, MessageCircle, TrendingUp, Palette, GraduationCap } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const WHATSAPP_NUMBER = '22397787244'

interface Article {
  id: number
  category: string
  categoryIcon: React.ReactNode
  title: string
  excerpt: string
  readingTime: string
  date: string
  whatsappMessage: string
  gradient: string
  iconBg: string
}

const articles: Article[] = [
  {
    id: 1,
    category: 'Design',
    categoryIcon: <Palette className="h-3 w-3" />,
    title: '5 erreurs à éviter quand vous créez votre premier logo',
    excerpt:
      'Votre logo est le visage de votre marque. Découvrez les pièges les plus courants que commettent les entrepreneurs maliens — de la surcharge visuelle au choix des polices — et comment les éviter pour un logo professionnel et mémorable.',
    readingTime: '3 min de lecture',
    date: '10 Juil 2026',
    whatsappMessage:
      'Bonjour Sacko ! J\'ai lu votre article "5 erreurs à éviter quand vous créez votre premier logo" et j\'aimerais en savoir plus sur vos services de création de logo.',
    gradient: 'from-amber-500 to-orange-500',
    iconBg: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
  },
  {
    id: 2,
    category: 'Marketing',
    categoryIcon: <TrendingUp className="h-3 w-3" />,
    title: 'Comment obtenir vos premiers clients sur WhatsApp en 2026',
    excerpt:
      'WhatsApp n\'est pas qu\'un outil de discussion — c\'est une machine à clients. Apprenez les stratégies concrètes pour transformer votre statut, vos listes de diffusion et vos messages en un véritable canal de vente au Mali.',
    readingTime: '4 min de lecture',
    date: '5 Juil 2026',
    whatsappMessage:
      'Bonjour Sacko ! Votre article sur les clients WhatsApp m\'intéresse beaucoup. Pouvez-vous m\'aider à développer ma stratégie marketing ?',
    gradient: 'from-emerald-500 to-teal-500',
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
  },
  {
    id: 3,
    category: 'Formation',
    categoryIcon: <GraduationCap className="h-3 w-3" />,
    title: 'Pourquoi chaque entrepreneur bamakoïen devrait apprendre le design',
    excerpt:
      'Le design n\'est pas un luxe — c\'est une compétence stratégique. Que vous gérez un restaurant à Badalabougou ou une boutique en ligne, savoir créer visuellement vous fait économiser des millions de FCFA et vous démarque de la concurrence.',
    readingTime: '5 min de lecture',
    date: '28 Juin 2026',
    whatsappMessage:
      'Bonjour Sacko ! J\'ai lu l\'article sur l\'apprentissage du design pour les entrepreneurs. J\'aimerais m\'inscrire à votre formation.',
    gradient: 'from-orange-500 to-red-500',
    iconBg: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
  },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

const headingVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

function ArticleCard({ article, index }: { article: Article; index: number }) {
  const encodedMessage = encodeURIComponent(article.whatsappMessage)
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      variants={cardVariants}
      className="group relative flex flex-col rounded-2xl border border-border/60 bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/5 hover:border-amber-500/20 hover:-translate-y-1 overflow-hidden"
    >
      {/* Hover gradient accent line at top */}
      <div
        className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${article.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
      />

      {/* Subtle gradient glow on hover */}
      <div
        className={`absolute -top-20 -right-20 h-40 w-40 rounded-full bg-gradient-to-br ${article.gradient} opacity-0 group-hover:opacity-[0.04] blur-3xl transition-opacity duration-500 pointer-events-none`}
      />

      {/* Category badge + date row */}
      <div className="flex items-center justify-between mb-4">
        <Badge
          variant="secondary"
          className={`gap-1.5 px-2.5 py-1 text-[11px] font-semibold rounded-full ${article.iconBg} border-0`}
        >
          {article.categoryIcon}
          {article.category}
        </Badge>
        <span className="text-[11px] text-muted-foreground font-medium">
          {article.date}
        </span>
      </div>

      {/* Article title */}
      <h3 className="text-base font-bold leading-snug text-foreground mb-3 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors duration-200 line-clamp-2">
        {article.title}
      </h3>

      {/* Excerpt */}
      <p className="text-sm text-muted-foreground leading-relaxed mb-5 line-clamp-3 flex-1">
        {article.excerpt}
      </p>

      {/* Footer: reading time + CTA */}
      <div className="flex items-center justify-between pt-4 border-t border-border/40">
        <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <Clock className="h-3 w-3" />
          {article.readingTime}
        </span>
        <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 group-hover:gap-2 transition-all duration-200">
          <MessageCircle className="h-3.5 w-3.5" />
          En discuter
          <ArrowRight className="h-3 w-3" />
        </span>
      </div>
    </motion.a>
  )
}

export default function BlogPreview() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px 0px' })

  return (
    <section
      id="blog"
      ref={sectionRef}
      className="relative py-20 sm:py-24 overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-amber-500/[0.03] blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-orange-500/[0.03] blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          className="text-center max-w-2xl mx-auto mb-14"
          variants={headingVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-50 dark:bg-amber-900/20 px-4 py-1.5 mb-5">
            <BookOpen className="h-4 w-4 text-amber-500" />
            <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
              Blog & Actualités
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Actualités &{' '}
            <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 bg-clip-text text-transparent">
              Conseils
            </span>
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
            Astuces pratiques en design et marketing digital pour les entrepreneurs et créatifs au Mali.
            Boostez votre visibilité, chaque semaine.
          </p>
        </motion.div>

        {/* Articles grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {articles.map((article, index) => (
            <ArticleCard key={article.id} article={article} index={index} />
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.6, ease: 'easeOut' }}
        >
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
              'Bonjour Sacko ! J\'aimerais suivre vos publications et conseils en design et marketing.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-105 transition-all duration-200"
          >
            <MessageCircle className="h-4 w-4" />
            Suivre nos publications
          </a>
          <p className="text-xs text-muted-foreground mt-3">
            Recevez nos conseils directement sur WhatsApp
          </p>
        </motion.div>
      </div>
    </section>
  )
}