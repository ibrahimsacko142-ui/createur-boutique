'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  Upload,
  ImageIcon,
  Wand2,
  Download,
  RotateCcw,
  Loader2,
  MessageCircle,
  Image as ImageLucide,
  Palette,
  User,
  Maximize,
  Monitor,
  ArrowRight,
  X,
  CheckCircle2,
  AlertCircle,
  Camera,
  Star,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'

const WHATSAPP_NUMBER = '22397787244'

const STYLES = [
  { id: 'apple_executive', label: 'Apple Executive', icon: '🎯', desc: 'Photo pro style Apple' },
  { id: 'apple_founder', label: 'Apple Founder', icon: '🍎', desc: 'Style fondateur tech' },
  { id: 'linkedin_exec', label: 'LinkedIn Pro', icon: '💼', desc: 'Photo profil LinkedIn' },
  { id: 'modern_fashion', label: 'Mode Moderne', icon: '📸', desc: 'Look fashion actuel' },
  { id: 'high_fashion', label: 'Haute Couture', icon: '✨', desc: 'Style luxe éditorial' },
  { id: 'urban_trend', label: 'Urban Trend', icon: '🏙️', desc: 'Style urbain streetwear' },
  { id: 'minimalist', label: 'Minimaliste', icon: '⬜', desc: 'Clean et épuré' },
  { id: 'lifestyle', label: 'Lifestyle', icon: '🌿', desc: 'Photo lifestyle naturel' },
  { id: 'studio_photo', label: 'Studio Photo', icon: '📷', desc: 'Studio professionnel' },
  { id: 'social_media', label: 'Social Media', icon: '📱', desc: 'Optimisé pour réseaux' },
  { id: 'street_style', label: 'Street Style', icon: '👟', desc: 'Street photography' },
  { id: 'luxury_fashion', label: 'Luxure', icon: '👑', desc: 'Mode de luxe premium' },
  { id: 'natural_light', label: 'Lumière Naturelle', icon: '☀️', desc: 'Éclairage naturel doux' },
  { id: 'christmas', label: 'Noël', icon: '🎄', desc: 'Thème fête de fin d\'année' },
  { id: 'graduation', label: 'Graduation', icon: '🎓', desc: 'Photo de diplôme' },
]

const GENDERS = [
  { id: 'male', label: 'Homme', icon: User },
  { id: 'female', label: 'Femme', icon: Star },
]

const RATIOS = [
  { id: '1:1', label: '1:1', desc: 'Carré' },
  { id: '4:3', label: '4:3', desc: 'Photo' },
  { id: '3:4', label: '3:4', desc: 'Portrait' },
  { id: '16:9', label: '16:9', desc: 'Paysage' },
  { id: '9:16', label: '9:16', desc: 'Story/Reel' },
]

const RESOLUTIONS = [
  { id: '1K', label: '1K', desc: 'Rapide' },
  { id: '2K', label: '2K', desc: 'Standard' },
  { id: '4K', label: '4K', desc: 'Ultra HD' },
]

type Mode = 'create' | 'edit'

