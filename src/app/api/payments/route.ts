import { NextRequest, NextResponse } from 'next/server'

// ═══ API Dashboard — Liste des paiements ═══
// GET /api/payments — Retourne tous les paiements connus avec statut à jour
// Cette route vérifie le statut via l'API CinetPay

const CINETPAY_API_KEY = process.env.CINETPAY_API_KEY || ''
const CINETPAY_SITE_ID = process.env.CINETPAY_SITE_ID || ''
const ADMIN_PIN = process.env.ADMIN_PIN || 'sacko2024'

// ═══ Store partagé des paiements ═══
// Sur Vercel serverless, ce Map vit le temps de l'instance
interface StoredPayment {
  cartId: string
  orderId: string
  amount: number
  product: string
  customerName: string
  customerPhone: string
  customerEmail: string
  status: string
  createdAt: string
  updatedAt: string
}

const globalForPayments = globalThis as unknown as {
  paymentsStore: Map<string, StoredPayment> | undefined
}
if (!globalForPayments.paymentsStore) {
  globalForPayments.paymentsStore = new Map()
}
const paymentsStore = globalForPayments.paymentsStore

export function registerPayment(payment: StoredPayment) {
  paymentsStore.set(payment.cartId, payment)
}

export function updatePaymentStatus(cartId: string, status: string) {
  const p = paymentsStore.get(cartId)
  if (p) {
    p.status = status
    p.updatedAt = new Date().toISOString()
  }
}

export function getPayments(): StoredPayment[] {
  return Array.from(paymentsStore.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

export async function GET(req: NextRequest) {
  try {
    // Vérifier le PIN admin
    const { searchParams } = new URL(req.url)
    const pin = searchParams.get('pin')

    if (pin !== ADMIN_PIN) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    // Récupérer tous les paiements stockés
    let payments = getPayments()

    // Si CinetPay est configuré, vérifier le statut en temps réel pour les paiements récents (derniers 24h)
    if (CINETPAY_API_KEY && CINETPAY_API_KEY !== 'VOTRE_CLE_API_ICI') {
      const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000
      const recentPayments = payments.filter(p => new Date(p.createdAt).getTime() > oneDayAgo && p.status !== 'completed')

      // Vérifier le statut en parallèle (max 5 à la fois)
      const batches = []
      for (let i = 0; i < recentPayments.length; i += 5) {
        batches.push(recentPayments.slice(i, i + 5))
      }

      for (const batch of batches) {
        await Promise.allSettled(
          batch.map(async (payment) => {
            try {
              const res = await fetch('https://api-checkout.cinetpay.com/v2/payment/check', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  apikey: CINETPAY_API_KEY,
                  site_id: CINETPAY_SITE_ID,
                  transaction_id: payment.cartId,
                }),
              })
              if (res.ok) {
                const data = await res.json()
                const txnData = data.data || data
                const cpStatus = txnData.status || txnData.cpm_trans_status || 'PENDING'
                const mapped = cpStatus === 'VALIDATED' ? 'completed' : cpStatus === 'REFUSED' || cpStatus === 'CANCELLED' ? 'payment_failed' : 'waiting_payment'
                updatePaymentStatus(payment.cartId, mapped)
              }
            } catch {
              // Ignore les erreurs de vérification individuelle
            }
          })
        )
      }

      // Re-récupérer les paiements mis à jour
      payments = getPayments()
    }

    // Stats résumées
    const total = payments.length
    const completed = payments.filter(p => p.status === 'completed').length
    const pending = payments.filter(p => p.status === 'waiting_payment' || p.status === 'PENDING').length
    const failed = payments.filter(p => p.status === 'payment_failed' || p.status === 'abandoned').length
    const revenue = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0)

    return NextResponse.json({
      success: true,
      stats: { total, completed, pending, failed, revenue },
      payments,
    })
  } catch (error) {
    console.error('[Payments API] Error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// POST — Enregistrer un paiement (appelé par create/route.ts)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { cartId, orderId, amount, product, customerName, customerPhone, customerEmail, status, createdAt } = body

    if (!cartId) {
      return NextResponse.json({ error: 'cartId requis' }, { status: 400 })
    }

    registerPayment({
      cartId,
      orderId: orderId || cartId,
      amount: amount || 0,
      product: product || 'Commande',
      customerName: customerName || '',
      customerPhone: customerPhone || '',
      customerEmail: customerEmail || '',
      status: status || 'waiting_payment',
      createdAt: createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// PATCH — Mettre à jour le statut d'un paiement (appelé par webhook)
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { cartId, status } = body

    if (!cartId || !status) {
      return NextResponse.json({ error: 'cartId et status requis' }, { status: 400 })
    }

    updatePaymentStatus(cartId, status)

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}