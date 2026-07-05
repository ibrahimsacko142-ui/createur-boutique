'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, User, Globe, Shield, ArrowRight, RefreshCw, Sparkles, Palette, MonitorPlay, GraduationCap, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from '@/components/ui/input-otp'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

/* ─── Pays ─── */
const PAYS = [
  { code: '+223', nom: 'Mali', drapeau: '🇲🇱' },
  { code: '+221', nom: 'Sénégal', drapeau: '🇸🇳' },
  { code: '+225', nom: "Côte d'Ivoire", drapeau: '🇨🇮' },
  { code: '+226', nom: 'Burkina Faso', drapeau: '🇧🇫' },
  { code: '+227', nom: 'Niger', drapeau: '🇳🇪' },
  { code: '+228', nom: 'Togo', drapeau: '🇹🇬' },
  { code: '+229', nom: 'Bénin', drapeau: '🇧🇯' },
  { code: '+241', nom: 'Gabon', drapeau: '🇬🇦' },
  { code: '+243', nom: 'RD Congo', drapeau: '🇨🇩' },
  { code: '+242', nom: 'Congo', drapeau: '🇨🇬' },
  { code: '+237', nom: 'Cameroun', drapeau: '🇨🇲' },
  { code: '+235', nom: 'Tchad', drapeau: '🇹🇩' },
  { code: '+236', nom: 'Centrafrique', drapeau: '🇨🇫' },
  { code: '+240', nom: 'Guinée Équatoriale', drapeau: '🇬🇶' },
  { code: '+258', nom: 'Mozambique', drapeau: '🇲🇿' },
  { code: '+33', nom: 'France', drapeau: '🇫🇷' },
  { code: '+1', nom: 'États-Unis / Canada', drapeau: '🇺🇸' },
  { code: '+44', nom: 'Royaume-Uni', drapeau: '🇬🇧' },
  { code: '+212', nom: 'Maroc', drapeau: '🇲🇦' },
  { code: '+216', nom: 'Tunisie', drapeau: '🇹🇳' },
  { code: '+213', nom: 'Algérie', drapeau: '🇩🇿' },
  { code: '+20', nom: 'Égypte', drapeau: '🇪🇬' },
  { code: '+234', nom: 'Nigeria', drapeau: '🇳🇬' },
  { code: '+254', nom: 'Kenya', drapeau: '🇰🇪' },
  { code: '+27', nom: 'Afrique du Sud', drapeau: '🇿🇦' },
  { code: '+41', nom: 'Suisse', drapeau: '🇨🇭' },
  { code: '+32', nom: 'Belgique', drapeau: '🇧🇪' },
  { code: '+49', nom: 'Allemagne', drapeau: '🇩🇪' },
  { code: '+39', nom: 'Italie', drapeau: '🇮🇹' },
  { code: '+34', nom: 'Espagne', drapeau: '🇪🇸' },
  { code: '+86', nom: 'Chine', drapeau: '🇨🇳' },
]

type Step = 'form' | 'otp' | 'success'

interface UserData {
  prenom: string
  nom: string
  telephone: string
  pays: string
  codePays: string
}

