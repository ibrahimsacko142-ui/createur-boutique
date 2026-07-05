'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Phone, User, Globe, Shield, ArrowRight, Sparkles,
  Palette, MonitorPlay, GraduationCap, QrCode, Key,
  Copy, Check, Smartphone, Clock, AlertCircle, ArrowLeft
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from '@/components/ui/input-otp'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import * as OTPAuth from 'otpauth'

/* ═══════════════════════════════════════════════════════════════
   PAYS
   ═══════════════════════════════════════════════════════════════ */
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
  { code: '+20', nom: 'Égypte', drapeau: '🇪🇬' },
  { code: '+234', nom: 'Nigeria', drapeau: '🇳🇬' },
  { code: '+233', nom: 'Ghana', drapeau: '🇬🇭' },
  { code: '+224', nom: 'Guinée', drapeau: '🇬🇳' },
  { code: '+221', nom: 'Guinée-Bissau', drapeau: '🇬🇼' },
  { code: '+245', nom: 'Guinée-Bissau', drapeau: '🇬🇼' },
  { code: '+248', nom: 'Seychelles', drapeau: '🇸🇨' },
  { code: '+230', nom: 'Maurice', drapeau: '🇲🇺' },
  { code: '+261', nom: 'Madagascar', drapeau: '🇲🇬' },
  { code: '+250', nom: 'Rwanda', drapeau: '🇷🇼' },
  { code: '+257', nom: 'Burundi', drapeau: '🇧🇮' },
  { code: '+255', nom: 'Tanzanie', drapeau: '🇹🇿' },
]

/* ═══════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════ */
type InscStep = 'form' | 'qr' | 'otp' | 'success'
type LoginStep = 'phone' | 'otp' | 'error'

interface UserData {
  prenom: string
  nom: string
  telephone: string
  pays: string
  codePays: string
}

/* ═══════════════════════════════════════════════════════════════
   QR CODE GENERATOR (dynamic import pour éviter SSR)
   ═══════════════════════════════════════════════════════════════ */
async function generateQRDataURL(uri: string): Promise<string> {
  const QRCode = (await import('qrcode')).default
  return QRCode.toDataURL(uri, {
    width: 240,
    margin: 2,
    color: { dark: '#000000', light: '#ffffff' },
  })
}

/* ═══════════════════════════════════════════════════════════════
   COMPOSANT PRINCIPAL
   ═══════════════════════════════════════════════════════════════ */
