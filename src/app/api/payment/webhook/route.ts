import { NextRequest, NextResponse } from 'next/server'

// ═══ HUB2 Webhook — Reçoit les notifications de paiement automatique ═══
// Hub2 envoie un POST quand le statut d'un paiement change
// Documentation : https://docs.hub2.io/integration/en/payments/payments_examples

const HUB2_WEBHOOK_SECRET = process.env.HUB2_WEBHOOK_SECRET || ''

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Hub2 webhook payload — structure typique :
    // {
    //   event: 'payment.succeeded' | 'payment.failed' | 'payment.action_required',
    //   data: {
    //     id: 'pay_xxx',
    //     paymentIntentId: 'pi_xxx',
    //     status: 'succeeded' | 'failed' | 'pending' | 'action_required',
    //     amount: 1000,
    //     currency: 'XOF',
    //     provider: { name: 'Orange', country: 'ML' },
    //     customerReference: '223XXXXXXXX',
    //     purchaseReference: 'SC-XXXXX',
    //     createdAt: '2025-01-01T00:00:00.000Z',
    //     updatedAt: '2025-01-01T00:00:05.000Z',
    //   }
    // }

    const event = body.event || ''
    const data = body.data || body

    const paymentIntentId = data.paymentIntentId || data.payment_intent_id || ''
    const status = data.status || ''
    const amount = data.amount || 0
    const currency = data.currency || 'XOF'
    const purchaseRef = data.purchaseReference || data.purchase_reference || ''
    const customerRef = data.customerReference || data.customer_reference || ''
    const provider = data.provider?.name || 'Mobile Money'

    console.log(`[Hub2 Webhook] event=${event} status=${status} amount=${amount} ${currency} intent=${paymentIntentId}`)

    if (status === 'succeeded' || event === 'payment.succeeded') {
      // ═══ PAIEMENT VALIDÉ ═══
      const orderId = purchaseRef || paymentIntentId
      const customerPhone = customerRef || ''

      console.log(`[Hub2] PAID: ${orderId} — ${amount} ${currency} — ${provider}`)

      // Auto-notify Sacko via WhatsApp
      const waMessage = `💰 *PAIEMENT REÇU — Hub2*\n\n📋 Référence : ${orderId}\n📱 Client : ${customerPhone}\n💳 Montant : ${Number(amount).toLocaleString('fr-FR')} ${currency}\n📡 Opérateur : ${provider}\n🟢 Statut : VALIDÉ AUTOMATIQUEMENT\n📅 Date : ${new Date().toLocaleString('fr-FR', { timeZone: 'Africa/Bamako' })}\n\n✅ Le client a payé via Hub2 (${provider}).\nLivrez le produit dès maintenant !`

      // Fire and forget
      fetch(`https://wa.me/22397787244?text=${encodeURIComponent(waMessage)}`).catch(() => {})

      return NextResponse.json({ success: true, message: 'Paiement confirmé' })
    }

    if (status === 'failed' || event === 'payment.failed') {
      console.log(`[Hub2] FAILED: intent=${paymentIntentId}`)
      return NextResponse.json({ success: false, message: 'Paiement échoué' })
    }

    // Pending, action_required, or other status
    return NextResponse.json({ success: true, message: `Statut: ${status}` })
  } catch (error) {
    console.error('[Hub2 Webhook] Error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}