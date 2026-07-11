'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight,
  Star,
  ShoppingCart,
  CheckCircle2,
  Palette,
  Globe,
  MonitorPlay,
  BookOpen,
  Tv,
  PenTool,
  Sparkles,
  Eye,
  Zap,
  Heart,
  Target,
  Send,
  Mail,
  Phone,
  MapPin,
  Instagram,
  Facebook,
  X,
  Gift,
  Shield,
  Timer,
  Lock,
  MessageCircle,
  Trophy,
  Flame,
  Clock,
  FileCheck,
  FolderDown,
  GraduationCap,
  Building2,
  UserCheck,
  BadgeCheck,
  Wrench,
  TrendingUp,
  Code,
  Brain,
  Youtube,
  ChevronUp,
  ShieldCheck,
  ThumbsUp,
  Rocket,
  Layers,
  Award,
  Users,
  Scissors,
  ArrowDown,
  Search,
  Megaphone,
  Play,
  Pause,
  Cookie,
  Calculator,
  Share2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Preloader from '@/components/Preloader'
import ClientLogos from '@/components/ClientLogos'
import VideoShowcase from '@/components/VideoShowcase'
import BlogPreview from '@/components/BlogPreview'
import AdBanner from '@/components/AdBanner'
import AdsterraBanner from '@/components/AdsterraBanner'




/* ─── Typing Text Hook ─── */
function useTypingText(phrases: string[], typingSpeed = 80, deletingSpeed = 40, pauseDuration = 2000) {
  const [displayed, setDisplayed] = useState('')
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const currentPhrase = phrases[phraseIndex]
    let timeout: NodeJS.Timeout

    if (!isDeleting && displayed === currentPhrase) {
      timeout = setTimeout(() => setIsDeleting(true), pauseDuration)
    } else if (isDeleting && displayed === '') {
      setIsDeleting(false)
      setPhraseIndex((prev) => (prev + 1) % phrases.length)
    } else {
      timeout = setTimeout(
        () => {
          setDisplayed(
            isDeleting
              ? currentPhrase.substring(0, displayed.length - 1)
              : currentPhrase.substring(0, displayed.length + 1)
          )
        },
        isDeleting ? deletingSpeed : typingSpeed
      )
    }
    return () => clearTimeout(timeout)
  }, [displayed, isDeleting, phraseIndex, phrases, typingSpeed, deletingSpeed, pauseDuration])

  return displayed
}

/* ─── useLocalStorage Hook ─── */
function useLocalStorage<T>(key: string, initialValue: T): [T, (v: T | ((prev: T) => T)) => void] {
  const [stored, setStored] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch { return initialValue }
  })
  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    setStored(prev => {
      const next = value instanceof Function ? value(prev) : value
      if (typeof window !== 'undefined') localStorage.setItem(key, JSON.stringify(next))
      return next
    })
  }, [key])
  return [stored, setValue]
}

/* ─── useCountdown Hook ─── */
function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  useEffect(() => {
    const calc = () => {
      const diff = targetDate.getTime() - Date.now()
      if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
      return {
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      }
    }
    setTimeLeft(calc())
    const interval = setInterval(() => setTimeLeft(calc()), 1000)
    return () => clearInterval(interval)
  }, [targetDate])
  return timeLeft
}

/* ─── Animated Counter Component ─── */
function AnimatedStat({ end, suffix, children }: { end: number; suffix?: string; children: React.ReactNode }) {
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!started) return
    let start = 0
    let frameId: number
    const step = (timestamp: number) => {
      if (!start) start = timestamp
      const progress = Math.min((timestamp - start) / 1500, 1)
      setCount(Math.floor(progress * end))
      if (progress < 1) frameId = requestAnimationFrame(step)
    }
    frameId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frameId)
  }, [started, end])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); observer.disconnect() } },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className="text-center"
    >
      {children}
      <div className="text-3xl sm:text-4xl font-extrabold text-white mb-1">{count}{suffix}</div>
    </div>
  )
}

