import { NextRequest, NextResponse } from 'next/server'

// ═══ API Dashboard — Liste des commandes ═══
// GET /api/payments — Retourne toutes les commandes avec statut
// POST /api/payments — Enregistre une commande
// PATCH /api/payments — Met à jour le statut d'une commande

const ADMIN_PIN = process.env.ADMIN_PIN || 'sacko2024'

// ═══ Store partagé des commandes ═══
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

export function getPayment(cartId: string): StoredPayment | undefined {
  return paymentsStore.get(cartId)
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

    // Récupérer toutes les commandes stockées
    const payments = getPayments()

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

// POST — Enregistrer une commande
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

// PATCH — Mettre à jour le statut d'une commande
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