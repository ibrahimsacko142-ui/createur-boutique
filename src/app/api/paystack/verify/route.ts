import { NextRequest, NextResponse } from 'next/server'
import { verifyTransaction } from '@/lib/paystack'
import { updatePaymentStatus, getPayment, registerPayment } from '@/app/api/payments/route'

/* ═══ GET /api/paystack/verify?reference=xxx ═══
   Vérification STRICTE côté serveur :
   1. Appelle l'API Paystack pour vérifier le statut
   2. Ne marque "completed" QUE si Paystack confirme status=success
   3. Sinon, retourne le statut réel sans modifier */

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const reference = searchParams.get('reference')

    if (!reference) {
      return NextResponse.json({ error: 'Référence de paiement requise' }, { status: 400 })
    }

    // ─── Étape 1 : Vérifier avec l'API Paystack ───
    const result = await verifyTransaction(reference)

    if (!result.status || !result.data) {
      console.error('[Paystack Verify] API returned invalid response:', result.message)
      return NextResponse.json({
        verified: false,
        status: 'unknown',
        reference,
        message: 'Impossible de vérifier le paiement',
      }, { status: 400 })
    }

    const paystackStatus = result.data.status // 'success', 'failed', 'abandoned'
    const paystackAmount = result.data.amount
    const gatewayResponse = result.data.gateway_response

    console.log(`[Paystack Verify] ref=${reference} status=${paystackStatus} amount=${paystackAmount} gateway=${gatewayResponse}`)

    // ─── Étape 2 : STRICT — Only mark completed if Paystack says "success" ───
    if (paystackStatus === 'success') {
      const existing = getPayment(reference)
      if (existing) {
        // Mettre à jour le statut vers completed
        updatePaymentStatus(reference, 'completed')
      } else {
        // Enregistrer si le webhook n'a pas encore été reçu
        registerPayment({
          cartId: reference,
          orderId: reference,
          amount: paystackAmount,
          product: result.data.metadata?.service_name || 'Commande Paystack',
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
        amount: paystackAmount,
        reference,
        message: 'Paiement vérifié et confirmé',
      })
    }

    // ─── Étape 3 : Paiement non réussi ───
    const existing = getPayment(reference)
    if (existing) {
      if (paystackStatus === 'failed') {
        updatePaymentStatus(reference, 'payment_failed')
      } else if (paystackStatus === 'abandoned') {
        updatePaymentStatus(reference, 'abandoned')
      }
    }

    return NextResponse.json({
      verified: false,
      status: paystackStatus,
      reference,
      gateway_response: gatewayResponse,
      message: `Paiement non confirmé : ${paystackStatus}`,
    })
  } catch (error) {
    console.error('[Paystack Verify API Error]', error)
    return NextResponse.json(
      { error: 'Erreur serveur lors de la vérification' },
      { status: 500 }
    )
  }
}