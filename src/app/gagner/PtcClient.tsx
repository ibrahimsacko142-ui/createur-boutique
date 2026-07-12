'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Eye, Clock, Wallet, Play, CheckCircle2, ShieldCheck, MessageCircle,
  ChevronRight, ArrowLeft, AlertCircle, Loader2, Phone, Zap, TrendingUp,
  Info, X, Send, ArrowRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const AD_URL = 'https://www.effectivecpmnetwork.com/w24ar3me?key=2270134b3b2815aa1e5c7ea649fb22a7'
const TIMER_SECONDS = 30
const EARN_PER_VIEW = 1

export default function PtcPage() {
  const { toast } = useToast()
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState<'login' | 'otp' | 'ready'>('login')
  const [countdown, setCountdown] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [balance, setBalance] = useState(0)
  const [totalViewed, setTotalViewed] = useState(0)
  const [claiming, setClaiming] = useState(false)
  const [sendingOtp, setSendingOtp] = useState(false)
  const [loading, setLoading] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const pubWindowRef = useRef<Window | null>(null)

  const fetchBalance = useCallback(async () => {
    if (!phone) return
    try {
      const res = await fetch(`/api/ptc/balance?phone=${encodeURIComponent(phone)}`)
      const data = await res.json()
      if (data.success) {
        setBalance(data.balance)
        setTotalViewed(data.totalViewed)
      }
    } catch {}
  }, [phone])

  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [])

  // Timer logic
  useEffect(() => {
    if (isTimerRunning && countdown > 0) {
      intervalRef.current = setTimeout(() => setCountdown(c => c - 1), 1000)
    } else if (isTimerRunning && countdown === 0) {
      setIsTimerRunning(false)
    }
    return () => { if (intervalRef.current) clearTimeout(intervalRef.current) }
  }, [isTimerRunning, countdown])

  const handleSendOtp = async () => {
    if (!phone || phone.length < 8) {
      toast({ title: 'Numéro invalide', description: 'Entrez votre numéro de téléphone.', variant: 'destructive' })
      return
    }
    setSendingOtp(true)
    try {
      const res = await fetch('/api/send-otp', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ phone: `+${phone.replace(/\s/g, '')}` }) })
      const data = await res.json()
      if (data.success) {
        setStep('otp')
        toast({ title: 'Code envoyé !', description: 'Vérifiez votre WhatsApp.' })
      } else {
        toast({ title: 'Erreur', description: data.error || 'Impossible d\'envoyer le code.', variant: 'destructive' })
      }
    } catch {
      toast({ title: 'Erreur', description: 'Problème de connexion.', variant: 'destructive' })
    }
    setSendingOtp(false)
  }

  const handleVerifyOtp = async () => {
    if (!/^\d{6}$/.test(otp)) {
      toast({ title: 'Code invalide', description: 'Entrez exactement 6 chiffres.', variant: 'destructive' })
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/verify-otp', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ otp }) })
      const data = await res.json()
      if (data.success) {
        setStep('ready')
        await fetchBalance()
        toast({ title: 'Bienvenue !', description: 'Vous pouvez maintenant gagner de l\'argent en regardant des pubs.' })
      } else {
        toast({ title: 'Code incorrect', description: data.error || 'Réessayez.', variant: 'destructive' })
      }
    } catch {
      toast({ title: 'Erreur', description: 'Problème de connexion.', variant: 'destructive' })
    }
    setLoading(false)
  }

  const handleWatchAd = () => {
    // Open the ad in a new tab
    pubWindowRef.current = window.open(AD_URL, '_blank')
    // Start countdown
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
        // Reset timer if too early
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

          <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-center">
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
                Simple, rapide, depuis votre téléphone. Retrait via Orange Money ou Wave.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Main Content */}
        <section className="mx-auto max-w-md px-4 sm:px-6 py-8">
          <AnimatePresence mode="wait">
            {/* STEP 1: Login */}
            {step === 'login' && (
              <motion.div key="login" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
                <Card className="border-0 shadow-2xl overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 p-1">
                    <div className="bg-gradient-to-br from-emerald-500 to-cyan-600 text-white p-6 text-center">
                      <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm mb-3">
                        <Phone className="h-7 w-7" />
                      </div>
                      <h2 className="text-xl font-extrabold">Connectez-vous</h2>
                      <p className="text-sm text-white/80 mt-1">Entrez votre numéro pour commencer</p>
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
                    <Button
                      onClick={handleSendOtp}
                      disabled={sendingOtp || phone.replace(/\s/g, '').length < 8}
                      className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-bold h-12"
                    >
                      {sendingOtp ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
                      Envoyer le code
                    </Button>
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
                      <Info className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                      <p className="text-[11px] text-amber-700 dark:text-amber-400 leading-relaxed">
                        Un code de vérification sera envoyé sur votre WhatsApp. C&apos;est gratuit.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* STEP 2: OTP */}
            {step === 'otp' && (
              <motion.div key="otp" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
                <Card className="border-0 shadow-2xl overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-1">
                    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-6 text-center">
                      <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm mb-3">
                        <ShieldCheck className="h-7 w-7" />
                      </div>
                      <h2 className="text-xl font-extrabold">Vérification</h2>
                      <p className="text-sm text-white/80 mt-1">Entrez le code à 6 chiffres reçu sur WhatsApp</p>
                    </div>
                  </div>
                  <CardContent className="p-6 space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold">Code de vérification</label>
                      <Input
                        placeholder="123456"
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
                      Vérifier
                    </Button>
                    <button onClick={() => setStep('login')} className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 mx-auto">
                      <ArrowLeft className="h-3 w-3" /> Changer de numéro
                    </button>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* STEP 3: Dashboard PTC */}
            {step === 'ready' && (
              <motion.div key="ready" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-5">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 gap-3">
                  <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-cyan-50 dark:from-emerald-950/20 dark:to-cyan-950/20">
                    <CardContent className="p-4 text-center">
                      <Wallet className="h-6 w-6 text-emerald-500 mx-auto mb-2" />
                      <p className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">{balance}</p>
                      <p className="text-[11px] text-muted-foreground font-medium">FCFA gagnés</p>
                    </CardContent>
                  </Card>
                  <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
                    <CardContent className="p-4 text-center">
                      <Eye className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                      <p className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400">{totalViewed}</p>
                      <p className="text-[11px] text-muted-foreground font-medium">Pubs regardées</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Main Ad Button */}
                <Card className="border-0 shadow-2xl overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 p-1">
                    <div className="bg-gradient-to-br from-emerald-500 to-cyan-600 text-white p-6 text-center">
                      <h2 className="text-2xl font-extrabold mb-1">PUBLICITÉS RÉMUNÉRÉES</h2>
                      <p className="text-white/80 text-sm">Regardez, gagnez.</p>

                      {/* Stats row */}
                      <div className="flex items-center justify-center gap-6 mt-4">
                        <div>
                          <p className="text-xs text-white/60">PAR VUE</p>
                          <p className="text-lg font-black">{EARN_PER_VIEW} F</p>
                        </div>
                        <div className="w-px h-8 bg-white/20" />
                        <div>
                          <p className="text-xs text-white/60">VUES</p>
                          <p className="text-lg font-black">{totalViewed}</p>
                        </div>
                        <div className="w-px h-8 bg-white/20" />
                        <div>
                          <p className="text-xs text-white/60">GAGNÉ</p>
                          <p className="text-lg font-black">{balance} F</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-6 space-y-4">
                    {/* Timer or Claim Button */}
                    {isTimerRunning && (
                      <div className="text-center space-y-3">
                        <p className="text-sm font-medium text-muted-foreground">La pub est ouverte dans un autre onglet...</p>
                        <div className="relative w-24 h-24 mx-auto">
                          <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="6" fill="none" className="text-muted/20" />
                            <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="6" fill="none" className="text-emerald-500" strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 42}`} strokeDashoffset={`${2 * Math.PI * 42 * (1 - countdown / TIMER_SECONDS)}`} style={{ transition: 'stroke-dashoffset 1s linear' }} />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-2xl font-black">{countdown}</span>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">Secondes restantes</p>
                      </div>
                    )}
                    {!isTimerRunning && countdown === 0 && (
                      <div className="space-y-2">
                        {claiming ? (
                          <Button disabled className="w-full h-14 text-base font-bold bg-muted text-muted-foreground">
                            <Loader2 className="h-5 w-5 mr-2 animate-spin" /> Vérification...
                          </Button>
                        ) : (
                          <>
                            <Button onClick={handleClaim} className="w-full h-14 text-base font-bold bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]">
                              <CheckCircle2 className="h-5 w-5 mr-2" /> Réclamer +{EARN_PER_VIEW} FCFA
                            </Button>
                            <Button onClick={handleWatchAd} variant="outline" className="w-full h-12 font-semibold">
                              <Play className="h-4 w-4 mr-2" /> Regarder une autre pub
                            </Button>
                          </>
                        )}
                      </div>
                    )}
                    {!isTimerRunning && countdown > 0 && (
                      <Button onClick={handleWatchAd} className="w-full h-14 text-base font-bold bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg shadow-orange-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]">
                        <Play className="h-5 w-5 mr-2" /> Regarder une pub &middot; +{EARN_PER_VIEW} FCFA
                      </Button>
                    )}

                    {/* How it works */}
                    <div className="mt-4 p-4 rounded-xl bg-muted/50 border">
                      <p className="text-xs font-bold mb-2 flex items-center gap-1.5">
                        <Info className="h-3.5 w-3.5 text-blue-500" /> Comment ça marche ?
                      </p>
                      <ol className="space-y-1.5 text-[11px] text-muted-foreground leading-relaxed">
                        <li className="flex items-start gap-2"><span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-bold flex-shrink-0 mt-0.5">1</span> Cliquez sur &laquo; Regarder une pub &raquo;.</li>
                        <li className="flex items-start gap-2"><span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-bold flex-shrink-0 mt-0.5">2</span> Laissez la pub ouverte 30 secondes.</li>
                        <li className="flex items-start gap-2"><span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-bold flex-shrink-0 mt-0.5">3</span> Revenez ici et cliquez &laquo; Réclamer &raquo;.</li>
                      </ol>
                    </div>
                  </CardContent>
                </Card>

                {/* Withdraw CTA */}
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