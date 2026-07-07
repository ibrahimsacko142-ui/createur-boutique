import { NextRequest, NextResponse } from 'next/server'

const CINETPAY_API_KEY = process.env.CINETPAY_API_KEY || ''
const CINETPAY_SITE_ID = process.env.CINETPAY_SITE_ID || ''
const CINETPAY_BASE_URL = 'https://api.cinetpay.com/v2'

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
      channels,
    } = body

    // Validation
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Montant invalide' }, { status: 400 })
    }
    if (!customerName || !customerPhone) {
      return NextResponse.json({ error: 'Nom et téléphone requis' }, { status: 400 })
    }
    if (!CINETPAY_API_KEY || !CINETPAY_SITE_ID) {
      return NextResponse.json({
        error: 'Paiement non configuré',
        message: 'Les clés CinetPay ne sont pas configurées. Contactez l\'administrateur.',
        demo: true,
      }, { status: 503 })
    }

    // Generate unique transaction ID
    const txId = transactionId || `SC-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`

    // Create CinetPay payment
    const cinetPayResponse = await fetch(`${CINETPAY_BASE_URL}/payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        apikey: CINETPAY_API_KEY,
        site_id: CINETPAY_SITE_ID,
        transaction_id: txId,
        amount: amount,
        currency: 'XOF',
        description: description || 'Commande Studio Créatif',
        customer_name: customerName,
        customer_phone: customerPhone.replace(/\s/g, ''),
        customer_email: customerEmail || '',
        channels: channels || 'ALL',
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL || ''}/#boutique`,
        notify_url: `${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/payment/webhook`,
        metadata: JSON.stringify({
          source: 'studio-creatif',
          customerName,
          customerPhone,
          customerEmail,
        }),
        lang: 'fr',
      }),
    })

    const data = await cinetPayResponse.json()

    if (data.code === '201') {
      return NextResponse.json({
        success: true,
        payment_url: data.data.payment_url,
        payment_token: data.data.payment_token,
        transaction_id: txId,
      })
    } else {
      console.error('CinetPay error:', data)
      return NextResponse.json({
        error: 'Erreur lors de la création du paiement',
        details: data.message || data.code,
      }, { status: 500 })
    }
  } catch (error) {
    console.error('Payment create error:', error)
    return NextResponse.json({
      error: 'Erreur serveur',
    }, { status: 500 })
  }
}