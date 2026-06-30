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

/* ═══════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════ */
export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('all')
  const [contactData, setContactData] = useState({ name: '', email: '', subject: '', message: '' })
  const [sending, setSending] = useState(false)
  const { toast } = useToast()

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

        {/* ═══ SERVICES & TARIFS ═══ */}
        <section id="services" className="py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <FadeIn className="text-center mb-12">
              <Badge variant="secondary" className="mb-3 bg-amber-100 text-amber-700 border-amber-200">
                <Sparkles className="h-3 w-3 mr-1" /> Tarifs
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Mes Services & Tarifs</h2>
              <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
                Services rapides, modernes et professionnels. Chaque service est livré avec soin et professionnelisme.
              </p>
            </FadeIn>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <PricingCard
                name="Formation Designer Graphique"
                price={20000}
                description="Formation complète en design graphique. Apprenez les bases et techniques avancées pour créer des visuels professionnels."
                icon={Palette}
                delay={0}
              />
              <PricingCard
                name="Affiche Professionnelle"
                price={2000}
                description="Création d'affiches publicitaires modernes et attractives, adaptées à votre marque et communication visuelle."
                icon={PenTool}
                delay={0.1}
              />
              <PricingCard
                name="Logo Professionnel"
                price={5000}
                description="Création de logo unique et identité visuelle de marque. Un design mémorable qui vous démarque."
                icon={Sparkles}
                delay={0.2}
              />
              <PricingCard
                name="Site Web Simple"
                price={15000}
                description="Site web vitrine moderne, responsive et optimisé. Parfait pour présenter votre activité en ligne."
                icon={Globe}
                delay={0.3}
              />
              <PricingCard
                name="Site Web Professionnel"
                price={25000}
                description="Site web professionnel complet avec fonctionnalités avancées, design sur mesure et optimisation SEO."
                icon={Globe}
                delay={0.4}
              />
              <PricingCard
                name="Montage Vidéo Pro"
                price={5000}
                description="Montage vidéo professionnel avec CapCut Pro. Effets premium, transitions et export haute qualité."
                icon={MonitorPlay}
                delay={0.5}
              />
            </div>
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
                    Je suis un créateur passionné par le design graphique et le digital. Mon objectif est de fournir des services de haute qualité qui répondent aux besoins réels de mes clients, avec un souci constant de l&apos;esthétique et de l&apos;efficacité.
                  </p>
                  <p>
                    De la création de logos à la conception de sites web, en passant par le montage vidéo et le marketing digital, je mets mon expertise à votre service pour vous aider à vous démarquer et à atteindre vos objectifs.
                  </p>
                  <p>
                    Services rapides, modernes et professionnels. Qualité, Créativité, Satisfaction — ce ne sont pas juste des mots, c&apos;est ma promesse.
                  </p>
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
    </div>
  )
}