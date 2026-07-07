import { NextRequest, NextResponse } from 'next/server'

// ═══ MAKETOU — Ancien webhook conservé pour compatibilité ═══
// Maketou utilise redirectURL, pas de webhook côté serveur
// Le statut est vérifié via GET /api/payment/status?cartId=xxx
// Cette route sert de fallback

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    console.log('[Maketou Webhook] Received:', JSON.stringify(body).substring(0, 200))

    const cartId = body.cartId || body.cart_id || body.id
    const status = body.status

    if (cartId && status === 'completed') {
      const meta = body.meta || {}
      const customerInfo = body.customerInfo || {}
      const orderId = meta.orderId || cartId
      const waMsg = `✅ *PAIEMENT VALIDÉ — Maketou*\n\n📋 Référence : ${orderId}\n👤 Client : ${customerInfo.firstName || ''} ${customerInfo.lastName || ''}\n🟢 Statut : COMPLÉTÉ\n🔗 Cart ID : ${cartId}\n\n✅ Livrez le produit !`
      fetch(`https://wa.me/22397787244?text=${encodeURIComponent(waMsg)}`).catch(() => {})
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Maketou Webhook] Error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}