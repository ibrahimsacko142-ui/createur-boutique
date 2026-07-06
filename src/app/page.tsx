'use client'

import { useEffect, useState, useRef } from 'react'
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


/* ─── Animated Counter Component ─── */
function AnimatedStat({ end, suffix, children }: { end: number; suffix?: string; children: React.ReactNode }) {
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(false)

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

  return (
    <div
      className="text-center"
      onPointerEnter={() => setStarted(true)}
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
  },
  {
    name: 'Coach Moussa',
    role: 'Expert Montage Vidéo',
    speciality: 'CapCut, Premiere Pro, Motion Design',
    bio: 'Spécialiste en montage vidéo et production de contenu pour réseaux sociaux. Plus de 200 vidéos produites pour des marques au Mali.',
    gradient: 'from-purple-400 via-violet-500 to-indigo-500',
    initial: 'M',
  },
  {
    name: 'Coach Aminata',
    role: 'Expert Marketing Digital',
    speciality: 'Réseaux Sociaux, Publicité, Stratégie',
    bio: 'Community Manager certifiée avec une expertise en croissance digitale pour PME locales. Gère la présence en ligne de 15+ entreprises.',
    gradient: 'from-emerald-400 via-teal-500 to-cyan-500',
    initial: 'A',
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
  const [showBanner, setShowBanner] = useState(true)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [portfolioFilter, setPortfolioFilter] = useState('Tous')
  const [quickOrder, setQuickOrder] = useState({ service: '', name: '', phone: '', description: '' })
  const [faqOpen, setFaqOpen] = useState<string | null>(null)
  const [leadMagnet, setLeadMagnet] = useState({ name: '', contact: '' })
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [bookFilter, setBookFilter] = useState('Tous')
  const { toast } = useToast()




  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 600)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])





  const handleSubmitContact = (e: React.FormEvent) => {
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
    const msg = encodeURIComponent(`Bonjour ! Je suis ${contactData.name} (${contactData.email}).\n\nSujet : ${contactData.subject || 'Général'}\n\n${contactData.message}`)
    window.open(`https://wa.me/22397787244?text=${msg}`, '_blank')
    toast({ title: 'Redirection vers WhatsApp', description: 'Votre message sera envoyé via WhatsApp pour une réponse rapide.' })
    setContactData({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <div className="min-h-screen flex flex-col bg-background pb-20 lg:pb-0 scroll-smooth">
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
                  <Flame className="h-3.5 w-3.5 inline mr-1" />
                  Bienvenue ! Tous les services sont actuellement gratuits — Profitez-en pour lancer votre projet digital
                </p>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <a href="#services">
                    <Button size="sm" variant="secondary" className="h-7 text-xs bg-white text-amber-600 hover:bg-white/90 font-semibold px-3">
                      Découvrir les services
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
          <div className="absolute top-0 -right-40 h-[500px] w-[500px] rounded-full bg-amber-200/40 dark:bg-amber-800/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-40 h-[400px] w-[400px] rounded-full bg-orange-200/30 dark:bg-orange-800/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] rounded-full bg-red-100/30 dark:bg-red-900/10 blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge variant="secondary" className="mb-4 px-3 py-1 text-xs font-medium bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800 shadow-sm">
                  <Sparkles className="h-3 w-3 mr-1" /> Studio Créatif Indépendant
                </Badge>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                  Donnez vie à vos projets digitaux et{' '}
                  <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 bg-clip-text text-transparent">
                    démarquez-vous.
                  </span>
                </h1>

                <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-lg">
                  Création de logos, sites web et visuels sur-mesure pour propulser les entrepreneurs et créateurs de Bamako et d&apos;ailleurs. Chaque projet est une opportunité de transformer votre vision en une réalité qui attire et fidélise.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <a href="https://wa.me/22397787244?text=Bonjour%20!%20Je%20souhaite%20discuter%20de%20mon%20projet." target="_blank" rel="noopener noreferrer">
                    <Button size="lg" className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:via-orange-600 hover:to-red-600 text-white font-semibold shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all duration-200 hover:scale-105 active:scale-95">
                      <Rocket className="mr-2 h-4 w-4" /> Lancer mon projet
                    </Button>
                  </a>
                  <a href="https://wa.me/22397787244?text=Bonjour%20!%20J%27aimerais%20obtenir%20un%20devis%20gratuit%20pour%20mon%20projet." target="_blank" rel="noopener noreferrer">
                    <Button size="lg" variant="outline" className="font-semibold hover:bg-accent transition-transform duration-200 hover:scale-105 active:scale-95">
                      Obtenir un devis gratuit <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </a>
                </div>

                <div className="mt-10 flex flex-wrap gap-3">
                  {['Design Graphique', 'Sites Web', 'Montage Vidéo', 'Marketing Digital'].map((tag) => (
                    <span key={tag} className="inline-flex items-center gap-1.5 rounded-full bg-white/80 dark:bg-white/5 border px-3.5 py-1.5 text-xs font-medium text-amber-700 dark:text-amber-400 border-amber-200/80 dark:border-amber-800 shadow-sm">
                      <CheckCircle2 className="h-3 w-3 text-emerald-500" /> {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-8 flex items-center gap-4">
                  <div className="flex -space-x-2">
                    {['from-amber-400 to-orange-500', 'from-emerald-400 to-teal-500', 'from-purple-400 to-pink-500', 'from-blue-400 to-cyan-500'].map((g, i) => (
                      <div key={i} className={`h-8 w-8 rounded-full border-2 border-white bg-gradient-to-br ${g}`} />
                    ))}
                  </div>
                  <div>
                    <p className="text-xs font-bold">50+ Marques propulsées</p>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="h-3 w-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Hero Visual */}
              <div className="hidden lg:block">
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-amber-400/20 via-orange-400/20 to-red-400/20 rounded-3xl blur-2xl" />
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/20">
                    <img src="/demo-photo.png" alt="Studio Créatif - Sacko" className="w-full h-[420px] object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className="flex gap-2 flex-wrap">
                        {['Design Graphique', 'Sites Web', 'Montage Vidéo', 'Formations'].map((t) => (
                          <span key={t} className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-medium border border-white/10">{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="absolute -bottom-6 -left-6 bg-white dark:bg-card rounded-xl shadow-xl p-3 border flex items-center gap-3 hover:scale-105 transition-transform cursor-default">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
                      <Award className="h-5 w-5 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-xs font-bold">50+ Marques</p>
                      <p className="text-[10px] text-muted-foreground">Propulsées</p>
                    </div>
                  </div>
                  <div className="absolute -top-4 -right-4 bg-white dark:bg-card rounded-xl shadow-xl p-3 border hover:scale-105 transition-transform cursor-default">
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
              </div>
            </div>
          </div>
        </section>

        {/* ═══ 3. QUICK SERVICE ACCESS BAR ═══ */}
        <section className="py-6 border-b bg-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {[
                { label: 'Logo', icon: Palette },
                { label: 'Site Web', icon: Globe },
                { label: 'Vidéo', icon: MonitorPlay },
                { label: 'Affiche', icon: PenTool },
                { label: 'Formation', icon: GraduationCap },
                { label: 'Canva Pro', icon: Layers },
                { label: 'CapCut Pro', icon: Scissors },
              ].map((s) => (
                <a key={s.label} href="#services" className="flex-shrink-0 flex flex-col items-center gap-1.5 px-4 py-3 rounded-xl bg-muted/50 hover:bg-muted hover:-translate-y-0.5 hover:shadow-md transition-all duration-300">
                  <s.icon className="h-5 w-5 text-amber-500" />
                  <span className="text-xs font-medium">{s.label}</span>
                </a>
              ))}
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
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Premium = Sur devis via WhatsApp</span>
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
                <Card key={section.cat} className={`border ${section.borderColor} overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5`}>
                  <div className={`h-1.5 bg-gradient-to-r ${section.color}`} />
                  <CardContent className="p-5 sm:p-7">
                    <div className="flex items-center gap-3 mb-5">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${section.color} text-white shadow-lg`}>
                        <section.icon className="h-5 w-5" />
                      </div>
                      <h3 className="text-lg font-extrabold">{section.cat}</h3>
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
                            <Rocket className="h-3.5 w-3.5 mr-1.5" /> Passer au Premium
                          </Button>
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Bonus Luxe — outils premium offerts avec les formations */}
              <Card className="border-0 shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white p-5 sm:p-7">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm shadow-lg flex-shrink-0">
                      <Gift className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-base">Bonus : Accès Premium Offert</h3>
                        <Badge className="bg-white/20 text-white border-0 text-[10px]">NOUVEAU</Badge>
                      </div>
                      <p className="text-sm text-white/90 leading-relaxed">Chaque formation inclut un <strong>accès gratuit</strong> à Canva Pro, CapCut Pro ou PicsArt Pro. C&apos;est mon cadeau pour vous accompagner dans la pratique.</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* ═══ 7. CARRIÈRE PRO ═══ */}
        <section id="carriere-pro" className="py-16 sm:py-20 bg-gradient-to-b from-slate-900 via-slate-900 to-background text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <Badge className="mb-3 bg-blue-500/20 text-blue-300 border-blue-500/30 hover:bg-blue-500/30">
                <GraduationCap className="h-3 w-3 mr-1" /> Carrière Pro
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Offre à la Carte</h2>
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
                <Card key={s.name} className="h-full bg-slate-800/80 border border-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-0.5">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${s.color} text-white shadow-lg`}>
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
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors"
                    >
                      Commander <ArrowRight className="h-3.5 w-3.5" />
                    </a>
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
                      <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold shadow-xl shadow-amber-500/25 px-8 whitespace-nowrap">
                        <MessageCircle className="h-5 w-5 mr-2" /> Prendre le Pack
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
                <Card key={d.title} className="overflow-hidden border-0 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                  <div className={`h-1 bg-gradient-to-r ${d.color}`} />
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${d.color} text-white shadow-md flex-shrink-0`}>
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

        {/* ═══ 9. FORMATIONS VEDETTES ═══ */}
        <section id="formations" className="py-16 sm:py-20 text-white" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)' }}>
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Decorative glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative text-center mb-12">
              <Badge className="mb-3 bg-amber-500/20 text-amber-300 border-amber-500/30 hover:bg-amber-500/30">
                <GraduationCap className="h-3 w-3 mr-1" /> Formations
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">4 Programmes pour <span className="text-amber-400">maîtriser le digital</span></h2>
              <p className="mt-4 text-slate-300 max-w-2xl mx-auto leading-relaxed">
                Chaque programme est conçu pour vous rendre <strong className="text-white">opérationnel rapidement</strong>. Commencez gratuitement avec l&apos;Offre Découverte, puis passez au Premium pour un accompagnement complet avec certificat.
              </p>
              <div className="flex items-center justify-center gap-6 mt-5 text-xs">
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Découverte = Gratuit</span>
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Premium = Prix fixe clair</span>
              </div>
            </div>

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
                          <Rocket className="h-3.5 w-3.5 mr-1.5" /> Passer au Premium
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
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(245,158,11,0.08),transparent_50%),radial-gradient(circle_at_80%_50%,rgba(168,85,247,0.06),transparent_50%)]" />
          <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <Badge className="mb-3 bg-amber-500/20 text-amber-300 border-amber-500/30 hover:bg-amber-500/30">
                <Users className="h-3 w-3 mr-1" /> Notre Équipe
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">3 Coachs <span className="text-amber-400">experts</span> à votre service</h2>
              <p className="mt-4 text-slate-400 max-w-2xl mx-auto leading-relaxed">
                Pas de théorie abstraite : chaque coach pratique activement dans son domaine à Bamako. Vous apprenez de personnes qui vivent de leur compétence au quotidien.
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-6">
              {coaches.map((coach, i) => (
                <motion.div
                  key={coach.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  className="group relative rounded-2xl backdrop-blur-xl bg-white/[0.04] border border-white/[0.08] hover:border-amber-400/30 p-6 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-500/10"
                >
                  {/* Glow effect on hover */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${coach.gradient} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-500`} />
                  <div className="relative">
                    {/* Avatar */}
                    <div className="relative mx-auto mb-4">
                      <div className={`h-20 w-20 rounded-full bg-gradient-to-br ${coach.gradient} flex items-center justify-center text-white text-2xl font-extrabold shadow-lg mx-auto ring-4 ring-slate-800/50 group-hover:scale-110 transition-transform duration-300`}>
                        {coach.initial}
                      </div>
                      {i === 0 && (
                        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[8px] font-bold px-2.5 py-0.5 rounded-full shadow-lg shadow-amber-500/30">
                          FONDATEUR
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-extrabold text-white">{coach.name}</h3>
                    <p className="text-xs text-amber-400 font-semibold mt-0.5">{coach.role}</p>
                    <p className="text-[10px] text-slate-500 mt-1 font-medium">{coach.speciality}</p>
                    <p className="text-xs text-slate-400 leading-relaxed mt-3">{coach.bio}</p>
                    <a
                      href={`https://wa.me/22397787244?text=${encodeURIComponent(`Bonjour ! Je souhaite être encadré(e) par ${coach.name} pour une formation.`)}`}
                      target="_blank" rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-semibold text-amber-400 hover:text-amber-300 transition-colors"
                    >
                      <MessageCircle className="h-3 w-3" /> Contacter
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
                Des guides pratiques rédigés par des experts actifs. Cliquez sur un livre pour voir les détails. Commandez via WhatsApp et recevez votre livre instantanément.
              </p>
              <div className="mt-5 inline-flex items-center gap-2 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-full px-5 py-2">
                <span className="text-2xl font-extrabold text-amber-600">1 000</span>
                <span className="text-sm font-semibold text-amber-700 dark:text-amber-400">FCFA / livre</span>
              </div>
            </div>

            {/* Category filter pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
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

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
              {books.filter((b) => bookFilter === 'Tous' || b.category === bookFilter).map((book, i) => (
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
                  {/* Order button */}
                  <a
                    href={`https://wa.me/22397787244?text=${encodeURIComponent(`Bonjour Sacko ! Je veux commander le livre : ${book.title} par ${book.author} (1 000 FCFA). Comment procéder ?`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2.5"
                  >
                    <Button variant="outline" size="sm" className="w-full text-[11px] font-semibold h-9 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 transition-colors">
                      <MessageCircle className="h-3 w-3 mr-1.5" /> Commander
                    </Button>
                  </a>
                </motion.div>
              ))}
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
                          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                            <ShieldCheck className="h-3 w-3 text-amber-500" />
                            <span>Paiement : Orange Money, Wave, Moov Money</span>
                          </div>
                        </div>

                        <a
                          href={`https://wa.me/22397787244?text=${encodeURIComponent(`Bonjour Sacko ! Je veux commander le livre : ${selectedBook.title} par ${selectedBook.author} (1 000 FCFA). Comment procéder ?`)}`}
                          target="_blank" rel="noopener noreferrer"
                          onClick={() => setSelectedBook(null)}
                          className="mt-4"
                        >
                          <Button className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold shadow-lg shadow-emerald-500/20">
                            <MessageCircle className="h-4 w-4 mr-2" /> Commander via WhatsApp
                          </Button>
                        </a>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pack promo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-10"
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
                    <a href={`https://wa.me/22397787244?text=${encodeURIComponent('Bonjour Sacko ! Je veux commander le Pack Complet de 12 livres (7 000 FCFA au lieu de 12 000). Comment procéder ?')}`} target="_blank" rel="noopener noreferrer">
                      <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold shadow-lg shadow-amber-500/20 whitespace-nowrap">
                        <ShoppingCart className="h-4 w-4 mr-1.5" /> Prendre le Pack
                      </Button>
                    </a>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* ═══ 12. PORTFOLIO ═══ */}
        <section id="portfolio" className="py-16 sm:py-20">
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
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${portfolioFilter === cat ? 'bg-amber-500 text-white shadow-md shadow-amber-500/25' : 'bg-muted text-muted-foreground hover:bg-accent'}`}
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
                <Card key={item.title} className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 h-full group cursor-pointer hover:-translate-y-0.5">
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

        {/* ═══ 12. TÉMOIGNAGES (Style WhatsApp) ═══ */}
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

            <div className="max-w-lg mx-auto space-y-4">
              {[
                { name: 'Amadou Diallo', time: '14:32', text: "Sacko, le logo est parfait ! 🙏 Je l'ai déjà mis sur ma boutique. Mes clients demandent qui a fait ça. Merci fréro, je te recommande à tous mes amis entrepreneurs.", status: 'Lu à 14:35' },
                { name: 'Fatoumata Traoré', time: '09:15', text: "La formation en design m'a ouvert les yeux. En 2 semaines j'ai déjà créé 3 logos pour des gens de mon quartier et je gagne 15 000 FCFA. C'est fou 🎉", status: 'Lu à 09:20' },
                { name: 'Ibrahim Keita', time: '18:47', text: "Mon site est en ligne depuis 3 jours et j'ai déjà eu 12 clients qui m'ont trouvé sur Google. Avant personne ne me connaissait en dehors de Hamdallaye. Service exceptionnel.", status: 'Lu à 18:50' },
                { name: 'Oumar Sidibé', time: '11:03', text: "Les visuels pour mes affiches de boutique sont incroyables. Mon chiffre d'affaires a augmenté de 40% ce mois-ci. Quand est-ce qu'on refait une commande ? 😊", status: 'Lu à 11:08' },
              ].map((t, i) => (
                <div key={i} className="flex justify-end">
                  <div className="max-w-[85%] sm:max-w-[80%]">
                    {/* WhatsApp bubble */}
                    <div className="relative">
                      <div className="bg-[#005c4b] rounded-xl rounded-tr-sm px-4 py-3 shadow-sm">
                        <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">{t.text}</p>
                        <div className="flex items-center justify-end gap-1.5 mt-1.5">
                          <span className="text-white/50 text-[10px]">{t.time}</span>
                          <svg className="h-4 w-4 text-[#53bdeb]" viewBox="0 0 16 11" fill="currentColor"><path d="M11.071.653a.457.457 0 0 0-.304-.102.493.493 0 0 0-.381.178l-6.19 7.636-2.011-2.085a.463.463 0 0 0-.336-.143.457.457 0 0 0-.336.143.476.476 0 0 0 0 .672l2.359 2.443a.457.457 0 0 0 .336.143c.137 0 .268-.061.381-.178l6.527-8.039a.507.507 0 0 0-.045-.668z"/><path d="M14.071.653a.457.457 0 0 0-.304-.102.493.493 0 0 0-.381.178l-6.19 7.636-1.019-1.056.457-.56a.507.507 0 0 0-.045-.668.457.457 0 0 0-.685 0l-.681.837-.07.012a.463.463 0 0 0-.336.143.476.476 0 0 0 0 .672l2.359 2.443a.457.457 0 0 0 .336.143c.137 0 .268-.061.381-.178l6.527-8.039a.507.507 0 0 0-.045-.668z" opacity=".4"/></svg>
                          <span className="text-white/40 text-[10px]">{t.status}</span>
                        </div>
                      </div>
                    </div>
                    {/* Client name */}
                    <p className="text-[11px] text-muted-foreground mt-1 text-right">
                      — <strong>{t.name}</strong>, client vérifié
                    </p>
                  </div>
                </div>
              ))}

              {/* Trust note */}
              <div className="pt-4 text-center">
                <p className="text-xs text-muted-foreground">
                  Chaque message est <strong className="text-foreground">réel</strong>, reçu directement sur mon WhatsApp.
                  Envie d&apos;être le prochain ?{' '}
                  <a href="#commande-rapide" className="text-amber-600 font-semibold hover:underline">Commandez maintenant</a>.
                </p>
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
                    <p className="mt-2 text-white/80 text-sm">Remplissez ce formulaire — je vous recontacte <strong>personnellement</strong> sur WhatsApp avec une proposition adaptée.</p>
                    <div className="mt-4 inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-1.5 text-white text-xs font-semibold border border-white/20">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-400" />
                      </span>
                      5 projets maximum par jour — qualité avant quantité
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
                  onClick={() => {
                    if (!quickOrder.service || !quickOrder.name || !quickOrder.phone) {
                      toast({ title: 'Champs requis', description: 'Service, nom et téléphone sont obligatoires.', variant: 'destructive' })
                      return
                    }
                    const msg = encodeURIComponent(
                      `Bonjour Sacko ! Je souhaite un service.\n\n` +
                      `Service : ${quickOrder.service}\n` +
                      `Secteur : ${quickOrder.description || 'Non précisé'}\n` +
                      `Nom : ${quickOrder.name}\n` +
                      `Téléphone : ${quickOrder.phone}\n\n` +
                      `Je suis prêt(e) à discuter de mon projet. Merci !`
                    )
                    window.open(`https://wa.me/22397787244?text=${msg}`, '_blank')
                    toast({ title: 'Demande envoyée !', description: 'Je vous recontacte personnellement sous 30 minutes.' })
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
          </div>
        </section>

        {/* ═══ 16. À PROPOS ═══ */}
        <section id="apropos" className="py-16 sm:py-20 bg-gradient-to-b from-muted/30 to-background relative overflow-hidden">
          <div className="absolute top-10 left-10 h-64 w-64 bg-amber-200/20 dark:bg-amber-900/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 h-64 w-64 bg-orange-200/15 dark:bg-orange-900/10 rounded-full blur-3xl" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-5">
                {/* Photo de Sacko */}
                <div className="relative">
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl border">
                    <img src="/demo-photo.png" alt="Sacko - Studio Créatif" className="w-full h-72 sm:h-80 object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-amber-900/80 via-amber-900/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm mb-2">
                        <Palette className="h-6 w-6" />
                      </div>
                      <h3 className="text-xl font-bold">Sacko</h3>
                      <p className="mt-0.5 text-white/80 text-sm">Studio Créatif &bull; Bamako, Mali</p>
                    </div>
                  </div>
                  <div className="absolute -bottom-4 -right-4 bg-white dark:bg-card rounded-xl p-4 shadow-xl border hidden sm:block">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
                        <Zap className="h-4 w-4 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-sm font-bold">50+ Projets livrés</p>
                        <p className="text-[10px] text-muted-foreground">À Bamako et au-delà</p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Vidéo de présentation */}
                <div className="relative rounded-2xl overflow-hidden shadow-xl border">
                  <video
                    controls
                    preload="metadata"
                    poster="/demo-photo.png"
                    className="w-full h-48 sm:h-56 object-cover bg-black"
                  >
                    <source src="/demo-video.mp4" type="video/mp4" />
                    Votre navigateur ne supporte pas la lecture vidéo.
                  </video>
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-amber-500/90 text-white border-0 text-[10px] font-semibold backdrop-blur-sm">
                      <MonitorPlay className="h-3 w-3 mr-1" /> Vidéo de présentation
                    </Badge>
                  </div>
                </div>
              </div>

              <div>
                <Badge variant="secondary" className="mb-3 bg-amber-100 text-amber-700 border-amber-200">
                  <Heart className="h-3 w-3 mr-1" /> Qui suis-je
                </Badge>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">À Propos de Sacko</h2>
                <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Bienvenue ! Je suis <strong className="text-foreground">Sacko</strong>, créateur digital passionné basé à Bamako. Mon objectif est d&apos;accompagner les entreprises et les porteurs de projets dans la construction d&apos;une <strong className="text-foreground">image de marque forte, professionnelle et mémorable</strong>. De la première idée à la conception finale, je transforme votre vision en une réalité visuelle qui attire et fidélise vos clients.
                  </p>
                  <p>
                    Je maîtrise les outils les plus demandés du marché — <strong className="text-foreground">CapCut Pro, Canva Pro, PicsArt Pro</strong> — et je les mets au service de chaque projet pour garantir des résultats à la hauteur de vos ambitions. Que ce soit un logo percutant, un site web qui convertit, ou une identité visuelle complète, chaque création est pensée pour vous démarquer de la concurrence.
                  </p>
                  <p>
                    Ma mission : <strong className="text-foreground">aider les entrepreneurs et créateurs du Mali et d&apos;Afrique</strong> à prendre le contrôle de leur image numérique. Je crois fermement que chaque business, même le plus modeste, mérite une identité visuelle qui inspire confiance et attire des clients.
                  </p>
                </div>
                <div className="mt-6 grid grid-cols-3 gap-3">
                  {[
                    { number: '50+', label: 'Marques créées' },
                    { number: '100%', label: 'Sur-mesure' },
                    { number: '5/5', label: 'Satisfaction' },
                  ].map((stat) => (
                    <div key={stat.label} className="text-center p-3 rounded-lg bg-muted/50 border">
                      <div className="text-lg font-bold text-amber-600">{stat.number}</div>
                      <div className="text-[10px] text-muted-foreground">{stat.label}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-8 flex flex-wrap gap-3">
                  <a href="#services">
                    <Button className="bg-amber-500 hover:bg-amber-600 text-white font-semibold">
                      Découvrir mes services <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </a>
                  <a href="#contact">
                    <Button variant="outline" className="font-semibold">Me contacter</Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ 17. FAQ ═══ */}
        <section id="faq" className="py-16 sm:py-20 bg-muted/30">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-3 bg-amber-100 text-amber-700 border-amber-200">
                <MessageCircle className="h-3 w-3 mr-1" /> FAQ
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Questions Fréquentes</h2>
              <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
                Les réponses aux questions les plus posées. Si vous ne trouvez pas votre réponse, contactez-moi directement sur WhatsApp.
              </p>
            </div>
            <div className="space-y-3">
              {[
                { q: "L'Offre Découverte est-elle vraiment 100% gratuite ?", a: "Oui, totalement. C'est ma manière de vous prouver la qualité de mon travail avant que vous ne décidiez de passer à une offre Premium payante. Aucun engagement requis, aucun frais caché." },
                { q: "Quels sont les délais de livraison ?", a: "Les services \"Carrière Pro\" (CV, Lettres) sont livrés en moins de 24h. Pour les logos simples, comptez 48h, et pour un site web complet, entre 3 et 7 jours selon la complexité. Chaque projet a un suivi personnalisé." },
                { q: "Puis-je demander des modifications si le résultat ne me plaît pas ?", a: "Absolument. Votre satisfaction est ma priorité. Pour l'Offre Découverte, une révision est incluse. Pour les offres Premium, les révisions sont illimitées jusqu'à ce que le résultat vous corresponde parfaitement. Je ne livre que lorsque vous êtes 100% satisfait." },
                { q: "Pourquoi limitez-vous les commandes à 5 par jour ?", a: "Je privilégie la qualité à la quantité. Travailler avec un nombre limité de clients me permet de dédier toute mon attention et mon expertise à chaque pixel de votre projet. Le résultat : des créations qui convertissent." },
              ].map((faq, i) => {
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
              })}
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
          </div>
        </section>

        {/* ═══ 18. CTA FINAL ═══ */}
        <section className="py-16 sm:py-20 bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 h-64 w-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 h-64 w-64 bg-white/10 rounded-full blur-3xl" />
          </div>
          <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Prêt à faire passer votre communication au niveau supérieur ?
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
                <span className="px-3 py-1 rounded-full bg-white/15 border border-white/20 font-medium">Orange Money</span>
                <span className="px-3 py-1 rounded-full bg-white/15 border border-white/20 font-medium">Moov Money</span>
                <span className="px-3 py-1 rounded-full bg-white/15 border border-white/20 font-medium">Wave</span>
                <span className="px-3 py-1 rounded-full bg-white/15 border border-white/20 font-medium">Cartes Virtuelles</span>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ 19. CONTACT ═══ */}
        <section id="contact" className="py-16 sm:py-20 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12">
              <div>
                <Badge variant="secondary" className="mb-3">
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
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold shadow-lg shadow-amber-500/20"
                >
                  <span className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" /> Envoyer via WhatsApp
                  </span>
                </Button>
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* ═══ 20. FOOTER ═══ */}
      <Footer />

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

      {/* ═══ WHATSAPP FLOTTANT + BACK TO TOP ═══ */}
      <div className="fixed bottom-6 right-6 z-40 hidden lg:flex flex-col items-end gap-3">
        {/* Back to top button - desktop only */}
        <AnimatePresence>
          {showBackToTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 text-white shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40 transition-all duration-300 hover:scale-110"
              aria-label="Retour en haut"
            >
              <ChevronUp className="h-5 w-5" />
            </motion.button>
          )}
        </AnimatePresence>
        {/* WhatsApp button - desktop only */}
        <a
          href="https://wa.me/22397787244?text=Bonjour%20Sacko%20!%20Je%20souhaite%20discuter%20d%27un%20projet."
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 hover:bg-emerald-600 hover:shadow-xl hover:shadow-emerald-500/40 transition-all duration-300 hover:scale-110 group relative"
          aria-label="Contacter sur WhatsApp"
        >
          <MessageCircle className="h-6 w-6" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white dark:border-background" />
          </span>
          <span className="absolute right-full mr-3 whitespace-nowrap rounded-lg bg-gray-900 text-white px-3 py-1.5 text-xs font-medium shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            Me contacter sur WhatsApp
            <span className="absolute top-1/2 -right-1 -translate-y-1/2 h-2 w-2 bg-gray-900 rotate-45" />
          </span>
        </a>
      </div>

      {/* Back to top button - mobile only (above bottom nav) */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-[68px] right-4 z-[60] flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 text-white shadow-lg shadow-amber-500/30 lg:hidden"
            aria-label="Retour en haut"
          >
            <ChevronUp className="h-4 w-4" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}