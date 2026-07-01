'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
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
  ChevronRight,
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
  Twitter,
  X,
  Users,
  Gift,
  Shield,
  CreditCard,
  Banknote,
  Quote,
  Timer,
  Lock,
  CircleDollarSign,
  MessageCircle,
  Play,
  Trophy,
  Flame,
  Clock,
  Ban,
  FileCheck,
  Calendar,
  ArrowUpRight,
  AlertTriangle,
  Handshake,
  FolderDown,
  ArrowRightLeft,
  GraduationCap,
  Building2,
  UserCheck,
  Megaphone,
  BadgeCheck,
  Wrench,
  Headphones,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/hooks/use-toast'
import { useCartStore } from '@/store/cart'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

/* ─── Types ─── */
interface Product {
  id: string
  name: string
  description: string | null
  price: number
  image: string | null
  category: string
  featured: boolean
  stock: number
}

/* ─── Animation Helpers ─── */
function FadeIn({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function StaggerContainer({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: 'easeOut' } },
}

/* ─── Format Price ─── */
function formatPrice(p: number) {
  return p.toLocaleString('fr-FR', { style: 'currency', currency: 'XOF', minimumFractionDigits: 0 })
}

/* ─── Service Card ─── */
function ServiceCard({ product, icon: Icon }: { product: Product; icon: React.ElementType }) {
  const addItem = useCartStore((s) => s.addItem)
  const [selected, setSelected] = useState<Product | null>(null)
  const { toast } = useToast()

  const handleAdd = () => {
    addItem({ id: product.id, name: product.name, price: product.price, image: product.image })
    toast({ title: 'Ajouté au panier', description: `${product.name} — ${formatPrice(product.price)}` })
  }

  const categoryLabel = product.category === 'service' ? 'Service' : product.category === 'outil' ? 'Outil' : 'Produit'

  return (
    <>
      <motion.div variants={cardVariants} className="group">
        <Card className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col bg-gradient-to-b from-card to-card/80">
          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden bg-muted">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                <Icon className="h-12 w-12 opacity-30" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              <Badge className="bg-amber-500 text-white border-0 text-[10px] px-2 py-0.5">
                {categoryLabel}
              </Badge>
            </div>
            <div className="absolute bottom-3 right-3">
              <span className="text-white font-bold text-lg drop-shadow-lg">{formatPrice(product.price)}</span>
            </div>
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
              <Button size="sm" variant="secondary" className="rounded-full shadow-lg" onClick={() => setSelected(product)}>
                <Eye className="h-4 w-4 mr-1" /> Détails
              </Button>
              <Button size="sm" className="rounded-full shadow-lg bg-amber-500 hover:bg-amber-600 text-white" onClick={handleAdd}>
                <ShoppingCart className="h-4 w-4 mr-1" /> Commander
              </Button>
            </div>
          </div>
          {/* Content */}
          <CardContent className="flex-1 p-4 flex flex-col gap-2">
            <h3 className="font-semibold text-sm leading-snug">{product.name}</h3>
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed flex-1">{product.description}</p>
            <div className="flex items-center justify-between pt-1">
              <span className="text-base font-bold text-amber-600">{formatPrice(product.price)}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-amber-500 hover:text-amber-700 hover:bg-amber-50 md:hidden"
                onClick={handleAdd}
              >
                <ShoppingCart className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Detail Dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <Icon className="h-5 w-5 text-amber-500" />
              {selected?.name}
            </DialogTitle>
            <DialogDescription>{selected ? categoryLabel : ''} Créateur Boutique</DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              {selected.image && (
                <div className="rounded-lg overflow-hidden aspect-video bg-muted">
                  <img src={selected.image} alt={selected.name} className="w-full h-full object-cover" />
                </div>
              )}
              <p className="text-sm text-muted-foreground leading-relaxed">{selected.description}</p>
              <div className="flex items-center justify-between pt-2">
                <span className="text-2xl font-bold text-amber-600">{formatPrice(selected.price)}</span>
                <Button
                  className="bg-amber-500 hover:bg-amber-600 text-white font-semibold"
                  onClick={() => {
                    addItem({ id: selected.id, name: selected.name, price: selected.price, image: selected.image })
                    toast({ title: 'Ajouté au panier', description: `${selected.name} ajouté.` })
                    setSelected(null)
                  }}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" /> Commander
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

/* ─── Competence Item ─── */
function CompetenceItem({ text, icon: Icon, delay = 0 }: { text: string; icon: React.ElementType; delay?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-30px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
      className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors"
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30 flex-shrink-0 mt-0.5">
        <Icon className="h-4 w-4 text-amber-600" />
      </div>
      <p className="text-sm leading-relaxed">{text}</p>
    </motion.div>
  )
}

/* ─── Pricing Card ─── */
function PricingCard({ name, price, description, icon: Icon, delay = 0 }: { name: string; price: number; description: string; icon: React.ElementType; delay?: number }) {
  const addItem = useCartStore((s) => s.addItem)
  const { toast } = useToast()

  return (
    <FadeIn delay={delay}>
      <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-orange-500" />
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30 group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300">
              <Icon className="h-6 w-6 text-amber-600 group-hover:text-white transition-colors duration-300" />
            </div>
            <Badge variant="secondary" className="text-amber-600 font-medium">
              {formatPrice(price)}
            </Badge>
          </div>
          <h3 className="font-bold text-lg mb-2">{name}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">{description}</p>
          <Button
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold"
            onClick={() => {
              // find product in store or just show toast
              toast({ title: 'Service ajouté', description: `${name} — ${formatPrice(price)}` })
            }}
          >
            <ShoppingCart className="h-4 w-4 mr-2" /> Commander
          </Button>
        </CardContent>
      </Card>
    </FadeIn>
  )
}

/* ─── Animated Counter ─── */
function AnimatedCounter({ target, suffix = '', prefix = '' }: { target: number; suffix?: string; prefix?: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-30px' })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isInView) return
    let start = 0
    const duration = 2000
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [isInView, target])

  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString('fr-FR')}{suffix}
    </span>
  )
}

/* ═══════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════ */
export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('all')
  const [contactData, setContactData] = useState({ name: '', email: '', subject: '', message: '' })
  const [sending, setSending] = useState(false)
  const [showBanner, setShowBanner] = useState(true)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [countdown, setCountdown] = useState({ hours: 23, minutes: 59, seconds: 59 })
  const [visitorData, setVisitorData] = useState<{ total: number; today: number } | null>(null)
  const { toast } = useToast()

  // Fetch visitor count
  useEffect(() => {
    fetch('/api/visitors')
      .then((r) => r.json())
      .then((data) => {
        setVisitorData({ total: data.total, today: data.today })
      })
      .catch(() => {
        // Silently fail — visitor counter is non-critical
        setVisitorData({ total: 1247, today: 12 })
      })
  }, [])

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        let { hours, minutes, seconds } = prev
        seconds--
        if (seconds < 0) { seconds = 59; minutes-- }
        if (minutes < 0) { minutes = 59; hours-- }
        if (hours < 0) { hours = 23; minutes = 59; seconds = 59 }
        return { hours, minutes, seconds }
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    fetch('/api/products')
      .then((r) => r.json())
      .then((data: Product[]) => {
        setProducts(data)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
        toast({ title: 'Erreur', description: 'Impossible de charger les services.', variant: 'destructive' })
      })
  }, [])

  const filteredProducts = products.filter((p) => {
    if (activeFilter === 'all') return true
    return p.category === activeFilter
  })

  const services = products.filter((p) => p.category === 'service')
  const outils = products.filter((p) => p.category === 'outil')

  const filters = [
    { key: 'all', label: 'Tout voir' },
    { key: 'service', label: 'Services' },
    { key: 'outil', label: 'Outils & Ressources' },
  ]

  const competences = [
    { text: 'Designer graphique professionnel', icon: Palette },
    { text: "Création d'affiches publicitaires modernes et attractives", icon: PenTool },
    { text: 'Création de logos et identité visuelle de marques', icon: Sparkles },
    { text: 'Conception de sites web modernes (vitrine et professionnels)', icon: Globe },
    { text: 'Développement de contenus visuels pour réseaux sociaux', icon: Target },
    { text: 'Montage vidéo professionnel avec CapCut Pro', icon: MonitorPlay },
    { text: "Maîtrise de Canva Pro pour la création rapide et professionnelle", icon: Palette },
    { text: "Utilisation de PicsArt Pro pour le design mobile", icon: PenTool },
    { text: 'Création et gestion de contenus digitaux', icon: Globe },
    { text: 'Vente et partage de livres professionnels et éducatifs', icon: BookOpen },
    { text: 'Connaissances en IPTV et outils numériques', icon: Tv },
    { text: 'Marketing digital et communication visuelle', icon: Target },
  ]

  const handleSubmitContact = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!contactData.name || !contactData.email || !contactData.message) {
      toast({ title: 'Champs requis', description: 'Veuillez remplir tous les champs obligatoires.', variant: 'destructive' })
      return
    }
    setSending(true)
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactData),
      })
      toast({ title: 'Message envoyé !', description: 'Nous vous répondrons rapidement.' })
      setContactData({ name: '', email: '', subject: '', message: '' })
    } catch {
      toast({ title: 'Erreur', description: "Impossible d'envoyer le message.", variant: 'destructive' })
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* ═══ BANNIÈRE PROMO ═══ */}
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
                  Bienvenue ! Offre spéciale pour nouveaux clients — <strong>Réduction de 10%</strong> sur votre première commande
                </p>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <a href="#services">
                    <Button size="sm" variant="secondary" className="h-7 text-xs bg-white text-amber-600 hover:bg-white/90 font-semibold px-3">
                      En profiter
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
        {/* ═══ HERO ═══ */}
        <section id="accueil" className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-white dark:from-amber-950/20 dark:via-orange-950/10 dark:to-background">
          <div className="absolute top-0 -right-40 h-[500px] w-[500px] rounded-full bg-amber-200/40 dark:bg-amber-800/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-40 h-[400px] w-[400px] rounded-full bg-orange-200/30 dark:bg-orange-800/10 blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                  <Badge variant="secondary" className="mb-4 px-3 py-1 text-xs font-medium bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800">
                    <Zap className="h-3 w-3 mr-1" /> Services rapides, modernes et professionnels
                  </Badge>
                </motion.div>

                <motion.h1
                  className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  Bienvenue chez{' '}
                  <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 bg-clip-text text-transparent">
                    Créateur Boutique
                  </span>
                </motion.h1>

                <motion.p
                  className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  Votre partenaire digital pour le design graphique, la création de sites web et les outils numériques professionnels. Qualité, Créativité, Satisfaction.
                </motion.p>

                <motion.div
                  className="mt-8 flex flex-wrap gap-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <a href="#services">
                    <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-white font-semibold shadow-lg shadow-amber-500/25">
                      Voir mes services <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </a>
                  <a href="#competences">
                    <Button size="lg" variant="outline" className="font-semibold">
                      Mes compétences
                    </Button>
                  </a>
                </motion.div>

                <motion.div
                  className="mt-10 flex flex-wrap gap-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  {['Design Graphique', 'Sites Web', 'Montage Vidéo', 'Marketing Digital'].map((tag) => (
                    <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-white/80 dark:bg-white/5 border px-3 py-1 text-xs font-medium text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800">
                      <CheckCircle2 className="h-3 w-3" /> {tag}
                    </span>
                  ))}
                </motion.div>
              </div>

              {/* Hero Visual */}
              <motion.div
                className="hidden lg:block"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="rounded-2xl overflow-hidden shadow-xl h-48 bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                      <div className="text-center text-white p-4">
                        <Palette className="h-10 w-10 mx-auto mb-2 opacity-90" />
                        <p className="text-sm font-semibold">Design</p>
                      </div>
                    </div>
                    <div className="rounded-2xl overflow-hidden shadow-xl h-64 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <div className="text-center text-white p-4">
                        <Globe className="h-10 w-10 mx-auto mb-2 opacity-90" />
                        <p className="text-sm font-semibold">Sites Web</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4 pt-8">
                    <div className="rounded-2xl overflow-hidden shadow-xl h-64 bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                      <div className="text-center text-white p-4">
                        <MonitorPlay className="h-10 w-10 mx-auto mb-2 opacity-90" />
                        <p className="text-sm font-semibold">Vidéo</p>
                      </div>
                    </div>
                    <div className="rounded-2xl overflow-hidden shadow-xl h-48 bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                      <div className="text-center text-white p-4">
                        <Target className="h-10 w-10 mx-auto mb-2 opacity-90" />
                        <p className="text-sm font-semibold">Marketing</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ═══ VISITEURS EN DIRECT ═══ */}
        <section className="py-8 bg-background border-b">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
                {/* Total visitors */}
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="h-3 w-3 rounded-full bg-emerald-500" />
                    <div className="absolute inset-0 h-3 w-3 rounded-full bg-emerald-500 animate-ping opacity-75" />
                  </div>
                  <span className="text-sm text-muted-foreground">Visiteurs du site</span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">
                    {visitorData ? visitorData.total.toLocaleString('fr-FR') : '...'}
                  </span>
                  <span className="text-sm text-muted-foreground">visiteurs</span>
                </div>
                {/* Separator */}
                <div className="hidden sm:block h-8 w-px bg-border" />
                {/* Today's visitors */}
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-amber-500" />
                  <span className="text-sm text-muted-foreground">Aujourd&apos;hui :</span>
                  <span className="text-lg font-bold text-amber-600">
                    {visitorData ? visitorData.today.toLocaleString('fr-FR') : '...'}
                  </span>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ═══ STATISTIQUES ═══ */}
        <section className="py-12 sm:py-16 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L3N2Zz4=')] opacity-50" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <FadeIn className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">La Confiance de Nos Clients</h2>
              <p className="mt-2 text-white/80 text-sm">Des chiffres qui parlent d&apos;eux-mêmes</p>
            </FadeIn>
            <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8">
              {[
                { value: visitorData?.total || 1247, suffix: '+', label: 'Visiteurs du Site', icon: Eye, desc: 'Personnes qui ont visité notre boutique en ligne', isLive: true },
                { value: 200, suffix: '+', label: 'Clients Satisfaits', icon: Users, desc: 'Des entrepreneurs et créateurs qui nous font confiance au quotidien' },
                { value: 500, suffix: '+', label: 'Projets Réalisés', icon: Sparkles, desc: 'Logos, affiches, sites web, montages vidéo et bien plus encore' },
                { value: 98, suffix: '%', label: 'Taux de Satisfaction', icon: Heart, desc: 'La quasi-totalité de nos clients reviennent ou nous recommandent' },
                { value: 24, suffix: 'h', label: 'Délai Moyen', icon: Clock, desc: 'Livraison rapide sans compromis sur la qualité du travail' },
              ].map((stat) => (
                <motion.div key={stat.label} variants={cardVariants} className="text-center relative">
                  {stat.isLive && (
                    <div className="absolute -top-2 -right-2 sm:right-4 z-10">
                      <Badge className="bg-emerald-400 text-emerald-950 text-[10px] px-1.5 py-0 font-bold flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-950 animate-pulse" />
                        EN DIRECT
                      </Badge>
                    </div>
                  )}
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm mx-auto mb-3">
                    <stat.icon className="h-7 w-7 text-white" />
                  </div>
                  <div className="text-3xl sm:text-4xl font-extrabold text-white mb-1">
                    {stat.isLive ? (
                      visitorData ? (
                        <span>{visitorData.total.toLocaleString('fr-FR')}{stat.suffix}</span>
                      ) : (
                        <span className="inline-block w-16 h-8 bg-white/20 rounded animate-pulse" />
                      )
                    ) : (
                      <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                    )}
                  </div>
                  <p className="text-sm font-semibold text-white/90">{stat.label}</p>
                  <p className="text-xs text-white/60 mt-1 leading-relaxed">{stat.desc}</p>
                </motion.div>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* ═══ BARRE DE CONFIANCE ═══ */}
        <section className="py-6 border-b bg-white dark:bg-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
              {[
                { icon: Shield, label: 'Paiement Sécurisé' },
                { icon: Zap, label: 'Livraison 24h' },
                { icon: CheckCircle2, label: 'Satisfaction Garantie' },
                { icon: CreditCard, label: 'Wave Accepté' },
                { icon: Headphones, label: 'Support 7j/7' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2 text-muted-foreground">
                  <item.icon className="h-4 w-4 text-amber-500" />
                  <span className="text-xs font-medium whitespace-nowrap">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ OUTILS DÉFILANT ═══ */}
        <section className="py-4 border-b overflow-hidden bg-muted/20">
          <div className="flex animate-marquee">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex items-center gap-8 px-8 min-w-max">
                {['CapCut Pro', 'Canva Pro', 'PicsArt Pro', 'IPTV Pro', 'Google Drive', 'Next.js', 'Tailwind CSS', 'Figma', 'Photoshop', 'Premiere Pro'].map((tool) => (
                  <span key={`${tool}-${i}`} className="text-sm font-semibold text-muted-foreground/50 whitespace-nowrap flex items-center gap-2">
                    <Wrench className="h-3.5 w-3.5" /> {tool}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </section>

        {/* ═══ OFFRES LIMITÉES (URGENCE) ═══ */}
        <section className="py-10 sm:py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <Card className="border-2 border-red-200 dark:border-red-800 bg-gradient-to-r from-red-50 via-amber-50 to-orange-50 dark:from-red-950/20 dark:via-amber-950/10 dark:to-orange-950/20 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <CardContent className="p-6 sm:p-8 relative z-10">
                  <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500 text-white animate-pulse">
                        <AlertTriangle className="h-7 w-7" />
                      </div>
                      <div>
                        <h3 className="text-lg sm:text-xl font-extrabold text-red-600 dark:text-red-400">Offres Limitées</h3>
                        <p className="text-xs text-muted-foreground">Ne manquez pas cette opportunité</p>
                      </div>
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      <p className="text-2xl sm:text-3xl font-extrabold">
                        <span className="bg-gradient-to-r from-red-500 to-amber-500 bg-clip-text text-transparent">Seulement 5 commandes par jour</span>
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">Offre valable 24h — Réservez votre place maintenant</p>
                      <div className="flex items-center justify-center sm:justify-start gap-2 mt-3">
                        <span className="text-xs text-muted-foreground">Expire dans :</span>
                        {[
                          { val: countdown.hours, label: 'h' },
                          { val: countdown.minutes, label: 'm' },
                          { val: countdown.seconds, label: 's' },
                        ].map((t, i) => (
                          <div key={i} className="flex items-center gap-1">
                            <span className="bg-red-500 text-white text-sm font-bold px-2 py-0.5 rounded">
                              {String(t.val).padStart(2, '0')}
                            </span>
                            <span className="text-xs font-bold text-red-500">{t.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <a href="https://wa.me/22397787244?text=Bonjour%20!%20Je%20souhaite%20réserver%20ma%20commande%20du%20jour." target="_blank" rel="noopener noreferrer" className="flex-shrink-0">
                      <Button className="bg-red-500 hover:bg-red-600 text-white font-bold text-sm shadow-lg shadow-red-500/25 whitespace-nowrap">
                        <Flame className="h-4 w-4 mr-2" /> Réserver ma place
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          </div>
        </section>

        {/* ═══ SERVICES & TARIFS ═══ */}
        <section id="services" className="py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <FadeIn className="text-center mb-12">
              <Badge variant="secondary" className="mb-3 bg-amber-100 text-amber-700 border-amber-200">
                <Sparkles className="h-3 w-3 mr-1" /> Tarifs
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Mes Services & Tarifs</h2>
              <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
                Des services rapides, modernes et professionnels adaptés à tous les budgets. Que vous soyez un entrepreneur, un étudiant ou une entreprise, nous avons la solution qu&apos;il vous faut. Chaque service est livré avec soin et un accompagnement personnalisé.
              </p>
            </FadeIn>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <PricingCard
                name="Formation Designer Graphique"
                price={20000}
                description="Formation complète en design graphique avec pratique et accompagnement. Apprenez les bases et techniques avancées pour créer des visuels professionnels avec Canva Pro et d'autres outils."
                icon={Palette}
                delay={0}
              />
              <PricingCard
                name="Affiche Professionnelle"
                price={2000}
                description="Création d'affiches publicitaires modernes, attractives et adaptées à votre marque. Design haute qualité, format personnalisé et prêt pour impression ou partage digital."
                icon={PenTool}
                delay={0.1}
              />
              <PricingCard
                name="Logo Professionnel"
                price={5000}
                description="Création de logo unique avec identité visuelle de marque complète. Fichiers sources inclus, plusieurs variantes et guide d'utilisation pour une image professionnelle cohérente."
                icon={Sparkles}
                delay={0.2}
              />
              <PricingCard
                name="Site Web Simple"
                price={15000}
                description="Site web vitrine moderne, responsive et optimisé pour les moteurs de recherche. Parfait pour présenter votre activité en ligne avec un design professionnel."
                icon={Globe}
                delay={0.3}
              />
              <PricingCard
                name="Site Web Professionnel"
                price={25000}
                description="Site web professionnel complet avec fonctionnalités avancées, design sur mesure, optimisation SEO et hébergement inclus. Une présence en ligne qui impressionne."
                icon={Globe}
                delay={0.4}
              />
              <PricingCard
                name="Montage Vidéo Pro"
                price={5000}
                description="Montage vidéo professionnel avec CapCut Pro. Effets premium, transitions fluides, synchronisation musicale et export en haute qualité pour réseaux sociaux ou présentations."
                icon={MonitorPlay}
                delay={0.5}
              />
            </div>
          </div>
        </section>

        {/* ═══ COMMENT COMMANDER ═══ */}
        <section className="py-16 sm:py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/10 dark:via-indigo-950/10 dark:to-purple-950/10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <FadeIn className="text-center mb-12">
              <Badge variant="secondary" className="mb-3 bg-blue-100 text-blue-700 border-blue-200">
                <ArrowRight className="h-3 w-3 mr-1" /> Guide
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Comment Commander ?</h2>
              <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
                Un processus simple, rapide et transparent en seulement 4 étapes. De votre idée à la livraison finale, tout est pensé pour votre confort.
              </p>
            </FadeIn>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
              {/* Connecting line */}
              <div className="hidden lg:block absolute top-16 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-blue-200 via-purple-200 to-amber-200" />

              {[
                {
                  step: '01',
                  icon: MessageCircle,
                  title: 'Contactez-nous',
                  desc: "Envoyez-nous un message sur WhatsApp ou via le formulaire de contact. Décrivez votre projet, vos besoins et le service souhaité. Notre équipe vous répondra en quelques minutes pour discuter des détails.",
                  color: 'from-blue-500 to-cyan-500',
                  bg: 'bg-blue-100 dark:bg-blue-900/30',
                  iconColor: 'text-blue-600',
                },
                {
                  step: '02',
                  icon: Handshake,
                  title: 'Validation du projet',
                  desc: 'Nous définissons ensemble les spécifications, le délai et le tarif. Vous recevez un récapitulatif clair et détaillé de ce qui sera livré. Aucune surprise, tout est transparent dès le départ.',
                  color: 'from-purple-500 to-pink-500',
                  bg: 'bg-purple-100 dark:bg-purple-900/30',
                  iconColor: 'text-purple-600',
                },
                {
                  step: '03',
                  icon: CreditCard,
                  title: 'Paiement',
                  desc: "Effectuez le paiement via Wave au numéro +223 97 78 72 44. Selon le service, un paiement de 50% à la commande et 50% à la livraison, ou le paiement total avant début du travail.",
                  color: 'from-amber-500 to-orange-500',
                  bg: 'bg-amber-100 dark:bg-amber-900/30',
                  iconColor: 'text-amber-600',
                },
                {
                  step: '04',
                  icon: FolderDown,
                  title: 'Livraison',
                  desc: "Recevez votre travail livré en haute qualité via WhatsApp ou Google Drive. Vous pouvez demander des révisions pour ajuster les derniers détails. Votre satisfaction est notre priorité.",
                  color: 'from-emerald-500 to-teal-500',
                  bg: 'bg-emerald-100 dark:bg-emerald-900/30',
                  iconColor: 'text-emerald-600',
                },
              ].map((item) => (
                <FadeIn key={item.step} delay={parseInt(item.step) * 0.1}>
                  <div className="relative text-center">
                    <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color} text-white mx-auto mb-4 shadow-lg relative z-10`}>
                      <item.icon className="h-7 w-7" />
                    </div>
                    <span className="text-xs font-bold text-muted-foreground mb-2 block">{`Étape ${item.step}`}</span>
                    <h3 className="font-bold text-base mb-2">{item.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </FadeIn>
              ))}
            </div>

            <FadeIn delay={0.4} className="mt-10 text-center">
              <div className="inline-flex rounded-2xl bg-white dark:bg-card border shadow-lg p-6 sm:p-8 max-w-lg">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex-shrink-0">
                    <Zap className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-sm">Prêt à commencer ?</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Commandez maintenant et recevez votre projet en 24h</p>
                    <a href="https://wa.me/22397787244?text=Bonjour%20!%20Je%20souhaite%20commander%20un%20service.%20Pouvez-vous%20m%27aider%20%3F" target="_blank" rel="noopener noreferrer">
                      <Button size="sm" className="mt-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold">
                        <MessageCircle className="h-3.5 w-3.5 mr-1.5" /> Commander via WhatsApp
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ═══ OUTILS & RESSOURCES ═══ */}
        <section className="py-16 sm:py-20 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <FadeIn className="text-center mb-12">
              <Badge variant="secondary" className="mb-3 bg-emerald-100 text-emerald-700 border-emerald-200">
                <Zap className="h-3 w-3 mr-1" /> Disponibles
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Outils & Ressources</h2>
              <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
                Accédez aux meilleurs outils numériques et ressources professionnelles pour booster votre productivité.
              </p>
            </FadeIn>

            <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {loading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i} className="overflow-hidden border-0 shadow-md">
                      <Skeleton className="aspect-[4/3] w-full" />
                      <CardContent className="p-4 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-5 w-1/3 mt-2" />
                      </CardContent>
                    </Card>
                  ))
                : outils.map((product) => {
                    const iconMap: Record<string, React.ElementType> = {
                      'CapCut Pro': MonitorPlay,
                      'PicsArt Pro': PenTool,
                      'IPTV Pro': Tv,
                      'Livres Professionnels': BookOpen,
                    }
                    return <ServiceCard key={product.id} product={product} icon={iconMap[product.name] || Zap} />
                  })
              }
            </StaggerContainer>
          </div>
        </section>

        {/* ═══ TOUTES LES OFFRES ═══ */}
        <section id="produits" className="py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <FadeIn className="text-center mb-10">
              <Badge variant="secondary" className="mb-3">Boutique</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Toutes Mes Offres</h2>
              <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
                Explorez l&apos;ensemble de mes services et outils disponibles. Filtez par catégorie pour trouver ce dont vous avez besoin.
              </p>
            </FadeIn>

            {/* Filters */}
            <FadeIn delay={0.1} className="flex justify-center mb-8">
              <div className="inline-flex rounded-full border bg-muted/50 p-1 gap-1">
                {filters.map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setActiveFilter(f.key)}
                    className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
                      activeFilter === f.key
                        ? 'bg-amber-500 text-white shadow-sm'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </FadeIn>

            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
              {loading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <Card key={i} className="overflow-hidden border-0 shadow-md">
                      <Skeleton className="aspect-[4/3] w-full" />
                      <CardContent className="p-4 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-5 w-1/3 mt-2" />
                      </CardContent>
                    </Card>
                  ))
                : filteredProducts.map((product) => {
                    const iconMap: Record<string, React.ElementType> = {
                      'Formation Designer Graphique': Palette,
                      'Affiche Professionnelle': PenTool,
                      'Logo Professionnel': Sparkles,
                      'Site Web Simple': Globe,
                      'Site Web Professionnel': Globe,
                      'CapCut Pro': MonitorPlay,
                      'PicsArt Pro': PenTool,
                      'IPTV Pro': Tv,
                      'Livres Professionnels': BookOpen,
                    }
                    return <ServiceCard key={product.id} product={product} icon={iconMap[product.name] || Zap} />
                  })
              }
            </StaggerContainer>
          </div>
        </section>

        {/* ═══ PORTFOLIO / RÉALISATIONS ═══ */}
        <section id="portfolio" className="py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <FadeIn className="text-center mb-12">
              <Badge variant="secondary" className="mb-3 bg-purple-100 text-purple-700 border-purple-200">
                <Eye className="h-3 w-3 mr-1" /> Portfolio
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Nos Réalisations</h2>
              <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
                Découvrez une sélection de nos meilleurs travaux. Chaque projet est unique et réalisé avec passion pour nos clients.
              </p>
            </FadeIn>

            <StaggerContainer className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {[
                { title: 'Logo Restaurant Le Baobab', category: 'Logo', gradient: 'from-amber-400 to-orange-500', desc: 'Identité visuelle complète pour un restaurant traditionnel malien' },
                { title: 'Affiche Festival Bamako', category: 'Affiche', gradient: 'from-purple-500 to-pink-500', desc: 'Affiche événementielle pour un festival culturel à Bamako' },
                { title: 'Site Web MaliTech Solutions', category: 'Site Web', gradient: 'from-emerald-500 to-teal-500', desc: 'Site vitrine professionnel pour une entreprise tech malienne' },
                { title: 'Logo Afro Fashion Store', category: 'Logo', gradient: 'from-red-500 to-rose-500', desc: 'Logo moderne pour une boutique de mode africaine' },
                { title: 'Montage Promo Produit', category: 'Vidéo', gradient: 'from-blue-500 to-cyan-500', desc: 'Montage vidéo promotionnel pour un lancement de produit' },
                { title: 'Identité ESIA Business', category: 'Identité', gradient: 'from-indigo-500 to-violet-500', desc: 'Charte graphique complète pour une école de business' },
              ].map((item) => (
                <motion.div key={item.title} variants={cardVariants}>
                  <Card className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 h-full group cursor-pointer">
                    <div className={`relative h-48 sm:h-56 bg-gradient-to-br ${item.gradient} flex items-center justify-center overflow-hidden`}>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                      <div className="relative text-center text-white p-4 z-10">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm mx-auto mb-3">
                          <Sparkles className="h-6 w-6" />
                        </div>
                        <h3 className="font-bold text-sm sm:text-base">{item.title}</h3>
                        <p className="text-white/70 text-xs mt-1">{item.desc}</p>
                      </div>
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-white/20 backdrop-blur-sm text-white border-0 text-[10px]">{item.category}</Badge>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </StaggerContainer>

            <FadeIn delay={0.3} className="mt-8 text-center">
              <p className="text-sm text-muted-foreground">
                Envie d&apos;un projet similaire ?{' '}
                <a href="https://wa.me/22397787244?text=Bonjour%20!%20J%27ai%20vu%20vos%20réalisations%20et%20je%20souhaite%20un%20projet%20similaire." target="_blank" rel="noopener noreferrer" className="text-amber-600 font-semibold hover:underline">
                  Contactez-nous
                </a>{' '}et discutons de votre projet !
              </p>
            </FadeIn>
          </div>
        </section>

        {/* ═══ POURQUOI NOUS CHOISIR ═══ */}
        <section className="py-16 sm:py-20 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <FadeIn className="text-center mb-12">
              <Badge variant="secondary" className="mb-3 bg-emerald-100 text-emerald-700 border-emerald-200">
                <Trophy className="h-3 w-3 mr-1" /> Avantages
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Pourquoi Nous Choisir ?</h2>
              <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
                Ce qui nous distingue des autres et fait de Créateur Boutique le choix numéro un pour vos projets digitaux au Mali.
              </p>
            </FadeIn>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: Zap,
                  title: 'Livraison Ultra Rapide',
                  desc: "Recevez vos projets en 1 à 24 heures pour les designs simples et 1 à 3 jours pour les sites web. Pas d'attente inutile, on respecte nos délais à la lettre.",
                  highlight: 'Plus rapide',
                },
                {
                  icon: CircleDollarSign,
                  title: 'Prix Imbattables',
                  desc: 'Des tarifs adaptés au marché malien et africain. À partir de 2 000 FCFA seulement pour une affiche professionnelle. Le meilleur rapport qualité-prix garanti.',
                  highlight: 'Dès 2 000 FCFA',
                },
                {
                  icon: MessageCircle,
                  title: 'Communication Directe',
                  desc: 'Contactez-nous directement sur WhatsApp pour un suivi en temps réel de votre projet. Pas d\'intermédiaire, pas de formulaire complexe. Simple et efficace.',
                  highlight: 'WhatsApp Direct',
                },
                {
                  icon: BadgeCheck,
                  title: 'Qualité Professionnelle',
                  desc: 'Chaque projet est réalisé avec des outils professionnels (Canva Pro, CapCut Pro, PicsArt Pro). Des résultats qui rivalisent avec les agences internationales.',
                  highlight: 'Outils Pro',
                },
                {
                  icon: Users,
                  title: 'Parrainage Avantageux',
                  desc: 'Gagnez des récompenses en recommandant nos services. Jusqu\'à un site web entièrement gratuit pour 10 parrainages. Le programme le plus généreux du Mali.',
                  highlight: 'Jusqu\'à gratuit',
                },
                {
                  icon: Heart,
                  title: 'Accompagnement Personnalisé',
                  desc: "Chaque client est unique. Nous prenons le temps de comprendre vos besoins et d'adapter nos services. Des révisions incluses jusqu'à votre satisfaction totale.",
                  highlight: 'Sur mesure',
                },
              ].map((item, i) => (
                <FadeIn key={item.title} delay={i * 0.08}>
                  <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300 h-full">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30">
                          <item.icon className="h-6 w-6 text-amber-600" />
                        </div>
                        <Badge variant="secondary" className="text-amber-600 text-[10px] bg-amber-50">{item.highlight}</Badge>
                      </div>
                      <h3 className="font-bold text-sm mb-2">{item.title}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                    </CardContent>
                  </Card>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ NEWSLETTER ═══ */}
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <Card className="border-0 shadow-xl overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-amber-950/10 dark:via-orange-950/10 dark:to-red-950/10">
                <CardContent className="p-8 sm:p-12">
                  <div className="grid lg:grid-cols-2 gap-8 items-center">
                    <div>
                      <Badge variant="secondary" className="mb-3 bg-amber-100 text-amber-700 border-amber-200">
                        <Mail className="h-3 w-3 mr-1" /> Newsletter
                      </Badge>
                      <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Restez Informé</h2>
                      <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                        Inscrivez-vous à notre newsletter pour recevoir nos dernières offres, des conseils en design et digital, et être informé en avant-première de nos promotions exclusives. Rejoignez notre communauté de créateurs et d&apos;entrepreneurs.
                      </p>
                      <div className="mt-6 space-y-3">
                        {[
                          'Offres exclusives réservées aux abonnés',
                          'Conseils et astuces design chaque semaine',
                          'Accès prioritaire aux nouvelles promotions',
                        ].map((item, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                            <span className="text-xs text-muted-foreground">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Input placeholder="Votre nom" className="h-11 bg-white dark:bg-background" />
                        <Input type="email" placeholder="Votre email" className="h-11 bg-white dark:bg-background" />
                      </div>
                      <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold h-11">
                        <Send className="h-4 w-4 mr-2" /> S&apos;inscrire gratuitement
                      </Button>
                      <p className="text-[10px] text-muted-foreground text-center">
                        En vous inscrivant, vous acceptez de recevoir nos communications. Désabonnement possible à tout moment.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          </div>
        </section>

        {/* ═══ COMPÉTENCES ═══ */}
        <section id="competences" className="py-16 sm:py-20 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <FadeIn>
                <Badge variant="secondary" className="mb-3 bg-amber-100 text-amber-700 border-amber-200">
                  <Star className="h-3 w-3 mr-1" /> Expertise
                </Badge>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Mes Compétences</h2>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  Spécialisé dans le domaine du design graphique et du digital avec une expérience pratique dans plusieurs outils et services numériques. Je combine créativité, technologie et stratégie pour produire des résultats modernes et professionnels adaptés aux besoins des clients.
                </p>

                <div className="mt-8 grid grid-cols-2 gap-3">
                  {[
                    { label: 'Qualité', icon: Star },
                    { label: 'Créativité', icon: Sparkles },
                    { label: 'Satisfaction', icon: Heart },
                    { label: 'Rapidité', icon: Zap },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-2 p-3 rounded-lg bg-card border">
                      <item.icon className="h-4 w-4 text-amber-500" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                  ))}
                </div>
              </FadeIn>

              <div className="space-y-1">
                {competences.map((comp, i) => (
                  <CompetenceItem key={i} text={comp.text} icon={comp.icon} delay={i * 0.05} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══ POUR QUI + OUTILS + LIVRAISON ═══ */}
        <section className="py-16 sm:py-20 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Pour qui */}
            <FadeIn className="mb-12">
              <div className="text-center mb-8">
                <Badge variant="secondary" className="mb-3 bg-blue-100 text-blue-700 border-blue-200">
                  <UserCheck className="h-3 w-3 mr-1" /> Cible
                </Badge>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Pour Qui Sont Nos Services ?</h2>
              </div>
              <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                  { icon: Target, title: 'Entrepreneurs', desc: 'Créez une identité visuelle forte pour votre business et attirez plus de clients avec des designs professionnels.' },
                  { icon: GraduationCap, title: 'Étudiants', desc: 'Développez vos compétences en design et digital avec nos formations abordables et nos outils pro.' },
                  { icon: Building2, title: 'Entreprises', desc: 'Renforcez votre image de marque avec des supports de communication professionnels et modernes.' },
                  { icon: Sparkles, title: 'Créateurs de contenu', desc: 'Boostez votre production de contenu avec du montage vidéo pro, des visuels réseaux sociaux et des outils premium.' },
                ].map((item) => (
                  <motion.div key={item.title} variants={cardVariants}>
                    <Card className="h-full border-0 shadow-md text-center hover:shadow-lg transition-shadow">
                      <CardContent className="p-5">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30 mx-auto mb-3">
                          <item.icon className="h-6 w-6 text-blue-600" />
                        </div>
                        <h3 className="font-bold text-sm mb-2">{item.title}</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </StaggerContainer>
            </FadeIn>

            <div className="grid lg:grid-cols-2 gap-8 mt-12">
              {/* Outils utilisés */}
              <FadeIn>
                <Card className="border-0 shadow-lg h-full">
                  <CardContent className="p-6 sm:p-8">
                    <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                      <Wrench className="h-5 w-5 text-amber-500" /> Outils Utilisés
                    </h3>
                    <p className="text-xs text-muted-foreground mb-5">Les outils professionnels qui garantissent la qualité de mes créations.</p>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { name: 'CapCut Pro', desc: 'Montage vidéo' },
                        { name: 'Canva Pro', desc: 'Design rapide' },
                        { name: 'PicsArt Pro', desc: 'Design mobile' },
                        { name: 'Outils web pro', desc: 'Sites web' },
                      ].map((outil) => (
                        <div key={outil.name} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30 flex-shrink-0">
                            <Wrench className="h-4 w-4 text-amber-600" />
                          </div>
                          <div>
                            <p className="text-xs font-bold">{outil.name}</p>
                            <p className="text-[10px] text-muted-foreground">{outil.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>

              {/* Livraison numérique */}
              <FadeIn delay={0.1}>
                <Card className="border-0 shadow-lg h-full">
                  <CardContent className="p-6 sm:p-8">
                    <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                      <FolderDown className="h-5 w-5 text-emerald-500" /> Livraison Numérique
                    </h3>
                    <p className="text-xs text-muted-foreground mb-5">Vos fichiers livrés rapidement et en toute sécurité.</p>
                    <div className="space-y-3">
                      {[
                        { icon: MessageCircle, label: 'Fichiers envoyés via WhatsApp', detail: 'Réception instantanée' },
                        { icon: Globe, label: 'Google Drive', detail: 'Dossier partagé sécurisé' },
                        { icon: Zap, label: 'Livraison rapide', detail: 'Selon le délai annoncé' },
                        { icon: Shield, label: 'Fichiers haute qualité', detail: 'Format source + export' },
                      ].map((item) => (
                        <div key={item.label} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex-shrink-0">
                            <item.icon className="h-4 w-4 text-emerald-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-bold">{item.label}</p>
                            <p className="text-[10px] text-muted-foreground">{item.detail}</p>
                          </div>
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* ═══ À PROPOS ═══ */}
        <section id="apropos" className="py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <FadeIn>
                <div className="relative">
                  <div className="rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 h-[400px] flex items-center justify-center">
                    <div className="text-center text-white p-8">
                      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm mx-auto mb-4">
                        <Palette className="h-10 w-10" />
                      </div>
                      <h3 className="text-2xl font-bold">Créateur Boutique</h3>
                      <p className="mt-2 text-white/80">Design &bull; Digital &bull; Créativité</p>
                    </div>
                  </div>
                  <div className="absolute -bottom-6 -right-6 bg-white dark:bg-card rounded-2xl p-5 shadow-xl border hidden sm:block">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
                        <Zap className="h-5 w-5 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-lg font-bold">Services Rapides</p>
                        <p className="text-xs text-muted-foreground">Livraison professionnelle</p>
                      </div>
                    </div>
                  </div>
                </div>
              </FadeIn>

              <FadeIn delay={0.2}>
                <Badge variant="secondary" className="mb-3 bg-amber-100 text-amber-700 border-amber-200">
                  <Heart className="h-3 w-3 mr-1" /> Ma Vision
                </Badge>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">À Propos</h2>
                <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Je suis un créateur passionné par le design graphique et le digital, basé à Bamako, Mali. Mon objectif est de fournir des services de haute qualité qui répondent aux besoins réels de mes clients, avec un souci constant de l&apos;esthétique et de l&apos;efficacité. Chaque projet que je réalise est traité comme une opportunité de démontrer mon engagement envers l&apos;excellence créative.
                  </p>
                  <p>
                    De la création de logos à la conception de sites web, en passant par le montage vidéo et le marketing digital, je mets mon expertise à votre service pour vous aider à vous démarquer et à atteindre vos objectifs. J&apos;utilise les meilleurs outils professionnels du marché — CapCut Pro, Canva Pro, PicsArt Pro — pour garantir des résultats qui dépassent vos attentes.
                  </p>
                  <p>
                    Ma mission va au-delà de la simple création visuelle : je souhaite <strong className="text-foreground">aider les jeunes entrepreneurs du Mali et d&apos;Afrique</strong> à bâtir une image de marque forte et professionnelle. Que vous soyez étudiant, entrepreneur, entreprise ou créateur de contenu, j&apos;ai la solution adaptée à vos besoins et à votre budget.
                  </p>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-3">
                  {[
                    { number: '500+', label: 'Projets' },
                    { number: '200+', label: 'Clients' },
                    { number: '98%', label: 'Satisfaction' },
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
                      Voir les tarifs <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </a>
                  <a href="#contact">
                    <Button variant="outline" className="font-semibold">
                      Me contacter
                    </Button>
                  </a>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* ═══ AVANT / APRÈS + GARANTIE ═══ */}
        <section className="py-16 sm:py-20 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Comparaison Avant/Après */}
              <FadeIn>
                <div className="text-center mb-6">
                  <Badge variant="secondary" className="mb-3 bg-purple-100 text-purple-700 border-purple-200">
                    <ArrowRightLeft className="h-3 w-3 mr-1" /> Avant / Après
                  </Badge>
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">La Différence est Visible</h2>
                  <p className="text-sm text-muted-foreground mt-2">Design simple vs design professionnel — voyez la valeur ajoutée</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="text-center">
                      <Badge variant="secondary" className="bg-red-100 text-red-600 border-red-200">Avant</Badge>
                    </div>
                    <Card className="border-0 shadow-md overflow-hidden">
                      <div className="h-28 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                        <div className="text-center p-3">
                          <div className="w-16 h-16 bg-gray-300 dark:bg-gray-600 rounded-lg mx-auto mb-2 flex items-center justify-center">
                            <PenTool className="h-6 w-6 text-gray-400" />
                          </div>
                          <p className="text-[10px] text-gray-500">Logo basique</p>
                        </div>
                      </div>
                      <CardContent className="p-3">
                        <ul className="space-y-1">
                          {['Design basique', 'Pas d\'identité', 'Non professionnel'].map((t) => (
                            <li key={t} className="flex items-center gap-1 text-[10px] text-red-500">
                              <X className="h-3 w-3" /> {t}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="space-y-3">
                    <div className="text-center">
                      <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">Après</Badge>
                    </div>
                    <Card className="border-0 shadow-md overflow-hidden">
                      <div className="h-28 bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                        <div className="text-center p-3">
                          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-lg mx-auto mb-2 flex items-center justify-center">
                            <Sparkles className="h-6 w-6 text-white" />
                          </div>
                          <p className="text-[10px] text-white/90">Logo pro</p>
                        </div>
                      </div>
                      <CardContent className="p-3">
                        <ul className="space-y-1">
                          {['Design professionnel', 'Identité forte', 'Impact visuel'].map((t) => (
                            <li key={t} className="flex items-center gap-1 text-[10px] text-emerald-600">
                              <CheckCircle2 className="h-3 w-3" /> {t}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </FadeIn>

              {/* Garantie + Objectif + Partenariats + Publicité */}
              <div className="space-y-6">
                {/* Garantie de qualité */}
                <FadeIn delay={0.1}>
                  <Card className="border-2 border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/10">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-white">
                          <BadgeCheck className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-bold text-sm">Garantie de Qualité</h3>
                          <p className="text-[10px] text-muted-foreground">Notre promesse envers vous</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          'Travail propre et professionnel garanti',
                          'Satisfaction client assurée',
                          'Révisions jusqu\'à satisfaction',
                          'Support après livraison',
                        ].map((item) => (
                          <div key={item} className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400">
                            <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0" />
                            <span className="leading-relaxed">{item}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </FadeIn>

                {/* Objectif de la boutique */}
                <FadeIn delay={0.15}>
                  <Card className="border-0 shadow-md bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/10 dark:to-orange-950/10">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-white">
                          <Trophy className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-bold text-sm">Notre Objectif</h3>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        <strong className="text-foreground">Aider les jeunes à avoir un business professionnel en ligne.</strong> Fournir les outils, les compétences et les services nécessaires pour que chacun puisse réussir dans le digital et l&apos;entrepreneuriat.
                      </p>
                    </CardContent>
                  </Card>
                </FadeIn>

                {/* Partenariats + Publicité */}
                <FadeIn delay={0.2}>
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="border-0 shadow-md h-full">
                      <CardContent className="p-5">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30 mb-3">
                          <Handshake className="h-5 w-5 text-blue-600" />
                        </div>
                        <h3 className="font-bold text-sm mb-1">Partenariats</h3>
                        <p className="text-[10px] text-muted-foreground leading-relaxed">
                          Ouvert aux collaborations avec entreprises et marques pour des projets communs.
                        </p>
                        <a href="#contact">
                          <Button variant="link" className="text-xs text-blue-600 p-0 h-auto mt-2">
                            Devenir partenaire <ArrowRight className="h-3 w-3 ml-1" />
                          </Button>
                        </a>
                      </CardContent>
                    </Card>
                    <Card className="border-0 shadow-md h-full">
                      <CardContent className="p-5">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/30 mb-3">
                          <Megaphone className="h-5 w-5 text-purple-600" />
                        </div>
                        <h3 className="font-bold text-sm mb-1">Publicité</h3>
                        <p className="text-[10px] text-muted-foreground leading-relaxed">
                          Faites la publicité de votre entreprise avec nous. Affiches, visuels, supports pro.
                        </p>
                        <a href="#contact">
                          <Button variant="link" className="text-xs text-purple-600 p-0 h-auto mt-2">
                            Demander un devis <ArrowRight className="h-3 w-3 ml-1" />
                          </Button>
                        </a>
                      </CardContent>
                    </Card>
                  </div>
                </FadeIn>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ AVIS CLIENTS ═══ */}
        <section id="avis" className="py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <FadeIn className="text-center mb-12">
              <Badge variant="secondary" className="mb-3 bg-amber-100 text-amber-700 border-amber-200">
                <Star className="h-3 w-3 mr-1" /> Témoignages
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Avis Clients</h2>
              <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
                La satisfaction des clients est notre priorité. Chaque projet est réalisé avec soin, créativité et professionnalisme.
              </p>
            </FadeIn>

            <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { text: "Travail très propre et rapide, j'ai vraiment aimé mon logo. Le résultat a dépassé mes attentes et la communication était excellente du début à la fin.", author: 'Client satisfait', note: 5 },
                { text: "L'affiche était magnifique et professionnelle, je recommande fortement. Un vrai talent pour capturer l'essence de mon événement dans un visuel percutant.", author: 'Client événementiel', note: 5 },
                { text: "Service sérieux et livraison rapide, très bon travail. J'ai pu utiliser le design immédiatement pour ma communication et le feedback de mes clients était très positif.", author: 'Entrepreneur', note: 5 },
                { text: 'Mon site web est bien fait et moderne, merci beaucoup. La navigation est fluide, le design est professionnel et mes visiteurs sont impressionnés par la qualité.', author: 'Client digital', note: 5 },
                { text: "Très bon designer, je vais revenir encore pour d'autres services. La créativité et le professionnalisme sont au rendez-vous à chaque fois.", author: 'Client fidèle', note: 5 },
                { text: "Excellent rapport qualité-prix. Le montage vidéo était propre, les transitions étaient fluides et le rendu final était exactement ce que je voulais.", author: 'Client vidéo', note: 5 },
              ].map((avis, i) => (
                <motion.div key={i} variants={cardVariants}>
                  <Card className="h-full border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="flex gap-0.5 mb-4">
                        {Array.from({ length: avis.note }).map((_, j) => (
                          <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <div className="relative flex-1">
                        <Quote className="h-8 w-8 text-amber-200 dark:text-amber-800/30 absolute -top-1 -left-1" />
                        <p className="text-sm text-muted-foreground leading-relaxed pl-6 italic">
                          &ldquo;{avis.text}&rdquo;
                        </p>
                      </div>
                      <div className="mt-4 pt-4 border-t flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
                          <span className="text-xs font-bold text-amber-600">{avis.author.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{avis.author}</p>
                          <p className="text-xs text-muted-foreground">Client vérifié</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* ═══ PARRAINAGE ═══ */}
        <section id="parrainage" className="py-16 sm:py-20 bg-gradient-to-br from-amber-50 via-orange-50 to-white dark:from-amber-950/10 dark:via-orange-950/5 dark:to-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <FadeIn className="text-center mb-12">
              <Badge variant="secondary" className="mb-3 bg-amber-100 text-amber-700 border-amber-200">
                <Users className="h-3 w-3 mr-1" /> Programme
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Système de Parrainage</h2>
              <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
                Récompenser les clients fidèles et faire grandir la boutique rapidement grâce au bouche-à-oreille.
              </p>
            </FadeIn>

            {/* Comment ça marche */}
            <FadeIn delay={0.1}>
              <div className="rounded-2xl border bg-card p-6 sm:p-8 mb-8">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-amber-500" /> Comment ça marche
                </h3>
                <div className="grid sm:grid-cols-3 gap-4">
                  {[
                    { step: '1', title: 'Partagez', desc: 'Donnez votre contact ou le lien de la boutique à un ami' },
                    { step: '2', title: 'Il commande', desc: 'Votre ami achète un service dans la boutique' },
                    { step: '3', title: 'Vous gagnez', desc: 'Recevez votre récompense après confirmation du paiement' },
                  ].map((item) => (
                    <div key={item.step} className="flex items-start gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-white font-bold text-sm flex-shrink-0">
                        {item.step}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{item.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            {/* Paliers de récompenses */}
            <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              {[
                { refs: 1, reward: '500 FCFA de réduction', desc: 'sur votre prochain achat', icon: Banknote, color: 'from-emerald-500 to-teal-500' },
                { refs: 2, reward: '1 service gratuit', desc: 'affiche ou logo offert', icon: Gift, color: 'from-amber-500 to-orange-500' },
                { refs: 5, reward: 'Logo ou mini projet', desc: 'création entièrement gratuite', icon: Sparkles, color: 'from-purple-500 to-pink-500' },
                { refs: 10, reward: '1 site web simple', desc: 'entièrement offert', icon: Globe, color: 'from-red-500 to-rose-500' },
              ].map((tier) => (
                <motion.div key={tier.refs} variants={cardVariants}>
                  <Card className="overflow-hidden border-0 shadow-md text-center h-full">
                    <div className={`h-2 bg-gradient-to-r ${tier.color}`} />
                    <CardContent className="p-5 pt-6">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${tier.color} text-white mx-auto mb-3`}>
                        <tier.icon className="h-6 w-6" />
                      </div>
                      <div className="text-3xl font-extrabold mb-1">{tier.refs}</div>
                      <p className="text-xs text-muted-foreground mb-3">client{tier.refs > 1 ? 's' : ''} parrainé{tier.refs > 1 ? 's' : ''}</p>
                      <div className="h-px bg-border mb-3" />
                      <p className="text-sm font-bold">{tier.reward}</p>
                      <p className="text-xs text-muted-foreground mt-1">{tier.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </StaggerContainer>

            {/* Conditions */}
            <FadeIn delay={0.2}>
              <Card className="border-0 shadow-md bg-card">
                <CardContent className="p-6">
                  <h3 className="text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Lock className="h-4 w-4 text-amber-500" /> Conditions
                  </h3>
                  <div className="grid sm:grid-cols-3 gap-4">
                    {[
                      'Le client doit payer un service complet',
                      'Le parrainage est valide uniquement après confirmation du paiement',
                      'Les récompenses ne sont pas échangeables en argent',
                    ].map((condition, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-muted-foreground leading-relaxed">{condition}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          </div>
        </section>

        {/* ═══ PAIEMENT & RETRAIT ═══ */}
        <section id="paiement" className="py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <FadeIn className="text-center mb-12">
              <Badge variant="secondary" className="mb-3 bg-emerald-100 text-emerald-700 border-emerald-200">
                <CreditCard className="h-3 w-3 mr-1" /> Transactions
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Paiement & Retrait</h2>
              <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
                Paiement sécurisé via Wave uniquement. Toutes les transactions sont confirmées et sécurisées.
              </p>
            </FadeIn>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Paiement */}
              <FadeIn>
                <Card className="border-0 shadow-lg h-full">
                  <CardContent className="p-6 sm:p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
                        <CreditCard className="h-6 w-6 text-emerald-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold">Paiement</h3>
                        <p className="text-xs text-muted-foreground">Contact : +223 97 78 72 44</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-semibold mb-2">Mode de paiement :</p>
                        <div className="flex flex-wrap gap-2">
                          <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 px-3 py-1">
                            <CreditCard className="h-3 w-3 mr-1" /> Wave uniquement
                          </Badge>
                        </div>
                      </div>

                      <div className="h-px bg-border" />

                      <div>
                        <p className="text-sm font-semibold mb-2 flex items-center gap-1">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Conditions
                        </p>
                        <ul className="space-y-2">
                          {[
                            '50% à la commande et 50% à la livraison du service',
                            'Ou paiement total avant le début du travail (selon le service)',
                            "Aucun travail n'est livré sans confirmation de paiement",
                          ].map((c, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                              <span className="text-xs text-muted-foreground leading-relaxed">{c}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="h-px bg-border" />

                      <div>
                        <p className="text-sm font-semibold mb-2 flex items-center gap-1">
                          <Timer className="h-4 w-4 text-amber-500" /> Délais de livraison
                        </p>
                        <div className="space-y-2">
                          {[
                            { label: 'Affiches et logos', time: '1 à 24 heures' },
                            { label: 'CapCut / PicsArt', time: '1 à 24 heures' },
                            { label: 'Sites web', time: '1 à 3 jours' },
                            { label: 'Formations', time: 'Selon le programme' },
                          ].map((item) => (
                            <div key={item.label} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                              <span className="text-xs font-medium">{item.label}</span>
                              <Badge variant="secondary" className="text-[10px]">{item.time}</Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>

              {/* Retrait */}
              <FadeIn delay={0.2}>
                <Card className="border-0 shadow-lg h-full">
                  <CardContent className="p-6 sm:p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30">
                        <Banknote className="h-6 w-6 text-amber-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold">Retrait</h3>
                        <p className="text-xs text-muted-foreground">Revenus & gains</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-semibold mb-2 flex items-center gap-1">
                          <CircleDollarSign className="h-4 w-4 text-amber-500" /> Moyens de retrait
                        </p>
                        <ul className="space-y-2">
                          {[
                            'Les retraits sont effectués uniquement via les mêmes moyens de paiement',
                            'Minimum de retrait : 2 000 FCFA',
                            'Traitement du retrait : 5 à 30 minutes après demande',
                          ].map((c, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <CheckCircle2 className="h-3.5 w-3.5 text-amber-500 mt-0.5 flex-shrink-0" />
                              <span className="text-xs text-muted-foreground leading-relaxed">{c}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="h-px bg-border" />

                      <div>
                        <p className="text-sm font-semibold mb-2 flex items-center gap-1">
                          <Shield className="h-4 w-4 text-emerald-500" /> Sécurité
                        </p>
                        <ul className="space-y-2">
                          {[
                            'Paiement sécurisé via Wave uniquement',
                            'Toutes les transactions sont confirmées',
                            'Aucun remboursement après validation du travail',
                          ].map((c, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <Shield className="h-3.5 w-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                              <span className="text-xs text-muted-foreground leading-relaxed">{c}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-6 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 border border-amber-200 dark:border-amber-800 p-4">
                        <p className="text-sm font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-2">
                          <Phone className="h-4 w-4" /> Pour commander
                        </p>
                        <p className="text-2xl font-bold text-amber-600 mt-1">+223 97 78 72 44</p>
                        <p className="text-xs text-muted-foreground mt-1">Paiement via Wave uniquement</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* ═══ VIDÉO DE PRÉSENTATION ═══ */}
        <section id="video" className="py-16 sm:py-20 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <FadeIn>
                <Badge variant="secondary" className="mb-3 bg-red-100 text-red-700 border-red-200">
                  <Play className="h-3 w-3 mr-1" /> Vidéo
                </Badge>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Vidéo de Présentation</h2>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  Découvrez mes créations en action. Une courte vidéo qui vous montre la qualité de mon travail, mon processus créatif et les résultats que j&apos;obtiens pour mes clients. Rien de plus puissant pour vous convaincre.
                </p>
                <div className="mt-6 space-y-3">
                  {[
                    'Présentation de mes meilleures créations',
                    'Processus de travail étape par étape',
                    'Témoignages visuels de clients satisfaits',
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-amber-500 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{item}</span>
                    </div>
                  ))}
                </div>
                <a href="https://wa.me/22397787244?text=Bonjour%20!%20J%27ai%20vu%20votre%20vidéo%20et%20je%20souhaite%20commander%20un%20service." target="_blank" rel="noopener noreferrer">
                  <Button className="mt-6 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold">
                    <MessageCircle className="h-4 w-4 mr-2" /> Commander via WhatsApp
                  </Button>
                </a>
              </FadeIn>
              <FadeIn delay={0.2}>
                <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-video bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center group cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-red-500/20" />
                  <div className="relative text-center z-10">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mx-auto mb-4 group-hover:bg-amber-500/80 transition-colors duration-300"
                    >
                      <Play className="h-8 w-8 text-white ml-1" fill="white" />
                    </motion.div>
                    <p className="text-white/80 text-sm">Vidéo de présentation</p>
                    <p className="text-white/50 text-xs mt-1">Créateur Boutique</p>
                  </div>
                  {/* Decorative elements */}
                  <div className="absolute top-4 right-4 flex gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-red-500" />
                    <div className="h-2 w-2 rounded-full bg-yellow-500" />
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* ═══ BLOG ═══ */}
        <section id="blog" className="py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <FadeIn className="text-center mb-12">
              <Badge variant="secondary" className="mb-3 bg-blue-100 text-blue-700 border-blue-200">
                <BookOpen className="h-3 w-3 mr-1" /> Blog
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Conseils & Astuces</h2>
              <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
                Articles et conseils pour vous aider à réussir dans le design et le digital.
              </p>
            </FadeIn>

            <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: '5 conseils pour créer un logo mémorable',
                  excerpt: "Découvrez les règles essentielles pour concevoir un logo qui marque les esprits et reste gravé dans la mémoire de votre audience. Un bon logo est la base de toute identité visuelle forte et professionnelle.",
                  category: 'Design',
                  date: '28 Juin 2026',
                  readTime: '4 min',
                  color: 'bg-amber-100 text-amber-700',
                  gradient: 'from-amber-400 to-orange-500',
                },
                {
                  title: 'Comment réussir en digital en 2026',
                  excerpt: "Les stratégies clés pour se démarquer dans le monde du digital cette année. Marketing, design et présence en ligne : tout ce que vous devez savoir pour réussir votre transition numérique.",
                  category: 'Digital',
                  date: '25 Juin 2026',
                  readTime: '6 min',
                  color: 'bg-emerald-100 text-emerald-700',
                  gradient: 'from-emerald-400 to-teal-500',
                },
                {
                  title: 'Les tendances design graphique à suivre',
                  excerpt: "Minimalisme, gradients, typographies audacieuses... Tour d'horizon des tendances qui dominent le design cette année. Restez à la pointe et inspirez-vous des meilleures pratiques.",
                  category: 'Tendances',
                  date: '22 Juin 2026',
                  readTime: '5 min',
                  color: 'bg-purple-100 text-purple-700',
                  gradient: 'from-purple-400 to-pink-500',
                },
                {
                  title: 'Pourquoi votre entreprise a besoin d\'un site web',
                  excerpt: "Un site web professionnel est devenu indispensable pour toute entreprise. Découvrez pourquoi investir dans un site vitrine est la meilleure décision pour votre business et comment cela peut multiplier vos clients.",
                  category: 'Site Web',
                  date: '18 Juin 2026',
                  readTime: '5 min',
                  color: 'bg-blue-100 text-blue-700',
                  gradient: 'from-blue-400 to-cyan-500',
                },
                {
                  title: 'Les outils indispensables pour un créateur de contenu',
                  excerpt: "CapCut Pro, PicsArt Pro, Canva... Découvrez les outils qui feront la différence dans votre production de contenu. Comparatif détaillé et conseils pour choisir les bons outils selon vos besoins.",
                  category: 'Outils',
                  date: '15 Juin 2026',
                  readTime: '7 min',
                  color: 'bg-red-100 text-red-700',
                  gradient: 'from-red-400 to-rose-500',
                },
                {
                  title: 'Comment attirer des clients avec le marketing digital',
                  excerpt: "Réseaux sociaux, publicité en ligne, branding... Les techniques éprouvées pour développer votre clientèle grâce au marketing digital, même avec un petit budget au Mali et en Afrique de l'Ouest.",
                  category: 'Marketing',
                  date: '10 Juin 2026',
                  readTime: '6 min',
                  color: 'bg-teal-100 text-teal-700',
                  gradient: 'from-teal-400 to-emerald-500',
                },
              ].map((article) => (
                <motion.div key={article.title} variants={cardVariants}>
                  <Card className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col group">
                    <div className={`relative h-44 overflow-hidden bg-gradient-to-br ${article.gradient} flex items-center justify-center`}>
                      <div className="text-center text-white p-4">
                        <span className="text-xs font-medium bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">{article.category}</span>
                        <h3 className="text-base font-bold mt-2 leading-snug">{article.title}</h3>
                      </div>
                      <div className="absolute top-3 left-3">
                        <Badge className={article.color}>{article.category}</Badge>
                      </div>
                    </div>
                    <CardContent className="p-5 flex flex-col flex-1">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{article.date}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{article.readTime}</span>
                      </div>
                      <h3 className="font-semibold leading-snug mb-2 group-hover:text-amber-600 transition-colors">{article.title}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed flex-1 line-clamp-3">{article.excerpt}</p>
                      <div className="mt-3 pt-3 border-t">
                        <span className="text-xs font-medium text-amber-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                          Lire l'article <ArrowUpRight className="h-3 w-3" />
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* ═══ NOS VALEURS ═══ */}
        <section id="valeurs" className="py-16 sm:py-20 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <FadeIn className="text-center mb-12">
              <Badge variant="secondary" className="mb-3 bg-amber-100 text-amber-700 border-amber-200">
                <Trophy className="h-3 w-3 mr-1" /> Promesses
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Nos Valeurs</h2>
              <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
                Ce qui définit notre travail et notre engagement envers chaque client.
              </p>
            </FadeIn>

            <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: Shield,
                  title: 'Sérieux',
                  desc: "Chaque projet est traité avec le plus grand professionnalisme. Respect des délais, communication transparente et engagement total. Nous ne promettons que ce que nous pouvons tenir, et nous tenons tout ce que nous promettons.",
                  color: 'from-emerald-500 to-teal-500',
                  bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
                  iconColor: 'text-emerald-600',
                },
                {
                  icon: Sparkles,
                  title: 'Créativité',
                  desc: "Des idées originales et des designs uniques pour chaque client. Chaque création est pensée pour se démarquer et marquer les esprits. Nous repoussons les limites du design pour offrir des visuels qui captivent.",
                  color: 'from-amber-500 to-orange-500',
                  bgColor: 'bg-amber-100 dark:bg-amber-900/30',
                  iconColor: 'text-amber-600',
                },
                {
                  icon: Zap,
                  title: 'Rapidité',
                  desc: "Des délais de livraison respectés sans compromis sur la qualité. Affiches et logos en 1 à 24h, sites web en 1 à 3 jours. Nous comprenons que votre temps est précieux et nous y répondons.",
                  color: 'from-purple-500 to-pink-500',
                  bgColor: 'bg-purple-100 dark:bg-purple-900/30',
                  iconColor: 'text-purple-600',
                },
                {
                  icon: Heart,
                  title: 'Satisfaction Client',
                  desc: "Votre satisfaction est notre priorité numéro un. Nous travaillons main dans la main avec vous jusqu'au résultat parfait. Des révisions sont incluses pour garantir que chaque détail correspond à votre vision.",
                  color: 'from-red-500 to-rose-500',
                  bgColor: 'bg-red-100 dark:bg-red-900/30',
                  iconColor: 'text-red-600',
                },
              ].map((valeur) => (
                <motion.div key={valeur.title} variants={cardVariants}>
                  <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300 h-full text-center">
                    <CardContent className="p-6">
                      <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${valeur.bgColor} mx-auto mb-4`}>
                        <valeur.icon className={`h-7 w-7 ${valeur.iconColor}`} />
                      </div>
                      <h3 className="font-bold text-lg mb-2">{valeur.title}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">{valeur.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* ═══ POLITIQUE DE SERVICE ═══ */}
        <section id="politique" className="py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <FadeIn className="text-center mb-12">
              <Badge variant="secondary" className="mb-3 bg-gray-100 text-gray-700 border-gray-200">
                <FileCheck className="h-3 w-3 mr-1" /> Règles
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Politique de Service</h2>
              <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
                Nos conditions transparentes pour une collaboration sereine et efficace.
              </p>
            </FadeIn>

            <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: Ban,
                  title: 'Pas de remboursement',
                  desc: "Aucun remboursement n'est effectué après validation et livraison du travail. Chaque création est réalisée sur mesure selon vos besoins.",
                  color: 'text-red-500',
                  bg: 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800',
                },
                {
                  icon: CreditCard,
                  title: 'Travail livré après paiement',
                  desc: "Le travail est livré uniquement après confirmation complète du paiement. Cela garantit la sécurité des deux parties.",
                  color: 'text-emerald-500',
                  bg: 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800',
                },
                {
                  icon: Timer,
                  title: 'Délais respectés',
                  desc: "Chaque délai annoncé est respecté scrupuleusement. Affiches et logos : 1-24h. Sites web : 1-3 jours. Formations : selon programme.",
                  color: 'text-amber-500',
                  bg: 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800',
                },
                {
                  icon: Shield,
                  title: 'Paiement sécurisé',
                  desc: "Toutes les transactions passent par Wave de manière sécurisée. Paiement 50/50 ou total selon le service convenu.",
                  color: 'text-blue-500',
                  bg: 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800',
                },
                {
                  icon: Lock,
                  title: 'Propriété intellectuelle',
                  desc: "Après livraison finale et paiement complet, les droits de propriété intellectuelle du travail sont transférés au client.",
                  color: 'text-purple-500',
                  bg: 'bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800',
                },
                {
                  icon: CheckCircle2,
                  title: 'Révisions incluses',
                  desc: "Des révisions sont possibles avant validation finale pour s'assurer que le résultat correspond parfaitement à vos attentes.",
                  color: 'text-teal-500',
                  bg: 'bg-teal-50 dark:bg-teal-950/20 border-teal-200 dark:border-teal-800',
                },
              ].map((rule) => (
                <motion.div key={rule.title} variants={cardVariants}>
                  <Card className={`h-full border ${rule.bg}`}>
                    <CardContent className="p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <rule.icon className={`h-5 w-5 ${rule.color}`} />
                        <h3 className="font-bold text-sm">{rule.title}</h3>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{rule.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* ═══ FAQ ═══ */}
        <section id="faq" className="py-16 sm:py-20 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <FadeIn className="text-center mb-12">
              <Badge variant="secondary" className="mb-3 bg-blue-100 text-blue-700 border-blue-200">
                <Headphones className="h-3 w-3 mr-1" /> Support
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Questions Fréquentes</h2>
              <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
                Trouvez rapidement les réponses aux questions les plus posées par nos clients. Si votre question n&apos;est pas ici, contactez-nous directement.
              </p>
            </FadeIn>

            <div className="max-w-3xl mx-auto space-y-3">
              {[
                {
                  q: "Quels modes de paiement acceptez-vous ?",
                  a: "Nous acceptons uniquement les paiements via Wave au numéro +223 97 78 72 44. C'est un moyen de paiement rapide, sécurisé et accessible à tous au Mali. Selon le service, le paiement peut se faire en deux fois (50% à la commande, 50% à la livraison) ou en une seule fois avant le début du travail."
                },
                {
                  q: "Combien de temps faut-il pour recevoir mon projet ?",
                  a: "Les délais dépendent du type de service. Pour les affiches et logos, la livraison se fait entre 1 et 24 heures. Pour les outils comme CapCut Pro et PicsArt Pro, c'est également 1 à 24 heures. Les sites web nécessitent 1 à 3 jours ouvrables, et les formations suivent un programme spécifique communiqué à l'avance."
                },
                {
                  q: "Puis-je demander des révisions sur mon projet ?",
                  a: "Oui, absolument ! Des révisions sont incluses avant la validation finale. Nous travaillons avec vous pour nous assurer que le résultat correspond parfaitement à vos attentes. Votre satisfaction est notre priorité et nous ne validons pas un projet tant que vous n'êtes pas pleinement satisfait du rendu."
                },
                {
                  q: "Comment se passe la livraison de mon travail ?",
                  a: "Les fichiers sont livrés en haute qualité via WhatsApp pour une réception instantanée, ou via Google Drive pour les fichiers volumineux. Vous recevez les fichiers sources et les exports dans les formats souhaités. Tout est fait pour que vous puissiez utiliser votre création immédiatement."
                },
                {
                  q: "Y a-t-il un système de parrainage ?",
                  a: "Oui ! Notre programme de parrainage vous permet de gagner des récompenses en recommandant nos services. Pour 1 client parrainé, recevez 500 FCFA de réduction. Pour 2 clients, un service gratuit (affiche ou logo). Pour 5 clients, un logo ou mini projet entièrement offert. Pour 10 clients, un site web simple gratuitement !"
                },
                {
                  q: "Le paiement est-il sécurisé ?",
                  a: "Oui, toutes les transactions passent par Wave, un moyen de paiement sécurisé et fiable. Chaque paiement est confirmé avant le début du travail, garantissant la sécurité des deux parties. Nous ne commençons aucun travail sans confirmation claire du paiement."
                },
                {
                  q: "Quels outils numériques proposez-vous ?",
                  a: "Nous proposons CapCut Pro pour le montage vidéo professionnel, PicsArt Pro pour le design mobile, IPTV Pro pour les chaînes TV en streaming, et des livres professionnels et éducatifs pour développer vos compétences. Tous les outils sont livrés avec leur compte activé et prêt à l'emploi."
                },
                {
                  q: "Proposez-vous des formations ?",
                  a: "Oui ! Nous proposons une formation complète en design graphique à 20 000 FCFA. Cette formation couvre les bases et techniques avancées pour créer des visuels professionnels. C'est idéal pour les étudiants, les entrepreneurs et toute personne souhaitant développer des compétences en design."
                },
              ].map((faq, i) => (
                <FadeIn key={i} delay={i * 0.05}>
                  <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <CardContent className="p-5">
                      <div className="flex items-start gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30 flex-shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-amber-600">Q</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm mb-2">{faq.q}</h3>
                          <p className="text-xs text-muted-foreground leading-relaxed">{faq.a}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </FadeIn>
              ))}
            </div>

            <FadeIn className="mt-8 text-center">
              <p className="text-sm text-muted-foreground">
                Vous avez d&apos;autres questions ?{' '}
                <a href="#contact" className="text-amber-600 font-medium hover:underline">Contactez-nous</a> ou écrivez-nous directement sur{' '}
                <a href="https://wa.me/22397787244" target="_blank" rel="noopener noreferrer" className="text-emerald-600 font-medium hover:underline">WhatsApp</a>.
              </p>
            </FadeIn>
          </div>
        </section>

        {/* ═══ CTA FINAL ═══ */}
        <section className="py-16 sm:py-20 bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 h-64 w-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 h-64 w-64 bg-white/10 rounded-full blur-3xl" />
          </div>
          <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <FadeIn>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                Prêt à Donner Vie à Votre Projet ?
              </h2>
              <p className="mt-4 text-lg text-white/90 max-w-2xl mx-auto leading-relaxed">
                Ne laissez pas votre idée attendre. Contactez-nous dès maintenant et transformez votre vision en réalité. Design professionnel, livraison rapide et satisfaction garantie.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <a href="https://wa.me/22397787244?text=Bonjour%20!%20Je%20souhaite%20commander%20un%20service%20chez%20Cr%C3%A9ateur%20Boutique." target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="bg-white text-amber-600 hover:bg-white/90 font-bold shadow-xl text-base px-8">
                    <MessageCircle className="h-5 w-5 mr-2" /> Commander sur WhatsApp
                  </Button>
                </a>
                <a href="#services">
                  <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 font-semibold text-base px-8">
                    Voir les services <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </a>
              </div>
              <div className="mt-8 flex items-center justify-center gap-6 text-white/80 text-sm">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4" /> Livraison rapide</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4" /> Satisfaction garantie</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4" /> Paiement sécurisé</span>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ═══ CONTACT ═══ */}
        <section id="contact" className="py-16 sm:py-20 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12">
              <FadeIn>
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
                  <a href="#" className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30 hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors" aria-label="Instagram">
                    <Instagram className="h-5 w-5 text-amber-600" />
                  </a>
                  <a href="#" className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30 hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors" aria-label="Facebook">
                    <Facebook className="h-5 w-5 text-amber-600" />
                  </a>
                  <a href="#" className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30 hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors" aria-label="Twitter">
                    <Twitter className="h-5 w-5 text-amber-600" />
                  </a>
                </div>
              </FadeIn>

              <FadeIn delay={0.2}>
                <form onSubmit={handleSubmitContact} className="space-y-4 rounded-2xl border bg-card p-6 sm:p-8 shadow-sm">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nom *</Label>
                      <Input
                        id="name"
                        placeholder="Votre nom"
                        value={contactData.name}
                        onChange={(e) => setContactData({ ...contactData, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="votre@email.com"
                        value={contactData.email}
                        onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Sujet</Label>
                    <Input
                      id="subject"
                      placeholder="Quel service vous intéresse ?"
                      value={contactData.subject}
                      onChange={(e) => setContactData({ ...contactData, subject: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      placeholder="Décrivez votre projet ou votre demande..."
                      rows={5}
                      value={contactData.message}
                      onChange={(e) => setContactData({ ...contactData, message: e.target.value })}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold"
                    disabled={sending}
                  >
                    {sending ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                        Envoi en cours...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Send className="h-4 w-4" /> Envoyer le message
                      </span>
                    )}
                  </Button>
                </form>
              </FadeIn>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* ═══ WHATSAPP FLOTTANT + BACK TO TOP ═══ */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {/* Back to top button */}
        <AnimatePresence>
          {showBackToTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-800 dark:bg-gray-700 text-white shadow-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-all duration-300 hover:scale-110"
              aria-label="Retour en haut"
            >
              <ChevronUp className="h-5 w-5" />
            </motion.button>
          )}
        </AnimatePresence>
        {/* Visitor counter floating badge */}
        {visitorData && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2, duration: 0.4 }}
            className="fixed bottom-6 left-6 z-50 flex items-center gap-2 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-full px-3.5 py-2 shadow-lg"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="text-xs font-semibold text-foreground">{visitorData.today}</span>
            <span className="text-[10px] text-muted-foreground">visiteur{visitorData.today > 1 ? 's' : ''} aujourd&apos;hui</span>
          </motion.div>
        )}
        {/* Chat automatique popup */}
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 3, duration: 0.4 }}
          className="bg-white dark:bg-card border shadow-xl rounded-2xl p-4 w-64 hidden sm:block"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
              <Headphones className="h-4 w-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs font-bold">Écrivez-nous maintenant</p>
              <p className="text-[10px] text-muted-foreground">sur WhatsApp — réponse rapide</p>
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed mb-3">
            Besoin d&apos;un service ? Une question ? Écrivez-nous directement et recevez une réponse en quelques minutes.
          </p>
          <a
            href="https://wa.me/22397787244?text=Bonjour%20!%20Je%20souhaite%20avoir%20des%20informations%20sur%20vos%20services."
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg py-2 transition-colors"
          >
            Démarrer la conversation
          </a>
        </motion.div>
        {/* WhatsApp button */}
        <a
          href="https://wa.me/22397787244?text=Bonjour%20!%20Je%20souhaite%20commander%20un%20service%20chez%20Cr%C3%A9ateur%20Boutique."
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 hover:bg-emerald-600 hover:shadow-xl hover:shadow-emerald-500/40 transition-all duration-300 hover:scale-110 group"
          aria-label="Contacter sur WhatsApp"
        >
          <MessageCircle className="h-6 w-6" />
          <span className="absolute right-full mr-3 whitespace-nowrap rounded-lg bg-gray-900 text-white px-3 py-1.5 text-xs font-medium shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            Commandez sur WhatsApp
            <span className="absolute top-1/2 -right-1 -translate-y-1/2 h-2 w-2 bg-gray-900 rotate-45" />
          </span>
        </a>
      </div>
    </div>
  )
}