export default function LoginPage({ onLogin }: { onLogin: (user: UserData) => void }) {
  /* ─── Inscription state ─── */
  const [prenom, setPrenom] = useState('')
  const [nom, setNom] = useState('')
  const [telephone, setTelephone] = useState('')
  const [paysIndex, setPaysIndex] = useState(0)

  /* ─── Connexion state ─── */
  const [loginPhone, setLoginPhone] = useState('')
  const [loginPaysIndex, setLoginPaysIndex] = useState(0)

  /* ─── OTP state ─── */
  const [step, setStep] = useState<Step>('form')
  const [otp, setOtp] = useState('')
  const [generatedOtp, setGeneratedOtp] = useState('')
  const [otpError, setOtpError] = useState('')
  const [otpExpiry, setOtpExpiry] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'inscription' | 'connexion'>('inscription')
  const [loginOtp, setLoginOtp] = useState('')
  const [loginGeneratedOtp, setLoginGeneratedOtp] = useState('')
  const [loginStep, setLoginStep] = useState<'phone' | 'otp'>('phone')
  const [loginOtpError, setLoginOtpError] = useState('')
  const [codeCopied, setCodeCopied] = useState(false)
  const [loginCodeCopied, setLoginCodeCopied] = useState(false)

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const codePays = PAYS[paysIndex].code
  const loginCode = PAYS[loginPaysIndex].code

  /* ─── Timer ─── */
  useEffect(() => {
    if (otpExpiry > 0) {
      timerRef.current = setInterval(() => {
        setOtpExpiry(prev => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [otpExpiry])

  /* ─── Generate OTP ─── */
  const generateOtp = useCallback((): string => {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }, [])

  /* ─── Send OTP (inscription) ─── */
  const sendOtpInscription = () => {
    if (!prenom.trim() || !nom.trim() || !telephone.trim()) return
    setIsLoading(true)
    const code = generateOtp()
    setGeneratedOtp(code)
    setOtp('')
    setOtpError('')
    setOtpExpiry(120)
    setCodeCopied(false)
    setTimeout(() => { setStep('otp'); setIsLoading(false) }, 600)
  }

  /* ─── Send OTP (connexion) ─── */
  const sendOtpConnexion = () => {
    if (!loginPhone.trim()) return
    setIsLoading(true)
    const code = generateOtp()
    setLoginGeneratedOtp(code)
    setLoginOtp('')
    setLoginOtpError('')
    setOtpExpiry(120)
    setLoginCodeCopied(false)
    setTimeout(() => { setLoginStep('otp'); setIsLoading(false) }, 600)
  }

  /* ─── Verify OTP (inscription) ─── */
  const verifyOtp = () => {
    if (otp.length !== 6) { setOtpError('Entrez les 6 chiffres'); return }
    if (otp !== generatedOtp) { setOtpError('Code incorrect'); return }
    if (otpExpiry <= 0) { setOtpError('Code expiré. Demandez un nouveau code.'); return }
    const userData: UserData = { prenom: prenom.trim(), nom: nom.trim(), telephone, pays: PAYS[paysIndex].nom, codePays }
    localStorage.setItem('studio_creatif_user', JSON.stringify(userData))
    localStorage.setItem('studio_creatif_auth', 'true')
    setStep('success')
    setTimeout(() => onLogin(userData), 1200)
  }

  /* ─── Verify OTP (connexion) ─── */
  const verifyLoginOtp = () => {
    if (loginOtp.length !== 6) { setLoginOtpError('Entrez les 6 chiffres'); return }
    if (loginOtp !== loginGeneratedOtp) { setLoginOtpError('Code incorrect'); return }
    if (otpExpiry <= 0) { setLoginOtpError('Code expiré. Demandez un nouveau code.'); return }
    const userData: UserData = { prenom: '', nom: '', telephone: loginPhone, pays: PAYS[loginPaysIndex].nom, codePays: loginCode }
    localStorage.setItem('studio_creatif_user', JSON.stringify(userData))
    localStorage.setItem('studio_creatif_auth', 'true')
    onLogin(userData)
  }

  /* ─── Copy code ─── */
  const copyCode = (code: string, type: 'insc' | 'login') => {
    navigator.clipboard.writeText(code)
    if (type === 'insc') setCodeCopied(true)
    else setLoginCodeCopied(true)
    setTimeout(() => { if (type === 'insc') setCodeCopied(false); else setLoginCodeCopied(false) }, 2000)
  }

  const formatTimer = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`

  /* ─── OTP display card ─── */
  const OtpCodeCard = ({ code, copied, onCopy, label }: { code: string; copied: boolean; onCopy: () => void; label: string }) => (
    <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl p-5 text-center space-y-3">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</p>
      <div className="flex items-center justify-center gap-2">
        <span className="text-3xl sm:text-4xl font-mono font-extrabold tracking-[0.3em] text-foreground">
          {code.slice(0, 3)}<span className="text-muted-foreground/40 mx-1">-</span>{code.slice(3)}
        </span>
        <button
          onClick={onCopy}
          className="ml-2 p-2 rounded-lg hover:bg-background transition-colors"
          title="Copier le code"
        >
          {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4 text-muted-foreground" />}
        </button>
      </div>
      <p className="text-[11px] text-muted-foreground">Ce code expire dans <span className="font-bold text-foreground">{formatTimer(otpExpiry)}</span></p>
    </div>
  )

  /* ─── OTP Input slots ─── */
  const OtpInput = ({ value, onChange, error, onVerify, disabled, label }: {
    value: string; onChange: (v: string) => void; error: string;
    onVerify: () => void; disabled: boolean; label: string
  }) => (
    <>
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
      {error && (
        <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-destructive text-center font-medium">{error}</motion.p>
      )}
      <Button
        onClick={onVerify}
        disabled={disabled}
        className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold h-12 text-sm shadow-lg shadow-emerald-500/20 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
      >
        <Shield className="h-4 w-4 mr-2" /> {label}
      </Button>
    </>
  )

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
        {/* Logo */}
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

        {/* Main Card */}
        <Card className="border-0 shadow-2xl shadow-amber-500/10 overflow-hidden">
          <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 p-1">
            <CardContent className="p-0 bg-background">
              <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v as 'inscription' | 'connexion'); setStep('form'); setLoginStep('phone') }}>
                <div className="flex border-b">
                  <TabsList className="w-full h-12 bg-transparent rounded-none p-0 gap-0">
                    <TabsTrigger
                      value="inscription"
                      className="flex-1 h-full rounded-none data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-amber-500 text-sm font-semibold"
                    >
                      Inscription
                    </TabsTrigger>
                    <TabsTrigger
                      value="connexion"
                      className="flex-1 h-full rounded-none data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-amber-500 text-sm font-semibold"
                    >
                      Connexion
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* ═══ INSCRIPTION ═══ */}
                <TabsContent value="inscription">
                  <AnimatePresence mode="wait">
                    {step === 'form' && (
                      <motion.div key="insc-form" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="p-6 sm:p-8 space-y-5">
                        <div className="text-center mb-2">
                          <h2 className="text-lg font-bold">Créez votre compte</h2>
                          <p className="text-xs text-muted-foreground mt-1">Rejoignez Studio Créatif gratuitement</p>
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

                        {/* Pays — select natif fiable */}
                        <div className="space-y-1.5">
                          <Label className="text-xs font-semibold">Pays *</Label>
                          <div className="relative">
                            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10 pointer-events-none" />
                            <select
                              value={paysIndex}
                              onChange={(e) => setPaysIndex(Number(e.target.value))}
                              className="h-11 w-full rounded-md border border-input bg-background pl-9 pr-8 text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500"
                            >
                              {PAYS.map((p, i) => (
                                <option key={p.code} value={i}>{p.drapeau}  {p.nom} ({p.code})</option>
                              ))}
                            </select>
                            <svg className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                          </div>
                        </div>

                        {/* Téléphone */}
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
                          onClick={sendOtpInscription}
                          disabled={!prenom.trim() || !nom.trim() || !telephone.trim() || isLoading}
                          className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:via-orange-600 hover:to-red-600 text-white font-bold h-12 text-sm shadow-lg shadow-amber-500/20 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isLoading ? (
                            <span className="flex items-center gap-2"><RefreshCw className="h-4 w-4 animate-spin" /> Envoi en cours...</span>
                          ) : (
                            <span className="flex items-center gap-2">Obtenir mon code OTP <ArrowRight className="h-4 w-4" /></span>
                          )}
                        </Button>

                        <p className="text-[11px] text-muted-foreground text-center leading-relaxed">
                          Un code de vérification à 6 chiffres vous sera attribué.
                        </p>
                      </motion.div>
                    )}

                    {step === 'otp' && (
                      <motion.div key="insc-otp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="p-6 sm:p-8 space-y-5">
                        <div className="text-center">
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, delay: 0.1 }} className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 mb-4">
                            <Shield className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
                          </motion.div>
                          <h2 className="text-lg font-bold">Vérification OTP</h2>
                          <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                            Entrez le code ci-dessous pour <span className="font-semibold text-foreground">{codePays} {telephone}</span>
                          </p>
                        </div>

                        <OtpCodeCard code={generatedOtp} copied={codeCopied} onCopy={() => copyCode(generatedOtp, 'insc')} label="Votre code de vérification" />

                        <OtpInput value={otp} onChange={(v) => { setOtp(v); setOtpError('') }} error={otpError} onVerify={verifyOtp} disabled={otp.length !== 6} label="Vérifier et continuer" />

                        <div className="text-center">
                          {otpExpiry > 0 ? (
                            <p className="text-xs text-muted-foreground">Code valable encore <span className="font-bold text-foreground">{formatTimer(otpExpiry)}</span></p>
                          ) : (
                            <button
                              onClick={() => {
                                const code = generateOtp()
                                setGeneratedOtp(code); setOtp(''); setOtpError(''); setOtpExpiry(120); setCodeCopied(false)
                              }}
                              className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline inline-flex items-center gap-1"
                            >
                              <RefreshCw className="h-3 w-3" /> Générer un nouveau code
                            </button>
                          )}
                        </div>

                        <button onClick={() => setStep('form')} className="text-xs text-muted-foreground hover:text-foreground transition-colors text-center w-full block">
                          Modifier mes informations
                        </button>
                      </motion.div>
                    )}

                    {step === 'success' && (
                      <motion.div key="insc-success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }} className="p-8 sm:p-12 text-center space-y-4">
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

                {/* ═══ CONNEXION ═══ */}
                <TabsContent value="connexion">
                  <AnimatePresence mode="wait">
                    {loginStep === 'phone' && (
                      <motion.div key="login-phone" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="p-6 sm:p-8 space-y-5">
                        <div className="text-center mb-2">
                          <h2 className="text-lg font-bold">Connectez-vous</h2>
                          <p className="text-xs text-muted-foreground mt-1">Entrez votre numéro pour recevoir un code</p>
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-xs font-semibold">Pays</Label>
                          <div className="relative">
                            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10 pointer-events-none" />
                            <select
                              value={loginPaysIndex}
                              onChange={(e) => setLoginPaysIndex(Number(e.target.value))}
                              className="h-11 w-full rounded-md border border-input bg-background pl-9 pr-8 text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500"
                            >
                              {PAYS.map((p, i) => (
                                <option key={p.code} value={i}>{p.drapeau}  {p.nom} ({p.code})</option>
                              ))}
                            </select>
                            <svg className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-xs font-semibold">Numéro de téléphone *</Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10 pointer-events-none" />
                            <div className="absolute left-9 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground border-r border-border pr-2 h-5 flex items-center pointer-events-none">
                              {loginCode}
                            </div>
                            <Input type="tel" placeholder="70 00 00 00" value={loginPhone} onChange={(e) => setLoginPhone(e.target.value)} className="pl-[5.5rem] h-11 text-sm" />
                          </div>
                        </div>

                        <Button
                          onClick={sendOtpConnexion}
                          disabled={!loginPhone.trim() || isLoading}
                          className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:via-orange-600 hover:to-red-600 text-white font-bold h-12 text-sm shadow-lg shadow-amber-500/20 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isLoading ? (
                            <span className="flex items-center gap-2"><RefreshCw className="h-4 w-4 animate-spin" /> Envoi en cours...</span>
                          ) : (
                            <span className="flex items-center gap-2">Obtenir mon code OTP <ArrowRight className="h-4 w-4" /></span>
                          )}
                        </Button>
                      </motion.div>
                    )}

                    {loginStep === 'otp' && (
                      <motion.div key="login-otp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="p-6 sm:p-8 space-y-5">
                        <div className="text-center">
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, delay: 0.1 }} className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 mb-4">
                            <Shield className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
                          </motion.div>
                          <h2 className="text-lg font-bold">Vérification OTP</h2>
                          <p className="text-xs text-muted-foreground mt-1.5">Code pour <span className="font-semibold text-foreground">{loginCode} {loginPhone}</span></p>
                        </div>

                        <OtpCodeCard code={loginGeneratedOtp} copied={loginCodeCopied} onCopy={() => copyCode(loginGeneratedOtp, 'login')} label="Votre code de vérification" />

                        <OtpInput value={loginOtp} onChange={(v) => { setLoginOtp(v); setLoginOtpError('') }} error={loginOtpError} onVerify={verifyLoginOtp} disabled={loginOtp.length !== 6} label="Vérifier et se connecter" />

                        <div className="text-center">
                          {otpExpiry > 0 ? (
                            <p className="text-xs text-muted-foreground">Code valable encore <span className="font-bold text-foreground">{formatTimer(otpExpiry)}</span></p>
                          ) : (
                            <button
                              onClick={() => {
                                const code = generateOtp()
                                setLoginGeneratedOtp(code); setLoginOtp(''); setLoginOtpError(''); setOtpExpiry(120); setLoginCodeCopied(false)
                              }}
                              className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline inline-flex items-center gap-1"
                            >
                              <RefreshCw className="h-3 w-3" /> Générer un nouveau code
                            </button>
                          )}
                        </div>

                        <button onClick={() => setLoginStep('phone')} className="text-xs text-muted-foreground hover:text-foreground transition-colors text-center w-full block">
                          Modifier le numéro
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </TabsContent>
              </Tabs>
            </CardContent>
          </div>
        </Card>

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