export default function PhotoAIStudio() {
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [mode, setMode] = useState<Mode>('create')
  const [prompt, setPrompt] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [uploadedPreview, setUploadedPreview] = useState<string | null>(null)
  const [gender, setGender] = useState('male')
  const [style, setStyle] = useState('apple_executive')
  const [ratio, setRatio] = useState('1:1')
  const [resolution, setResolution] = useState('2K')
  const [loading, setLoading] = useState(false)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast({ title: 'Fichier invalide', description: 'Veuillez sélectionner une image.', variant: 'destructive' })
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      toast({ title: 'Fichier trop gros', description: 'Maximum 10 Mo autorisé.', variant: 'destructive' })
      return
    }
    setUploadedFile(file)
    setUploadedPreview(URL.createObjectURL(file))
    setImageUrl('')
    setError(null)
    setResultUrl(null)
  }

  const handleGenerate = async () => {
    setError(null)
    setResultUrl(null)

    if (mode === 'edit' && !imageUrl.trim()) {
      setError('Veuillez coller l\'URL publique de votre photo ci-dessus.')
      return
    }
    if (mode === 'create' && !prompt.trim()) {
      setError('Veuillez décrire l\'image souhaitée.')
      return
    }

    // In edit mode with uploaded file: warn that public URL is preferred
    if (mode === 'edit' && uploadedFile && !imageUrl.trim()) {
      setError('L\'upload de fichier local n\'est pas supporté en mode édition. Veuillez coller une URL d\'image publique ci-dessous (lien d\'une image hébergée sur Imgur, Google Drive public, etc.).')
      return
    }

    // Validate URL format in edit mode
    if (mode === 'edit' && imageUrl.trim()) {
      const urlStr = imageUrl.trim()
      if (!urlStr.startsWith('http://') && !urlStr.startsWith('https://')) {
        setError('L\'URL doit commencer par http:// ou https://')
        return
      }
    }

    setLoading(true)

    try {
      // Build the prompt: combine user text + style for edit mode
      let finalPrompt = prompt.trim()
      if (mode === 'edit' && style) {
        const styleObj = STYLES.find(s => s.id === style)
        if (styleObj && finalPrompt) {
          finalPrompt = `${finalPrompt}, ${styleObj.desc}, ${gender === 'male' ? 'male' : 'female'} subject`
        } else if (styleObj) {
          finalPrompt = `${styleObj.desc} photo, ${gender === 'male' ? 'male' : 'female'} subject, professional studio quality`
        }
      } else if (mode === 'create' && !finalPrompt && style) {
        // Auto-build prompt from style for create mode
        const styleObj = STYLES.find(s => s.id === style)
        if (styleObj) {
          finalPrompt = `${styleObj.desc}, ${gender === 'male' ? 'male' : 'female'} subject, professional studio quality`
        }
      }

      const formData = new FormData()
      formData.append('text', finalPrompt || 'professional photo')
      formData.append('ratio', ratio)
      formData.append('res', resolution)

      if (mode === 'edit' && imageUrl.trim()) {
        formData.append('links', imageUrl.trim())
      }

      const apiRes = await fetch('/api/photo-ai', {
        method: 'POST',
        body: formData,
      })

      const data = await apiRes.json()

      if (data.success && data.url) {
        setResultUrl(data.url)
        toast({ title: 'Image générée !', description: 'Votre photo AI est prête.' })
      } else {
        setError(data.error || 'Erreur lors de la génération. Réessayez.')
      }
    } catch (err) {
      setError('Erreur de connexion au serveur. Réessayez.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setPrompt('')
    setImageUrl('')
    setUploadedFile(null)
    setUploadedPreview(null)
    setResultUrl(null)
    setError(null)
    setMode('create')
    setStyle('apple_executive')
    setGender('male')
    setRatio('1:1')
    setResolution('2K')
  }

  const orderViaWhatsApp = () => {
    const styleLabel = STYLES.find(s => s.id === style)?.label || style
    const msg = mode === 'create'
      ? `Bonjour Sacko ! Je veux une image AI créée avec le style "${styleLabel}" (${ratio}, ${resolution}). Prompt : ${prompt}`
      : `Bonjour Sacko ! Je veux transformer ma photo en style "${styleLabel}" (${ratio}, ${resolution}). J'ai une image à envoyer.`
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer')
  }

  // Compute aspect ratio class for preview
  const ratioClass: Record<string, string> = {
    '1:1': 'aspect-square',
    '4:3': 'aspect-[4/3]',
    '3:4': 'aspect-[3/4]',
    '16:9': 'aspect-video',
    '9:16': 'aspect-[9/16]',
  }

  return (
    <section id="photo-ai" className="py-16 sm:py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Badge variant="secondary" className="mb-4 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200">
            <Camera className="h-3 w-3 mr-1.5" /> Nouveau
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Photo AI{' '}
            <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-amber-500 bg-clip-text text-transparent">
              Studio
            </span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Transformez n&apos;importe quelle photo en image professionnelle grâce à l&apos;IA.
            Photo de profil LinkedIn, style Apple, mode luxe — en un clic.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* ── LEFT: Controls ── */}
          <div className="lg:col-span-3 space-y-5">
            {/* Mode Toggle */}
            <div className="flex rounded-xl bg-muted p-1">
              {([
                { id: 'create' as Mode, label: 'Créer une image', icon: Wand2, desc: 'Texte vers image' },
                { id: 'edit' as Mode, label: 'Transformer une photo', icon: ImageLucide, desc: 'Éditer une image' },
              ]).map((m) => (
                <button
                  key={m.id}
                  onClick={() => { setMode(m.id); setError(null); setResultUrl(null) }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-semibold transition-all ${
                    mode === m.id
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <m.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{m.label}</span>
                  <span className="sm:hidden">{m.desc}</span>
                </button>
              ))}
            </div>

            {/* Prompt */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold flex items-center gap-1.5">
                {mode === 'create' ? <Sparkles className="h-3.5 w-3.5 text-purple-500" /> : <Palette className="h-3.5 w-3.5 text-pink-500" />}
                {mode === 'create' ? 'Décrivez votre image' : 'Instructions de transformation (optionnel)'}
              </Label>
              <textarea
                className="w-full rounded-xl border bg-background px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 transition-all placeholder:text-muted-foreground/60"
                rows={3}
                placeholder={
                  mode === 'create'
                    ? "Ex: Un homme d'affaires africain en costume bleu marine, fond blanc, éclairage studio professionnel..."
                    : "Ex: Rends le fond flou, ajoute un éclairage professionnel, style portrait corporate..."
                }
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>

            {/* Image URL (edit mode) */}
            <AnimatePresence>
              {mode === 'edit' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold flex items-center gap-1.5">
                      <Upload className="h-3.5 w-3.5 text-amber-500" /> URL de votre photo
                    </Label>

                    {/* URL input — primary method */}
                    <div className="relative">
                      <Input
                        placeholder="https://example.com/votre-photo.jpg"
                        value={imageUrl}
                        onChange={(e) => { setImageUrl(e.target.value); if (e.target.value.trim()) { setUploadedFile(null); setUploadedPreview(null) } }}
                        className="pr-10 text-sm"
                      />
                      <ImageIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>

                    {/* Aperçu de l'URL */}
                    <AnimatePresence>
                      {imageUrl.trim() && !uploadedPreview && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="relative rounded-xl border bg-muted/30 p-2">
                            <img
                              src={imageUrl.trim()}
                              alt="Aperçu URL"
                              className="max-h-40 mx-auto rounded-lg object-contain"
                              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                              onLoad={(e) => { (e.target as HTMLImageElement).style.display = 'block' }}
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Help text */}
                    <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30">
                      <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                      <p className="text-[11px] text-amber-700 dark:text-amber-400 leading-relaxed">
                        Collez le <strong>lien public</strong> de votre photo (hébergée sur Imgur, Google Photos, Dropbox, etc.). 
                        L&apos;URL doit commencer par <code className="bg-amber-100 dark:bg-amber-900/30 px-1 rounded">https://</code> et pointer directement vers une image (.jpg, .png, .webp).
                      </p>
                    </div>

                    {/* Upload area — for local preview only */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-border hover:border-purple-300 dark:hover:border-purple-700 bg-muted/20 text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {uploadedPreview ? (
                          <>
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                            <span>Image sélectionnée (aperçu uniquement — utilisez l&apos;URL ci-dessus pour la transformation)</span>
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); setUploadedFile(null); setUploadedPreview(null) }}
                              className="ml-1 text-red-400 hover:text-red-600"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </>
                        ) : (
                          <>
                            <ImageIcon className="h-4 w-4" />
                            <span>Sélectionner un fichier local (aperçu visuel uniquement)</span>
                          </>
                        )}
                      </button>
                      {uploadedPreview && (
                        <div className="mt-2 rounded-lg overflow-hidden border">
                          <img src={uploadedPreview} alt="Aperçu local" className="max-h-32 mx-auto object-contain" />
                        </div>
                      )}
                      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Style Grid */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold flex items-center gap-1.5">
                <Palette className="h-3.5 w-3.5 text-amber-500" /> Style
              </Label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 max-h-48 overflow-y-auto pr-1">
                {STYLES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setStyle(s.id)}
                    className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border text-center transition-all hover:shadow-md ${
                      style === s.id
                        ? 'border-purple-400 bg-purple-50 dark:bg-purple-900/20 shadow-sm'
                        : 'border-border hover:border-purple-200 dark:hover:border-purple-800'
                    }`}
                  >
                    <span className="text-lg">{s.icon}</span>
                    <span className="text-[10px] font-semibold leading-tight line-clamp-2">{s.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Gender + Ratio + Resolution — inline row */}
            <div className="grid grid-cols-3 gap-4">
              {/* Gender */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold flex items-center gap-1">
                  <User className="h-3 w-3" /> Genre
                </Label>
                <div className="flex rounded-lg border bg-muted/30 p-0.5">
                  {GENDERS.map((g) => (
                    <button
                      key={g.id}
                      onClick={() => setGender(g.id)}
                      className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-md text-[11px] font-semibold transition-all ${
                        gender === g.id
                          ? 'bg-background text-foreground shadow-sm'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {g.id === 'male' ? '♂' : '♀'} {g.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ratio */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold flex items-center gap-1">
                  <Maximize className="h-3 w-3" /> Format
                </Label>
                <div className="flex flex-wrap gap-1">
                  {RATIOS.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => setRatio(r.id)}
                      className={`px-2 py-1.5 rounded-md text-[10px] font-bold transition-all ${
                        ratio === r.id
                          ? 'bg-purple-500 text-white shadow-sm'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Resolution */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold flex items-center gap-1">
                  <Monitor className="h-3 w-3" /> Qualité
                </Label>
                <div className="flex gap-1">
                  {RESOLUTIONS.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => setResolution(r.id)}
                      className={`flex-1 py-1.5 rounded-md text-[10px] font-bold transition-all ${
                        resolution === r.id
                          ? 'bg-amber-500 text-white shadow-sm'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <Button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-purple-500 via-pink-500 to-amber-500 hover:from-purple-600 hover:via-pink-600 hover:to-amber-600 text-white font-bold text-sm shadow-lg shadow-purple-500/20 disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> Génération en cours...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Wand2 className="h-4 w-4" />
                  {mode === 'create' ? 'Générer l\'image' : 'Transformer la photo'}
                </span>
              )}
            </Button>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-start gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                >
                  <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-red-700 dark:text-red-400">{error}</p>
                    <p className="text-[10px] text-red-500 mt-1">
                      Besoin d&apos;aide ?{' '}
                      <a
                        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Bonjour ! L\'outil Photo AI Studio affiche une erreur. Pouvez-vous m\'aider ?')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold underline"
                      >
                        Contactez Sacko sur WhatsApp
                      </a>
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── RIGHT: Preview ── */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 space-y-4">
              {/* Result / Preview Card */}
              <Card className="overflow-hidden border-2 border-dashed border-border">
                <CardContent className="p-0">
                  <div className={`relative bg-muted/30 flex items-center justify-center ${ratioClass[ratio] || 'aspect-square'} min-h-[280px] max-h-[420px]`}>
                    {loading ? (
                      <div className="flex flex-col items-center gap-3">
                        <div className="relative">
                          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 animate-pulse" />
                          <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-amber-500 animate-bounce" />
                        </div>
                        <p className="text-xs text-muted-foreground font-medium">Création magique en cours...</p>
                        <div className="w-32 h-1 rounded-full bg-muted overflow-hidden">
                          <div className="h-full w-1/2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-[loading_1.5s_ease-in-out_infinite]" />
                        </div>
                      </div>
                    ) : resultUrl ? (
                      <img
                        src={resultUrl}
                        alt="Résultat AI"
                        className="w-full h-full object-contain"
                      />
                    ) : (imageUrl.trim() && mode === 'edit') ? (
                      <div className="relative w-full h-full">
                        <img
                          src={imageUrl.trim()}
                          alt="Photo source"
                          className="w-full h-full object-contain"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                        />
                        <div className="absolute bottom-2 left-2">
                          <Badge variant="secondary" className="text-[9px] bg-black/60 text-white border-0 backdrop-blur-sm">
                            Photo originale
                          </Badge>
                        </div>
                      </div>
                    ) : uploadedPreview && mode === 'edit' ? (
                      <div className="relative w-full h-full">
                        <img src={uploadedPreview} alt="Aperçu local" className="w-full h-full object-contain" />
                        <div className="absolute bottom-2 left-2 flex gap-1">
                          <Badge variant="secondary" className="text-[9px] bg-amber-500/90 text-white border-0 backdrop-blur-sm">
                            Aperçu local
                          </Badge>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-3 text-center p-6">
                        <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center">
                          <ImageLucide className="h-8 w-8 text-muted-foreground/40" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-muted-foreground/60">Aperçu</p>
                          <p className="text-[11px] text-muted-foreground/40 mt-0.5">
                            {mode === 'create'
                              ? 'Votre image apparaîtra ici'
                              : 'Collez une URL pour voir l\'aperçu'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Result actions */}
                  {resultUrl && (
                    <div className="p-3 border-t bg-muted/20 flex items-center gap-2">
                      <a
                        href={resultUrl}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition-colors"
                      >
                        <Download className="h-3.5 w-3.5" /> Télécharger
                      </a>
                      <button
                        onClick={handleGenerate}
                        className="px-3 py-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs font-bold hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={orderViaWhatsApp}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
                      >
                        <MessageCircle className="h-3.5 w-3.5" /> Commander
                      </button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Info card */}
              <Card className="p-4 bg-gradient-to-br from-purple-50 to-amber-50 dark:from-purple-950/20 dark:to-amber-950/20 border-purple-100 dark:border-purple-900/30">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="h-4 w-4 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">Comment ça marche ?</p>
                    <ol className="mt-1.5 space-y-1 text-[11px] text-muted-foreground list-decimal list-inside">
                      <li>{mode === 'create' ? 'Décrivez l\'image' : 'Uploadez votre photo'}</li>
                      <li>Choisissez le style, format et qualité</li>
                      <li>Cliquez sur Générer</li>
                      <li>Téléchargez ou commandez via WhatsApp</li>
                    </ol>
                  </div>
                </div>
              </Card>

              {/* Reset */}
              {resultUrl && (
                <button
                  onClick={handleReset}
                  className="w-full flex items-center justify-center gap-2 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <RotateCcw className="h-3 w-3" /> Nouvelle génération
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}