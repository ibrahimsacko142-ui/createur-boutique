import { NextRequest, NextResponse } from 'next/server'

// ═══ CINETPAY — Webhook de notification de paiement ═══
// CinetPay envoie un POST ici à chaque changement de statut
// Le payload contient : transaction_id, status, amount, etc.

const CINETPAY_API_KEY = process.env.CINETPAY_API_KEY || ''
const CINETPAY_SITE_ID = process.env.CINETPAY_SITE_ID || ''
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || ''

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    console.log('[CinetPay Webhook] Received:', JSON.stringify(body).substring(0, 500))

    const txnId = body.transaction_id || body.cpm_trans_id
    const status = body.status || body.cpm_trans_status
    const amount = body.amount || body.cpm_amount
    const customerName = body.customer_name || body.cpm_customer_name || ''
    const customerPhone = body.customer_phone || body.cpm_phone_prefill || ''
    const customerEmail = body.customer_email || body.cpm_customer_email || ''

    if (!txnId) {
      console.error('[CinetPay Webhook] Missing transaction_id')
      return NextResponse.json({ error: 'transaction_id manquant' }, { status: 400 })
    }

    // Vérifier la signature si possible (optionnel mais recommandé)
    // CinetPay peut inclure un token de vérification

    // Mettre à jour le statut du paiement dans notre store
    if (status === 'VALIDATED' || status === 'REFUSED' || status === 'CANCELLED') {
      const mappedStatus = status === 'VALIDATED' ? 'completed' : 'payment_failed'

      // Mettre à jour via l'API payments
      try {
        await fetch(`${BASE_URL}/api/payments`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cartId: txnId,
            status: mappedStatus,
          }),
        }).catch(() => {})
      } catch {
        // Non bloquant
      }

      // Notifier Sacko par WhatsApp
      if (status === 'VALIDATED') {
        const waMsg = `✅ *PAIEMENT VALIDÉ — CinetPay*\n\n📋 Référence : ${txnId}\n👤 Client : ${customerName}\n📱 Tél : ${customerPhone}\n📧 Email : ${customerEmail}\n💰 Montant : ${amount ? Number(amount).toLocaleString('fr-FR') : '?'} FCFA\n🟢 Statut : VALIDÉ\n\n✅ Livrez le produit dès maintenant !`
        fetch(`https://wa.me/22397787244?text=${encodeURIComponent(waMsg)}`).catch(() => {})
      } else {
        const waMsg = `❌ *PAIEMENT ÉCHOUÉ — CinetPay*\n\n📋 Référence : ${txnId}\n👤 Client : ${customerName}\n📱 Tél : ${customerPhone}\n💸 Montant : ${amount ? Number(amount).toLocaleString('fr-FR') : '?'} FCFA\n🔴 Statut : ${status}\n\n⚠️ Le client n'a pas pu payer.`
        fetch(`https://wa.me/22397787244?text=${encodeURIComponent(waMsg)}`).catch(() => {})
      }
    }

    // Toujours répondre 200 pour que CinetPay sache que le webhook a été reçu
    return NextResponse.json({ success: true, message: 'Webhook reçu' })
  } catch (error) {
    console.error('[CinetPay Webhook] Error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}