import { NextRequest, NextResponse } from 'next/server'

// ═══ CINETPAY — Vérifier le statut d'une transaction ═══
// GET /api/payment/status?txnId=xxx
// Statuts possibles : PENDING, VALIDATED, REFUSED, CANCELLED, EXPIRED

const CINETPAY_API_KEY = process.env.CINETPAY_API_KEY || ''
const CINETPAY_SITE_ID = process.env.CINETPAY_SITE_ID || ''
const CINETPAY_BASE_URL = 'https://api-checkout.cinetpay.com/v2'

// Mapping des statuts CinetPay vers statuts internes
function mapStatus(cinetpayStatus: string): string {
  switch (cinetpayStatus) {
    case 'VALIDATED':
      return 'completed'
    case 'REFUSED':
    case 'CANCELLED':
    case 'EXPIRED':
      return 'payment_failed'
    case 'PENDING':
    default:
      return 'waiting_payment'
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const txnId = searchParams.get('txnId') || searchParams.get('cartId')

  if (!txnId) {
    return NextResponse.json({ error: 'txnId requis' }, { status: 400 })
  }

  if (!CINETPAY_API_KEY || CINETPAY_API_KEY === 'VOTRE_CLE_API_ICI') {
    return NextResponse.json({ error: 'Paiement non configuré', demo: true }, { status: 503 })
  }

  try {
    const response = await fetch(`${CINETPAY_BASE_URL}/payment/check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        apikey: CINETPAY_API_KEY,
        site_id: CINETPAY_SITE_ID,
        transaction_id: txnId,
      }),
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'Transaction non trouvée' }, { status: response.status })
    }

    const data = await response.json()
    const transactionData = data.data || data

    const status = transactionData.status || transactionData.cpm_trans_status || 'PENDING'
    const mappedStatus = mapStatus(status)

    // Si le paiement est validé, notifier Sacko
    if (status === 'VALIDATED') {
      const waMsg = `✅ *PAIEMENT VALIDÉ — CinetPay*\n\n📋 Référence : ${txnId}\n👤 Client : ${transactionData.customer_name || transactionData.cpm_customer_name || ''}\n📱 Tél : ${transactionData.customer_phone || transactionData.cpm_phone_prefill || ''}\n📧 Email : ${transactionData.customer_email || transactionData.cpm_customer_email || ''}\n💰 Montant : ${transactionData.amount || '?'} FCFA\n🟢 Statut : VALIDÉ\n\n✅ Livrez le produit dès maintenant !`
      fetch(`https://wa.me/22397787244?text=${encodeURIComponent(waMsg)}`).catch(() => {})
    }

    return NextResponse.json({
      success: true,
      transaction_id: txnId,
      status: mappedStatus,
      cinetpay_status: status,
      amount: transactionData.amount || 0,
      currency: transactionData.currency || 'XOF',
      customer_name: transactionData.customer_name || transactionData.cpm_customer_name || '',
      customer_phone: transactionData.customer_phone || transactionData.cpm_phone_prefill || '',
      customer_email: transactionData.customer_email || transactionData.cpm_customer_email || '',
      payment_method: transactionData.payment_method || '',
      payment_date: transactionData.payment_date || transactionData.cpm_payment_date || '',
      created_at: transactionData.created_at || '',
    })
  } catch (error) {
    console.error('[CinetPay] Status check error:', error)
    return NextResponse.json({ error: 'Erreur de vérification' }, { status: 500 })
  }
}