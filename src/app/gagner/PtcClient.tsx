'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Eye, Clock, Wallet, Play, CheckCircle2, ShieldCheck, MessageCircle,
  ChevronRight, ArrowLeft, Loader2, Phone, Zap, TrendingUp,
  Info, Copy, Users, Gift, ArrowRight, ExternalLink, Flag, X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AdsterraBanner from '@/components/AdsterraBanner'

const SITE_URL = 'https://createur-boutique.vercel.app'
import AdBanner from '@/components/AdBanner'
const TIMER_SECONDS = 30
const EARN_PER_VIEW = 1
const REFERRAL_BONUS_NEW = 10
const REFERRAL_BONUS_REFERRER = 5

export default function PtcPage() {
  const { toast } = useToast()
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [generatedOtp, setGeneratedOtp] = useState('')
  const [step, setStep] = useState<'login' | 'otp' | 'ready'>('login')
  const [countdown, setCountdown] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [balance, setBalance] = useState(0)
  const [totalViewed, setTotalViewed] = useState(0)
  const [claiming, setClaiming] = useState(false)
  const [sendingOtp, setSendingOtp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [referralCode, setReferralCode] = useState('')
  const [referredBy, setReferredBy] = useState('')
  const [referralCount, setReferralCount] = useState(0)
  const [referralEarnings, setReferralEarnings] = useState(0)
  const [showReferralInput, setShowReferralInput] = useState(false)
  const [refInput, setRefInput] = useState('')
  const [applyingRef, setApplyingRef] = useState(false)
  const [copied, setCopied] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const referralLink = `${SITE_URL}/gagner?ref=${referralCode}`

  const fetchBalance = useCallback(async () => {
    if (!phone) return
    try {
      const res = await fetch(`/api/ptc/balance?phone=${encodeURIComponent(phone)}`)
      const data = await res.json()
      if (data.success) {
        setBalance(data.balance)
        setTotalViewed(data.totalViewed)
        if (data.referralCode) setReferralCode(data.referralCode)
        if (data.referredBy) setReferredBy(data.referredBy)
        if (data.referralCount !== undefined) setReferralCount(data.referralCount)
        if (data.referralEarnings !== undefined) setReferralEarnings(data.referralEarnings)
      }
    } catch {}
  }, [phone])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const ref = params.get('ref')
    if (ref) {
      setRefInput(ref)
      setShowReferralInput(true)
    }
  }, [])

  useEffect(() => {
    return () => { if (intervalRef.current) clearTimeout(intervalRef.current) }
  }, [])

  useEffect(() => {
    if (isTimerRunning && countdown > 0) {
      intervalRef.current = setTimeout(() => setCountdown(c => c - 1), 1000)
    } else if (isTimerRunning && countdown === 0) {
      setIsTimerRunning(false)
    }
    return () => { if (intervalRef.current) clearTimeout(intervalRef.current) }
  }, [isTimerRunning, countdown])

  const handleSendOtp = async () => {
    if (!phone || phone.replace(/\s/g, '').length < 8) {
      toast({ title: 'Numéro invalide', description: 'Entrez votre numéro.', variant: 'destructive' })
      return
    }
    setSendingOtp(true)
    try {
      // Create user first
      await fetch('/api/ptc/balance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: `+${phone.replace(/\s/g, '')}` }),
      })
      // Generate OTP locally
      const code = Math.floor(100000 + Math.random() * 900000).toString()
      setGeneratedOtp(code)
      setOtp('')
      setStep('otp')
      toast({ title: 'Code généré !', description: `Votre code est : ${code}` })
    } catch {
      toast({ title: 'Erreur', description: 'Problème de connexion.', variant: 'destructive' })
    }
    setSendingOtp(false)
  }

  const handleVerifyOtp = async () => {
    if (otp !== generatedOtp) {
      toast({ title: 'Code incorrect', description: 'Le code ne correspond pas.', variant: 'destructive' })
      return
    }
    setLoading(true)
    try {
      await fetchBalance()
      setStep('ready')
      toast({ title: 'Bienvenue !', description: 'Vous pouvez maintenant gagner de l\'argent.' })
    } catch {
      toast({ title: 'Erreur', description: 'Problème de connexion.', variant: 'destructive' })
    }
    setLoading(false)
  }

  const handleWatchAd = (adUrl: string) => {
    window.open(adUrl, '_blank')
    setCountdown(TIMER_SECONDS)
    setIsTimerRunning(true)
  }

  const handleClaim = async () => {
    setClaiming(true)
    try {
      const res = await fetch('/api/ptc/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      })
      const data = await res.json()
      if (data.success) {
        setBalance(data.newBalance)
        setTotalViewed(data.totalViewed)
        toast({ title: `+${EARN_PER_VIEW} FCFA gagné !`, description: `Nouveau solde : ${data.newBalance} FCFA` })
      } else {
        toast({ title: 'Pas encore...', description: data.error || 'Réessayez.', variant: 'destructive' })
        if (data.waitSeconds) {
          setCountdown(data.waitSeconds)
          setIsTimerRunning(true)
        }
      }
    } catch {
      toast({ title: 'Erreur', description: 'Problème de connexion.', variant: 'destructive' })
    }
    setClaiming(false)
  }

  const handleApplyReferral = async () => {
    if (!refInput.trim()) {
      toast({ title: 'Code vide', description: 'Entrez un code de parrainage.', variant: 'destructive' })
      return
    }
    setApplyingRef(true)
    try {
      const res = await fetch('/api/ptc/referral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, referralCode: refInput.trim() }),
      })
      const data = await res.json()
      if (data.success) {
        setReferredBy(refInput.trim())
        setBalance(data.newBalance)
        setShowReferralInput(false)
        toast({ title: 'Parrainage appliqué !', description: data.message })
        fetchBalance()
      } else {
        toast({ title: 'Erreur', description: data.error || 'Code invalide.', variant: 'destructive' })
      }
    } catch {
      toast({ title: 'Erreur', description: 'Problème de connexion.', variant: 'destructive' })
    }
    setApplyingRef(false)
  }

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    toast({ title: 'Lien copié !', description: 'Partagez-le avec vos amis.' })
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50 dark:from-emerald-950/20 dark:via-cyan-950/10 dark:to-blue-950/20">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-1/4 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-cyan-400/10 rounded-full blur-3xl" />
          </div>
          <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Badge className="mb-4 px-3 py-1 text-xs font-medium bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800">
                <Zap className="h-3 w-3 mr-1" /> Gagnez de l&apos;argent
              </Badge>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
                Regardez des pubs,{' '}
                <span className="bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 bg-clip-text text-transparent">
                  gagnez de l&apos;argent
                </span>
              </h1>
              <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
                Chaque pub regardée vous rapporte <strong className="text-foreground">{EARN_PER_VIEW} FCFA</strong>.
                Parrainez vos amis et gagnez <strong className="text-foreground">{REFERRAL_BONUS_NEW} FCFA</strong> par filleul.
                Retrait via Orange Money ou Wave.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Main Content */}
        <section className="mx-auto max-w-md px-4 sm:px-6 py-8">
          <AnimatePresence mode="wait">

            {/* ═══ LOGIN ═══ */}
            {step === 'login' && (
              <motion.div key="login" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
                <Card className="border-0 shadow-2xl overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 p-1">
                    <div className="bg-gradient-to-br from-emerald-500 to-cyan-600 text-white p-6 text-center">
                      <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm mb-3">
                        <Phone className="h-7 w-7" />
                      </div>
                      <h2 className="text-xl font-extrabold">Connectez-vous</h2>
                      <p className="text-sm text-white/80 mt-1">Entrez votre numéro pour recevoir le code</p>
                    </div>
                  </div>
                  <CardContent className="p-6 space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold">Numéro WhatsApp *</label>
                      <div className="flex gap-2">
                        <div className="flex h-11 items-center px-3 rounded-md border border-input bg-muted text-sm font-medium text-muted-foreground">
                          +223
                        </div>
                        <Input
                          placeholder="XX XX XX XX"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value.replace(/[^\d\s]/g, ''))}
                          className="h-11 flex-1"
                          type="tel"
                          maxLength={12}
                        />
                      </div>
                    </div>

                    {showReferralInput && (
                      <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                        <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 mb-1 flex items-center gap-1">
                          <Gift className="h-3 w-3" /> Code parrainage détecté
                        </p>
                        <p className="text-[11px] text-blue-600 dark:text-blue-400">
                          Vous avez été invité par un parrain. Il sera appliqué après connexion.
                        </p>
                      </div>
                    )}

                    <Button
                      onClick={handleSendOtp}
                      disabled={sendingOtp || phone.replace(/\s/g, '').length < 8}
                      className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-bold h-12"
                    >
                      {sendingOtp ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <MessageCircle className="h-4 w-4 mr-2" />}
                      Envoyer le code WhatsApp
                    </Button>

                    <div className="flex items-center gap-3 text-center">
                      <div className="flex-1 h-px bg-border" />
                      <span className="text-[10px] text-muted-foreground font-medium">100% GRATUIT</span>
                      <div className="flex-1 h-px bg-border" />
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/20">
                        <p className="text-sm font-black text-emerald-600">{EARN_PER_VIEW} F</p>
                        <p className="text-[10px] text-muted-foreground">par vue</p>
                      </div>
                      <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                        <p className="text-sm font-black text-blue-600">{REFERRAL_BONUS_NEW} F</p>
                        <p className="text-[10px] text-muted-foreground">par filleul</p>
                      </div>
                      <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/20">
                        <p className="text-sm font-black text-amber-600">500 F</p>
                        <p className="text-[10px] text-muted-foreground">retrait min</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* ═══ PUB sous login ═══ */}
                <AdsterraBanner className="mt-2" />
              </motion.div>
            )}

            {/* ═══ OTP ═══ */}
            {step === 'otp' && (
              <motion.div key="otp" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
                <Card className="border-0 shadow-2xl overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-1">
                    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-6 text-center">
                      <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm mb-3">
                        <ShieldCheck className="h-7 w-7" />
                      </div>
                      <h2 className="text-xl font-extrabold">Votre code de vérification</h2>
                      <p className="text-sm text-white/80 mt-1">Copiez ce code et entrez-le ci-dessous</p>
                    </div>
                  </div>
                  <CardContent className="p-6 space-y-4">
                    {/* CODE AFFICHÉ EN GRAND */}
                    <div className="text-center py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-2 border-dashed border-blue-300 dark:border-blue-700">
                      <p className="text-[10px] text-muted-foreground font-medium mb-1 uppercase tracking-wider">Votre code</p>
                      <p className="text-4xl sm:text-5xl font-black tracking-[0.3em] text-blue-600 dark:text-blue-400 select-all">
                        {generatedOtp}
                      </p>
                      <Button
                        onClick={() => { navigator.clipboard.writeText(generatedOtp); toast({ title: 'Code copié !' }) }}
                        variant="ghost"
                        size="sm"
                        className="mt-3 text-xs text-blue-600 dark:text-blue-400"
                      >
                        <Copy className="h-3 w-3 mr-1" /> Copier le code
                      </Button>
                    </div>

                    {/* Champ pour entrer le code */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold">Entrez le code ici</label>
                      <Input
                        placeholder="Entrez le code à 6 chiffres"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/[^\d]/g, '').slice(0, 6))}
                        className="h-14 text-center text-2xl font-bold tracking-[0.5em]"
                        maxLength={6}
                        type="tel"
                      />
                    </div>

                    <Button
                      onClick={handleVerifyOtp}
                      disabled={loading || otp.length !== 6}
                      className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-bold h-12"
                    >
                      {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <CheckCircle2 className="h-4 w-4 mr-2" />}
                      Vérifier et continuer
                    </Button>

                    <button onClick={() => setStep('login')} className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 mx-auto">
                      <ArrowLeft className="h-3 w-3" /> Changer de numéro
                    </button>
                  </CardContent>
                </Card>

                {/* ═══ PUB sous OTP ═══ */}
                <AdBanner />
              </motion.div>
            )}

            {/* ═══ DASHBOARD ═══ */}
            {step === 'ready' && (
              <motion.div key="ready" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-4">

                {/* ═══ BANNIÈRE PUB 1 - Au-dessus des stats ═══ */}
                <AdsterraBanner className="mb-2" />

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2">
                  <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-cyan-50 dark:from-emerald-950/20 dark:to-cyan-950/20">
                    <CardContent className="p-3 text-center">
                      <Wallet className="h-5 w-5 text-emerald-500 mx-auto mb-1" />
                      <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">{balance}</p>
                      <p className="text-[10px] text-muted-foreground font-medium">FCFA</p>
                    </CardContent>
                  </Card>
                  <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
                    <CardContent className="p-3 text-center">
                      <Eye className="h-5 w-5 text-blue-500 mx-auto mb-1" />
                      <p className="text-xl font-black text-blue-600 dark:text-blue-400">{totalViewed}</p>
                      <p className="text-[10px] text-muted-foreground font-medium">Vues</p>
                    </CardContent>
                  </Card>
                  <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
                    <CardContent className="p-3 text-center">
                      <Users className="h-5 w-5 text-amber-500 mx-auto mb-1" />
                      <p className="text-xl font-black text-amber-600 dark:text-amber-400">{referralCount}</p>
                      <p className="text-[10px] text-muted-foreground font-medium">Filleuls</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Pubs rémunérées */}
                <Card className="border-0 shadow-2xl overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 p-1">
                    <div className="bg-gradient-to-br from-emerald-500 to-cyan-600 text-white p-5 text-center">
                      <h2 className="text-xl font-extrabold mb-0.5">PUBLICITÉS RÉMUNÉRÉES</h2>
                      <p className="text-white/80 text-xs">Regardez, gagnez.</p>
                      <div className="flex items-center justify-center gap-5 mt-3">
                        <div><p className="text-[10px] text-white/60">PAR VUE</p><p className="text-lg font-black">{EARN_PER_VIEW} F</p></div>
                        <div className="w-px h-8 bg-white/20" />
                        <div><p className="text-[10px] text-white/60">VUES</p><p className="text-lg font-black">{totalViewed}</p></div>
                        <div className="w-px h-8 bg-white/20" />
                        <div><p className="text-[10px] text-white/60">GAGNÉ</p><p className="text-lg font-black">{balance} F</p></div>
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-5 space-y-3">
                    {isTimerRunning && (
                      <div className="text-center space-y-2">
                        <p className="text-xs font-medium text-muted-foreground">La pub est ouverte dans un autre onglet...</p>
                        <div className="relative w-20 h-20 mx-auto">
                          <svg className="w-20 h-20 -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="6" fill="none" className="text-muted/20" />
                            <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="6" fill="none" className="text-emerald-500" strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 42}`} strokeDashoffset={`${2 * Math.PI * 42 * (1 - countdown / TIMER_SECONDS)}`} style={{ transition: 'stroke-dashoffset 1s linear' }} />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xl font-black">{countdown}</span>
                          </div>
                        </div>
                        <p className="text-[10px] text-muted-foreground">Secondes restantes</p>
                      </div>
                    )}

                    {!isTimerRunning && countdown === 0 && (
                      <div className="space-y-2">
                        {claiming ? (
                          <Button disabled className="w-full h-13 text-sm font-bold bg-muted text-muted-foreground">
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Vérification...
                          </Button>
                        ) : (
                          <Button onClick={handleClaim} className="w-full h-13 text-sm font-bold bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white shadow-lg shadow-emerald-500/25">
                            <CheckCircle2 className="h-4 w-4 mr-2" /> Réclamer +{EARN_PER_VIEW} FCFA
                          </Button>
                        )}
                        <div className="space-y-1.5">
                          {AD_LINKS.map((ad, i) => (
                            <Button
                              key={i}
                              onClick={() => handleWatchAd(ad.url)}
                              variant="outline"
                              className="w-full h-11 text-xs font-semibold border-2 border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/20"
                            >
                              <Play className="h-3.5 w-3.5 mr-1.5" /> Regarder {ad.name} &middot; +{EARN_PER_VIEW} FCFA
                              <ExternalLink className="h-3 w-3 ml-auto" />
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}

                    {!isTimerRunning && countdown > 0 && (
                      <Button onClick={() => handleWatchAd(AD_LINKS[0].url)} className="w-full h-13 text-sm font-bold bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg shadow-orange-500/25">
                        <Play className="h-4 w-4 mr-2" /> Regarder une pub &middot; +{EARN_PER_VIEW} FCFA
                      </Button>
                    )}

                    <div className="p-3 rounded-xl bg-muted/50 border">
                      <p className="text-[11px] font-bold mb-1.5 flex items-center gap-1">
                        <Info className="h-3 w-3 text-blue-500" /> Comment ça marche ?
                      </p>
                      <ol className="space-y-1 text-[10px] text-muted-foreground leading-relaxed">
                        <li className="flex items-start gap-1.5"><span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[9px] font-bold flex-shrink-0 mt-0.5">1</span> Cliquez sur &laquo; Regarder une pub &raquo;.</li>
                        <li className="flex items-start gap-1.5"><span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[9px] font-bold flex-shrink-0 mt-0.5">2</span> Laissez la pub ouverte 30 secondes.</li>
                        <li className="flex items-start gap-1.5"><span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[9px] font-bold flex-shrink-0 mt-0.5">3</span> Revenez ici et cliquez &laquo; Réclamer &raquo;.</li>
                      </ol>
                    </div>

                    <a
                      href="https://wa.me/22397787244?text=Bonjour%20!%20Je%20veux%20cr%C3%A9er%20ma%20propre%20campagne%20publicitaire."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 text-[11px] text-cyan-600 dark:text-cyan-400 font-semibold hover:underline pt-1"
                    >
                      <Flag className="h-3 w-3" /> Créer votre propre campagne publicitaire <ChevronRight className="h-3 w-3" />
                    </a>
                  </CardContent>
                </Card>

                {/* ═══ BANNIÈRE PUB 2 - Grand format ═══ */}
                <AdBanner />

                {/* ═══ ADSTERRA BANNIÈRE ═══ */}
                <div className="rounded-xl overflow-hidden border bg-white dark:bg-zinc-900 p-0">
                  <div className="text-[9px] text-center text-muted-foreground py-1 bg-muted/30 border-b font-medium uppercase tracking-wider">Sponsorise</div>
                  <AdsterraBanner />
                </div>

                {/* ═══ PARRAINAGE ═══ */}
                <Card className="border-0 shadow-2xl overflow-hidden">
                  <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-1">
                    <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white p-5 text-center">
                      <h2 className="text-xl font-extrabold mb-0.5 flex items-center justify-center gap-2">
                        <Users className="h-5 w-5" /> PARRAINAGE
                      </h2>
                      <p className="text-white/80 text-xs">Invitez vos amis, gagnez plus</p>
                      <div className="flex items-center justify-center gap-4 mt-3">
                        <div><p className="text-[10px] text-white/60">VOTRE GAIN</p><p className="text-lg font-black">+{REFERRAL_BONUS_NEW} F</p></div>
                        <div className="w-px h-8 bg-white/20" />
                        <div><p className="text-[10px] text-white/60">GAIN FILLEUL</p><p className="text-lg font-black">+{REFERRAL_BONUS_REFERRER} F</p></div>
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-5 space-y-3">
                    <div>
                      <p className="text-[11px] font-bold mb-1.5">Votre lien de parrainage :</p>
                      <div className="flex gap-1.5">
                        <div className="flex-1 h-10 flex items-center px-3 rounded-lg bg-muted border text-[11px] text-muted-foreground truncate font-mono">
                          {referralLink}
                        </div>
                        <Button onClick={copyLink} size="sm" variant={copied ? 'default' : 'outline'} className="h-10 px-3 flex-shrink-0">
                          {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 text-center">
                        <p className="text-lg font-black text-amber-600">{referralCount}</p>
                        <p className="text-[10px] text-muted-foreground">Filleuls</p>
                      </div>
                      <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 text-center">
                        <p className="text-lg font-black text-emerald-600">{referralEarnings} F</p>
                        <p className="text-[10px] text-muted-foreground">Gains parrainage</p>
                      </div>
                    </div>

                    {!referredBy ? (
                      <div>
                        {!showReferralInput ? (
                          <Button onClick={() => setShowReferralInput(true)} variant="outline" className="w-full h-10 text-xs font-semibold border-dashed border-2">
                            <Gift className="h-3.5 w-3.5 mr-1.5" /> Entrer un code de parrainage
                          </Button>
                        ) : (
                          <div className="space-y-2">
                            <div className="flex gap-1.5">
                              <Input placeholder="Code parrainage" value={refInput} onChange={(e) => setRefInput(e.target.value)} className="h-10 text-xs font-mono" />
                              <Button onClick={handleApplyReferral} disabled={applyingRef || !refInput.trim()} size="sm" className="h-10 px-4 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs">
                                {applyingRef ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                              </Button>
                            </div>
                            <button onClick={() => { setShowReferralInput(false); setRefInput('') }} className="text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-0.5 mx-auto">
                              <X className="h-2.5 w-2.5" /> Annuler
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                        <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                          Parrainage activé — +{REFERRAL_BONUS_NEW} FCFA de bonus reçu !
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* ═══ BANNIÈRE PUB 3 - Après parrainage ═══ */}
                <AdsterraBanner />

                {/* Retrait */}
                {balance >= 500 && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <a href={`https://wa.me/22397787244?text=${encodeURIComponent(`Bonjour Sacko ! Je souhaite retirer ${balance} FCFA de mon solde PTC. Mon numéro : ${phone}`)}`} target="_blank" rel="noopener noreferrer">
                      <Card className="border-2 border-emerald-300 dark:border-emerald-700 hover:shadow-lg transition-all cursor-pointer hover:-translate-y-0.5">
                        <CardContent className="p-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                              <Wallet className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div>
                              <p className="text-sm font-bold">Retirer {balance} FCFA</p>
                              <p className="text-[11px] text-muted-foreground">Via Orange Money ou Wave</p>
                            </div>
                          </div>
                          <ArrowRight className="h-5 w-5 text-emerald-500" />
                        </CardContent>
                      </Card>
                    </a>
                  </motion.div>
                )}

                {balance > 0 && balance < 500 && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                    <TrendingUp className="h-4 w-4 text-blue-500 flex-shrink-0" />
                    <p className="text-[11px] text-blue-700 dark:text-blue-400">
                      Encore <strong>{500 - balance} FCFA</strong> avant de pouvoir retirer. Continuez !
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>
      <Footer />

    </div>
  )
}