export default function LoginPage({ onLogin }: { onLogin: (user: UserData) => void }) {

  /* ─── Inscription state ─── */
  const [prenom, setPrenom] = useState('')
  const [nom, setNom] = useState('')
  const [telephone, setTelephone] = useState('')
  const [paysIndex, setPaysIndex] = useState(0)

  /* ─── Connexion state ─── */
  const [loginPhone, setLoginPhone] = useState('')
  const [loginPaysIndex, setLoginPaysIndex] = useState(0)

  /* ─── TOTP state ─── */
  const [inscStep, setInscStep] = useState<InscStep>('form')
  const [loginStep, setLoginStep] = useState<LoginStep>('phone')
  const [totpSecret, setTotpSecret] = useState('')
  const [qrDataUrl, setQrDataUrl] = useState('')
  const [inscTotp, setInscTotp] = useState<OTPAuth.TOTP | null>(null)
  const [loginTotp, setLoginTotp] = useState<OTPAuth.TOTP | null>(null)

  /* ─── OTP input state ─── */
  const [inscOtp, setInscOtp] = useState('')
  const [inscOtpError, setInscOtpError] = useState('')
  const [loginOtp, setLoginOtp] = useState('')
  const [loginOtpError, setLoginOtpError] = useState('')

  /* ─── UI state ─── */
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'inscription' | 'connexion'>('inscription')
  const [secretCopied, setSecretCopied] = useState(false)
  const [loginError, setLoginError] = useState('')

  /* ─── TOTP countdown (synchronisé avec les tranches de 30s) ─── */
  const [totpCountdown, setTotpCountdown] = useState(30)

  useEffect(() => {
    const update = () => setTotpCountdown(30 - (Math.floor(Date.now() / 1000) % 30))
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])

  const codePays = PAYS[paysIndex].code
  const loginCode = PAYS[loginPaysIndex].code

  /* ═══════════════════════════════════════════════════════════════
     INSCRIPTION : formulaire → QR → OTP → succès
     ═══════════════════════════════════════════════════════════════ */

  /** Étape 1 → 2 : Générer le TOTP et le QR code */
  const handleInscriptionSubmit = useCallback(async () => {
    if (!prenom.trim() || !nom.trim() || !telephone.trim()) return
    setIsLoading(true)
    try {
      const secret = new OTPAuth.Secret()
      const totp = new OTPAuth.TOTP({
        issuer: 'Studio Créatif',
        label: `${prenom.trim()} ${nom.trim()}`,
        algorithm: 'SHA1',
        digits: 6,
        period: 30,
        secret,
      })
      const uri = totp.toString()
      const qr = await generateQRDataURL(uri)
      setTotpSecret(secret.base32)
      setQrDataUrl(qr)
      setInscTotp(totp)
      setInscOtp('')
      setInscOtpError('')
      setInscStep('qr')
    } catch {
      setInscOtpError('Erreur de génération du QR code. Réessayez.')
    } finally {
      setIsLoading(false)
    }
  }, [prenom, nom, telephone])

  /** Étape 2 → 3 : L'utilisateur a scanné le QR, passe à la saisie du code */
  const goToOtpStep = useCallback(() => {
    setInscOtp('')
    setInscOtpError('')
    setInscStep('otp')
  }, [])

  /** Étape 3 : Vérifier le code TOTP saisi */
  const verifyInscOtp = useCallback(() => {
    if (!inscTotp) return
    if (inscOtp.length !== 6) {
      setInscOtpError('Entrez les 6 chiffres')
      return
    }
    const delta = inscTotp.validate({ token: inscOtp, window: 1 })
    if (delta === null) {
      setInscOtpError('Code incorrect. Vérifiez votre Google Authenticator.')
      return
    }
    /* Succès — sauvegarder */
    const userData: UserData = {
      prenom: prenom.trim(),
      nom: nom.trim(),
      telephone,
      pays: PAYS[paysIndex].nom,
      codePays,
    }
    localStorage.setItem('studio_creatif_user', JSON.stringify(userData))
    localStorage.setItem('studio_creatif_auth', 'true')
    localStorage.setItem('studio_creatif_totp_secret', totpSecret)
    setInscStep('success')
    setTimeout(() => onLogin(userData), 1200)
  }, [inscTotp, inscOtp, prenom, nom, telephone, paysIndex, codePays, totpSecret, onLogin])

  /* ═══════════════════════════════════════════════════════════════
     CONNEXION : téléphone → OTP → succès
     ═══════════════════════════════════════════════════════════════ */

  /** Étape 1 → 2 : Vérifier qu'un compte existe et préparer TOTP */
  const handleLoginSubmit = useCallback(() => {
    if (!loginPhone.trim()) return
    const savedSecret = localStorage.getItem('studio_creatif_totp_secret')
    if (!savedSecret) {
      setLoginError('Aucun compte trouvé sur cet appareil. Veuillez créer un compte.')
      setLoginStep('error')
      return
    }
    try {
      const secret = OTPAuth.Secret.fromBase32(savedSecret)
      const totp = new OTPAuth.TOTP({
        issuer: 'Studio Créatif',
        label: 'Studio Créatif',
        algorithm: 'SHA1',
        digits: 6,
        period: 30,
        secret,
      })
      setLoginTotp(totp)
      setLoginOtp('')
      setLoginOtpError('')
      setLoginError('')
      setLoginStep('otp')
    } catch {
      setLoginError('Erreur de lecture du compte. Veuillez vous inscrire à nouveau.')
      setLoginStep('error')
    }
  }, [loginPhone])

  /** Vérifier le code TOTP pour connexion */
  const verifyLoginOtp = useCallback(() => {
    if (!loginTotp) return
    if (loginOtp.length !== 6) {
      setLoginOtpError('Entrez les 6 chiffres')
      return
    }
    const delta = loginTotp.validate({ token: loginOtp, window: 1 })
    if (delta === null) {
      setLoginOtpError('Code incorrect. Vérifiez votre Google Authenticator.')
      return
    }
    const savedUser = localStorage.getItem('studio_creatif_user')
    const userData: UserData = savedUser
      ? JSON.parse(savedUser)
      : { prenom: '', nom: '', telephone: loginPhone, pays: PAYS[loginPaysIndex].nom, codePays: loginCode }
    localStorage.setItem('studio_creatif_auth', 'true')
    onLogin(userData)
  }, [loginTotp, loginOtp, loginPhone, loginPaysIndex, loginCode, onLogin])

  /* ═══════════════════════════════════════════════════════════════
     HELPERS
     ═══════════════════════════════════════════════════════════════ */

  const copySecret = useCallback(() => {
    navigator.clipboard.writeText(totpSecret)
    setSecretCopied(true)
    setTimeout(() => setSecretCopied(false), 2000)
  }, [totpSecret])

  /** Formater la clé secrète en blocs de 4 */
  const formatSecret = (s: string) => s.match(/.{1,4}/g)?.join(' ') ?? s

  /* ─── Sous-composants ─── */

  /** Indicateur d'étapes pour l'inscription */
  const StepIndicator = ({ current }: { current: number }) => {
    const steps = [
      { n: 1, label: 'Formulaire' },
      { n: 2, label: 'QR Code' },
      { n: 3, label: 'Vérification' },
    ]
    return (
      <div className="flex items-center justify-center gap-1 mb-6">
        {steps.map((s, i) => (
          <div key={s.n} className="flex items-center">
            <div className="flex items-center gap-1.5">
              <div
                className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors duration-300 ${
                  s.n <= current
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {s.n < current ? <Check className="h-3.5 w-3.5" /> : s.n}
              </div>
              <span className={`text-[10px] font-medium hidden sm:inline transition-colors duration-300 ${
                s.n <= current ? 'text-foreground' : 'text-muted-foreground'
              }`}>
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`w-6 h-0.5 mx-1 rounded transition-colors duration-300 ${
                s.n < current ? 'bg-amber-500' : 'bg-muted'
              }`} />
            )}
          </div>
        ))}
      </div>
    )
  }

  /** Compteur de temps restant avant changement du code TOTP */
  const CountdownBadge = () => {
    const pct = (totpCountdown / 30) * 100
    const color = totpCountdown <= 5 ? 'text-red-500' : totpCountdown <= 10 ? 'text-amber-500' : 'text-emerald-500'
    return (
      <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
        <Clock className={`h-3.5 w-3.5 ${color}`} />
        <span>Nouveau code dans <span className={`font-bold ${color}`}>{totpCountdown}s</span></span>
        <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden ml-1">
          <div
            className={`h-full rounded-full transition-all duration-1000 ease-linear ${
              totpCountdown <= 5 ? 'bg-red-500' : totpCountdown <= 10 ? 'bg-amber-500' : 'bg-emerald-500'
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    )
  }

  /** Slots de saisie OTP (réutilisable) */
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

  /** Sélecteur de pays (natif, fiable) */
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

  /* ═══════════════════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════════════════ */
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-background p-4">
      {/* Fond décoratif */}
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
                  setInscStep('form')
                  setLoginStep('phone')
                  setLoginError('')
                }}
              >
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

                {/* ═══════════════════════════════════════════════
                    INSCRIPTION
                    ═══════════════════════════════════════════════ */}
                <TabsContent value="inscription">
                  <AnimatePresence mode="wait">

                    {/* ─── ÉTAPE 1 : Formulaire ─── */}
                    {inscStep === 'form' && (
                      <motion.div
                        key="insc-form"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="p-6 sm:p-8 space-y-5"
                      >
                        <div className="text-center mb-2">
                          <h2 className="text-lg font-bold">Créez votre compte</h2>
                          <p className="text-xs text-muted-foreground mt-1">Rejoignez Studio Créatif avec Google Authenticator</p>
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
                          onClick={handleInscriptionSubmit}
                          disabled={!prenom.trim() || !nom.trim() || !telephone.trim() || isLoading}
                          className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:via-orange-600 hover:to-red-600 text-white font-bold h-12 text-sm shadow-lg shadow-amber-500/20 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isLoading ? (
                            <span className="flex items-center gap-2"><RefreshCw className="h-4 w-4 animate-spin" /> Génération en cours...</span>
                          ) : (
                            <span className="flex items-center gap-2">Configurer Google Authenticator <ArrowRight className="h-4 w-4" /></span>
                          )}
                        </Button>

                        <p className="text-[11px] text-muted-foreground text-center leading-relaxed">
                          Vous aurez besoin de l&#39;application <span className="font-semibold text-foreground">Google Authenticator</span> sur votre téléphone.
                        </p>
                      </motion.div>
                    )}

                    {/* ─── ÉTAPE 2 : QR Code ─── */}
                    {inscStep === 'qr' && (
                      <motion.div
                        key="insc-qr"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="p-6 sm:p-8 space-y-5"
                      >
                        <StepIndicator current={2} />

                        <div className="text-center">
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                            className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4"
                          >
                            <QrCode className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                          </motion.div>
                          <h2 className="text-lg font-bold">Scannez avec Google Authenticator</h2>
                          <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed max-w-xs mx-auto">
                            Ouvrez <span className="font-semibold text-foreground">Google Authenticator</span> sur votre téléphone et scannez ce QR code
                          </p>
                        </div>

                        {/* QR Code */}
                        <div className="flex justify-center">
                          <div className="bg-white rounded-2xl p-4 shadow-md border border-slate-200 dark:border-slate-700">
                            {qrDataUrl ? (
                              <img src={qrDataUrl} alt="QR Code Google Authenticator" className="w-[200px] h-[200px] sm:w-[220px] sm:h-[220px]" />
                            ) : (
                              <div className="w-[200px] h-[200px] sm:w-[220px] sm:h-[220px] flex items-center justify-center">
                                <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Clé secrète (saisie manuelle) */}
                        <div className="space-y-2">
                          <p className="text-[11px] text-muted-foreground text-center font-medium uppercase tracking-wider">
                            Ou saisissez manuellement la clé
                          </p>
                          <div className="bg-slate-100 dark:bg-slate-800 rounded-xl p-3 flex items-center justify-between gap-2">
                            <Key className="h-4 w-4 text-muted-foreground shrink-0" />
                            <span className="text-xs font-mono font-bold tracking-wider text-foreground text-center flex-1">
                              {formatSecret(totpSecret)}
                            </span>
                            <button
                              onClick={copySecret}
                              className="shrink-0 p-1.5 rounded-lg hover:bg-background transition-colors"
                              title="Copier la clé"
                            >
                              {secretCopied
                                ? <Check className="h-4 w-4 text-emerald-500" />
                                : <Copy className="h-4 w-4 text-muted-foreground" />
                              }
                            </button>
                          </div>
                        </div>

                        {/* Instructions rapides */}
                        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 rounded-xl p-3 space-y-2">
                          <p className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider">Comment faire</p>
                          <ol className="text-xs text-amber-900 dark:text-amber-200/80 space-y-1.5 list-decimal list-inside leading-relaxed">
                            <li>Ouvrez <span className="font-semibold">Google Authenticator</span> sur votre téléphone</li>
                            <li>Appuyez sur <span className="font-semibold">+</span> puis <span className="font-semibold">Scanner un QR code</span></li>
                            <li>Scannez le code ci-dessus ou saisissez la clé manuellement</li>
                          </ol>
                        </div>

                        {/* Bouton continuer */}
                        <Button
                          onClick={goToOtpStep}
                          className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold h-12 text-sm shadow-lg shadow-emerald-500/20 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
                        >
                          <span className="flex items-center gap-2">
                            <Smartphone className="h-4 w-4" />
                            J&apos;ai scanné le code, continuer
                            <ArrowRight className="h-4 w-4" />
                          </span>
                        </Button>

                        <button
                          onClick={() => { setInscStep('form'); setQrDataUrl(''); setTotpSecret('') }}
                          className="text-xs text-muted-foreground hover:text-foreground transition-colors text-center w-full block"
                        >
                          <ArrowLeft className="h-3 w-3 inline mr-1" />
                          Modifier mes informations
                        </button>
                      </motion.div>
                    )}

                    {/* ─── ÉTAPE 3 : Saisie du code TOTP ─── */}
                    {inscStep === 'otp' && (
                      <motion.div
                        key="insc-otp"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="p-6 sm:p-8 space-y-5"
                      >
                        <StepIndicator current={3} />

                        <div className="text-center">
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                            className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 mb-4"
                          >
                            <Shield className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
                          </motion.div>
                          <h2 className="text-lg font-bold">Vérification Google OTP</h2>
                          <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                            Ouvrez <span className="font-semibold text-foreground">Google Authenticator</span> et entrez le code à 6 chiffres affiché pour <span className="font-semibold text-foreground">Studio Créatif</span>
                          </p>
                        </div>

                        <CountdownBadge />

                        <OtpSlots value={inscOtp} onChange={(v) => { setInscOtp(v); setInscOtpError('') }} />

                        {inscOtpError && (
                          <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center justify-center gap-1.5 text-xs text-destructive font-medium"
                          >
                            <AlertCircle className="h-3.5 w-3.5" />
                            {inscOtpError}
                          </motion.div>
                        )}

                        <Button
                          onClick={verifyInscOtp}
                          disabled={inscOtp.length !== 6}
                          className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold h-12 text-sm shadow-lg shadow-emerald-500/20 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                        >
                          <Shield className="h-4 w-4 mr-2" />
                          Vérifier et créer mon compte
                        </Button>

                        <p className="text-[11px] text-muted-foreground text-center leading-relaxed">
                          Le code se renouvelle automatiquement toutes les 30 secondes.
                          <br />
                          Si le code ne fonctionne pas, attendez le prochain.
                        </p>

                        <button
                          onClick={() => setInscStep('qr')}
                          className="text-xs text-muted-foreground hover:text-foreground transition-colors text-center w-full block"
                        >
                          <ArrowLeft className="h-3 w-3 inline mr-1" />
                          Retour au QR code
                        </button>
                      </motion.div>
                    )}

                    {/* ─── ÉTAPE 4 : Succès ─── */}
                    {inscStep === 'success' && (
                      <motion.div
                        key="insc-success"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4 }}
                        className="p-8 sm:p-12 text-center space-y-4"
                      >
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                          className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30"
                        >
                          <svg className="h-8 w-8 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <motion.path
                              initial={{ pathLength: 0 }}
                              animate={{ pathLength: 1 }}
                              transition={{ duration: 0.5, delay: 0.2 }}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </motion.div>
                        <h2 className="text-xl font-extrabold">Bienvenue, {prenom} !</h2>
                        <p className="text-sm text-muted-foreground">Votre compte est vérifié avec Google Authenticator.</p>
                        <p className="text-xs text-muted-foreground animate-pulse">Chargement de Studio Créatif...</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </TabsContent>

                {/* ═══════════════════════════════════════════════
                    CONNEXION
                    ═══════════════════════════════════════════════ */}
                <TabsContent value="connexion">
                  <AnimatePresence mode="wait">

                    {/* ─── Étape téléphone ─── */}
                    {(loginStep === 'phone' || loginStep === 'error') && (
                      <motion.div
                        key="login-phone"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="p-6 sm:p-8 space-y-5"
                      >
                        <div className="text-center mb-2">
                          <h2 className="text-lg font-bold">Connectez-vous</h2>
                          <p className="text-xs text-muted-foreground mt-1">Vérification avec Google Authenticator</p>
                        </div>

                        {loginError && (
                          <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/40 rounded-xl p-3 flex items-start gap-2"
                          >
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
                          onClick={handleLoginSubmit}
                          disabled={!loginPhone.trim()}
                          className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:via-orange-600 hover:to-red-600 text-white font-bold h-12 text-sm shadow-lg shadow-amber-500/20 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span className="flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            Continuer avec Google OTP
                            <ArrowRight className="h-4 w-4" />
                          </span>
                        </Button>
                      </motion.div>
                    )}

                    {/* ─── Étape OTP connexion ─── */}
                    {loginStep === 'otp' && (
                      <motion.div
                        key="login-otp"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="p-6 sm:p-8 space-y-5"
                      >
                        <div className="text-center">
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                            className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 mb-4"
                          >
                            <Shield className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
                          </motion.div>
                          <h2 className="text-lg font-bold">Vérification Google OTP</h2>
                          <p className="text-xs text-muted-foreground mt-1.5">
                            Entrez le code de <span className="font-semibold text-foreground">Google Authenticator</span>
                          </p>
                        </div>

                        <CountdownBadge />

                        <OtpSlots value={loginOtp} onChange={(v) => { setLoginOtp(v); setLoginOtpError('') }} />

                        {loginOtpError && (
                          <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center justify-center gap-1.5 text-xs text-destructive font-medium"
                          >
                            <AlertCircle className="h-3.5 w-3.5" />
                            {loginOtpError}
                          </motion.div>
                        )}

                        <Button
                          onClick={verifyLoginOtp}
                          disabled={loginOtp.length !== 6}
                          className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold h-12 text-sm shadow-lg shadow-emerald-500/20 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                        >
                          <Shield className="h-4 w-4 mr-2" />
                          Vérifier et se connecter
                        </Button>

                        <p className="text-[11px] text-muted-foreground text-center leading-relaxed">
                          Le code se renouvelle automatiquement toutes les 30 secondes.
                        </p>

                        <button
                          onClick={() => setLoginStep('phone')}
                          className="text-xs text-muted-foreground hover:text-foreground transition-colors text-center w-full block"
                        >
                          <ArrowLeft className="h-3 w-3 inline mr-1" />
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