import { NextRequest, NextResponse } from 'next/server'

// ═══ MAKETOU — Vérifier le statut d'un panier ═══
// GET /api/payment/status?cartId=xxx
// Statuts possibles : waiting_payment, completed, abandoned, payment_failed

const MAKETOU_API_KEY = process.env.MAKETOU_API_KEY || ''
const MAKETOU_BASE_URL = 'https://api.maketou.net'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const cartId = searchParams.get('cartId')

  if (!cartId) {
    return NextResponse.json({ error: 'cartId requis' }, { status: 400 })
  }

  if (!MAKETOU_API_KEY) {
    return NextResponse.json({ error: 'Paiement non configuré', demo: true }, { status: 503 })
  }

  try {
    const response = await fetch(`${MAKETOU_BASE_URL}/api/v1/stores/cart/${cartId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${MAKETOU_API_KEY}`,
      },
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'Panier non trouvé' }, { status: response.status })
    }

    const data = await response.json()
    const status = data.status
    const meta = data.meta || {}
    const customerInfo = data.customerInfo || {}

    // Si le paiement est complété, notifier Sacko
    if (status === 'completed') {
      const orderId = meta.orderId || cartId
      const waMsg = `✅ *PAIEMENT VALIDÉ — Maketou*\n\n📋 Référence : ${orderId}\n👤 Client : ${customerInfo.firstName || ''} ${customerInfo.lastName || ''}\n📱 Tél : ${customerInfo.phone || ''}\n📧 Email : ${customerInfo.email || ''}\n🟢 Statut : COMPLÉTÉ\n🔗 Cart ID : ${cartId}\n\n✅ Livrez le produit dès maintenant !`
      fetch(`https://wa.me/22397787244?text=${encodeURIComponent(waMsg)}`).catch(() => {})
    }

    return NextResponse.json({
      success: true,
      cart_id: data.id,
      status,
      customer_info: customerInfo,
      meta,
      created_at: data.createdAt,
      updated_at: data.updatedAt,
    })
  } catch (error) {
    console.error('[Maketou] Status check error:', error)
    return NextResponse.json({ error: 'Erreur de vérification' }, { status: 500 })
  }
}