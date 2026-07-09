'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Lock, ShieldCheck, Loader2, CheckCircle2, AlertCircle, CreditCard, Smartphone, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

/* ═══ Types ═══ */
interface PaystackModalProps {
  isOpen: boolean
  onClose: () => void
  serviceName: string
  amount: number // en FCFA (ex: 15000)
  description?: string
}

type PaymentStep = 'form' | 'loading' | 'verifying' | 'success' | 'error'

/* ═══ Composant principal ═══ */
export default function PaystackModal({
  isOpen,
  onClose,
  serviceName,
  amount,
  description,
}: PaystackModalProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [step, setStep] = useState<PaymentStep>('form')
  const [errorMessage, setErrorMessage] = useState('')
  const [reference, setReference] = useState('')
  const [paystackScriptLoaded, setPaystackScriptLoaded] = useState(false)

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep('form')
      setName('')
      setEmail('')
      setPhone('')
      setErrorMessage('')
      setReference('')
    }
  }, [isOpen])

  // Load Paystack JS SDK once
  useEffect(() => {
    if (typeof window === 'undefined') return
    if ((window as unknown as Record<string, unknown>).PaystackPop) {
      setPaystackScriptLoaded(true)
      return
    }
    const script = document.createElement('script')
    script.src = 'https://js.paystack.co/v2/inline.js'
    script.async = true
    script.onload = () => setPaystackScriptLoaded(true)
    script.onerror = () => console.error('[Paystack] Failed to load SDK')
    document.head.appendChild(script)
  }, [])

  const formatPrice = (price: number) =>
    price.toLocaleString('fr-FR')

  const handlePay = useCallback(async () => {
    // Validation
    if (!name.trim()) {
      setErrorMessage('Veuillez entrer votre nom')
      return
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Veuillez entrer un email valide')
      return
    }
    if (!phone.trim() || phone.length < 8) {
      setErrorMessage('Veuillez entrer un numéro de téléphone valide')
      return
    }

    setErrorMessage('')
    setStep('loading')

    try {
      // 1. Initialize transaction on server
      const res = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          amount,
          serviceName,
          customerName: name.trim(),
          customerPhone: phone.trim(),
        }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        setStep('error')
        setErrorMessage(data.error || 'Erreur lors de l\'initialisation du paiement')
        return
      }

      setReference(data.reference)

      // 2. Open Paystack popup
      if (paystackScriptLoaded && (window as unknown as Record<string, unknown>).PaystackPop) {
        const PaystackPop = (window as unknown as { PaystackPop: { setup: (config: Record<string, unknown>) => { openIframe: () => void } } }).PaystackPop

        const handler = PaystackPop.setup({
          key: process.env.NEXT_PUBLIC_PAYSTACK_KEY,
          email: email.trim(),
          amount,
          reference: data.reference,
          currency: 'XOF',
          metadata: {
            service_name: serviceName,
            customer_name: name.trim(),
            customer_phone: phone.trim(),
          },
          onClose: () => {
            // User closed the popup without paying
            if (step === 'loading') {
              setStep('form')
              setErrorMessage('Paiement annulé. Vous pouvez réessayer.')
            }
          },
          callback: () => {
            // Payment completed on Paystack side — now verify server-side
            setStep('verifying')
            verifyPayment(data.reference)
          },
        })

        handler.openIframe()
      } else {
        // Fallback: redirect to Paystack hosted page
        window.location.href = data.authorization_url
      }
    } catch (err) {
      console.error('[Paystack Modal] Error:', err)
      setStep('error')
      setErrorMessage('Erreur de connexion. Vérifiez votre internet et réessayez.')
    }
  }, [name, email, phone, amount, serviceName, paystackScriptLoaded, step])

  const verifyPayment = useCallback(async (ref: string) => {
    try {
      // Retry verification up to 3 times with delays
      for (let attempt = 0; attempt < 3; attempt++) {
        const res = await fetch(`/api/paystack/verify?reference=${encodeURIComponent(ref)}`)
        const data = await res.json()

        if (data.verified) {
          setStep('success')
          return
        }

        // If Paystack says failed/abandoned
        if (data.status === 'failed' || data.status === 'abandoned') {
          setStep('error')
          setErrorMessage(`Paiement ${data.status === 'failed' ? 'échoué' : 'abandonné'} : ${data.gateway_response || 'Veuillez réessayer'}`)
          return
        }

        // Still processing — wait and retry
        if (attempt < 2) {
          await new Promise(resolve => setTimeout(resolve, 3000))
        }
      }

      // After 3 attempts, still not verified
      setStep('error')
      setErrorMessage('La vérification prend plus de temps que prévu. Votre paiement est en cours de traitement. Sacko vous confirmera par WhatsApp.')
    } catch (err) {
      console.error('[Paystack Verify] Error:', err)
      setStep('error')
      setErrorMessage('Erreur de vérification. Contactez Sacko sur WhatsApp pour confirmation.')
    }
  }, [])

  const handleSuccessClose = () => {
    // Open WhatsApp to confirm the order
    const waMessage = encodeURIComponent(
      `Bonjour Sacko ! Je viens de payer pour "${serviceName}" (${formatPrice(amount)} FCFA). Référence : ${reference}. Merci de confirmer la réception !`
    )
    window.open(`https://wa.me/22397787244?text=${waMessage}`, '_blank')
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={step === 'success' ? undefined : onClose}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-5 text-white">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIxLjUiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-50" />
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
                    <Lock className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base">Paiement sécurisé</h3>
                    <p className="text-emerald-100 text-xs">Via Paystack — Orange Money, Moov Money, Carte</p>
                  </div>
                </div>
                {step === 'form' && (
                  <button onClick={onClose} className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Body */}
            <div className="p-6">
              {/* ─── STEP: Form ─── */}
              {step === 'form' && (
                <div className="space-y-4">
                  {/* Order summary */}
                  <div className="rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 p-4">
                    <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold mb-1">Récapitulatif</p>
                    <p className="font-bold text-sm text-amber-800 dark:text-amber-200">{serviceName}</p>
                    {description && <p className="text-xs text-amber-600/70 dark:text-amber-400/70 mt-0.5">{description}</p>}
                    <p className="text-2xl font-extrabold text-amber-700 dark:text-amber-300 mt-2">
                      {formatPrice(amount)} <span className="text-sm font-normal">FCFA</span>
                    </p>
                  </div>

                  {/* Form fields */}
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs font-semibold">Votre nom complet</Label>
                      <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ex: Amadou Diallo"
                        className="mt-1 h-11"
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-semibold">Email <span className="text-red-500">*</span></Label>
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="votre@email.com"
                        className="mt-1 h-11"
                      />
                      <p className="text-[10px] text-muted-foreground mt-1">Requis par Paystack pour la facture</p>
                    </div>
                    <div>
                      <Label className="text-xs font-semibold">Numéro WhatsApp</Label>
                      <Input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Ex: 97 78 72 44"
                        className="mt-1 h-11"
                      />
                    </div>
                  </div>

                  {errorMessage && (
                    <div className="flex items-center gap-2 text-red-600 text-xs bg-red-50 dark:bg-red-950/20 rounded-lg px-3 py-2">
                      <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                      {errorMessage}
                    </div>
                  )}

                  <Button
                    onClick={handlePay}
                    className="w-full h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm shadow-lg shadow-emerald-500/20"
                  >
                    <ShieldCheck className="h-4 w-4 mr-2" />
                    Payer {formatPrice(amount)} FCFA
                  </Button>

                  {/* Trust indicators */}
                  <div className="flex items-center justify-center gap-4 pt-1">
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                      <Smartphone className="h-3 w-3" /> Orange Money
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                      <Smartphone className="h-3 w-3" /> Moov Money
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                      <CreditCard className="h-3 w-3" /> Carte
                    </div>
                  </div>

                  {/* WhatsApp fallback */}
                  <div className="text-center pt-2 border-t">
                    <p className="text-[10px] text-muted-foreground mb-2">Vous préférez payer via discussion ?</p>
                    <a
                      href={`https://wa.me/22397787244?text=${encodeURIComponent(`Bonjour ! Je veux payer pour "${serviceName}" (${formatPrice(amount)} FCFA). Mon nom : ${name || '...'}, Email : ${email || '...'}, Tél : ${phone || '...'}`)}`}
                      target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-semibold hover:underline"
                    >
                      <MessageCircle className="h-3.5 w-3.5" />
                      Payer via WhatsApp à la place
                    </a>
                  </div>
                </div>
              )}

              {/* ─── STEP: Loading ─── */}
              {step === 'loading' && (
                <div className="py-10 text-center">
                  <Loader2 className="h-10 w-10 text-emerald-500 animate-spin mx-auto mb-4" />
                  <p className="font-bold text-sm">Connexion au système de paiement...</p>
                  <p className="text-xs text-muted-foreground mt-1">Veuillez patienter</p>
                </div>
              )}

              {/* ─── STEP: Verifying ─── */}
              {step === 'verifying' && (
                <div className="py-10 text-center">
                  <Loader2 className="h-10 w-10 text-amber-500 animate-spin mx-auto mb-4" />
                  <p className="font-bold text-sm">Vérification du paiement en cours...</p>
                  <p className="text-xs text-muted-foreground mt-1">Confirmation par Paystack — quelques secondes</p>
                  <p className="text-[10px] text-muted-foreground mt-3 font-mono">Réf: {reference}</p>
                </div>
              )}

              {/* ─── STEP: Success ─── */}
              {step === 'success' && (
                <div className="py-8 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 15, stiffness: 200, delay: 0.2 }}
                    className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 mx-auto mb-4"
                  >
                    <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                  </motion.div>
                  <h3 className="text-lg font-extrabold text-emerald-700 dark:text-emerald-400">Paiement confirmé !</h3>
                  <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto">
                    Votre paiement de <strong className="text-foreground">{formatPrice(amount)} FCFA</strong> pour <strong className="text-foreground">{serviceName}</strong> a été vérifié avec succès.
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 font-mono">Réf: {reference}</p>

                  <div className="mt-6 space-y-3">
                    <Button
                      onClick={handleSuccessClose}
                      className="w-full h-11 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-sm"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Confirmer sur WhatsApp
                    </Button>
                    <button
                      onClick={onClose}
                      className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors py-2"
                    >
                      Fermer
                    </button>
                  </div>
                </div>
              )}

              {/* ─── STEP: Error ─── */}
              {step === 'error' && (
                <div className="py-8 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 mx-auto mb-4">
                    <AlertCircle className="h-8 w-8 text-red-500" />
                  </div>
                  <h3 className="text-lg font-extrabold text-red-600 dark:text-red-400">Paiement non confirmé</h3>
                  <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto">{errorMessage}</p>

                  <div className="mt-6 space-y-3">
                    <Button
                      onClick={() => { setStep('form'); setErrorMessage('') }}
                      className="w-full h-11 border-2 border-amber-300 text-amber-700 hover:bg-amber-50 font-bold text-sm"
                      variant="outline"
                    >
                      Réessayer le paiement
                    </Button>
                    <a
                      href={`https://wa.me/22397787244?text=${encodeURIComponent(`Bonjour Sacko ! J'ai essayé de payer pour "${serviceName}" (${formatPrice(amount)} FCFA) mais le paiement a échoué. Référence : ${reference}. Pouvez-vous m'aider ?`)}`}
                      target="_blank" rel="noopener noreferrer"
                    >
                      <Button
                        className="w-full h-11 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm mt-2"
                        variant="default"
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Contacter Sacko sur WhatsApp
                      </Button>
                    </a>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}