'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import {
  ArrowRight,
  Star,
  ShoppingCart,
  Package,
  Lightbulb,
  Heart,
  Send,
  Sparkles,
  ChevronRight,
  Eye,
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
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
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

/* ─── Product Card ─── */
function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const { toast } = useToast()

  const handleAdd = () => {
    addItem({ id: product.id, name: product.name, price: product.price, image: product.image })
    toast({ title: 'Ajouté au panier', description: `${product.name} a été ajouté à votre panier.` })
  }

  const formatPrice = (p: number) => p.toLocaleString('fr-FR', { style: 'currency', currency: 'XOF', minimumFractionDigits: 0 })

  return (
    <>
      <motion.div variants={cardVariants} className="group">
        <Card className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col">
          {/* Image */}
          <div className="relative aspect-square overflow-hidden bg-muted">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                <Package className="h-12 w-12 opacity-30" />
              </div>
            )}
            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              {product.featured && (
                <Badge className="bg-amber-500 text-white border-0 text-[10px] px-2 py-0.5">
                  <Star className="h-3 w-3 mr-1" /> Vedette
                </Badge>
              )}
              <Badge className="bg-black/60 text-white border-0 text-[10px] px-2 py-0.5 backdrop-blur-sm">
                {product.category === 'projet' ? 'Projet' : 'Produit'}
              </Badge>
            </div>
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100">
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  className="rounded-full shadow-lg"
                  onClick={() => setSelectedProduct(product)}
                >
                  <Eye className="h-4 w-4 mr-1" /> Détails
                </Button>
                <Button
                  size="sm"
                  className="rounded-full shadow-lg bg-amber-500 hover:bg-amber-600 text-white"
                  onClick={handleAdd}
                >
                  <ShoppingCart className="h-4 w-4 mr-1" /> Ajouter
                </Button>
              </div>
            </div>
          </div>
          {/* Content */}
          <CardContent className="flex-1 p-4 flex flex-col gap-2">
            <h3 className="font-semibold text-sm leading-snug line-clamp-1">{product.name}</h3>
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed flex-1">
              {product.description}
            </p>
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

      {/* Product Detail Dialog */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl">{selectedProduct?.name}</DialogTitle>
            <DialogDescription>
              {selectedProduct?.category === 'projet' ? 'Projet Créatif' : 'Produit Créateur Boutique'}
            </DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-4">
              {selectedProduct.image && (
                <div className="rounded-lg overflow-hidden aspect-video bg-muted">
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <p className="text-sm text-muted-foreground leading-relaxed">
                {selectedProduct.description}
              </p>
              <div className="flex items-center justify-between pt-2">
                <div>
                  <span className="text-2xl font-bold text-amber-600">
                    {formatPrice(selectedProduct.price)}
                  </span>
                  <p className="text-xs text-muted-foreground mt-1">
                    Stock: {selectedProduct.stock >= 100 ? 'Illimité' : `${selectedProduct.stock} disponibles`}
                  </p>
                </div>
                <Button
                  className="bg-amber-500 hover:bg-amber-600 text-white font-semibold"
                  onClick={() => {
                    addItem({ id: selectedProduct.id, name: selectedProduct.name, price: selectedProduct.price, image: selectedProduct.image })
                    toast({ title: 'Ajouté au panier', description: `${selectedProduct.name} ajouté.` })
                    setSelectedProduct(null)
                  }}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" /> Ajouter au panier
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

/* ─── Product Skeleton ─── */
function ProductSkeleton() {
  return (
    <Card className="overflow-hidden border-0 shadow-md">
      <Skeleton className="aspect-square w-full" />
      <CardContent className="p-4 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-5 w-1/3 mt-2" />
      </CardContent>
    </Card>
  )
}

/* ─── Main Page ─── */
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
        toast({ title: 'Erreur', description: 'Impossible de charger les produits.', variant: 'destructive' })
      })
  }, [])

  const filteredProducts = products.filter((p) => {
    if (activeFilter === 'all') return true
    if (activeFilter === 'vedettes') return p.featured
    return p.category === activeFilter
  })

  const featuredProducts = products.filter((p) => p.featured)
  const projectProducts = products.filter((p) => p.category === 'projet')

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
      toast({ title: 'Message envoyé !', description: 'Nous vous répondrons sous 24h.' })
      setContactData({ name: '', email: '', subject: '', message: '' })
    } catch {
      toast({ title: 'Erreur', description: 'Impossible d\'envoyer le message.', variant: 'destructive' })
    } finally {
      setSending(false)
    }
  }

  const filters = [
    { key: 'all', label: 'Tout' },
    { key: 'vedettes', label: 'Vedettes' },
    { key: 'produit', label: 'Produits' },
    { key: 'projet', label: 'Projets' },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* ─── HERO ─── */}
        <section id="accueil" className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-white dark:from-amber-950/20 dark:via-orange-950/10 dark:to-background">
          {/* Decorative blobs */}
          <div className="absolute top-0 -right-40 h-[500px] w-[500px] rounded-full bg-amber-200/40 dark:bg-amber-800/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-40 h-[400px] w-[400px] rounded-full bg-orange-200/30 dark:bg-orange-800/10 blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Badge variant="secondary" className="mb-4 px-3 py-1 text-xs font-medium bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800">
                    <Sparkles className="h-3 w-3 mr-1" /> Nouvelles créations disponibles
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
                  Découvrez notre collection exclusive de produits artisanaux et de projets créatifs.
                  Chaque pièce est conçue avec passion et savoir-faire pour vous offrir l&apos;excellence.
                </motion.p>

                <motion.div
                  className="mt-8 flex flex-wrap gap-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <a href="#produits">
                    <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-white font-semibold shadow-lg shadow-amber-500/25">
                      Explorer la boutique <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </a>
                  <a href="#apropos">
                    <Button size="lg" variant="outline" className="font-semibold">
                      En savoir plus
                    </Button>
                  </a>
                </motion.div>

                <motion.div
                  className="mt-10 flex items-center gap-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <div className="text-center">
                    <p className="text-2xl font-bold text-amber-600">50+</p>
                    <p className="text-xs text-muted-foreground">Produits</p>
                  </div>
                  <div className="h-8 w-px bg-border" />
                  <div className="text-center">
                    <p className="text-2xl font-bold text-amber-600">200+</p>
                    <p className="text-xs text-muted-foreground">Clients satisfaits</p>
                  </div>
                  <div className="h-8 w-px bg-border" />
                  <div className="text-center">
                    <p className="text-2xl font-bold text-amber-600">15+</p>
                    <p className="text-xs text-muted-foreground">Projets réalisés</p>
                  </div>
                </motion.div>
              </div>

              {/* Hero Image Grid */}
              <motion.div
                className="hidden lg:grid grid-cols-2 gap-4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                <div className="space-y-4">
                  <div className="rounded-2xl overflow-hidden shadow-xl h-48">
                    <img src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=300&fit=crop" alt="Création artisanale" className="w-full h-full object-cover" />
                  </div>
                  <div className="rounded-2xl overflow-hidden shadow-xl h-64">
                    <img src="https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=400&fit=crop" alt="Atelier créatif" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="rounded-2xl overflow-hidden shadow-xl h-64">
                    <img src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=400&fit=crop" alt="Collection" className="w-full h-full object-cover" />
                  </div>
                  <div className="rounded-2xl overflow-hidden shadow-xl h-48">
                    <img src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=300&fit=crop" alt="Bijoux" className="w-full h-full object-cover" />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ─── PRODUITS ─── */}
        <section id="produits" className="py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <FadeIn className="text-center mb-10">
              <Badge variant="secondary" className="mb-3">Catalogue</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Nos Produits & Projets</h2>
              <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
                Parcourez notre sélection de créations uniques. Des produits artisanaux aux projets collaboratifs, trouvez votre bonheur.
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

            {/* Products Grid */}
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)
              ) : (
                <AnimatePresence mode="wait">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </AnimatePresence>
              )}
            </StaggerContainer>

            {!loading && filteredProducts.length === 0 && (
              <div className="text-center py-16 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto opacity-30 mb-3" />
                <p>Aucun produit dans cette catégorie.</p>
              </div>
            )}
          </div>
        </section>

        {/* ─── VEDÈTTES ─── */}
        {featuredProducts.length > 0 && (
          <section className="py-16 sm:py-20 bg-muted/30">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <FadeIn className="text-center mb-10">
                <Badge variant="secondary" className="mb-3 bg-amber-100 text-amber-700 border-amber-200">
                  <Star className="h-3 w-3 mr-1" /> Sélection
                </Badge>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Vedettes de la Boutique</h2>
                <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
                  Nos créations les plus populaires, plébiscitées par nos clients.
                </p>
              </FadeIn>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredProducts.slice(0, 3).map((product, i) => (
                  <FadeIn key={product.id} delay={i * 0.1}>
                    <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <div className="flex flex-col sm:flex-row">
                        <div className="sm:w-2/5 aspect-square sm:aspect-auto overflow-hidden bg-muted">
                          <img
                            src={product.image || ''}
                            alt={product.name}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        <CardContent className="p-5 flex-1 flex flex-col justify-center">
                          <Badge variant="secondary" className="w-fit text-[10px] mb-2">
                            {product.category === 'projet' ? 'Projet' : 'Produit'}
                          </Badge>
                          <h3 className="font-semibold text-lg">{product.name}</h3>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{product.description}</p>
                          <div className="flex items-center gap-3 mt-4">
                            <span className="text-lg font-bold text-amber-600">
                              {product.price.toLocaleString('fr-FR', { style: 'currency', currency: 'XOF', minimumFractionDigits: 0 })}
                            </span>
                            <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-white ml-auto">
                              Voir <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  </FadeIn>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ─── PROJETS ─── */}
        {projectProducts.length > 0 && (
          <section id="projets" className="py-16 sm:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <FadeIn className="text-center mb-10">
                <Badge variant="secondary" className="mb-3">
                  <Lightbulb className="h-3 w-3 mr-1" /> Créativité
                </Badge>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Nos Projets</h2>
                <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
                  Des initiatives créatives et collaboratives qui repoussent les limites de l&apos;artisanat et du design.
                </p>
              </FadeIn>

              <div className="grid md:grid-cols-2 gap-6">
                {projectProducts.map((project, i) => (
                  <FadeIn key={project.id} delay={i * 0.15}>
                    <Card className="overflow-hidden border-0 shadow-lg group hover:shadow-xl transition-all duration-300">
                      <div className="relative h-56 overflow-hidden">
                        <img
                          src={project.image || ''}
                          alt={project.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4 text-white">
                          <Badge className="bg-amber-500 text-white border-0 mb-2">Projet</Badge>
                          <h3 className="text-xl font-bold">{project.name}</h3>
                        </div>
                      </div>
                      <CardContent className="p-5">
                        <p className="text-sm text-muted-foreground leading-relaxed">{project.description}</p>
                        <div className="flex items-center justify-between mt-4">
                          <span className="text-xl font-bold text-amber-600">
                            {project.price.toLocaleString('fr-FR', { style: 'currency', currency: 'XOF', minimumFractionDigits: 0 })}
                          </span>
                          <Button className="bg-amber-500 hover:bg-amber-600 text-white">
                            Participer <ArrowRight className="h-4 w-4 ml-1" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </FadeIn>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ─── À PROPOS ─── */}
        <section id="apropos" className="py-16 sm:py-20 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <FadeIn>
                <div className="relative">
                  <div className="rounded-2xl overflow-hidden shadow-xl">
                    <img
                      src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&h=500&fit=crop"
                      alt="Notre atelier"
                      className="w-full h-[400px] object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-6 -right-6 bg-amber-500 text-white rounded-2xl p-6 shadow-xl hidden sm:block">
                    <p className="text-3xl font-bold">5+</p>
                    <p className="text-sm opacity-90">Années d&apos;expertise</p>
                  </div>
                </div>
              </FadeIn>

              <FadeIn delay={0.2}>
                <Badge variant="secondary" className="mb-3 bg-amber-100 text-amber-700 border-amber-200">
                  <Heart className="h-3 w-3 mr-1" /> Notre Histoire
                </Badge>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">À Propos de Créateur Boutique</h2>
                <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Créateur Boutique est né d&apos;une passion profonde pour l&apos;artisanat et la création. Nous croyons que chaque produit raconte une histoire, celle de son créateur et de sa communauté. Notre mission est de mettre en valeur les talents locaux et de proposer des créations qui allient tradition et modernité.
                  </p>
                  <p>
                    Chaque pièce de notre collection est soigneusement sélectionnée pour sa qualité, son originalité et son impact positif. Nous travaillons main dans la main avec des artisans et créateurs passionnés pour vous offrir des produits uniques qui vous ressemblent.
                  </p>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-4">
                  {[
                    { icon: Package, title: 'Qualité Premium', desc: 'Matériaux soigneusement sélectionnés' },
                    { icon: Heart, title: 'Fait avec Passion', desc: 'Chaque pièce est unique' },
                    { icon: Sparkles, title: 'Design Original', desc: 'Créations exclusives' },
                    { icon: Send, title: 'Livraison Rapide', desc: 'Partout au Mali' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent transition-colors">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30 flex-shrink-0">
                        <item.icon className="h-4 w-4 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{item.title}</p>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* ─── CONTACT ─── */}
        <section id="contact" className="py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12">
              <FadeIn>
                <Badge variant="secondary" className="mb-3">
                  <Send className="h-3 w-3 mr-1" /> Contact
                </Badge>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Parlons de Votre Projet</h2>
                <p className="mt-3 text-muted-foreground leading-relaxed max-w-md">
                  Vous avez une idée, un projet ou une question ? N&apos;hésitez pas à nous écrire. Notre équipe vous répondra dans les plus brefs délais.
                </p>

                <div className="mt-8 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30">
                      <Send className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">contact@createurboutique.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30">
                      <svg className="h-5 w-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Téléphone</p>
                      <p className="text-sm text-muted-foreground">+223 70 00 00 00</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30">
                      <svg className="h-5 w-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Adresse</p>
                      <p className="text-sm text-muted-foreground">Bamako, Mali</p>
                    </div>
                  </div>
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
                      placeholder="L'objet de votre message"
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