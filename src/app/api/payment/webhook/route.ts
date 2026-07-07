import { NextRequest, NextResponse } from 'next/server'

// CinetPay webhook endpoint
// Receives payment notifications from CinetPay
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const {
      transaction_id,
      cpm_trans_id,
      cpm_amount,
      cpm_currency,
      cpm_custom,
      cpm_phone_prefixe,
      cpm_phone_num,
      cpm_trans_status,
      cpm_payment_date,
      cpm_payid,
      signature,
      cpm_site_id,
    } = body

    // Verify required fields
    if (!cpm_trans_status || !transaction_id) {
      return NextResponse.json({ error: 'Données manquantes' }, { status: 400 })
    }

    const status = cpm_trans_status
    const amount = cpm_amount
    const phone = `${cpm_phone_prefixe || ''}${cpm_phone_num || ''}`

    console.log(`[CinetPay Webhook] Transaction ${transaction_id}: status=${status}, amount=${amount} ${cpm_currency}, phone=${phone}`)

    if (status === 'ACCEPTED' || status === 'completed') {
      // Payment successful!
      // In production, you would:
      // 1. Save to database
      // 2. Send WhatsApp notification to Sacko
      // 3. Send confirmation email to customer
      // 4. Deliver the digital product

      console.log(`[CinetPay] PAID: ${transaction_id} — ${amount} XOF — Phone: ${phone}`)

      // Auto-notify Sacko via WhatsApp (server-side)
      const customerName = body.cpm_custom ? JSON.parse(body.cpm_custom).customerName || 'Client' : 'Client'
      const customerPhone = body.cpm_custom ? JSON.parse(body.cpm_custom).customerPhone || phone : phone
      const waMessage = `💰 *PAIEMENT REÇU*\n\n📋 Référence : ${transaction_id}\n👤 Client : ${customerName}\n📱 Tél : ${customerPhone}\n💳 Montant : ${Number(amount).toLocaleString('fr-FR')} ${cpm_currency}\n📅 Date : ${cpm_payment_date || new Date().toISOString()}\n\n✅ Paiement validé automatiquement par CinetPay.`

      // Fire and forget WhatsApp notification
      fetch(`https://wa.me/22397787244?text=${encodeURIComponent(waMessage)}`).catch(() => {})

      return NextResponse.json({ success: true, message: 'Paiement confirmé' })
    }

    if (status === 'REFUSED' || status === 'CANCELLED') {
      console.log(`[CinetPay] FAILED: ${transaction_id} — status=${status}`)
      return NextResponse.json({ success: false, message: 'Paiement refusé ou annulé' })
    }

    // Pending status
    return NextResponse.json({ success: true, message: `Statut: ${status}` })
  } catch (error) {
    console.error('[CinetPay Webhook] Error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// GET endpoint for checking payment status
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const transactionId = searchParams.get('transaction_id')

  if (!transactionId) {
    return NextResponse.json({ error: 'transaction_id requis' }, { status: 400 })
  }

  const CINETPAY_API_KEY = process.env.CINETPAY_API_KEY || ''
  const CINETPAY_SITE_ID = process.env.CINETPAY_SITE_ID || ''

  if (!CINETPAY_API_KEY || !CINETPAY_SITE_ID) {
    return NextResponse.json({ error: 'Paiement non configuré', demo: true }, { status: 503 })
  }

  try {
    const response = await fetch(`${CINETPAY_SITE_ID}` || '', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        apikey: CINETPAY_API_KEY,
        site_id: CINETPAY_SITE_ID,
        transaction_id: transactionId,
      }),
    })

    const data = await response.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Erreur vérification' }, { status: 500 })
  }
}