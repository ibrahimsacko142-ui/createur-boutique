'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  Copy,
  Check,
  Send,
  Loader2,
  MessageSquare,
  RefreshCw,
  Zap,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'

const messageTypes = [
  { key: 'promo', label: 'Promotion', emoji: '🔥', desc: 'Lancer une offre' },
  { key: 'suivi', label: 'Suivi client', emoji: '🤝', desc: 'Relance après achat' },
  { key: 'contact', label: 'Prise de contact', emoji: '👋', desc: 'Nouveau prospect' },
  { key: 'felicitation', label: 'Remerciement', emoji: '🎉', desc: 'Client fidèle' },
  { key: 'rappel', label: 'Rappel', emoji: '⏰', desc: 'Rendez-vous' },
  { key: 'collab', label: 'Collaboration', emoji: '🤝', desc: 'Partenariat pro' },
  { key: 'relance', label: 'Relance vente', emoji: '💼', desc: 'Conclure une vente' },
]

const tones = [
  { key: 'pro', label: 'Professionnel', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
  { key: 'ami', label: 'Amical', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' },
  { key: 'urgent', label: 'Urgent', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' },
  { key: 'chaleureux', label: 'Chaleureux', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' },
]

export default function WhatsAppGenerator() {
  const { toast } = useToast()
  const [type, setType] = useState('promo')
  const [business, setBusiness] = useState('')
  const [detail, setDetail] = useState('')
  const [tone, setTone] = useState('pro')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  async function generate() {
    if (!business.trim()) {
      toast({ title: 'Champ requis', description: 'Entrez le nom de votre business.', variant: 'destructive' })
      return
    }
    setLoading(true)
    setResult('')
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, business: business.trim(), detail: detail.trim(), tone }),
      })
      const data = await res.json()
      if (data.error) {
        toast({ title: 'Erreur', description: data.error, variant: 'destructive' })
      } else {
        setResult(data.message)
      }
    } catch {
      toast({ title: 'Erreur réseau', description: 'Vérifiez votre connexion.', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  function copyToClipboard() {
    if (!result) return
    navigator.clipboard.writeText(result)
    setCopied(true)
    toast({ title: 'Copié !', description: 'Message copié dans le presse-papiers.' })
    setTimeout(() => setCopied(false), 2000)
  }

  function sendWhatsApp() {
    if (!result) return
    window.open(`https://wa.me/?text=${encodeURIComponent(result)}`, '_blank')
  }

  const encodedMsg = result ? encodeURIComponent(result) : ''

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* ── LEFT: Form ── */}
      <Card className="border-0 shadow-xl">
        <CardContent className="p-6 space-y-5">
          <div>
            <Label className="text-sm font-semibold mb-2 block">Type de message</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {messageTypes.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setType(t.key)}
                  className={`flex flex-col items-center gap-0.5 rounded-xl p-2.5 text-center border transition-all duration-200 ${
                    type === t.key
                      ? 'bg-emerald-50 border-emerald-400 dark:bg-emerald-900/20 dark:border-emerald-600 shadow-sm'
                      : 'border-border hover:border-emerald-300 dark:hover:border-emerald-700'
                  }`}
                >
                  <span className="text-lg">{t.emoji}</span>
                  <span className="text-xs font-semibold leading-tight">{t.label}</span>
                  <span className="text-[10px] text-muted-foreground">{t.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold">Nom de votre business *</Label>
            <Input
              placeholder="Ex: MonBoutique Mali, Sacko Design..."
              value={business}
              onChange={(e) => setBusiness(e.target.value)}
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold">Détail (optionnel)</Label>
            <Input
              placeholder="Ex: Promotion -50%, Rendez-vous mardi, Nouveau produit..."
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              className="h-11"
            />
          </div>

          <div>
            <Label className="text-sm font-semibold mb-2 block">Ton du message</Label>
            <div className="flex flex-wrap gap-2">
              {tones.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTone(t.key)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 border ${
                    tone === t.key
                      ? `${t.color} border-current shadow-sm scale-105`
                      : 'bg-muted/50 text-muted-foreground border-transparent hover:bg-muted'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <Button
            onClick={generate}
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold h-12 text-sm shadow-lg shadow-emerald-500/20"
          >
            {loading ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Génération en cours...</>
            ) : (
              <><Sparkles className="h-4 w-4 mr-2" /> Générer mon message</>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* ── RIGHT: Result ── */}
      <Card className="border-0 shadow-xl">
        <CardContent className="p-6 h-full flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-green-500 flex items-center justify-center">
                <MessageSquare className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-sm">Aperçu du message</span>
            </div>
            <Badge variant="secondary" className="text-[10px]">WhatsApp</Badge>
          </div>

          {/* WhatsApp-style bubble */}
          <div className="flex-1 bg-[#0b141a] rounded-2xl p-4 sm:p-5 min-h-[200px] flex items-start">
            <div className="bg-[#005c4b] rounded-xl rounded-tl-sm p-3.5 sm:p-4 max-w-full w-full">
              <AnimatePresence mode="wait">
                {result ? (
                  <motion.div
                    key={result}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-white text-sm leading-relaxed whitespace-pre-wrap break-words"
                  >
                    {result}
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0.4 }}
                    animate={{ opacity: 0.6 }}
                    className="text-white/40 text-sm italic"
                  >
                    Votre message généré par IA apparaîtra ici...
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-4">
            <Button
              variant="outline"
              onClick={copyToClipboard}
              disabled={!result}
              className="flex-1 h-11 text-sm font-semibold"
            >
              {copied ? <><Check className="h-4 w-4 mr-1.5 text-emerald-500" /> Copié</> : <><Copy className="h-4 w-4 mr-1.5" /> Copier</>}
            </Button>
            <a
              href={result ? `https://wa.me/?text=${encodedMsg}` : '#'}
              target={result ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="flex-1"
            >
              <Button
                disabled={!result}
                className="w-full bg-[#25D366] hover:bg-[#1da851] text-white font-bold h-11 text-sm shadow-lg shadow-green-500/20"
              >
                <Send className="h-4 w-4 mr-1.5" /> Ouvrir WhatsApp
              </Button>
            </a>
            <Button
              variant="ghost"
              size="icon"
              onClick={generate}
              disabled={loading || !business.trim()}
              className="h-11 w-11 flex-shrink-0"
              title="Regénérer"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}