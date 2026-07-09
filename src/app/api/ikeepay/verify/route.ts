import { NextRequest, NextResponse } from 'next/server'
import { verifyTransaction } from '@/lib/ikeepay'
import { updatePaymentStatus, getPayment, registerPayment } from '@/app/api/payments/route'

/* ═══ GET /api/ikeepay/verify?reference=xxx ═══
   Vérification STRICTE côté serveur :
   1. Appelle l'API iKeePay pour vérifier le statut
   2. Ne marque "completed" QUE si iKeePay confirme status=success
   3. Sinon, retourne le statut réel sans modifier */

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const reference = searchParams.get('reference')

    if (!reference) {
      return NextResponse.json({ error: 'Référence de paiement requise' }, { status: 400 })
    }

    // ─── Étape 1 : Vérifier avec l'API iKeePay ───
    const result = await verifyTransaction(reference)

    if (!result.status || !result.data) {
      console.error('[iKeePay Verify] API returned invalid response:', result.message)
      return NextResponse.json({
        verified: false,
        status: 'unknown',
        reference,
        message: 'Impossible de vérifier le paiement',
      }, { status: 400 })
    }

    const paymentStatus = result.data.status // 'success', 'failed', 'abandoned'
    const paymentAmount = result.data.amount
    const gatewayResponse = result.data.gateway_response

    console.log(`[iKeePay Verify] ref=${reference} status=${paymentStatus} amount=${paymentAmount} gateway=${gatewayResponse}`)

    // ─── Étape 2 : STRICT — Only mark completed if iKeePay says "success" ───
    if (paymentStatus === 'success') {
      const existing = getPayment(reference)
      if (existing) {
        updatePaymentStatus(reference, 'completed')
      } else {
        registerPayment({
          cartId: reference,
          orderId: reference,
          amount: paymentAmount,
          product: result.data.metadata?.service_name || 'Commande iKeePay',
          customerName: result.data.metadata?.customer_name || result.data.customer?.first_name || '',
          customerPhone: result.data.metadata?.customer_phone || '',
          customerEmail: result.data.customer?.email || '',
          status: 'completed',
          createdAt: result.data.paid_at || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
      }

      return NextResponse.json({
        verified: true,
        status: 'success',
        amount: paymentAmount,
        reference,
        message: 'Paiement vérifié et confirmé',
      })
    }

    // ─── Étape 3 : Paiement non réussi ───
    const existing = getPayment(reference)
    if (existing) {
      if (paymentStatus === 'failed') {
        updatePaymentStatus(reference, 'payment_failed')
      } else if (paymentStatus === 'abandoned') {
        updatePaymentStatus(reference, 'abandoned')
      }
    }

    return NextResponse.json({
      verified: false,
      status: paymentStatus,
      reference,
      gateway_response: gatewayResponse,
      message: `Paiement non confirmé : ${paymentStatus}`,
    })
  } catch (error) {
    console.error('[iKeePay Verify API Error]', error)
    return NextResponse.json(
      { error: 'Erreur serveur lors de la vérification' },
      { status: 500 }
    )
  }
}