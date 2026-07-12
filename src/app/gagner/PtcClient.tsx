'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import {
  Wallet, Phone, ShieldCheck, MessageCircle,
  ArrowLeft, Loader2, Users, Gift, ArrowRight, X, Copy, CheckCircle2
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

const SITE_URL = 'https://createur-boutique.vercel.app'
const SMART_LINK = 'https://www.effectivecpmnetwork.com/xntegh31ay?key=3caffbaacc837287e406a00f78092cd4'
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
  const [isValidating, setIsValidating] = useState(false)
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

  /* ─── API Calls ─── */
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

  /* ─── Ref from URL ─── */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const ref = params.get('ref')
    if (ref) { setRefInput(ref); setShowReferralInput(true) }
  }, [])

  /* ─── Timer ─── */
  useEffect(() => { return () => { if (intervalRef.current) clearTimeout(intervalRef.current) } }, [])
  useEffect(() => {
    if (isTimerRunning && countdown > 0) {
      intervalRef.current = setTimeout(() => setCountdown(c => c - 1), 1000)
    } else if (isTimerRunning && countdown === 0) {
      setIsTimerRunning(false)
      setIsValidating(true)
    }
    return () => { if (intervalRef.current) clearTimeout(intervalRef.current) }
  }, [isTimerRunning, countdown])

  /* ─── OTP Send ─── */
  const handleSendOtp = async () => {
    if (!phone || phone.replace(/\s/g, '').length < 8) {
      toast({ title: 'Numéro invalide', description: 'Entrez votre numéro.', variant: 'destructive' }); return
    }
    setSendingOtp(true)
    try {
      await fetch('/api/ptc/balance', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ phone: `+${phone.replace(/\s/g, '')}` }) })
      const code = Math.floor(100000 + Math.random() * 900000).toString()
      setGeneratedOtp(code); setOtp(''); setStep('otp')
      toast({ title: 'Code généré !', description: `Votre code est : ${code}` })
    } catch { toast({ title: 'Erreur', description: 'Problème de connexion.', variant: 'destructive' }) }
    setSendingOtp(false)
  }

  /* ─── OTP Verify ─── */
  const handleVerifyOtp = async () => {
    if (otp !== generatedOtp) { toast({ title: 'Code incorrect', variant: 'destructive' }); return }
    setLoading(true)
    try { await fetchBalance(); setStep('ready'); toast({ title: 'Bienvenue !', description: 'Vous pouvez maintenant gagner de l\'argent.' }) }
    catch { toast({ title: 'Erreur', variant: 'destructive' }) }
    setLoading(false)
  }

  /* ─── Watch Ad (opens smartlink in NEW TAB) ─── */
  const handleWatchAd = () => {
    window.open(SMART_LINK, '_blank')
    setCountdown(TIMER_SECONDS)
    setIsTimerRunning(true)
    setIsValidating(false)
  }

  /* ─── Validate Gain ─── */
  const handleValidate = async () => {
    setIsValidating(false)
    setClaiming(true)
    try {
      const res = await fetch('/api/ptc/claim', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ phone }) })
      const data = await res.json()
      if (data.success) {
        setBalance(data.newBalance); setTotalViewed(data.totalViewed)
        toast({ title: `+${EARN_PER_VIEW} FCFA gagné !`, description: `Nouveau solde : ${data.newBalance} FCFA` })
      } else {
        toast({ title: 'Pas encore...', description: data.error || 'Réessayez.', variant: 'destructive' })
        if (data.waitSeconds) { setCountdown(data.waitSeconds); setIsTimerRunning(true) }
      }
    } catch { toast({ title: 'Erreur', variant: 'destructive' }) }
    setClaiming(false)
  }

  /* ─── Referral ─── */
  const handleApplyReferral = async () => {
    if (!refInput.trim()) return
    setApplyingRef(true)
    try {
      const res = await fetch('/api/ptc/referral', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ phone, referralCode: refInput.trim() }) })
      const data = await res.json()
      if (data.success) { setReferredBy(refInput.trim()); setBalance(data.newBalance); setShowReferralInput(false); toast({ title: 'Parrainage appliqué !', description: data.message }); fetchBalance() }
      else { toast({ title: 'Erreur', description: data.error || 'Code invalide.', variant: 'destructive' }) }
    } catch { toast({ title: 'Erreur', variant: 'destructive' }) }
    setApplyingRef(false)
  }

  const copyLink = () => { navigator.clipboard.writeText(referralLink); setCopied(true); toast({ title: 'Lien copié !' }); setTimeout(() => setCopied(false), 2000) }

  /* ══════════════════════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════════════════════ */
  return (
    <div className="min-h-screen bg-gray-100">

      {/* ═══ LOGIN ═══ */}
      {step === 'login' && (
        <div className="min-h-screen flex items-center justify-center px-4 py-10">
          <div className="w-full max-w-sm space-y-6">
            <div className="text-center space-y-2">
              <div className="mx-auto w-16 h-16 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
                <Wallet className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-extrabold text-gray-900">Gagnez de l&apos;argent</h1>
              <p className="text-sm text-gray-500">Regardez des pubs, gagnez des FCFA</p>
            </div>

            <div className="rounded-3xl bg-white shadow-xl p-6 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Phone className="w-5 h-5 text-gray-400" />
                <p className="text-sm font-semibold text-gray-700">Numéro WhatsApp</p>
              </div>
              <div className="flex gap-2">
                <div className="flex h-12 items-center px-3 rounded-2xl bg-gray-100 text-sm font-bold text-gray-500">+223</div>
                <input
                  placeholder="XX XX XX XX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/[^\d\s]/g, ''))}
                  className="flex-1 h-12 px-4 rounded-2xl border-2 border-gray-200 focus:border-orange-400 focus:outline-none text-sm font-medium"
                  type="tel" maxLength={12}
                />
              </div>

              {showReferralInput && (
                <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200">
                  <p className="text-xs font-bold text-amber-700 flex items-center gap-1"><Gift className="w-3 h-3" /> Code parrainage détecté</p>
                </div>
              )}

              <button
                onClick={handleSendOtp}
                disabled={sendingOtp || phone.replace(/\s/g, '').length < 8}
                className="w-full h-13 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white font-bold text-sm shadow-lg shadow-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {sendingOtp ? <Loader2 className="w-4 h-4 mr-2 animate-spin inline" /> : <MessageCircle className="w-4 h-4 mr-2 inline" />}
                Envoyer le code
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-2xl bg-white shadow p-3">
                <p className="text-lg font-black text-orange-500">{EARN_PER_VIEW} F</p>
                <p className="text-[10px] text-gray-400 font-medium">par vue</p>
              </div>
              <div className="rounded-2xl bg-white shadow p-3">
                <p className="text-lg font-black text-blue-500">{REFERRAL_BONUS_NEW} F</p>
                <p className="text-[10px] text-gray-400 font-medium">par filleul</p>
              </div>
              <div className="rounded-2xl bg-white shadow p-3">
                <p className="text-lg font-black text-emerald-500">500 F</p>
                <p className="text-[10px] text-gray-400 font-medium">retrait min</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ OTP ═══ */}
      {step === 'otp' && (
        <div className="min-h-screen flex items-center justify-center px-4 py-10">
          <div className="w-full max-w-sm space-y-6">
            <div className="text-center space-y-2">
              <div className="mx-auto w-16 h-16 rounded-3xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <ShieldCheck className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-extrabold text-gray-900">Vérification</h1>
              <p className="text-sm text-gray-500">Entrez le code à 6 chiffres</p>
            </div>

            <div className="rounded-3xl bg-white shadow-xl p-6 space-y-5">
              <div className="text-center py-5 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-dashed border-blue-200">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Votre code</p>
                <p className="text-4xl font-black tracking-[0.3em] text-blue-600 select-all">{generatedOtp}</p>
                <button onClick={() => { navigator.clipboard.writeText(generatedOtp); toast({ title: 'Code copié !' }) }} className="mt-2 text-xs text-blue-500 font-medium hover:underline">
                  <Copy className="w-3 h-3 inline mr-1" /> Copier
                </button>
              </div>

              <input
                placeholder="Entrez le code ici"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^\d]/g, '').slice(0, 6))}
                className="w-full h-14 text-center text-2xl font-black tracking-[0.5em] rounded-2xl border-2 border-gray-200 focus:border-blue-400 focus:outline-none"
                type="tel" maxLength={6}
              />

              <button
                onClick={handleVerifyOtp}
                disabled={loading || otp.length !== 6}
                className="w-full h-13 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-bold text-sm shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin inline" /> : <CheckCircle2 className="w-4 h-4 mr-2 inline" />}
                Vérifier et continuer
              </button>

              <button onClick={() => setStep('login')} className="w-full text-xs text-gray-400 hover:text-gray-600 flex items-center justify-center gap-1">
                <ArrowLeft className="w-3 h-3" /> Changer de numéro
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ DASHBOARD ═══ */}
      {step === 'ready' && (
        <div className="min-h-screen bg-gray-100 pb-8">

          {/* ─── Dark Dashboard Bar ─── */}
          <div style={{ backgroundColor: '#1e2538' }} className="px-5 pt-6 pb-5 text-white">
            <div className="flex items-center gap-2 mb-4">
              <Wallet className="w-4 h-4 text-amber-400" />
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Mon Tableau de Bord</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-white/10 backdrop-blur p-4">
                <p className="text-[10px] text-gray-400 font-medium mb-0.5">Gagné</p>
                <p className="text-2xl font-black text-amber-400">{balance} <span className="text-sm font-bold text-gray-400">FCFA</span></p>
              </div>
              <div className="rounded-2xl bg-white/10 backdrop-blur p-4">
                <p className="text-[10px] text-gray-400 font-medium mb-0.5">Pubs vues</p>
                <p className="text-2xl font-black text-cyan-400">{totalViewed}</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                <span>Prochain retrait : 500 FCFA</span>
                <span>{Math.min(100, Math.round((balance / 500) * 100))}%</span>
              </div>
              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-500" style={{ width: `${Math.min(100, (balance / 500) * 100)}%` }} />
              </div>
            </div>
          </div>

          {/* ─── Content ─── */}
          <div className="px-4 -mt-3 space-y-4">

            {/* ─── Big Action Card ─── */}
            <div className="rounded-3xl bg-white shadow-xl p-5">

              {/* State: Ready to watch */}
              {!isTimerRunning && !isValidating && !claiming && (
                <button
                  onClick={handleWatchAd}
                  className="w-full h-16 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 active:scale-[0.98] text-white font-extrabold text-base shadow-lg shadow-orange-500/30 transition-all flex items-center justify-center gap-2"
                >
                  ▶ Regarder une pub · +{EARN_PER_VIEW} FCFA
                </button>
              )}

              {/* State: Timer counting down */}
              {isTimerRunning && (
                <div className="space-y-3">
                  <div className="w-full h-16 rounded-2xl bg-gray-100 text-gray-400 font-bold text-sm flex items-center justify-center gap-2 cursor-not-allowed">
                    <div className="w-3 h-3 rounded-full bg-amber-400 animate-pulse" />
                    {countdown}s restantes...
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-gray-100 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-1000 ease-linear" style={{ width: `${((TIMER_SECONDS - countdown) / TIMER_SECONDS) * 100}%` }} />
                  </div>
                  <p className="text-[11px] text-gray-400 text-center">La pub est ouverte dans un autre onglet...</p>
                </div>
              )}

              {/* State: Timer done, validate button */}
              {isValidating && !claiming && (
                <button
                  onClick={handleValidate}
                  className="w-full h-16 rounded-2xl bg-gradient-to-r from-emerald-400 to-green-500 hover:from-emerald-500 hover:to-green-600 active:scale-[0.98] text-white font-extrabold text-base shadow-lg shadow-green-500/30 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5" /> Valider mon gain
                </button>
              )}

              {/* State: Claiming in progress */}
              {claiming && (
                <div className="w-full h-16 rounded-2xl bg-gray-100 text-gray-400 font-bold text-sm flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Vérification...
                </div>
              )}
            </div>

            {/* ─── Retrait ─── */}
            {balance >= 500 && (
              <a href={`https://wa.me/22397787244?text=${encodeURIComponent(`Bonjour ! Je souhaite retirer ${balance} FCFA. Mon numéro : ${phone}`)}`} target="_blank" rel="noopener noreferrer">
                <div className="rounded-3xl bg-gradient-to-r from-emerald-500 to-green-500 p-4 flex items-center justify-between shadow-lg shadow-green-500/20 active:scale-[0.98] transition-all cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
                      <Wallet className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">Retirer {balance} FCFA</p>
                      <p className="text-[11px] text-white/70">Via WhatsApp</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-white" />
                </div>
              </a>
            )}

            {balance > 0 && balance < 500 && (
              <div className="rounded-3xl bg-blue-50 border border-blue-100 p-4 flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <p className="text-xs text-blue-600">Encore <strong>{500 - balance} FCFA</strong> avant de pouvoir retirer. Continuez !</p>
              </div>
            )}

            {/* ─── Parrainage ─── */}
            <div className="rounded-3xl bg-white shadow-xl p-5 space-y-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-500" />
                <p className="text-sm font-bold text-gray-800">Parrainage</p>
                <span className="ml-auto text-[10px] font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full">+{REFERRAL_BONUS_NEW} F / filleul</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-2xl bg-gray-50 p-3 text-center">
                  <p className="text-lg font-black text-gray-800">{referralCount}</p>
                  <p className="text-[10px] text-gray-400">Filleuls</p>
                </div>
                <div className="rounded-2xl bg-gray-50 p-3 text-center">
                  <p className="text-lg font-black text-emerald-600">{referralEarnings} F</p>
                  <p className="text-[10px] text-gray-400">Gains parrainage</p>
                </div>
              </div>

              <div>
                <p className="text-[11px] font-bold text-gray-500 mb-1.5">Votre lien de parrainage :</p>
                <div className="flex gap-1.5">
                  <div className="flex-1 h-10 flex items-center px-3 rounded-2xl bg-gray-50 border text-[11px] text-gray-400 truncate font-mono">{referralLink}</div>
                  <button onClick={copyLink} className={`h-10 w-10 rounded-2xl flex items-center justify-center transition-all ${copied ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}>
                    {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {!referredBy ? (
                !showReferralInput ? (
                  <button onClick={() => setShowReferralInput(true)} className="w-full h-10 rounded-2xl border-2 border-dashed border-gray-200 text-xs font-semibold text-gray-400 hover:border-amber-300 hover:text-amber-500 transition-all flex items-center justify-center gap-1">
                    <Gift className="w-3.5 h-3.5" /> Entrer un code de parrainage
                  </button>
                ) : (
                  <div className="space-y-2">
                    <div className="flex gap-1.5">
                      <input placeholder="Code parrainage" value={refInput} onChange={(e) => setRefInput(e.target.value)} className="flex-1 h-10 px-3 rounded-2xl border-2 border-gray-200 focus:border-amber-400 focus:outline-none text-xs font-mono" />
                      <button onClick={handleApplyReferral} disabled={applyingRef || !refInput.trim()} className="h-10 w-10 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold flex items-center justify-center disabled:opacity-50 transition-all">
                        {applyingRef ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <button onClick={() => { setShowReferralInput(false); setRefInput('') }} className="text-[10px] text-gray-400 hover:text-gray-600 flex items-center gap-0.5 mx-auto">
                      <X className="w-2.5 h-2.5" /> Annuler
                    </button>
                  </div>
                )
              ) : (
                <div className="flex items-center gap-2 p-3 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <p className="text-[11px] text-emerald-700 font-medium">Parrainage activé — +{REFERRAL_BONUS_NEW} FCFA reçu !</p>
                </div>
              )}
            </div>

            {/* ─── Comment ça marche ─── */}
            <div className="rounded-3xl bg-white shadow-xl p-5">
              <p className="text-xs font-bold text-gray-800 mb-3">Comment ça marche ?</p>
              <div className="space-y-2.5">
                {[
                  { num: '1', text: 'Cliquez sur « ▶ Regarder une pub » — la pub s\'ouvre dans un nouvel onglet.' },
                  { num: '2', text: 'Attendez 30 secondes que le compte à rebours se termine.' },
                  { num: '3', text: 'Cliquez « Valider mon gain » pour ajouter +1 FCFA à votre solde.' },
                ].map((item) => (
                  <div key={item.num} className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-amber-100 text-amber-600 text-[10px] font-black flex items-center justify-center flex-shrink-0 mt-0.5">{item.num}</div>
                    <p className="text-[11px] text-gray-500 leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}