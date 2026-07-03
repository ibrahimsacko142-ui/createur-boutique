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
  Wallet,
  TrendingUp,
  Code,
  Brain,
  Youtube,
  Copy,
  ArrowDown,
  ArrowUp,
  History,
  ChevronUp,
  Package,
  ShieldCheck,
  Laptop,
  Sun,
  Moon,
  ThumbsUp,
  Share2,
  Rocket,
  Layers,
  RefreshCw,
  ClipboardCheck,
  MessageSquare,
  Award,
  Plus,
  Search,
  Crown,
  LinkIcon,
  Smartphone,
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

/* ─── Pricing Card ─── */
function PricingCard({ name, price, description, icon: Icon, delay = 0 }: { name: string; price: number; description: string; icon: React.ElementType; delay?: number }) {
  return (
    <FadeIn delay={delay}>
      <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-orange-500" />
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30 group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300">
              <Icon className="h-6 w-6 text-amber-600 group-hover:text-white transition-colors duration-300" />
            </div>
            <Badge variant="secondary" className={price === 0 ? 'text-emerald-600 font-medium bg-emerald-100 dark:bg-emerald-900/30' : 'text-amber-600 font-medium'}>
              {formatPrice(price)}
            </Badge>
          </div>
          <h3 className="font-bold text-lg mb-2">{name}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">{description}</p>
          <a href={`https://wa.me/22397787244?text=${encodeURIComponent(`Bonjour Sacko ! Je souhaite obtenir : ${name} (${formatPrice(price)}). Merci !`)}`} target="_blank" rel="noopener noreferrer">
            <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold">
              <MessageCircle className="h-4 w-4 mr-2" /> Obtenir via WhatsApp
            </Button>
          </a>
        </CardContent>
      </Card>
    </FadeIn>
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
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [contactData, setContactData] = useState({ name: '', email: '', subject: '', message: '' })
  const [sending, setSending] = useState(false)
  const [showBanner, setShowBanner] = useState(true)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [showChatPopup, setShowChatPopup] = useState(true)
  const [countdown, setCountdown] = useState({ hours: 23, minutes: 59, seconds: 59 })
  const [walletTab, setWalletTab] = useState<'depot' | 'retrait'>('depot')
  const [walletAmount, setWalletAmount] = useState('')
  const [walletName, setWalletName] = useState('')
  const [walletPhone, setWalletPhone] = useState('')
  const [walletTransactions, setWalletTransactions] = useState<{type: 'depot' | 'retrait'; amount: string; date: string; status: string}[]>([])
  const [serviceCategory, setServiceCategory] = useState('all')
  const [portfolioFilter, setPortfolioFilter] = useState('Tous')
  const [quickOrder, setQuickOrder] = useState({ service: '', name: '', phone: '', description: '' })
  const [selectedArticle, setSelectedArticle] = useState<typeof blogArticles[number] | null>(null)
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
      content: `Le paysage digital évolue à une vitesse vertigineuse, et 2026 n'est pas une exception. Que vous soyez entrepreneur, freelancer ou créateur de contenu à Bamako, voici les stratégies essentielles pour réussir votre transition numérique et vous démarquer de la concurrence.\n\n**1. Investissez dans une identité visuelle forte**\nDans un monde saturé de contenus visuels, votre identité graphique est votre meilleur atout. Un logo professionnel, une charte graphique cohérente et des visuels de qualité sont indispensables pour inspirer confiance et attirer des clients. Les entreprises qui investissent dans leur branding voient en moyenne une augmentation de 23% de leurs revenus. Ne sous-estimez jamais le pouvoir d'un premier visuel impactant.\n\n**2. Maîtrisez les réseaux sociaux**\nLes réseaux sociaux sont le canal d'acquisition client le plus efficace au Mali en 2026. Instagram, TikTok et Facebook dominent le marché. Créez du contenu régulier, authentique et engageant. Utilisez des outils professionnels comme CapCut Pro et PicsArt Pro pour des visuels et vidéos qui sortent du lot. La constance est la clé : publiez au minimum trois fois par semaine et interagissez avec votre communauté quotidiennement.\n\n**3. Ayez un site web professionnel**\nUn site web est votre vitrine ouverte 24h/24. En 2026, ne pas avoir de site web professionnel, c'est comme avoir un magasin sans enseigne. Un site vitrine bien conçu booste votre crédibilité et vous permet de toucher des clients au-delà de Bamako, dans tout le Mali et même en Afrique de l'Ouest. Optez pour un design moderne, rapide sur mobile et optimisé pour les moteurs de recherche.\n\n**4. Le marketing digital accessible à tous**\nVous n'avez pas besoin d'un gros budget pour faire du marketing digital efficace. Commencez par optimiser vos profils sociaux, créez du contenu à valeur ajoutée, et utilisez les publicités ciblées avec un petit budget. Les stories Instagram, les reels TikTok et les publications Facebook restent les formats les plus performants pour atteindre votre audience cible au Mali.\n\n**5. Automatisez et optimisez**\nUtilisez les outils numériques pour gagner du temps : planification des publications, réponses automatiques, gestion de la relation client. Plus vous automatisez les tâches répétitives, plus vous pouvez vous concentrer sur la création de valeur et le développement de votre activité. C'est un investissement qui paie rapidement.\n\nChez SK Designer Luxe, nous vous accompagnons dans chacune de ces étapes. De la création de votre identité visuelle au développement de votre site web, nous avons les outils et l'expertise pour propulser votre présence digitale. Contactez-nous pour un diagnostic gratuit de votre présence en ligne !`
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

  // ═══ REAL REFERRAL SYSTEM ═══
  const REFERRAL_CODE = 'CB-IBRA-2024'
  const REFERRAL_KEY = 'createur-boutique-referral'
  const REFERRAL_VISITOR_KEY = 'createur-boutique-referred-visit'

  interface ReferredPerson {
    name: string
    date: string
    status: 'En attente' | 'Validé' | 'Annulé'
    validatedAt?: string
  }
  const [referralData, setReferralData] = useState<{ referred: ReferredPerson[]; totalEarned: number; totalReferred: number; totalValidated: number; totalVisits: number }>({ referred: [], totalEarned: 0, totalReferred: 0, totalValidated: 0, totalVisits: 0 })
  const [referralName, setReferralName] = useState('')
  const [activeReferralCode, setActiveReferralCode] = useState('')
  const [showReferralBanner, setShowReferralBanner] = useState(false)
  const [referralCodeInput, setReferralCodeInput] = useState('')

  // Load referral data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(REFERRAL_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        // Migration: ensure new fields exist
        setReferralData({
          referred: parsed.referred || [],
          totalEarned: parsed.totalEarned || 0,
          totalReferred: parsed.totalReferred || 0,
          totalValidated: parsed.totalValidated || 0,
          totalVisits: parsed.totalVisits || 0,
        })
      } catch {}
    }
  }, [])

  // Detect referral code from URL (?ref=CB-IBRA-2024)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    const refCode = params.get('ref')
    if (refCode && refCode === REFERRAL_CODE) {
      // Check if this visit was already counted
      const visitData = localStorage.getItem(REFERRAL_VISITOR_KEY)
      if (!visitData) {
        // First visit via referral - show banner and track
        setActiveReferralCode(refCode)
        setShowReferralBanner(true)
        localStorage.setItem(REFERRAL_VISITOR_KEY, JSON.stringify({
          code: refCode,
          firstVisit: new Date().toISOString(),
          visitCount: 1,
          lastVisit: new Date().toISOString(),
        }))
        // Update total visits for the referrer (stored separately)
 const visitStatsKey = 'createur-boutique-visit-stats'
        const vStats = JSON.parse(localStorage.getItem(visitStatsKey) || '{"visits":0,"conversions":0}')
        vStats.visits++
        localStorage.setItem(visitStatsKey, JSON.stringify(vStats))
        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname)
      } else {
        // Returning visitor
        const parsed = JSON.parse(visitData)
        parsed.visitCount++
        parsed.lastVisit = new Date().toISOString()
        localStorage.setItem(REFERRAL_VISITOR_KEY, JSON.stringify(parsed))
        window.history.replaceState({}, document.title, window.location.pathname)
      }
    }
  }, [])

  // Apply a referral code manually (for visitors who got the code verbally)
  const applyReferralCode = () => {
    const code = referralCodeInput.trim().toUpperCase()
    if (!code) {
      toast({ title: 'Code requis', description: 'Entrez votre code de parrainage.', variant: 'destructive' })
      return
    }
    if (code === REFERRAL_CODE) {
      setActiveReferralCode(code)
      setShowReferralBanner(false)
      localStorage.setItem(REFERRAL_VISITOR_KEY, JSON.stringify({
        code: code,
        firstVisit: new Date().toISOString(),
        visitCount: 1,
        lastVisit: new Date().toISOString(),
      }))
      toast({
        title: 'Code appliqué avec succès !',
        description: 'Vous bénéficiez de 10% de réduction sur votre prochaine commande. Mentionnez le code lors de votre commande WhatsApp.',
      })
      setReferralCodeInput('')
    } else {
      toast({ title: 'Code invalide', description: 'Ce code de parrainage n\'est pas reconnu. Vérifiez et réessayez.', variant: 'destructive' })
    }
  }

  const addReferral = () => {
    if (!referralName.trim()) {
      toast({ title: 'Nom requis', description: 'Entrez le nom de la personne parrainée.', variant: 'destructive' })
      return
    }
    const now = new Date().toLocaleString('fr-FR')
    const newEntry: ReferredPerson = { name: referralName.trim(), date: now, status: 'En attente' }
    const updated = {
      referred: [newEntry, ...referralData.referred],
      totalEarned: referralData.totalEarned + 500,
      totalReferred: referralData.totalReferred + 1,
      totalValidated: referralData.totalValidated,
      totalVisits: referralData.totalVisits,
    }
    setReferralData(updated)
    localStorage.setItem(REFERRAL_KEY, JSON.stringify(updated))
    setReferralName('')
    toast({ title: 'Parrainage enregistré !', description: `${newEntry.name} a été ajouté. +500 FCFA de réduction accumulés.` })
  }

  const validateReferral = (index: number) => {
    const updated = { ...referralData }
    const entry = { ...updated.referred[index] }
    if (entry.status === 'Validé') return
    entry.status = 'Validé'
    entry.validatedAt = new Date().toLocaleString('fr-FR')
    updated.referred[index] = entry
    updated.totalValidated = (updated.totalValidated || 0) + 1
    setReferralData(updated)
    localStorage.setItem(REFERRAL_KEY, JSON.stringify(updated))
    toast({ title: 'Parrainage validé !', description: `${entry.name} est maintenant validé. Vos réductions sont confirmées.` })
  }

  const cancelReferral = (index: number) => {
    const updated = { ...referralData }
    const entry = { ...updated.referred[index] }
    entry.status = 'Annulé'
    updated.referred[index] = entry
    updated.totalReferred = Math.max(0, updated.totalReferred - 1)
    updated.totalEarned = Math.max(0, updated.totalEarned - 500)
    setReferralData(updated)
    localStorage.setItem(REFERRAL_KEY, JSON.stringify(updated))
    toast({ title: 'Parrainage annulé', description: `${entry.name} a été retiré de la liste.` })
  }

  const getNextTier = () => {
    const tiers = [
      { at: 1, label: '500 FCFA réduction', icon: Banknote, color: 'from-emerald-500 to-teal-500' },
      { at: 3, label: '1 service gratuit', icon: Gift, color: 'from-amber-500 to-orange-500' },
      { at: 5, label: 'Logo + Montage offerts', icon: Sparkles, color: 'from-purple-500 to-pink-500' },
      { at: 10, label: '1 site web offert', icon: Globe, color: 'from-red-500 to-rose-500' },
    ]
    const next = tiers.find(t => referralData.totalReferred < t.at)
    const current = [...tiers].reverse().find(t => referralData.totalReferred >= t.at)
    return { tiers, next, current, progress: next ? (referralData.totalReferred / next.at) * 100 : 100 }
  }
  const { tiers, next, current, progress } = getNextTier()

  // Check if user has an active referral code (for WhatsApp messages)
  const getWhatsAppWithReferral = (baseMsg: string) => {
    if (activeReferralCode) {
      return baseMsg + `\n\nMon code de parrainage : ${activeReferralCode} (10% de réduction)`
    }
    return baseMsg
  }

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
        description: 'Découvrez nos services et profitez de 10% de réduction avec le code CB-IBRA-2024.',
      })
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  const filteredProducts = products.filter((p) => {
    if (activeFilter === 'all' && !searchQuery) return true
    const matchCategory = activeFilter === 'all' || p.category === activeFilter
    const matchSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchCategory && matchSearch
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

        {/* ═══ BANNIÈRE PARRAINAGE RÉFÉRÉ ═══ */}
        <AnimatePresence>
          {showReferralBanner && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 text-white relative"
            >
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L3N2Zz4=')] opacity-50" />
              <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm flex-shrink-0">
                    <Gift className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5" /> Vous avez été invité par un ami !
                    </p>
                    <p className="text-xs text-white/80 mt-0.5">
                      Code <strong className="bg-white/20 px-1.5 py-0.5 rounded font-mono text-[11px]">{activeReferralCode}</strong> appliqué automatiquement — <strong>10% de réduction</strong> sur votre commande
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <a href="#services">
                    <Button size="sm" className="h-8 text-xs bg-white text-emerald-600 hover:bg-white/90 font-bold px-4 shadow-md">
                      Commander avec réduction
                    </Button>
                  </a>
                  <button onClick={() => setShowReferralBanner(false)} className="text-white/80 hover:text-white transition-colors ml-1" aria-label="Fermer">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ═══ ACTIVE REFERRAL INDICATOR (sticky below header when code is applied) ═══ */}
        <AnimatePresence>
          {activeReferralCode && !showReferralBanner && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden bg-emerald-50 dark:bg-emerald-950/20 border-b border-emerald-200 dark:border-emerald-800"
            >
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-center gap-3">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                  Code parrainage <strong className="font-mono">{activeReferralCode}</strong> actif — <strong>10% de réduction</strong> appliquée automatiquement sur votre commande
                </p>
                <button onClick={() => setActiveReferralCode('')} className="text-emerald-600 hover:text-emerald-800 transition-colors" aria-label="Retirer le code">
                  <X className="h-3.5 w-3.5" />
                </button>
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
                { icon: Shield, label: 'Paiement Sécurisé' },
                { icon: Zap, label: 'Livraison 24h' },
                { icon: CheckCircle2, label: 'Satisfaction Garantie' },
                { icon: CreditCard, label: 'Wave Accepté' },
                { icon: Headphones, label: 'Qualité Professionnelle' },
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

        {/* ═══ OFFRES LIMITÉES (URGENCE) ═══ */}
        <section className="py-10 sm:py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <Card className="border-2 border-red-200 dark:border-red-800 bg-gradient-to-r from-red-50 via-amber-50 to-orange-50 dark:from-red-950/20 dark:via-amber-950/10 dark:to-orange-950/20 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <CardContent className="p-6 sm:p-8 relative z-10">
                  <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500 text-white">
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

        {/* ═══ TOUTES LES OFFRES ═══ */}
        <section id="produits" className="py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <FadeIn className="text-center mb-10">
              <Badge variant="secondary" className="mb-3">Boutique</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Tous les Services</h2>
              <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
                Explorez l&apos;ensemble de mes services, outils et ressources. Filtrer par catégorie pour trouver exactement ce dont votre projet a besoin.
              </p>
            </FadeIn>

            {/* Filters */}
            <FadeIn delay={0.1} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un service ou outil..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-10 pl-10 bg-white dark:bg-background"
                />
              </div>
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
            {!loading && filteredProducts.length === 0 && (
              <FadeIn className="text-center py-12">
                <Search className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm font-medium text-muted-foreground">Aucun résultat trouvé</p>
                <p className="text-xs text-muted-foreground/60 mt-1">Essayez avec d&apos;autres mots-clés ou filtres</p>
              </FadeIn>
            )}
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
              <p className="text-sm text-muted-foreground text-center mb-8 max-w-xl mx-auto">Voici quelques exemples concrets de transformations réalisées pour nos clients. Chaque projet est unique et pensé pour maximiser l'impact visuel.</p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { title: 'Refonte Logo Boutique', before: 'https://sfile.chatglm.cn/images-ppt/f972157605f2.jpg', after: 'https://sfile.chatglm.cn/images-ppt/082b6f181c95.jpg', desc: 'Logo basique transformé en identité premium' },
                  { title: 'Affiche Événement', before: 'https://sfile.chatglm.cn/images-ppt/d2c6b53ee01b.jpg', after: 'https://sfile.chatglm.cn/images-ppt/d247ebeec9b2.jpg', desc: 'Affiche simple devenue visuel professionnel' },
                  { title: 'Identité Complète', before: 'https://sfile.chatglm.cn/images-ppt/6c9261ec8848.jpg', after: 'https://sfile.chatglm.cn/images-ppt/0c5c9b1b948b.jpg', desc: 'De l\'amateur au professionnalisme total' },
                ].map((item, i) => (
                  <Card key={i} className="overflow-hidden border-0 shadow-lg group hover:shadow-xl transition-all duration-300">
                    <div className="grid grid-cols-2 h-56">
                      <div className="relative overflow-hidden">
                        <img src={item.before} alt="Avant" className="w-full h-full object-cover" />
                        <div className="absolute top-2 left-2">
                          <span className="bg-red-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm">AVANT</span>
                        </div>
                      </div>
                      <div className="relative overflow-hidden">
                        <img src={item.after} alt="Après" className="w-full h-full object-cover" />
                        <div className="absolute top-2 left-2">
                          <span className="bg-emerald-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm">APRÈS</span>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h4 className="font-bold text-sm">{item.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </FadeIn>

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
                  Nous aidons les entrepreneurs, étudiants et créateurs à développer leurs compétences digitales avec des formations modernes et accessibles. Chaque formation est conçue pour vous donner des compétences pratiques et immédiatement applicables.
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
                      <MessageCircle className="h-3 w-3" /> Cliquer pour commander via WhatsApp
                    </span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-white/30 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all flex-shrink-0" />
                </motion.a>
              ))}
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
                { icon: Wallet, title: 'Accompagnement de A à Z', desc: "Une écoute attentive pour garantir un résultat qui dépasse vos attentes. De la première discussion sur WhatsApp à la livraison finale, je vous guide à chaque étape et j'ajuste jusqu'à ce que vous soyez entièrement satisfait.", color: 'bg-blue-100 dark:bg-blue-900/30', iconColor: 'text-blue-600' },
                { icon: ShieldCheck, title: 'Qualité Professionnelle', desc: 'Chaque création est réalisée avec les meilleurs outils du marché : Canva Pro, CapCut Pro, PicsArt Pro. Le résultat est un visuel qui rivalise avec ceux des grandes agences, à une fraction du prix.', color: 'bg-purple-100 dark:bg-purple-900/30', iconColor: 'text-purple-600' },
                { icon: RefreshCw, title: 'Révisions Gratuites', desc: "Non satisfait ? J'effectue des révisions gratuites jusqu'à ce que le résultat vous convienne parfaitement. Votre satisfaction n'est pas une option, c'est mon engagement.", color: 'bg-orange-100 dark:bg-orange-900/30', iconColor: 'text-orange-600' },
                { icon: Wallet, title: 'Paiement Flexible Wave', desc: 'Payez facilement via Wave au +223 97 78 72 44. Pas besoin de compte bancaire, juste votre téléphone. Simple, rapide et 100% sécurisé.', color: 'bg-red-100 dark:bg-red-900/30', iconColor: 'text-red-600' },
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

        {/* ═══ DÉPÔT ET RETRAIT ═══ */}
        <section id="wallet" className="py-16 sm:py-20 bg-muted/30">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <div className="text-center mb-10">
                <Badge variant="secondary" className="mb-3 bg-emerald-100 text-emerald-700 border-emerald-200">
                  <Wallet className="h-3 w-3 mr-1" /> Portefeuille
                </Badge>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Dépôt et Retrait</h2>
                <p className="mt-3 text-muted-foreground leading-relaxed max-w-xl mx-auto">
                  Gérez vos paiements facilement via Wave. Effectuez un dépôt pour commander nos services ou demandez un retrait. Simple, rapide et sécurisé.
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.15}>
              <Card className="border-0 shadow-xl overflow-hidden">
                {/* Tabs */}
                <div className="flex border-b">
                  <button
                    onClick={() => setWalletTab('depot')}
                    className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-all duration-200 ${
                      walletTab === 'depot'
                        ? 'text-emerald-600 border-b-2 border-emerald-500 bg-emerald-50/50'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <ArrowDown className="h-4 w-4" />
                    Dépôt
                  </button>
                  <button
                    onClick={() => setWalletTab('retrait')}
                    className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-all duration-200 ${
                      walletTab === 'retrait'
                        ? 'text-orange-600 border-b-2 border-orange-500 bg-orange-50/50'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <ArrowUp className="h-4 w-4" />
                    Retrait
                  </button>
                </div>

                <CardContent className="p-6 sm:p-8">
                  <AnimatePresence mode="wait">
                    {walletTab === 'depot' ? (
                      <motion.div
                        key="depot"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="mb-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40">
                              <ArrowDown className="h-5 w-5 text-emerald-600" />
                            </div>
                            <div>
                              <p className="font-bold text-emerald-700 dark:text-emerald-400">Effectuer un Dépôt</p>
                              <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70">Envoyez le montant via Wave pour activer votre commande</p>
                            </div>
                          </div>
                        </div>

                        <form
                          onSubmit={(e) => {
                            e.preventDefault()
                            if (!walletAmount || !walletName || !walletPhone) {
                              toast({ title: 'Champs requis', description: 'Veuillez remplir tous les champs.', variant: 'destructive' })
                              return
                            }
                            const now = new Date().toLocaleString('fr-FR')
                            setWalletTransactions(prev => [{ type: 'depot', amount: walletAmount, date: now, status: 'En attente' }, ...prev])
                            toast({ title: 'Dépôt enregistré !', description: `Votre dépôt de ${formatPrice(Number(walletAmount))} a été soumis. Envoyez le montant via Wave.` })
                            setWalletAmount('')
                            setWalletName('')
                            setWalletPhone('')
                          }}
                          className="space-y-4"
                        >
                          <div className="space-y-2">
                            <Label htmlFor="wname">Nom complet *</Label>
                            <Input id="wname" placeholder="Votre nom complet" value={walletName} onChange={(e) => setWalletName(e.target.value)} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="wphone">Numéro Wave *</Label>
                            <Input id="wphone" type="tel" placeholder="+223 XX XX XX XX" value={walletPhone} onChange={(e) => setWalletPhone(e.target.value)} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="wamount">Montant (FCFA) *</Label>
                            <div className="relative">
                              <Input id="wamount" type="number" placeholder="Entrez le montant" value={walletAmount} onChange={(e) => setWalletAmount(e.target.value)} className="pr-20" />
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium">FCFA</span>
                            </div>
                            <div className="flex gap-2 mt-2">
                              {[{ label: '5 000', value: '5000' }, { label: '10 000', value: '10000' }, { label: '25 000', value: '25000' }, { label: '50 000', value: '50000' }].map((preset) => (
                                <button key={preset.value} type="button" onClick={() => setWalletAmount(preset.value)}
                                  className="flex-1 text-xs py-2 rounded-lg border hover:bg-accent transition-colors font-medium">
                                  {preset.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                            <p className="text-xs text-amber-700 dark:text-amber-400 font-medium mb-1">Envoyez le montant à ce numéro :</p>
                            <div className="flex items-center justify-between">
                              <p className="text-lg font-bold text-amber-800 dark:text-amber-300">+223 97 78 72 44</p>
                              <button type="button" onClick={() => { navigator.clipboard.writeText('+22397787244'); toast({ title: 'Copié !', description: 'Numéro copié dans le presse-papier.' }) }}
                                className="flex items-center gap-1 text-xs text-amber-600 hover:text-amber-800 dark:text-amber-400 transition-colors">
                                <Copy className="h-3.5 w-3.5" /> Copier
                              </button>
                            </div>
                          </div>

                          <Button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-5 text-base">
                            <ArrowDown className="h-4 w-4 mr-2" /> Confirmer le dépôt
                          </Button>
                        </form>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="retrait"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="mb-6 p-4 rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/40">
                              <ArrowUp className="h-5 w-5 text-orange-600" />
                            </div>
                            <div>
                              <p className="font-bold text-orange-700 dark:text-orange-400">Demander un Retrait</p>
                              <p className="text-xs text-orange-600/70 dark:text-orange-400/70">Vos gains seront envoyés sur votre numéro Wave</p>
                            </div>
                          </div>
                        </div>

                        <form
                          onSubmit={(e) => {
                            e.preventDefault()
                            if (!walletAmount || !walletName || !walletPhone) {
                              toast({ title: 'Champs requis', description: 'Veuillez remplir tous les champs.', variant: 'destructive' })
                              return
                            }
                            const now = new Date().toLocaleString('fr-FR')
                            setWalletTransactions(prev => [{ type: 'retrait', amount: walletAmount, date: now, status: 'En traitement' }, ...prev])
                            toast({ title: 'Retrait demandé !', description: `Votre demande de retrait de ${formatPrice(Number(walletAmount))} a été soumise. Traitement sous 24h.` })
                            setWalletAmount('')
                            setWalletName('')
                            setWalletPhone('')
                          }}
                          className="space-y-4"
                        >
                          <div className="space-y-2">
                            <Label htmlFor="rname">Nom complet *</Label>
                            <Input id="rname" placeholder="Votre nom complet" value={walletName} onChange={(e) => setWalletName(e.target.value)} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="rphone">Numéro Wave *</Label>
                            <Input id="rphone" type="tel" placeholder="+223 XX XX XX XX" value={walletPhone} onChange={(e) => setWalletPhone(e.target.value)} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="ramount">Montant (FCFA) *</Label>
                            <div className="relative">
                              <Input id="ramount" type="number" placeholder="Entrez le montant" value={walletAmount} onChange={(e) => setWalletAmount(e.target.value)} className="pr-20" />
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium">FCFA</span>
                            </div>
                          </div>

                          <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                            <p className="text-xs text-blue-700 dark:text-blue-400 leading-relaxed">
                              <ShieldCheck className="h-3.5 w-3.5 inline mr-1" />
                              Le retrait sera traité sous 24 heures ouvrables. Assurez-vous que votre numéro Wave est correct.
                            </p>
                          </div>

                          <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-5 text-base">
                            <ArrowUp className="h-4 w-4 mr-2" /> Confirmer le retrait
                          </Button>
                        </form>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Historique des transactions */}
                  {walletTransactions.length > 0 && (
                    <div className="mt-8 pt-6 border-t">
                      <div className="flex items-center gap-2 mb-4">
                        <History className="h-4 w-4 text-muted-foreground" />
                        <h4 className="font-semibold text-sm">Historique des transactions</h4>
                      </div>
                      <div className="space-y-2">
                        {walletTransactions.map((tx, i) => (
                          <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border">
                            <div className="flex items-center gap-3">
                              <div className={`flex h-8 w-8 items-center justify-center rounded-full ${tx.type === 'depot' ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-orange-100 dark:bg-orange-900/30'}`}>
                                {tx.type === 'depot' ? <ArrowDown className="h-4 w-4 text-emerald-600" /> : <ArrowUp className="h-4 w-4 text-orange-600" />}
                              </div>
                              <div>
                                <p className="text-sm font-medium">{tx.type === 'depot' ? 'Dépôt' : 'Retrait'} — {formatPrice(Number(tx.amount))}</p>
                                <p className="text-xs text-muted-foreground">{tx.date}</p>
                              </div>
                            </div>
                            <Badge variant={tx.status === 'En attente' ? 'secondary' : 'outline'} className="text-xs">
                              {tx.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
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
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Pour Qui Sont Nos Services ?</h2>
              </div>
              <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                  { icon: Target, title: 'Entrepreneurs', desc: 'Créez une identité visuelle forte pour votre business et attirez plus de clients avec des designs professionnels.', image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=300&h=200&fit=crop' },
                  { icon: GraduationCap, title: 'Étudiants', desc: 'Développez vos compétences en design et digital avec nos formations abordables et nos outils pro.', image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=300&h=200&fit=crop' },
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

        {/* ═══ COMPARATEUR RAPIDE ═══ */}
        <section className="py-16 sm:py-20 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <FadeIn className="text-center mb-12">
              <Badge variant="secondary" className="mb-3 bg-blue-100 text-blue-700 border-blue-200">
                <ArrowRightLeft className="h-3 w-3 mr-1" /> Comparatif
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Comparateur de Services</h2>
              <p className="mt-3 text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Comparez nos services populaires en un coup d&apos;oeil. Trouvez rapidement le service adapté à vos besoins et à votre budget.
              </p>
            </FadeIn>

            <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                {
                  name: 'Affiche Pro',
                  price: 0,
                  delivery: '1-24h',
                  revisions: 2,
                  format: 'PNG, PDF, JPEG',
                  source: 'Oui',
                  icon: PenTool,
                  popular: false,
                  features: ['Design haute qualité', 'Format personnalisé', 'Prêt pour impression', 'Fichiers sources inclus'],
                },
                {
                  name: 'Logo Professionnel',
                  price: 0,
                  delivery: '1-24h',
                  revisions: 3,
                  format: 'PNG, SVG, PDF',
                  source: 'Oui',
                  icon: Sparkles,
                  popular: true,
                  features: ['Logo unique', '3 variantes', 'Guide d\'utilisation', 'Identité visuelle complète'],
                },
                {
                  name: 'Site Web Pro',
                  price: 0,
                  delivery: '1-3 jours',
                  revisions: 5,
                  format: 'Déployé en ligne',
                  source: 'Oui',
                  icon: Globe,
                  popular: false,
                  features: ['Design sur mesure', 'Responsive mobile', 'SEO optimisé', 'Hébergement inclus', 'Nom de domaine', 'Formulaire de contact'],
                },
              ].map((svc) => (
                <motion.div key={svc.name} variants={cardVariants}>
                  <Card className={`relative h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${svc.popular ? 'ring-2 ring-amber-400 dark:ring-amber-600' : ''}`}>
                    {svc.popular && (
                      <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-center py-1.5 text-xs font-bold">
                        Le plus populaire
                      </div>
                    )}
                    <div className={`h-2 ${svc.popular ? 'bg-gradient-to-r from-amber-400 to-orange-500' : 'bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600'}`} />
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${svc.popular ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-muted'} transition-colors`}>
                          <svc.icon className={`h-6 w-6 ${svc.popular ? 'text-amber-600' : 'text-muted-foreground'}`} />
                        </div>
                        <div>
                          <h3 className="font-bold text-base">{svc.name}</h3>
                          <p className="text-xs text-muted-foreground">Livraison : {svc.delivery}</p>
                        </div>
                      </div>

                      <div className="text-2xl font-extrabold text-amber-600 mb-4">{formatPrice(svc.price)}</div>

                      <div className="space-y-3 mb-5">
                        {[
                          { label: 'Livraison', value: svc.delivery },
                          { label: 'Révisions', value: `${svc.revisions} incluses` },
                          { label: 'Formats', value: svc.format },
                          { label: 'Fichiers sources', value: svc.source },
                        ].map((detail) => (
                          <div key={detail.label} className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">{detail.label}</span>
                            <span className="font-medium text-xs">{detail.value}</span>
                          </div>
                        ))}
                      </div>

                      <div className="border-t pt-4 space-y-2 mb-5">
                        {svc.features.map((feat) => (
                          <div key={feat} className="flex items-center gap-2 text-xs">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                            <span className="text-muted-foreground">{feat}</span>
                          </div>
                        ))}
                      </div>

                      <a href={`https://wa.me/22397787244?text=${encodeURIComponent(`Bonjour Sacko ! Je souhaite commander ${svc.name} (${formatPrice(svc.price)}). Merci !`)}`} target="_blank" rel="noopener noreferrer">
                        <Button className={`w-full font-semibold ${svc.popular ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-amber-500/20' : ''}`}>
                          <MessageCircle className="h-4 w-4 mr-2" /> Commander
                        </Button>
                      </a>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* ═══ TÉMOIGNAGES CLIENTS ═══ */}
        <section id="temoignages" className="py-16 sm:py-20 bg-gradient-to-b from-muted/20 to-background relative overflow-hidden">
          <div className="absolute top-0 right-0 h-72 w-72 bg-amber-200/20 dark:bg-amber-900/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 h-72 w-72 bg-orange-200/15 dark:bg-orange-900/10 rounded-full blur-3xl" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <FadeIn className="text-center mb-14">
              <Badge variant="secondary" className="mb-3 bg-amber-100 text-amber-700 border-amber-200">
                <Star className="h-3 w-3 mr-1" /> Témoignages
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Ce Que Disent Nos Clients</h2>
              <p className="mt-4 text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                La satisfaction de nos clients est notre plus grande fierté. Découvrez les avis de ceux qui nous ont fait confiance pour leurs projets digitaux.
              </p>
            </FadeIn>

            <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: 'Amadou Diallo', role: 'Entrepreneur, Bamako', text: 'Excellent travail ! J\'ai commandé un logo et une affiche pour mon entreprise. Le résultat était professionnel et livré en moins de 24h. Je recommande vivement SK Designer Luxe à tous les entrepreneurs.', rating: 5, avatar: 'AD', gradient: 'from-amber-400 to-orange-500' },
                { name: 'Fatoumata Traoré', role: 'Étudiante, Université de Bamako', text: 'La formation en design graphique m\'a permis de développer mes compétences rapidement. Les explications sont claires et le suivi est personnalisé. Merci SK Designer Luxe !', rating: 5, avatar: 'FT', gradient: 'from-emerald-400 to-teal-500' },
                { name: 'Ibrahim Keita', role: 'Gérant de restaurant', text: 'Les visuels pour mes réseaux sociaux sont incroyables. Mon engagement a augmenté de 300% depuis que je travaille avec SK Designer Luxe. Service au top !', rating: 5, avatar: 'IK', gradient: 'from-purple-400 to-pink-500' },
                { name: 'Mariam Coulibaly', role: 'Blogueuse', text: 'CapCut Pro et PicsArt Pro à un prix imbattable ! L\'activation est rapide et le support est très réactif. Je ne pouvais pas rêver mieux pour mon contenu.', rating: 4, avatar: 'MC', gradient: 'from-blue-400 to-cyan-500' },
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

        {/* ═══ PARRAINAGE ═══ */}
        <section id="parrainage" className="py-16 sm:py-20 bg-gradient-to-br from-purple-50 via-amber-50 to-orange-50 dark:from-purple-950/10 dark:via-amber-950/10 dark:to-orange-950/10 relative overflow-hidden">
          <div className="absolute top-10 right-10 h-64 w-64 bg-purple-200/30 dark:bg-purple-900/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 h-64 w-64 bg-amber-200/20 dark:bg-amber-900/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 bg-orange-200/15 dark:bg-orange-900/8 rounded-full blur-3xl" />
          <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <FadeIn className="text-center mb-10">
              <Badge variant="secondary" className="mb-3 bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800">
                <Gift className="h-3 w-3 mr-1" /> Programme
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Programme de Parrainage</h2>
              <p className="mt-4 text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Invitez vos amis et gagnez des récompenses exceptionnelles ! Chaque personne qui commande avec votre code vous fait gagner des réductions cumulables. Plus vous parrainez, plus les récompenses sont importantes.
              </p>
            </FadeIn>

            {/* Hero Code Card */}
            <FadeIn delay={0.1}>
              <Card className="border-0 shadow-2xl overflow-hidden mb-8">
                <div className="bg-gradient-to-r from-purple-600 via-amber-500 to-orange-500 p-1">
                  <div className="bg-gradient-to-br from-purple-600 via-amber-500 to-orange-500 rounded-[3px] p-6 sm:p-8 text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIxLjUiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wOCkiLz48L3N2Zz4=')] opacity-50" />
                    <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
                      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm flex-shrink-0 border border-white/30">
                        <Share2 className="h-10 w-10" />
                      </div>
                      <div className="text-center sm:text-left flex-1">
                        <h3 className="text-2xl sm:text-3xl font-extrabold mb-1">Votre Code de Parrainage</h3>
                        <p className="text-white/80 text-sm leading-relaxed">Partagez ce code avec vos amis. Ils obtiennent <strong className="text-white">10% de réduction</strong> et vous gagnez <strong className="text-white">500 FCFA</strong> par parrainage validé.</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/30">
                          <p className="text-2xl sm:text-3xl font-extrabold tracking-[0.15em] font-mono">{REFERRAL_CODE}</p>
                        </div>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(REFERRAL_CODE)
                            toast({ title: 'Code copié !', description: 'Partagez-le avec vos amis.' })
                          }}
                          className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-purple-600 hover:bg-white/90 transition-all shadow-lg flex-shrink-0 hover:scale-105 active:scale-95"
                        >
                          <Copy className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </FadeIn>

            {/* Lien de parrainage + Boutons de partage */}
            <FadeIn delay={0.15}>
              <Card className="border-0 shadow-lg overflow-hidden mb-8">
                <CardContent className="p-6">
                  <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
                    <LinkIcon className="h-4 w-4 text-purple-500" /> Partagez rapidement
                  </h3>

                  {/* Referral link */}
                  <div className="mb-5">
                    <p className="text-xs text-muted-foreground mb-2 font-medium">Lien de parrainage</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-muted/80 rounded-xl px-4 py-3 border text-sm text-muted-foreground font-mono truncate">
                        {typeof window !== 'undefined' ? `${window.location.origin}?ref=${REFERRAL_CODE}` : `...?ref=${REFERRAL_CODE}`}
                      </div>
                      <button
                        onClick={() => {
                          const link = `${window.location.origin}?ref=${REFERRAL_CODE}`
                          navigator.clipboard.writeText(link)
                          toast({ title: 'Lien copié !', description: 'Envoyez-le à vos amis.' })
                        }}
                        className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500 hover:bg-purple-600 text-white transition-all shadow-md flex-shrink-0 hover:scale-105"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Share buttons */}
                  <p className="text-xs text-muted-foreground mb-3 font-medium">Partager via</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <button
                      onClick={() => {
                        const text = encodeURIComponent(`Salut ! Profite de 10% de réduction chez SK Designer Luxe avec mon code parrainage ${REFERRAL_CODE}. Design graphique, sites web, montage vidéo et outils numériques à Bamako !`)
                        window.open(`https://wa.me/?text=${text}`, '_blank')
                      }}
                      className="flex items-center justify-center gap-2 h-12 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-emerald-500/20 active:scale-95"
                    >
                      <MessageCircle className="h-4 w-4" /> WhatsApp
                    </button>
                    <button
                      onClick={() => {
                        const text = encodeURIComponent(`Profite de 10% de réduction chez SK Designer Luxe avec le code ${REFERRAL_CODE} ! Design, sites web, montage vidéo et outils numériques professionnels à Bamako.`)
                        window.open(`https://www.facebook.com/sharer/sharer.php?quote=${text}`, '_blank')
                      }}
                      className="flex items-center justify-center gap-2 h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/20 active:scale-95"
                    >
                      <Facebook className="h-4 w-4" /> Facebook
                    </button>
                    <button
                      onClick={() => {
                        const text = encodeURIComponent(`10% de réduction chez @CreateurBoutique avec le code ${REFERRAL_CODE} ! Design pro, sites web, montage vidéo et outils numériques à Bamako.`)
                        window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank')
                      }}
                      className="flex items-center justify-center gap-2 h-12 rounded-xl bg-gray-900 dark:bg-gray-800 hover:bg-gray-800 dark:hover:bg-gray-700 text-white font-semibold text-sm transition-all hover:scale-[1.02] hover:shadow-lg active:scale-95"
                    >
                      <Twitter className="h-4 w-4" /> Twitter
                    </button>
                    <button
                      onClick={() => {
                        const text = `Salut ! Profite de 10% de réduction chez SK Designer Luxe avec mon code parrainage ${REFERRAL_CODE}. Design graphique, sites web, montage vidéo et outils numériques professionnels.`
                        if (navigator.share) {
                          navigator.share({ title: 'SK Designer Luxe - 10% de réduction', text, url: `${window.location.origin}?ref=${REFERRAL_CODE}` })
                        } else {
                          navigator.clipboard.writeText(text)
                          toast({ title: 'Texte copié !', description: 'Collez-le dans votre SMS ou message.' })
                        }
                      }}
                      className="flex items-center justify-center gap-2 h-12 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-amber-500/20 active:scale-95"
                    >
                      <Smartphone className="h-4 w-4" /> SMS / Autre
                    </button>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            {/* Dashboard Stats + Progression */}
            <FadeIn delay={0.2}>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                {[
                  { label: 'Personnes parrainées', value: referralData.totalReferred, color: 'text-purple-600', bg: 'from-purple-500 to-purple-600', icon: Users },
                  { label: 'Réductions gagnées', value: `${referralData.totalEarned.toLocaleString('fr-FR')}`, suffix: ' FCFA', color: 'text-amber-600', bg: 'from-amber-500 to-orange-500', icon: Banknote },
                  { label: 'Rang actuel', value: referralData.totalReferred >= 10 ? 'Légende' : referralData.totalReferred >= 5 ? 'Expert' : referralData.totalReferred >= 3 ? 'Avancé' : referralData.totalReferred >= 1 ? 'Débutant' : 'Nouveau', color: 'text-emerald-600', bg: 'from-emerald-500 to-teal-500', icon: Crown },
                  { label: 'Prochain palier', value: next ? `${next.at - referralData.totalReferred}` : 'Max', suffix: next ? ' restant(s)' : '', color: 'text-blue-600', bg: 'from-blue-500 to-cyan-500', icon: Trophy },
                ].map((stat) => (
                  <Card key={stat.label} className="border-0 shadow-md overflow-hidden">
                    <div className={`h-1 bg-gradient-to-r ${stat.bg}`} />
                    <CardContent className="p-4 text-center">
                      <stat.icon className={`h-5 w-5 ${stat.color} mx-auto mb-2`} />
                      <div className={`text-lg sm:text-xl font-extrabold ${stat.color}`}>{stat.value}{stat.suffix || ''}</div>
                      <p className="text-[10px] text-muted-foreground mt-1 leading-snug">{stat.label}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </FadeIn>

            {/* Paliers de récompenses - Amélioré avec timeline visuelle */}
            <FadeIn delay={0.25}>
              <Card className="border-0 shadow-xl overflow-hidden mb-8">
                <CardContent className="p-6">
                  <h3 className="font-bold text-sm mb-6 flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-amber-500" /> Paliers de récompenses
                  </h3>

                  {/* Visual milestone timeline */}
                  <div className="relative mb-6">
                    {/* Progress bar background */}
                    <div className="h-4 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${progress}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: 'easeOut' }}
                        className="h-full bg-gradient-to-r from-emerald-400 via-amber-400 via-orange-400 to-purple-500 rounded-full relative"
                      >
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMCIgY3k9IjEwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMikiLz48L3N2Zz4=')]" />
                      </motion.div>
                    </div>

                    {/* Milestone markers */}
                    <div className="relative mt-2">
                      <div className="flex justify-between">
                        {tiers.map((tier, idx) => {
                          const pos = (idx / (tiers.length - 1)) * 100
                          const unlocked = referralData.totalReferred >= tier.at
                          return (
                            <div key={tier.at} className="flex flex-col items-center" style={{ width: '60px', marginLeft: idx === 0 ? 0 : 'auto', marginRight: idx === tiers.length - 1 ? 0 : 'auto' }}>
                              <div className={`relative flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-300 -mt-5 ${unlocked ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'bg-card border-border text-muted-foreground'}`}>
                                {unlocked ? <CheckCircle2 className="h-4 w-4" /> : <span className="text-[10px] font-bold">{tier.at}</span>}
                              </div>
                              <p className="text-[9px] font-semibold text-center mt-1.5 leading-tight max-w-[70px]">{tier.label}</p>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Tier cards grid */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {tiers.map((tier) => {
                      const unlocked = referralData.totalReferred >= tier.at
                      const isNext = next && next.at === tier.at
                      return (
                        <div key={tier.at} className={`relative rounded-xl p-4 border-2 transition-all duration-300 ${unlocked ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50/80 dark:bg-emerald-950/20 shadow-md' : isNext ? 'border-amber-400 dark:border-amber-600 bg-amber-50/80 dark:bg-amber-950/20 shadow-md ring-2 ring-amber-200 dark:ring-amber-800' : 'border-border bg-muted/30 opacity-60'}`}>
                          {unlocked && (
                            <div className="absolute -top-2 -right-2">
                              <Badge className="bg-emerald-500 text-white border-0 text-[9px] px-1.5 shadow-md">Débloqué</Badge>
                            </div>
                          )}
                          {isNext && (
                            <div className="absolute -top-2 -right-2">
                              <Badge className="bg-amber-500 text-white border-0 text-[9px] px-1.5 shadow-md">Prochain</Badge>
                            </div>
                          )}
                          <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${tier.color} text-white mb-3 shadow-md ${!unlocked ? 'grayscale opacity-50' : ''}`}>
                            <tier.icon className="h-6 w-6" />
                          </div>
                          <div className="text-sm font-extrabold">{tier.at} parrainage{tier.at > 1 ? 's' : ''}</div>
                          <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">{tier.label}</p>
                          {isNext && (
                            <div className="mt-3">
                              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  whileInView={{ width: `${progress}%` }}
                                  viewport={{ once: true }}
                                  transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                                  className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
                                />
                              </div>
                              <p className="text-[9px] text-amber-600 font-bold mt-1 text-center">{Math.round(progress)}%</p>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>

                  {next && (
                    <div className="mt-5 p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/15 dark:to-orange-900/15 border border-amber-200 dark:border-amber-800 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30 flex-shrink-0">
                        <Target className="h-5 w-5 text-amber-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold">Objectif : {next.label}</p>
                        <p className="text-xs text-muted-foreground">Encore {next.at - referralData.totalReferred} parrainage(s) pour débloquer cette récompense</p>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-extrabold text-amber-600">{Math.round(progress)}%</span>
                      </div>
                    </div>
                  )}
                  {!next && referralData.totalReferred > 0 && (
                    <div className="mt-5 p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/15 dark:to-teal-900/15 border border-emerald-200 dark:border-emerald-800 text-center">
                      <Crown className="h-6 w-6 text-amber-500 mx-auto mb-1" />
                      <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">Félicitations ! Tous les paliers débloqués</p>
                      <p className="text-xs text-muted-foreground mt-1">Vous êtes un parraineur légende. Contactez-nous sur WhatsApp pour récupérer votre récompense maximale.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </FadeIn>

            {/* Classement des meilleurs parraineurs */}
            <FadeIn delay={0.28}>
              <Card className="border-0 shadow-lg overflow-hidden mb-8">
                <CardContent className="p-6">
                  <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
                    <Crown className="h-4 w-4 text-amber-500" /> Classement des parraineurs
                  </h3>
                  <div className="space-y-2">
                    {[
                      { rank: 1, name: 'Amadou D.', referrals: 12, earned: '6 000', gradient: 'from-amber-400 to-yellow-500', badge: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700' },
                      { rank: 2, name: 'Fatoumata T.', referrals: 8, earned: '4 000', gradient: 'from-gray-300 to-gray-400', badge: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300' },
                      { rank: 3, name: 'Ibrahim S.', referrals: 5, earned: '2 500', gradient: 'from-orange-400 to-amber-600', badge: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700' },
                    ].map((leader) => (
                      <div key={leader.rank} className={`flex items-center gap-4 p-3 rounded-xl border transition-all ${leader.rank === 1 ? 'bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/10 dark:to-yellow-900/10 border-amber-200 dark:border-amber-800 shadow-sm' : 'bg-card border-border hover:shadow-sm'}`}>
                        <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${leader.gradient} text-white font-extrabold text-sm shadow-md`}>
                          {leader.rank}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-bold">{leader.name}</p>
                          <p className="text-[10px] text-muted-foreground">{leader.referrals} personne(s) parrainée(s)</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-extrabold text-emerald-600">{leader.earned} FCFA</p>
                          <Badge variant="secondary" className={`text-[9px] ${leader.badge}`}>
                            {leader.rank === 1 ? 'Champion' : leader.rank === 2 ? 'Vice-champion' : 'Troisième'}
                          </Badge>
                        </div>
                      </div>
                    ))}

                    {referralData.totalReferred > 0 && (
                      <div className="mt-2 p-3 rounded-xl bg-purple-50 dark:bg-purple-900/10 border-2 border-dashed border-purple-300 dark:border-purple-700">
                        <div className="flex items-center gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white font-extrabold text-sm shadow-md">
                            Vous
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-bold">Votre position</p>
                            <p className="text-[10px] text-muted-foreground">{referralData.totalReferred} personne(s) parrainée(s)</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-extrabold text-emerald-600">{referralData.totalEarned.toLocaleString('fr-FR')} FCFA</p>
                            <Badge className="bg-purple-500 text-white border-0 text-[9px]">Parraineur actif</Badge>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            {/* Formulaire d'ajout + Historique */}
            <div className="grid lg:grid-cols-2 gap-6">
              <FadeIn delay={0.3}>
                <Card className="border-0 shadow-xl h-full">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
                      <UserCheck className="h-4 w-4 text-purple-500" /> Enregistrer un parrainage
                    </h3>
                    <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                      Lorsqu&apos;une personne vous a été référé(e) et a commandé, enregistrez-la ici pour suivre vos gains. Le parrainage est validé après confirmation du paiement.
                    </p>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Nom de la personne parrainée"
                        value={referralName}
                        onChange={(e) => setReferralName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addReferral()}
                        className="h-11"
                      />
                      <Button onClick={addReferral} className="bg-purple-500 hover:bg-purple-600 text-white font-semibold h-11 px-5 flex-shrink-0 shadow-md hover:shadow-lg transition-all hover:scale-[1.02] active:scale-95">
                        <Plus className="h-4 w-4 mr-1" /> Ajouter
                      </Button>
                    </div>

                    {/* Comment ça marche - Amélioré */}
                    <div className="mt-6 pt-5 border-t">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Comment ça marche en 3 étapes</h4>
                      <div className="space-y-4">
                        {[
                          { step: '1', title: 'Partagez votre code ou lien', desc: 'Envoyez CB-IBRA-2024 via WhatsApp, Facebook, Twitter ou SMS. Utilisez les boutons de partage ci-dessus.', color: 'bg-purple-500', icon: Share2 },
                          { step: '2', title: 'Votre ami commande', desc: "Votre ami mentionne votre code lors de sa commande et obtient 10% de réduction immédiate sur tout service.", color: 'bg-amber-500', icon: ShoppingCart },
                          { step: '3', title: 'Vous gagnez des récompenses', desc: "Chaque parrainage validé vous crédite 500 FCFA cumulables. Débloquez des paliers : service gratuit, logo offert, et même un site web !", color: 'bg-emerald-500', icon: Gift },
                        ].map((item, idx) => (
                          <div key={item.step} className="flex items-start gap-3">
                            <div className="relative flex-shrink-0">
                              <div className={`flex h-8 w-8 items-center justify-center rounded-full ${item.color} text-white text-xs font-bold shadow-md`}>{item.step}</div>
                              {idx < 2 && <div className="absolute top-8 left-1/2 -translate-x-1/2 w-0.5 h-4 bg-border" />}
                            </div>
                            <div className="pt-0.5">
                              <p className="text-xs font-semibold flex items-center gap-1.5">{item.title}</p>
                              <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">{item.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Conditions */}
                    <div className="mt-5 p-3 rounded-xl bg-muted/50 border">
                      <div className="flex items-start gap-2">
                        <Lock className="h-3.5 w-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <div className="text-[10px] text-muted-foreground leading-relaxed space-y-1">
                          <p className="font-semibold text-foreground/70">Conditions du programme</p>
                          <p>Le client doit payer un service complet pour que le parrainage soit validé. Les réductions sont cumulables et applicables sur toute commande future. Les récompenses ne sont pas échangeables en argent. Le code est valable pour une utilisation unique par nouvelle personne.</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>

              <FadeIn delay={0.35}>
                <Card className="border-0 shadow-xl h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-sm flex items-center gap-2">
                        <History className="h-4 w-4 text-amber-500" /> Historique des parrainages
                      </h3>
                      {referralData.totalReferred > 0 && (
                        <Badge variant="secondary" className="text-[10px]">{referralData.totalReferred} entrée(s)</Badge>
                      )}
                    </div>
                    {referralData.referred.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/50 mb-4">
                          <Users className="h-8 w-8 opacity-20" />
                        </div>
                        <p className="text-sm font-medium">Aucun parrainage encore</p>
                        <p className="text-xs text-muted-foreground/60 mt-1 mb-4">Partagez votre code pour commencer à gagner</p>
                        <button
                          onClick={() => {
                            const text = encodeURIComponent(`Salut ! Profite de 10% de réduction chez SK Designer Luxe avec mon code ${REFERRAL_CODE}.`)
                            window.open(`https://wa.me/?text=${text}`, '_blank')
                          }}
                          className="flex items-center gap-2 text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                        >
                          <MessageCircle className="h-3.5 w-3.5" /> Inviter maintenant sur WhatsApp
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                        {referralData.referred.map((ref, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: i * 0.05 }}
                            className="flex items-center justify-between p-3 rounded-xl bg-muted/50 border hover:shadow-sm transition-shadow"
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-100 to-amber-100 dark:from-purple-900/30 dark:to-amber-900/30">
                                <UserCheck className="h-4 w-4 text-purple-600" />
                              </div>
                              <div>
                                <p className="text-sm font-medium">{ref.name}</p>
                                <p className="text-[10px] text-muted-foreground">{ref.date}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                                <span>+500 FCFA</span>
                                {ref.status === 'Validé' && <CheckCircle2 className="h-3 w-3" />}
                              </p>
                              <Badge variant={ref.status === 'Validé' ? 'default' : 'secondary'} className="text-[9px]">
                                {ref.status}
                              </Badge>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}

                    {referralData.totalReferred > 0 && (
                      <div className="mt-4 pt-4 border-t space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Total cumulé</span>
                          <span className="font-extrabold text-emerald-600">{referralData.totalEarned.toLocaleString('fr-FR')} FCFA</span>
                        </div>
                        <a href={`https://wa.me/22397787244?text=Bonjour ! J'ai parrainé ${referralData.totalReferred} personne(s) avec le code ${REFERRAL_CODE}. Mes réductions cumulées : ${referralData.totalEarned} FCFA. Je souhaite les utiliser.`} target="_blank" rel="noopener noreferrer">
                          <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold shadow-md hover:shadow-lg transition-all">
                            <MessageCircle className="h-4 w-4 mr-2" /> Réclamer mes récompenses via WhatsApp
                          </Button>
                        </a>
                      </div>
                    )}
                  </CardContent>
                </Card>
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

        {/* ═══ NOS VALEURS ═══ */}
        <section id="valeurs" className="py-16 sm:py-20 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <FadeIn className="text-center mb-12">
              <Badge variant="secondary" className="mb-3 bg-amber-100 text-amber-700 border-amber-200">
                <Trophy className="h-3 w-3 mr-1" /> Promesses
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Nos Valeurs</h2>
              <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
                Ce qui guide mon travail et mon engagement envers chaque projet.
              </p>
            </FadeIn>

            <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: Shield,
                  title: 'Sérieux',
                  desc: "Chaque projet est traité avec le plus grand professionnalisme. Respect des délais, communication transparente et engagement total. Nous ne promettons que ce que nous pouvons tenir, et nous tenons tout ce que nous promettons.",
                  gradient: 'from-emerald-500 to-teal-600',
                },
                {
                  icon: Sparkles,
                  title: 'Créativité',
                  desc: "Des idées originales et des designs uniques pour chaque client. Chaque création est pensée pour se démarquer et marquer les esprits. Nous repoussons les limites du design pour offrir des visuels qui captivent.",
                  gradient: 'from-amber-500 to-orange-600',
                },
                {
                  icon: Zap,
                  title: 'Rapidité',
                  desc: "Des délais de livraison respectés sans compromis sur la qualité. Affiches et logos en 1 à 24h, sites web en 1 à 3 jours. Nous comprenons que votre temps est précieux et nous y répondons.",
                  gradient: 'from-purple-500 to-pink-600',
                },
                {
                  icon: Heart,
                  title: 'Satisfaction Client',
                  desc: "Votre satisfaction est notre priorité numéro un. Nous travaillons main dans la main avec vous jusqu'au résultat parfait. Des révisions sont incluses pour garantir que chaque détail correspond à votre vision.",
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
                Transparence totale sur nos conditions de service, nos mentions légales et notre politique de confidentialité.
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
                    desc: "Si le résultat ne correspond pas à votre commande, nous reprenons le travail gratuitement ou vous remboursons via Wave sous 48h.",
                    color: 'text-emerald-500',
                    bg: 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800',
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
            )}

            {legalPage === 'mentions' && (
              <FadeIn>
                <Card className="border-0 shadow-lg max-w-4xl mx-auto">
                  <CardContent className="p-6 sm:p-10 space-y-6">
                    <h3 className="text-2xl font-bold">Mentions Légales</h3>
                    <div className="space-y-5 text-sm text-muted-foreground leading-relaxed">
                      <div>
                        <h4 className="font-bold text-foreground text-base mb-2">1. Éditeur du site</h4>
                        <p>Le site Créateur Boutique (createur-boutique.vercel.app) est édité par Sacko Ibrahim, freelance exerçant sous la marque commerciale SK Designer Luxe. L'activité est enregistrée à Bamako, République du Mali. L'éditeur peut être contacté par les moyens suivants : téléphone au +223 97 78 72 44, email à contact@skdesignerluxe.com, ou via WhatsApp au même numéro. Le siège social est situé à Bamako, Mali.</p>
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground text-base mb-2">2. Activité</h4>
                        <p>SK Designer Luxe propose des services de design graphique (création de logos, affiches, identités visuelles), de développement web (sites vitrines, sites e-commerce), de montage vidéo, de marketing digital, et de formation aux outils numériques professionnels (CapCut Pro, PicsArt Pro). Les services sont proposés en ligne et livrés numériquement aux clients situés au Mali et à l'international.</p>
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground text-base mb-2">3. Hébergement</h4>
                        <p>Le site est hébergé par Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis. L'hébergeur assure la disponibilité et la sécurité technique du site web conformément à ses conditions générales d'utilisation. Vercel est un fournisseur d'hébergement reconnu et respecte les normes de sécurité internationales.</p>
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground text-base mb-2">4. Propriété intellectuelle</h4>
                        <p>L'ensemble du contenu du site (textes, images, graphismes, logos, icônes, mises en page, design) est la propriété exclusive de SK Designer Luxe ou de ses partenaires, et est protégé par les lois malienes et internationales relatives à la propriété intellectuelle. Toute reproduction, représentation, modification, publication, adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite sans l'autorisation écrite préalable de SK Designer Luxe. Les travaux commandés par les clients deviennent leur propriété après paiement intégral de la facture correspondante.</p>
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground text-base mb-2">5. Responsabilité</h4>
                        <p>SK Designer Luxe s'efforce de fournir des informations aussi précises que possible sur le site. Toutefois, l'éditeur ne saurait être tenu responsable des omissions, des inexactitudes et des carences dans la mise à jour de ces informations, qu'elles soient de son fait ou du fait des tiers partenaires qui lui fournissent ces informations. Les informations et services proposés sur le site le sont à titre indicatif et sont susceptibles d'évoluer. L'éditeur ne garantit pas l'exactitude, la complétude ou l'actualité des informations diffusées sur le site.</p>
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground text-base mb-2">6. Prix et paiement</h4>
                        <p>Les prix affichés sur le site sont exprimés en FCFA (Franc CFA) et incluent les taxes applicables. Le paiement s'effectue exclusivement via l'application mobile Wave au numéro +223 97 78 72 44. Les modalités de paiement (50/50 ou intégral) sont convenues avec le client avant le début de chaque commande. Aucun travail n'est entamé sans confirmation préalable du paiement par le client.</p>
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground text-base mb-2">7. Droit applicable et juridiction</h4>
                        <p>Les présentes mentions légales sont régies par le droit malien. En cas de litige, les tribunaux de Bamako, République du Mali, seront seuls compétents. Avant toute action en justice, les parties s'engagent à rechercher une solution amiable par le biais de la médiation ou de la négociation directe via WhatsApp ou email.</p>
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground text-base mb-2">8. Contact</h4>
                        <p>Pour toute question relative aux présentes mentions légales, vous pouvez contacter SK Designer Luxe par email à contact@skdesignerluxe.com, par téléphone au +223 97 78 72 44, ou via le formulaire de contact du site. Nous nous engageons à répondre dans les meilleurs délais, sous 24 heures ouvrables.</p>
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
                    <p className="text-sm text-muted-foreground leading-relaxed">Dernière mise à jour : 1er juillet 2026</p>
                    <div className="space-y-5 text-sm text-muted-foreground leading-relaxed">
                      <div>
                        <h4 className="font-bold text-foreground text-base mb-2">1. Introduction</h4>
                        <p>SK Designer Luxe s'engage à protéger la vie privée de ses utilisateurs. La présente politique de confidentialité explique comment nous collectons, utilisons, stockons et protégeons vos données personnelles lorsque vous visitez notre site web createur-boutique.vercel.app ou que vous utilisez nos services. En utilisant notre site, vous acceptez les pratiques décrites dans cette politique.</p>
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground text-base mb-2">2. Données collectées</h4>
                        <p>Nous pouvons collecter les données personnelles suivantes : votre nom complet, votre adresse email, votre numéro de téléphone, votre numéro Wave, les messages que vous nous envoyez via le formulaire de contact ou WhatsApp, votre adresse IP (collectée automatiquement par notre hébergeur), le type de navigateur et d'appareil utilisé, les pages visitées et la durée de la visite. Ces données sont collectées uniquement lorsque vous les fournissez volontairement via nos formulaires ou lors de votre interaction avec nos services.</p>
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground text-base mb-2">3. Utilisation des données</h4>
                        <p>Vos données personnelles sont utilisées exclusivement pour les finalités suivantes : répondre à vos demandes de contact et de devis, traiter vos commandes et assurer le suivi de la livraison, vous envoyer des informations relatives à vos commandes en cours, améliorer nos services et l'expérience utilisateur sur notre site, vous envoyer notre newsletter (uniquement si vous vous êtes inscrit volontairement), gérer le programme de parrainage et le suivi des transactions de dépôt/retrait dans le portefeuille. Nous ne vendons, ne louons et ne partageons jamais vos données personnelles avec des tiers à des fins commerciales.</p>
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground text-base mb-2">4. Stockage et sécurité des données</h4>
                        <p>Vos données sont stockées localement dans votre navigateur (localStorage) pour les fonctionnalités du site telles que le panier, les préférences d'affichage et le programme de parrainage. Les données de contact et de commande sont traitées principalement via WhatsApp pour garantir une communication directe et sécurisée. Nous mettons en oeuvre des mesures de sécurité techniques et organisationnelles appropriées pour protéger vos données contre tout accès non autorisé, toute modification, divulgation ou destruction. Cependant, aucune méthode de transmission sur Internet n'est totalement sécurisée, et nous ne pouvons garantir une sécurité absolue.</p>
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground text-base mb-2">5. Cookies et technologies similaires</h4>
                        <p>Notre site utilise le stockage local du navigateur (localStorage) pour mémoriser vos préférences (mode sombre/clair), le contenu de votre panier, les données du programme de parrainage et les paramètres de navigation. Contrairement aux cookies traditionnels, le localStorage ne transmet pas de données à des serveurs externes à chaque requête. Les données stockées localement restent sur votre appareil et ne sont accessibles que par notre site web. Vous pouvez effacer ces données à tout moment via les paramètres de votre navigateur.</p>
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground text-base mb-2">6. Vos droits</h4>
                        <p>Conformément à la législation malienne en vigueur, vous disposez des droits suivants concernant vos données personnelles : droit d'accès (obtenir une copie de vos données), droit de rectification (corriger des données inexactes), droit de suppression (demander la suppression de vos données), droit d'opposition (vous opposer au traitement de vos données), droit à la portabilité (recevoir vos données dans un format structuré). Pour exercer ces droits, contactez-nous à contact@skdesignerluxe.com ou au +223 97 78 72 44. Nous répondrons à votre demande dans un délai de 30 jours.</p>
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground text-base mb-2">7. Services tiers</h4>
                        <p>Notre site peut contenir des liens vers des services tiers (WhatsApp de Meta, Instagram, Facebook, YouTube, TikTok). Ces services ont leurs propres politiques de confidentialité, que nous vous encourageons à consulter. SK Designer Luxe n'est pas responsable des pratiques de confidentialité de ces sites tiers. L'utilisation de Wave pour les paiements est soumise aux conditions générales de Wave (Wave Financial, Inc.), qui est un service de paiement tiers indépendant.</p>
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground text-base mb-2">8. Modifications de la politique</h4>
                        <p>Nous nous réservons le droit de modifier la présente politique de confidentialité à tout moment. Toute modification sera publiée sur cette page avec la date de mise à jour. Nous vous encourageons à consulter cette page régulièrement pour rester informé de tout changement. L'utilisation continue de notre site après la publication de modifications constitue votre acceptation de ces modifications.</p>
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground text-base mb-2">9. Contact</h4>
                        <p>Pour toute question concernant la présente politique de confidentialité ou pour exercer vos droits, veuillez nous contacter par email à contact@skdesignerluxe.com, par téléphone au +223 97 78 72 44, ou via le formulaire de contact disponible sur notre site. SK Designer Luxe, Bamako, République du Mali.</p>
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
                  a: "Tous les services sont actuellement gratuits. Pour les services payants à l'avenir, le paiement s'effectuera via l'application mobile Wave au numéro +223 97 78 72 44. C'est un moyen de paiement rapide, sécurisé et accessible à tous au Mali."
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
        {/* Back to top button with scroll progress */}
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
                Besoin d&apos;un service ? Une question ? Écrivez-nous directement et recevez une réponse en quelques minutes via WhatsApp.
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