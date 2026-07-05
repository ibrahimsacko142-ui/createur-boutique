'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Phone, User, Globe, Shield, ArrowRight, Sparkles,
  Palette, MonitorPlay, GraduationCap, RefreshCw,
  Copy, Check, AlertCircle, ArrowLeft, MessageSquare, Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from '@/components/ui/input-otp'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

/* ═══════════════════════════════════════════════════════════════
   PAYS
   ═══════════════════════════════════════════════════════════════ */
const PAYS = [
  { code: '+223', nom: 'Mali', drapeau: '\u{1F1F2}\u{1F1F1}' },
  { code: '+221', nom: 'Sénégal', drapeau: '\u{1F1F7}\u{1F1F8}' },
  { code: '+225', nom: "Côte d'Ivoire", drapeau: '\u{1F1E8}\u{1F1EE}' },
  { code: '+226', nom: 'Burkina Faso', drapeau: '\u{1F1E7}\u{1F1EB}' },
  { code: '+227', nom: 'Niger', drapeau: '\u{1F1F3}\u{1F1EA}' },
  { code: '+228', nom: 'Togo', drapeau: '\u{1F1F9}\u{1F1EC}' },
  { code: '+229', nom: 'Bénin', drapeau: '\u{1F1E7}\u{1F1EF}' },
  { code: '+241', nom: 'Gabon', drapeau: '\u{1F1EC}\u{1F1E6}' },
  { code: '+243', nom: 'RD Congo', drapeau: '\u{1F1E8}\u{1F1E9}' },
  { code: '+242', nom: 'Congo', drapeau: '\u{1F1E8}\u{1F1EC}' },
  { code: '+237', nom: 'Cameroun', drapeau: '\u{1F1E8}\u{1F1F2}' },
  { code: '+235', nom: 'Tchad', drapeau: '\u{1F1F9}\u{1F1ED}' },
  { code: '+236', nom: 'Centrafrique', drapeau: '\u{1F1E8}\u{1F1EB}' },
  { code: '+240', nom: 'Guinée Équatoriale', drapeau: '\u{1F1EC}\u{1F1F6}' },
  { code: '+258', nom: 'Mozambique', drapeau: '\u{1F1F2}\u{1F1FF}' },
  { code: '+33', nom: 'France', drapeau: '\u{1F1EB}\u{1F1F7}' },
  { code: '+1', nom: 'États-Unis / Canada', drapeau: '\u{1F1FA}\u{1F1F8}' },
  { code: '+44', nom: 'Royaume-Uni', drapeau: '\u{1F1EC}\u{1F1E7}' },
  { code: '+212', nom: 'Maroc', drapeau: '\u{1F1F2}\u{1F1E6}' },
  { code: '+216', nom: 'Tunisie', drapeau: '\u{1F1F9}\u{1F1F3}' },
  { code: '+20', nom: 'Égypte', drapeau: '\u{1F1EA}\u{1F1EC}' },
  { code: '+234', nom: 'Nigeria', drapeau: '\u{1F1F3}\u{1F1EC}' },
  { code: '+233', nom: 'Ghana', drapeau: '\u{1F1EC}\u{1F1ED}' },
  { code: '+224', nom: 'Guinée', drapeau: '\u{1F1EC}\u{1F1F3}' },
  { code: '+245', nom: 'Guinée-Bissau', drapeau: '\u{1F1EC}\u{1F1FC}' },
  { code: '+248', nom: 'Seychelles', drapeau: '\u{1F1F8}\u{1F1F8}' },
  { code: '+230', nom: 'Maurice', drapeau: '\u{1F1F2}\u{1F1FA}' },
  { code: '+261', nom: 'Madagascar', drapeau: '\u{1F1F2}\u{1F1EC}' },
  { code: '+250', nom: 'Rwanda', drapeau: '\u{1F1F7}\u{1F1EA}' },
  { code: '+257', nom: 'Burundi', drapeau: '\u{1F1E7}\u{1F1EE}' },
  { code: '+255', nom: 'Tanzanie', drapeau: '\u{1F1F9}\u{1F1FF}' },
]

