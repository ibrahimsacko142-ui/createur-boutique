import { NextRequest, NextResponse } from 'next/server'
import { verifyWebhookSignature, verifyTransaction } from '@/lib/ikeepay'
import { updatePaymentStatus, getPayment, registerPayment } from '@/app/api/payments/route'

/* ═══ POST /api/ikeepay/webhook ═══
   Webhook iKeePay — DOUBLE VÉRIFICATION :
   1. Vérifie la signature HMAC-SHA512 (sécurité)
   2. Re-vérifie avec l'API iKeePay (fiabilité)
   3. Met à jour le statut uniquement si les deux vérifications confirment */

export async function POST(req: NextRequest) {
  try {
    // ─── Étape 1 : Vérifier la signature du webhook ───
    // iKeePay peut utiliser x-ikeepay-signature ou x-paystack-signature
    const signature = req.headers.get('x-ikeepay-signature') || req.headers.get('x-paystack-signature')
    const rawBody = await req.text()

    if (!verifyWebhookSignature(rawBody, signature)) {
      console.error('[iKeePay Webhook] ❌ Signature invalide — rejeté')
      return NextResponse.json({ error: 'Signature invalide' }, { status: 401 })
    }

    const event = JSON.parse(rawBody)
    console.log(`[iKeePay Webhook] Event received: ${event.event}`)

    // ─── Étape 2 : Traiter uniquement charge.success ───
    if (event.event === 'charge.success') {
      const data = event.data
      const reference = data.reference as string

      if (!reference) {
        console.error('[iKeePay Webhook] No reference in event data')
        return NextResponse.json({ received: true })
      }

      // ─── Étape 3 : DOUBLE VÉRIFICATION — appeler l'API iKeePay ───
      const verification = await verifyTransaction(reference)

      if (!verification.status || verification.data?.status !== 'success') {
        console.error(`[iKeePay Webhook] ❌ Double verification FAILED for ref=${reference}. Status: ${verification.data?.status}`)
        return NextResponse.json({ received: true, verified: false })
      }

      // ─── Étape 4 : Mettre à jour ou créer le paiement ───
      const existing = getPayment(reference)
      if (existing) {
        if (existing.status !== 'completed') {
          updatePaymentStatus(reference, 'completed')
          console.log(`[iKeePay Webhook] ✅ Payment CONFIRMED and updated: ${reference} — ${data.amount} XOF`)
        } else {
          console.log(`[iKeePay Webhook] ℹ️ Already completed, skipping: ${reference}`)
        }
      } else {
        registerPayment({
          cartId: reference,
          orderId: reference,
          amount: data.amount,
          product: (data.metadata?.custom_fields || []).find(
            (f: { variable_name: string }) => f.variable_name === 'service'
          )?.display_name || data.metadata?.service_name || 'Commande iKeePay',
          customerName: data.metadata?.customer_name || data.customer?.first_name || '',
          customerPhone: data.metadata?.customer_phone || '',
          customerEmail: data.customer?.email || '',
          status: 'completed',
          createdAt: data.paid_at || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
        console.log(`[iKeePay Webhook] ✅ Payment CONFIRMED and REGISTERED: ${reference} — ${data.amount} XOF`)
      }
    }

    // Toujours retourner 200 pour éviter les retentes
    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('[iKeePay Webhook Error]', error)
    return NextResponse.json({ received: true, error: 'Processing error' })
  }
}