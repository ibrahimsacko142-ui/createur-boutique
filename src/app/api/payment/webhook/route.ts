import { NextRequest, NextResponse } from 'next/server'

// ═══ KKIAPAY Webhook — Reçoit les notifications de paiement automatique ═══
// Quand un paiement est validé, Kkiapay envoie un POST ici avec les détails

const KKIAPIAY_SECRET_KEY = process.env.KKIAPIAY_SECRET_KEY || ''
const KKIAPIAY_PUBLIC_KEY = process.env.KKIAPIAY_PUBLIC_KEY || ''

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Kkiapay webhook payload structure
    const {
      tx_key,
      amount,
      currency,
      status,          // 'success' | 'failed' | 'pending'
      reason,          // reason for failure if any
      transaction_id,  // our custom meta.transaction_id
      customer,
      meta,
      performed_at,
    } = body

    console.log(`[Kkiapay Webhook] tx_key=${tx_key} status=${status} amount=${amount} ${currency}`)

    if (status === 'success' || status === 'SUCCESS') {
      // ═══ PAIEMENT VALIDÉ ═══
      const orderId = meta?.transaction_id || transaction_id || tx_key
      const customerName = customer?.name || 'Client'
      const customerPhone = customer?.phone || ''

      console.log(`[Kkiapay] PAID: ${orderId} — ${amount} ${currency} — ${customerName}`)

      // Auto-notify Sacko via WhatsApp
      const waMessage = `💰 *PAIEMENT REÇU — Kkiapay*\n\n📋 Référence : ${orderId}\n👤 Client : ${customerName}\n📱 Tél : ${customerPhone}\n💳 Montant : ${Number(amount).toLocaleString('fr-FR')} ${currency}\n🟢 Statut : VALIDÉ AUTOMATIQUEMENT\n📅 Date : ${performed_at || new Date().toLocaleString('fr-FR', { timeZone: 'Africa/Bamako' })}\n\n✅ Le client a payé via Kkiapay (Orange Money / MTN MoMo / Wave).\nLivrez le produit dès maintenant !`

      // Fire and forget
      fetch(`https://wa.me/22397787244?text=${encodeURIComponent(waMessage)}`).catch(() => {})

      return NextResponse.json({ success: true, message: 'Paiement confirmé' })
    }

    if (status === 'failed' || status === 'FAILED' || status === 'cancelled') {
      console.log(`[Kkiapay] FAILED: tx_key=${tx_key} reason=${reason}`)
      return NextResponse.json({ success: false, message: `Paiement échoué: ${reason || 'Annulé'}` })
    }

    // Pending or unknown status
    return NextResponse.json({ success: true, message: `Statut: ${status}` })
  } catch (error) {
    console.error('[Kkiapay Webhook] Error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// GET — Vérifier le statut d'une transaction Kkiapay
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const txKey = searchParams.get('tx_key')

  if (!txKey) {
    return NextResponse.json({ error: 'tx_key requis' }, { status: 400 })
  }

  if (!KKIAPIAY_SECRET_KEY) {
    return NextResponse.json({ error: 'Paiement non configuré', demo: true }, { status: 503 })
  }

  try {
    const response = await fetch(`https://api.kkiapay.me/v2/transactions/${txKey}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${KKIAPIAY_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Erreur vérification' }, { status: 500 })
  }
}