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
  CreditCard,
  Timer,
  Lock,
  MessageCircle,
  Trophy,
  Flame,
  Clock,
  FileCheck,
  ArrowUpRight,
  Handshake,
  FolderDown,
  GraduationCap,
  Building2,
  UserCheck,
  Megaphone,
  BadgeCheck,
  Wrench,
  TrendingUp,
  Code,
  Brain,
  Youtube,
  ChevronUp,
  ShieldCheck,
  Laptop,
  ThumbsUp,
  Rocket,
  Layers,
  RefreshCw,
  ClipboardCheck,
  Award,
  Users,
  Key,
  Scissors,
  Monitor,
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


/* ─── Format Price ─── */
function formatPrice(p: number) {
  if (p === 0) return 'Gratuit'
  return p.toLocaleString('fr-FR', { style: 'currency', currency: 'XOF', minimumFractionDigits: 0 })
}

/* ═══════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════ */
export default function Home() {
  const [contactData, setContactData] = useState({ name: '', email: '', subject: '', message: '' })
  const [sending, setSending] = useState(false)
  const [showBanner, setShowBanner] = useState(true)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [portfolioFilter, setPortfolioFilter] = useState('Tous')
  const [quickOrder, setQuickOrder] = useState({ service: '', name: '', phone: '', description: '' })
  const [inscriptionData, setInscriptionData] = useState({ name: '', phone: '', formation: '' })
  const [faqOpen, setFaqOpen] = useState<string | null>(null)
  const { toast } = useToast()

  // ── Before / After Slider (CSS-only pointer-based) ──
  function BeforeAfterSlider({ before, after, title }: { before: string; after: string; title: string }) {
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

  // ── Formations data ──
  const formations = [
    { text: 'Devenir Designer Pro avec Canva & Illustrator', icon: Palette, price: '5 000', duration: '6h', lessons: '9 leçons' },
    { text: 'Créer et monétiser des vidéos pour réseaux sociaux', icon: MonitorPlay, price: '7 500', duration: '8h', lessons: '15 leçons' },
    { text: 'Créer un site web professionnel (No-code + Next.js)', icon: Globe, price: '10 000', duration: '10h', lessons: '12 leçons' },
    { text: 'Devenir Community Manager pour PME locales', icon: Target, price: '6 000', duration: '7h', lessons: '10 leçons' },
    { text: 'Formation complète en Trading', icon: TrendingUp },
    { text: 'Formation en Management et Gestion de projets', icon: Building2 },
    { text: 'Formation en Intelligence Artificielle', icon: Brain },
    { text: 'Formation YouTube et monétisation', icon: Youtube },
    { text: 'Formation complète en Programmation', icon: Code },
    { text: 'Formation en Infographie et Design', icon: PenTool },
    { text: 'Formation E-commerce', icon: ShoppingCart },
    { text: 'Pack 10 000 templates et ressources Canva', icon: FolderDown },
    { text: 'Formation en Maintenance informatique', icon: Wrench },
    { text: 'Formation en Hacking et Sécurité informatique', icon: ShieldCheck },
    { text: 'Formation Revendeur IPTV', icon: Tv },
  ]

  const handleSubmitContact = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!contactData.name || !contactData.email || !contactData.message) {
      toast({ title: 'Champs requis', description: 'Veuillez remplir tous les champs obligatoires.', variant: 'destructive' })
      return
    }
    setSending(true)
    const msg = encodeURIComponent(`Bonjour ! Je suis ${contactData.name} (${contactData.email}).\n\nSujet : ${contactData.subject || 'Général'}\n\n${contactData.message}`)
    window.open(`https://wa.me/22397787244?text=${msg}`, '_blank')
    toast({ title: 'Redirection vers WhatsApp', description: 'Votre message sera envoyé via WhatsApp pour une réponse rapide.' })
    setContactData({ name: '', email: '', subject: '', message: '' })
    setSending(false)
  }

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 600)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      toast({
        title: 'Bienvenue chez SK Designer Luxe !',
        description: 'Découvrez mes services — tous actuellement gratuits !',
      })
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-background">
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
                    <img src="/demo-photo.png" alt="SK Designer Luxe - Studio Créatif" className="w-full h-[420px] object-cover" />
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
                <a key={s.label} href="#services" className="flex-shrink-0 flex flex-col items-center gap-1.5 px-4 py-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
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
              {[
                { value: '50+', label: 'Marques propulsées', icon: Award, desc: 'Logos, affiches et identités créées avec soin' },
                { value: '100%', label: 'Sur-mesure', icon: Palette, desc: 'Aucun template pré-fait, chaque pixel est pensé pour vous' },
                { value: '5/5', label: 'Satisfaction client', icon: ThumbsUp, desc: "Une collaboration basée sur l'écoute et le résultat" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm mx-auto mb-3">
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-3xl sm:text-4xl font-extrabold text-white mb-1">{stat.value}</div>
                  <p className="text-sm font-semibold text-white/90">{stat.label}</p>
                  <p className="text-xs text-white/60 mt-1 leading-relaxed hidden sm:block">{stat.desc}</p>
                </div>
              ))}
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
                <Card key={section.cat} className={`border ${section.borderColor} overflow-hidden`}>
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

              {/* Comptes premium — bandeau spécial */}
              <Card className="border-0 shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-5 sm:p-7">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg flex-shrink-0">
                      <Key className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-base mb-1">Comptes Premium (Canva Pro, CapCut Pro, etc.)</h3>
                      <p className="text-sm text-slate-300 leading-relaxed">Accès à des outils professionnels à tarif réduit — pas de version gratuite, mais essai limité disponible sur demande.</p>
                    </div>
                    <a
                      href="https://wa.me/22397787244?text=Bonjour%20!%20Je%20souhaite%20avoir%20un%20compte%20premium%20(Canva%20Pro%2C%20CapCut%20Pro%2C%20etc.)."
                      target="_blank" rel="noopener noreferrer" className="flex-shrink-0"
                    >
                      <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 font-semibold text-xs h-10 whitespace-nowrap">
                        Demander un essai <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                      </Button>
                    </a>
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
        <section id="gagner-argent" className="py-16 sm:py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-3 bg-emerald-100 text-emerald-700 border-emerald-200">
                <TrendingUp className="h-3 w-3 mr-1" /> Revenus
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">4 Domaines pour Gagner de l&apos;Argent</h2>
              <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
                Monétise tes compétences digitales dès maintenant. Voici 4 pistes concrètes avec des tarifs réalistes pour le marché malien.
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  icon: Target,
                  title: 'Création de contenu pour réseaux sociaux',
                  price: 'À partir de 3 000 FCFA/mois',
                  color: 'from-pink-500 to-rose-500',
                  tag: 'Coaching',
                  desc: "Le contenu est le carburant de toute présence en ligne. Au Mali, les entreprises locales, les boutiques de Bamako et les créateurs ont un besoin énorme de visuels professionnels pour Instagram, Facebook et TikTok. J'accompagne les personnes à maîtriser la création de contenu engageant qui génère des interactions et des ventes.",
                  bullets: [
                    'Créer des visuels percutants avec Canva Pro et PicsArt Pro',
                    'Maîtriser les formats stories, reels, posts et carrousels',
                    'Développer une ligne éditoriale cohérente et professionnelle',
                    'Analyser les performances et optimiser la stratégie',
                    'Vendre des packs de contenu mensuels à des entreprises locales',
                  ],
                  revenus: '30 000 – 150 000 FCFA/mois selon les clients',
                },
                {
                  icon: MessageCircle,
                  title: 'Automatisation avec des chatbots WhatsApp',
                  price: 'À partir de 10 000 FCFA/mois',
                  color: 'from-green-500 to-emerald-500',
                  tag: 'Abonnement',
                  desc: "WhatsApp est l'outil de communication N°1 au Mali et en Afrique. Les entrepreneurs perdent des dizaines de clients chaque jour parce qu'ils ne peuvent pas répondre à temps. Les chatbots WhatsApp professionnels automatisent les réponses, qualifient les prospects et captent les leads 24h/24, même pendant la nuit.",
                  bullets: [
                    'Configurer des chatbots professionnels sur WhatsApp Business',
                    'Automatiser les réponses aux questions fréquentes',
                    'Qualifier les prospects automatiquement avant transfert',
                    'Créer des menus interactifs pour guider les clients',
                    'Vendre des abonnements de maintenance mensuels',
                  ],
                  revenus: '50 000 – 200 000 FCFA/mois par client',
                },
                {
                  icon: Globe,
                  title: 'Création de sites web et applications',
                  price: '30 000 – 150 000 FCFA/projet',
                  color: 'from-blue-500 to-indigo-500',
                  tag: 'Projet',
                  desc: "Chaque entrepreneur à Bamako mérite une présence en ligne professionnelle. Les sites web ne sont pas un luxe — ils sont une nécessité pour la crédibilité et la visibilité. Un site bien conçu peut doubler le chiffre d'affaires d'une boutique ou d'un service en quelques mois.",
                  bullets: [
                    'Concevoir des sites vitrines modernes et responsive',
                    'Créer des landing pages qui convertissent les visiteurs en clients',
                    'Développer des portfolios pour freelances et artistes',
                    'Optimiser le référencement local pour Bamako et le Mali',
                    'Livrer en 1-3 jours avec hébergement inclus',
                  ],
                  revenus: '30 000 – 150 000 FCFA par projet (2-5 projets/mois possible)',
                },
                {
                  icon: UserCheck,
                  title: 'Freelance et acquisition de clients',
                  price: '5 000 FCFA/session',
                  color: 'from-amber-500 to-orange-500',
                  tag: 'Coaching privé',
                  desc: "Le freelance est l'une des meilleures façons de gagner de l'argent en ligne depuis le Mali. Mais sans méthode, c'est difficile de trouver ses premiers clients et de fixer ses tarifs. Mon coaching individuel vous donne les clés pour démarrer et construire une activité freelance rentable et pérenne.",
                  bullets: [
                    "Trouver ses premiers clients sur WhatsApp et les réseaux sociaux",
                    'Fixer ses tarifs selon le marché malien',
                    'Gérer ses projets et livrer dans les délais',
                    'Construire une réputation et obtenir des recommandations',
                    'Passer de 0 à 100 000 FCFA/mois en freelance',
                  ],
                  revenus: '50 000 – 300 000 FCFA/mois une fois lancé',
                },
              ].map((d) => (
                <Card key={d.title} className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5">
                  <div className={`h-1.5 bg-gradient-to-r ${d.color}`} />
                  <CardContent className="p-6 sm:p-8">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                      <div className="flex items-start gap-4">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${d.color} text-white shadow-lg flex-shrink-0`}>
                          <d.icon className="h-6 w-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-base">{d.title}</h3>
                            <Badge variant="secondary" className="text-[10px] bg-muted/80">{d.tag}</Badge>
                          </div>
                          <p className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">{d.price}</p>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed mb-5">{d.desc}</p>

                    <ul className="space-y-2.5 mb-5">
                      {d.bullets.map((b, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground leading-relaxed">{b}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-amber-500" />
                        <span className="text-xs text-muted-foreground">Revenus réalistes :</span>
                        <span className="text-sm font-bold text-amber-600 dark:text-amber-400">{d.revenus}</span>
                      </div>
                      <a
                        href={`https://wa.me/22397787244?text=${encodeURIComponent(`Bonjour ! Je suis intéressé(e) par : ${d.title} (${d.price}). J'aimerais en savoir plus.`)}`}
                        target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 transition-colors"
                      >
                        En savoir plus <ArrowRight className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ))}
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
                <GraduationCap className="h-3 w-3 mr-1" /> Formations
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Formations Disponibles</h2>
              <p className="mt-4 text-slate-300 max-w-2xl mx-auto leading-relaxed">
                J&apos;aide les entrepreneurs, étudiants et créateurs à développer leurs compétences digitales avec des formations modernes et accessibles. Chaque formation est conçue pour vous donner des compétences pratiques et immédiatement applicables.
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
                      <span className="text-2xl font-extrabold text-amber-400">{form.price} <span className="text-xs font-normal text-slate-500">FCFA</span></span>
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
                    className="group flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-emerald-500/40 transition-all duration-300 cursor-pointer"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 flex-shrink-0">
                      <form.icon className="h-4 w-4 text-slate-400 group-hover:text-emerald-400 transition-colors" />
                    </div>
                    <p className="text-xs font-medium text-slate-300 group-hover:text-white transition-colors flex-1">{form.text}</p>
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
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Collectif SK Designer Luxe</h2>
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
                <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
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
                  <Card key={i} className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
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

        {/* ═══ 12. TÉMOIGNAGES (Horizontal Scroll) ═══ */}
        <section id="temoignages" className="py-16 sm:py-20 bg-gradient-to-b from-muted/20 to-background relative overflow-hidden">
          <div className="absolute top-0 right-0 h-72 w-72 bg-amber-200/20 dark:bg-amber-900/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 h-72 w-72 bg-orange-200/15 dark:bg-orange-900/10 rounded-full blur-3xl" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <Badge variant="secondary" className="mb-3 bg-amber-100 text-amber-700 border-amber-200">
                <Star className="h-3 w-3 mr-1" /> Témoignages
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Ce Que Disent Mes Clients</h2>
              <p className="mt-4 text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                La satisfaction de mes clients est ma plus grande fierté. Découvrez les avis de ceux qui m&apos;ont fait confiance pour leurs projets digitaux.
              </p>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 snap-x scrollbar-hide">
              {[
                { name: 'Amadou Diallo', role: 'Entrepreneur, Bamako', text: "Excellent travail ! J'ai commandé un logo et une affiche pour mon entreprise. Le résultat était professionnel et livré en moins de 24h. Je recommande vivement SK Designer Luxe à tous les entrepreneurs.", rating: 5, avatar: 'AD', gradient: 'from-amber-400 to-orange-500' },
                { name: 'Fatoumata Traoré', role: 'Étudiante, Université de Bamako', text: "La formation en design graphique m'a permis de développer mes compétences rapidement. Les explications sont claires et le suivi est personnalisé. Merci SK Designer Luxe !", rating: 5, avatar: 'FT', gradient: 'from-emerald-400 to-teal-500' },
                { name: 'Ibrahim Keita', role: 'Gérant de restaurant', text: "Les visuels pour mes réseaux sociaux sont incroyables. Mon engagement a augmenté de 300% depuis que je travaille avec SK Designer Luxe. Service au top !", rating: 5, avatar: 'IK', gradient: 'from-purple-400 to-pink-500' },
                { name: 'Mariam Coulibaly', role: 'Blogueuse', text: "CapCut Pro et PicsArt Pro gratuitement ! L'activation est rapide et le support est très réactif. Je ne pouvais pas rêver mieux pour mon contenu.", rating: 4, avatar: 'MC', gradient: 'from-blue-400 to-cyan-500' },
                { name: 'Oumar Sidibé', role: 'Propriétaire de boutique', text: "Mon site web est magnifique et professionnel. Mes clients peuvent maintenant me trouver en ligne facilement. Le meilleur investissement pour mon business.", rating: 5, avatar: 'OS', gradient: 'from-red-400 to-orange-500' },
                { name: 'Aïssata Dembélé', role: 'Créatrice de contenu', text: "Le montage vidéo est d'une qualité exceptionnelle. Mes vidéos TikTok et YouTube ont beaucoup plus de vues maintenant. Merci pour votre créativité !", rating: 5, avatar: 'AD', gradient: 'from-pink-400 to-rose-500' },
              ].map((t, i) => (
                <Card key={i} className="flex-shrink-0 min-w-[300px] sm:min-w-[350px] snap-center border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5">
                  <CardContent className="p-6">
                    <div className="flex gap-0.5 mb-4">
                      {Array.from({ length: 5 }).map((_, si) => (
                        <Star key={si} className={`h-4 w-4 ${si < t.rating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30'}`} />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-5 italic">&ldquo;{t.text}&rdquo;</p>
                    <div className="flex items-center gap-3 pt-4 border-t">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${t.gradient} text-white font-bold text-sm shadow-md`}>
                        {t.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-bold">{t.name}</p>
                        <p className="text-xs text-muted-foreground">{t.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
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

        {/* ═══ 15. COMMANDE RAPIDE ═══ */}
        <section id="commande-rapide" className="py-20 sm:py-24">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <Card className="border-0 shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 p-1">
                <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 text-white p-6 sm:p-8 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIxLjUiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wOCkiLz48L3N2Zz4=')] opacity-50" />
                  <div className="relative z-10 text-center">
                    <Zap className="h-8 w-8 mx-auto mb-2" />
                    <h2 className="text-2xl sm:text-3xl font-extrabold">Commander un Service</h2>
                    <p className="mt-2 text-white/80 text-sm">Remplissez le formulaire et recevez votre service gratuitement via WhatsApp.</p>
                    <div className="mt-4 inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-1.5 text-white text-xs font-semibold border border-white/20">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-400" />
                      </span>
                      Limité à 5 commandes par jour — Réservez votre place
                    </div>
                  </div>
                </div>
              </div>
              <CardContent className="p-6 sm:p-8 space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Service souhaité *</Label>
                  <select
                    value={quickOrder.service}
                    onChange={(e) => setQuickOrder(prev => ({ ...prev, service: e.target.value }))}
                    className="w-full h-11 rounded-md border border-input bg-background px-3 text-sm"
                  >
                    <option value="">Sélectionnez un service...</option>
                    <option value="Affiche Professionnelle — Gratuit">Affiche Professionnelle — Gratuit</option>
                    <option value="Logo Professionnel — Gratuit">Logo Professionnel — Gratuit</option>
                    <option value="Site Web Simple — Gratuit">Site Web Simple — Gratuit</option>
                    <option value="Site Web Professionnel — Gratuit">Site Web Professionnel — Gratuit</option>
                    <option value="Montage Vidéo Pro — Gratuit">Montage Vidéo Pro — Gratuit</option>
                    <option value="Contenu Réseaux Sociaux — Gratuit">Contenu Réseaux Sociaux — Gratuit</option>
                    <option value="CapCut Pro — Gratuit">CapCut Pro — Gratuit</option>
                    <option value="PicsArt Pro — Gratuit">PicsArt Pro — Gratuit</option>
                    <option value="IPTV Pro — Gratuit">IPTV Pro — Gratuit</option>
                    <option value="Canva Pro — Gratuit">Canva Pro — Gratuit</option>
                    <option value="Livres Professionnels — Gratuit">Livres Professionnels — Gratuit</option>
                    <option disabled className="font-semibold text-muted-foreground">── Formations ──</option>
                    <option value="Formation en Trading — Gratuit">Formation en Trading — Gratuit</option>
                    <option value="Formation en Management et Gestion de projets — Gratuit">Formation en Management et Gestion de projets — Gratuit</option>
                    <option value="Formation en Intelligence Artificielle — Gratuit">Formation en Intelligence Artificielle — Gratuit</option>
                    <option value="Formation YouTube et Monétisation — Gratuit">Formation YouTube et Monétisation — Gratuit</option>
                    <option value="Formation en Programmation — Gratuit">Formation en Programmation — Gratuit</option>
                    <option value="Formation E-commerce — Gratuit">Formation E-commerce — Gratuit</option>
                    <option value="Formation en Maintenance Informatique — Gratuit">Formation en Maintenance Informatique — Gratuit</option>
                    <option value="Formation en Hacking et Sécurité Informatique — Gratuit">Formation en Hacking et Sécurité Informatique — Gratuit</option>
                    <option disabled className="font-semibold text-muted-foreground">── Carrière Pro ──</option>
                    <option value="Plume Pro (Lettre de motivation) — 800 FCFA">Plume Pro (Lettre de motivation) — 800 FCFA</option>
                    <option value="Relooking CV — 700 FCFA">Relooking CV — 700 FCFA</option>
                    <option value="Impact LinkedIn — 2 000 FCFA">Impact LinkedIn — 2 000 FCFA</option>
                    <option value="Objectif Entretien — 500 FCFA">Objectif Entretien — 500 FCFA</option>
                    <option value="Réseautage Pro (Carte de visite) — 1 500 FCFA">Réseautage Pro (Carte de visite) — 1 500 FCFA</option>
                    <option value="Pack Lancement Carrière — 3 500 FCFA">Pack Lancement Carrière — 3 500 FCFA</option>
                  </select>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Votre nom *</Label>
                    <Input placeholder="Votre nom complet" value={quickOrder.name} onChange={(e) => setQuickOrder(prev => ({ ...prev, name: e.target.value }))} className="h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Téléphone *</Label>
                    <Input type="tel" placeholder="+223 XX XX XX XX" value={quickOrder.phone} onChange={(e) => setQuickOrder(prev => ({ ...prev, phone: e.target.value }))} className="h-11" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Description du projet</Label>
                  <Textarea placeholder="Décrivez votre projet en quelques mots..." rows={3} value={quickOrder.description} onChange={(e) => setQuickOrder(prev => ({ ...prev, description: e.target.value }))} />
                </div>
                <Button
                  onClick={() => {
                    if (!quickOrder.service || !quickOrder.name || !quickOrder.phone) {
                      toast({ title: 'Champs requis', description: 'Service, nom et téléphone sont obligatoires.', variant: 'destructive' })
                      return
                    }
                    const msg = encodeURIComponent(`Bonjour ! Je souhaite commander :\n\nService : ${quickOrder.service}\nNom : ${quickOrder.name}\nTéléphone : ${quickOrder.phone}\nDescription : ${quickOrder.description || 'Aucune description fournie.'}\n\nMerci !`)
                    window.open(`https://wa.me/22397787244?text=${msg}`, '_blank')
                    toast({ title: 'Redirection WhatsApp', description: 'Votre demande de commande est envoyée !' })
                  }}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold h-12 text-sm shadow-lg shadow-emerald-500/20"
                >
                  <Send className="h-4 w-4 mr-2" /> Envoyer ma commande via WhatsApp
                </Button>
                <p className="text-[10px] text-muted-foreground text-center">Réponse garantie en moins de 30 minutes. Tous les services sont gratuits.</p>
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
                    <img src="/demo-photo.png" alt="Sacko - SK Designer Luxe" className="w-full h-72 sm:h-80 object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-amber-900/80 via-amber-900/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm mb-2">
                        <Palette className="h-6 w-6" />
                      </div>
                      <h3 className="text-xl font-bold">Sacko</h3>
                      <p className="mt-0.5 text-white/80 text-sm">SK Designer Luxe &bull; Bamako, Mali</p>
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
                { q: "Est-ce que les services sont vraiment gratuits ?", a: "Oui, tous les services sont actuellement offerts gratuitement. C'est ma façon de vous permettre de découvrir la qualité de mon travail sans aucun engagement financier." },
                { q: "Comment recevoir ma commande ?", a: "Après avoir discuté de votre projet sur WhatsApp, je crée votre design et vous l'envoie directement via WhatsApp ou Google Drive. La livraison se fait généralement entre 1 et 24 heures selon le service." },
                { q: "Quels outils utilisez-vous ?", a: "J'utilise les meilleurs outils professionnels du marché : Canva Pro pour le design, CapCut Pro pour le montage vidéo, PicsArt Pro pour le design mobile, et des outils web professionnels pour les sites." },
                { q: "Combien de révisions sont incluses ?", a: "Les révisions sont illimitées et gratuites. Je travaille jusqu'à ce que vous soyez entièrement satisfait du résultat. Votre satisfaction est ma priorité absolue." },
                { q: "Comment suivre une formation ?", a: "Cliquez simplement sur la formation qui vous intéresse. Vous serez redirigé vers WhatsApp où je vous expliquerai le contenu et comment y accéder. Simple et direct." },
                { q: "Travaillez-vous avec des clients en dehors de Bamako ?", a: "Absolument ! Je travaille avec des clients partout au Mali et en Afrique. Toutes les communications et livraisons se font en ligne via WhatsApp et Google Drive." },
              ].map((faq, i) => {
                const isOpen = faqOpen === `faq-${i}`
                return (
                  <Card key={i} className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
                    <button
                      onClick={() => setFaqOpen(isOpen ? null : `faq-${i}`)}
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
            <div className="mt-8 flex items-center justify-center gap-6 text-white/80 text-sm">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4" /> Livraison rapide</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4" /> Satisfaction garantie</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4" /> Paiement sécurisé</span>
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
                    <Youtube className="h-5 w-5 text-amber-600" />
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
                  disabled={sending}
                >
                  {sending ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                      Envoi en cours...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4" /> Envoyer via WhatsApp
                    </span>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* ═══ 20. FOOTER ═══ */}
      <Footer />

      {/* ═══ WHATSAPP FLOTTANT + BACK TO TOP ═══ */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {/* Back to top button */}
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
        {/* WhatsApp button */}
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
    </div>
  )
}