/* ─── Before / After Slider ─── */
function BeforeAfterSlider({ before, after }: { before: string; after: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [sliderPos, setSliderPos] = useState(50)
  const [isDragging, setIsDragging] = useState(false)

  const updatePosition = (clientX: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100))
    setSliderPos(pct)
  }

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true)
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    updatePosition(e.clientX)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return
    updatePosition(e.clientX)
  }

  const handlePointerUp = () => {
    setIsDragging(false)
  }

  return (
    <div className="space-y-2">
      <div
        ref={containerRef}
        className="relative h-56 sm:h-64 rounded-xl overflow-hidden cursor-col-resize select-none border-2 border-border shadow-lg"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <img src={after} alt="Après" className="absolute inset-0 w-full h-full object-cover" draggable={false} />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}>
          <img src={before} alt="Avant" className="w-full h-full object-cover" draggable={false} />
        </div>
        <span className="absolute top-3 left-3 z-20 bg-red-500/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-sm">AVANT</span>
        <span className="absolute top-3 right-3 z-20 bg-emerald-500/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-sm">APRÈS</span>
        <div className="absolute top-0 bottom-0 z-30 w-0.5 bg-white shadow-[0_0_8px_rgba(0,0,0,0.5)]" style={{ left: `${sliderPos}%` }}>
          <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-xl flex items-center justify-center border-2 border-white/80">
            <div className="flex items-center gap-0.5">
              <div className="w-0 h-0 border-t-[5px] border-b-[5px] border-r-[6px] border-t-transparent border-b-transparent border-r-gray-700" />
              <div className="w-0 h-0 border-t-[5px] border-b-[5px] border-l-[6px] border-t-transparent border-b-transparent border-l-gray-700" />
            </div>
          </div>
        </div>
        {!isDragging && (
          <div className="absolute inset-0 z-10 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/20">
            <div className="bg-white/90 text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-full shadow">
              Glissez pour comparer
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── Static Data ─── */

/* 4 Formations vedettes avec formules Découverte / Premium */
const featuredFormations = [
  {
    id: 'design-graphique',
    title: 'Design Graphique',
    subtitle: 'Maîtrisez Canva comme un pro',
    icon: Palette,
    color: 'from-pink-500 to-rose-500',
    colorLight: 'bg-pink-50 dark:bg-pink-950/20',
    borderLight: 'border-pink-200 dark:border-pink-800',
    duration: '6 semaines',
    lessons: '18 leçons',
    level: 'Débutant',
    coach: 'Sacko',
    decouverte: {
      price: 'Gratuit',
      priceNum: 0,
      features: ['Interface Canva : maîtrise complète', 'Templates de base et personnalisation', 'Typographie et couleurs', 'Support WhatsApp groupe'],
    },
    premium: {
      price: '15 000',
      priceNum: 15000,
      features: ['Tout le programme Découverte', 'Photoshop & Illustrator initiation', 'Création de logos professionnels', 'Branding complet & charte graphique', 'Projet portfolio personnalisé', 'Certificat de participation', 'Suivi individuel post-formation'],
      bonus: 'Canva Pro offert pendant 30 jours',
    },
  },
  {
    id: 'montage-video',
    title: 'Montage Vidéo',
    subtitle: 'Devenez créateur de contenu vidéo',
    icon: MonitorPlay,
    color: 'from-purple-500 to-violet-500',
    colorLight: 'bg-purple-50 dark:bg-purple-950/20',
    borderLight: 'border-purple-200 dark:border-purple-800',
    duration: '6 semaines',
    lessons: '18 leçons',
    level: 'Débutant',
    coach: 'Sacko',
    decouverte: {
      price: 'Gratuit',
      priceNum: 0,
      features: ['CapCut : interface et outils de base', 'Découpe et montage simple', 'Ajout de musique et textes', 'Export pour réseaux sociaux'],
    },
    premium: {
      price: '20 000',
      priceNum: 20000,
      features: ['Tout le programme Découverte', 'Premiere Pro & DaVinci Resolve', 'Effets visuels avancés', 'Motion design & transitions', 'Color grading professionnel', 'Certificat de participation', 'Suivi individuel post-formation'],
      bonus: 'CapCut Pro offert pendant 30 jours',
    },
  },
  {
    id: 'creation-web',
    title: 'Création Web',
    subtitle: 'Construisez votre site de A à Z',
    icon: Globe,
    color: 'from-cyan-500 to-blue-500',
    colorLight: 'bg-cyan-50 dark:bg-cyan-950/20',
    borderLight: 'border-cyan-200 dark:border-cyan-800',
    duration: '6 semaines',
    lessons: '18 leçons',
    level: 'Intermédiaire',
    coach: 'Sacko',
    decouverte: {
      price: 'Gratuit',
      priceNum: 0,
      features: ['HTML & CSS : les fondamentaux', 'Première page web responsive', 'Hébergement gratuit et mise en ligne', 'Support WhatsApp groupe'],
    },
    premium: {
      price: '25 000',
      priceNum: 25000,
      features: ['Tout le programme Découverte', 'JavaScript interactif', 'Site multi-pages complet', 'Formulaire de contact fonctionnel', 'SEO & référencement Google', 'Certificat de participation', 'Suivi individuel post-formation'],
      bonus: 'Hébergement 1 an offert',
    },
  },
  {
    id: 'marketing-digital',
    title: 'Marketing Digital',
    subtitle: 'Gérez les réseaux sociaux comme un expert',
    icon: Megaphone,
    color: 'from-emerald-500 to-teal-500',
    colorLight: 'bg-emerald-50 dark:bg-emerald-950/20',
    borderLight: 'border-emerald-200 dark:border-emerald-800',
    duration: '6 semaines',
    lessons: '18 leçons',
    level: 'Débutant',
    coach: 'Sacko',
    decouverte: {
      price: 'Gratuit',
      priceNum: 0,
      features: ['Stratégie réseaux sociaux', 'Créer du contenu engageant', 'Facebook & Instagram pour débutants', 'Support WhatsApp groupe'],
    },
    premium: {
      price: '20 000',
      priceNum: 20000,
      features: ['Tout le programme Découverte', 'Publicité Facebook & Instagram', 'TikTok & YouTube stratégie', 'Calendrier éditorial complet', 'Analyse des performances', 'Certificat de participation', 'Suivi individuel post-formation'],
      bonus: 'Pack 50 templates réseaux sociaux',
    },
  },
]

/* Autres formations disponibles */
const otherFormations = [
  { text: 'Formation complète en Trading', icon: TrendingUp, level: 'Avancé' },
  { text: 'Formation en Intelligence Artificielle', icon: Brain, level: 'Avancé' },
  { text: 'Formation YouTube et monétisation', icon: Youtube, level: 'Intermédiaire' },
  { text: 'Formation complète en Programmation', icon: Code, level: 'Avancé' },
  { text: 'Formation E-commerce', icon: ShoppingCart, level: 'Intermédiaire' },
  { text: 'Formation en Hacking et Sécurité informatique', icon: ShieldCheck, level: 'Avancé' },
  { text: 'Formation Revendeur IPTV', icon: Tv, level: 'Débutant' },
]

/* Coachs */
const coaches = [
  {
    name: 'Sacko',
    role: 'Fondateur & Coach Principal',
    speciality: 'Design Graphique, Branding, Direction Créative',
    bio: 'Freelance digital à Bamako avec 50+ projets livrés. Expert en design graphique et stratégie visuelle pour entrepreneurs africains.',
    gradient: 'from-amber-400 via-orange-500 to-red-500',
    initial: 'S',
    stats: [{ value: '50+', label: 'Projets' }, { value: '3 ans', label: 'Expérience' }, { value: '100%', label: 'Satisfaction' }],
  },
  {
    name: 'Camara Leh',
    role: 'Coach Développement Web',
    speciality: 'JavaScript, React, Next.js, Base de données',
    bio: "Développeur full-stack passionné. Spécialiste en création de sites web modernes et applications web performantes. Plus de 30 projets web livrés pour des entreprises au Mali et en Afrique de l'Ouest.",
    gradient: 'from-blue-400 via-cyan-500 to-teal-500',
    initial: 'CL',
    stats: [{ value: '30+', label: 'Sites web' }, { value: '2 ans', label: 'Expérience' }, { value: '15+', label: 'Clients' }],
  },
  {
    name: 'Kante',
    role: 'Coach Marketing Digital',
    speciality: 'Publicité Facebook/Instagram, TikTok, Stratégie de contenu',
    bio: 'Expert en marketing digital et community management. Gère la présence en ligne de 20+ entreprises. Spécialiste des publicités payantes sur Facebook, Instagram et TikTok avec un ROI mesurable.',
    gradient: 'from-emerald-400 via-green-500 to-lime-500',
    initial: 'K',
    stats: [{ value: '20+', label: 'Entreprises' }, { value: '2 ans', label: 'Expérience' }, { value: '500K+', label: 'Budget géré' }],
  },
]

/* Livres / Ebooks à vendre */
type Book = {
  title: string
  author: string
  desc: string
  cover: string
  category: string
  excerpt: string
  keypoints: string[]
}

const bookCategories = ['Tous', 'Programmation', 'Marketing & Business', 'Web & Digital', 'Sécurité & Réseaux']

const books: Book[] = [
  {
    title: 'Travaux pratiques Word 2016',
    author: 'Christine Eberhardt',
    desc: 'Maîtrisez Word 2016 : mise en page, formatage, tableaux et publipostage.',
    cover: '/livres/word-2016.jpg',
    category: 'Web & Digital',
    excerpt: 'Ce guide pratique vous accompagne pas à pas dans la maîtrise de Microsoft Word 2016. Depuis la création de documents professionnels jusqu\'au publipostage avancé, chaque chapitre propose des exercices concrets. Vous apprendrez à structurer des rapports, insérer des images et tableaux, gérer les styles et en-têtes, et automatiser vos courriers.',
    keypoints: ['Mise en page et formatage professionnel', 'Tableaux, images et objets graphiques', 'Styles, en-têtes et pieds de page', 'Documents longs et sommaire automatique', 'Publipostage et fusion de courriers'],
  },
  {
    title: 'Programmer en Langage C',
    author: 'Claude Delannoy',
    desc: 'Les fondamentaux de la programmation C avec exercices corrigés.',
    cover: '/livres/langage-c.jpg',
    category: 'Programmation',
    excerpt: 'Ouvrage de référence avec plus de 50 000 exemplaires vendus. Ce livre couvre l\'ensemble du langage C : types de données, opérateurs, structures de contrôle, pointeurs, tableaux, fonctions et allocation dynamique. Chaque chapitre se termine par des exercices corrigés pour vérifier votre compréhension et renforcer vos compétences.',
    keypoints: ['Types, variables et opérateurs', 'Structures de contrôle et boucles', 'Pointeurs et allocation dynamique', 'Fonctions et portée des variables', 'Exercices corrigés à chaque chapitre'],
  },
  {
    title: 'E-marketing & E-commerce',
    author: 'Émilie Courts',
    desc: 'Doper ses ventes en ligne pas à pas : visibilité et stratégie web.',
    cover: '/livres/e-marketing-ecommerce.jpg',
    category: 'Marketing & Business',
    excerpt: 'Un guide actionnable pour booster votre présence en ligne et augmenter vos ventes. De la création de votre site e-commerce à l\'optimisation du référencement naturel, en passant par les réseaux sociaux et la publicité en ligne. Chaque étape est illustrée par des cas concrets et des conseils pratiques.',
    keypoints: ['Créer et optimiser son site e-commerce', 'Référencement naturel (SEO)', 'Publicité en ligne : Google Ads, Facebook Ads', 'Réseaux sociaux et engagement client', 'Analyse des performances et KPIs'],
  },
  {
    title: 'Le commerce électronique',
    author: 'Guy Hervier',
    desc: 'Vendre en ligne et optimiser ses achats sur internet.',
    cover: '/livres/commerce-electronique.jpg',
    category: 'Marketing & Business',
    excerpt: 'Comprenez les rouages du commerce en ligne : de la mise en place d\'une boutique web aux stratégies d\'achat optimisé. Ce livre aborde les aspects techniques, juridiques et marketing de la vente en ligne, avec un focus sur les bonnes pratiques pour maximiser ses conversions et fidéliser sa clientèle.',
    keypoints: ['Fonctionnement d\'une boutique en ligne', 'Panier d\'achat et paiement sécurisé', 'Logistique et livraison', 'Techniques de conversion et fidélisation', 'Aspects juridiques du e-commerce'],
  },
  {
    title: 'Manuel de Journalisme Web',
    author: 'Mark Briggs',
    desc: 'Blogs, réseaux sociaux, multimédia et journalisme numérique.',
    cover: '/livres/journalisme-web.jpg',
    category: 'Web & Digital',
    excerpt: 'L\'ouvrage de référence pour le journalisme à l\'ère numérique. Apprenez à utiliser les blogs, les réseaux sociaux et les outils multimédias pour produire un journalisme de qualité. Couvre le reporting numérique, la vérification des sources en ligne, le storytelling interactif et la monétisation de contenu.',
    keypoints: ['Reporting et écriture numérique', 'Blogs et plateformes de publication', 'Réseaux sociaux comme outils journalistiques', 'Contenu multimédia : vidéo, audio, infographies', 'Vérification des sources et éthique en ligne'],
  },
  {
    title: 'Vendre de façon rentable !',
    author: 'Pierre Maurin',
    desc: 'Stratégies de vente rentables pour PME et équipes commerciales.',
    cover: '/livres/vendre-rentable.jpg',
    category: 'Marketing & Business',
    excerpt: 'Un guide pragmatique pour les dirigeants de PME et leurs équipes commerciales. Découvrez les méthodes pour vendre plus et mieux : prospection efficace, argumentation de vente, gestion des objections, négociation et closing. Des outils concrets applicables immédiatement pour augmenter votre chiffre d\'affaires.',
    keypoints: ['Prospection et recherche de clients', 'Techniques d\'argumentation et de persuasion', 'Gestion des objections et négociation', 'Fidélisation et montée en gamme', 'Outils et tableaux de bord commerciaux'],
  },
  {
    title: 'Écrire des livres avec ChatGPT',
    author: 'Martín Arellano',
    desc: 'Utilisez l\'IA ChatGPT pour créer et rédiger vos livres.',
    cover: '/livres/ecrire-livres-chatgpt.jpg',
    category: 'Web & Digital',
    excerpt: 'Découvrez comment exploiter la puissance de ChatGPT pour écrire vos livres. De l\'idée initiale à la publication, ce guide vous montre comment utiliser l\'IA pour générer des idées, structurer votre plan, rédiger des chapitres, corriger et améliorer votre texte. Un livre essentiel pour les créateurs de contenu du 21e siècle.',
    keypoints: ['Générer des idées de livres avec l\'IA', 'Structurer un plan et un sommaire', 'Rédiger des chapitres efficacement', 'Correction, réécriture et polishing', 'Stratégies de publication et monétisation'],
  },
  {
    title: 'Développement système sous Linux',
    author: 'Christophe Blaess',
    desc: 'Programmation système : multitâche, mémoire, réseau sous Linux.',
    cover: '/livres/linux-systeme.jpg',
    category: 'Programmation',
    excerpt: 'Référence technique pour la programmation système sous Linux. Couvre en profondeur l\'ordonnancement multitâche, la gestion de la mémoire, les communications inter-processus (IPC), la programmation réseau et les signaux. Destiné aux développeurs qui veulent comprendre le fonctionnement interne du noyau Linux.',
    keypoints: ['Processus et ordonnancement', 'Gestion de la mémoire virtuelle', 'Communications inter-processus (IPC)', 'Programmation réseau et sockets', 'Signaux et gestion des interruptions'],
  },
  {
    title: 'Espionnage dans les réseaux TCP/IP',
    author: 'Zouheir Trabelsi',
    desc: 'Techniques de sniffing et contre-mesures de sécurité réseau.',
    cover: '/livres/espionnage-tcp-ip.jpg',
    category: 'Sécurité & Réseaux',
    excerpt: 'Plongez dans les techniques d\'espionnage réseau (sniffing) dans les environnements TCP/IP. Ce livre technique détaille les méthodes d\'interception de données, les outils utilisés par les attaquants, et surtout les contre-mesures et outils anti-sniffers pour protéger votre infrastructure réseau.',
    keypoints: ['Fonctionnement des protocoles TCP/IP', 'Techniques de sniffing et interception', 'Outils d\'analyse réseau (Wireshark, etc.)', 'Contre-mesures et détection d\'intrusion', 'Sécurisation des communications réseau'],
  },
  {
    title: 'WordPress pour les Nuls',
    author: 'Lisa Sabin-Wilson',
    desc: 'Créez votre site WordPress : nom de domaine, hébergement, personnalisation, extensions et multimédia.',
    cover: '/livres/wordpress-nuls.jpg',
    category: 'Web & Digital',
    excerpt: 'Le guide idéal pour créer votre premier site WordPress, même sans aucune compétence technique. Apprenez à choisir votre nom de domaine, configurer votre hébergement, installer WordPress, personnaliser votre thème, installer des extensions essentielles et publier du contenu multimédia.',
    keypoints: ['Choisir un nom de domaine et un hébergeur', 'Installation et configuration de WordPress', 'Personnalisation avec thèmes et widgets', 'Extensions indispensables (SEO, sécurité, contact)', 'Gestion du Tableau de bord et maintenance'],
  },
  {
    title: 'Programmer avec JavaScript en s\'amusant',
    author: 'Chris Minnick & Eva Holland',
    desc: '15 projets fun pour apprendre le JavaScript : jeux, pages web, animation de robot.',
    cover: '/livres/javascript-amusant.jpg',
    category: 'Programmation',
    excerpt: 'Apprenez le JavaScript en vous amusant ! Ce livre propose 15 projets conçus pour les débutants dès 11 ans. Créez des jeux, construisez des pages web interactives et animez un robot. Chaque projet introduit de nouveaux concepts de programmation de manière progressive et ludique.',
    keypoints: ['15 projets pratiques et ludiques', 'Créer des jeux en JavaScript', 'Construire des pages web interactives', 'Animer des éléments graphiques et robots', 'Accessible dès 11 ans — aucun prérequis'],
  },
  {
    title: 'Stratégie Marketing & Création Publicitaire',
    author: 'Henri Joannis & Virginie de Barnier',
    desc: 'De la stratégie marketing à la création publicitaire : magazines, TV, affiches, internet.',
    cover: '/livres/strategie-marketing-pub.jpg',
    category: 'Marketing & Business',
    excerpt: 'L\'ouvrage de référence en stratégie publicitaire couvrant tous les médias : magazines, TV/radio, affiches et internet. Apprenez à construire une stratégie marketing solide, définir un positionnement, créer des messages percutants et choisir les bons canaux de diffusion pour toucher votre cible.',
    keypoints: ['Élaboration d\'une stratégie marketing', 'Positionnement et segmentation', 'Création publicitaire multi-médias', 'TV, radio, affiches, magazines, internet', 'Mesure d\'efficacité et retour sur investissement'],
  },
]

/* ═══════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════ */
export default function Home() {
  const [contactData, setContactData] = useState({ name: '', email: '', subject: '', message: '' })
  const [contactSending, setContactSending] = useState(false)
  const [contactSent, setContactSent] = useState(false)
  const [showBanner, setShowBanner] = useState(true)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [showStickyCta, setShowStickyCta] = useState(false)
  const [portfolioFilter, setPortfolioFilter] = useState('Tous')
  const [quickOrder, setQuickOrder] = useState({ service: '', name: '', phone: '', description: '' })
  const [faqOpen, setFaqOpen] = useState<string | null>(null)
  const [leadMagnet, setLeadMagnet] = useState({ name: '', contact: '' })
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [bookFilter, setBookFilter] = useState('Tous')
  const { toast } = useToast()

  // New features
  const typedText = useTypingText([
    'démarquez-vous.',
    'propulsez votre marque.',
    'attirez vos clients.',
    'gagnez en visibilité.',
    'concrétisez vos idées.',
  ])
  const [cart, setCart] = useLocalStorage<string[]>('sc-cart', [])
  const [showCart, setShowCart] = useState(false)
  const [showCookieConsent, setShowCookieConsent] = useLocalStorage('sc-cookies', true)
  const [showWelcome, setShowWelcome] = useLocalStorage('sc-welcome', true)
  const [welcomeVisible, setWelcomeVisible] = useState(false)
  const [estimatorServices, setEstimatorServices] = useState<string[]>([])
  const [confettiActive, setConfettiActive] = useState(false)
  const [availabilitySlots, setAvailabilitySlots] = useState<Record<string, number>>({})
  const [showWaWidget, setShowWaWidget] = useState(false)
  const [testimIndex, setTestimIndex] = useState(0)
  const [testimPaused, setTestimPaused] = useState(false)
  const [shareToast, setShareToast] = useState(false)
  const [lastOrderId, setLastOrderId] = useState('')
  const [trackId, setTrackId] = useState('')
  const [trackResult, setTrackResult] = useState<{ id: string; service: string; status: string; statusLabel: string; createdAt: string; updatedAt: string } | null>(null)
  const [trackLoading, setTrackLoading] = useState(false)
  const [activeDotSection, setActiveDotSection] = useState('accueil')

  // Portfolio lightbox
  const [lightboxImg, setLightboxImg] = useState<{ src: string; title: string; desc: string } | null>(null)

  // Book search
  const [bookSearch, setBookSearch] = useState('')

  // FAQ search
  const [faqSearch, setFaqSearch] = useState('')

  // Service quiz
  const [quizOpen, setQuizOpen] = useState(false)
  const [quizStep, setQuizStep] = useState(0)
  const [quizAnswers, setQuizAnswers] = useState<string[]>([])
  const [quizResult, setQuizResult] = useState<{ service: string; icon: typeof Palette; reason: string } | null>(null)

  // Coach detail modal
  const [selectedCoach, setSelectedCoach] = useState<typeof coaches[0] | null>(null)

  // Promo countdown: end of current month
  const [promoEnd] = useState(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 0)
  })
  const countdown = useCountdown(promoEnd)

  const toggleCart = useCallback((title: string) => {
    setCart(prev => prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title])
  }, [setCart])

  const isInCart = useCallback((title: string) => cart.includes(title), [cart])

  // Auto-scroll testimonials
  useEffect(() => {
    if (testimPaused) return
    const interval = setInterval(() => {
      setTestimIndex(prev => (prev + 1) % 4)
    }, 5000)
    return () => clearInterval(interval)
  }, [testimPaused])

  // Confetti trigger
  const triggerConfetti = useCallback(() => {
    setConfettiActive(true)
    setTimeout(() => setConfettiActive(false), 4000)
  }, [])






  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 600)
      const totalHeight = document.body.scrollHeight - window.innerHeight
      setScrollProgress(totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0)
      setShowStickyCta(window.scrollY > 500)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Welcome popup for first-time visitors
  useEffect(() => {
    if (showWelcome) {
      const timer = setTimeout(() => setWelcomeVisible(true), 15000) // show after 15s instead of 6s
      return () => clearTimeout(timer)
    }
  }, [showWelcome])

  // Availability slots for service cards
  useEffect(() => {
    const slots: Record<string, number> = {}
    const cats = ['Design Graphique', 'Développement Web', 'Montage Vidéo', 'Formation', 'Marketing Digital']
    cats.forEach((cat, i) => { slots[cat] = [2, 1, 3, 2, 1][i] })
    setAvailabilitySlots(slots)
  }, [])

  // Escape key handler for all modals
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxImg(null)
        setSelectedBook(null)
        setQuizOpen(false); setQuizStep(0); setQuizAnswers([]); setQuizResult(null)
        setShowCart(false)
        setSelectedCoach(null)
      }
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [])

  // Intersection observer for side nav dots
  useEffect(() => {
    const sectionIds = ['accueil', 'services', 'formations', 'coachs', 'boutique', 'portfolio', 'blog', 'contact']
    const observers: IntersectionObserver[] = []
    sectionIds.forEach(id => {
      const el = document.getElementById(id)
      if (!el) return
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) setActiveDotSection(id)
          })
        },
        { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
      )
      observer.observe(el)
      observers.push(observer)
    })
    return () => observers.forEach(o => o.disconnect())
  }, [])





  const handleSubmitContact = async (e: React.FormEvent) => {
    e.preventDefault()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!contactData.name || !contactData.email || !contactData.message) {
      toast({ title: 'Champs requis', description: 'Veuillez remplir tous les champs obligatoires.', variant: 'destructive' })
      return
    }
    if (!emailRegex.test(contactData.email)) {
      toast({ title: 'Email invalide', description: 'Veuillez entrer une adresse email valide.', variant: 'destructive' })
      return
    }
    setContactSending(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactData),
      })
      const data = await res.json()
      if (res.ok) {
        setContactSent(true)
        setContactData({ name: '', email: '', subject: '', message: '' })
        toast({ title: 'Message envoyé !', description: 'Je vous répondrai rapidement. Vérifiez aussi votre boîte email.', variant: 'default' })
        setTimeout(() => setContactSent(false), 6000)
      } else {
        toast({ title: 'Erreur', description: data.error || 'Impossible d\'envoyer le message. Essayez WhatsApp.', variant: 'destructive' })
      }
    } catch {
      toast({ title: 'Erreur réseau', description: 'Vérifiez votre connexion ou contactez-moi sur WhatsApp.', variant: 'destructive' })
    } finally {
      setContactSending(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background pb-20 lg:pb-0 scroll-smooth">
      <Preloader />
      <Header />

      <main className="flex-1">

        {/* ═══ 1. BANNIÈRE PROMO ═══ */}
        <AnimatePresence>
          {showBanner && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white"
            >
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-4">
                <p className="text-xs sm:text-sm font-medium text-center sm:text-left flex-1">
                  <Sparkles className="h-3.5 w-3.5 inline mr-1" />
                  Offre spéciale : Première commande à prix réduit — Design, sites web, montage vidéo et plus encore !
                </p>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <a href="#services">
                    <Button size="sm" variant="secondary" className="h-7 text-xs bg-white text-amber-600 hover:bg-white/90 font-semibold px-3">
                      Voir les services
                    </Button>
                  </a>

                  <button onClick={() => setShowBanner(false)} className="text-white/80 hover:text-white transition-colors" aria-label="Fermer">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ═══ 2. HERO ═══ */}
        <section id="accueil" className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-white dark:from-amber-950/20 dark:via-orange-950/10 dark:to-background">
          {/* Animated gradient orbs */}
          <div className="absolute top-0 -right-40 h-[500px] w-[500px] rounded-full bg-amber-200/40 dark:bg-amber-800/10 blur-3xl animate-pulse" />
          <div className="absolute -bottom-20 -left-40 h-[400px] w-[400px] rounded-full bg-orange-200/30 dark:bg-orange-800/10 blur-3xl" style={{ animationDelay: '1s', animationDuration: '4s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] rounded-full bg-red-100/30 dark:bg-red-900/10 blur-3xl" style={{ animationDelay: '2s', animationDuration: '5s' }} />
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(245,158,11,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(245,158,11,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black,transparent)]" />

          {/* Floating shapes */}
          <div className="absolute top-20 right-20 w-16 h-16 rounded-xl bg-amber-300/20 dark:bg-amber-600/10 animate-float-slow hidden lg:block" />
          <div className="absolute bottom-32 right-40 w-10 h-10 rounded-full bg-orange-300/25 dark:bg-orange-600/10 animate-float-medium hidden lg:block" />
          <div className="absolute top-40 left-20 w-8 h-8 rounded-lg bg-red-300/20 dark:bg-red-600/10 rotate-45 animate-float-fast hidden lg:block" />

          <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                <Badge variant="secondary" className="mb-4 px-3 py-1 text-xs font-medium bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800 shadow-sm">
                  <Sparkles className="h-3 w-3 mr-1" /> Studio Créatif Indépendant
                </Badge>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                  Donnez vie à vos projets digitaux et{' '}
                  <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 bg-clip-text text-transparent animate-gradient-text">
                    {typedText}<span className="animate-pulse">|</span>
                  </span>
                </h1>

                <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-lg">
                  Création de logos, sites web et visuels sur-mesure pour propulser les entrepreneurs et créateurs de Bamako et d&apos;ailleurs. Chaque projet est une opportunité de transformer votre vision en une réalité qui attire et fidélise.
                </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="mt-8 flex flex-wrap gap-3"
                >
                  <a href="https://wa.me/22397787244?text=Bonjour%20!%20Je%20souhaite%20discuter%20de%20mon%20projet." target="_blank" rel="noopener noreferrer">
                    <Button size="lg" className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:via-orange-600 hover:to-red-600 text-white font-semibold shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all duration-200 hover:scale-105 active:scale-95">
                      <Rocket className="mr-2 h-4 w-4" /> Lancer mon projet
                    </Button>
                  </a>
                  <a href="#boutique">
                    <Button size="lg" variant="outline" className="font-semibold hover:bg-accent transition-transform duration-200 hover:scale-105 active:scale-95">
                      <BookOpen className="mr-2 h-4 w-4" /> Voir la Boutique
                    </Button>
                  </a>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="mt-10 flex flex-wrap gap-3"
                >
                  {['Design Graphique', 'Sites Web', 'Montage Vidéo', 'Marketing Digital'].map((tag) => (
                    <span key={tag} className="inline-flex items-center gap-1.5 rounded-full bg-white/80 dark:bg-white/5 border px-3.5 py-1.5 text-xs font-medium text-amber-700 dark:text-amber-400 border-amber-200/80 dark:border-amber-800 shadow-sm backdrop-blur-sm hover:-translate-y-0.5 transition-transform cursor-default">
                      <CheckCircle2 className="h-3 w-3 text-emerald-500" /> {tag}
                    </span>
                  ))}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="mt-8 flex items-center gap-4"
                >
                  <div className="flex -space-x-2">
                    {['from-amber-400 to-orange-500', 'from-emerald-400 to-teal-500', 'from-purple-400 to-pink-500', 'from-blue-400 to-cyan-500'].map((g, i) => (
                      <div key={i} className={`h-8 w-8 rounded-full border-2 border-white dark:border-slate-900 bg-gradient-to-br ${g}`} />
                    ))}
                  </div>
                  <div>
                    <p className="text-xs font-bold">Clients satisfaits à Bamako</p>
                    <p className="text-[10px] text-muted-foreground">Recommandé bouche à oreille</p>
                  </div>
                </motion.div>
              </div>

              {/* Hero Visual - Services Preview Card */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="hidden lg:block"
              >
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-amber-400/20 via-orange-400/20 to-red-400/20 rounded-3xl blur-2xl" />
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 sm:p-8">
                    {/* Mini dashboard preview */}
                    <div className="flex items-center gap-2 mb-5">
                      <div className="h-3 w-3 rounded-full bg-red-400" />
                      <div className="h-3 w-3 rounded-full bg-amber-400" />
                      <div className="h-3 w-3 rounded-full bg-emerald-400" />
                      <span className="text-[10px] text-slate-500 ml-2 font-mono">studio-creatif.ml</span>
                    </div>
                    <div className="space-y-3">
                      {[
                        { icon: '🎨', label: 'Logo Pro', desc: 'Identité visuelle', color: 'from-pink-500 to-rose-500', status: 'Livré' },
                        { icon: '🌐', label: 'Site E-commerce', desc: 'Boutique en ligne', color: 'from-blue-500 to-indigo-500', status: 'En cours' },
                        { icon: '🎬', label: 'Pub TikTok', desc: 'Montage + effets', color: 'from-emerald-500 to-teal-500', status: 'Livré' },
                        { icon: '📱', label: 'Posts Instagram', desc: 'Pack 10 visuels', color: 'from-purple-500 to-violet-500', status: 'Livré' },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                          <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${item.color} text-lg shadow-lg`}>{item.icon}</div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-white">{item.label}</p>
                            <p className="text-[10px] text-slate-400">{item.desc}</p>
                          </div>
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${item.status === 'Livré' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>{item.status}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-xs font-bold">S</div>
                        <div>
                          <p className="text-[11px] font-bold text-white">Sacko</p>
                          <p className="text-[9px] text-slate-500">Design & Digital</p>
                        </div>
                      </div>
                      <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                        <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" /></span>
                        En ligne
                      </span>
                    </div>
                  </div>
                  <div className="absolute -bottom-6 -left-6 bg-white/90 dark:bg-card/90 backdrop-blur-xl rounded-xl shadow-xl p-3 border hover:scale-105 transition-transform cursor-default">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
                        <Award className="h-5 w-5 text-amber-500" />
                      </div>
                      <div>
                        <p className="text-xs font-bold">50+ Marques</p>
                        <p className="text-[10px] text-muted-foreground">Propulsées</p>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -top-4 -right-4 bg-white/90 dark:bg-card/90 backdrop-blur-xl rounded-xl shadow-xl p-3 border hover:scale-105 transition-transform cursor-default">
                    <div className="flex items-center gap-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                      </div>
                      <div>
                        <p className="text-xs font-bold">100% Sur-mesure</p>
                        <p className="text-[10px] text-muted-foreground">Chaque pixel pensé pour vous</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Wave divider */}
        <div className="relative h-12 -mt-1 overflow-hidden">
          <svg className="absolute bottom-0 w-full" viewBox="0 0 1440 48" fill="none" preserveAspectRatio="none">
            <path d="M0 48L60 42C120 36 240 24 360 20C480 16 600 20 720 26C840 32 960 40 1080 40C1200 40 1320 32 1380 28L1440 24V48H1380C1320 48 1200 48 1080 48C960 48 840 48 720 48C600 48 480 48 360 48C240 48 120 48 60 48H0Z" className="fill-background" />
          </svg>
        </div>

        {/* ═══ 3. QUICK SERVICE ACCESS BAR ═══ */}
        <section className="py-6 border-b bg-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide items-center">
              {[
                { label: 'Logo', icon: Palette, href: '#services' },
                { label: 'Site Web', icon: Globe, href: '#services' },
                { label: 'Vidéo', icon: MonitorPlay, href: '#services' },
                { label: 'Affiche', icon: PenTool, href: '#services' },
                { label: 'Formation', icon: GraduationCap, href: '#formations' },
                { label: 'CapCut Pro', icon: Scissors, href: '#services' },
              ].map((s) => (
                <a key={s.label} href={s.href} className="flex-shrink-0 flex flex-col items-center gap-1.5 px-4 py-3 rounded-xl bg-muted/50 hover:bg-gradient-to-br hover:from-amber-50 hover:to-orange-50 dark:hover:from-amber-950/20 dark:hover:to-orange-950/20 hover:-translate-y-0.5 hover:shadow-md hover:shadow-amber-500/10 hover:border-amber-200 dark:hover:border-amber-800 border border-transparent transition-all duration-300 group">
                  <s.icon className="h-5 w-5 text-amber-500 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-medium">{s.label}</span>
                </a>
              ))}
              {/* Canva Pro — avec image cliquable */}
              <a
                href="https://www.canva.com/brand/join?token=nbyqrtelBOlUiCNiK170Ew&referrer=team-invite"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 flex items-center gap-2 pl-3 pr-4 py-2 rounded-xl bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-950/30 hover:from-cyan-100 hover:to-blue-100 dark:hover:from-cyan-950/50 dark:hover:to-blue-950/50 hover:-translate-y-0.5 hover:shadow-md hover:shadow-cyan-500/15 border border-cyan-200 dark:border-cyan-800/50 transition-all duration-300 group"
              >
                <img
                  src="/canva-pro-real.png"
                  alt="Canva Pro"
                  className="h-9 w-9 rounded-lg object-cover group-hover:scale-110 transition-transform"
                />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-cyan-700 dark:text-cyan-300 leading-tight">Canva Pro</span>
                  <span className="text-[9px] text-cyan-500 dark:text-cyan-400 font-medium">Gratuit</span>
                </div>
              </a>
            </div>
          </div>
        </section>

        {/* ═══ 4. STATISTIQUES ═══ */}
        <section className="py-12 sm:py-16 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 relative overflow-hidden">
          <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Ce que je fais, en chiffres</h2>
              <p className="mt-2 text-white/80 text-sm">Transparent, impactant, à taille humaine</p>
            </div>
            <div className="grid grid-cols-3 gap-6 sm:gap-12">
              <AnimatedStat end={50} suffix="+">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm mx-auto mb-3">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <p className="text-sm font-semibold text-white/90">Marques propulsées</p>
                <p className="text-xs text-white/60 mt-1 leading-relaxed hidden sm:block">Logos, affiches et identités créées avec soin</p>
              </AnimatedStat>
              <div className="text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm mx-auto mb-3">
                  <Palette className="h-6 w-6 text-white" />
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold text-white mb-1">100%</div>
                <p className="text-sm font-semibold text-white/90">Sur-mesure</p>
                <p className="text-xs text-white/60 mt-1 leading-relaxed hidden sm:block">Aucun template pré-fait, chaque pixel est pensé pour vous</p>
              </div>
              <AnimatedStat end={100} suffix="%">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm mx-auto mb-3">
                  <ThumbsUp className="h-6 w-6 text-white" />
                </div>
                <p className="text-sm font-semibold text-white/90">Satisfaction client</p>
                <p className="text-xs text-white/60 mt-1 leading-relaxed hidden sm:block">Une collaboration basée sur l'écoute et le résultat</p>
              </AnimatedStat>
            </div>
          </div>
        </section>

        {/* ═══ 5. BARRE DE CONFIANCE ═══ */}
        <section className="py-6 border-b bg-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
              {[
                { icon: ShieldCheck, label: 'Qualité Garantie' },
                { icon: Zap, label: 'Livraison Rapide' },
                { icon: CheckCircle2, label: 'Satisfaction Garantie' },
                { icon: Gift, label: '100% Gratuit' },
                { icon: MessageCircle, label: 'Support WhatsApp' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2 text-muted-foreground">
                  <item.icon className="h-4 w-4 text-amber-500" />
                  <span className="text-xs font-medium whitespace-nowrap">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ TRUST TICKER ═══ */}
        <div className="py-4 bg-amber-50 dark:bg-amber-950/10 border-y border-amber-200/50 dark:border-amber-800/30 overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap">
            {[...Array(2)].map((_, setIdx) => (
              <div key={setIdx} className="flex items-center gap-8 mx-4">
                {[
                  { icon: '⭐', text: '50+ Marques créées' },
                  { icon: '🎨', text: '100% Sur-mesure' },
                  { icon: '⚡', text: 'Livraison en 24-48h' },
                  { icon: '💰', text: 'Offre Découverte Gratuite' },
                  { icon: '📱', text: 'Support WhatsApp 7j/7' },
                  { icon: '🔒', text: 'Paiement Sécurisé' },
                  { icon: '🏆', text: '5/5 Satisfaction Client' },
                  { icon: '🇲🇱', text: 'Expert Bamako, Mali' },
                ].map((item, i) => (
                  <span key={`${setIdx}-${i}`} className="inline-flex items-center gap-2 text-sm font-medium text-amber-700 dark:text-amber-400 flex-shrink-0">
                    <span>{item.icon}</span>
                    <span>{item.text}</span>
                    <span className="text-amber-300 dark:text-amber-700">•</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* ═══ 5.5 COMMENT ÇA MARCHE ═══ */}
        <section className="py-16 sm:py-20 bg-gradient-to-b from-background to-muted/20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-3 bg-amber-100 text-amber-700 border-amber-200">
                <Zap className="h-3 w-3 mr-1" /> Processus
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Comment ça marche ?</h2>
              <p className="mt-3 text-muted-foreground max-w-xl mx-auto leading-relaxed">
                4 étapes simples pour concrétiser votre projet. De votre première idée à la livraison finale, je vous accompagne à chaque étape.
              </p>
            </div>

            <div className="relative">
              {/* Ligne de connexion verticale (desktop) / horizontale (mobile) */}
              <div className="hidden sm:block absolute top-16 left-[calc(12.5%+20px)] right-[calc(12.5%+20px)] h-0.5 bg-gradient-to-r from-amber-300 via-orange-400 to-red-400 opacity-40" />

              <div className="grid sm:grid-cols-4 gap-6 sm:gap-4">
                {[
                  {
                    step: '01',
                    icon: MessageCircle,
                    title: 'Contactez-moi',
                    desc: "Envoyez-moi un message sur WhatsApp ou remplissez le formulaire. Décrivez votre projet en quelques mots.",
                    color: 'from-amber-400 to-amber-500',
                    bg: 'bg-amber-50 dark:bg-amber-950/20',
                    border: 'border-amber-200 dark:border-amber-800',
                  },
                  {
                    step: '02',
                    icon: Search,
                    title: 'Brief & Devis',
                    desc: "Je vous pose les bonnes questions pour comprendre vos besoins. Vous recevez une proposition claire avec délai et prix.",
                    color: 'from-orange-400 to-orange-500',
                    bg: 'bg-orange-50 dark:bg-orange-950/20',
                    border: 'border-orange-200 dark:border-orange-800',
                  },
                  {
                    step: '03',
                    icon: PenTool,
                    title: 'Création',
                    desc: "Je conçois votre projet avec soin. Vous recevez des aperçus et pouvez demander des ajustements.",
                    color: 'from-red-400 to-red-500',
                    bg: 'bg-red-50 dark:bg-red-950/20',
                    border: 'border-red-200 dark:border-red-800',
                  },
                  {
                    step: '04',
                    icon: Rocket,
                    title: 'Livraison',
                    desc: "Fichiers sources livrés en haute qualité. Suivi après livraison pour s'assurer que tout est parfait.",
                    color: 'from-emerald-400 to-emerald-500',
                    bg: 'bg-emerald-50 dark:bg-emerald-950/20',
                    border: 'border-emerald-200 dark:border-emerald-800',
                  },
                ].map((s, i) => (
                  <div key={s.step} className={`relative text-center p-5 rounded-2xl border ${s.border} ${s.bg} transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}>
                    <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${s.color} text-white shadow-lg mb-3`}>
                      <s.icon className="h-5 w-5" />
                    </div>
                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Étape {s.step}</div>
                    <h3 className="text-sm font-extrabold mb-2">{s.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
                    {i < 3 && (
                      <ArrowDown className="h-5 w-5 text-amber-400 mx-auto mt-3 sm:hidden" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══ AD BANNER — After Hero ═══ */}
        <div className="py-4 bg-muted/10">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <AdBanner />
            <div className="mt-3">
              <AdsterraBanner placement="banner" />
            </div>
          </div>
        </div>

        {/* ═══ OUTILS MAÎTRISÉS ═══ */}
        <div className="py-8 bg-muted/30 border-y overflow-hidden">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-6">
            <p className="text-center text-xs font-bold uppercase tracking-widest text-muted-foreground">
              <Wrench className="h-3.5 w-3.5 inline mr-1.5" /> Outils & Technologies que nous maîtrisons
            </p>
          </div>
          <div className="flex animate-marquee whitespace-nowrap">
            {[...Array(2)].map((_, setIdx) => (
              <div key={setIdx} className="flex items-center gap-10 mx-5">
                {[
                  { name: 'Canva Pro', emoji: '🎨' },
                  { name: 'CapCut Pro', emoji: '🎬' },
                  { name: 'PicsArt Pro', emoji: '📸' },
                  { name: 'Photoshop', emoji: '🖌️' },
                  { name: 'Illustrator', emoji: '✏️' },
                  { name: 'Premiere Pro', emoji: '🎞️' },
                  { name: 'DaVinci Resolve', emoji: '🪄' },
                  { name: 'Figma', emoji: '🎯' },
                  { name: 'HTML/CSS', emoji: '🌐' },
                  { name: 'JavaScript', emoji: '⚡' },
                  { name: 'React/Next.js', emoji: '⚛️' },
                  { name: 'WordPress', emoji: '📝' },
                  { name: 'Meta Business', emoji: '📊' },
                  { name: 'TikTok Ads', emoji: '🎵' },
                ].map((tool, i) => (
                  <span key={`${setIdx}-${i}`} className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors flex-shrink-0">
                    <span className="text-xl">{tool.emoji}</span>
                    <span>{tool.name}</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* ═══ NOS CLIENTS ═══ */}
        <ClientLogos />

        {/* ═══ POURQUOI NOUS CHOISIR ═══ */}
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-center mb-12">
                <Badge variant="secondary" className="mb-3 bg-amber-100 text-amber-700 border-amber-200">
                  <Sparkles className="h-3 w-3 mr-1" /> Avantages
                </Badge>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Pourquoi <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">nous choisir</span> ?</h2>
                <p className="mt-3 text-muted-foreground max-w-xl mx-auto leading-relaxed">
                  Ce qui nous distingue des autres freelances et agences à Bamako.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { icon: Zap, title: 'Réactivité Extraordinaire', desc: "Réponse en moins de 30 minutes sur WhatsApp. Pas de formulaire sans suivi, pas d'attente de 48h. Je suis disponible 7j/7.", color: 'from-amber-400 to-orange-500' },
                  { icon: Target, title: '100% Personnalisé', desc: "Aucun template pré-fait. Chaque projet est conçu de zéro selon votre identité, vos couleurs et votre vision. Votre marque est unique.", color: 'from-emerald-400 to-teal-500' },
                  { icon: ThumbsUp, title: 'Satisfaction Garantie', desc: 'Révisions illimitées sur les offres Premium. Je ne livre que lorsque vous êtes 100% satisfait du résultat final.', color: 'from-blue-400 to-indigo-500' },
                  { icon: Lock, title: 'Paiement via WhatsApp', desc: 'Commandez et payez directement via WhatsApp avec Orange Money, MTN MoMo ou autre. Simple, rapide et sécurisé. Confirmation instantanée pour Sacko.', color: 'from-purple-400 to-violet-500' },
                  { icon: Users, title: '3 Experts Unis', desc: 'Sacko pour le design, Camara Leh pour le web, Kante pour le marketing. Trois coachs complémentaires pour couvrir tous vos besoins.', color: 'from-cyan-400 to-blue-500' },
                  { icon: Heart, title: 'Passion Africaine', desc: 'Nous comprenons le marché malien et africain. Nos créations sont pensées pour plaire à votre clientele locale et vous démarquer.', color: 'from-rose-400 to-pink-500' },
                ].map((item, i) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    className="group p-6 rounded-2xl border border-border hover:border-amber-200 dark:hover:border-amber-800 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color} text-white shadow-lg mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                      <item.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-base font-extrabold mb-2">{item.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ═══ COMPARISON TABLE ═══ */}
        <section className="py-16 sm:py-20 bg-gradient-to-b from-background to-muted/20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <Badge variant="secondary" className="mb-3 bg-amber-100 text-amber-700 border-amber-200">
                <Sparkles className="h-3 w-3 mr-1" /> Comparaison
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Découverte vs Premium</h2>
              <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
                Un aperçu clair de ce que chaque formule inclut. Testez gratuitement, puis passez au niveau supérieur.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-border">
                    <th className="text-left p-4 text-sm font-bold">Fonctionnalité</th>
                    <th className="p-4 text-sm font-bold text-center">
                      <span className="inline-flex items-center gap-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-3 py-1.5 rounded-full text-xs font-bold">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Découverte
                      </span>
                    </th>
                    <th className="p-4 text-sm font-bold text-center">
                      <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-md shadow-amber-500/20">
                        <Star className="h-3.5 w-3.5 fill-current" /> Premium
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feature: 'Prix', decouverte: 'Gratuit', premium: 'Sur devis' },
                    { feature: 'Nombre de révisions', decouverte: '1 révision', premium: 'Illimité' },
                    { feature: 'Fichiers sources', decouverte: false, premium: true },
                    { feature: 'Charte graphique', decouverte: false, premium: true },
                    { feature: 'Support personnalisé', decouverte: 'Groupe WhatsApp', premium: 'Individuel' },
                    { feature: 'Certificat', decouverte: false, premium: true },
                    { feature: 'Suivi post-livraison', decouverte: false, premium: true },
                    { feature: 'Bonus (Canva Pro, etc.)', decouverte: false, premium: true },
                    { feature: 'Délai de livraison', decouverte: 'Standard', premium: 'Prioritaire' },
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="p-4 text-sm font-medium">{row.feature}</td>
                      <td className="p-4 text-center">
                        {typeof row.decouverte === 'boolean' ? (
                          row.decouverte ? <CheckCircle2 className="h-5 w-5 text-emerald-500 mx-auto" /> : <span className="text-muted-foreground text-xs">—</span>
                        ) : (
                          <span className="text-sm text-emerald-600 dark:text-emerald-400 font-semibold">{row.decouverte}</span>
                        )}
                      </td>
                      <td className="p-4 text-center bg-amber-50/50 dark:bg-amber-950/10">
                        {typeof row.premium === 'boolean' ? (
                          row.premium ? <CheckCircle2 className="h-5 w-5 text-amber-500 mx-auto" /> : <span className="text-muted-foreground text-xs">—</span>
                        ) : (
                          <span className="text-sm text-amber-600 dark:text-amber-400 font-bold">{row.premium}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ═══ ESTIMATEUR DE PRIX ═══ */}
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <Badge variant="secondary" className="mb-3 bg-violet-100 text-violet-700 border-violet-200">
                <Calculator className="h-3 w-3 mr-1" /> Estimateur
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Estimez votre <span className="bg-gradient-to-r from-violet-500 to-purple-500 bg-clip-text text-transparent">budget</span></h2>
              <p className="mt-3 text-muted-foreground max-w-lg mx-auto">
                Sélectionnez les services qui vous intéressent et obtenez une estimation instantanée.
              </p>
            </div>
            <Card className="border-2 border-violet-200 dark:border-violet-800 overflow-hidden">
              <CardContent className="p-6 space-y-4">
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    { id: 'logo', label: 'Logo Professionnel', icon: Palette, priceRange: [0, 15000] },
                    { id: 'site', label: 'Site Web', icon: Globe, priceRange: [0, 50000] },
                    { id: 'video', label: 'Montage Vidéo', icon: MonitorPlay, priceRange: [0, 20000] },
                    { id: 'marketing', label: 'Marketing Digital', icon: Megaphone, priceRange: [0, 25000] },
                    { id: 'cv', label: 'Pack Carrière Pro', icon: FileCheck, priceRange: [700, 3500] },
                    { id: 'formation', label: 'Formation Premium', icon: GraduationCap, priceRange: [15000, 25000] },
                  ].map((s) => {
                    const selected = estimatorServices.includes(s.id)
                    return (
                      <button
                        key={s.id}
                        onClick={() => setEstimatorServices(prev => selected ? prev.filter(x => x !== s.id) : [...prev, s.id])}
                        className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                          selected
                            ? 'border-violet-500 bg-violet-50 dark:bg-violet-950/20 shadow-md shadow-violet-500/10'
                            : 'border-border hover:border-violet-300 dark:hover:border-violet-700 hover:bg-muted/50'
                        }`}
                      >
                        <div className={`flex h-10 w-10 items-center justify-center rounded-lg flex-shrink-0 transition-colors ${
                          selected ? 'bg-violet-500 text-white' : 'bg-muted text-muted-foreground'
                        }`}>
                          <s.icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold">{s.label}</p>
                          <p className="text-[11px] text-muted-foreground">{s.priceRange[0] === 0 ? 'Gratuit –' : ''} {s.priceRange[1].toLocaleString('fr-FR')} FCFA</p>
                        </div>
                        <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                          selected ? 'border-violet-500 bg-violet-500' : 'border-muted-foreground/30'
                        }`}>
                          {selected && <CheckCircle2 className="h-3.5 w-3.5 text-white" />}
                        </div>
                      </button>
                    )
                  })}
                </div>
                {estimatorServices.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950/20 dark:to-purple-950/20 rounded-xl p-5 border border-violet-200 dark:border-violet-800"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-bold">{estimatorServices.length} service{estimatorServices.length > 1 ? 's' : ''} sélectionné{estimatorServices.length > 1 ? 's' : ''}</span>
                      <span className="text-xs text-muted-foreground">Estimation</span>
                    </div>
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-3xl font-extrabold text-violet-600 dark:text-violet-400">
                        {(() => {
                          const services = [
                            { id: 'logo', priceRange: [0, 15000] },
                            { id: 'site', priceRange: [0, 50000] },
                            { id: 'video', priceRange: [0, 20000] },
                            { id: 'marketing', priceRange: [0, 25000] },
                            { id: 'cv', priceRange: [700, 3500] },
                            { id: 'formation', priceRange: [15000, 25000] },
                          ]
                          const min = estimatorServices.reduce((sum, id) => sum + (services.find(s => s.id === id)?.priceRange[0] || 0), 0)
                          const max = estimatorServices.reduce((sum, id) => sum + (services.find(s => s.id === id)?.priceRange[1] || 0), 0)
                          return min === 0 ? `0 – ${max.toLocaleString('fr-FR')}` : `${min.toLocaleString('fr-FR')} – ${max.toLocaleString('fr-FR')}`
                        })()}
                      </span>
                      <span className="text-sm text-muted-foreground font-medium">FCFA</span>
                    </div>
                    <a
                      href={`https://wa.me/22397787244?text=${encodeURIComponent(`Bonjour Sacko ! J'ai utilisé votre estimateur et je suis intéressé(e) par : ${estimatorServices.join(', ')}. Pouvez-vous me faire un devis précis ?`)}`}
                      target="_blank" rel="noopener noreferrer"
                    >
                      <Button className="w-full bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white font-bold shadow-lg shadow-violet-500/20">
                        <MessageCircle className="h-4 w-4 mr-2" /> Obtenir un devis précis sur WhatsApp
                      </Button>
                    </a>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </div>
        </section>

        {/* ═══ 6. SERVICES & TARIFS ═══ */}
        <section id="services" className="py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-3 bg-amber-100 text-amber-700 border-amber-200">
                <Sparkles className="h-3 w-3 mr-1" /> Tarifs
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Mes Services</h2>
              <p className="mt-3 text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Chaque service existe en deux formules : testez gratuitement avec l&apos;Offre Découverte, puis passez au Premium pour un résultat professionnel complet.
              </p>
              <div className="flex items-center justify-center gap-6 mt-5 text-xs">
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Découverte = Gratuit</span>
                <span className="flex items-center gap-1.5"><MessageCircle className="h-3.5 w-3.5 text-emerald-500" /> Premium = Via WhatsApp</span>
              </div>
            </div>

            <div className="space-y-8">
              {[
                {
                  cat: 'Design Graphique', icon: Palette, color: 'from-pink-500 to-rose-500', borderColor: 'border-pink-200 dark:border-pink-800',
                  decouverte: { title: 'Offre Découverte — Gratuit', desc: "Un logo simple pour démarrer. Texte stylisé + icône basique, 2 propositions au choix, 1 révision incluse. Idéal pour tester mon style avant de vous engager." },
                  premium: { title: 'Offre Premium', desc: "Logo professionnel vectorisé, décliné en couleur et noir/blanc, charte graphique complète (couleurs, typographies), fichiers sources livrés (AI, PSD, PNG haute résolution), révisions illimitées jusqu'à satisfaction." },
                },
                {
                  cat: 'Développement Web', icon: Globe, color: 'from-blue-500 to-indigo-500', borderColor: 'border-blue-200 dark:border-blue-800',
                  decouverte: { title: 'Offre Découverte — Gratuite', desc: 'Une landing page 1 page, responsive (mobile/ordinateur), pour présenter votre activité en ligne rapidement.' },
                  premium: { title: 'Offre Premium', desc: 'Site multi-pages sur mesure, formulaire de contact fonctionnel, déploiement et hébergement inclus, nom de domaine personnalisé, maintenance mensuelle disponible en option.' },
                },
                {
                  cat: 'Montage Vidéo', icon: MonitorPlay, color: 'from-purple-500 to-violet-500', borderColor: 'border-purple-200 dark:border-purple-800',
                  decouverte: { title: 'Offre Découverte — Gratuite', desc: "Montage court (moins d'une minute), coupe simple sans effets avancés. Parfait pour un aperçu rapide." },
                  premium: { title: 'Offre Premium', desc: 'Montage complet avec effets visuels, sous-titres, musique libre de droits, export optimisé pour réseaux sociaux ou YouTube.' },
                },
                {
                  cat: 'Formation', icon: GraduationCap, color: 'from-emerald-500 to-teal-500', borderColor: 'border-emerald-200 dark:border-emerald-800',
                  decouverte: { title: 'Offre Découverte — Gratuite', desc: "Session d'initiation de 30 minutes pour découvrir mes outils et méthodes." },
                  premium: { title: 'Offre Premium', desc: 'Parcours de formation complet avec suivi personnalisé, support après formation, et certificat de participation.' },
                },
                {
                  cat: 'Marketing Digital', icon: Megaphone, color: 'from-cyan-500 to-blue-500', borderColor: 'border-cyan-200 dark:border-cyan-800',
                  decouverte: { title: 'Offre Découverte — Gratuite', desc: "Une affiche ou post réseau social simple pour promouvoir votre activité. Format prêt à publier, 1 révision incluse." },
                  premium: { title: 'Offre Premium', desc: "Stratégie complète : affiches, posts, stories, bannières publicitaires pour Facebook/Instagram/TikTok. Charte visuelle réseaux sociaux, calendrier éditorial de 7 jours." },
                },
              ].map((section) => (
                <Card key={section.cat} className={`border ${section.borderColor} overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-1.5 hover:scale-[1.01]`}>
                  <div className={`h-1.5 bg-gradient-to-r ${section.color}`} />
                  <CardContent className="p-5 sm:p-7">
                    <div className="flex items-center gap-3 mb-5">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${section.color} text-white shadow-lg`}>
                        <section.icon className="h-5 w-5" />
                      </div>
                      <h3 className="text-lg font-extrabold">{section.cat}</h3>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                        <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" /></span>
                        Disponible
                      </div>
                      <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                        {availabilitySlots[section.cat] || 2}/5 places
                      </span>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20 p-4 sm:p-5">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white text-xs font-bold">✓</span>
                          <h4 className="text-sm font-bold text-emerald-700 dark:text-emerald-400">{section.decouverte.title}</h4>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed mb-4">{section.decouverte.desc}</p>
                        <a
                          href={`https://wa.me/22397787244?text=${encodeURIComponent(`Bonjour ! Je veux l'Offre Découverte : ${section.cat}. C'est gratuit, je veux tester !`)}`}
                          target="_blank" rel="noopener noreferrer"
                        >
                          <Button variant="outline" className="w-full border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 font-semibold text-xs h-10">
                            <Gift className="h-3.5 w-3.5 mr-1.5" /> Essayer gratuitement
                          </Button>
                        </a>
                      </div>
                      <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20 p-4 sm:p-5">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-500 text-white text-xs font-bold">★</span>
                          <h4 className="text-sm font-bold text-amber-700 dark:text-amber-400">{section.premium.title}</h4>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed mb-4">{section.premium.desc}</p>
                        <a
                        href={`https://wa.me/22397787244?text=${encodeURIComponent(`Bonjour ! Je suis intéressé(e) par l'Offre Premium : ${section.cat}. Pouvez-vous me donner un devis ?`)}`}
                        target="_blank" rel="noopener noreferrer"
                      >
                        <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs h-10 shadow-md shadow-amber-500/20">
                          <MessageCircle className="h-3.5 w-3.5 mr-1.5" /> Commander via WhatsApp
                        </Button>
                      </a>
                    </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Bonus Luxe */}
              <Card className="border-0 shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white p-5 sm:p-7">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <a href="https://www.canva.com/brand/join?token=nbyqrtelBOlUiCNiK170Ew&referrer=team-invite" target="_blank" rel="noopener noreferrer" className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm shadow-lg flex-shrink-0 hover:bg-white/30 transition-colors">
                      <img src="/canva-pro-real.png" alt="Canva Pro" className="h-8 w-8 rounded-lg object-cover" />
                    </a>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-base">Bonus : Accès Premium Offert</h3>
                        <Badge className="bg-white/20 text-white border-0 text-[10px]">NOUVEAU</Badge>
                      </div>
                      <p className="text-sm text-white/90 leading-relaxed">Chaque formation inclut un <a href="https://www.canva.com/brand/join?token=nbyqrtelBOlUiCNiK170Ew&referrer=team-invite" target="_blank" rel="noopener noreferrer" className="font-bold underline underline-offset-2 hover:text-amber-300 transition-colors">accès gratuit à Canva Pro</a>, CapCut Pro ou PicsArt Pro. C&apos;est mon cadeau pour vous accompagner dans la pratique.</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* ═══ 7. CARRIÈRE PRO ═══ */}
        <section id="carriere-pro" className="py-16 sm:py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-background" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.08),transparent_50%),radial-gradient(circle_at_70%_70%,rgba(245,158,11,0.06),transparent_50%)]" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-white">
            <div className="text-center mb-12">
              <Badge className="mb-3 bg-blue-500/20 text-blue-300 border-blue-500/30 hover:bg-blue-500/30">
                <GraduationCap className="h-3 w-3 mr-1" /> Carrière Pro
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Offre à la <span className="text-blue-400">Carte</span></h2>
              <p className="mt-3 text-slate-400 max-w-xl mx-auto">
                5 services clés pour booster votre employabilité. Chaque prestation est livrée sous 24h.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
              {[
                { icon: PenTool, name: 'Plume Pro', sub: 'Lettre de motivation', price: '800', hook: 'La lettre qui donne envie de lire votre CV.', color: 'from-blue-500 to-cyan-500' },
                { icon: FileCheck, name: 'Relooking CV', sub: 'Refonte de CV', price: '700', hook: 'Votre parcours, une nouvelle vitrine.', color: 'from-emerald-500 to-teal-500' },
                { icon: Building2, name: 'Impact LinkedIn', sub: 'Profil LinkedIn', price: '2 000', hook: 'Le profil que les recruteurs remarquent en premier.', color: 'from-indigo-500 to-purple-500' },
                { icon: Target, name: 'Objectif Entretien', sub: 'Préparation entretien', price: '500', hook: "Les questions pièges de votre secteur, décortiquées.", color: 'from-amber-500 to-orange-500' },
                { icon: BadgeCheck, name: 'Réseautage Pro', sub: 'Carte de visite', price: '1 500', hook: 'Un premier contact, une impression durable.', color: 'from-rose-500 to-pink-500' },
              ].map((s) => (
                <Card key={s.name} className="h-full backdrop-blur-xl bg-white/[0.04] border border-white/[0.08] hover:border-blue-400/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/5 group">
                  <CardContent className="p-6 relative">
                    <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${s.color} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-500`} />
                    <div className="relative">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${s.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          <s.icon className="h-5 w-5" />
                        </div>
                        <span className="text-xl font-extrabold text-white">{s.price} <span className="text-xs font-normal text-slate-400">FCFA</span></span>
                      </div>
                      <h3 className="text-lg font-bold text-white">{s.name}</h3>
                      <p className="text-xs text-slate-500 mb-2">{s.sub}</p>
                      <p className="text-sm text-slate-300 leading-relaxed mb-4">{s.hook}</p>
                      <a
                        href={`https://wa.me/22397787244?text=${encodeURIComponent(`Bonjour ! Je souhaite commander : ${s.name} (${s.sub}) — ${s.price} FCFA.`)}`}
                        target="_blank" rel="noopener noreferrer"
                      >
                        <Button size="sm" className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs h-9">
                          <MessageCircle className="h-3.5 w-3.5 mr-1.5" /> Commander {s.price} F
                        </Button>
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pack Lancement Carrière */}
            <Card className="border-2 border-amber-400/40 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <CardContent className="p-6 sm:p-8 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-10">
                  <div className="flex-1 text-center lg:text-left">
                    <Badge className="mb-3 bg-amber-500/20 text-amber-300 border-amber-500/30">
                      <Trophy className="h-3 w-3 mr-1" /> Pack Lancement Carrière
                    </Badge>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">CV Premium + Lettre + LinkedIn + Guide entretien</h3>
                    <p className="text-slate-300 leading-relaxed mb-2">
                      <span className="bg-amber-500/20 text-amber-300 text-xs font-bold px-2 py-0.5 rounded mr-1">Guide entretien offert</span>
                      Tout ce qu&apos;il faut pour candidater sans stress — et sans mauvaise surprise.
                    </p>
                    <div className="flex items-baseline gap-3 mt-4">
                      <span className="text-xl text-slate-500 line-through">4 800 FCFA</span>
                      <span className="text-3xl font-extrabold text-white">3 500 FCFA</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-3 flex-shrink-0">
                    <a href="https://wa.me/22397787244?text=Bonjour%20!%20Je%20veux%20le%20Pack%20Lancement%20Carri%C3%A8re%20%C3%A0%203%20500%20FCFA." target="_blank" rel="noopener noreferrer">
                      <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold shadow-xl shadow-amber-500/25 px-6 whitespace-nowrap">
                        <MessageCircle className="h-5 w-5 mr-2" /> Commander le Pack 3 500 F
                      </Button>
                    </a>
                    <span className="text-[10px] text-slate-500">Économie de 1 300 FCFA</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Raréité */}
            <div className="mt-6 text-center">
              <p className="text-sm text-slate-400">
                Qualité avant quantité : <span className="text-white font-bold">5 commandes/jour maximum</span>. Places restantes aujourd&apos;hui : <span className="inline-flex items-center gap-1.5 text-amber-400 font-bold"><span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />2/5</span>
              </p>
            </div>
          </div>
        </section>

        {/* ═══ 8. 4 DOMAINES POUR GAGNER DE L'ARGENT (ENRICHED) ═══ */}
        <section id="gagner-argent" className="py-20 sm:py-28">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <Badge variant="secondary" className="mb-3 bg-emerald-100 text-emerald-700 border-emerald-200">
                <TrendingUp className="h-3 w-3 mr-1" /> Revenus
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">4 Domaines pour <span className="text-emerald-600 dark:text-emerald-400">Gagner de l&apos;Argent</span></h2>
              <p className="mt-4 text-muted-foreground max-w-lg mx-auto leading-relaxed">
                <strong className="text-foreground">4 compétences concrètes</strong> qui génèrent des revenus réels au Mali — avec des tarifs basés sur ce que le marché paie.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              {[
                {
                  icon: Target,
                  title: 'Contenu Réseaux Sociaux',
                  price: '3 000+ FCFA/mois',
                  color: 'from-pink-500 to-rose-500',
                  desc: 'Crée des visuels pros pour les boutiques de Bamako. Stories, reels, affiches — les entreprises payent mensuel.',
                  revenus: '30 000 – 150 000 FCFA/mois',
                },
                {
                  icon: MessageCircle,
                  title: 'Chatbots WhatsApp',
                  price: '10 000+ FCFA/mois',
                  color: 'from-green-500 to-emerald-500',
                  desc: "WhatsApp = N°1 au Mali. Automatise les réponses 24h/24 et vends des abonnements de maintenance aux entrepreneurs.",
                  revenus: '50 000 – 200 000 FCFA/mois',
                },
                {
                  icon: Globe,
                  title: 'Sites Web & Landing Pages',
                  price: '30 000 – 150 000 FCFA/projet',
                  color: 'from-blue-500 to-indigo-500',
                  desc: 'Chaque boutique à Bamako mérite un site. Livraison en 1-3 jours, hébergement inclus. 2-5 projets par mois possible.',
                  revenus: '60 000 – 500 000 FCFA/mois',
                },
                {
                  icon: UserCheck,
                  title: 'Freelance Digital',
                  price: '5 000 FCFA/session coaching',
                  color: 'from-amber-500 to-orange-500',
                  desc: "Trouve tes premiers clients sur WhatsApp, fixe tes tarifs, construis une réputation. De 0 à 100 000 FCFA/mois possible.",
                  revenus: '50 000 – 300 000 FCFA/mois',
                },
              ].map((d) => (
                <Card key={d.title} className="overflow-hidden border-0 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                  <div className={`h-1 bg-gradient-to-r ${d.color}`} />
                  <CardContent className="p-5 relative">
                    <div className={`absolute inset-x-0 top-0 h-32 bg-gradient-to-br ${d.color} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 rounded-t-none`} />
                    <div className="relative">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${d.color} text-white shadow-md flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                          <d.icon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-bold text-sm leading-tight">{d.title}</h3>
                          <p className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">{d.price}</p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed mb-4">{d.desc}</p>
                      <div className="flex items-center justify-between pt-3 border-t">
                        <span className="text-[11px] text-muted-foreground">Revenus : <strong className="text-amber-600 dark:text-amber-400">{d.revenus}</strong></span>
                        <a
                          href={`https://wa.me/22397787244?text=${encodeURIComponent(`Bonjour ! Je suis intéressé(e) par : ${d.title}. J'aimerais en savoir plus.`)}`}
                          target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 hover:text-amber-700 dark:text-amber-400 transition-colors"
                        >
                          Détails <ArrowRight className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-10 text-center">
              <p className="text-sm text-muted-foreground">
                Je t&apos;accompagne dans <strong className="text-foreground">chacun de ces domaines</strong> avec mes formations et mon coaching.
                <a href="#formations" className="text-amber-600 font-semibold hover:underline ml-1">Voir les formations</a>.
              </p>
            </div>
          </div>
        </section>

        {/* ═══ AD BANNER — Between Services & Formations ═══ */}
        <div className="py-4">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <AdsterraBanner placement="native" />
            <div className="mt-3">
              <AdBanner />
            </div>
          </div>
        </div>

        {/* ═══ 9. FORMATIONS VEDETTES ═══ */}
        <section id="formations" className="py-16 sm:py-20 text-white" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)' }}>
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Decorative glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative text-center mb-12">
              <Badge className="mb-3 bg-amber-500/20 text-amber-300 border-amber-500/30 hover:bg-amber-500/30">
                <GraduationCap className="h-3 w-3 mr-1" /> Formations
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Formations pour <span className="text-amber-400">maîtriser le digital</span></h2>
              <p className="mt-4 text-slate-300 max-w-2xl mx-auto leading-relaxed">
                J&apos;ai créé ces formations pour partager ce que je sais, de manière simple et pratique. Commencez gratuitement, puis passez au Premium si vous voulez aller plus loin avec un suivi personnalisé.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 mt-5">
                <div className="flex items-center gap-6 text-xs">
                  <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Découverte = Gratuit</span>
                  <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Premium = Prix fixe clair</span>
                </div>
              </div>
              {/* Groupe WhatsApp */}
              <a
                href="https://chat.whatsapp.com/Khpz5MVeokK9X9X5i3INX2"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-5 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 rounded-full px-5 py-2 text-emerald-400 text-xs font-semibold transition-colors"
              >
                <Users className="h-3.5 w-3.5" /> Rejoindre le groupe WhatsApp des formations — échangez avec les autres apprenants
              </a>
            </div>

            {/* ═══ PACK FORMATION COMPLÈTE — Mis en avant ═══ */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6 }}
              className="relative mt-10 rounded-3xl overflow-hidden"
            >
              {/* Animated border glow */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 p-[2px]">
                <div className="absolute inset-0 rounded-3xl bg-slate-900" />
              </div>
              {/* Glow behind card */}
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-red-500/20 rounded-3xl blur-xl -z-10" />

              <div className="relative p-6 sm:p-8 lg:p-10">
                {/* Top banner */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 text-white shadow-lg shadow-amber-500/30">
                      <GraduationCap className="h-7 w-7" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-xl sm:text-2xl font-extrabold text-white">Pack Formation Complète</h3>
                        <span className="inline-flex items-center gap-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[9px] font-bold px-2.5 py-1 rounded-full shadow animate-pulse">
                          <Flame className="h-2.5 w-2.5" /> OFFRE LIMITÉE
                        </span>
                      </div>
                      <p className="text-sm text-slate-400 mt-0.5">Toutes les 4 formations Premium en un seul pack</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm text-slate-500 line-through">80 000 FCFA</p>
                    <div className="flex items-baseline gap-1 justify-end">
                      <span className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400 bg-clip-text text-transparent">3 000</span>
                      <span className="text-sm text-slate-400 font-semibold">FCFA</span>
                    </div>
                    <p className="text-[10px] text-emerald-400 font-bold mt-0.5">Économisez 77 000 FCFA</p>
                  </div>
                </div>

                {/* 4 formations included */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                  {[
                    { title: 'Design Graphique', desc: 'Photoshop, Illustrator, branding', icon: Palette, color: 'from-pink-500 to-rose-500' },
                    { title: 'Montage Vidéo', desc: 'Premiere, DaVinci, motion design', icon: MonitorPlay, color: 'from-purple-500 to-violet-500' },
                    { title: 'Création Web', desc: 'JavaScript, sites multi-pages, SEO', icon: Code, color: 'from-blue-500 to-cyan-500' },
                    { title: 'Marketing Digital', desc: 'Facebook/TikTok Ads, calendrier éditorial', icon: Megaphone, color: 'from-emerald-500 to-teal-500' },
                  ].map((f, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors">
                      <div className={`flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${f.color} text-white flex-shrink-0`}>
                        <f.icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white truncate">{f.title}</p>
                        <p className="text-[10px] text-slate-500 truncate">{f.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* All bonuses + features */}
                <div className="grid sm:grid-cols-2 gap-x-8 gap-y-2 mb-6">
                  {[
                    'Canva Pro offert pendant 30 jours',
                    'CapCut Pro offert pendant 30 jours',
                    'Hébergement web offert 1 an',
                    'Pack 50 templates exclusifs',
                    'Certificat de participation pour chaque formation',
                    'Suivi individuel post-formation',
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <a
                  href={`https://wa.me/22397787244?text=${encodeURIComponent('Bonjour Sacko ! Je suis intéressé(e) par le Pack Formation Complète à 3 000 FCFA (au lieu de 80 000). Les 4 formations Premium + tous les bonus. Comment procéder ?')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:via-orange-600 hover:to-red-600 text-white font-bold text-sm shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Zap className="h-4 w-4" /> Obtenir le Pack Complet — 3 000 FCFA
                  <ArrowRight className="h-4 w-4" />
                </a>
                <p className="text-center text-[10px] text-slate-500 mt-2.5">Paiement Orange Money / Moov Money — Accès immédiat après confirmation</p>
              </div>
            </motion.div>

            {/* 4 Featured formation cards */}
            <div className="space-y-6">
              {featuredFormations.map((form, idx) => (
                <motion.div
                  key={form.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="relative rounded-2xl bg-slate-800/60 border border-white/10 overflow-hidden hover:border-white/20 transition-all duration-300"
                >
                  {/* Formation header */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 sm:p-6 border-b border-white/5">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${form.color} text-white shadow-lg flex-shrink-0`}>
                      <form.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-lg font-extrabold text-white">{form.title}</h3>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          form.level === 'Débutant' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                          'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}>{form.level}</span>
                      </div>
                      <p className="text-sm text-slate-400 mt-0.5">{form.subtitle}</p>
                      <div className="flex items-center gap-4 text-[11px] text-slate-500 mt-1.5">
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{form.duration}</span>
                        <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" />{form.lessons}</span>
                        <span className="flex items-center gap-1"><Users className="h-3 w-3" />Coach {form.coach}</span>
                      </div>
                    </div>
                  </div>

                  {/* Découverte / Premium grid */}
                  <div className="grid sm:grid-cols-2">
                    {/* Découverte */}
                    <div className="p-5 sm:p-6 border-r border-white/5">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white text-xs font-bold">✓</span>
                        <h4 className="text-sm font-bold text-emerald-400">Offre Découverte — Gratuit</h4>
                      </div>
                      <ul className="space-y-2 mb-5">
                        {form.decouverte.features.map((f, fi) => (
                          <li key={fi} className="flex items-start gap-2 text-xs text-slate-300 leading-relaxed">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>
                      <a
                        href={`https://wa.me/22397787244?text=${encodeURIComponent(`Bonjour ! Je veux rejoindre la formation ${form.title} — Offre Découverte (Gratuit).`)}`}
                        target="_blank" rel="noopener noreferrer"
                      >
                        <Button variant="outline" className="w-full border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/50 font-semibold text-xs h-10">
                          <Gift className="h-3.5 w-3.5 mr-1.5" /> Commencer gratuitement
                        </Button>
                      </a>
                    </div>

                    {/* Premium */}
                    <div className="p-5 sm:p-6 relative">
                      {/* Popular badge */}
                      <div className="absolute top-3 right-3">
                        <span className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[9px] font-bold px-2.5 py-1 rounded-full shadow-lg shadow-amber-500/20">
                          <Star className="h-2.5 w-2.5 fill-current" /> RECOMMANDÉ
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-500 text-white text-xs font-bold">★</span>
                        <h4 className="text-sm font-bold text-amber-400">Offre Premium</h4>
                      </div>
                      <div className="flex items-baseline gap-1 mb-4">
                        <span className="text-2xl font-extrabold text-white">{form.premium.price}</span>
                        <span className="text-sm text-slate-500">FCFA</span>
                      </div>
                      <ul className="space-y-2 mb-4">
                        {form.premium.features.map((f, fi) => (
                          <li key={fi} className="flex items-start gap-2 text-xs text-slate-300 leading-relaxed">
                            <CheckCircle2 className="h-3.5 w-3.5 text-amber-500 mt-0.5 flex-shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>
                      {form.premium.bonus && (
                        <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                          <Gift className="h-3.5 w-3.5 text-amber-400 flex-shrink-0" />
                          <span className="text-[11px] text-amber-300 font-medium">{form.premium.bonus}</span>
                        </div>
                      )}
                      <a
                        href={`https://wa.me/22397787244?text=${encodeURIComponent(`Bonjour Sacko ! Je suis intéressé(e) par la formation Premium ${form.title} (${form.premium.price} FCFA). Comment y accéder ?`)}`}
                        target="_blank" rel="noopener noreferrer"
                      >
                        <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs h-10 shadow-lg shadow-amber-500/20">
                          <MessageCircle className="h-3.5 w-3.5 mr-1.5" /> S'inscrire {form.premium.price} F
                        </Button>
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Autres formations disponibles */}
            <div className="mt-12">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-4">Autres formations disponibles</p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {otherFormations.map((form, i) => (
                  <a
                    key={i}
                    href={`https://wa.me/22397787244?text=${encodeURIComponent(`Bonjour Sacko ! Je suis intéressé(e) par : ${form.text}. Pouvez-vous me donner plus de détails ?`)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="group flex items-center gap-3 p-3 rounded-xl bg-slate-800/60 border border-white/10 hover:bg-slate-700/60 hover:border-amber-400/30 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-500/5 transition-all duration-300 cursor-pointer"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 flex-shrink-0">
                      <form.icon className="h-4 w-4 text-slate-400 group-hover:text-amber-400 transition-colors" />
                    </div>
                    <p className="text-xs font-medium text-slate-300 group-hover:text-white transition-colors flex-1">{form.text}</p>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 ${
                      form.level === 'Débutant' ? 'bg-emerald-500/20 text-emerald-400' :
                      form.level === 'Intermédiaire' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-violet-500/20 text-violet-400'
                    }`}>{form.level}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-white/20 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══ 10. NOS COACHS ═══ */}
        <section id="coachs" className="py-16 sm:py-20 relative overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(245,158,11,0.08),transparent_50%),radial-gradient(circle_at_80%_50%,rgba(6,182,212,0.06),transparent_50%),radial-gradient(circle_at_50%_80%,rgba(16,185,129,0.05),transparent_50%)]" />
          <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <Badge className="mb-3 bg-amber-500/20 text-amber-300 border-amber-500/30 hover:bg-amber-500/30">
                <Users className="h-3 w-3 mr-1" /> Notre Équipe
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">3 Coachs <span className="text-amber-400">experts</span> à votre service</h2>
              {/* Animated underline */}
              <div className="mt-4 mx-auto h-1 w-24 rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-red-500" />
              <p className="mt-4 text-slate-400 max-w-2xl mx-auto leading-relaxed">
                Pas de théorie abstraite : chaque coach pratique activement dans son domaine à Bamako. Vous apprenez de personnes qui vivent de leur compétence au quotidien.
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-6">
              {coaches.map((coach, i) => (
                <motion.div
                  key={coach.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  onClick={() => setSelectedCoach(coach)}
                  className="group relative rounded-2xl backdrop-blur-xl bg-white/[0.04] border border-white/[0.08] hover:border-amber-400/30 p-6 sm:p-8 text-center transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl hover:shadow-amber-500/10 cursor-pointer"
                >
                  {/* Glow effect */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${coach.gradient} opacity-0 group-hover:opacity-[0.06] transition-opacity duration-500`} />
                  <div className="relative">
                    {/* Avatar */}
                    <div className="relative mx-auto mb-5">
                      <div className={`h-24 w-24 rounded-full bg-gradient-to-br ${coach.gradient} flex items-center justify-center text-white text-3xl font-extrabold shadow-2xl mx-auto ring-4 ring-slate-800/50 group-hover:scale-110 transition-transform duration-500`}>
                        {coach.initial}
                      </div>
                      {i === 0 && (
                        <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[8px] font-bold px-3 py-1 rounded-full shadow-lg shadow-amber-500/30 whitespace-nowrap">
                          FONDATEUR
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-extrabold text-white">{coach.name}</h3>
                    <p className="text-xs text-amber-400 font-semibold mt-1">{coach.role}</p>

                    {/* Skill tags */}
                    <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3">
                      {coach.speciality.split(', ').map((skill) => (
                        <span key={skill} className="text-[10px] font-medium text-slate-400 bg-white/[0.06] border border-white/[0.08] px-2 py-0.5 rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Bio */}
                    <p className="text-xs text-slate-400 leading-relaxed mt-4">{coach.bio}</p>

                    {/* Stats */}
                    <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-white/[0.06]">
                      {coach.stats.map((stat) => (
                        <div key={stat.label} className="text-center">
                          <div className="text-base font-extrabold text-white">{stat.value}</div>
                          <div className="text-[9px] text-slate-500">{stat.label}</div>
                        </div>
                      ))}
                    </div>

                    {/* WhatsApp button */}
                    <a
                      href={`https://wa.me/22397787244?text=${encodeURIComponent(`Bonjour ! Je souhaite être encadré(e) par ${coach.name} pour une formation.`)}`}
                      target="_blank" rel="noopener noreferrer"
                      className="mt-5 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 hover:from-emerald-600 hover:to-teal-600 hover:shadow-emerald-500/30 transition-all hover:scale-105"
                    >
                      <MessageCircle className="h-3.5 w-3.5" /> Contacter {coach.name.split(' ')[0]}
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ 11. BOUTIQUE LIVRES ═══ */}
        <section id="boutique" className="py-16 sm:py-20 bg-gradient-to-b from-muted/30 to-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-3 bg-amber-100 text-amber-700 border-amber-200">
                <BookOpen className="h-3 w-3 mr-1" /> Boutique
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Nos <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">Livres & Ebooks</span></h2>
              <p className="mt-4 text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Des guides pratiques rédigés par des experts actifs. Cliquez sur un livre pour voir les détails. Payez directement sur le site et recevez votre livre instantanément.
              </p>
              <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-3">
                <div className="inline-flex items-center gap-2 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-full px-5 py-2">
                  <span className="text-2xl font-extrabold text-amber-600">1 000</span>
                  <span className="text-sm font-semibold text-amber-700 dark:text-amber-400">FCFA / livre</span>
                </div>
              </div>
            </div>

            {/* Search & Category filter */}
            <div className="space-y-4 mb-8">
              {/* Search bar */}
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un livre par titre, auteur ou mot-clé..."
                  value={bookSearch}
                  onChange={(e) => setBookSearch(e.target.value)}
                  className="pl-10 h-11 bg-background border-border rounded-xl text-sm"
                />
                {bookSearch && (
                  <button onClick={() => setBookSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              {/* Category filter pills */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {bookCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setBookFilter(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                    bookFilter === cat
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/20'
                      : 'bg-muted text-muted-foreground hover:bg-amber-50 hover:text-amber-700 dark:hover:bg-amber-950/30 dark:hover:text-amber-400 border border-transparent hover:border-amber-200 dark:hover:border-amber-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
              {books.filter((b) => (bookFilter === 'Tous' || b.category === bookFilter) && (!bookSearch || b.title.toLowerCase().includes(bookSearch.toLowerCase()) || b.author.toLowerCase().includes(bookSearch.toLowerCase()) || b.desc.toLowerCase().includes(bookSearch.toLowerCase()) || b.category.toLowerCase().includes(bookSearch.toLowerCase()))).length === 0 && (
                <div className="col-span-full text-center py-12">
                  <Search className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">Aucun livre ne correspond à votre recherche.</p>
                  <button onClick={() => { setBookSearch(''); setBookFilter('Tous') }} className="text-amber-600 text-xs font-semibold mt-2 hover:underline">Réinitialiser les filtres</button>
                </div>
              )}
              {books.filter((b) => (bookFilter === 'Tous' || b.category === bookFilter) && (!bookSearch || b.title.toLowerCase().includes(bookSearch.toLowerCase()) || b.author.toLowerCase().includes(bookSearch.toLowerCase()) || b.desc.toLowerCase().includes(bookSearch.toLowerCase()) || b.category.toLowerCase().includes(bookSearch.toLowerCase()))).map((book, i) => (
                <motion.div
                  key={book.title + i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.4, delay: (i % 5) * 0.08 }}
                  className="group flex flex-col"
                >
                  {/* Book cover with real image */}
                  <div
                    className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-lg group-hover:shadow-2xl group-hover:-translate-y-2 transition-all duration-300 cursor-pointer bg-muted"
                    onClick={() => setSelectedBook(book)}
                  >
                    <img
                      src={book.cover}
                      alt={book.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    {/* Price tag */}
                    <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-sm text-amber-700 text-[10px] font-extrabold px-2.5 py-1 rounded-lg shadow-md">
                      1 000 F
                    </div>
                    {/* Cart/Favorite button */}
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleCart(book.title); toast({ title: isInCart(book.title) ? 'Retiré du panier' : 'Ajouté au panier !', description: isInCart(book.title) ? '' : `${book.title} est dans votre panier.` }) }}
                      className={`absolute top-2 left-2 z-10 flex h-8 w-8 items-center justify-center rounded-full shadow-md transition-all duration-200 ${isInCart(book.title) ? 'bg-emerald-500 text-white' : 'bg-white/90 text-muted-foreground hover:text-red-500 backdrop-blur-sm'}`}
                      aria-label={isInCart(book.title) ? 'Retirer du panier' : 'Ajouter au panier'}
                    >
                      <ShoppingCart className="h-4 w-4" />
                    </button>
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 backdrop-blur-sm text-foreground text-[11px] font-bold px-3 py-1.5 rounded-full shadow-lg">
                        Voir les détails
                      </div>
                    </div>
                    {/* Bottom gradient for title */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 pt-8">
                      <h3 className="text-[11px] sm:text-xs font-extrabold text-white leading-tight line-clamp-2">{book.title}</h3>
                      <p className="text-[9px] text-white/70 mt-0.5">{book.author}</p>
                    </div>
                  </div>
                  {/* Order buttons */}
                  <div className="mt-2.5 flex gap-1.5">
                    <a
                      href={`https://wa.me/22397787244?text=${encodeURIComponent(`Bonjour Sacko ! Je veux commander le livre : ${book.title} par ${book.author} (1 000 FCFA). Comment procéder ?`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1"
                    >
                      <Button
                        className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white text-[11px] font-bold h-9 shadow-sm"
                      >
                        <MessageCircle className="h-3 w-3 mr-1" /> Commander
                      </Button>
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* ═══ LIVRES RECOMMANDÉS ═══ */}
            <div className="mt-10">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Flame className="h-5 w-5 text-orange-500" />
                Populaires en ce moment
              </h3>
              <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide">
                {[
                  books.find(b => b.title === 'Écrire des livres avec ChatGPT'),
                  books.find(b => b.title === 'E-marketing & E-commerce'),
                  books.find(b => b.title === 'WordPress pour les Nuls'),
                  books.find(b => b.title === 'Programmer en Langage C'),
                ].filter(Boolean).map((book) => book && (
                  <div
                    key={book!.title}
                    className="flex-shrink-0 w-36 cursor-pointer group"
                    onClick={() => setSelectedBook(book!)}
                  >
                    <div className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-md group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-300 bg-muted">
                      <img src={book!.cover} alt={book!.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 pt-6">
                        <p className="text-[10px] font-bold text-white line-clamp-2 leading-tight">{book!.title}</p>
                      </div>
                      <div className="absolute top-1.5 right-1.5 bg-amber-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md">
                        TOP
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Book Detail Modal */}
            <AnimatePresence>
              {selectedBook && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                  onClick={() => setSelectedBook(null)}
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    className="relative bg-background rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => setSelectedBook(null)}
                      className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors backdrop-blur-sm"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <div className="flex flex-col sm:flex-row">
                      <div className="sm:w-48 flex-shrink-0">
                        <img src={selectedBook.cover} alt={selectedBook.title} className="w-full h-64 sm:h-full object-cover" />
                      </div>
                      <div className="p-5 sm:p-6 flex flex-col flex-1 max-h-[70vh] overflow-y-auto">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <Badge variant="secondary" className="bg-amber-100 text-amber-700 border-amber-200 text-[10px]">
                            <BookOpen className="h-2.5 w-2.5 mr-1" /> 1 000 FCFA
                          </Badge>
                          <Badge variant="outline" className="text-[10px] text-muted-foreground">
                            {selectedBook.category}
                          </Badge>
                        </div>
                        <h3 className="text-lg font-extrabold leading-tight">{selectedBook.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">par <span className="font-semibold text-foreground">{selectedBook.author}</span></p>

                        {/* Extrait */}
                        <div className="mt-4 p-3 rounded-xl bg-muted/50 border border-border">
                          <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Extrait</p>
                          <p className="text-sm text-foreground/80 leading-relaxed">{selectedBook.excerpt}</p>
                        </div>

                        {/* Points clés */}
                        <div className="mt-4 space-y-1.5">
                          <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Ce que vous allez apprendre</p>
                          {selectedBook.keypoints.map((point) => (
                            <div key={point} className="flex items-start gap-2 text-xs text-foreground/80">
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                              <span>{point}</span>
                            </div>
                          ))}
                        </div>

                        {/* Livraison info */}
                        <div className="mt-4 pt-3 border-t border-border space-y-1.5">
                          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                            <Zap className="h-3 w-3 text-amber-500" />
                            <span>Livraison instantanée via WhatsApp</span>
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                            <FileCheck className="h-3 w-3 text-amber-500" />
                            <span>Format PDF — lisible sur téléphone et PC</span>
                          </div>
                        </div>

                        <a
                          href={`https://wa.me/22397787244?text=${encodeURIComponent(`Bonjour Sacko ! Je veux commander le livre : ${selectedBook.title} par ${selectedBook.author} (1 000 FCFA). Comment procéder ?`)}`}
                          target="_blank" rel="noopener noreferrer"
                          onClick={() => setSelectedBook(null)}
                        >
                          <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold shadow-lg shadow-amber-500/20 h-12">
                            <MessageCircle className="h-4 w-4 mr-2" /> Commander 1 000 F
                          </Button>
                        </a>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ═══ COUNTDOWN PROMO ═══ */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-10"
            >
              <Card className="border-2 border-red-300 dark:border-red-800 overflow-hidden">
                <div className="bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 p-4 sm:p-5 text-white text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Flame className="h-5 w-5" />
                    <span className="text-sm sm:text-base font-extrabold uppercase tracking-wider">Offre Spéciale — Fin dans</span>
                    <Flame className="h-5 w-5" />
                  </div>
                  <div className="flex items-center justify-center gap-2 sm:gap-3 mt-3">
                    {[
                      { val: countdown.days, label: 'Jours' },
                      { val: countdown.hours, label: 'Heures' },
                      { val: countdown.minutes, label: 'Min' },
                      { val: countdown.seconds, label: 'Sec' },
                    ].map((unit, i) => (
                      <div key={unit.label} className="flex items-center gap-2 sm:gap-3">
                        <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 sm:px-4 sm:py-3 min-w-[56px] sm:min-w-[64px] border border-white/20">
                          <div className="text-2xl sm:text-3xl font-extrabold tabular-nums leading-none">{String(unit.val).padStart(2, '0')}</div>
                          <div className="text-[9px] sm:text-[10px] font-medium text-white/80 mt-1 uppercase tracking-wider">{unit.label}</div>
                        </div>
                        {i < 3 && <span className="text-xl sm:text-2xl font-bold text-white/60 animate-pulse">:</span>}
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Pack promo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-6"
            >
              <Card className="border-2 border-amber-300 dark:border-amber-700 overflow-hidden">
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg flex-shrink-0">
                      <FolderDown className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base">Pack Complet — Tous les 12 livres</h3>
                      <p className="text-sm text-muted-foreground mt-0.5">Économisez 5 000 FCFA en prenant le pack complet</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="text-right">
                      <span className="text-xs text-muted-foreground line-through">12 000 FCFA</span>
                      <div className="text-2xl font-extrabold text-amber-600">7 000 <span className="text-sm font-normal">FCFA</span></div>
                    </div>
                    <a href={`https://wa.me/22397787244?text=${encodeURIComponent('Bonjour Sacko ! Je veux commander le Pack Complet de 12 livres (7 000 FCFA au lieu de 12 000). Comment procéder ?')}`} target="_blank" rel="noopener noreferrer" className="block">
                      <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold shadow-lg shadow-amber-500/20 whitespace-nowrap">
                        <MessageCircle className="h-4 w-4 mr-1.5" /> Commander le Pack 7 000 F
                      </Button>
                    </a>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* ═══ 12. PORTFOLIO ═══ */}
        <section id="portfolio" className="py-16 sm:py-20 bg-gradient-to-b from-background via-purple-50/30 to-background dark:via-purple-950/10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-3 bg-purple-100 text-purple-700 border-purple-200">
                <Eye className="h-3 w-3 mr-1" /> Portfolio
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Mes Réalisations</h2>
              <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
                Découvrez une sélection de mes meilleurs travaux. Chaque projet est unique et réalisé avec passion pour mes clients.
              </p>
            </div>

            {/* Filter tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
              {['Tous', 'Logo', 'Affiche', 'Site Web', 'Vidéo', 'Identité'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setPortfolioFilter(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${portfolioFilter === cat ? 'bg-purple-500 text-white shadow-md shadow-purple-500/25' : 'bg-muted text-muted-foreground hover:bg-accent'}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {[
                { title: 'Logo Restaurant Le Baobab', category: 'Logo', image: 'https://sfile.chatglm.cn/images-ppt/3e8dbebc34bb.jpg', desc: 'Identité visuelle complète pour un restaurant traditionnel malien' },
                { title: 'Affiche Festival Bamako', category: 'Affiche', image: 'https://sfile.chatglm.cn/images-ppt/0c5c9b1b948b.jpg', desc: 'Affiche événementielle pour un festival culturel à Bamako' },
                { title: 'Site Web MaliTech Solutions', category: 'Site Web', image: 'https://sfile.chatglm.cn/images-ppt/1b5dd4b88cdf.png', desc: 'Site vitrine professionnel pour une entreprise tech malienne' },
                { title: 'Logo Afro Fashion Store', category: 'Logo', image: 'https://sfile.chatglm.cn/images-ppt/57c1b49a60ba.jpg', desc: 'Logo moderne pour une boutique de mode africaine' },
                { title: 'Montage Promo Produit', category: 'Vidéo', image: 'https://sfile.chatglm.cn/images-ppt/190eb04b2085.jpg', desc: 'Montage vidéo promotionnel pour un lancement de produit' },
                { title: 'Identité ESIA Business', category: 'Identité', image: 'https://sfile.chatglm.cn/images-ppt/7bfadf1e1582.jpg', desc: 'Charte graphique complète pour une école de business' },
              ].filter((item) => portfolioFilter === 'Tous' || item.category === portfolioFilter).map((item) => (
                <Card key={item.title} className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 h-full group cursor-pointer hover:-translate-y-0.5"
                  onClick={() => setLightboxImg({ src: item.image, title: item.title, desc: item.desc })}>
                  <div className="relative h-48 sm:h-56 overflow-hidden">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                      <h3 className="font-bold text-sm sm:text-base text-white">{item.title}</h3>
                      <p className="text-white/70 text-xs mt-1 line-clamp-2">{item.desc}</p>
                    </div>
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-amber-500/90 text-white border-0 text-[10px] font-semibold backdrop-blur-sm">{item.category}</Badge>
                    </div>
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-white/20 backdrop-blur-sm rounded-full p-2">
                      <Search className="h-4 w-4 text-white" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Avant / Après — integrated into Portfolio */}
            <div className="mt-14">
              <h3 className="text-xl font-bold text-center mb-2">Avant / Après</h3>
              <p className="text-sm text-muted-foreground text-center mb-8 max-w-xl mx-auto">Glissez le curseur pour comparer mes transformations. Chaque projet est unique et pensé pour maximiser l&apos;impact visuel.</p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { title: 'Refonte Logo Boutique', before: 'https://sfile.chatglm.cn/images-ppt/f972157605f2.jpg', after: 'https://sfile.chatglm.cn/images-ppt/082b6f181c95.jpg', desc: 'Logo basique transformé en identité premium' },
                  { title: 'Affiche Événement', before: 'https://sfile.chatglm.cn/images-ppt/d2c6b53ee01b.jpg', after: 'https://sfile.chatglm.cn/images-ppt/d247ebeec9b2.jpg', desc: 'Affiche simple devenue visuel professionnel' },
                  { title: 'Identité Complète', before: 'https://sfile.chatglm.cn/images-ppt/6c9261ec8848.jpg', after: 'https://sfile.chatglm.cn/images-ppt/0c5c9b1b948b.jpg', desc: "De l'amateur au professionnalisme total" },
                ].map((item, i) => (
                  <Card key={i} className="overflow-hidden border-0 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <CardContent className="p-4 space-y-3">
                      <BeforeAfterSlider before={item.before} after={item.after} title={item.title} />
                      <h4 className="font-bold text-sm">{item.title}</h4>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground">
                Envie d&apos;un projet similaire ?{' '}
                <a href="https://wa.me/22397787244?text=Bonjour%20!%20J%27ai%20vu%20vos%20réalisations%20et%20je%20souhaite%20un%20projet%20similaire." target="_blank" rel="noopener noreferrer" className="text-amber-600 font-semibold hover:underline">
                  Me contacter
                </a>{' '}et discutons de votre projet !
              </p>
            </div>
          </div>
        </section>

        {/* ═══ 12. TÉMOIGNAGES (Style WhatsApp Auto-Carousel) ═══ */}
        <section id="temoignages" className="py-20 sm:py-24 bg-gradient-to-b from-muted/20 to-background relative overflow-hidden">
          <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <Badge variant="secondary" className="mb-3 bg-emerald-100 text-emerald-700 border-emerald-200">
                <MessageCircle className="h-3 w-3 mr-1" /> Témoignages
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Ils m&apos;ont fait confiance</h2>
              <p className="mt-4 text-muted-foreground max-w-xl mx-auto leading-relaxed">
                Des <strong className="text-foreground">messages réels</strong> de mes clients. Pas de faux avis — que du concret, livré sur WhatsApp.
              </p>
            </div>

            {/* Phone mockup with auto-scrolling testimonials */}
            <div className="max-w-md mx-auto" onMouseEnter={() => setTestimPaused(true)} onMouseLeave={() => setTestimPaused(false)}>
              {/* WhatsApp phone frame */}
              <div className="bg-[#075e54] rounded-t-3xl p-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm">S</div>
                <div className="flex-1">
                  <p className="text-white font-bold text-sm">Sacko — Studio Créatif</p>
                  <p className="text-white/60 text-[11px]">En ligne</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setTestimPaused(!testimPaused)} className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors" aria-label={testimPaused ? 'Lecture' : 'Pause'}>
                    {testimPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="bg-[#ece5dd] dark:bg-[#1a2730] rounded-b-3xl p-4 min-h-[280px] flex flex-col justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={testimIndex}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                    className="flex justify-end"
                  >
                    <div className="max-w-[85%]">
                      <div className="bg-[#005c4b] rounded-xl rounded-tr-sm px-4 py-3 shadow-sm">
                        <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">
                          {[
                            { name: 'Amadou Diallo', time: '14:32', text: "Sacko, le logo est parfait ! 🙏 Je l'ai déjà mis sur ma boutique. Mes clients demandent qui a fait ça. Merci fréro, je te recommande à tous mes amis entrepreneurs.", status: 'Lu à 14:35' },
                            { name: 'Fatoumata Traoré', time: '09:15', text: "La formation en design m'a ouvert les yeux. En 2 semaines j'ai déjà créé 3 logos pour des gens de mon quartier et je gagne 15 000 FCFA. C'est fou 🎉", status: 'Lu à 09:20' },
                            { name: 'Ibrahim Keita', time: '18:47', text: "Mon site est en ligne depuis 3 jours et j'ai déjà eu 12 clients qui m'ont trouvé sur Google. Avant personne ne me connaissait en dehors de Hamdallaye. Service exceptionnel.", status: 'Lu à 18:50' },
                            { name: 'Oumar Sidibé', time: '11:03', text: "Les visuels pour mes affiches de boutique sont incroyables. Mon chiffre d'affaires a augmenté de 40% ce mois-ci. Quand est-ce qu'on refait une commande ? 😊", status: 'Lu à 11:08' },
                          ][testimIndex].text}
                        </p>
                        <div className="flex items-center justify-end gap-1.5 mt-1.5">
                          <span className="text-white/50 text-[10px]">{[
                            { name: 'Amadou Diallo', time: '14:32' },
                            { name: 'Fatoumata Traoré', time: '09:15' },
                            { name: 'Ibrahim Keita', time: '18:47' },
                            { name: 'Oumar Sidibé', time: '11:03' },
                          ][testimIndex].time}</span>
                          <svg className="h-4 w-4 text-[#53bdeb]" viewBox="0 0 16 11" fill="currentColor"><path d="M11.071.653a.457.457 0 0 0-.304-.102.493.493 0 0 0-.381.178l-6.19 7.636-2.011-2.085a.463.463 0 0 0-.336-.143.457.457 0 0 0-.336.143.476.476 0 0 0 0 .672l2.359 2.443a.457.457 0 0 0 .336.143c.137 0 .268-.061.381-.178l6.527-8.039a.507.507 0 0 0-.045-.668z"/><path d="M14.071.653a.457.457 0 0 0-.304-.102.493.493 0 0 0-.381.178l-6.19 7.636-1.019-1.056.457-.56a.507.507 0 0 0-.045-.668.457.457 0 0 0-.685 0l-.681.837-.07.012a.463.463 0 0 0-.336.143.476.476 0 0 0 0 .672l2.359 2.443a.457.457 0 0 0 .336.143c.137 0 .268-.061.381-.178l6.527-8.039a.507.507 0 0 0-.045-.668z" opacity=".4"/></svg>
                        </div>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-1.5 text-right">
                        — <strong>{[
                          { name: 'Amadou Diallo' },
                          { name: 'Fatoumata Traoré' },
                          { name: 'Ibrahim Keita' },
                          { name: 'Oumar Sidibé' },
                        ][testimIndex].name}</strong>, client vérifié
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>
                {/* Dots navigation */}
                <div className="flex items-center justify-center gap-2 mt-6">
                  {[0, 1, 2, 3].map((i) => (
                    <button
                      key={i}
                      onClick={() => setTestimIndex(i)}
                      className={`h-2 rounded-full transition-all duration-300 ${i === testimIndex ? 'w-6 bg-amber-500' : 'w-2 bg-amber-500/30 hover:bg-amber-500/50'}`}
                      aria-label={`Témoignage ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Trust note */}
            <div className="mt-8 text-center">
              <p className="text-xs text-muted-foreground">
                Chaque message est <strong className="text-foreground">réel</strong>, reçu directement sur mon WhatsApp.
                Envie d&apos;être le prochain ?{' '}
                <a href="#commande-rapide" className="text-amber-600 font-semibold hover:underline">Commandez maintenant</a>.
              </p>
            </div>

            {/* Testimonial cards grid */}
            <div className="mt-10 grid sm:grid-cols-2 gap-4">
              {[
                { name: 'Aminata Coulibaly', text: "La formation Marketing Digital a changé ma façon de voir les réseaux sociaux. En 1 mois, j'ai géré 3 comptes et je gagne maintenant 50 000 FCFA par mois. Merci Kante pour l'accompagnement !", rating: 5 },
                { name: 'Moussa Traoré', text: "Mon site web créé par Camara Leh est incroyable. Il est rapide, beau et mes clients le trouvent facilement sur Google. Un vrai game changer pour mon entreprise.", rating: 5 },
                { name: 'Djénéba Diarra', text: "Sacko a refait toute mon identité visuelle : logo, cartes de visite, affiches. Mes clients me disent que je looks professionnel maintenant. Service au top !", rating: 5 },
                { name: 'Ibrahim Kanté', text: "J'ai suivi la formation Création Web et en 3 semaines j'ai pu créer mon propre site e-commerce. Je vends mes produits en ligne maintenant. Formation pratique et efficace.", rating: 5 },
              ].map((t, i) => (
                <motion.div
                  key={t.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="p-5 rounded-xl bg-muted/50 border border-border hover:border-amber-200 dark:hover:border-amber-800 transition-all hover:shadow-md"
                >
                  <div className="flex items-center gap-0.5 mb-2">
                    {[...Array(t.rating)].map((_, s) => (
                      <Star key={s} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed mb-3">"{t.text}"</p>
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-xs font-bold">
                      {t.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-xs font-bold">{t.name}</p>
                      <p className="text-[10px] text-muted-foreground">Client vérifié</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* ── Google & Facebook Reviews ── */}
            <div className="mt-14">
              <div className="flex items-center justify-center gap-3 mb-8">
                <div className="h-px flex-1 bg-border" />
                <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <svg className="h-4 w-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                  Google
                  <span className="text-border">|</span>
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  Facebook
                </div>
                <div className="h-px flex-1 bg-border" />
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: 'Amadou D.', source: 'google', text: "Excellent travail ! Sacko a créé le logo de mon restaurant en 48h. Le résultat dépasse mes attentes. Je recommande vivement pour tout projet de design à Bamako.", rating: 5, date: 'Il y a 2 semaines', service: 'Création de logo' },
                  { name: 'Fatoumata T.', source: 'facebook', text: "La formation design est incroyable. En 3 semaines je crée mes propres visuels pour ma boutique. Le suivi WhatsApp est top, toujours disponible pour répondre.", rating: 5, date: 'Il y a 1 mois', service: 'Formation Design' },
                  { name: 'Ibrahim K.', source: 'google', text: "Mon site web est maintenant premier sur Google pour 'boutique tissus Bamako'. Le SEO est vraiment efficace. Merci Sacko pour ton professionnalisme !", rating: 5, date: 'Il y a 3 semaines', service: 'Création de site web' },
                  { name: 'Oumar S.', source: 'facebook', text: "Les affiches publicitaires ont fait exploser mes ventes pendant le ramadan. Qualité pro, délai respecté, et les prix sont très corrects pour le Mali.", rating: 4, date: 'Il y a 2 mois', service: 'Design graphique' },
                  { name: 'Djénéba D.', source: 'google', text: "Identité visuelle complète pour mon salon de beauté : logo, cartes, flyers. Tout est cohérent et mes clientes remarquent. Merci beaucoup !", rating: 5, date: 'Il y a 1 semaine', service: 'Branding' },
                  { name: 'Moussa T.', source: 'facebook', text: "J'ai commandé une vidéo promo pour mon commerce. Le montage est de qualité télévisuelle. Sacko a un vrai talent et comprend ce que le client veut.", rating: 5, date: 'Il y a 3 semaines', service: 'Montage vidéo' },
                ].map((review, i) => (
                  <motion.div
                    key={review.name + review.source}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    className="relative p-5 rounded-xl border bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 group"
                  >
                    {/* Source badge */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1.5">
                        {review.source === 'google' ? (
                          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                        ) : (
                          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                        )}
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                          {review.source === 'google' ? 'Avis Google' : 'Avis Facebook'}
                        </span>
                      </div>
                      <span className="text-[10px] text-muted-foreground">{review.date}</span>
                    </div>

                    {/* Stars */}
                    <div className="flex items-center gap-0.5 mb-2.5">
                      {[...Array(5)].map((_, s) => (
                        <Star
                          key={s}
                          className={`h-3.5 w-3.5 ${s < review.rating ? 'fill-amber-400 text-amber-400' : 'fill-muted text-muted'}`}
                        />
                      ))}
                    </div>

                    {/* Review text */}
                    <p className="text-sm text-foreground/80 leading-relaxed mb-3">"{review.text}"</p>

                    {/* Author */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`h-7 w-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold ${review.source === 'google' ? 'bg-blue-500' : 'bg-blue-600'}`}>
                          {review.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="text-xs font-semibold">{review.name}</span>
                      </div>
                      <Badge variant="secondary" className="text-[9px] px-2 py-0 h-4 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-0">
                        {review.service}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Overall rating summary */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-2xl font-bold text-foreground">4.9</span>
                <span className="text-sm text-muted-foreground">sur 87 avis</span>
              </div>
              <div className="hidden sm:block h-8 w-px bg-border" />
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="text-xs border-blue-200 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 gap-1.5 px-3 py-1">
                  <svg className="h-3 w-3" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                  4.8 Google
                </Badge>
                <Badge variant="outline" className="text-xs border-blue-200 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 gap-1.5 px-3 py-1">
                  <svg className="h-3 w-3" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  5.0 Facebook
                </Badge>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ 15. COMMANDE RAPIDE (Formulaire Qualifiant) ═══ */}
        <section id="commande-rapide" className="py-20 sm:py-24">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <Card className="border-0 shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 p-1">
                <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 text-white p-6 sm:p-8">
                  <div className="text-center">
                    <Zap className="h-8 w-8 mx-auto mb-2" />
                    <h2 className="text-2xl sm:text-3xl font-extrabold">Démarrez Votre Projet</h2>
                    <p className="mt-2 text-white/80 text-sm">Dites-moi ce dont vous avez besoin — je vous réponds vite avec une proposition claire et honnête.</p>
                    <div className="mt-4 inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-1.5 text-white text-xs font-semibold border border-white/20">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                      </span>
                      Disponible maintenant — réponse sous 30 min
                    </div>
                  </div>
                </div>
              </div>
              <CardContent className="p-6 sm:p-8 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Service souhaité *</Label>
                    <select
                      value={quickOrder.service}
                      onChange={(e) => setQuickOrder(prev => ({ ...prev, service: e.target.value }))}
                      className="w-full h-11 rounded-md border border-input bg-background px-3 text-sm"
                    >
                      <option value="">Sélectionnez un service...</option>
                      <option disabled className="font-semibold text-muted-foreground">── Design & Création ──</option>
                      <option value="Logo Professionnel — Gratuit">Logo Professionnel — Gratuit</option>
                      <option value="Affiche Professionnelle — Gratuit">Affiche Professionnelle — Gratuit</option>
                      <option value="Identité Visuelle Complète — Gratuit">Identité Visuelle Complète — Gratuit</option>
                      <option disabled className="font-semibold text-muted-foreground">── Web & Vidéo ──</option>
                      <option value="Site Web Simple — Gratuit">Site Web Simple — Gratuit</option>
                      <option value="Site Web Professionnel — Gratuit">Site Web Professionnel — Gratuit</option>
                      <option value="Montage Vidéo Pro — Gratuit">Montage Vidéo Pro — Gratuit</option>
                      <option value="Post Réseaux Sociaux — Gratuit">Post Réseaux Sociaux — Gratuit</option>
                      <option disabled className="font-semibold text-muted-foreground">── Carrière Pro ──</option>
                      <option value="Pack Lancement Carrière — 3 500 FCFA">Pack Lancement Carrière — 3 500 FCFA</option>
                      <option value="Relooking CV — 700 FCFA">Relooking CV — 700 FCFA</option>
                      <option value="Impact LinkedIn — 2 000 FCFA">Impact LinkedIn — 2 000 FCFA</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Secteur d&apos;activité</Label>
                    <select
                      value={quickOrder.description}
                      onChange={(e) => setQuickOrder(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full h-11 rounded-md border border-input bg-background px-3 text-sm"
                    >
                      <option value="">Votre secteur...</option>
                      <option value="Commerce / Boutique">Commerce / Boutique</option>
                      <option value="Restauration / Alimentation">Restauration / Alimentation</option>
                      <option value="Éducation / Formation">Éducation / Formation</option>
                      <option value="Tech / Informatique">Tech / Informatique</option>
                      <option value="Mode / Beauté">Mode / Beauté</option>
                      <option value="Transport / Logistique">Transport / Logistique</option>
                      <option value="Santé / Bien-être">Santé / Bien-être</option>
                      <option value="BTP / Immobilier">BTP / Immobilier</option>
                      <option value="Art / Culture">Art / Culture</option>
                      <option value="Autre">Autre</option>
                    </select>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Votre nom *</Label>
                    <Input placeholder="Ex: Amadou Diallo" value={quickOrder.name} onChange={(e) => setQuickOrder(prev => ({ ...prev, name: e.target.value }))} className="h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Téléphone WhatsApp *</Label>
                    <Input type="tel" placeholder="+223 XX XX XX XX" value={quickOrder.phone} onChange={(e) => setQuickOrder(prev => ({ ...prev, phone: e.target.value }))} className="h-11" />
                  </div>
                </div>
                <Button
                  onClick={async () => {
                    if (!quickOrder.service || !quickOrder.name || !quickOrder.phone) {
                      toast({ title: 'Champs requis', description: 'Service, nom et téléphone sont obligatoires.', variant: 'destructive' })
                      return
                    }
                    // Extract amount from service string if present
                    const amountMatch = quickOrder.service.match(/(\d[\d\s]*)\s*FCFA/i)
                    const amount = amountMatch ? amountMatch[1].replace(/\s/g, '') + ' FCFA' : ''

                    // Save order to API
                    try {
                      const res = await fetch('/api/orders', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          service: quickOrder.service,
                          secteur: quickOrder.description || '',
                          name: quickOrder.name,
                          phone: quickOrder.phone,
                          amount,
                        }),
                      })
                      const data = await res.json()
                      if (data.success && data.orderId) {
                        toast({
                          title: 'Commande enregistrée !',
                          description: `Votre numéro : ${data.orderId}. Gardez-le pour suivre votre commande.`,
                          duration: 8000,
                        })
                        setLastOrderId(data.orderId)
                      }
                    } catch {
                      // API failed, still proceed to WhatsApp
                    }

                    triggerConfetti()
                    const msg = encodeURIComponent(
                      `Bonjour Sacko ! Je souhaite un service.\n\n` +
                      `Service : ${quickOrder.service}\n` +
                      `Secteur : ${quickOrder.description || 'Non précisé'}\n` +
                      `Nom : ${quickOrder.name}\n` +
                      `Téléphone : ${quickOrder.phone}\n\n` +
                      `Je suis prêt(e) à discuter de mon projet. Merci !`
                    )
                    window.open(`https://wa.me/22397787244?text=${msg}`, '_blank')
                  }}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold h-12 text-sm shadow-lg shadow-emerald-500/20"
                >
                  <Send className="h-4 w-4 mr-2" /> Envoyer ma demande
                </Button>
                <p className="text-[11px] text-muted-foreground text-center">
                  Vos données restent <strong>privées</strong>. Je vous recontacte uniquement pour votre projet.
                </p>
              </CardContent>
            </Card>

            {/* Order Tracking */}
            <Card className="border-0 shadow-lg overflow-hidden mt-6">
              <div className="p-6 sm:p-8">
                <div className="flex items-center gap-2 mb-4">
                  <Search className="h-5 w-5 text-amber-500" />
                  <h3 className="font-bold text-base">Suivre votre commande</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">Entrez votre numéro de commande pour vérifier l&apos;avancement.</p>
                <div className="flex gap-2">
                  <Input
                    placeholder="Ex: SC-M123ABC"
                    value={trackId}
                    onChange={(e) => setTrackId(e.target.value.toUpperCase())}
                    className="h-11 font-mono text-sm"
                  />
                  <Button
                    onClick={async () => {
                      if (!trackId) return
                      setTrackLoading(true)
                      setTrackResult(null)
                      try {
                        const res = await fetch(`/api/orders?id=${encodeURIComponent(trackId)}`)
                        const data = await res.json()
                        if (data.success) {
                          setTrackResult(data.order)
                        } else {
                          toast({ title: 'Non trouvé', description: 'Aucune commande avec ce numéro.', variant: 'destructive' })
                        }
                      } catch {
                        toast({ title: 'Erreur', description: 'Impossible de vérifier. Réessayez.', variant: 'destructive' })
                      }
                      setTrackLoading(false)
                    }}
                    disabled={trackLoading}
                    variant="outline"
                    className="h-11 px-6 font-semibold flex-shrink-0"
                  >
                    {trackLoading ? '...' : 'Vérifier'}
                  </Button>
                </div>
                {lastOrderId && (
                  <p className="text-xs text-emerald-600 font-medium mt-3">
                    Votre dernière commande : <span className="font-mono font-bold">{lastOrderId}</span>
                    <button onClick={() => { setTrackId(lastOrderId) }} className="ml-1 underline hover:no-underline">vérifier</button>
                  </p>
                )}
                {trackResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-5 p-4 rounded-xl border bg-muted/30"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono text-sm font-bold">{trackResult.id}</span>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                        trackResult.status === 'livree' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                        trackResult.status === 'en_cours' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                        trackResult.status === 'annulee' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                        'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      }`}>{trackResult.statusLabel}</span>
                    </div>
                    <p className="text-sm font-medium">{trackResult.service}</p>
                    <div className="flex items-center justify-between mt-3 text-[11px] text-muted-foreground">
                      <span>Créée : {new Date(trackResult.createdAt).toLocaleDateString('fr-FR')}</span>
                      <span>Mise à jour : {new Date(trackResult.updatedAt).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </motion.div>
                )}
              </div>
            </Card>
          </div>
        </section>

        {/* ═══ 16. À PROPOS ═══ */}
        <section id="apropos" className="py-16 sm:py-20 bg-gradient-to-b from-muted/30 to-background relative overflow-hidden">
          <div className="absolute top-10 left-10 h-64 w-64 bg-amber-200/20 dark:bg-amber-900/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 h-64 w-64 bg-orange-200/15 dark:bg-orange-900/10 rounded-full blur-3xl" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6 }}
            >
            <div className="max-w-3xl mx-auto space-y-6">
                <Badge variant="secondary" className="mb-3 bg-amber-100 text-amber-700 border-amber-200">
                  <Heart className="h-3 w-3 mr-1" /> Qui suis-je
                </Badge>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-center">À Propos de Sacko</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed text-center">
                  <p>
                    Salut ! Je suis <strong className="text-foreground">Sacko</strong>, un jeune créateur digital de Bamako. J&apos;ai commencé le design tout seul, en autodidacte, parce que je voyais des entrepreneurs autour de moi qui avaient besoin de visuels pro mais qui n&apos;avaient pas les moyens de payer des agences chères.
                  </p>
                  <p>
                    Au début, c&apos;était juste un passe-temps. Je créais des logos pour mes amis, des affiches pour les boutiques du quartier. Puis les gens ont commencé à me recommander, et petit à petit, Studio Créatif est né. Aujourd&apos;hui, j&apos;accompagne des entreprises et des porteurs de projets à Bamako et partout au Mali avec des services de <strong className="text-foreground">design graphique, création de sites web, montage vidéo et formations digitales</strong>.
                  </p>
                  <p>
                    Ce qui me motive, c&apos;est de voir un client recevoir son logo ou son site pour la première fois et dire &quot;C&apos;est exactement ce que je voulais !&quot;. Chaque projet est différent, chaque client a une histoire, et mon but c&apos;est de transformer cette histoire en une identité visuelle qui marque les esprits.
                  </p>
                </div>

                {/* Skills cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
                  {[
                    { emoji: '🎨', name: 'Design', tools: 'Canva, Photoshop, Illustrator' },
                    { emoji: '💻', name: 'Sites Web', tools: 'HTML, CSS, Next.js' },
                    { emoji: '🎬', name: 'Vidéo', tools: 'CapCut, Premiere Pro, DaVinci' },
                    { emoji: '📱', name: 'Réseaux', tools: 'Instagram, TikTok, Facebook' },
                  ].map((skill) => (
                    <div key={skill.name} className="text-center p-4 rounded-xl bg-muted/50 border hover:border-amber-200 dark:hover:border-amber-800 transition-colors">
                      <div className="text-2xl mb-2">{skill.emoji}</div>
                      <p className="text-sm font-bold">{skill.name}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">{skill.tools}</p>
                    </div>
                  ))}
                </div>

                {/* Personal touch */}
                <div className="mt-6 p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/10 border border-amber-200/50 dark:border-amber-800/30">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white font-bold text-sm flex-shrink-0 mt-0.5">S</div>
                    <div>
                      <p className="text-sm leading-relaxed">
                        <strong className="text-foreground">Ma promesse :</strong> pas de blabla, pas de faux résultats. Je montre ce que je sais faire, je livre dans les délais, et si le résultat ne vous plaît pas, je recommence. C&apos;est aussi simple que ça.
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">— Sacko, Bamako 🇲🇱</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3 justify-center">
                  <a href="#services">
                    <Button className="bg-amber-500 hover:bg-amber-600 text-white font-semibold">
                      Découvrir mes services <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </a>
                  <a href="https://chat.whatsapp.com/Khpz5MVeokK9X9X5i3INX2" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="font-semibold">
                      <MessageCircle className="mr-2 h-4 w-4 text-emerald-500" /> Rejoindre le groupe formation
                    </Button>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ═══ 17. FAQ ═══ */}
        <section id="faq" className="py-16 sm:py-20 bg-gradient-to-b from-emerald-50/40 to-background dark:from-emerald-950/10">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-3 bg-emerald-100 text-emerald-700 border-emerald-200">
                <MessageCircle className="h-3 w-3 mr-1" /> FAQ
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Questions Fréquentes</h2>
              <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
                Les réponses aux questions les plus posées. Si vous ne trouvez pas votre réponse, contactez-moi directement sur WhatsApp.
              </p>
            </div>
            {/* FAQ Search */}
            <div className="relative max-w-md mx-auto mb-6">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher dans la FAQ..."
                value={faqSearch}
                onChange={(e) => setFaqSearch(e.target.value)}
                className="pl-10 h-10 bg-background border-border rounded-xl text-sm"
              />
              {faqSearch && (
                <button onClick={() => setFaqSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="space-y-3">
              {(() => {
                const faqs = [
                  { q: "L'Offre Découverte est-elle vraiment 100% gratuite ?", a: "Oui, totalement. C'est ma manière de vous prouver la qualité de mon travail avant que vous ne décidiez de passer à une offre Premium payante. Aucun engagement requis, aucun frais caché." },
                  { q: "Quels sont les délais de livraison ?", a: "Les services \"Carrière Pro\" (CV, Lettres) sont livrés en moins de 24h. Pour les logos simples, comptez 48h, et pour un site web complet, entre 3 et 7 jours selon la complexité. Chaque projet a un suivi personnalisé." },
                  { q: "Puis-je demander des modifications si le résultat ne me plaît pas ?", a: "Absolument. Votre satisfaction est ma priorité. Pour l'Offre Découverte, une révision est incluse. Pour les offres Premium, les révisions sont illimitées jusqu'à ce que le résultat vous corresponde parfaitement. Je ne livre que lorsque vous êtes 100% satisfait." },
                  { q: "Pourquoi limitez-vous les commandes à 5 par jour ?", a: "Parce que je travaille seul et je veux que chaque client ait un vrai suivi. Mieux vaut faire 5 projets bien que 20 mal. Si je suis plein un jour, on planifie le lendemain, c'est tout." },
                  { q: "Comment se passe le paiement ?", a: "On discute sur WhatsApp, je vous donne un prix clair, et vous payez directement via Orange Money ou Moov Money. Pas de processus compliqué, pas de frais cachés. Dès que c'est confirmé, je commence le travail." },
                  { q: "Les formations sont-elles en ligne ou en présentiel ?", a: "Les formations sont 100% en ligne via WhatsApp et supports vidéo. Vous apprenez à votre rythme, avec un suivi personnalisé et un groupe WhatsApp pour poser vos questions." },
                ]
                const filtered = faqs.filter((f) => !faqSearch || f.q.toLowerCase().includes(faqSearch.toLowerCase()) || f.a.toLowerCase().includes(faqSearch.toLowerCase()))
                return filtered.length === 0 ? (
                  <div className="text-center py-8">
                    <Search className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Aucune question ne correspond à votre recherche.</p>
                  </div>
                ) : filtered.map((faq, i) => {
                  const isOpen = faqOpen === `faq-${i}`
                  return (
                    <Card key={i} className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
                      <button
                        onClick={() => setFaqOpen(isOpen ? null : `faq-${i}`)}
                        aria-expanded={isOpen}
                        className="w-full flex items-center justify-between p-5 text-left"
                      >
                        <h3 className="font-semibold text-sm pr-4">{faq.q}</h3>
                        <motion.div
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                          className="flex-shrink-0"
                        >
                          <ChevronUp className="h-4 w-4 text-muted-foreground" />
                        </motion.div>
                      </button>
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: 'easeInOut' }}
                            className="overflow-hidden"
                          >
                            <p className="text-sm text-muted-foreground leading-relaxed px-5 pb-5">{faq.a}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Card>
                  )
                })
              })()}
            </div>
            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground">
                Vous avez d&apos;autres questions ?{' '}
                <a href="#contact" className="text-amber-600 font-medium hover:underline">Contactez-moi</a> ou écrivez-moi directement sur{' '}
                <a href="https://wa.me/22397787244" target="_blank" rel="noopener noreferrer" className="text-emerald-600 font-medium hover:underline">WhatsApp</a>.
              </p>
            </div>
          </div>
        </section>

        {/* ═══ LEAD MAGNET — Cadeau Exclusif ═══ */}
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <Card className="border-0 shadow-xl overflow-hidden">
              <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-8 sm:p-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/10 rounded-full translate-y-1/2 -translate-x-1/2" />
                <div className="relative z-10 text-center mb-8">
                  <div className="inline-flex items-center gap-2 bg-amber-500/20 rounded-full px-4 py-1.5 text-amber-300 text-xs font-semibold mb-4 border border-amber-500/20">
                    <Gift className="h-3.5 w-3.5" /> Cadeau Exclusif pour les Entrepreneurs
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3">
                    10 Templates Canva <span className="text-amber-400">Gratuits</span>
                  </h2>
                  <p className="text-slate-300 leading-relaxed max-w-md mx-auto text-sm">
                    <strong className="text-white">Boostez la visibilité de votre business dès aujourd&apos;hui.</strong> Rejoignez ma liste de contacts et recevez instantanément un <strong className="text-white">pack de 10 templates Canva exclusifs</strong> conçus pour les boutiques et créateurs de Bamako.
                  </p>
                </div>
                <div className="relative z-10 flex flex-col sm:flex-row gap-3">
                  <Input
                    placeholder="Votre prénom"
                    value={leadMagnet.name}
                    onChange={(e) => setLeadMagnet(prev => ({ ...prev, name: e.target.value }))}
                    className="h-11 bg-white/10 border-white/20 text-white placeholder:text-slate-500 focus:border-amber-500/50"
                  />
                  <Input
                    placeholder="Votre numéro WhatsApp ou email"
                    value={leadMagnet.contact}
                    onChange={(e) => setLeadMagnet(prev => ({ ...prev, contact: e.target.value }))}
                    className="h-11 bg-white/10 border-white/20 text-white placeholder:text-slate-500 focus:border-amber-500/50"
                  />
                  <Button
                    onClick={() => {
                      if (!leadMagnet.name || !leadMagnet.contact) {
                        toast({ title: 'Champs requis', description: 'Prénom et contact sont obligatoires.', variant: 'destructive' })
                        return
                      }
                      triggerConfetti()
                      const msg = encodeURIComponent(
                        `Bonjour Sacko ! Je souhaite recevoir le pack de 10 templates Canva gratuit.\n\nPrénom : ${leadMagnet.name}\nContact : ${leadMagnet.contact}\n\nMerci !`
                      )
                      window.open(`https://wa.me/22397787244?text=${msg}`, '_blank')
                      toast({ title: 'Demande envoyée !', description: 'Vous recevrez votre pack de templates très rapidement.' })
                      setLeadMagnet({ name: '', contact: '' })
                    }}
                    className="h-11 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-sm shadow-lg shadow-amber-500/25 whitespace-nowrap px-6"
                  >
                    <Gift className="h-4 w-4 mr-1.5" /> Recevoir mon pack
                  </Button>
                </div>
                <p className="relative z-10 text-center text-[11px] text-slate-500 mt-4">
                  Aucun spam. Uniquement des ressources et opportunités pour votre business.
                </p>
              </div>
            </Card>
          </div>
        </section>

        {/* ═══ GARANTIES ═══ */}
        <section className="py-16 sm:py-20 bg-gradient-to-b from-muted/20 to-background">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-3 bg-amber-100 text-amber-700 border-amber-200">
                <ShieldCheck className="h-3 w-3 mr-1" /> Garanties
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Mes 4 Garanties pour Vous</h2>
              <p className="mt-3 text-muted-foreground max-w-xl mx-auto leading-relaxed">
                Chaque projet est protégé. Voici les engagements que je prends avec chaque client, sans exception.
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6 }}
            >
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                {
                  icon: ThumbsUp,
                  title: 'Satisfaction ou Révision',
                  desc: "Votre projet n'est pas terminé tant que vous n'êtes pas 100% satisfait. Révisions incluses.",
                  color: 'from-emerald-400 to-teal-500',
                  bg: 'bg-emerald-50 dark:bg-emerald-950/20',
                },
                {
                  icon: Timer,
                  title: 'Livraison dans les Délais',
                  desc: "CV et lettres en 24h, logos en 48h, sites web en 3-7 jours. Promesse tenue.",
                  color: 'from-amber-400 to-orange-500',
                  bg: 'bg-amber-50 dark:bg-amber-950/20',
                },
                {
                  icon: Lock,
                  title: 'Confidentialité Totale',
                  desc: 'Vos données, vos idées, vos fichiers restent strictement privés. Aucune partage tiers.',
                  color: 'from-blue-400 to-indigo-500',
                  bg: 'bg-blue-50 dark:bg-blue-950/20',
                },
                {
                  icon: MessageCircle,
                  title: 'Support WhatsApp 7j/7',
                  desc: "Un message, une réponse. Je suis disponible pour vous accompagner même après la livraison.",
                  color: 'from-purple-400 to-violet-500',
                  bg: 'bg-purple-50 dark:bg-purple-950/20',
                },
              ].map((g) => (
                <Card key={g.title} className={`border-0 shadow-md overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${g.bg}`}>
                  <div className={`h-1 bg-gradient-to-r ${g.color}`} />
                  <CardContent className="p-5 text-center">
                    <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${g.color} text-white shadow-lg mb-4`}>
                      <g.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-sm font-extrabold mb-2">{g.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{g.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            </motion.div>
          </div>
        </section>

        {/* ═══ RÉSULTATS CLIENTS ═══ */}
        <section className="py-16 sm:py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950/20 dark:via-teal-950/10 dark:to-cyan-950/20" />
          <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-center mb-12">
                <Badge variant="secondary" className="mb-3 bg-emerald-100 text-emerald-700 border-emerald-200">
                  <TrendingUp className="h-3 w-3 mr-1" /> Résultats
                </Badge>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Ils ont <span className="text-emerald-600 dark:text-emerald-400">transformé leur business</span></h2>
                <p className="mt-3 text-muted-foreground max-w-xl mx-auto leading-relaxed">
                  Des résultats concrets, mesurables. Voici ce que nos clients ont accompli après avoir travaillé avec Studio Créatif.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                  { client: 'Boutique Le Baobab', metric: '+40%', desc: "d'augmentation du chiffre d'affaires en 1 mois grâce au nouveau logo et aux visuels réseaux sociaux", icon: TrendingUp, color: 'from-emerald-500 to-teal-500' },
                  { client: 'MaliTech Solutions', metric: '+200', desc: 'visiteurs/jour sur le nouveau site web en seulement 2 semaines après le lancement', icon: Users, color: 'from-blue-500 to-indigo-500' },
                  { client: 'Restaurant Djoliba', metric: '3x', desc: "plus de commandes en ligne après la refonte de l'identité visuelle complète et des affiches promotionnelles", icon: Award, color: 'from-amber-500 to-orange-500' },
                  { client: 'Salon Awa Beauty', metric: '15K+', desc: 'vues sur la vidéo promotionnelle TikTok en 48h, générant 20+ nouvelles clientes', icon: Eye, color: 'from-purple-500 to-violet-500' },
                ].map((result, i) => (
                  <motion.div
                    key={result.client}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="group relative bg-background rounded-2xl border border-border p-5 sm:p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-emerald-200 dark:hover:border-emerald-800"
                  >
                    <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${result.color} text-white shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <result.icon className="h-6 w-6" />
                    </div>
                    <div className="text-3xl font-extrabold bg-gradient-to-r bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 mb-1">{result.metric}</div>
                    <h3 className="text-sm font-bold mb-2">{result.client}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{result.desc}</p>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 text-center">
                <p className="text-sm text-muted-foreground">
                  Envie de résultats similaires ?{' '}
                  <a href="https://wa.me/22397787244?text=Bonjour%20!%20J%27ai%20vu%20vos%20r%C3%A9sultats%20clients%20et%20je%20veux%20la%20m%C3%Aamme%20chose%20pour%20mon%20business." target="_blank" rel="noopener noreferrer" className="text-emerald-600 font-semibold hover:underline">
                    Discutons de votre projet
                  </a>
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Wave divider */}
        <div className="relative h-16 -mt-1 overflow-hidden">
          <svg className="absolute bottom-0 w-full" viewBox="0 0 1440 64" fill="none" preserveAspectRatio="none">
            <path d="M0 64L48 58C96 52 192 40 288 34C384 28 480 28 576 32C672 36 768 44 864 46C960 48 1056 44 1152 38C1248 32 1344 24 1392 20L1440 16V64H0Z" className="fill-amber-500" />
          </svg>
        </div>

        {/* ═══ 18. CTA FINAL ═══ */}
        <section className="py-16 sm:py-20 bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 h-64 w-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 h-64 w-64 bg-white/10 rounded-full blur-3xl" />
          </div>
          <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Prêt à faire passer votre communication <span className="bg-gradient-to-r from-white via-yellow-200 to-white bg-clip-text text-transparent animate-gradient-text">au niveau supérieur</span> ?
            </h2>
            <p className="mt-4 text-lg text-white/90 max-w-2xl mx-auto leading-relaxed">
              N&apos;attendez plus pour donner à votre entreprise l&apos;image qu&apos;elle mérite. Contactez-moi dès aujourd&apos;hui pour discuter de votre projet et obtenir un devis gratuit.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="https://wa.me/22397787244?text=Bonjour%20Sacko%20!%20Je%20suis%20pr%C3%AAt%20%C3%A0%20lancer%20mon%20projet%20de%20communication." target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-white text-amber-600 hover:bg-white/90 font-bold shadow-xl text-base px-8">
                  <MessageCircle className="h-5 w-5 mr-2" /> Commander via WhatsApp
                </Button>
              </a>
              <a href="https://wa.me/22397787244?text=Bonjour%20!%20J%27aimerais%20discuter%20de%20mon%20projet%20avec%20vous." target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 font-semibold text-base px-8">
                  M&apos;envoyer un message <Send className="ml-2 h-4 w-4" />
                </Button>
              </a>
            </div>
            <div className="mt-8 flex flex-col items-center gap-4">
              <div className="flex items-center gap-5 text-white/80 text-xs font-medium">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4" /> Livraison rapide</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4" /> Satisfaction garantie</span>
              </div>
              <div className="flex items-center gap-3 text-white/70 text-xs">
                <span className="px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 font-bold">Commande via WhatsApp</span>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ 19. CONTACT ═══ */}
        <section id="contact" className="py-16 sm:py-20 bg-gradient-to-b from-blue-50/40 to-background dark:from-blue-950/10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6 }}
            >
            <div className="grid lg:grid-cols-2 gap-12">
              <div>
                <Badge variant="secondary" className="mb-3 bg-blue-100 text-blue-700 border-blue-200">
                  <Send className="h-3 w-3 mr-1" /> Contact
                </Badge>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Contactez-Moi</h2>
                <p className="mt-3 text-muted-foreground leading-relaxed max-w-md">
                  Vous avez un projet, une question ou besoin d&apos;un service ? N&apos;hésitez pas à me contacter. Je réponds rapidement.
                </p>
                <div className="mt-8 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30">
                      <Mail className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">contact@createurboutique.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30">
                      <Phone className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Téléphone</p>
                      <p className="text-sm text-muted-foreground">+223 97 78 72 44</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30">
                      <MapPin className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Localisation</p>
                      <p className="text-sm text-muted-foreground">Bamako, Mali</p>
                    </div>
                  </div>
                </div>
                <div className="mt-8 flex gap-3">
                  <a href="https://www.instagram.com/sk_designer_luxe" target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30 hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors" aria-label="Instagram">
                    <Instagram className="h-5 w-5 text-amber-600" />
                  </a>
                  <a href="https://www.facebook.com/skdesignerluxe" target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30 hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors" aria-label="Facebook">
                    <Facebook className="h-5 w-5 text-amber-600" />
                  </a>
                  <a href="https://www.tiktok.com/@sk_designer_luxe" target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30 hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors" aria-label="TikTok">
                    <svg className="h-5 w-5 text-amber-600" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.87a8.16 8.16 0 0 0 4.77 1.52V6.94a4.85 4.85 0 0 1-1.01-.25z" /></svg>
                  </a>
                </div>
              </div>

              <form onSubmit={handleSubmitContact} className="space-y-4 rounded-2xl border bg-card p-6 sm:p-8 shadow-sm">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom *</Label>
                    <Input id="name" placeholder="Votre nom" value={contactData.name} onChange={(e) => setContactData({ ...contactData, name: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" type="email" placeholder="votre@email.com" value={contactData.email} onChange={(e) => setContactData({ ...contactData, email: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Sujet</Label>
                  <Input id="subject" placeholder="Quel service vous intéresse ?" value={contactData.subject} onChange={(e) => setContactData({ ...contactData, subject: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea id="message" placeholder="Décrivez votre projet ou votre demande..." rows={5} value={contactData.message} onChange={(e) => setContactData({ ...contactData, message: e.target.value })} />
                </div>

                {contactSent ? (
                  <div className="flex flex-col items-center justify-center py-4 text-center">
                    <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-3">
                      <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                    </div>
                    <p className="font-semibold text-foreground">Message envoyé avec succès !</p>
                    <p className="text-sm text-muted-foreground mt-1">Je vous répondrai rapidement par email ou WhatsApp.</p>
                  </div>
                ) : (
                  <>
                    <Button
                      type="submit"
                      disabled={contactSending}
                      className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold shadow-lg shadow-amber-500/20 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <span className="flex items-center gap-2">
                        {contactSending ? (
                          <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                        {contactSending ? 'Envoi en cours...' : 'Envoyer le message'}
                      </span>
                    </Button>
                    <p className="text-center text-xs text-muted-foreground">
                      Ou contactez-moi directement sur{' '}
                      <a
                        href="https://wa.me/22397787244?text=Bonjour%20!%20J%27ai%20un%20projet%20à%20discuter."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-600 font-semibold hover:underline inline-flex items-center gap-1"
                      >
                        <MessageCircle className="h-3 w-3" /> WhatsApp
                      </a>
                    </p>
                  </>
                )}
              </form>
            </div>
            </motion.div>
          </div>
        </section>

      {/* ═══ COACH DETAIL MODAL ═══ */}
      <AnimatePresence>
        {selectedCoach && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedCoach(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="relative bg-background rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`bg-gradient-to-r ${selectedCoach.gradient} p-6 text-white relative`}>
                <button onClick={() => setSelectedCoach(null)} className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
                  <X className="h-4 w-4" />
                </button>
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 rounded-full bg-white/20 flex items-center justify-center text-3xl font-extrabold ring-4 ring-white/30">
                    {selectedCoach.initial}
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold">{selectedCoach.name}</h3>
                    <p className="text-white/80 text-sm mt-0.5">{selectedCoach.role}</p>
                    <div className="flex gap-4 mt-2">
                      {selectedCoach.stats.map((s) => (
                        <div key={s.label}>
                          <span className="text-lg font-extrabold">{s.value}</span>
                          <span className="text-[10px] text-white/60 ml-1">{s.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Compétences</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedCoach.speciality.split(', ').map((skill) => (
                      <span key={skill} className="px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 text-xs font-semibold border border-amber-200 dark:border-amber-800">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Biographie</p>
                  <p className="text-sm text-foreground/80 leading-relaxed">{selectedCoach.bio}</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Formations dispensées</p>
                  <div className="space-y-2">
                    {selectedCoach.name === 'Sacko' && (
                      <>
                        <div className="flex items-center gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" /><span>Design Graphique (Canva, Photoshop, Illustrator)</span></div>
                        <div className="flex items-center gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" /><span>Branding & Identité Visuelle</span></div>
                        <div className="flex items-center gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" /><span>Montage Vidéo (CapCut, Premiere Pro)</span></div>
                      </>
                    )}
                    {selectedCoach.name === 'Camara Leh' && (
                      <>
                        <div className="flex items-center gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" /><span>Création Web (HTML, CSS, JavaScript)</span></div>
                        <div className="flex items-center gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" /><span>Frameworks modernes (React, Next.js)</span></div>
                        <div className="flex items-center gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" /><span>WordPress & Solutions e-commerce</span></div>
                      </>
                    )}
                    {selectedCoach.name === 'Kante' && (
                      <>
                        <div className="flex items-center gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" /><span>Marketing Digital & Stratégie</span></div>
                        <div className="flex items-center gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" /><span>Publicité Facebook & Instagram Ads</span></div>
                        <div className="flex items-center gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" /><span>TikTok & YouTube Growth</span></div>
                      </>
                    )}
                  </div>
                </div>
                <a
                  href={`https://wa.me/22397787244?text=${encodeURIComponent(`Bonjour ! Je souhaite être encadré(e) par ${selectedCoach.name} pour une formation. Pouvez-vous me donner plus de détails ?`)}`}
                  target="_blank" rel="noopener noreferrer"
                  onClick={() => setSelectedCoach(null)}
                >
                  <Button className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold shadow-lg shadow-emerald-500/20 mt-2">
                    <MessageCircle className="h-4 w-4 mr-2" /> Contacter {selectedCoach.name} via WhatsApp
                  </Button>
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ COOKIE CONSENT BANNER ═══ */}
      <AnimatePresence>
        {showCookieConsent && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-16 lg:bottom-6 left-4 right-4 lg:left-auto lg:right-6 lg:w-96 z-[80] bg-background/95 backdrop-blur-xl rounded-2xl border shadow-2xl p-5"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30 flex-shrink-0">
                <Cookie className="h-5 w-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold mb-1">Nous respectons votre vie privée</h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                  Nous utilisons des cookies pour améliorer votre expérience, analyser le trafic et afficher des contenus personnalisés. En continuant, vous acceptez nos cookies.
                </p>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setShowCookieConsent(false)}
                    size="sm"
                    className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold text-xs h-9"
                  >
                    Accepter
                  </Button>
                  <Button
                    onClick={() => setShowCookieConsent(false)}
                    variant="outline"
                    size="sm"
                    className="text-xs h-9"
                  >
                    Refuser
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ WELCOME POPUP ═══ */}
      <AnimatePresence>
        {welcomeVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => { setWelcomeVisible(false); setShowWelcome(false) }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 30 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="relative bg-background rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => { setWelcomeVisible(false); setShowWelcome(false) }} className="absolute top-3 right-3 z-10 h-8 w-8 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center">
                <X className="h-4 w-4" />
              </button>
              <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 p-6 text-center text-white">
                <div className="text-4xl mb-2">👋</div>
                <h3 className="text-xl font-extrabold">Bienvenue sur Studio Créatif !</h3>
                <p className="text-white/80 text-sm mt-1">Offre exclusive pour les nouveaux visiteurs</p>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800">
                    <Gift className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">Logo GRATUIT</p>
                      <p className="text-[11px] text-muted-foreground">Votre premier logo offert, sans engagement</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
                    <Zap className="h-5 w-5 text-amber-500 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-amber-700 dark:text-amber-400">Livraison en 48h</p>
                      <p className="text-[11px] text-muted-foreground">Résultat rapide et professionnel</p>
                    </div>
                  </div>
                </div>
                <a
                  href="https://wa.me/22397787244?text=Bonjour%20Sacko%20!%20Je%20suis%20nouveau%20sur%20votre%20site%20et%20je%20souhaite%20profiter%20de%20l'offre%20bienvenue%20(logo%20gratuit)."
                  target="_blank" rel="noopener noreferrer"
                  onClick={() => { setWelcomeVisible(false); setShowWelcome(false) }}
                >
                  <Button className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold shadow-lg shadow-emerald-500/20">
                    <MessageCircle className="h-4 w-4 mr-2" /> Profiter de l'offre
                  </Button>
                </a>
                <button onClick={() => { setWelcomeVisible(false); setShowWelcome(false) }} className="block text-xs text-muted-foreground hover:text-foreground transition-colors mx-auto">
                  Peut-être plus tard
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ PORTFOLIO LIGHTBOX ═══ */}
      <AnimatePresence>
        {lightboxImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 bg-black/90 backdrop-blur-sm"
            onClick={() => setLightboxImg(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="relative max-w-5xl w-full max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img src={lightboxImg.src} alt={lightboxImg.title} className="w-full h-auto max-h-[75vh] object-contain bg-black" />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6">
                <h3 className="text-white font-bold text-lg">{lightboxImg.title}</h3>
                <p className="text-white/70 text-sm mt-1">{lightboxImg.desc}</p>
              </div>
              <button
                onClick={() => setLightboxImg(null)}
                className="absolute top-4 right-4 h-10 w-10 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors backdrop-blur-sm"
              >
                <X className="h-5 w-5" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ SERVICE QUIZ MODAL ═══ */}
      <AnimatePresence>
        {quizOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => { setQuizOpen(false); setQuizStep(0); setQuizAnswers([]); setQuizResult(null) }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="relative bg-background rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => { setQuizOpen(false); setQuizStep(0); setQuizAnswers([]); setQuizResult(null) }} className="absolute top-3 right-3 z-10 h-8 w-8 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center">
                <X className="h-4 w-4" />
              </button>
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6 text-white text-center">
                <Brain className="h-8 w-8 mx-auto mb-2" />
                {!quizResult ? (
                  <>
                    <h3 className="text-lg font-extrabold">Quel service vous convient ?</h3>
                    <p className="text-white/80 text-sm mt-1">Répondez à 3 questions rapides</p>
                    {/* Progress bar */}
                    <div className="mt-4 flex gap-1.5 justify-center">
                      {[0, 1, 2].map((s) => (
                        <div key={s} className={`h-1.5 rounded-full transition-all duration-300 ${s <= quizStep ? 'w-8 bg-white' : 'w-4 bg-white/40'}`} />
                      ))}
                    </div>
                  </>
                ) : (
                  <h3 className="text-lg font-extrabold">Résultat</h3>
                )}
              </div>
              <div className="p-6">
                {!quizResult ? (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={quizStep}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ duration: 0.3 }}
                    >
                      {quizStep === 0 && (
                        <div className="space-y-3">
                          <p className="text-sm font-semibold">Quel est votre objectif principal ?</p>
                          {[
                            { label: 'Créer une identité visuelle (logo, charte)', val: 'identite' },
                            { label: 'Avoir un site internet professionnel', val: 'site' },
                            { label: 'Produire du contenu vidéo', val: 'video' },
                            { label: 'Attirer des clients sur les réseaux', val: 'reseaux' },
                            { label: 'Apprendre le design digital', val: 'formation' },
                          ].map((opt) => (
                            <button key={opt.val} onClick={() => { setQuizAnswers([opt.val]); setQuizStep(1) }} className="w-full text-left p-3 rounded-xl border border-border hover:border-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/20 text-sm transition-all hover:translate-x-1">
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      )}
                      {quizStep === 1 && (
                        <div className="space-y-3">
                          <p className="text-sm font-semibold">Quel est votre budget ?</p>
                          {[
                            { label: 'Budget limité — je veux tester gratuitement', val: 'gratuit' },
                            { label: '5 000 – 20 000 FCFA', val: 'petit' },
                            { label: '20 000 – 50 000 FCFA', val: 'moyen' },
                            { label: 'Plus de 50 000 FCFA', val: 'grand' },
                          ].map((opt) => (
                            <button key={opt.val} onClick={() => { setQuizAnswers(prev => [...prev, opt.val]); setQuizStep(2) }} className="w-full text-left p-3 rounded-xl border border-border hover:border-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/20 text-sm transition-all hover:translate-x-1">
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      )}
                      {quizStep === 2 && (
                        <div className="space-y-3">
                          <p className="text-sm font-semibold">Quand souhaitez-vous commencer ?</p>
                          {[
                            { label: 'Immédiatement — c\'est urgent', val: 'urgent' },
                            { label: 'Cette semaine', val: 'semaine' },
                            { label: 'Dans les 2 prochaines semaines', val: '2semaines' },
                            { label: 'Je me renseigne pour l\'instant', val: 'renseigne' },
                          ].map((opt) => (
                            <button key={opt.val} onClick={() => {
                              const answers = [...quizAnswers, opt.val]
                              setQuizAnswers(answers)
                              // Determine result
                              const goal = answers[0]
                              const budget = answers[1]
                              if (goal === 'identite') setQuizResult({ service: 'Design Graphique', icon: Palette, reason: budget === 'gratuit' ? 'Testez l\'Offre Découverte gratuite pour un logo simple, puis passez au Premium pour une identité complète.' : 'L\'Offre Premium Design vous donne un logo vectorisé, une charte graphique complète et tous les fichiers sources.' })
                              else if (goal === 'site') setQuizResult({ service: 'Création Web', icon: Globe, reason: budget === 'gratuit' ? 'Commencez avec une landing page gratuite, puis évoluez vers un site multi-pages complet.' : 'Un site professionnel multi-pages avec formulaire, SEO, et hébergement inclus est l\'idéal pour vous.' })
                              else if (goal === 'video') setQuizResult({ service: 'Montage Vidéo', icon: MonitorPlay, reason: budget === 'gratuit' ? 'Essayez le montage découverte gratuit pour un aperçu rapide.' : 'Le montage Premium inclut effets, sous-titres, musique et export optimisé pour tous les réseaux.' })
                              else if (goal === 'reseaux') setQuizResult({ service: 'Marketing Digital', icon: Megaphone, reason: budget === 'gratuit' ? 'Un post ou affiche gratuit pour tester mon style.' : 'Stratégie complète avec calendrier éditorial, posts, stories et bannières publicitaires.' })
                              else setQuizResult({ service: 'Formation Design', icon: GraduationCap, reason: 'La formation Design Graphique (Découverte gratuite puis Premium) est parfaite pour apprendre à créer vos propres visuels.' })
                              setQuizStep(3)
                            }} className="w-full text-left p-3 rounded-xl border border-border hover:border-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/20 text-sm transition-all hover:translate-x-1">
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                ) : quizResult && (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-white mx-auto shadow-lg">
                      <quizResult.icon className="h-8 w-8" />
                    </div>
                    <h4 className="text-xl font-extrabold">{quizResult.service}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{quizResult.reason}</p>
                    <div className="flex flex-col gap-2 pt-2">
                      <a
                        href={`https://wa.me/22397787244?text=${encodeURIComponent(`Bonjour Sacko ! J'ai fait le quiz sur votre site et le résultat m'a recommandé : ${quizResult.service}. Je souhaite en savoir plus !`)}`}
                        target="_blank" rel="noopener noreferrer"
                        onClick={() => { setQuizOpen(false); setQuizStep(0); setQuizAnswers([]); setQuizResult(null) }}
                      >
                        <Button className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold shadow-lg shadow-emerald-500/20">
                          <MessageCircle className="h-4 w-4 mr-2" /> En discuter sur WhatsApp
                        </Button>
                      </a>
                      <button onClick={() => { setQuizStep(0); setQuizAnswers([]); setQuizResult(null) }} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                        Refaire le quiz
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ QUIZ TRIGGER FLOATING BUTTON ═══ */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 3, type: 'spring' }}
        onClick={() => setQuizOpen(true)}
        className="fixed bottom-[68px] lg:bottom-6 left-1/2 -translate-x-1/2 z-[55] flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white pl-4 pr-5 py-3 rounded-full shadow-lg shadow-violet-500/30 hover:shadow-xl hover:shadow-violet-500/40 transition-all duration-300 hover:scale-105 group"
      >
        <Brain className="h-5 w-5" />
        <span className="text-sm font-semibold whitespace-nowrap">Quel service vous convient ?</span>
        <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-medium bg-white/20 px-2 py-0.5 rounded-full">Quiz gratuit</span>
      </motion.button>

      {/* ═══ SIDE NAVIGATION DOTS (desktop) ═══ */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-30 hidden xl:flex flex-col gap-2.5">
        {[
          { id: 'accueil', label: 'Accueil' },
          { id: 'services', label: 'Services' },
          { id: 'formations', label: 'Formations' },
          { id: 'coachs', label: 'Coachs' },
          { id: 'boutique', label: 'Boutique' },
          { id: 'portfolio', label: 'Portfolio' },
          { id: 'blog', label: 'Blog' },
          { id: 'contact', label: 'Contact' },
        ].map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className="group flex items-center gap-2.5 justify-end"
          >
            <span className="text-[10px] font-medium text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {item.label}
            </span>
            <span className={`h-2.5 rounded-full transition-all duration-300 ${
              activeDotSection === item.id
                ? 'w-2.5 bg-amber-500 shadow-md shadow-amber-500/30'
                : 'w-2 bg-muted-foreground/30 group-hover:bg-amber-500/50'
            }`} />
          </a>
        ))}
      </div>

        {/* ═══ BLOG & ACTUALITÉS ═══ */}
        <BlogPreview />

        {/* ═══ NOS CRÉATIONS VIDÉO ═══ */}
        <VideoShowcase />

      </main>

      {/* ═══ AD BANNER — Before Footer ═══ */}
      <div className="py-4 bg-muted/10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <AdBanner />
          <div className="mt-3">
            <AdsterraBanner placement="sidebar" />
          </div>
        </div>
      </div>

      {/* ═══ MOYENS DE PAIEMENT ═══ */}
      <section className="py-8 border-t bg-muted/20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center gap-3">
            <p className="text-sm font-semibold text-muted-foreground">Commandez et payez facilement via</p>
            <div className="flex flex-wrap items-center justify-center gap-3 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border border-emerald-200 dark:border-emerald-800 shadow-sm">
              <MessageCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">WhatsApp</span>
              <span className="text-[10px] text-muted-foreground">+</span>
              <span className="text-xs font-medium text-amber-600 dark:text-amber-400">Orange Money</span>
              <span className="text-[10px] text-muted-foreground">·</span>
              <span className="text-xs font-medium text-yellow-600 dark:text-yellow-400">Moov Money</span>
            </div>
          </div>
          <p className="text-center text-[11px] text-muted-foreground mt-3">Commande via WhatsApp — Paiement mobile money — Confirmation instantanée</p>
        </div>
      </section>

      {/* ═══ 20. FOOTER ═══ */}
      <Footer />

      {/* ═══ STICKY MOBILE CTA ═══ */}
      <AnimatePresence>
        {showStickyCta && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-14 left-0 right-0 z-[49] lg:hidden p-3 bg-gradient-to-t from-background via-background/95 to-transparent"
          >
            <a href="https://wa.me/22397787244?text=Bonjour%20Sacko%20!%20Je%20souhaite%20discuter%20d%27un%20projet." target="_blank" rel="noopener noreferrer">
              <Button className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold h-11 text-sm shadow-lg shadow-emerald-500/30">
                <MessageCircle className="h-4 w-4 mr-2" /> Discuter de mon projet — Gratuit
              </Button>
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ 21. BOTTOM MOBILE NAV ═══ */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-background/95 backdrop-blur-xl border-t border-border shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-around h-14 px-2">
          <a href="#accueil" className="flex flex-col items-center gap-0.5 text-muted-foreground hover:text-amber-500 transition-colors py-1 px-2">
            <Sparkles className="h-[18px] w-[18px]" />
            <span className="text-[9px] font-medium">Accueil</span>
          </a>
          <a href="#services" className="flex flex-col items-center gap-0.5 text-muted-foreground hover:text-amber-500 transition-colors py-1 px-2">
            <Layers className="h-[18px] w-[18px]" />
            <span className="text-[9px] font-medium">Services</span>
          </a>
          <a href="https://wa.me/22397787244?text=Bonjour%20Sacko%20!%20Je%20souhaite%20discuter%20d%27un%20projet." target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-0.5 -mt-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-lg shadow-emerald-500/30">
              <MessageCircle className="h-6 w-6" />
            </div>
            <span className="text-[9px] font-semibold text-emerald-600">WhatsApp</span>
          </a>
          <a href="#boutique" className="flex flex-col items-center gap-0.5 text-muted-foreground hover:text-amber-500 transition-colors py-1 px-2">
            <BookOpen className="h-[18px] w-[18px]" />
            <span className="text-[9px] font-medium">Boutique</span>
          </a>
          <a href="#contact" className="flex flex-col items-center gap-0.5 text-muted-foreground hover:text-amber-500 transition-colors py-1 px-2">
            <Send className="h-[18px] w-[18px]" />
            <span className="text-[9px] font-medium">Contact</span>
          </a>
        </div>
      </div>

      {/* ═══ BACK TO TOP DESKTOP ═══ */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 right-20 z-40 hidden lg:flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 text-white shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40 transition-all duration-300 hover:scale-110"
            aria-label="Retour en haut"
          >
            <ChevronUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ═══ SHARE BUTTON ═══ */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.1 }}
        onClick={async () => {
          if (navigator.share) {
            try {
              await navigator.share({ title: 'Studio Créatif — Sacko', text: 'Découvre Studio Créatif ! Design, sites web, formations à Bamako.', url: window.location.href })
            } catch {}
          } else {
            await navigator.clipboard.writeText(window.location.href)
            setShareToast(true)
            setTimeout(() => setShareToast(false), 2000)
          }
        }}
        className="fixed bottom-6 right-6 z-40 hidden lg:flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:scale-110 transition-all"
        aria-label="Partager le site"
      >
        <Share2 className="h-5 w-5" />
      </motion.button>

      {/* Share toast */}
      <AnimatePresence>
        {shareToast && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed bottom-20 right-6 z-40 hidden lg:block bg-foreground text-background text-xs font-medium px-3 py-2 rounded-lg shadow-lg"
          >
            Lien copié !
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back to top button - mobile only (above bottom nav) */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-[68px] left-4 z-[60] flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 text-white shadow-lg shadow-amber-500/30 lg:hidden"
            aria-label="Retour en haut"
          >
            <ChevronUp className="h-4 w-4" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ═══ FLOATING CART BUTTON ═══ */}
      <AnimatePresence>
        {cart.length > 0 && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={() => setShowCart(!showCart)}
            className="fixed bottom-[68px] right-4 z-[60] lg:bottom-6 lg:right-24 lg:z-[41] flex h-12 w-12 items-center justify-center rounded-full bg-amber-500 text-white shadow-lg shadow-amber-500/30 hover:bg-amber-600 hover:shadow-xl transition-all"
            aria-label="Voir le panier"
          >
            <ShoppingCart className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white border-2 border-background">{cart.length}</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ═══ CART PANEL ═══ */}
      <AnimatePresence>
        {showCart && cart.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 bottom-0 z-[110] w-80 max-w-[85vw] bg-background border-l shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-bold text-base flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-amber-500" />
                Mon Panier
                <span className="text-sm font-normal text-muted-foreground">({cart.length})</span>
              </h3>
              <button onClick={() => setShowCart(false)} className="h-8 w-8 rounded-full hover:bg-muted flex items-center justify-center"><X className="h-4 w-4" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {cart.map((title) => {
                const book = books.find(b => b.title === title)
                return (
                  <div key={title} className="flex items-center gap-3 p-2.5 rounded-xl bg-muted/50 border border-border">
                    {book && <img src={book.cover} alt="" className="h-12 w-9 object-cover rounded-md shadow-sm" />}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold leading-tight line-clamp-2">{title}</p>
                      <p className="text-[10px] text-amber-600 font-bold mt-0.5">1 000 FCFA</p>
                    </div>
                    <button onClick={() => toggleCart(title)} className="h-7 w-7 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 flex items-center justify-center text-muted-foreground hover:text-red-500 transition-colors flex-shrink-0">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )
              })}
            </div>
            <div className="p-4 border-t space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">Total</span>
                <span className="text-xl font-extrabold text-amber-600">{cart.length * 1000} FCFA</span>
              </div>
              {cart.length >= 3 && (
                <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-2.5 text-center">
                  <p className="text-[11px] text-amber-700 dark:text-amber-400 font-semibold">Pack {cart.length} livres — {Math.min(cart.length * 1000, 7000)} FCFA</p>
                  <p className="text-[10px] text-amber-600/70 mt-0.5">Le pack complet 12 livres = 7 000 FCFA</p>
                </div>
              )}
              <a
                href={`https://wa.me/22397787244?text=${encodeURIComponent(`Bonjour Sacko ! Je veux commander ${cart.length} livre(s) :\n\n${cart.map(t => `- ${t} (1 000 FCFA)`).join('\n')}\n\nTotal : ${cart.length * 1000} FCFA. Comment procéder pour le paiement ?`)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setShowCart(false)}
              >
                <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold shadow-lg shadow-amber-500/20 h-11 text-sm">
                  <MessageCircle className="h-4 w-4 mr-2" /> Commander {Math.min(cart.length * 1000, 7000).toLocaleString('fr-FR')} F
                </Button>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ WHATSAPP EXPANDABLE WIDGET ═══ */}
      <div className="fixed bottom-6 right-6 z-40 hidden lg:block">
        <AnimatePresence>
          {showWaWidget && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="absolute bottom-16 right-0 w-72 bg-background rounded-2xl shadow-2xl border overflow-hidden"
            >
              {/* Widget header */}
              <div className="bg-[#075e54] p-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm shadow-md">S</div>
                <div className="flex-1">
                  <p className="text-white font-bold text-sm">Sacko — Studio Créatif</p>
                  <div className="flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" /></span>
                    <p className="text-white/70 text-[11px]">En ligne — répond en ~5 min</p>
                  </div>
                </div>
                <button onClick={() => setShowWaWidget(false)} className="text-white/70 hover:text-white"><X className="h-4 w-4" /></button>
              </div>
              {/* Chat preview */}
              <div className="p-4 bg-[#ece5dd] dark:bg-[#1a2730]">
                <div className="bg-white dark:bg-[#233039] rounded-xl rounded-tl-sm p-3 shadow-sm max-w-[85%]">
                  <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">Bonjour ! 👋 Comment puis-je vous aider aujourd'hui ?</p>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 text-right">Maintenant</p>
                </div>
              </div>
              {/* CTA */}
              <div className="p-3 bg-background">
                <a
                  href="https://wa.me/22397787244?text=Bonjour%20Sacko%20!%20Je%20souhaite%20discuter%20d%27un%20projet."
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setShowWaWidget(false)}
                >
                  <Button className="w-full bg-[#25d366] hover:bg-[#20bd5a] text-white font-semibold h-11 text-sm">
                    <MessageCircle className="h-4 w-4 mr-2" /> Démarrer la conversation
                  </Button>
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Main WA button */}
        {!showWaWidget && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 hover:bg-emerald-600 hover:shadow-xl hover:shadow-emerald-500/40 transition-all duration-300 hover:scale-110 group relative"
            onClick={() => setShowWaWidget(true)}
            aria-label="Contacter sur WhatsApp"
          >
            <MessageCircle className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white dark:border-background" />
            </span>
          </motion.button>
        )}
      </div>



      {/* ═══ CONFETTI EFFECT ═══ */}
      {confettiActive && (
        <div className="fixed inset-0 z-[200] pointer-events-none overflow-hidden">
          {Array.from({ length: 40 }).map((_, i) => (
            <div
              key={i}
              className="absolute top-0"
              style={{
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 8 + 4}px`,
                height: `${Math.random() * 8 + 4}px`,
                backgroundColor: ['#f59e0b', '#f97316', '#ef4444', '#10b981', '#8b5cf6', '#ec4899', '#3b82f6'][Math.floor(Math.random() * 7)],
                borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                animation: `confettiFall ${2 + Math.random() * 2}s ease-in ${Math.random() * 0.5}s forwards`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}