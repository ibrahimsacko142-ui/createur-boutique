import { NextRequest, NextResponse } from 'next/server'

// ═══ Commande via WhatsApp — Enregistrement + Notification ═══
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || ''
const WHATSAPP = process.env.WHATSAPP_NUMBER || '22397787244'

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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      amount,
      product,
      description,
      customerName,
      customerPhone,
      customerEmail,
      transactionId,
      items,
    } = body

    if (!customerName) {
      return NextResponse.json({ error: 'Nom requis' }, { status: 400 })
    }

    if (!amount || amount < 100) {
      return NextResponse.json({ error: 'Le montant minimum est de 100 FCFA' }, { status: 400 })
    }

    const txnId = transactionId || `SC-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`

    const itemsList = items && items.length > 0
      ? items.map((t: string) => `  • ${t}`).join('\n')
      : `  • ${product || description || 'Commande'}`

    // Enregistrer la commande
    try {
      await fetch(`${BASE_URL}/api/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartId: txnId,
          orderId: txnId,
          amount,
          product: product || description || 'Commande',
          customerName,
          customerPhone,
          customerEmail,
          status: 'waiting_payment',
          createdAt: new Date().toISOString(),
        }),
      }).catch(() => {})
    } catch { /* non bloquant */ }

    // Construire le message WhatsApp
    const waMsg = `🛒 *NOUVELLE COMMANDE — Studio Créatif*\n\n📋 Référence : ${txnId}\n👤 Client : ${customerName}\n📱 Tél : ${customerPhone || 'Non renseigné'}\n📧 Email : ${customerEmail || 'Non renseigné'}\n\n${itemsList}\n\n💰 *Total : ${amount.toLocaleString('fr-FR')} FCFA*\n\n⏰ ${new Date().toLocaleString('fr-FR', { timeZone: 'Africa/Bamako' })}\n\n✅ Merci ! Sacko va vous contacter pour confirmer la commande et le paiement.`

    const whatsappUrl = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(waMsg)}`

    console.log('[Order] Created:', { txnId, amount, customerName, items: items?.length || 1 })

    return NextResponse.json({
      success: true,
      transaction_id: txnId,
      whatsapp_url: whatsappUrl,
      status: 'waiting_payment',
    })
  } catch (error) {
    console.error('[Order] Error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}