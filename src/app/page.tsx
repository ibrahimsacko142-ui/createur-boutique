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


/* ─── Animated Counter Hook ─── */
function useCounter(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true)
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [started])

  useEffect(() => {
    if (!started) return
    let start = 0
    let frameId: number
    const step = (timestamp: number) => {
      if (!start) start = timestamp
      const progress = Math.min((timestamp - start) / duration, 1)
      setCount(Math.floor(progress * end))
      if (progress < 1) frameId = requestAnimationFrame(step)
    }
    frameId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frameId)
  }, [started, end, duration])

  return { count, ref }
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
const formations = [
  { text: 'Devenir Designer Pro avec Canva & Illustrator', icon: Palette, price: '5 000', duration: '6h', lessons: '9 leçons', level: 'Débutant' },
  { text: 'Créer et monétiser des vidéos pour réseaux sociaux', icon: MonitorPlay, price: '7 500', duration: '8h', lessons: '15 leçons', level: 'Intermédiaire' },
  { text: 'Créer un site web professionnel (No-code + Next.js)', icon: Globe, price: '10 000', duration: '10h', lessons: '12 leçons', level: 'Intermédiaire' },
  { text: 'Devenir Community Manager pour PME locales', icon: Target, price: '6 000', duration: '7h', lessons: '10 leçons', level: 'Débutant' },
  { text: 'Formation complète en Trading', icon: TrendingUp, level: 'Avancé' },
  { text: 'Formation en Management et Gestion de projets', icon: Building2, level: 'Intermédiaire' },
  { text: 'Formation en Intelligence Artificielle', icon: Brain, level: 'Avancé' },
  { text: 'Formation YouTube et monétisation', icon: Youtube, level: 'Intermédiaire' },
  { text: 'Formation complète en Programmation', icon: Code, level: 'Avancé' },
  { text: 'Formation en Infographie et Design', icon: PenTool, level: 'Débutant' },
  { text: 'Formation E-commerce', icon: ShoppingCart, level: 'Intermédiaire' },
  { text: 'Pack 10 000 templates et ressources Canva', icon: FolderDown, level: 'Tous niveaux' },
  { text: 'Formation en Maintenance informatique', icon: Wrench, level: 'Intermédiaire' },
  { text: 'Formation en Hacking et Sécurité informatique', icon: ShieldCheck, level: 'Avancé' },
  { text: 'Formation Revendeur IPTV', icon: Tv, level: 'Débutant' },
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
  const [inscriptionData, setInscriptionData] = useState({ name: '', phone: '', formation: '' })
  const [faqOpen, setFaqOpen] = useState<string | null>(null)
  const [leadMagnet, setLeadMagnet] = useState({ name: '', contact: '' })
  const { toast } = useToast()

  const stat1 = useCounter(50, 1500)
  const stat3 = useCounter(100, 1500)

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

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 600)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (sessionStorage.getItem('welcomed')) return
    sessionStorage.setItem('welcomed', '1')
    const timer = setTimeout(() => {
      toast({
        title: 'Bienvenue chez Studio Créatif !',
        description: 'Découvrez mes services — tous actuellement gratuits !',
      })
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-background pb-16 lg:pb-0">
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
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L3N2Zz4=')] opacity-50" />
          <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Ce que je fais, en chiffres</h2>
              <p className="mt-2 text-white/80 text-sm">Transparent, impactant, à taille humaine</p>
            </div>
            <div className="grid grid-cols-3 gap-6 sm:gap-12">
              <div key="stat-1" ref={stat1.ref} className="text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm mx-auto mb-3">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold text-white mb-1">{stat1.count}+</div>
                <p className="text-sm font-semibold text-white/90">Marques propulsées</p>
                <p className="text-xs text-white/60 mt-1 leading-relaxed hidden sm:block">Logos, affiches et identités créées avec soin</p>
              </div>
              <div className="text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm mx-auto mb-3">
                  <Palette className="h-6 w-6 text-white" />
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold text-white mb-1">100%</div>
                <p className="text-sm font-semibold text-white/90">Sur-mesure</p>
                <p className="text-xs text-white/60 mt-1 leading-relaxed hidden sm:block">Aucun template pré-fait, chaque pixel est pensé pour vous</p>
              </div>
              <div key="stat-3" ref={stat3.ref} className="text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm mx-auto mb-3">
                  <ThumbsUp className="h-6 w-6 text-white" />
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold text-white mb-1">{stat3.count}%</div>
                <p className="text-sm font-semibold text-white/90">Satisfaction client</p>
                <p className="text-xs text-white/60 mt-1 leading-relaxed hidden sm:block">Une collaboration basée sur l'écoute et le résultat</p>
              </div>
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
        <section id="carriere-pro" className="py-16 sm:py-20 bg-gradient-to-b from-slate-900 via-slate-900 to-background text-white relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 h-72 w-72 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 h-72 w-72 bg-purple-500/10 rounded-full blur-3xl" />
          </div>
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
                <Card key={s.name} className="h-full bg-white/5 border border-white/10 backdrop-blur-sm hover:border-white/20 transition-all duration-300 hover:-translate-y-0.5">
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
            <Card className="border-2 border-amber-400/40 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 backdrop-blur-sm overflow-hidden relative">
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

        {/* ═══ 9. FORMATIONS ═══ */}
        <section id="formations" className="py-16 sm:py-20 relative overflow-hidden text-white" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)' }}>
          <div className="absolute inset-0">
            <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1400&h=800&fit=crop" alt="" className="w-full h-full object-cover opacity-10" />
            <div className="absolute top-10 right-10 h-72 w-72 bg-amber-500/15 rounded-full blur-3xl" />
            <div className="absolute bottom-10 left-10 h-72 w-72 bg-orange-500/15 rounded-full blur-3xl" />
          </div>
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <Badge className="mb-3 bg-amber-500/20 text-amber-300 border-amber-500/30 hover:bg-amber-500/30">
                <GraduationCap className="h-3 w-3 mr-1" /> Expertise & Formations
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Formations dispensées par un <span className="text-amber-400">Expert Actif</span></h2>
              <p className="mt-4 text-slate-300 max-w-2xl mx-auto leading-relaxed">
                Je ne suis pas un simple formateur théorique. Chaque formation est issue de mon expérience terrain à Bamako : vrais projets, vrais clients, vrais revenus. J&apos;aide les entrepreneurs, étudiants et créateurs à développer des compétences immédiatement rentables, avec un suivi personnalisé et des outils professionnels inclus.
              </p>
            </div>

            {/* Premium formation cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-5">
              {formations.filter(f => f.price).map((form, i) => (
                <a
                  key={i}
                  href={`https://wa.me/22397787244?text=${encodeURIComponent(`Bonjour Sacko ! Je suis intéressé(e) par la formation : ${form.text} (${form.price} FCFA). Comment y accéder ?`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-amber-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/10 cursor-pointer overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <div className="relative p-5 sm:p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/30 to-orange-500/30 group-hover:from-amber-500/50 group-hover:to-orange-500/50 transition-colors">
                        <form.icon className="h-5 w-5 text-amber-400" />
                      </div>
                      <div className="flex flex-col items-end gap-1.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          form.level === 'Débutant' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                          form.level === 'Intermédiaire' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                          'bg-violet-500/20 text-violet-400 border border-violet-500/30'
                        }`}>{form.level}</span>
                        <span className="text-2xl font-extrabold text-amber-400">{form.price} <span className="text-xs font-normal text-slate-500">FCFA</span></span>
                      </div>
                    </div>
                    <h3 className="text-sm font-bold text-white leading-snug mb-2">{form.text}</h3>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{form.duration}</span>
                      <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" />{form.lessons}</span>
                    </div>
                    <span className="text-[11px] text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity mt-3 flex items-center gap-1">
                      <MessageCircle className="h-3 w-3" /> S&apos;inscrire via WhatsApp
                    </span>
                  </div>
                </a>
              ))}
            </div>

            {/* Compact formation list */}
            <div className="mt-8">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-3">Autres formations disponibles</p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {formations.filter(f => !f.price).map((form, i) => (
                  <a
                    key={i}
                    href={`https://wa.me/22397787244?text=${encodeURIComponent(`Bonjour Sacko ! Je suis intéressé(e) par la formation : ${form.text}. Pouvez-vous me donner plus de détails ?`)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="group flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-emerald-500/40 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300 cursor-pointer"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 flex-shrink-0">
                      <form.icon className="h-4 w-4 text-slate-400 group-hover:text-emerald-400 transition-colors" />
                    </div>
                    <p className="text-xs font-medium text-slate-300 group-hover:text-white transition-colors flex-1">{form.text}</p>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 ${
                      form.level === 'Débutant' ? 'bg-emerald-500/20 text-emerald-400' :
                      form.level === 'Intermédiaire' ? 'bg-amber-500/20 text-amber-400' :
                      form.level === 'Avancé' ? 'bg-violet-500/20 text-violet-400' :
                      'bg-slate-500/20 text-slate-400'
                    }`}>{form.level}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-white/20 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
                  </a>
                ))}
              </div>
            </div>

            <div className="mt-8 text-center">
              <a href="#inscription">
                <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold shadow-lg shadow-emerald-500/20 transition-transform duration-200 hover:scale-105 active:scale-95">
                  <UserCheck className="h-4 w-4 mr-2" /> Je veux m&apos;inscrire maintenant
                </Button>
              </a>
              <p className="mt-3 text-slate-400 text-xs">Remplissez le formulaire d&apos;inscription ci-dessous</p>
            </div>
          </div>
        </section>

        {/* ═══ 10. COLLECTIF ═══ */}
        <section id="collectif" className="py-16 sm:py-20 bg-gradient-to-br from-purple-950 via-slate-900 to-indigo-950 text-white relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/3 h-80 w-80 bg-purple-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 h-64 w-64 bg-indigo-500/10 rounded-full blur-3xl" />
          </div>
          <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <Badge className="mb-3 bg-purple-500/20 text-purple-300 border-purple-500/30 hover:bg-purple-500/30">
                <Users className="h-3 w-3 mr-1" /> Collectif
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Collectif Studio Créatif</h2>
              <p className="mt-3 text-slate-400 max-w-xl mx-auto">
                Rejoins une communauté d&apos;entrepreneurs et créateurs qui s&apos;entraident, partagent des opportunités et grandissent ensemble. Accès illimité aux ressources, formations exclusives et soutien personnalisé.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              {[
                { icon: GraduationCap, text: 'Formations exclusives chaque mois' },
                { icon: MessageCircle, text: 'Support direct via WhatsApp' },
                { icon: FolderDown, text: 'Templates & ressources premium' },
                { icon: Users, text: 'Réseau de +200 entrepreneurs' },
              ].map((b, i) => (
                <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-500/5 transition-all duration-300">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/20 flex-shrink-0">
                    <b.icon className="h-4 w-4 text-purple-400" />
                  </div>
                  <p className="text-xs font-medium text-slate-300">{b.text}</p>
                </div>
              ))}
            </div>

            <Card className="border-2 border-purple-400/30 bg-purple-500/10 backdrop-blur-sm overflow-hidden">
              <CardContent className="p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="text-center sm:text-left">
                  <p className="text-sm text-slate-300 mb-1">Abonnement mensuel</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-white">2 000</span>
                    <span className="text-slate-500">–</span>
                    <span className="text-3xl font-extrabold text-white">3 000 FCFA</span>
                    <span className="text-sm text-slate-400">/mois</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Prix d&apos;appel • Se rentabilise par le volume</p>
                </div>
                <a href="https://wa.me/22397787244?text=Bonjour%20!%20Je%20veux%20rejoindre%20le%20Collectif%20SK%20Designer%20Luxe." target="_blank" rel="noopener noreferrer" className="flex-shrink-0">
                  <Button size="lg" className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-bold shadow-xl shadow-purple-500/25 px-8 whitespace-nowrap">
                    <MessageCircle className="h-5 w-5 mr-2" /> Rejoindre le Collectif
                  </Button>
                </a>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* ═══ 11. PORTFOLIO ═══ */}
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



        {/* ═══ 14. INSCRIPTION FORMATION ═══ */}
        <section id="inscription" className="py-16 sm:py-20 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950/20 dark:via-teal-950/10 dark:to-cyan-950/10 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 h-80 w-80 bg-emerald-200/30 dark:bg-emerald-900/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-80 w-80 bg-teal-200/20 dark:bg-teal-900/10 rounded-full blur-3xl" />
          <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <Badge variant="secondary" className="mb-3 bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800">
                <UserCheck className="h-3 w-3 mr-1" /> Inscription
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Inscrivez-vous à une Formation</h2>
              <p className="mt-4 text-muted-foreground max-w-xl mx-auto leading-relaxed">
                Remplissez vos informations et choisissez la formation qui vous intéresse. Votre demande d&apos;inscription sera envoyée directement via WhatsApp pour un traitement rapide.
              </p>
            </div>

            <Card className="border-0 shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 p-1">
                <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 text-white p-6 sm:p-8 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIxLjUiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wOCkiLz48L3N2Zz4=')] opacity-50" />
                  <div className="relative z-10 text-center">
                    <GraduationCap className="h-8 w-8 mx-auto mb-2" />
                    <h3 className="text-xl sm:text-2xl font-extrabold">Formulaire d&apos;Inscription</h3>
                    <p className="mt-1.5 text-white/80 text-sm">Gratuit — Réponse rapide via WhatsApp</p>
                  </div>
                </div>
              </div>
              <CardContent className="p-6 sm:p-8 space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold flex items-center gap-1.5">
                      <UserCheck className="h-3.5 w-3.5 text-emerald-600" /> Votre nom complet *
                    </Label>
                    <Input
                      placeholder="Ex: Amadou Diallo"
                      value={inscriptionData.name}
                      onChange={(e) => setInscriptionData(prev => ({ ...prev, name: e.target.value }))}
                      className="h-11 bg-white dark:bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-emerald-600" /> Votre numéro de téléphone *
                    </Label>
                    <Input
                      type="tel"
                      placeholder="Ex: +223 70 00 00 00"
                      value={inscriptionData.phone}
                      onChange={(e) => setInscriptionData(prev => ({ ...prev, phone: e.target.value }))}
                      className="h-11 bg-white dark:bg-background"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold flex items-center gap-1.5">
                    <GraduationCap className="h-3.5 w-3.5 text-emerald-600" /> Formation souhaitée *
                  </Label>
                  <select
                    value={inscriptionData.formation}
                    onChange={(e) => setInscriptionData(prev => ({ ...prev, formation: e.target.value }))}
                    className="w-full h-12 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500"
                  >
                    <option value="">— Choisissez une formation —</option>
                    {formations.map((form, i) => (
                      <option key={i} value={form.text}>{form.text}</option>
                    ))}
                  </select>
                </div>
                <Button
                  onClick={() => {
                    if (!inscriptionData.name || !inscriptionData.phone || !inscriptionData.formation) {
                      toast({ title: 'Champs requis', description: 'Veuillez remplir votre nom, numéro et choisir une formation.', variant: 'destructive' })
                      return
                    }
                    const msg = encodeURIComponent(
                      `Bonjour Sacko ! Je souhaite m'inscrire à une formation.\n\n` +
                      `Nom : ${inscriptionData.name}\n` +
                      `Téléphone : ${inscriptionData.phone}\n` +
                      `Formation choisie : ${inscriptionData.formation}\n\n` +
                      `Merci de me confirmer mon inscription et de me donner les prochaines étapes !`
                    )
                    window.open(`https://wa.me/22397787244?text=${msg}`, '_blank')
                    toast({ title: 'Inscription envoyée !', description: "Votre demande d'inscription a été envoyée via WhatsApp. Vous recevrez une confirmation rapidement." })
                    setInscriptionData({ name: '', phone: '', formation: '' })
                  }}
                  className="w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white font-bold h-12 text-sm shadow-lg shadow-emerald-500/20 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
                >
                  <MessageCircle className="h-4 w-4 mr-2" /> M&apos;inscrire via WhatsApp
                </Button>
                <div className="flex items-center justify-center gap-4 pt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Gift className="h-3 w-3 text-emerald-500" /> 100% Gratuit</span>
                  <span className="flex items-center gap-1"><Zap className="h-3 w-3 text-emerald-500" /> Réponse rapide</span>
                  <span className="flex items-center gap-1"><Shield className="h-3 w-3 text-emerald-500" /> Données sécurisées</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* ═══ 15. COMMANDE RAPIDE (Formulaire Qualifiant) ═══ */}
        <section id="commande-rapide" className="py-20 sm:py-24">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <Card className="border-0 shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 p-1">
                <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 text-white p-6 sm:p-8 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIxLjUiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wOCkiLz48L3N2Zz4=')] opacity-50" />
                  <div className="relative z-10 text-center">
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
        <div className="flex items-center justify-around h-16 px-2">
          <a href="#accueil" className="flex flex-col items-center gap-0.5 text-muted-foreground hover:text-amber-500 transition-colors py-1 px-2">
            <Sparkles className="h-5 w-5" />
            <span className="text-[10px] font-medium">Accueil</span>
          </a>
          <a href="#services" className="flex flex-col items-center gap-0.5 text-muted-foreground hover:text-amber-500 transition-colors py-1 px-2">
            <Layers className="h-5 w-5" />
            <span className="text-[10px] font-medium">Services</span>
          </a>
          <a href="https://wa.me/22397787244?text=Bonjour%20Sacko%20!%20Je%20souhaite%20discuter%20d%27un%20projet." target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-0.5 -mt-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-lg shadow-emerald-500/30">
              <MessageCircle className="h-6 w-6" />
            </div>
            <span className="text-[10px] font-semibold text-emerald-600">WhatsApp</span>
          </a>
          <a href="#formations" className="flex flex-col items-center gap-0.5 text-muted-foreground hover:text-amber-500 transition-colors py-1 px-2">
            <GraduationCap className="h-5 w-5" />
            <span className="text-[10px] font-medium">Formations</span>
          </a>
          <a href="#contact" className="flex flex-col items-center gap-0.5 text-muted-foreground hover:text-amber-500 transition-colors py-1 px-2">
            <Send className="h-5 w-5" />
            <span className="text-[10px] font-medium">Contact</span>
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
            className="fixed bottom-20 right-4 z-40 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 text-white shadow-lg shadow-amber-500/30 lg:hidden"
            aria-label="Retour en haut"
          >
            <ChevronUp className="h-4 w-4" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}