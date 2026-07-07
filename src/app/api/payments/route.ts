import { NextRequest, NextResponse } from 'next/server'

// ═══ API Dashboard — Liste des paiements ═══
// GET /api/payments — Retourne tous les paiements connus avec statut à jour
// Cette route vérifie le statut de chaque paiement via l'API Maketou

const MAKETOU_API_KEY = process.env.MAKETOU_API_KEY || ''
const MAKETOU_BASE_URL = 'https://api.maketou.net'
const ADMIN_PIN = process.env.ADMIN_PIN || 'sacko2024'

// ═══ Store partagé des paiements ═══
// Sur Vercel serverless, ce Map vit le temps de l'instance
// Pour la persistance, les paiements sont aussi stockés côté client
interface StoredPayment {
  cartId: string
  orderId: string
  amount: number
  product: string
  customerName: string
  customerPhone: string
  customerEmail: string
  status: string
  maketouStatus?: string
  createdAt: string
  updatedAt: string
}

// Utiliser un global pour partager entre instances (Vercel warm instances)
const globalForPayments = globalThis as unknown as {
  paymentsStore: Map<string, StoredPayment> | undefined
}
if (!globalForPayments.paymentsStore) {
  globalForPayments.paymentsStore = new Map()
}
const paymentsStore = globalForPayments.paymentsStore

// Permettre à create/route.ts d'enregistrer les paiements
export function registerPayment(payment: StoredPayment) {
  paymentsStore.set(payment.cartId, payment)
}

// Permettre à status/route.ts de mettre à jour le statut
export function updatePaymentStatus(cartId: string, status: string) {
  const p = paymentsStore.get(cartId)
  if (p) {
    p.maketouStatus = status
    p.status = status
    p.updatedAt = new Date().toISOString()
  }
}

// Récupérer tous les paiements
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

    // Si Maketou est configuré, vérifier le statut en temps réel pour les paiements récents (derniers 24h)
    if (MAKETOU_API_KEY) {
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
              const res = await fetch(`${MAKETOU_BASE_URL}/api/v1/stores/cart/${payment.cartId}`, {
                headers: { 'Authorization': `Bearer ${MAKETOU_API_KEY}` },
              })
              if (res.ok) {
                const data = await res.json()
                updatePaymentStatus(payment.cartId, data.status)
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
    const pending = payments.filter(p => p.status === 'waiting_payment').length
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