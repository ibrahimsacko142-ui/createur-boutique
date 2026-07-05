'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Phone, Globe, Shield, ArrowRight, Sparkles,
  Palette, MonitorPlay, GraduationCap, RefreshCw,
  Copy, Check, AlertCircle, ArrowLeft, MessageSquare, Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from '@/components/ui/input-otp'

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

  /* ─── State ─── */
  const [phone, setPhone] = useState('')
  const [paysIndex, setPaysIndex] = useState(0)
  const [step, setStep] = useState<LoginStep>('phone')
  const [otp, setOtp] = useState('')
  const [otpError, setOtpError] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [codeCopied, setCodeCopied] = useState(false)
  const [sending, setSending] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [smsInfo, setSmsInfo] = useState('')
  const [timer, setTimer] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const codePays = PAYS[paysIndex].code

  /* ─── Timer ─── */
  useEffect(() => {
    if (timer > 0) {
      timerRef.current = setInterval(() => setTimer(p => { if (p <= 1) { clearInterval(timerRef.current!); return 0 } return p - 1 }), 1000)
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [timer > 0]) // eslint-disable-line react-hooks/exhaustive-deps

  const fmtTimer = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`

  /* ═══════════════════════════════════════════════════════════════
     ENVOI OTP
     ═══════════════════════════════════════════════════════════════ */
  const sendOtp = useCallback(async () => {
    if (!phone.trim()) return
    setSending(true)
    setOtpError('')
    setOtpCode('')
    try {
      const fullPhone = `${codePays}${phone.replace(/\s/g, '')}`
      const res = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: fullPhone }),
      })
      const data = await res.json()
      if (!data.success) { setOtpError(data.error || "Erreur d'envoi."); setSending(false); return }
      setSmsInfo(data.message || '')
      if (data.otp) setOtpCode(data.otp)
      setOtp('')
      setTimer(300)
      setStep('otp')
    } catch { setOtpError('Erreur réseau.') } finally { setSending(false) }
  }, [phone, codePays])

  const resendOtp = useCallback(async () => {
    setOtp(''); setOtpError(''); setOtpCode(''); setSending(true)
    try {
      const fullPhone = `${codePays}${phone.replace(/\s/g, '')}`
      const res = await fetch('/api/send-otp', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ phone: fullPhone }) })
      const data = await res.json()
      if (data.success) { setSmsInfo(data.message || ''); if (data.otp) setOtpCode(data.otp); setTimer(300) }
      else { setOtpError(data.error || "Erreur d'envoi.") }
    } catch { setOtpError('Erreur réseau.') } finally { setSending(false) }
  }, [codePays, phone])

  /* ═══════════════════════════════════════════════════════════════
     VÉRIFICATION OTP
     ═══════════════════════════════════════════════════════════════ */
  const verifyOtp = useCallback(async () => {
    if (otp.length !== 6) { setOtpError('Entrez les 6 chiffres'); return }
    setVerifying(true); setOtpError('')
    try {
      const res = await fetch('/api/verify-otp', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ otp }) })
      const data = await res.json()
      if (!data.success) { setOtpError(data.error || 'Code incorrect.'); setVerifying(false); return }
      const userData: UserData = { prenom: '', nom: '', telephone: phone, pays: PAYS[paysIndex].nom, codePays }
      localStorage.setItem('studio_creatif_user', JSON.stringify(userData))
      localStorage.setItem('studio_creatif_auth', 'true')
      onLogin(userData)
    } catch { setOtpError('Erreur réseau.') } finally { setVerifying(false) }
  }, [otp, phone, paysIndex, codePays, onLogin])

  /* ─── Helpers ─── */
  const copyCode = () => { navigator.clipboard.writeText(otpCode); setCodeCopied(true); setTimeout(() => setCodeCopied(false), 2000) }

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
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, delay: 0.1 }} className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 shadow-xl shadow-amber-500/25 mb-4">
            <Sparkles className="h-8 w-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-extrabold tracking-tight">Studio Créatif</h1>
          <p className="text-muted-foreground text-sm mt-1">Créativité, Expertise, Excellence</p>
        </div>

        {/* Carte */}
        <Card className="border-0 shadow-2xl shadow-amber-500/10 overflow-hidden">
          <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 p-1">
            <CardContent className="p-0 bg-background">
              <AnimatePresence mode="wait">

                {/* ═══════ ÉTAPE 1 : Téléphone ═══════ */}
                {step === 'phone' && (
                  <motion.div key="phone" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="p-6 sm:p-8 space-y-5">
                    <div className="text-center mb-2">
                      <h2 className="text-lg font-bold">Connexion</h2>
                      <p className="text-xs text-muted-foreground mt-1">Entrez votre numéro pour recevoir un code de vérification</p>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Pays</Label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10 pointer-events-none" />
                        <select
                          value={paysIndex}
                          onChange={(e) => setPaysIndex(Number(e.target.value))}
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
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Numéro de téléphone *</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10 pointer-events-none" />
                        <div className="absolute left-9 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground border-r border-border pr-2 h-5 flex items-center pointer-events-none">
                          {codePays}
                        </div>
                        <Input type="tel" placeholder="70 00 00 00" value={phone} onChange={(e) => setPhone(e.target.value)} className="pl-[5.5rem] h-11 text-sm" />
                      </div>
                    </div>

                    <Button
                      onClick={sendOtp}
                      disabled={!phone.trim() || sending}
                      className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:via-orange-600 hover:to-red-600 text-white font-bold h-12 text-sm shadow-lg shadow-amber-500/20 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {sending ? (
                        <span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Envoi en cours...</span>
                      ) : (
                        <span className="flex items-center gap-2"><MessageSquare className="h-4 w-4" /> Recevoir mon code <ArrowRight className="h-4 w-4" /></span>
                      )}
                    </Button>
                  </motion.div>
                )}

                {/* ═══════ ÉTAPE 2 : Vérification OTP ═══════ */}
                {step === 'otp' && (
                  <motion.div key="otp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="p-6 sm:p-8 space-y-5">
                    <div className="text-center">
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, delay: 0.1 }} className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 mb-4">
                        <MessageSquare className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
                      </motion.div>
                      <h2 className="text-lg font-bold">Vérification</h2>
                      <p className="text-xs text-muted-foreground mt-1.5">
                        Code pour <span className="font-semibold text-foreground">{codePays} {phone}</span>
                      </p>
                    </div>

                    <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 rounded-xl p-3 text-center">
                      <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                        <Shield className="h-3.5 w-3.5 inline mr-1" />
                        {smsInfo || 'Code de vérification généré'}
                      </p>
                    </div>

                    {otpCode && (
                      <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl p-5 text-center space-y-3">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Votre code de vérification</p>
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-3xl sm:text-4xl font-mono font-extrabold tracking-[0.3em] text-foreground">
                            {otpCode.slice(0, 3)}<span className="text-muted-foreground/40 mx-1">-</span>{otpCode.slice(3)}
                          </span>
                          <button onClick={copyCode} className="ml-2 p-2 rounded-lg hover:bg-background transition-colors" title="Copier">
                            {codeCopied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4 text-muted-foreground" />}
                          </button>
                        </div>
                        <p className="text-[11px] text-muted-foreground">Copiez ce code et entrez-le ci-dessous.</p>
                      </div>
                    )}

                    <div className="flex justify-center">
                      <InputOTP maxLength={6} value={otp} onChange={(v) => { setOtp(v); setOtpError('') }} containerClassName="gap-2">
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

                    {otpError && (
                      <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-center gap-1.5 text-xs text-destructive font-medium">
                        <AlertCircle className="h-3.5 w-3.5" /> {otpError}
                      </motion.div>
                    )}

                    <Button
                      onClick={verifyOtp}
                      disabled={otp.length !== 6 || verifying}
                      className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold h-12 text-sm shadow-lg shadow-emerald-500/20 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                    >
                      {verifying ? (
                        <span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Vérification...</span>
                      ) : (
                        <span className="flex items-center gap-2"><Shield className="h-4 w-4" /> Vérifier et se connecter</span>
                      )}
                    </Button>

                    <div className="text-center">
                      {timer > 0 ? (
                        <p className="text-xs text-muted-foreground">
                          Code valable encore <span className="font-bold text-foreground">{fmtTimer(timer)}</span>
                        </p>
                      ) : (
                        <button onClick={resendOtp} disabled={sending} className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline inline-flex items-center gap-1 disabled:opacity-50">
                          <RefreshCw className={`h-3 w-3 ${sending ? 'animate-spin' : ''}`} /> Renvoyer le code
                        </button>
                      )}
                    </div>

                    <button onClick={() => { setStep('phone'); setTimer(0) }} className="text-xs text-muted-foreground hover:text-foreground transition-colors text-center w-full block">
                      <ArrowLeft className="h-3 w-3 inline mr-1" /> Modifier le numéro
                    </button>
                  </motion.div>
                )}

              </AnimatePresence>
            </CardContent>
          </div>
        </Card>

        {/* Bas de page */}
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