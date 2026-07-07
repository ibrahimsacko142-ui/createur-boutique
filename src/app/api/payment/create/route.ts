import { NextRequest, NextResponse } from 'next/server'

// ═══ KKIAPAY — Fonctionne au Mali (Orange Money, MTN MoMo, Wave) ═══
const KKIAPIAY_SECRET_KEY = process.env.KKIAPIAY_SECRET_KEY || ''
const KKIAPIAY_PUBLIC_KEY = process.env.KKIAPIAY_PUBLIC_KEY || ''
const KKIAPIAY_BASE_URL = 'https://api.kkiapay.me/v2'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const {
      amount,
      description,
      customerName,
      customerPhone,
      customerEmail,
      transactionId,
    } = body

    // Validation
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Montant invalide' }, { status: 400 })
    }
    if (!customerName || !customerPhone) {
      return NextResponse.json({ error: 'Nom et téléphone requis' }, { status: 400 })
    }

    // Check if Kkiapay is configured
    if (!KKIAPIAY_SECRET_KEY || !KKIAPIAY_PUBLIC_KEY) {
      return NextResponse.json({
        error: 'Paiement en cours de configuration',
        message: 'Les clés Kkiapay ne sont pas encore configurées. Le mode démonstration est actif.',
        demo: true,
      }, { status: 503 })
    }

    // Generate unique transaction reference
    const txId = transactionId || `SC-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`

    // Clean phone number for Mali (+223 prefix)
    let phone = customerPhone.replace(/\s/g, '')
    if (phone.startsWith('0')) phone = phone.substring(1)
    if (!phone.startsWith('+223') && !phone.startsWith('223')) phone = `223${phone}`

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || ''

    // Create Kkiapay transaction
    const kkiapayResponse = await fetch(`${KKIAPIAY_BASE_URL}/transactions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${KKIAPIAY_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amount,
        currency: 'XOF',
        description: description || `Commande Studio Créatif — ${txId}`,
        customer: {
          name: customerName,
          email: customerEmail || `${customerName.toLowerCase().replace(/\s/g, '.')}@studio-creatif.ml`,
          phone: phone,
        },
        channels: 'MOBILE_MONEY',
        callback_url: `${baseUrl}/api/payment/webhook`,
        return_url: `${baseUrl}/#boutique`,
        meta: {
          transaction_id: txId,
          source: 'studio-creatif',
        },
      }),
    })

    const data = await kkiapayResponse.json()

    if (data.transaction && data.transaction.tx_key) {
      // Kkiapay returns tx_key — build the payment widget URL
      const paymentUrl = `https://widget.kkiapay.me/v2/?tx_key=${data.transaction.tx_key}&public_key=${KKIAPIAY_PUBLIC_KEY}`

      return NextResponse.json({
        success: true,
        payment_url: paymentUrl,
        tx_key: data.transaction.tx_key,
        transaction_id: txId,
      })
    } else {
      console.error('Kkiapay error:', data)
      return NextResponse.json({
        error: 'Erreur lors de la création du paiement',
        details: data.message || 'Vérifiez vos clés Kkiapay.',
      }, { status: 500 })
    }
  } catch (error) {
    console.error('Payment create error:', error)
    return NextResponse.json({
      error: 'Erreur serveur de paiement',
    }, { status: 500 })
  }
}