import { NextRequest, NextResponse } from 'next/server'
import { initializeTransaction } from '@/lib/ikeepay'
import { registerPayment, getPayment } from '@/app/api/payments/route'

/* ═══ POST /api/ikeepay/initialize ═══
   Crée une transaction iKeePay et enregistre la commande côté serveur.
   Le montant est en FCFA (XOF), passé tel quel (pas de conversion kobo). */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, amount, serviceName, customerName, customerPhone } = body

    // ─── Validation stricte ───
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Email invalide' }, { status: 400 })
    }
    if (!amount || amount < 100) {
      return NextResponse.json({ error: 'Montant invalide (minimum 100 FCFA)' }, { status: 400 })
    }
    if (!serviceName) {
      return NextResponse.json({ error: 'Nom du service requis' }, { status: 400 })
    }

    // ─── Générer une référence unique ───
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 8).toUpperCase()
    const reference = `SC-${timestamp}-${random}`

    // ─── URL de callback après paiement ───
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://createur-boutique.vercel.app'
    const callback_url = `${baseUrl}/?payment_ref=${reference}&payment_status=processing`

    // ─── Initialiser sur iKeePay ───
    const result = await initializeTransaction({
      email,
      amount,
      reference,
      currency: 'XOF',
      callback_url,
      metadata: {
        service_name: serviceName,
        customer_name: customerName || '',
        customer_phone: customerPhone || '',
      },
    })

    if (!result.status || !result.data) {
      console.error('[iKeePay Init] Failed:', result.message)
      return NextResponse.json(
        { error: result.message || "Erreur lors de l'initialisation du paiement" },
        { status: 400 }
      )
    }

    // ─── Enregistrer la commande localement ───
    const existing = getPayment(reference)
    if (!existing) {
      registerPayment({
        cartId: reference,
        orderId: reference,
        amount,
        product: serviceName,
        customerName: customerName || '',
        customerPhone: customerPhone || '',
        customerEmail: email,
        status: 'waiting_payment',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    }

    // ─── Retourner la référence et l'URL de paiement ───
    return NextResponse.json({
      success: true,
      reference,
      authorization_url: result.data.authorization_url,
      access_code: result.data.access_code,
    })
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Erreur serveur lors de l'initialisation"
    console.error('[iKeePay Initialize API Error]', errMsg)
    return NextResponse.json(
      { error: errMsg },
      { status: 500 }
    )
  }
}