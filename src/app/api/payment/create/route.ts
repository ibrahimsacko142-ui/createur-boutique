import { NextRequest, NextResponse } from 'next/server'

// ═══ HUB2 — Passerelle de paiement qui fonctionne AU MALI ═══
// Hub2 supporte : Orange Money Mali, MTN MoMo Mali
// Documentation : https://docs.hub2.io
// Inscription  : https://www.hub2.io

const HUB2_API_KEY = process.env.HUB2_API_KEY || ''
const HUB2_MERCHANT_ID = process.env.HUB2_MERCHANT_ID || ''
const HUB2_BASE_URL = 'https://api.hub2.io'
const HUB2_ENVIRONMENT = process.env.HUB2_ENVIRONMENT || 'sandbox' // 'sandbox' ou 'live'

// Mapping des méthodes de paiement vers les IDs Hub2 pour le Mali (ML)
// Ces IDs seront récupérés via l'API Hub2 /data/providers?country=ML
const HUB2_MALI_PROVIDERS: Record<string, string> = {
  orange: process.env.HUB2_ORANGE_MALI_PROVIDER_ID || '',
  mtn: process.env.HUB2_MTN_MALI_PROVIDER_ID || '',
}

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
      paymentMethod, // 'orange' | 'mtn' | 'wave'
    } = body

    // Validation
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Montant invalide' }, { status: 400 })
    }
    if (!customerName || !customerPhone) {
      return NextResponse.json({ error: 'Nom et téléphone requis' }, { status: 400 })
    }

    // Check if Hub2 is configured
    if (!HUB2_API_KEY || !HUB2_MERCHANT_ID) {
      return NextResponse.json({
        error: 'Paiement en cours de configuration',
        message: 'Les clés Hub2 ne sont pas encore configurées. Le mode démonstration est actif.',
        demo: true,
      }, { status: 503 })
    }

    // Generate unique transaction reference
    const txId = transactionId || `SC-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`

    // Clean phone number for Mali (+223 prefix)
    let phone = customerPhone.replace(/\s/g, '')
    if (phone.startsWith('+')) phone = phone.substring(1)
    if (phone.startsWith('0')) phone = phone.substring(1)
    if (!phone.startsWith('223')) phone = `223${phone}`

    // ═══ ÉTAPE 1 : Créer un PaymentIntent Hub2 ═══
    const createPIResponse = await fetch(`${HUB2_BASE_URL}/payment-intents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'ApiKey': HUB2_API_KEY,
        'MerchantId': HUB2_MERCHANT_ID,
        'Environment': HUB2_ENVIRONMENT,
      },
      body: JSON.stringify({
        amount: amount, // en plus petite unité (ex: 1000 = 1000 FCFA)
        currency: 'XOF',
        customerReference: phone,
        purchaseReference: txId,
        description: description || `Commande Studio Créatif — ${txId}`,
      }),
    })

    const piData = await createPIResponse.json()

    if (!createPIResponse.ok || !piData.id) {
      console.error('[Hub2] Create PaymentIntent error:', piData)
      return NextResponse.json({
        error: 'Erreur lors de la création du paiement',
        details: piData.error?.message || piData.message || 'Vérifiez vos clés Hub2.',
      }, { status: 500 })
    }

    // ═══ ÉTAPE 2 : Tenter le paiement sur le PaymentIntent ═══
    // Déterminer le provider ID selon la méthode choisie
    const providerId = paymentMethod ? HUB2_MALI_PROVIDERS[paymentMethod] : ''

    const payBody: Record<string, unknown> = {
      token: piData.token,
      msisdn: phone, // numéro au format international (223XXXXXXXX)
    }

    // Si un provider spécifique est demandé et configuré
    if (providerId) {
      payBody.provider = providerId
    }

    const payResponse = await fetch(`${HUB2_BASE_URL}/payment-intents/${piData.id}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'ApiKey': HUB2_API_KEY,
        'MerchantId': HUB2_MERCHANT_ID,
        'Environment': HUB2_ENVIRONMENT,
      },
      body: JSON.stringify(payBody),
    })

    const payData = await payResponse.json()

    if (!payResponse.ok) {
      console.error('[Hub2] Attempt payment error:', payData)
      return NextResponse.json({
        error: 'Erreur lors du paiement',
        details: payData.error?.message || payData.message || 'Impossible de traiter le paiement.',
      }, { status: 500 })
    }

    // Vérifier le statut du paiement
    const paymentStatus = payData.status || 'pending'
    const paymentId = payData.payments?.[0]?.id || piData.id

    // Retourner les infos au frontend
    return NextResponse.json({
      success: true,
      payment_intent_id: piData.id,
      payment_id: paymentId,
      transaction_id: txId,
      status: paymentStatus,
      // Si le paiement nécessite une action (USSD, OTP, etc.)
      action_required: payData.status === 'action_required',
      action_type: payData.payments?.[0]?.action?.type || null,
      customer_message: payData.payments?.[0]?.action?.message || null,
    })
  } catch (error) {
    console.error('[Hub2] Payment create error:', error)
    return NextResponse.json({
      error: 'Erreur serveur de paiement',
    }, { status: 500 })
  }
}

// ═══ GET : Vérifier le statut d'un PaymentIntent Hub2 ═══
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const paymentIntentId = searchParams.get('payment_intent_id')

  if (!paymentIntentId) {
    return NextResponse.json({ error: 'payment_intent_id requis' }, { status: 400 })
  }

  if (!HUB2_API_KEY || !HUB2_MERCHANT_ID) {
    return NextResponse.json({ error: 'Paiement non configuré', demo: true }, { status: 503 })
  }

  try {
    const response = await fetch(`${HUB2_BASE_URL}/payment-intents/${paymentIntentId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'ApiKey': HUB2_API_KEY,
        'MerchantId': HUB2_MERCHANT_ID,
        'Environment': HUB2_ENVIRONMENT,
      },
    })

    const data = await response.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Erreur vérification' }, { status: 500 })
  }
}