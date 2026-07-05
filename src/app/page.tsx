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
  Play,
  Trophy,
  Flame,
  Clock,
  FileCheck,
  Calendar,
  ArrowUpRight,
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
  Plus,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/hooks/use-toast'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AdBanner from '@/components/AdBanner'
import WhatsAppGenerator from '@/components/WhatsAppGenerator'
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
        {/* After (background — full width) */}
        <img src={after} alt="Après" className="absolute inset-0 w-full h-full object-cover" draggable={false} />

        {/* Before (clipped) */}
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}>
          <img src={before} alt="Avant" className="w-full h-full object-cover" draggable={false} />
        </div>

        {/* Labels */}
        <span className="absolute top-3 left-3 z-20 bg-red-500/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-sm">AVANT</span>
        <span className="absolute top-3 right-3 z-20 bg-emerald-500/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-sm">APRÈS</span>

        {/* Slider line */}
        <div
          className="absolute top-0 bottom-0 z-30 w-0.5 bg-white shadow-[0_0_8px_rgba(0,0,0,0.5)]"
          style={{ left: `${sliderPos}%` }}
        >
          {/* Handle */}
          <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-xl flex items-center justify-center border-2 border-white/80">
            <div className="flex items-center gap-0.5">
              <div className="w-0 h-0 border-t-[5px] border-b-[5px] border-r-[6px] border-t-transparent border-b-transparent border-r-gray-700" />
              <div className="w-0 h-0 border-t-[5px] border-b-[5px] border-l-[6px] border-t-transparent border-b-transparent border-l-gray-700" />
            </div>
          </div>
        </div>

        {/* Drag hint overlay */}
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
  if (p === 0) return 'Gratuit'
  return p.toLocaleString('fr-FR', { style: 'currency', currency: 'XOF', minimumFractionDigits: 0 })
}