/* ═══════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════ */
type InscStep = 'form' | 'otp' | 'success'
type LoginStep = 'phone' | 'otp'

interface UserData {
  prenom: string
  nom: string
  telephone: string
  pays: string
  codePays: string
}

/* ═══════════════════════════════════════════════════════════════
   COMPOSANT
   ═══════════════════════════════════════════════════════════════ */
export default function LoginPage({ onLogin }: { onLogin: (user: UserData) => void }) {

  /* ─── Inscription ─── */
  const [prenom, setPrenom] = useState('')
  const [nom, setNom] = useState('')
  const [telephone, setTelephone] = useState('')
  const [paysIndex, setPaysIndex] = useState(0)
  const [inscStep, setInscStep] = useState<InscStep>('form')
  const [inscOtp, setInscOtp] = useState('')
  const [inscOtpError, setInscOtpError] = useState('')
  const [inscSending, setInscSending] = useState(false)
  const [inscVerifying, setInscVerifying] = useState(false)
  const [inscSmsInfo, setInscSmsInfo] = useState('')
  const [inscDevOtp, setInscDevOtp] = useState('')
  const [inscCodeCopied, setInscCodeCopied] = useState(false)

  /* ─── Connexion ─── */
  const [loginPhone, setLoginPhone] = useState('')
  const [loginPaysIndex, setLoginPaysIndex] = useState(0)
  const [loginStep, setLoginStep] = useState<LoginStep>('phone')
  const [loginOtp, setLoginOtp] = useState('')
  const [loginOtpError, setLoginOtpError] = useState('')
  const [loginSending, setLoginSending] = useState(false)
  const [loginVerifying, setLoginVerifying] = useState(false)
  const [loginSmsInfo, setLoginSmsInfo] = useState('')
  const [loginDevOtp, setLoginDevOtp] = useState('')
  const [loginCodeCopied, setLoginCodeCopied] = useState(false)
  const [loginError, setLoginError] = useState('')

  /* ─── Timer (5 min) ─── */
  const [inscTimer, setInscTimer] = useState(0)
  const [loginTimer, setLoginTimer] = useState(0)
  const inscTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const loginTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  /* ─── UI ─── */
  const [activeTab, setActiveTab] = useState<'inscription' | 'connexion'>('inscription')

  const codePays = PAYS[paysIndex].code
  const loginCode = PAYS[loginPaysIndex].code

  /* ─── Timers ─── */
  useEffect(() => {
    if (inscTimer > 0) {
      inscTimerRef.current = setInterval(() => setInscTimer(p => { if (p <= 1) { clearInterval(inscTimerRef.current!); return 0 } return p - 1 }), 1000)
    }
    return () => { if (inscTimerRef.current) clearInterval(inscTimerRef.current) }
  }, [inscTimer > 0]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (loginTimer > 0) {
      loginTimerRef.current = setInterval(() => setLoginTimer(p => { if (p <= 1) { clearInterval(loginTimerRef.current!); return 0 } return p - 1 }), 1000)
    }
    return () => { if (loginTimerRef.current) clearInterval(loginTimerRef.current) }
  }, [loginTimer > 0]) // eslint-disable-line react-hooks/exhaustive-deps

  const fmtTimer = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`

  /* ═══════════════════════════════════════════════════════════════
     INSCRIPTION
     ═══════════════════════════════════════════════════════════════ */

  const sendInscOtp = useCallback(async () => {
    if (!prenom.trim() || !nom.trim() || !telephone.trim()) return
    setInscSending(true)
    setInscOtpError('')
    setInscDevOtp('')
    try {
      const fullPhone = `${codePays}${telephone.replace(/\s/g, '')}`
      const res = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: fullPhone }),
      })
      const data = await res.json()

      if (!data.success) {
        setInscOtpError(data.error || "Erreur d'envoi.")
        setInscSending(false)
        return
      }

      setInscSmsInfo(data.message || '')
      if (data.devOtp) setInscDevOtp(data.devOtp)
      setInscOtp('')
      setInscTimer(300) // 5 min
      setInscStep('otp')
    } catch {
      setInscOtpError('Erreur réseau. Vérifiez votre connexion.')
    } finally {
      setInscSending(false)
    }
  }, [prenom, nom, telephone, codePays])

  const verifyInscOtp = useCallback(async () => {
    if (inscOtp.length !== 6) { setInscOtpError('Entrez les 6 chiffres'); return }
    setInscVerifying(true)
    setInscOtpError('')
    try {
      const res = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp: inscOtp }),
      })
      const data = await res.json()

      if (!data.success) {
        setInscOtpError(data.error || 'Code incorrect.')
        setInscVerifying(false)
        return
      }

      /* Succès */
      const userData: UserData = {
        prenom: prenom.trim(),
        nom: nom.trim(),
        telephone,
        pays: PAYS[paysIndex].nom,
        codePays,
      }
      localStorage.setItem('studio_creatif_user', JSON.stringify(userData))
      localStorage.setItem('studio_creatif_auth', 'true')
      setInscStep('success')
      setTimeout(() => onLogin(userData), 1200)
    } catch {
      setInscOtpError('Erreur réseau. Réessayez.')
    } finally {
      setInscVerifying(false)
    }
  }, [inscOtp, prenom, nom, telephone, paysIndex, codePays, onLogin])

  const resendInscOtp = useCallback(async () => {
    setInscOtp('')
    setInscOtpError('')
    setInscDevOtp('')
    setInscSending(true)
    try {
      const fullPhone = `${codePays}${telephone.replace(/\s/g, '')}`
      const res = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: fullPhone }),
      })
      const data = await res.json()
      if (data.success) {
        setInscSmsInfo(data.message || '')
        if (data.devOtp) setInscDevOtp(data.devOtp)
        setInscTimer(300)
      } else {
        setInscOtpError(data.error || "Erreur d'envoi.")
      }
    } catch {
      setInscOtpError('Erreur réseau.')
    } finally {
      setInscSending(false)
    }
  }, [codePays, telephone])

  /* ═══════════════════════════════════════════════════════════════
     CONNEXION
     ═══════════════════════════════════════════════════════════════ */

  const sendLoginOtp = useCallback(async () => {
    if (!loginPhone.trim()) return
    setLoginSending(true)
    setLoginError('')
    setLoginDevOtp('')
    try {
      const fullPhone = `${loginCode}${loginPhone.replace(/\s/g, '')}`
      const res = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: fullPhone }),
      })
      const data = await res.json()
      if (!data.success) {
        setLoginError(data.error || "Erreur d'envoi.")
        setLoginSending(false)
        return
      }
      setLoginSmsInfo(data.message || '')
      if (data.devOtp) setLoginDevOtp(data.devOtp)
      setLoginOtp('')
      setLoginOtpError('')
      setLoginTimer(300)
      setLoginStep('otp')
    } catch {
      setLoginError('Erreur réseau.')
    } finally {
      setLoginSending(false)
    }
  }, [loginPhone, loginCode])

  const verifyLoginOtp = useCallback(async () => {
    if (loginOtp.length !== 6) { setLoginOtpError('Entrez les 6 chiffres'); return }
    setLoginVerifying(true)
    setLoginOtpError('')
    try {
      const res = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp: loginOtp }),
      })
      const data = await res.json()
      if (!data.success) {
        setLoginOtpError(data.error || 'Code incorrect.')
        setLoginVerifying(false)
        return
      }
      const savedUser = localStorage.getItem('studio_creatif_user')
      const userData: UserData = savedUser
        ? JSON.parse(savedUser)
        : { prenom: '', nom: '', telephone: loginPhone, pays: PAYS[loginPaysIndex].nom, codePays: loginCode }
      localStorage.setItem('studio_creatif_auth', 'true')
      onLogin(userData)
    } catch {
      setLoginOtpError('Erreur réseau.')
    } finally {
      setLoginVerifying(false)
    }
  }, [loginOtp, loginPhone, loginPaysIndex, loginCode, onLogin])

  const resendLoginOtp = useCallback(async () => {
    setLoginOtp('')
    setLoginOtpError('')
    setLoginDevOtp('')
    setLoginSending(true)
    try {
      const fullPhone = `${loginCode}${loginPhone.replace(/\s/g, '')}`
      const res = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: fullPhone }),
      })
      const data = await res.json()
      if (data.success) {
        setLoginSmsInfo(data.message || '')
        if (data.devOtp) setLoginDevOtp(data.devOtp)
        setLoginTimer(300)
      } else {
        setLoginOtpError(data.error || "Erreur d'envoi.")
      }
    } catch {
      setLoginOtpError('Erreur réseau.')
    } finally {
      setLoginSending(false)
    }
  }, [loginCode, loginPhone])

  /* ═══════════════════════════════════════════════════════════════
     HELPERS
     ═══════════════════════════════════════════════════════════════ */

  const copyCode = (code: string, setCopied: (v: boolean) => void) => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  /* ─── Sous-composants ─── */

  const OtpSlots = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
    <div className="flex justify-center">
      <InputOTP maxLength={6} value={value} onChange={onChange} containerClassName="gap-2">
        <InputOTPGroup>
          <InputOTPSlot index={0} className="h-13 w-12 sm:w-14 text-xl font-bold rounded-xl border-2" />
          <InputOTPSlot index={1} className="h-13 w-12 sm:w-14 text-xl font-bold rounded-xl border-2" />
          <InputOTPSlot index={2} className="h-13 w-12 sm:w-14 text-xl font-bold rounded-xl border-2" />
        </InputOTPGroup>
        <InputOTPSeparator className="text-muted-foreground/40 mx-1 text-lg" />
        <InputOTPGroup>
          <InputOTPSlot index={3} className="h-13 w-12 sm:w-14 text-xl font-bold rounded-xl border-2" />
          <InputOTPSlot index={4} className="h-13 w-12 sm:w-14 text-xl font-bold rounded-xl border-2" />
          <InputOTPSlot index={5} className="h-13 w-12 sm:w-14 text-xl font-bold rounded-xl border-2" />
        </InputOTPGroup>
      </InputOTP>
    </div>
  )

  const PaysSelect = ({ value, onChange }: { value: number; onChange: (i: number) => void }) => (
    <div className="relative">
      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10 pointer-events-none" />
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-11 w-full rounded-md border border-input bg-background pl-9 pr-8 text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500"
      >
        {PAYS.map((p, i) => (
          <option key={`${p.code}-${p.nom}`} value={i}>{p.drapeau}  {p.nom} ({p.code})</option>
        ))}
      </select>
      <svg className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  )

  /** Carte dev affichant le code OTP (seulement en mode développement) */
  const DevOtpCard = ({ code, copied, onCopy, label }: {
    code: string; copied: boolean; onCopy: () => void; label: string
  }) => (
    <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 rounded-2xl p-5 text-center space-y-3">
      <div className="flex items-center justify-center gap-1.5">
        <AlertCircle className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
        <p className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">{label}</p>
      </div>
      <div className="flex items-center justify-center gap-2">
        <span className="text-3xl sm:text-4xl font-mono font-extrabold tracking-[0.3em] text-foreground">
          {code.slice(0, 3)}<span className="text-muted-foreground/40 mx-1">-</span>{code.slice(3)}
        </span>
        <button onClick={onCopy} className="ml-2 p-2 rounded-lg hover:bg-background transition-colors" title="Copier">
          {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4 text-muted-foreground" />}
        </button>
      </div>
      <p className="text-[11px] text-amber-600 dark:text-amber-500 leading-relaxed">
        Ce code s&apos;affiche car Twilio n&apos;est pas configuré.<br />
        En production, il sera envoyé uniquement par SMS.
      </p>
    </div>
  )

  /* ═══════════════════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════════════════ */
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-background p-4">
      <div className="fixed top-0 -right-40 h-[500px] w-[500px] rounded-full bg-amber-200/40 dark:bg-amber-800/10 blur-3xl pointer-events-none" />
      <div className="fixed -bottom-20 -left-40 h-[400px] w-[400px] rounded-full bg-orange-200/30 dark:bg-orange-800/10 blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md relative z-10"
      >
        {/* ─── Logo ─── */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
            className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 shadow-xl shadow-amber-500/25 mb-4"
          >
            <Sparkles className="h-8 w-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-extrabold tracking-tight">Studio Créatif</h1>
          <p className="text-muted-foreground text-sm mt-1">Créativité, Expertise, Excellence</p>
        </div>

        {/* ─── Carte principale ─── */}
        <Card className="border-0 shadow-2xl shadow-amber-500/10 overflow-hidden">
          <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 p-1">
            <CardContent className="p-0 bg-background">
              <Tabs
                value={activeTab}
                onValueChange={(v) => {
                  setActiveTab(v as 'inscription' | 'connexion')
                  setInscStep('form'); setLoginStep('phone')
                  setLoginError(''); setInscTimer(0); setLoginTimer(0)
                }}
              >
                <div className="flex border-b">
                  <TabsList className="w-full h-12 bg-transparent rounded-none p-0 gap-0">
                    <TabsTrigger value="inscription" className="flex-1 h-full rounded-none data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-amber-500 text-sm font-semibold">
                      Inscription
                    </TabsTrigger>
                    <TabsTrigger value="connexion" className="flex-1 h-full rounded-none data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-amber-500 text-sm font-semibold">
                      Connexion
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* ═══════════ INSCRIPTION ═══════════ */}
                <TabsContent value="inscription">
                  <AnimatePresence mode="wait">

                    {/* ── Formulaire ── */}
                    {inscStep === 'form' && (
                      <motion.div key="i-form" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="p-6 sm:p-8 space-y-5">
                        <div className="text-center mb-2">
                          <h2 className="text-lg font-bold">Créez votre compte</h2>
                          <p className="text-xs text-muted-foreground mt-1">Vous recevrez un code de vérification par SMS</p>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <Label className="text-xs font-semibold">Prénom *</Label>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input placeholder="Ex: Ibrahim" value={prenom} onChange={(e) => setPrenom(e.target.value)} className="pl-9 h-11 text-sm" />
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-xs font-semibold">Nom *</Label>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input placeholder="Ex: Sacko" value={nom} onChange={(e) => setNom(e.target.value)} className="pl-9 h-11 text-sm" />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-xs font-semibold">Pays *</Label>
                          <PaysSelect value={paysIndex} onChange={setPaysIndex} />
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-xs font-semibold">Numéro de téléphone *</Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10 pointer-events-none" />
                            <div className="absolute left-9 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground border-r border-border pr-2 h-5 flex items-center pointer-events-none">
                              {codePays}
                            </div>
                            <Input type="tel" placeholder="70 00 00 00" value={telephone} onChange={(e) => setTelephone(e.target.value)} className="pl-[5.5rem] h-11 text-sm" />
                          </div>
                        </div>

                        <Button
                          onClick={sendInscOtp}
                          disabled={!prenom.trim() || !nom.trim() || !telephone.trim() || inscSending}
                          className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:via-orange-600 hover:to-red-600 text-white font-bold h-12 text-sm shadow-lg shadow-amber-500/20 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {inscSending ? (
                            <span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Envoi du SMS en cours...</span>
                          ) : (
                            <span className="flex items-center gap-2"><MessageSquare className="h-4 w-4" /> Recevoir mon code par SMS <ArrowRight className="h-4 w-4" /></span>
                          )}
                        </Button>

                        <p className="text-[11px] text-muted-foreground text-center leading-relaxed">
                          Un code à 6 chiffres sera envoyé à votre numéro par SMS.
                        </p>
                      </motion.div>
                    )}

                    {/* ── Vérification OTP (inscription) ── */}
                    {inscStep === 'otp' && (
                      <motion.div key="i-otp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="p-6 sm:p-8 space-y-5">
                        <div className="text-center">
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, delay: 0.1 }} className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 mb-4">
                            <MessageSquare className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
                          </motion.div>
                          <h2 className="text-lg font-bold">Vérification par SMS</h2>
                          <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                            Entrez le code envoyé à <span className="font-semibold text-foreground">{codePays} {telephone}</span>
                          </p>
                        </div>

                        {/* Info SMS */}
                        <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 rounded-xl p-3 text-center">
                          <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                            <Shield className="h-3.5 w-3.5 inline mr-1" />
                            {inscSmsInfo || 'Code envoyé par SMS'}
                          </p>
                        </div>

                        {/* Dev: afficher le code */}
                        {inscDevOtp && (
                          <DevOtpCard
                            code={inscDevOtp}
                            copied={inscCodeCopied}
                            onCopy={() => copyCode(inscDevOtp, setInscCodeCopied)}
                            label="Mode développement"
                          />
                        )}

                        <OtpSlots value={inscOtp} onChange={(v) => { setInscOtp(v); setInscOtpError('') }} />

                        {inscOtpError && (
                          <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-center gap-1.5 text-xs text-destructive font-medium">
                            <AlertCircle className="h-3.5 w-3.5" />
                            {inscOtpError}
                          </motion.div>
                        )}

                        <Button
                          onClick={verifyInscOtp}
                          disabled={inscOtp.length !== 6 || inscVerifying}
                          className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold h-12 text-sm shadow-lg shadow-emerald-500/20 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                        >
                          {inscVerifying ? (
                            <span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Vérification...</span>
                          ) : (
                            <span className="flex items-center gap-2"><Shield className="h-4 w-4" /> Vérifier et créer mon compte</span>
                          )}
                        </Button>

                        <div className="text-center">
                          {inscTimer > 0 ? (
                            <p className="text-xs text-muted-foreground">
                              Code valable encore <span className="font-bold text-foreground">{fmtTimer(inscTimer)}</span>
                            </p>
                          ) : (
                            <button
                              onClick={resendInscOtp}
                              disabled={inscSending}
                              className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline inline-flex items-center gap-1 disabled:opacity-50"
                            >
                              <RefreshCw className={`h-3 w-3 ${inscSending ? 'animate-spin' : ''}`} />
                              Renvoyer le code par SMS
                            </button>
                          )}
                        </div>

                        <button onClick={() => { setInscStep('form'); setInscTimer(0) }} className="text-xs text-muted-foreground hover:text-foreground transition-colors text-center w-full block">
                          <ArrowLeft className="h-3 w-3 inline mr-1" /> Modifier mes informations
                        </button>
                      </motion.div>
                    )}

                    {/* ── Succès inscription ── */}
                    {inscStep === 'success' && (
                      <motion.div key="i-ok" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }} className="p-8 sm:p-12 text-center space-y-4">
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, delay: 0.1 }} className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                          <svg className="h-8 w-8 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.2 }} strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </motion.div>
                        <h2 className="text-xl font-extrabold">Bienvenue, {prenom} !</h2>
                        <p className="text-sm text-muted-foreground">Votre compte a été créé avec succès.</p>
                        <p className="text-xs text-muted-foreground animate-pulse">Chargement de Studio Créatif...</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </TabsContent>

                {/* ═══════════ CONNEXION ═══════════ */}
                <TabsContent value="connexion">
                  <AnimatePresence mode="wait">

                    {/* ── Formulaire connexion ── */}
                    {loginStep === 'phone' && (
                      <motion.div key="l-phone" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="p-6 sm:p-8 space-y-5">
                        <div className="text-center mb-2">
                          <h2 className="text-lg font-bold">Connectez-vous</h2>
                          <p className="text-xs text-muted-foreground mt-1">Entrez votre numéro pour recevoir un code par SMS</p>
                        </div>

                        {loginError && (
                          <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/40 rounded-xl p-3 flex items-start gap-2">
                            <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                            <p className="text-xs text-red-700 dark:text-red-400 leading-relaxed">{loginError}</p>
                          </motion.div>
                        )}

                        <div className="space-y-1.5">
                          <Label className="text-xs font-semibold">Pays</Label>
                          <PaysSelect value={loginPaysIndex} onChange={setLoginPaysIndex} />
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-xs font-semibold">Numéro de téléphone *</Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10 pointer-events-none" />
                            <div className="absolute left-9 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground border-r border-border pr-2 h-5 flex items-center pointer-events-none">
                              {loginCode}
                            </div>
                            <Input type="tel" placeholder="70 00 00 00" value={loginPhone} onChange={(e) => { setLoginPhone(e.target.value); setLoginError('') }} className="pl-[5.5rem] h-11 text-sm" />
                          </div>
                        </div>

                        <Button
                          onClick={sendLoginOtp}
                          disabled={!loginPhone.trim() || loginSending}
                          className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:via-orange-600 hover:to-red-600 text-white font-bold h-12 text-sm shadow-lg shadow-amber-500/20 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loginSending ? (
                            <span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Envoi du SMS...</span>
                          ) : (
                            <span className="flex items-center gap-2"><MessageSquare className="h-4 w-4" /> Recevoir mon code par SMS <ArrowRight className="h-4 w-4" /></span>
                          )}
                        </Button>
                      </motion.div>
                    )}

                    {/* ── Vérification OTP (connexion) ── */}
                    {loginStep === 'otp' && (
                      <motion.div key="l-otp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="p-6 sm:p-8 space-y-5">
                        <div className="text-center">
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, delay: 0.1 }} className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 mb-4">
                            <MessageSquare className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
                          </motion.div>
                          <h2 className="text-lg font-bold">Vérification par SMS</h2>
                          <p className="text-xs text-muted-foreground mt-1.5">
                            Code pour <span className="font-semibold text-foreground">{loginCode} {loginPhone}</span>
                          </p>
                        </div>

                        <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 rounded-xl p-3 text-center">
                          <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                            <Shield className="h-3.5 w-3.5 inline mr-1" />
                            {loginSmsInfo || 'Code envoyé par SMS'}
                          </p>
                        </div>

                        {loginDevOtp && (
                          <DevOtpCard
                            code={loginDevOtp}
                            copied={loginCodeCopied}
                            onCopy={() => copyCode(loginDevOtp, setLoginCodeCopied)}
                            label="Mode développement"
                          />
                        )}

                        <OtpSlots value={loginOtp} onChange={(v) => { setLoginOtp(v); setLoginOtpError('') }} />

                        {loginOtpError && (
                          <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-center gap-1.5 text-xs text-destructive font-medium">
                            <AlertCircle className="h-3.5 w-3.5" />
                            {loginOtpError}
                          </motion.div>
                        )}

                        <Button
                          onClick={verifyLoginOtp}
                          disabled={loginOtp.length !== 6 || loginVerifying}
                          className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold h-12 text-sm shadow-lg shadow-emerald-500/20 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                        >
                          {loginVerifying ? (
                            <span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Vérification...</span>
                          ) : (
                            <span className="flex items-center gap-2"><Shield className="h-4 w-4" /> Vérifier et se connecter</span>
                          )}
                        </Button>

                        <div className="text-center">
                          {loginTimer > 0 ? (
                            <p className="text-xs text-muted-foreground">
                              Code valable encore <span className="font-bold text-foreground">{fmtTimer(loginTimer)}</span>
                            </p>
                          ) : (
                            <button
                              onClick={resendLoginOtp}
                              disabled={loginSending}
                              className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline inline-flex items-center gap-1 disabled:opacity-50"
                            >
                              <RefreshCw className={`h-3 w-3 ${loginSending ? 'animate-spin' : ''}`} />
                              Renvoyer le code par SMS
                            </button>
                          )}
                        </div>

                        <button onClick={() => { setLoginStep('phone'); setLoginTimer(0) }} className="text-xs text-muted-foreground hover:text-foreground transition-colors text-center w-full block">
                          <ArrowLeft className="h-3 w-3 inline mr-1" /> Modifier le numéro
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </TabsContent>
              </Tabs>
            </CardContent>
          </div>
        </Card>

        {/* ─── Bas de page ─── */}
        <div className="mt-6 flex items-center justify-center gap-6 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5"><Palette className="h-3.5 w-3.5 text-amber-500" /> Design</span>
          <span className="flex items-center gap-1.5"><Globe className="h-3.5 w-3.5 text-blue-500" /> Sites Web</span>
          <span className="flex items-center gap-1.5"><MonitorPlay className="h-3.5 w-3.5 text-purple-500" /> Vidéo</span>
          <span className="flex items-center gap-1.5"><GraduationCap className="h-3.5 w-3.5 text-emerald-500" /> Formation</span>
        </div>
      </motion.div>
    </div>
  )
}