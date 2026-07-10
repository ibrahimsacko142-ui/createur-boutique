'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Play, Clock, MessageCircle, Film } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const WHATSAPP_NUMBER = '22397787244'

interface VideoProject {
  id: number
  title: string
  type: string
  duration: string
  gradient: string
  whatsappMsg: string
}

const videoProjects: VideoProject[] = [
  {
    id: 1,
    title: 'Campagne Bissap Boom',
    type: 'Pub TikTok',
    duration: '0:45',
    gradient: 'from-amber-500 via-orange-500 to-red-500',
    whatsappMsg:
      "Bonjour Sacko ! Je suis intéressé(e) par une publicité TikTok comme votre vidéo 'Campagne Bissap Boom'. Pouvez-vous m'en dire plus ?",
  },
  {
    id: 2,
    title: 'Sons du Sahel – Clip Officiel',
    type: 'Clip Musical',
    duration: '3:20',
    gradient: 'from-rose-500 via-orange-400 to-amber-400',
    whatsappMsg:
      "Bonjour Sacko ! J'aimerais discuter d'un projet de clip musical similaire à 'Sons du Sahel'. Quels sont vos tarifs ?",
  },
  {
    id: 3,
    title: 'Lancement Mali Cosmétiques',
    type: 'Promo Produit',
    duration: '1:30',
    gradient: 'from-orange-600 via-red-500 to-pink-500',
    whatsappMsg:
      "Bonjour Sacko ! Je souhaite une vidéo promotionnelle produit comme 'Lancement Mali Cosmétiques'. Comment procéder ?",
  },
  {
    id: 4,
    title: 'Backstage Studio Session',
    type: 'Reel Instagram',
    duration: '0:30',
    gradient: 'from-amber-400 via-yellow-500 to-orange-500',
    whatsappMsg:
      "Bonjour Sacko ! Je veux un Reel Instagram dans le style 'Backstage Studio Session'. C'est possible ?",
  },
  {
    id: 5,
    title: 'Montage Pro en 5 étapes',
    type: 'Tutoriel',
    duration: '2:15',
    gradient: 'from-red-500 via-orange-500 to-amber-400',
    whatsappMsg:
      "Bonjour Sacko ! Je suis intéressé(e) par un tutoriel vidéo comme 'Montage Pro en 5 étapes'. Pouvez-vous m'aider ?",
  },
  {
    id: 6,
    title: 'Festival Sur le Niger 2024',
    type: 'Événement',
    duration: '4:00',
    gradient: 'from-orange-500 via-amber-600 to-yellow-500',
    whatsappMsg:
      "Bonjour Sacko ! J'aimerais une couverture vidéo d'événement comme 'Festival Sur le Niger 2024'. Quelles sont vos disponibilités ?",
  },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

export default function VideoShowcase() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })

  function handleCardClick(project: VideoProject) {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(project.whatsappMsg)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <section id="videos" ref={sectionRef} className="relative py-20 sm:py-28 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-amber-500/5 via-orange-500/5 to-red-500/5 blur-3xl" />
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-amber-400/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-red-400/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 dark:bg-amber-900/30 px-4 py-1.5 mb-4">
            <Film className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <span className="text-xs font-semibold text-amber-700 dark:text-amber-300 uppercase tracking-wider">
              Portfolio Vidéo
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
            Nos Créations{' '}
            <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 bg-clip-text text-transparent">
              Vidéo
            </span>
          </h2>
          <p className="max-w-2xl mx-auto text-muted-foreground text-base sm:text-lg leading-relaxed">
            Du montage créatif aux clips professionnels, nous transformons vos idées en vidéos
            percutantes qui captivent votre audience sur tous les réseaux sociaux.
          </p>
        </motion.div>

        {/* Video grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
        >
          {videoProjects.map((project) => (
            <motion.article
              key={project.id}
              variants={cardVariants}
              onClick={() => handleCardClick(project)}
              className="group relative cursor-pointer rounded-2xl overflow-hidden bg-card border border-border/50 shadow-sm hover:shadow-xl hover:shadow-amber-500/10 transition-shadow duration-300"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Thumbnail area */}
              <div className="relative aspect-[16/10] overflow-hidden">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-90`}
                />

                {/* Decorative shapes inside thumbnail */}
                <div className="absolute inset-0">
                  <div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-white/10 blur-sm" />
                  <div className="absolute bottom-6 left-6 w-32 h-16 rounded-full bg-black/10 blur-md" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-white/5 blur-lg" />
                </div>

                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/25 backdrop-blur-sm border border-white/30 shadow-lg transition-all duration-300 group-hover:bg-white/35 group-hover:scale-110"
                    whileHover={{ scale: 1.15 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <Play className="h-6 w-6 sm:h-7 sm:w-7 text-white fill-white ml-1" />
                  </motion.div>
                </div>

                {/* Duration badge */}
                <div className="absolute top-3 right-3">
                  <Badge
                    variant="secondary"
                    className="bg-black/50 backdrop-blur-sm text-white border-0 text-[10px] sm:text-xs font-semibold px-2 py-0.5"
                  >
                    <Clock className="h-3 w-3 mr-1" />
                    {project.duration}
                  </Badge>
                </div>

                {/* Hover overlay */}
                <motion.div
                  className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  <div className="flex items-center gap-2 bg-[#25D366] hover:bg-[#1da851] text-white font-bold text-sm px-4 py-2.5 rounded-xl shadow-lg shadow-green-500/25 transition-colors duration-200">
                    <MessageCircle className="h-4 w-4" />
                    <span>Voir sur WhatsApp</span>
                  </div>
                </motion.div>
              </div>

              {/* Card info */}
              <div className="p-3 sm:p-4">
                <Badge
                  variant="secondary"
                  className="mb-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-[10px] sm:text-xs font-semibold border-0"
                >
                  {project.type}
                </Badge>
                <h3 className="text-sm sm:text-base font-bold leading-tight line-clamp-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors duration-200">
                  {project.title}
                </h3>
              </div>
            </motion.article>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-12 sm:mt-16 text-center"
        >
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
              "Bonjour Sacko ! Je souhaite commander une vidéo pour mon projet. Pouvez-vous me présenter vos services et tarifs ?"
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-105 active:scale-100 transition-all duration-200"
          >
            <MessageCircle className="h-4 w-4" />
            Discuter de votre projet vidéo
          </a>
        </motion.div>
      </div>
    </section>
  )
}