/* ─── Service Card ─── */
function ServiceCard({ product, icon: Icon }: { product: Product; icon: React.ElementType }) {
  const [selected, setSelected] = useState<Product | null>(null)

  const handleWhatsApp = (p: Product) => {
    const msg = `Bonjour Sacko ! Je souhaite obtenir : ${p.name}.\n\nDescription : ${p.description || ''}\nPrix : ${formatPrice(p.price)}\n\nMerci !`
    window.open(`https://wa.me/22397787244?text=${encodeURIComponent(msg)}`, '_blank')
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
              {product.price === 0 && (
                <Badge className="bg-emerald-500 text-white border-0 text-[10px] px-2 py-0.5">
                  <Gift className="h-2.5 w-2.5 mr-0.5" /> Gratuit
                </Badge>
              )}
            </div>
            <div className="absolute bottom-3 right-3">
              <span className={`font-bold text-lg drop-shadow-lg ${product.price === 0 ? 'text-emerald-300' : 'text-white'}`}>{formatPrice(product.price)}</span>
            </div>
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
              <Button size="sm" variant="secondary" className="rounded-full shadow-lg" onClick={() => setSelected(product)}>
                <Eye className="h-4 w-4 mr-1" /> Détails
              </Button>
              <Button size="sm" className="rounded-full shadow-lg bg-emerald-500 hover:bg-emerald-600 text-white" onClick={() => handleWhatsApp(product)}>
                <MessageCircle className="h-4 w-4 mr-1" /> Obtenir
              </Button>
            </div>
          </div>
          {/* Content */}
          <CardContent className="flex-1 p-4 flex flex-col gap-2">
            <h3 className="font-semibold text-sm leading-snug">{product.name}</h3>
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed flex-1">{product.description}</p>
            <div className="flex items-center justify-between pt-1">
              <span className={`text-base font-bold ${product.price === 0 ? 'text-emerald-600' : 'text-amber-600'}`}>{formatPrice(product.price)}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-emerald-500 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 md:hidden"
                onClick={() => handleWhatsApp(product)}
              >
                <MessageCircle className="h-4 w-4" />
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
            <DialogDescription>{selected ? categoryLabel : ''} — SK Designer Luxe</DialogDescription>
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
                <span className={`text-2xl font-bold ${selected.price === 0 ? 'text-emerald-600' : 'text-amber-600'}`}>{formatPrice(selected.price)}</span>
                <a href={`https://wa.me/22397787244?text=${encodeURIComponent(`Bonjour Sacko ! Je souhaite obtenir : ${selected.name}.\n\nDescription : ${selected.description || ''}\nPrix : ${formatPrice(selected.price)}\n\nMerci !`)}`} target="_blank" rel="noopener noreferrer" onClick={() => setSelected(null)}>
                  <Button
                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" /> Obtenir via WhatsApp
                  </Button>
                </a>
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


/* ─── Animated Counter ─── */
function Counter({ target, duration = 1500, suffix = '', prefix = '' }: { target: number; duration?: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0)
  const elementRef = useRef<HTMLSpanElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          let startTime: number | null = null
          const startValue = 0

          const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp
            const progress = Math.min((timestamp - startTime) / duration, 1)
            const easeProgress = progress * (2 - progress)
            const currentValue = Math.floor(easeProgress * (target - startValue) + startValue)
            setCount(currentValue)

            if (progress < 1) {
              requestAnimationFrame(animate)
            }
          }

          requestAnimationFrame(animate)
        }
      },
      { threshold: 0.2 }
    )

    if (elementRef.current) {
      observer.observe(elementRef.current)
    }

    return () => observer.disconnect()
  }, [target, duration])

  return (
    <span ref={elementRef} className="tabular-nums">
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
  const [contactData, setContactData] = useState({ name: '', email: '', subject: '', message: '' })
  const [newsletterName, setNewsletterName] = useState('')
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [sending, setSending] = useState(false)
  const [showBanner, setShowBanner] = useState(true)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [showChatPopup, setShowChatPopup] = useState(true)
  const [serviceCategory, setServiceCategory] = useState('all')
  const [portfolioFilter, setPortfolioFilter] = useState('Tous')
  const [quickOrder, setQuickOrder] = useState({ service: '', name: '', phone: '', description: '' })
  const [inscriptionData, setInscriptionData] = useState({ name: '', phone: '', formation: '' })
  const [clientLogin, setClientLogin] = useState({ name: '', phone: '' })
  const [selectedArticle, setSelectedArticle] = useState<typeof blogArticles[number] | null>(null)
  const [faqOpen, setFaqOpen] = useState<string | null>(null)
  const [legalPage, setLegalPage] = useState<'mentions' | 'confidentialite' | null>(null)
  const { toast } = useToast()

  // ═══ BLOG ARTICLES DATA ═══
  const blogArticles = [
    {
      title: '5 conseils pour créer un logo mémorable',
      excerpt: "Découvrez les règles essentielles pour concevoir un logo qui marque les esprits et reste gravé dans la mémoire de votre audience.",
      category: 'Design',
      date: '28 Juin 2026',
      readTime: '4 min',
      color: 'bg-amber-100 text-amber-700',
      image: 'https://sfile.chatglm.cn/images-ppt/b90eaf7f2e0c.jpg',
      content: `Un logo est bien plus qu'une simple image : c'est le visage de votre marque, le premier contact visuel avec votre public. Voici cinq conseils fondamentaux pour créer un logo qui reste gravé dans les mémoires.\n\n**1. La simplicité avant tout**\nLes meilleurs logos sont ceux qui sont simples et immédiatement reconnaissables. Pensez au logo d'Apple, de Nike ou de McDonald's : des formes épurées, sans surcharge visuelle. Un logo trop complexe est difficile à mémoriser et à reproduire sur différents supports. Limitez-vous à deux ou trois couleurs maximum et évitez les détails superflus qui ne seront pas visibles en petite taille.\n\n**2. Pensez à la polyvalence**\nVotre logo doit fonctionner sur tous les supports : cartes de visite, affiches, site web, réseaux sociaux, tee-shirts, et même en noir et blanc. Testez toujours votre création à différentes tailles et sur différents fonds pour vérifier sa lisibilité et son impact visuel. Un bon logo reste efficace qu'il soit affiché sur un écran géant ou imprimé sur un stylo.\n\n**3. Choisissez les bonnes couleurs**\nChaque couleur évoque une émotion différente. Le bleu inspire la confiance, le rouge l'urgence et la passion, le vert la nature et la croissance, le jaune l'optimisme. Pour une entreprise au Mali, pensez également aux couleurs qui résonnent avec votre public cible et votre secteur d'activité. La cohérence chromatique est essentielle pour renforcer l'identité de votre marque.\n\n**4. La typographie compte**\nLa police de caractère que vous choisissez pour votre logo en dit long sur votre marque. Une police serif classique évoque le prestige et la tradition, tandis qu'une police sans-serif moderne communique l'innovation et la simplicité. Évitez les polices trop décoratives qui peuvent devenir illisibles. L'idéal est d'utiliser une police unique ou d'en combiner deux au maximum.\n\n**5. Rendez-le intemporel**\nÉvitez de suivre les tendances éphémères qui datent rapidement. Un bon logo doit rester pertinent pendant des années, voire des décennies. Regardez les marques les plus prestigieuses : leur logo a peu changé depuis leur création. Concentrez-vous sur l'essence de votre marque plutôt que sur les effets de mode du moment.\n\nChez SK Designer Luxe, nous appliquons ces principes à chaque création. Chaque logo est conçu sur mesure pour refléter l'identité unique de votre entreprise et marquer les esprits de votre audience. Discutons de votre projet pour discuter de votre projet !`
    },
    {
      title: 'Comment réussir en digital en 2026',
      excerpt: "Les stratégies clés pour se démarquer dans le monde du digital cette année. Marketing, design et présence en ligne.",
      category: 'Digital',
      date: '25 Juin 2026',
      readTime: '6 min',
      color: 'bg-emerald-100 text-emerald-700',
      image: 'https://sfile.chatglm.cn/images-ppt/6345c222842a.jpg',
      content: `Le paysage digital évolue à une vitesse vertigineuse, et 2026 n'est pas une exception. Que vous soyez entrepreneur, freelancer ou créateur de contenu à Bamako, voici les stratégies essentielles pour réussir votre transition numérique et vous démarquer de la concurrence.\n\n**1. Investissez dans une identité visuelle forte**\nDans un monde saturé de contenus visuels, votre identité graphique est votre meilleur atout. Un logo professionnel, une charte graphique cohérente et des visuels de qualité sont indispensables pour inspirer confiance et attirer des clients. Les entreprises qui investissent dans leur branding voient en moyenne une augmentation de 23% de leurs revenus. Ne sous-estimez jamais le pouvoir d'un premier visuel impactant.\n\n**2. Maîtrisez les réseaux sociaux**\nLes réseaux sociaux sont le canal d'acquisition client le plus efficace au Mali en 2026. Instagram, TikTok et Facebook dominent le marché. Créez du contenu régulier, authentique et engageant. Utilisez des outils professionnels comme CapCut Pro et PicsArt Pro pour des visuels et vidéos qui sortent du lot. La constance est la clé : publiez au minimum trois fois par semaine et interagissez avec votre communauté quotidiennement.\n\n**3. Ayez un site web professionnel**\nUn site web est votre vitrine ouverte 24h/24. En 2026, ne pas avoir de site web professionnel, c'est comme avoir un magasin sans enseigne. Un site vitrine bien conçu booste votre crédibilité et vous permet de toucher des clients au-delà de Bamako, dans tout le Mali et même en Afrique de l'Ouest. Optez pour un design moderne, rapide sur mobile et optimisé pour les moteurs de recherche.\n\n**4. Le marketing digital accessible à tous**\nVous n'avez pas besoin d'un gros budget pour faire du marketing digital efficace. Commencez par optimiser vos profils sociaux, créez du contenu à valeur ajoutée, et utilisez les publicités ciblées avec un petit budget. Les stories Instagram, les reels TikTok et les publications Facebook restent les formats les plus performants pour atteindre votre audience cible au Mali.\n\n**5. Automatisez et optimisez**\nUtilisez les outils numériques pour gagner du temps : planification des publications, réponses automatiques, gestion de la relation client. Plus vous automatisez les tâches répétitives, plus vous pouvez vous concentrer sur la création de valeur et le développement de votre activité. C'est un investissement qui paie rapidement.\n\nChez SK Designer Luxe, nous vous accompagnons dans chacune de ces étapes. De la création de votre identité visuelle au développement de votre site web, nous avons les outils et l'expertise pour propulser votre présence digitale. Me contacter pour un diagnostic gratuit de votre présence en ligne !`
    },
    {
      title: 'Les tendances design graphique à suivre',
      excerpt: "Minimalisme, gradients, typographies audacieuses... Tour d'horizon des tendances qui dominent le design cette année.",
      category: 'Tendances',
      date: '22 Juin 2026',
      readTime: '5 min',
      color: 'bg-purple-100 text-purple-700',
      image: 'https://sfile.chatglm.cn/images-ppt/d247ebeec9b2.jpg',
      content: `Le design graphique est en constante évolution, et rester à jour avec les dernières tendances est essentiel pour tout créateur ou entrepreneur soucieux de l'image de sa marque. Voici les tendances qui dominent le design graphique en 2026.\n\n**1. Le néo-minimalisme**\nLe minimalisme revient en force, mais avec une touche moderne. Fini les designs trop froids et stériles : le néo-minimalisme intègre des textures subtiles, des gradients doux et des micro-animations qui apportent de la vie sans surcharger. L'idée est de communiquer un maximum d'information avec un minimum d'éléments, tout en créant une expérience visuelle agréable et mémorable.\n\n**2. Les typographies audacieuses**\nEn 2026, la typographie devient le protagoniste du design. Les polices surdimensionnées, les lettres déformées, les mots disposés verticalement ou en spirale : tout est permis tant que le message reste lisible. Cette tendance est particulièrement visible sur les affiches événementielles et les visuels pour les réseaux sociaux, où l'impact immédiat est primordial.\n\n**3. Les gradients évolués**\nLes gradients ne sont pas nouveaux, mais en 2026, ils se font plus sophistiqués. On voit des dégradés de couleurs inattendues (mélange de pastel et de néon), des mesh gradients qui simulent des effets 3D, et des transitions de couleurs fluides qui créent de la profondeur. Cette technique est parfaite pour les fonds de site web, les affiches et les identités de marque dynamiques.\n\n**4. Le design inclusif et culturel**\nUne tendance forte en Afrique et particulièrement au Mali : l'intégration d'éléments culturels dans le design moderne. Les motifs traditionnels réinterprétés, les couleurs inspirées du patrimoine local, les typographies qui rendent hommage aux langues africaines. C'est une façon de créer des designs uniques qui racontent une histoire et renforcent l'identité culturelle tout en restant contemporains et professionnels.\n\n**5. L'intelligence artificielle comme outil créatif**\nL'IA est devenue un outil incontournable pour les designers. Elle permet de générer des concepts rapides, d'explorer des directions créatives et d'accélérer les processus de production. Cependant, la touche humaine reste irremplaçable pour le raffinement, la cohérence et l'émotion. Les meilleurs designers en 2026 sont ceux qui combinent la puissance de l'IA avec leur sensibilité artistique.\n\nCes tendances inspirent chacune de nos créations chez SK Designer Luxe. Nous intégrons les meilleures pratiques actuelles tout en adaptant chaque projet au contexte local et aux besoins spécifiques de nos clients. Envie d'un design tendance et unique ? Parlons de votre projet !`
    },
    {
      title: "Pourquoi votre entreprise a besoin d'un site web",
      excerpt: "Un site web professionnel est devenu indispensable pour toute entreprise. Découvrez pourquoi investir dans un site vitrine.",
      category: 'Site Web',
      date: '18 Juin 2026',
      readTime: '5 min',
      color: 'bg-blue-100 text-blue-700',
      image: 'https://sfile.chatglm.cn/images-ppt/1e6a7645314b.png',
      content: `En 2026, ne pas avoir de site web professionnel équivaut à être invisible pour une grande partie de votre marché potentiel. Voici pourquoi chaque entreprise, même la plus petite, a besoin d'une présence en ligne structurée et professionnelle.\n\n**1. Une vitrine ouverte 24h/24 et 7j/7**\nVotre site web travaille pour vous même quand vous dormez. Un client potentiel peut découvrir vos services, consulter votre portfolio, lire vos tarifs et vous contacter à tout moment. Au Mali, de plus en plus de consommateurs utilisent internet pour rechercher des services locaux avant de prendre une décision d'achat. Sans site web, vous perdez ces clients au profit de concurrents qui ont compris l'importance du digital.\n\n**2. Crédibilité et professionnalisme**\nUn site web bien conçu renforce instantanément la crédibilité de votre entreprise. Lorsqu'un client potentiel recherche votre nom ou votre activité et trouve un site professionnel avec des informations claires, des témoignages et un portfolio de qualité, il est beaucoup plus enclin à faire confiance. À l'inverse, l'absence de site web peut susciter des doutes sur le sérieux de l'entreprise.\n\n**3. Atteindre au-delà de Bamako**\nUn site web vous permet de toucher des clients dans tout le Mali, en Afrique de l'Ouest et même dans le monde entier. Vos services de design, création de logos ou montage vidéo ne sont pas limités géographiquement. Un portfolio en ligne bien organisé est votre meilleur outil de vente, accessible depuis n'importe où. C'est particulièrement vrai pour les freelancers et les petites entreprises qui cherchent à élargir leur clientèle.\n\n**4. Un investissement rentable**\nContrairement à ce que beaucoup pensent, créer un site web professionnel n'est pas un luxe réservé aux grandes entreprises. Avec des solutions modernes et des créateurs talentueux à Bamako, vous pouvez avoir un site vitrine de qualité à partir de 25 000 FCFA. C'est un investissement qui se rentabilise rapidement grâce aux nouveaux clients qu'il génère et à l'image professionnelle qu'il projette.\n\n**5. Optimisation pour les réseaux sociaux**\nVotre site web est le hub central de votre présence digitale. Tous vos profils sur les réseaux sociaux (Instagram, Facebook, TikTok) doivent renvoyer vers votre site web. C'est là que les clients trouvent toutes les informations détaillées, passent commande et vous contactent directement. Un site web structuré avec des appels à l'action clairs transforme les visiteurs en clients.\n\nChez SK Designer Luxe, nous créons des sites web professionnels, modernes et optimisés pour convertir les visiteurs en clients. Chaque site est conçu sur mesure avec un design responsive, une navigation intuitive et un temps de chargement rapide. Contactez-nous pour donner à votre entreprise la présence en ligne qu'elle mérite !`
    },
    {
      title: 'Les outils indispensables pour un créateur de contenu',
      excerpt: "CapCut Pro, PicsArt Pro, Canva... Découvrez les outils qui feront la différence dans votre production de contenu.",
      category: 'Outils',
      date: '15 Juin 2026',
      readTime: '7 min',
      color: 'bg-red-100 text-red-700',
      image: 'https://sfile.chatglm.cn/images-ppt/0dcd8f4f7dd4.jpeg',
      content: `La création de contenu de qualité nécessite les bons outils. Que vous soyez créateur de contenu sur les réseaux sociaux, entrepreneur ou passionné de design, voici les outils indispensables qui feront la différence dans votre production.\n\n**1. CapCut Pro : le roi du montage vidéo**\nCapCut Pro est devenu l'outil de montage vidéo incontournable pour les créateurs de contenu. Sa version Pro débloque des fonctionnalités avancées : effets spéciaux premium, transitions cinématiques, suppression automatique de fond, templates professionnels et export en haute qualité. Pour les créateurs maliens qui produisent du contenu pour TikTok, Instagram Reels ou YouTube, CapCut Pro est un investissement qui transforme la qualité de vos vidéos.\n\n**2. PicsArt Pro : l'atelier de design mobile**\nPicsArt Pro offre des centaines d'outils de retouche photo, de création graphique et de montage. Avec la version Pro, vous accédez à des filtres premium, des stickers exclusifs, des outils AI de suppression d'arrière-plan et des templates professionnels. C'est l'outil parfait pour créer des visuels de qualité pour les réseaux sociaux, des affiches promotionnelles ou des stories engageantes directement depuis votre téléphone.\n\n**3. Canva : le design accessible à tous**\nCanva a révolutionné le design graphique en le rendant accessible à tous. Avec son interface intuitive et ses milliers de templates, même sans compétences en design, vous pouvez créer des visuels professionnels. La version Pro offre encore plus de possibilités : images premium, outils de branding, planification des publications et collaboration en équipe. C'est l'outil idéal pour les entrepreneurs qui veulent gérer eux-mêmes leur communication visuelle.\n\n**4. Les outils de gestion et planification**\nAu-delà de la création, la planification est essentielle. Des outils comme Buffer, Later ou Planoly vous permettent de programmer vos publications à l'avance, d'analyser vos performances et d'optimiser votre stratégie de contenu. Une bonne organisation est souvent ce qui sépare les créateurs qui réussissent de ceux qui abandonnent.\n\n**5. L'importance d'avoir les versions Pro**\nLes versions gratuites de ces outils sont utiles, mais les versions Pro font une réelle différence dans la qualité finale de votre contenu. Les effets premium, l'absence de filigrane, les exports en haute résolution et les templates exclusifs justifient largement l'investissement. Chez SK Designer Luxe, nous proposons l'activation de CapCut Pro et PicsArt Pro à des prix accessibles pour tous les créateurs au Mali.\n\nInvestir dans les bons outils, c'est investir dans la qualité de votre contenu et, ultimement, dans la croissance de votre audience et de votre entreprise. SK Designer Luxe vous aide à accéder à ces outils premium à des tarifs imbattables. Contactez-nous pour en savoir plus !`
    },
    {
      title: 'Comment attirer des clients avec le marketing digital',
      excerpt: "Réseaux sociaux, publicité en ligne, branding... Les techniques éprouvées pour développer votre clientèle.",
      category: 'Marketing',
      date: '10 Juin 2026',
      readTime: '6 min',
      color: 'bg-teal-100 text-teal-700',
      image: 'https://sfile.chatglm.cn/images-ppt/b994c44a4327.jpg',
      content: `Le marketing digital est le levier de croissance le plus puissant et le plus accessible pour les entreprises au Mali. Voici les techniques éprouvées pour attirer des clients et développer votre activité, même avec un petit budget.\n\n**1. Construisez une marque forte**\nTout commence par l'identité visuelle. Un logo professionnel, des couleurs cohérentes et un ton de communication défini sont les fondations de votre stratégie marketing. Les clients font confiance aux marques qui ont une identité claire et cohérente. Investissez dans un logo de qualité, créez une charte graphique et appliquez-la systématiquement sur tous vos supports de communication. C'est la base de toute stratégie digitale réussie.\n\n**2. Le contenu est roi**\nCréez du contenu qui apporte de la valeur à votre audience. Tutoriels, avant-après, coulisses de votre travail, témoignages clients, conseils professionnels : chaque publication doit donner envie à votre audience de revenir et de s'engager. Au Mali, le contenu vidéo est particulièrement efficace sur TikTok et Instagram. Montrez votre savoir-faire, partagez vos réalisations et racontez l'histoire de votre entreprise.\n\n**3. Exploitez la publicité ciblée**\nMême avec un petit budget de 5 000 à 10 000 FCFA par semaine, vous pouvez atteindre des milliers de personnes grâce à la publicité Facebook et Instagram. Ciblez votre audience par localisation (Bamako, Mali), par centres d'intérêt et par démographie. Testez différentes créations publicitaires et mesurez les résultats pour optimiser vos campagnes. Le retour sur investissement peut être spectaculaire.\n\n**4. Le bouche-à-oreille digital**\nEncouragez vos clients satisfaits à laisser des avis, à taguer votre entreprise sur leurs publications et à recommander vos services. Un système de parrainage, comme celui proposé par SK Designer Luxe, est un excellent moyen de transformer vos clients existants en ambassadeurs de votre marque. Chaque client satisfait peut vous apporter 2 à 3 nouveaux clients grâce aux recommandations.\n\n**5. Soyez présent là où vos clients sont**\nIdentifiez les plateformes où votre audience cible passe le plus de temps. Pour le marché malien, Facebook et Instagram sont incontournables, TikTok est en forte croissance, et WhatsApp reste le canal de communication directe le plus utilisé. Adaptez votre contenu à chaque plateforme et soyez régulier dans vos publications. La constance bat l'intensité : mieux vaut publier trois fois par semaine pendant un an qu'une fois par jour pendant un mois.\n\nLe marketing digital n'est pas réservé aux grandes entreprises avec des budgets importants. Avec les bonnes stratégies, les bons outils et un peu de créativité, toute entreprise au Mali peut attirer des clients et croître grâce au digital. SK Designer Luxe vous accompagne avec des outils premium, des formations pratiques et des services de qualité pour booster votre présence en ligne !`
    },
  ]

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
      setShowBackToTop(window.scrollY > 600)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const hardcodedProducts: Product[] = [
      { id: 'p1', name: 'Formation Designer Graphique', description: 'Formation complète en design graphique avec pratique et accompagnement. Apprenez les bases et techniques avancées.', price: 0, image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop', category: 'service', featured: true, stock: 99 },
      { id: 'p2', name: 'Affiche Professionnelle', description: 'Création d\'affiches publicitaires modernes, attractives et adaptées à votre marque. Design haute qualité.', price: 0, image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=600&h=400&fit=crop', category: 'service', featured: true, stock: 99 },
      { id: 'p3', name: 'Logo Professionnel', description: 'Création de logo unique avec identité visuelle complète. Fichiers sources inclus.', price: 0, image: 'https://images.unsplash.com/photo-1626785774625-ddcddc3445e9?w=600&h=400&fit=crop', category: 'service', featured: true, stock: 99 },
      { id: 'p4', name: 'Site Web Simple', description: 'Site web vitrine moderne, responsive et optimisé SEO. Parfait pour présenter votre activité.', price: 0, image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop', category: 'service', featured: false, stock: 99 },
      { id: 'p5', name: 'Site Web Professionnel', description: 'Site web complet avec fonctionnalités avancées, design sur mesure et hébergement inclus.', price: 0, image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=600&h=400&fit=crop', category: 'service', featured: true, stock: 99 },
      { id: 'p6', name: 'Montage Vidéo Pro', description: 'Montage vidéo professionnel avec effets premium et transitions fluides via CapCut Pro.', price: 0, image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&h=400&fit=crop', category: 'service', featured: false, stock: 99 },
      { id: 'p7', name: 'Contenu Réseaux Sociaux', description: 'Création de visuels et contenus engageants pour vos réseaux sociaux. Pack mensuel disponible.', price: 0, image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&h=400&fit=crop', category: 'service', featured: false, stock: 99 },
      { id: 'p8', name: 'CapCut Pro', description: 'Accès premium à CapCut Pro pour un montage vidéo professionnel sans filigrane. Compte activé.', price: 0, image: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=600&h=400&fit=crop', category: 'outil', featured: true, stock: 50 },
      { id: 'p9', name: 'PicsArt Pro', description: 'Accès premium à PicsArt Pro pour le design mobile professionnel. Tous les outils débloqués.', price: 0, image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&h=400&fit=crop', category: 'outil', featured: true, stock: 50 },
      { id: 'p10', name: 'IPTV Pro', description: 'Accès IPTV Pro avec des milliers de chaînes TV en streaming haute qualité. Abonnement complet.', price: 0, image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&h=400&fit=crop', category: 'outil', featured: true, stock: 30 },
      { id: 'p11', name: 'Livres Professionnels', description: 'Pack de livres numériques professionnels et éducatifs pour développer vos compétences.', price: 0, image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=400&fit=crop', category: 'outil', featured: false, stock: 99 },
      { id: 'p12', name: 'Canva Pro', description: 'Accès premium à Canva Pro pour créer des designs professionnels. Templates illimités.', price: 0, image: '/canva-pro-real.png', category: 'outil', featured: false, stock: 50 },
    ]
    setProducts(hardcodedProducts)
    setLoading(false)
    // Welcome notification after a short delay
    const timer = setTimeout(() => {
      toast({
        title: 'Bienvenue chez SK Designer Luxe !',
        description: 'Découvrez mes services — tous actuellement gratuits !',
      })
    }, 2000)
    return () => clearTimeout(timer)
  }, [])


  const services = products.filter((p) => p.category === 'service')
  const outils = products.filter((p) => p.category === 'outil')


  const competences = [
    { text: 'Designer graphique professionnel', icon: Palette },
    { text: "Création d'affiches publicitaires modernes", icon: PenTool },
    { text: 'Création de logos et identité visuelle', icon: Sparkles },
    { text: 'Création de sites web professionnels', icon: Globe },
    { text: 'Montage vidéo professionnel avec CapCut Pro', icon: MonitorPlay },
    { text: 'Utilisation avancée de Canva Pro et PicsArt Pro', icon: Palette },
    { text: 'Création de contenus pour réseaux sociaux', icon: Target },
    { text: 'Développement personnel et outils numériques', icon: Laptop },
    { text: 'Vente de livres professionnels et éducatifs', icon: BookOpen },
    { text: 'IPTV Pro et outils digitaux', icon: Tv },
  ]

  const formations = [
    { text: 'Formation complète en Trading', icon: TrendingUp },
    { text: 'Formation en Management et Gestion de projets', icon: Building2 },
    { text: 'Formation en Intelligence Artificielle', icon: Brain },
    { text: 'Formation YouTube et monétisation', icon: Youtube },
    { text: 'Formation complète en Programmation', icon: Code },
    { text: 'Formation en Design Graphique', icon: Palette },
    { text: 'Formation complète en Montage Vidéo', icon: MonitorPlay },
    { text: 'Formation en Infographie et Design', icon: PenTool },
    { text: 'Formation E-commerce', icon: ShoppingCart },
    { text: 'Pack 10 000 templates et ressources Canva', icon: FolderDown },
    { text: 'Formation en Maintenance informatique', icon: Wrench },
    { text: 'Formation en Hacking et Sécurité informatique', icon: ShieldCheck },
    { text: 'Formation Revendeur IPTV', icon: Tv },
    { text: 'Formation complète en conception de Sites Web', icon: Globe },
  ]

  const handleSubmitContact = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!contactData.name || !contactData.email || !contactData.message) {
      toast({ title: 'Champs requis', description: 'Veuillez remplir tous les champs obligatoires.', variant: 'destructive' })
      return
    }
    setSending(true)
    // Redirect to WhatsApp with the message
    const msg = encodeURIComponent(`Bonjour ! Je suis ${contactData.name} (${contactData.email}).\n\nSujet : ${contactData.subject || 'Général'}\n\n${contactData.message}`)
    window.open(`https://wa.me/22397787244?text=${msg}`, '_blank')
    toast({ title: 'Redirection vers WhatsApp', description: 'Votre message sera envoyé via WhatsApp pour une réponse rapide.' })
    setContactData({ name: '', email: '', subject: '', message: '' })
    setSending(false)
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

        {/* ═══ HERO ═══ */}
        <section id="accueil" className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-white dark:from-amber-950/20 dark:via-orange-950/10 dark:to-background">
          <div className="absolute top-0 -right-40 h-[500px] w-[500px] rounded-full bg-amber-200/40 dark:bg-amber-800/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-40 h-[400px] w-[400px] rounded-full bg-orange-200/30 dark:bg-orange-800/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] rounded-full bg-red-100/30 dark:bg-red-900/10 blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                  <Badge variant="secondary" className="mb-4 px-3 py-1 text-xs font-medium bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800 shadow-sm">
                    <Sparkles className="h-3 w-3 mr-1" /> Studio Créatif Indépendant
                  </Badge>
                </motion.div>

                <motion.h1
                  className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  Donnez vie à vos projets digitaux et{' '}
                  <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 bg-clip-text text-transparent">
                    démarquez-vous.
                  </span>

                </motion.h1>

                <motion.p
                  className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  Création de logos, sites web et visuels sur-mesure pour propulser les entrepreneurs et créateurs de Bamako et d'ailleurs. Chaque projet est une opportunité de transformer votre vision en une réalité qui attire et fidélise.
                </motion.p>

                <motion.div
                  className="mt-8 flex flex-wrap gap-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <a href="https://wa.me/22397787244?text=Bonjour%20!%20Je%20souhaite%20discuter%20de%20mon%20projet." target="_blank" rel="noopener noreferrer">
                    <Button size="lg" className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:via-orange-600 hover:to-red-600 text-white font-semibold shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all transition-transform duration-200 hover:scale-105 active:scale-95">
                      <Rocket className="mr-2 h-4 w-4" /> Lancer mon projet
                    </Button>
                  </a>
                  <a href="https://wa.me/22397787244?text=Bonjour%20!%20J%27aimerais%20obtenir%20un%20devis%20gratuit%20pour%20mon%20projet." target="_blank" rel="noopener noreferrer">
                    <Button size="lg" variant="outline" className="font-semibold hover:bg-accent transition-transform duration-200 hover:scale-105 active:scale-95">
                      Obtenir un devis gratuit <ArrowRight className="ml-2 h-4 w-4" />
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
                    <span key={tag} className="inline-flex items-center gap-1.5 rounded-full bg-white/80 dark:bg-white/5 border px-3.5 py-1.5 text-xs font-medium text-amber-700 dark:text-amber-400 border-amber-200/80 dark:border-amber-800 shadow-sm">
                      <CheckCircle2 className="h-3 w-3 text-emerald-500" /> {tag}
                    </span>
                  ))}
                </motion.div>

                {/* Trust badges */}
                <motion.div
                  className="mt-8 flex items-center gap-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                >
                  <div className="flex -space-x-2">
                    {['from-amber-400 to-orange-500','from-emerald-400 to-teal-500','from-purple-400 to-pink-500','from-blue-400 to-cyan-500'].map((g, i) => (
                      <div key={i} className={`h-8 w-8 rounded-full border-2 border-white bg-gradient-to-br ${g}`} />
                    ))}
                  </div>
                  <div>
                    <p className="text-xs font-bold">50+ Marques propulsées</p>
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map((s) => (
                        <Star key={s} className="h-3 w-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Hero Visual - Real Images */}
              <motion.div
                className="hidden lg:block"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
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
                  {/* Floating cards */}
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
              </motion.div>
            </div>
          </div>
        </section>

        {/* ═══ STATISTIQUES ═══ */}
        <section className="py-12 sm:py-16 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L3N2Zz4=')] opacity-50" />
          <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <FadeIn className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Ce que je fais, en chiffres</h2>
              <p className="mt-2 text-white/80 text-sm">Transparent, impactant, à taille humaine</p>
            </FadeIn>
            <StaggerContainer className="grid grid-cols-3 gap-6 sm:gap-12">
              {[
                { value: 50, suffix: '+', label: 'Marques propulsées', icon: Award, desc: 'Logos, affiches et identités créées avec soin' },
                { value: 100, suffix: '%', label: 'Sur-mesure', icon: Palette, desc: 'Aucun template pré-fait, chaque pixel est pensé pour vous' },
                { value: 5, suffix: '/5', label: 'Satisfaction client', icon: ThumbsUp, desc: 'Une collaboration basée sur l\'écoute et le résultat' },
              ].map((stat) => (
                <motion.div key={stat.label} variants={cardVariants} className="text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm mx-auto mb-3">
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-3xl sm:text-4xl font-extrabold text-white mb-1">
                    <Counter target={stat.value} suffix={stat.suffix} />
                  </div>
                  <p className="text-sm font-semibold text-white/90">{stat.label}</p>
                  <p className="text-xs text-white/60 mt-1 leading-relaxed hidden sm:block">{stat.desc}</p>
                </motion.div>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* ═══ BARRE DE CONFIANCE ═══ */}
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

        {/* ═══ COMMENT ÇA MARCHE ═══ */}
        <section className="py-16 sm:py-20 relative overflow-hidden bg-gradient-to-b from-white to-amber-50/30 dark:from-background dark:to-amber-950/10">
          <div className="absolute top-20 left-10 h-64 w-64 bg-amber-100/40 dark:bg-amber-900/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 h-64 w-64 bg-orange-100/30 dark:bg-orange-900/10 rounded-full blur-3xl" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <FadeIn className="text-center mb-14">
              <Badge variant="secondary" className="mb-3 bg-amber-100 text-amber-700 border-amber-200">
                <Rocket className="h-3 w-3 mr-1" /> Processus
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Comment Ça Marche ?</h2>
              <p className="mt-4 text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Travailler avec moi est simple et direct. Voici comment votre projet passe de l'idée à la réalité en quelques étapes.
              </p>
            </FadeIn>

            <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
              {/* Connector line (desktop only) */}
              <div className="hidden lg:block absolute top-16 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-amber-300 via-orange-400 to-red-400 z-0" />

              {[
                { step: '01', icon: ClipboardCheck, title: 'Découvrez mes services', desc: 'Explorez mes services de design, sites web, vidéo et formations. Identifiez ce qui correspond à votre projet et à vos objectifs.', color: 'from-amber-400 to-orange-500' },
                { step: '02', icon: MessageCircle, title: 'Discutons de votre projet', desc: 'Envoyez-moi un message sur WhatsApp pour me présenter votre vision. Je vous écoute et vous guide vers la meilleure solution.', color: 'from-orange-400 to-red-500' },
                { step: '03', icon: RefreshCw, title: 'Création & Production', desc: 'Je conçois votre projet avec les meilleurs outils professionnels. Chaque détail est peaufiné pour un résultat qui vous ressemble.', color: 'from-red-400 to-pink-500' },
                { step: '04', icon: Award, title: 'Livraison & Satisfaction', desc: 'Recevez votre création et validez. Révisions gratuites jusqu\'à ce que le résultat vous convienne parfaitement.', color: 'from-pink-400 to-purple-500' },
              ].map((item) => (
                <motion.div key={item.step} variants={cardVariants} className="relative z-10">
                  <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-full text-center group pt-8 pb-6">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color} text-white mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <item.icon className="h-6 w-6" />
                    </div>
                    <div className="mt-4 text-xs font-extrabold text-amber-500 tracking-widest">ÉTAPE {item.step}</div>
                    <h3 className="mt-2 font-bold text-base">{item.title}</h3>
                    <p className="mt-2 text-xs text-muted-foreground leading-relaxed px-2">{item.desc}</p>
                  </Card>
                </motion.div>
              ))}
            </StaggerContainer>
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

        

        
        {/* ═══ PUB 1 — Après services ═══ */}
        <div className="max-w-4xl mx-auto px-4"><AdBanner /></div>

        {/* ═══ CE QUE VOUS OBTENEZ ═══ */}
        <section className="py-16 sm:py-20 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <FadeIn className="text-center mb-14">
              <Badge variant="secondary" className="mb-3 bg-blue-100 text-blue-700 border-blue-200">
                <TrendingUp className="h-3 w-3 mr-1" /> Résultats
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Ce que vous obtenez concrètement</h2>
              <p className="mt-4 text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Chaque service est conçu pour vous apporter un bénéfice réel et mesurable. Voici ce que mes clients obtiennent après avoir travaillé avec moi.
              </p>
            </FadeIn>

            <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: Palette,
                  title: 'Création de Logos & Identité Visuelle',
                  desc: "Votre logo est l'âme de votre entreprise. Obtenez un design unique, moderne et professionnel qui capte immédiatement l'attention et inspire confiance à vos futurs clients.",
                  color: 'from-amber-400 to-orange-500',
                },
                {
                  icon: PenTool,
                  title: 'Affiches Publicitaires & Visuels',
                  desc: "Communiquez sur vos événements, vos produits ou vos promotions avec des visuels percutants conçus pour maximiser votre impact sur les réseaux sociaux et en format physique.",
                  color: 'from-emerald-400 to-teal-500',
                },
                {
                  icon: Globe,
                  title: 'Création de Sites Web Professionnels',
                  desc: "Offrez à votre entreprise une vitrine ouverte 24h/24. Des sites web rapides, fluides et adaptés aux mobiles pour renforcer votre crédibilité et augmenter vos ventes en ligne.",
                  color: 'from-blue-400 to-indigo-500',
                },
                {
                  icon: GraduationCap,
                  title: 'Formations Digitales Pratiques',
                  desc: "Prenez le contrôle de votre communication numérique. Des formations pratiques et accessibles pour maîtriser les outils digitaux essentiels à votre croissance.",
                  color: 'from-purple-400 to-pink-500',
                },
              ].map((item) => (
                <motion.div key={item.title} variants={cardVariants}>
                  <Card className="h-full border-0 shadow-md hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
                    <CardContent className="p-6">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${item.color} text-white mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                        <item.icon className="h-6 w-6" />
                      </div>
                      <h3 className="font-bold text-sm mb-3">{item.title}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                      <a href="#services" className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-amber-600 hover:text-amber-700 transition-colors">
                        En savoir plus <ArrowUpRight className="h-3 w-3" />
                      </a>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* ═══ CARRIÈRE PRO — OFFRE À LA CARTE ═══ */}
        <section id="carriere-pro" className="py-16 sm:py-20 bg-gradient-to-b from-slate-900 via-slate-900 to-background text-white relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 h-72 w-72 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 h-72 w-72 bg-purple-500/10 rounded-full blur-3xl" />
          </div>
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <FadeIn className="text-center mb-12">
              <Badge className="mb-3 bg-blue-500/20 text-blue-300 border-blue-500/30 hover:bg-blue-500/30">
                <GraduationCap className="h-3 w-3 mr-1" /> Carrière Pro
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Offre à la Carte</h2>
              <p className="mt-3 text-slate-400 max-w-xl mx-auto">
                5 services clés pour booster votre employabilité. Chaque prestation est livrée sous 24h.
              </p>
            </FadeIn>

            <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
              {[
                {
                  icon: PenTool,
                  name: 'Plume Pro',
                  sub: 'Lettre de motivation',
                  price: '800',
                  hook: 'La lettre qui donne envie de lire votre CV.',
                  color: 'from-blue-500 to-cyan-500',
                },
                {
                  icon: FileCheck,
                  name: 'Relooking CV',
                  sub: 'Refonte de CV',
                  price: '700',
                  hook: 'Votre parcours, une nouvelle vitrine.',
                  color: 'from-emerald-500 to-teal-500',
                },
                {
                  icon: Building2,
                  name: 'Impact LinkedIn',
                  sub: 'Profil LinkedIn',
                  price: '2 000',
                  hook: 'Le profil que les recruteurs remarquent en premier.',
                  color: 'from-indigo-500 to-purple-500',
                },
                {
                  icon: Target,
                  name: 'Objectif Entretien',
                  sub: 'Préparation entretien',
                  price: '500',
                  hook: "Les questions pièges de votre secteur, décortiquées.",
                  color: 'from-amber-500 to-orange-500',
                },
                {
                  icon: BadgeCheck,
                  name: 'Réseautage Pro',
                  sub: 'Carte de visite',
                  price: '1 500',
                  hook: 'Un premier contact, une impression durable.',
                  color: 'from-rose-500 to-pink-500',
                },
              ].map((s) => (
                <motion.div key={s.name} variants={cardVariants}>
                  <Card className="h-full bg-white/5 border border-white/10 backdrop-blur-sm hover:border-white/20 transition-all duration-300 group hover:-translate-y-1">
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
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors group-hover:gap-2.5"
                      >
                        Commander <ArrowRight className="h-3.5 w-3.5" />
                      </a>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </StaggerContainer>

            {/* ── PACK LANCEMENT CARRIÈRE ── */}
            <FadeIn delay={0.2}>
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
                        Tout ce qu'il faut pour candidater sans stress — et sans mauvaise surprise.
                      </p>
                      <div className="flex items-baseline gap-3 mt-4">
                        <span className="text-xl text-slate-500 line-through">4 800 FCFA</span>
                        <span className="text-3xl font-extrabold text-white">3 500 FCFA</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-3 flex-shrink-0">
                      <a
                        href="https://wa.me/22397787244?text=Bonjour%20!%20Je%20veux%20le%20Pack%20Lancement%20Carri%C3%A8re%20%C3%A0%203%20500%20FCFA."
                        target="_blank" rel="noopener noreferrer"
                      >
                        <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold shadow-xl shadow-amber-500/25 px-8 whitespace-nowrap">
                          <MessageCircle className="h-5 w-5 mr-2" /> Prendre le Pack
                        </Button>
                      </a>
                      <span className="text-[10px] text-slate-500">Économie de 1 300 FCFA</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            {/* ── RARÉTÉ ── */}
            <FadeIn delay={0.3} className="mt-6 text-center">
              <p className="text-sm text-slate-400">
                Qualité avant quantité : <span className="text-white font-bold">5 commandes/jour maximum</span>. Places restantes aujourd'hui : <span className="inline-flex items-center gap-1.5 text-amber-400 font-bold"><span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />2/5</span>
              </p>
            </FadeIn>
          </div>
        </section>

{/* ═══ SERVICES & TARIFS PAR CATÉGORIE ═══ */}
        <section id="services" className="py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <FadeIn className="text-center mb-10">
              <Badge variant="secondary" className="mb-3 bg-amber-100 text-amber-700 border-amber-200">
                <Sparkles className="h-3 w-3 mr-1" /> Ce que je propose
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Mes Services</h2>
              <p className="mt-3 text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Découvrez comment chaque service peut transformer votre activité. Du logo qui capte l'attention au site web qui convertit, chaque création est conçue pour vous apporter des résultats concrets.
              </p>
            </FadeIn>

            {/* Category tabs */}
            <FadeIn delay={0.05} className="flex flex-wrap justify-center gap-2 mb-10">
              {[
                { key: 'all', label: 'Tous les services', icon: Layers },
                { key: 'design', label: 'Design Graphique', icon: Palette },
                { key: 'web', label: 'Sites Web', icon: Globe },
                { key: 'video', label: 'Montage Vidéo', icon: MonitorPlay },
                { key: 'outil', label: 'Outils & Ressources', icon: Wrench },
                { key: 'formation', label: 'Formations', icon: GraduationCap },
              ].map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setServiceCategory(cat.key)}
                  className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 border ${
                    serviceCategory === cat.key
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-transparent shadow-md shadow-amber-500/20'
                      : 'bg-card text-muted-foreground hover:text-foreground hover:border-amber-300 dark:hover:border-amber-700'
                  }`}
                >
                  <cat.icon className="h-3.5 w-3.5" /> {cat.label}
                </button>
              ))}
            </FadeIn>

            <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products
                .filter((p) => {
                  if (serviceCategory === 'all') return true
                  if (serviceCategory === 'design') return p.category === 'service' && ['Affiche', 'Logo', 'Contenu'].some(k => p.name.includes(k))
                  if (serviceCategory === 'web') return p.category === 'service' && p.name.includes('Site')
                  if (serviceCategory === 'video') return p.category === 'service' && p.name.includes('Vidéo')
                  if (serviceCategory === 'outil') return p.category === 'outil'
                  if (serviceCategory === 'formation') return p.name.includes('Formation')
                  return true
                })
                .map((product) => {
                  const iconMap: Record<string, React.ElementType> = {
                    'Formation Designer Graphique': Palette, 'Affiche Professionnelle': PenTool, 'Logo Professionnel': Sparkles,
                    'Site Web Simple': Globe, 'Site Web Professionnel': Globe, 'Montage Vidéo Pro': MonitorPlay,
                    'Contenu Réseaux Sociaux': Target, 'CapCut Pro': MonitorPlay, 'PicsArt Pro': PenTool,
                    'IPTV Pro': Tv, 'Livres Professionnels': BookOpen, 'Canva Pro': Palette,
                  }
                  return <ServiceCard key={product.id} product={product} icon={iconMap[product.name] || Zap} />
                })
              }
            </StaggerContainer>
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

        

        {/* ═══ PORTFOLIO / RÉALISATIONS ═══ */}
        <section id="portfolio" className="py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <FadeIn className="text-center mb-12">
              <Badge variant="secondary" className="mb-3 bg-purple-100 text-purple-700 border-purple-200">
                <Eye className="h-3 w-3 mr-1" /> Portfolio
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Mes Réalisations</h2>
              <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
                Découvrez une sélection de mes meilleurs travaux. Chaque projet est unique et réalisé avec passion pour mes clients.
              </p>
            </FadeIn>

            {/* Filter tabs */}
            <FadeIn delay={0.1} className="flex flex-wrap items-center justify-center gap-2 mb-8">
              {['Tous', 'Logo', 'Affiche', 'Site Web', 'Vidéo', 'Identité'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setPortfolioFilter(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${portfolioFilter === cat ? 'bg-amber-500 text-white shadow-md shadow-amber-500/25' : 'bg-muted text-muted-foreground hover:bg-accent'}`}
                >
                  {cat}
                </button>
              ))}
            </FadeIn>

            <StaggerContainer className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {[
                { title: 'Logo Restaurant Le Baobab', category: 'Logo', image: 'https://sfile.chatglm.cn/images-ppt/3e8dbebc34bb.jpg', desc: 'Identité visuelle complète pour un restaurant traditionnel malien' },
                { title: 'Affiche Festival Bamako', category: 'Affiche', image: 'https://sfile.chatglm.cn/images-ppt/0c5c9b1b948b.jpg', desc: 'Affiche événementielle pour un festival culturel à Bamako' },
                { title: 'Site Web MaliTech Solutions', category: 'Site Web', image: 'https://sfile.chatglm.cn/images-ppt/1b5dd4b88cdf.png', desc: 'Site vitrine professionnel pour une entreprise tech malienne' },
                { title: 'Logo Afro Fashion Store', category: 'Logo', image: 'https://sfile.chatglm.cn/images-ppt/57c1b49a60ba.jpg', desc: 'Logo moderne pour une boutique de mode africaine' },
                { title: 'Montage Promo Produit', category: 'Vidéo', image: 'https://sfile.chatglm.cn/images-ppt/190eb04b2085.jpg', desc: 'Montage vidéo promotionnel pour un lancement de produit' },
                { title: 'Identité ESIA Business', category: 'Identité', image: 'https://sfile.chatglm.cn/images-ppt/7bfadf1e1582.jpg', desc: 'Charte graphique complète pour une école de business' },
              ].filter((item) => portfolioFilter === 'Tous' || item.category === portfolioFilter).map((item) => (
                <motion.div key={item.title} variants={cardVariants}>
                  <Card className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 h-full group cursor-pointer">
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
                </motion.div>
              ))}
            </StaggerContainer>

            {/* Avant / Après Section */}
            <FadeIn delay={0.4} className="mt-14">
              <h3 className="text-xl font-bold text-center mb-2">Avant / Après</h3>
              <p className="text-sm text-muted-foreground text-center mb-8 max-w-xl mx-auto">Glissez le curseur pour comparer mes transformations. Chaque projet est unique et pensé pour maximiser l&apos;impact visuel.</p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { title: 'Refonte Logo Boutique', before: 'https://sfile.chatglm.cn/images-ppt/f972157605f2.jpg', after: 'https://sfile.chatglm.cn/images-ppt/082b6f181c95.jpg', desc: 'Logo basique transformé en identité premium' },
                  { title: 'Affiche Événement', before: 'https://sfile.chatglm.cn/images-ppt/d2c6b53ee01b.jpg', after: 'https://sfile.chatglm.cn/images-ppt/d247ebeec9b2.jpg', desc: 'Affiche simple devenue visuel professionnel' },
                  { title: 'Identité Complète', before: 'https://sfile.chatglm.cn/images-ppt/6c9261ec8848.jpg', after: 'https://sfile.chatglm.cn/images-ppt/0c5c9b1b948b.jpg', desc: 'De l\'amateur au professionnalisme total' },
                ].map((item, i) => (
                  <FadeIn key={i} delay={0.5 + i * 0.1}>
                    <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                      <CardContent className="p-4 space-y-3">
                        <BeforeAfterSlider before={item.before} after={item.after} title={item.title} />
                        <h4 className="font-bold text-sm">{item.title}</h4>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </CardContent>
                    </Card>
                  </FadeIn>
                ))}
              </div>
            </FadeIn>

            <FadeIn delay={0.3} className="mt-8 text-center">
              <p className="text-sm text-muted-foreground">
                Envie d&apos;un projet similaire ?{' '}
                <a href="https://wa.me/22397787244?text=Bonjour%20!%20J%27ai%20vu%20vos%20réalisations%20et%20je%20souhaite%20un%20projet%20similaire." target="_blank" rel="noopener noreferrer" className="text-amber-600 font-semibold hover:underline">
                  Me contacter
                </a>{' '}et discutons de votre projet !
              </p>
            </FadeIn>
          </div>
        </section>

        {/* ═══ PUB 2 — Après portfolio ═══ */}
        <div className="max-w-4xl mx-auto px-4"><AdBanner /></div>

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
                        Inscrivez-vous à ma newsletter pour recevoir mes dernières offres, des conseils en design et digital, et être informé en avant-première de mes offres exclusives. Rejoignez ma communauté de créateurs et d&apos;entrepreneurs.
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
                        <Input placeholder="Votre nom" value={newsletterName} onChange={(e) => setNewsletterName(e.target.value)} className="h-11 bg-white dark:bg-background" />
                        <Input type="email" placeholder="Votre email" value={newsletterEmail} onChange={(e) => setNewsletterEmail(e.target.value)} className="h-11 bg-white dark:bg-background" />
                      </div>
                      <Button onClick={() => { if (!newsletterName.trim() || !newsletterEmail.trim()) { toast({ title: 'Champs requis', description: 'Veuillez remplir votre nom et email.', variant: 'destructive' }); return } const msg = encodeURIComponent(`Bonjour ! Je souhaite m\'inscrire à la newsletter. Nom: ${newsletterName.trim()}, Email: ${newsletterEmail.trim()}`); window.open(`https://wa.me/22397787244?text=${msg}`, '_blank'); toast({ title: 'Redirection WhatsApp', description: 'Vous allez être redirigé vers WhatsApp.' }) }} className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold h-11">
                        <Send className="h-4 w-4 mr-2" /> S&rsquo;inscrire gratuitement
                      </Button>
                      <p className="text-[10px] text-muted-foreground text-center">
                        En vous inscrivant, vous acceptez de recevoir mes communications. Désabonnement possible à tout moment.
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
                  Spécialisé dans le domaine du design graphique, du développement web et du digital avec une expertise avancée dans plusieurs outils et services numériques professionnels. Une maîtrise complète qui va de la création visuelle à la formation en passant par les outils digitaux premium.
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

        {/* ═══ FORMATIONS DISPONIBLES ═══ */}
        <section id="formations" className="py-16 sm:py-20 relative overflow-hidden text-white" style={{background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)'}}>
          <div className="absolute inset-0">
            <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1400&h=800&fit=crop" alt="" className="w-full h-full object-cover opacity-10" />
            <div className="absolute top-10 right-10 h-72 w-72 bg-amber-500/15 rounded-full blur-3xl" />
            <div className="absolute bottom-10 left-10 h-72 w-72 bg-orange-500/15 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 bg-purple-500/10 rounded-full blur-3xl" />
          </div>
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <div className="text-center mb-12">
                <Badge className="mb-3 bg-amber-500/20 text-amber-300 border-amber-500/30 hover:bg-amber-500/30">
                  <GraduationCap className="h-3 w-3 mr-1" /> Formations
                </Badge>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Formations Disponibles</h2>
                <p className="mt-4 text-slate-300 max-w-2xl mx-auto leading-relaxed">
                  J'aide les entrepreneurs, étudiants et créateurs à développer leurs compétences digitales avec des formations modernes et accessibles. Chaque formation est conçue pour vous donner des compétences pratiques et immédiatement applicables.
                </p>
              </div>
            </FadeIn>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {formations.map((form, i) => (
                <motion.a
                  key={i}
                  href={`https://wa.me/22397787244?text=${encodeURIComponent(`Bonjour Sacko ! Je suis intéressé(e) par la formation : ${form.text}. Pouvez-vous me donner plus de détails et comment y accéder ? Merci !`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.4, delay: i * 0.04, ease: 'easeOut' }}
                  className="group flex items-center gap-4 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-emerald-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/5 cursor-pointer"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex-shrink-0 group-hover:from-emerald-500/30 group-hover:to-teal-500/30 transition-colors">
                    <form.icon className="h-5 w-5 text-amber-400 group-hover:text-emerald-400 transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-200 leading-relaxed group-hover:text-white transition-colors">{form.text}</p>
                    <span className="text-[11px] text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity mt-1 flex items-center gap-1">
                      <MessageCircle className="h-3 w-3" /> Cliquer pour demander via WhatsApp
                    </span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-white/30 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all flex-shrink-0" />
                </motion.a>
              ))}
            </div>

            {/* CTA vers inscription */}
            <FadeIn delay={0.2} className="mt-8 text-center">
              <a href="#inscription">
                <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold shadow-lg shadow-emerald-500/20 transition-transform duration-200 hover:scale-105 active:scale-95">
                  <UserCheck className="h-4 w-4 mr-2" /> Je veux m'inscrire maintenant
                </Button>
              </a>
              <p className="mt-3 text-slate-400 text-xs">Remplissez le formulaire d'inscription ci-dessous</p>
            </FadeIn>
          </div>
        </section>

        {/* ═══ INSCRIPTION AUX FORMATIONS ═══ */}
        <section id="inscription" className="py-16 sm:py-20 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950/20 dark:via-teal-950/10 dark:to-cyan-950/10 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 h-80 w-80 bg-emerald-200/30 dark:bg-emerald-900/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-80 w-80 bg-teal-200/20 dark:bg-teal-900/10 rounded-full blur-3xl" />
          <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <div className="text-center mb-10">
                <Badge variant="secondary" className="mb-3 bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800">
                  <UserCheck className="h-3 w-3 mr-1" /> Inscription
                </Badge>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Inscrivez-vous à une Formation</h2>
                <p className="mt-4 text-muted-foreground max-w-xl mx-auto leading-relaxed">
                  Remplissez vos informations et choisissez la formation qui vous intéresse. Votre demande d&apos;inscription sera envoyée directement via WhatsApp pour un traitement rapide.
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.15}>
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
                      toast({ title: 'Inscription envoyée !', description: 'Votre demande d\'inscription a été envoyée via WhatsApp. Vous recevrez une confirmation rapidement.' })
                      setInscriptionData({ name: '', phone: '', formation: '' })
                    }}
                    className="w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white font-bold h-12 text-sm shadow-lg shadow-emerald-500/20 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" /> M'inscrire via WhatsApp
                  </Button>

                  <div className="flex items-center justify-center gap-4 pt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Gift className="h-3 w-3 text-emerald-500" /> 100% Gratuit</span>
                    <span className="flex items-center gap-1"><Zap className="h-3 w-3 text-emerald-500" /> Réponse rapide</span>
                    <span className="flex items-center gap-1"><Shield className="h-3 w-3 text-emerald-500" /> Données sécurisées</span>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          </div>
        </section>

        {/* ═══ ESPACE CLIENT ═══ */}
        <section id="espace-client" className="py-16 sm:py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 h-96 w-96 bg-amber-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 h-96 w-96 bg-emerald-500/10 rounded-full blur-3xl" />
          </div>
          <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <div className="text-center mb-12">
                <Badge className="mb-3 bg-amber-500/20 text-amber-300 border-amber-500/30 hover:bg-amber-500/30">
                  <Lock className="h-3 w-3 mr-1" /> Espace Client
                </Badge>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Votre Espace Client Sécurisé</h2>
                <p className="mt-4 text-slate-300 max-w-2xl mx-auto leading-relaxed">
                  Connectez-vous pour suivre l&apos;avancée de votre projet en temps réel, consulter les livrables et communiquer directement avec moi. Un accompagnement professionnel de A à Z.
                </p>
              </div>
            </FadeIn>

            <div className="grid lg:grid-cols-5 gap-8 items-start">
              {/* Login Form */}
              <FadeIn delay={0.1} className="lg:col-span-2">
                <Card className="border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
                  <CardContent className="p-6 sm:p-8 space-y-5">
                    <div className="text-center mb-2">
                      <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mb-3 shadow-lg shadow-amber-500/25">
                        <Lock className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-lg font-bold">Connexion Client</h3>
                      <p className="text-xs text-slate-400 mt-1">Accédez à votre espace personnel</p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-slate-200">Nom complet *</Label>
                      <Input
                        placeholder="Votre nom"
                        value={clientLogin.name}
                        onChange={(e) => setClientLogin(prev => ({ ...prev, name: e.target.value }))}
                        className="h-11 bg-white/10 border-white/10 text-white placeholder:text-slate-500 focus:ring-amber-500/40 focus:border-amber-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-slate-200">Numéro de téléphone *</Label>
                      <Input
                        type="tel"
                        placeholder="+223 XX XX XX XX"
                        value={clientLogin.phone}
                        onChange={(e) => setClientLogin(prev => ({ ...prev, phone: e.target.value }))}
                        className="h-11 bg-white/10 border-white/10 text-white placeholder:text-slate-500 focus:ring-amber-500/40 focus:border-amber-500"
                      />
                    </div>

                    <Button
                      onClick={() => {
                        if (!clientLogin.name || !clientLogin.phone) {
                          toast({ title: 'Champs requis', description: 'Veuillez remplir votre nom et numéro de téléphone.', variant: 'destructive' })
                          return
                        }
                        const msg = encodeURIComponent(
                          `Bonjour Sacko ! Je suis client et je souhaite accéder à mon espace.\n\n` +
                          `Nom : ${clientLogin.name}\n` +
                          `Téléphone : ${clientLogin.phone}\n\n` +
                          `Merci de me donner l'état d'avancement de mon projet et les livrables disponibles.`
                        )
                        window.open(`https://wa.me/22397787244?text=${msg}`, '_blank')
                        toast({ title: 'Connexion en cours', description: 'Votre demande est envoyée via WhatsApp. Sacko vous répondra avec les détails de votre projet.' })
                      }}
                      className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold h-12 text-sm shadow-lg shadow-amber-500/20"
                    >
                      <Lock className="h-4 w-4 mr-2" /> Accéder à mon espace
                    </Button>

                    <p className="text-[10px] text-slate-500 text-center">Vos données sont protégées. Communication sécurisée via WhatsApp.</p>
                  </CardContent>
                </Card>
              </FadeIn>

              {/* Dashboard Preview */}
              <FadeIn delay={0.2} className="lg:col-span-3">
                <Card className="border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl overflow-hidden">
                  <div className="bg-white/5 border-b border-white/10 px-5 py-3 flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/80" />
                      <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                      <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                    </div>
                    <span className="text-[11px] text-slate-400 ml-2 font-medium">dashboard.createurboutique.com</span>
                  </div>
                  <CardContent className="p-5 sm:p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-slate-400">Bienvenue,</p>
                        <p className="text-sm font-bold text-amber-400">Mon Espace Client</p>
                      </div>
                      <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px]">
                        <span className="relative flex h-1.5 w-1.5 mr-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
                        </span>
                        En ligne
                      </Badge>
                    </div>

                    {/* Mini project cards */}
                    {[
                      { name: 'Logo Restaurant', status: 'Terminé', statusColor: 'text-emerald-400', progress: 100, icon: '✅' },
                      { name: 'Affiche Promotion', status: 'En cours', statusColor: 'text-amber-400', progress: 65, icon: '🔄' },
                      { name: 'Site Web Vitrine', status: 'En attente', statusColor: 'text-slate-400', progress: 0, icon: '⏳' },
                    ].map((project, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                        <span className="text-lg">{project.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-200 truncate">{project.name}</p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                              <motion.div
                                className="h-full rounded-full bg-gradient-to-r from-amber-500 to-emerald-500"
                                initial={{ width: 0 }}
                                whileInView={{ width: `${project.progress}%` }}
                                viewport={{ once: true }}
                                transition={{ duration: 1, delay: 0.3 + i * 0.15, ease: 'easeOut' }}
                              />
                            </div>
                            <span className="text-[10px] font-medium text-slate-400">{project.progress}%</span>
                          </div>
                        </div>
                        <span className={`text-[11px] font-semibold ${project.statusColor} whitespace-nowrap`}>{project.status}</span>
                      </div>
                    ))}

                    <div className="grid grid-cols-3 gap-3 pt-2">
                      {[
                        { label: 'Projets', value: '3', color: 'text-amber-400' },
                        { label: 'Terminés', value: '1', color: 'text-emerald-400' },
                        { label: 'Livré', value: '1', color: 'text-blue-400' },
                      ].map((stat, i) => (
                        <div key={i} className="text-center p-2.5 rounded-xl bg-white/5 border border-white/5">
                          <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{stat.label}</p>
                        </div>
                      ))}
                    </div>

                    <p className="text-[10px] text-slate-500 text-center pt-1">Connectez-vous via le formulaire pour accéder à votre vrai tableau de bord personnalisé.</p>
                  </CardContent>
                </Card>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* ═══ POURQUOI NOUS CHOISIR ═══ */}
        <section className="py-16 sm:py-20 bg-gradient-to-br from-amber-50 via-orange-50/50 to-white dark:from-amber-950/10 dark:via-orange-950/5 dark:to-background relative overflow-hidden">
          <div className="absolute -top-20 -left-20 h-80 w-80 bg-amber-200/30 dark:bg-amber-900/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-80 w-80 bg-orange-200/20 dark:bg-orange-900/10 rounded-full blur-3xl" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <FadeIn className="text-center mb-14">
              <Badge variant="secondary" className="mb-3 bg-emerald-100 text-emerald-700 border-emerald-200">
                <ThumbsUp className="h-3 w-3 mr-1" /> Collaboration
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Pourquoi Collaborer Ensemble ?</h2>
              <p className="mt-4 text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  Au-delà des compétences techniques, c'est une approche humaine et personnalisée qui fait la différence. Voici ce qui rend chaque collaboration unique et efficace.
              </p>
            </FadeIn>

            <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: Zap, title: 'Créativité sur-mesure', desc: "Chaque projet est conçu selon vos besoins spécifiques. Aucun template pré-fait, aucune copie : votre identité visuelle sera unique et reflétera parfaitement l'essence de votre marque. Du premier croquis au fichier final, chaque détail est pensé pour vous.", color: 'bg-amber-100 dark:bg-amber-900/30', iconColor: 'text-amber-600' },
                { icon: ShieldCheck, title: 'Rapidité & Efficacité', desc: "Des délais respectés pour que vous puissiez lancer vos campagnes à temps. Je comprends que le temps est précieux pour un entrepreneur : c'est pourquoi chaque projet est livré rapidement sans jamais compromettre la qualité.", color: 'bg-emerald-100 dark:bg-emerald-900/30', iconColor: 'text-emerald-600' },
                { icon: MessageCircle, title: 'Accompagnement de A à Z', desc: "Une écoute attentive pour garantir un résultat qui dépasse vos attentes. De la première discussion sur WhatsApp à la livraison finale, je vous guide à chaque étape et j'ajuste jusqu'à ce que vous soyez entièrement satisfait.", color: 'bg-blue-100 dark:bg-blue-900/30', iconColor: 'text-blue-600' },
                { icon: ShieldCheck, title: 'Qualité Professionnelle', desc: 'Chaque création est réalisée avec les meilleurs outils du marché : Canva Pro, CapCut Pro, PicsArt Pro. Le résultat est un visuel qui rivalise avec ceux des grandes agences, à une fraction du prix.', color: 'bg-purple-100 dark:bg-purple-900/30', iconColor: 'text-purple-600' },
                { icon: RefreshCw, title: 'Révisions Gratuites', desc: "Non satisfait ? J'effectue des révisions gratuites jusqu'à ce que le résultat vous convienne parfaitement. Votre satisfaction n'est pas une option, c'est mon engagement.", color: 'bg-orange-100 dark:bg-orange-900/30', iconColor: 'text-orange-600' },
                { icon: Gift, title: '100% Gratuit', desc: "Tous mes services sont actuellement offerts gratuitement. C'est ma façon de vous permettre de découvrir la qualité de mon travail sans aucun engagement financier.", color: 'bg-emerald-100 dark:bg-emerald-900/30', iconColor: 'text-emerald-600' },
              ].map((item) => (
                <motion.div key={item.title} variants={cardVariants}>
                  <Card className="h-full border-0 shadow-md hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
                    <CardContent className="p-6">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${item.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <item.icon className={`h-6 w-6 ${item.iconColor}`} />
                      </div>
                      <h3 className="font-bold text-base mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </StaggerContainer>

            {/* Garantie badge */}
            <FadeIn delay={0.3} className="mt-12">
              <div className="mx-auto max-w-2xl">
                <Card className="border-2 border-emerald-200 dark:border-emerald-800 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 overflow-hidden">
                  <CardContent className="p-6 sm:p-8 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 mx-auto mb-4">
                      <BadgeCheck className="h-8 w-8 text-emerald-600" />
                    </div>
                    <h3 className="text-xl font-extrabold text-emerald-700 dark:text-emerald-400 mb-2">Garantie 100% Satisfaction</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Je garantis votre satisfaction. Si le résultat ne correspond pas à votre commande, je reprends le travail gratuitement. Aucun risque pour vous.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4 mt-5">
                      {['Gratuit', 'Révisions illimitées', 'Support permanent'].map((tag) => (
                        <span key={tag} className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 px-3 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                          <CheckCircle2 className="h-3 w-3" /> {tag}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </FadeIn>
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
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Pour Qui Sont Mes Services ?</h2>
              </div>
              <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                  { icon: Target, title: 'Entrepreneurs', desc: 'Créez une identité visuelle forte pour votre business et attirez plus de clients avec des designs professionnels.', image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=300&h=200&fit=crop' },
                  { icon: GraduationCap, title: 'Étudiants', desc: 'Développez vos compétences en design et digital avec mes formations abordables et mes outils pro.', image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=300&h=200&fit=crop' },
                  { icon: Building2, title: 'Entreprises', desc: 'Renforcez votre image de marque avec des supports de communication professionnels et modernes.', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=300&h=200&fit=crop' },
                  { icon: Sparkles, title: 'Créateurs de contenu', desc: 'Boostez votre production de contenu avec du montage vidéo pro, des visuels réseaux sociaux et des outils premium.', image: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=300&h=200&fit=crop' },
                ].map((item) => (
                  <motion.div key={item.title} variants={cardVariants}>
                    <Card className="h-full border-0 shadow-md text-center hover:shadow-xl transition-all duration-300 overflow-hidden group">
                      <div className="relative h-32 overflow-hidden">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-lg">
                            <item.icon className="h-6 w-6 text-amber-600" />
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-5">
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
                        { icon: Zap, label: 'Devis gratuit', detail: 'Selon le délai annoncé' },
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
                  <div className="rounded-2xl overflow-hidden shadow-xl h-[400px] relative">
                    <img src="/demo-photo.png" alt="SK Designer Luxe par Sacko - À propos" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-amber-900/80 via-amber-900/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm mb-3">
                        <Palette className="h-7 w-7" />
                      </div>
                      <h3 className="text-2xl font-bold">SK Designer Luxe</h3>
                      <p className="mt-1 text-white/80 text-sm">Créateur Digital &bull; Bamako, Mali</p>
                    </div>
                  </div>
                  <div className="absolute -bottom-6 -right-6 bg-white dark:bg-card rounded-2xl p-5 shadow-xl border hidden sm:block">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
                        <Zap className="h-5 w-5 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-lg font-bold">50+ Projets livrés</p>
                        <p className="text-xs text-muted-foreground">À Bamako et au-delà</p>
                      </div>
                    </div>
                  </div>
                </div>
              </FadeIn>

              <FadeIn delay={0.2}>
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
                    Ma mission : <strong className="text-foreground">aider les entrepreneurs et créateurs du Mali et d&apos;Afrique</strong> à prendre le contrôle de leur image numérique. Je crois fermement que chaque business, même le plus modeste, mérite une identité visuelle qui inspire confiance et attire des clients. C&apos;est cette conviction qui guide chaque projet que je réalise.
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
                          <p className="text-[10px] text-muted-foreground">Ma promesse envers vous</p>
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
                          <h3 className="font-bold text-sm">Mon Objectif</h3>
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
                          Faites la publicité de votre entreprise avec moi. Affiches, visuels, supports pro.
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
                    <MessageCircle className="h-4 w-4 mr-2" /> Demander via WhatsApp
                  </Button>
                </a>
              </FadeIn>
              <FadeIn delay={0.2}>
                <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-video bg-black">
                  <video
                    className="w-full h-full object-cover"
                    controls
                    preload="metadata"
                    poster="/demo-photo.png"
                  >
                    <source src="/demo-video.mp4" type="video/mp4" />
                    Votre navigateur ne supporte pas la lecture vidéo.
                  </video>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        

        {/* ═══ PUB 3 — Après espace client ═══ */}
        <div className="max-w-4xl mx-auto px-4"><AdBanner /></div>

        {/* ═══ TÉMOIGNAGES CLIENTS ═══ */}
        <section id="temoignages" className="py-16 sm:py-20 bg-gradient-to-b from-muted/20 to-background relative overflow-hidden">
          <div className="absolute top-0 right-0 h-72 w-72 bg-amber-200/20 dark:bg-amber-900/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 h-72 w-72 bg-orange-200/15 dark:bg-orange-900/10 rounded-full blur-3xl" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <FadeIn className="text-center mb-14">
              <Badge variant="secondary" className="mb-3 bg-amber-100 text-amber-700 border-amber-200">
                <Star className="h-3 w-3 mr-1" /> Témoignages
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Ce Que Disent Mes Clients</h2>
              <p className="mt-4 text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                La satisfaction de mes clients est ma plus grande fierté. Découvrez les avis de ceux qui m'ont fait confiance pour leurs projets digitaux.
              </p>
            </FadeIn>

            <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: 'Amadou Diallo', role: 'Entrepreneur, Bamako', text: 'Excellent travail ! J\'ai commandé un logo et une affiche pour mon entreprise. Le résultat était professionnel et livré en moins de 24h. Je recommande vivement SK Designer Luxe à tous les entrepreneurs.', rating: 5, avatar: 'AD', gradient: 'from-amber-400 to-orange-500' },
                { name: 'Fatoumata Traoré', role: 'Étudiante, Université de Bamako', text: 'La formation en design graphique m\'a permis de développer mes compétences rapidement. Les explications sont claires et le suivi est personnalisé. Merci SK Designer Luxe !', rating: 5, avatar: 'FT', gradient: 'from-emerald-400 to-teal-500' },
                { name: 'Ibrahim Keita', role: 'Gérant de restaurant', text: 'Les visuels pour mes réseaux sociaux sont incroyables. Mon engagement a augmenté de 300% depuis que je travaille avec SK Designer Luxe. Service au top !', rating: 5, avatar: 'IK', gradient: 'from-purple-400 to-pink-500' },
                { name: 'Mariam Coulibaly', role: 'Blogueuse', text: 'CapCut Pro et PicsArt Pro gratuitement ! L\'activation est rapide et le support est très réactif. Je ne pouvais pas rêver mieux pour mon contenu.', rating: 4, avatar: 'MC', gradient: 'from-blue-400 to-cyan-500' },
                { name: 'Oumar Sidibé', role: 'Propriétaire de boutique', text: 'Mon site web est magnifique et professionnel. Mes clients peuvent maintenant me trouver en ligne facilement. Le meilleur investissement pour mon business.', rating: 5, avatar: 'OS', gradient: 'from-red-400 to-orange-500' },
                { name: 'Aïssata Dembélé', role: 'Créatrice de contenu', text: 'Le montage vidéo est d\'une qualité exceptionnelle. Mes vidéos TikTok et YouTube ont beaucoup plus de vues maintenant. Merci pour votre créativité !', rating: 5, avatar: 'AD2', gradient: 'from-pink-400 to-rose-500' },
              ].map((t, i) => (
                <motion.div key={i} variants={cardVariants}>
                  <Card className="h-full border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <CardContent className="p-6">
                      {/* Stars */}
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
                </motion.div>
              ))}
            </StaggerContainer>
          </div>
        </section>

        
{/* ═══ BLOG ═══ */}
        {/* ═══ PUB 4 — Avant blog ═══ */}
        <div className="max-w-4xl mx-auto px-4"><AdBanner /></div>

        <section id="blog" className="py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <FadeIn className="text-center mb-12">
              <Badge variant="secondary" className="mb-3 bg-blue-100 text-blue-700 border-blue-200">
                <BookOpen className="h-3 w-3 mr-1" /> Blog
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Guides, Articles & Ressources</h2>
              <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
                Des articles approfondis, des guides pratiques et des ressources pour vous aider à maîtriser le design et le digital. Tout ce qu'il faut savoir, gratuitement.
              </p>
            </FadeIn>

            <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogArticles.map((article) => (
                <motion.div key={article.title} variants={cardVariants}>
                  <Card className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col group cursor-pointer" onClick={() => setSelectedArticle(article)}>
                    <div className="relative h-44 overflow-hidden">
                      <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
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

        {/* ═══ GÉNÉRATEUR WhatsApp IA ═══ */}
        <section id="generateur" className="py-16 sm:py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <FadeIn className="text-center mb-10">
              <Badge variant="secondary" className="mb-3 bg-emerald-100 text-emerald-700 border-emerald-200">
                <Zap className="h-3 w-3 mr-1" /> Outil IA
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Générateur de Messages WhatsApp</h2>
              <p className="mt-3 text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Créez des messages WhatsApp professionnels en un clic. Choisissez le type, le ton — l&apos;IA rédige pour vous. Gratuit, rapide, efficace.
              </p>
            </FadeIn>
            <FadeIn delay={0.1}>
              <WhatsAppGenerator />
            </FadeIn>
          </div>
        </section>

        {/* ═══ NOS VALEURS ═══ */}
        <section id="valeurs" className="py-16 sm:py-20 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <FadeIn className="text-center mb-12">
              <Badge variant="secondary" className="mb-3 bg-amber-100 text-amber-700 border-amber-200">
                <Trophy className="h-3 w-3 mr-1" /> Promesses
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Mes Valeurs</h2>
              <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
                Ce qui guide mon travail et mon engagement envers chaque projet.
              </p>
            </FadeIn>

            <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: Shield,
                  title: 'Sérieux',
                  desc: "Chaque projet est traité avec le plus grand professionnalisme. Respect des délais, communication transparente et engagement total. Je ne promets que ce que je peux tenir, et je tiens tout ce que je promets.",
                  gradient: 'from-emerald-500 to-teal-600',
                },
                {
                  icon: Sparkles,
                  title: 'Créativité',
                  desc: "Des idées originales et des designs uniques pour chaque client. Chaque création est pensée pour se démarquer et marquer les esprits. Je repousse les limites du design pour offrir des visuels qui captivent.",
                  gradient: 'from-amber-500 to-orange-600',
                },
                {
                  icon: Zap,
                  title: 'Rapidité',
                  desc: "Des délais de livraison respectés sans compromis sur la qualité. Affiches et logos en 1 à 24h, sites web en 1 à 3 jours. Je comprends que votre temps est précieux et j'y réponds.",
                  gradient: 'from-purple-500 to-pink-600',
                },
                {
                  icon: Heart,
                  title: 'Satisfaction Client',
                  desc: "Votre satisfaction est ma priorité numéro un. Je travaille main dans la main avec vous jusqu'au résultat parfait. Des révisions sont incluses pour garantir que chaque détail correspond à votre vision.",
                  gradient: 'from-red-500 to-rose-600',
                },
              ].map((valeur) => (
                <motion.div key={valeur.title} variants={cardVariants}>
                  <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 h-full overflow-hidden group">
                    <div className={`h-2 bg-gradient-to-r ${valeur.gradient}`} />
                    <CardContent className="p-6 pt-8 text-center">
                      <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${valeur.gradient} text-white mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <valeur.icon className="h-7 w-7" />
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

        {/* ═══ POLITIQUE DE SERVICE + MENTIONS LÉGALES ═══ */}
        <section id="politique" className="py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <FadeIn className="text-center mb-12">
              <Badge variant="secondary" className="mb-3 bg-gray-100 text-gray-700 border-gray-200">
                <FileCheck className="h-3 w-3 mr-1" /> Informations Légales
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Mentions Légales & Politiques</h2>
              <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
                Transparence totale sur mes conditions de service, mes mentions légales et ma politique de confidentialité.
              </p>
            </FadeIn>

            {/* Tab navigation */}
            <FadeIn delay={0.1} className="flex flex-wrap items-center justify-center gap-3 mb-10">
              <button onClick={() => setLegalPage(null)} className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${!legalPage ? 'bg-amber-500 text-white shadow-md' : 'bg-muted text-muted-foreground hover:bg-accent'}`}>
                Conditions de Service
              </button>
              <button onClick={() => setLegalPage('mentions')} className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${legalPage === 'mentions' ? 'bg-amber-500 text-white shadow-md' : 'bg-muted text-muted-foreground hover:bg-accent'}`}>
                Mentions Légales
              </button>
              <button onClick={() => setLegalPage('confidentialite')} className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${legalPage === 'confidentialite' ? 'bg-amber-500 text-white shadow-md' : 'bg-muted text-muted-foreground hover:bg-accent'}`}>
                Politique de Confidentialité
              </button>
            </FadeIn>

            {legalPage === null && (
              <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    icon: ShieldCheck,
                    title: 'Satisfaction ou remboursement',
                    desc: "Si le résultat ne correspond pas à votre commande, je reprends le travail gratuitement.",
                    color: 'text-emerald-500',
                    bg: 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800',
                  },
                  {
                    icon: CreditCard,
                    title: 'Travail livré gratuitement',
                    desc: "Tous les travaux sont livrés gratuitement. Aucun paiement n'est nécessaire.",
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
                    title: '100% Gratuit',
                    desc: "Tous les services sont actuellement offerts gratuitement. C'est ma façon de vous permettre de découvrir la qualité de mon travail.",
                    color: 'text-blue-500',
                    bg: 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800',
                  },
                  {
                    icon: Lock,
                    title: 'Propriété intellectuelle',
                    desc: "Après livraison finale, les droits de propriété intellectuelle du travail sont transférés au client.",
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
            )}

            {legalPage === 'mentions' && (
              <FadeIn>
                <Card className="border-0 shadow-lg max-w-4xl mx-auto">
                  <CardContent className="p-6 sm:p-10 space-y-6">
                    <h3 className="text-2xl font-bold">Mentions Légales</h3>
                    <div className="space-y-5 text-sm text-muted-foreground leading-relaxed">
                      <div>
                        <h4 className="font-bold text-foreground text-base mb-2">Éditeur du site</h4>
                        <p>Nom / Raison sociale : SK Designer Luxe (Créateur Boutique)<br />
                        Responsable : Ibrahim Sacko<br />
                        Localisation : Bamako, Mali<br />
                        Contact : contact@createurboutique.com / +223 97 78 72 44 (WhatsApp)</p>
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground text-base mb-2">Hébergement</h4>
                        <p>Ce site est hébergé par Vercel Inc.<br />
                        Adresse : 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis<br />
                        Site web : vercel.com</p>
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground text-base mb-2">Propriété intellectuelle</h4>
                        <p>L&rsquo;ensemble des contenus présents sur ce site (textes, images, logos, vidéos, créations graphiques) est la propriété de SK Designer Luxe, sauf mention contraire. Toute reproduction, distribution ou utilisation sans autorisation préalable est interdite.</p>
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground text-base mb-2">Responsabilité</h4>
                        <p>SK Designer Luxe s&rsquo;efforce d&rsquo;assurer l&rsquo;exactitude des informations diffusées sur ce site, mais ne peut garantir l&rsquo;absence d&rsquo;erreurs ou d&rsquo;omissions. L&rsquo;utilisateur du site est seul responsable de l&rsquo;usage qu&rsquo;il fait des informations fournies.</p>
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground text-base mb-2">Liens externes</h4>
                        <p>Ce site peut contenir des liens vers des sites tiers (WhatsApp, réseaux sociaux, plateformes de paiement). SK Designer Luxe n&rsquo;est pas responsable du contenu ou des pratiques de confidentialité de ces sites externes.</p>
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground text-base mb-2">Droit applicable</h4>
                        <p>Les présentes mentions légales sont soumises au droit malien.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            )}

            {legalPage === 'confidentialite' && (
              <FadeIn>
                <Card className="border-0 shadow-lg max-w-4xl mx-auto">
                  <CardContent className="p-6 sm:p-10 space-y-6">
                    <h3 className="text-2xl font-bold">Politique de Confidentialité</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">Dernière mise à jour : 5 juillet 2026</p>
                    <div className="space-y-5 text-sm text-muted-foreground leading-relaxed">
                      <div>
                        <h4 className="font-bold text-foreground text-base mb-2">1. Informations collectées</h4>
                        <p>Lorsque vous utilisez ce site, je peux collecter :<br />
                        - Les informations que vous fournissez via mes formulaires de contact (nom, numéro WhatsApp, email, description de votre projet)<br />
                        - Des données de navigation anonymes (pages visitées, durée de visite, type d&rsquo;appareil) via des outils d&rsquo;analyse<br />
                        - Des cookies pour améliorer votre expérience de navigation</p>
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground text-base mb-2">2. Utilisation des informations</h4>
                        <p>Les informations collectées servent à :<br />
                        - Répondre à vos demandes de devis ou de service<br />
                        - Améliorer la qualité de mes services et de mon site<br />
                        - Vous contacter au sujet de votre commande ou formation<br />
                        - Afficher des publicités pertinentes (si applicable)</p>
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground text-base mb-2">3. Partage des informations</h4>
                        <p>Je ne vends ni ne loue vos informations personnelles à des tiers. Elles peuvent être partagées uniquement :<br />
                        - Avec des prestataires techniques nécessaires au fonctionnement du site (hébergement)<br />
                        - Si la loi l&rsquo;exige</p>
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground text-base mb-2">4. Cookies et publicité</h4>
                        <p>Ce site peut utiliser des cookies, y compris ceux de services publicitaires tiers (comme Google AdSense), pour proposer des annonces adaptées à vos centres d&rsquo;intérêt. Vous pouvez désactiver les cookies dans les paramètres de votre navigateur à tout moment.</p>
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground text-base mb-2">5. Sécurité</h4>
                        <p>Je mets en oeuvre des mesures raisonnables pour protéger vos informations, mais aucun système n&rsquo;est totalement sécurisé à 100%.</p>
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground text-base mb-2">6. Vos droits</h4>
                        <p>Vous pouvez à tout moment demander la suppression de vos données personnelles en me contactant via WhatsApp ou email.</p>
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground text-base mb-2">7. Contact</h4>
                        <p>Pour toute question concernant cette politique : contact@createurboutique.com</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            )}
          </div>
        </section>

        {/* ═══ FAQ ═══ */}
        <section id="faq" className="py-16 sm:py-20 bg-muted/30">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <FadeIn className="text-center mb-12">
              <Badge variant="secondary" className="mb-3 bg-amber-100 text-amber-700 border-amber-200">
                <MessageCircle className="h-3 w-3 mr-1" /> FAQ
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Questions Fréquentes</h2>
              <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
                Les réponses aux questions les plus posées. Si vous ne trouvez pas votre réponse, contactez-moi directement sur WhatsApp.
              </p>
            </FadeIn>
            <FadeIn delay={0.1} className="space-y-3">
              {[
                {
                  q: "Est-ce que les services sont vraiment gratuits ?",
                  a: "Oui, tous les services sont actuellement offerts gratuitement. C'est ma façon de vous permettre de découvrir la qualité de mon travail sans aucun engagement financier."
                },
                {
                  q: "Comment recevoir ma commande ?",
                  a: "Après avoir discuté de votre projet sur WhatsApp, je crée votre design et vous l'envoie directement via WhatsApp ou Google Drive. La livraison se fait généralement entre 1 et 24 heures selon le service."
                },
                {
                  q: "Quels outils utilisez-vous ?",
                  a: "J'utilise les meilleurs outils professionnels du marché : Canva Pro pour le design, CapCut Pro pour le montage vidéo, PicsArt Pro pour le design mobile, et des outils web professionnels pour les sites."
                },
                {
                  q: "Combien de révisions sont incluses ?",
                  a: "Les révisions sont illimitées et gratuites. Je travaille jusqu'à ce que vous soyez entièrement satisfait du résultat. Votre satisfaction est ma priorité absolue."
                },
                {
                  q: "Comment suivre une formation ?",
                  a: "Cliquez simplement sur la formation qui vous intéresse. Vous serez redirigé vers WhatsApp où je vous expliquerai le contenu et comment y accéder. Simple et direct."
                },
                {
                  q: "Travaillez-vous avec des clients en dehors de Bamako ?",
                  a: "Absolument ! Je travaille avec des clients partout au Mali et en Afrique. Toutes les communications et livraisons se font en ligne via WhatsApp et Google Drive."
                },
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
            </FadeIn>
            <FadeIn className="mt-8 text-center">
              <p className="text-sm text-muted-foreground">
                Vous avez d&apos;autres questions ?{' '}
                <a href="#contact" className="text-amber-600 font-medium hover:underline">Contactez-moi</a> ou écrivez-moi directement sur{' '}
                <a href="https://wa.me/22397787244" target="_blank" rel="noopener noreferrer" className="text-emerald-600 font-medium hover:underline">WhatsApp</a>.
              </p>
            </FadeIn>
          </div>
        </section>

        {/* ═══ COMMANDE RAPIDE ═══ */}
        <section id="commande-rapide" className="py-20 sm:py-24">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <FadeIn>
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
                      <option value="Formation Designer Graphique — Gratuit">Formation Designer Graphique — Gratuit</option>
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
                      <option value="Formation en Montage Vidéo — Gratuit">Formation en Montage Vidéo — Gratuit</option>
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
                Prêt à faire passer votre communication au niveau supérieur ?
              </h2>
              <p className="mt-4 text-lg text-white/90 max-w-2xl mx-auto leading-relaxed">
                N'attendez plus pour donner à votre entreprise l'image qu'elle mérite. Contactez-moi dès aujourd'hui pour discuter de votre projet et obtenir un devis gratuit.
              </p>
              <div className="mt-5 inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-1.5 text-white text-xs font-semibold border border-white/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-400" />
                </span>
                Limité à 5 commandes par jour — Réservez votre place
              </div>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <a href="https://wa.me/22397787244?text=Bonjour%20Sacko%20!%20Je%20suis%20pr%C3%AAt%20%C3%A0%20lancer%20mon%20projet%20de%20communication." target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="bg-white text-amber-600 hover:bg-white/90 font-bold shadow-xl text-base px-8">
                    <MessageCircle className="h-5 w-5 mr-2" /> Commander via WhatsApp
                  </Button>
                </a>
                <a href="https://wa.me/22397787244?text=Bonjour%20!%20J%27aimerais%20discuter%20de%20mon%20projet%20avec%20vous." target="_blank" rel="noopener noreferrer">
                  <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 font-semibold text-base px-8">
                    M'envoyer un message <Send className="ml-2 h-4 w-4" />
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
        {/* Chat automatique popup - with auto dismiss */}
        <AnimatePresence>
          {showChatPopup && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ delay: 3, duration: 0.4 }}
              className="bg-white dark:bg-card border shadow-xl rounded-2xl p-4 w-72 hidden sm:block relative"
            >
              <button
                onClick={() => setShowChatPopup(false)}
                className="absolute top-2 right-2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Fermer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
              <div className="flex items-center gap-2 mb-2">
                <div className="relative">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                    <Headphones className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-emerald-500 rounded-full border-2 border-white dark:border-card" />
                </div>
                <div>
                  <p className="text-xs font-bold">Écrivez-moi maintenant</p>
                  <p className="text-[10px] text-emerald-600 font-medium">En ligne — réponse rapide</p>
                </div>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed mb-3">
                Besoin d&apos;un service ? Une question ? Écrivez-moi directement et recevez une réponse en quelques minutes via WhatsApp.
              </p>
              <a
                href="https://wa.me/22397787244?text=Bonjour%20!%20Je%20souhaite%20avoir%20des%20informations%20sur%20vos%20services."
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg py-2.5 transition-colors shadow-sm"
              >
                Démarrer la conversation
              </a>
            </motion.div>
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

      {/* ═══ BLOG ARTICLE DIALOG ═══ */}
      <Dialog open={!!selectedArticle} onOpenChange={() => setSelectedArticle(null)}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
          {selectedArticle && (
            <>
              <div className="relative h-56 sm:h-64 -mx-6 -mt-6 mb-4 overflow-hidden rounded-t-xl">
                <img src={selectedArticle.image} alt={selectedArticle.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-6 right-6">
                  <Badge className={selectedArticle.color + ' mb-2'}>{selectedArticle.category}</Badge>
                  <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight">{selectedArticle.title}</h2>
                  <div className="flex items-center gap-3 text-white/80 text-xs mt-2">
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{selectedArticle.date}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{selectedArticle.readTime} de lecture</span>
                  </div>
                </div>
              </div>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                {selectedArticle.content.split('\n\n').map((paragraph, i) => {
                  if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                    return <h3 key={i} className="text-base font-bold mt-5 mb-2 text-foreground">{paragraph.replace(/\*\*/g, '')}</h3>
                  }
                  const parts = paragraph.split(/(\*\*[^*]+\*\*)/g)
                  return (
                    <p key={i} className="text-sm text-muted-foreground leading-relaxed mb-4">
                      {parts.map((part, j) =>
                        part.startsWith('**') && part.endsWith('**')
                          ? <strong key={j} className="text-foreground font-semibold">{part.replace(/\*\*/g, '')}</strong>
                          : part
                      )}
                    </p>
                  )
                })}
              </div>
              <div className="mt-6 pt-4 border-t flex flex-col sm:flex-row items-center gap-3">
                <a
                  href={`https://wa.me/22397787244?text=${encodeURIComponent(`Bonjour ! J'ai lu l'article "${selectedArticle.title}" sur votre site et j'aimerais en savoir plus sur vos services.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold w-full sm:w-auto">
                    <MessageCircle className="h-4 w-4 mr-2" /> Commander un service
                  </Button>
                </a>
                <Button variant="outline" onClick={() => setSelectedArticle(null)} className="w-full sm:w-auto">Fermer l&apos;article</Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}