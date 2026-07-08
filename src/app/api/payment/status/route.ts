import { NextRequest, NextResponse } from 'next/server'

// ═══ Statut de commande — Lecture seule ═══

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const txnId = searchParams.get('txnId') || searchParams.get('cartId')

  if (!txnId) {
    return NextResponse.json({ error: 'txnId requis' }, { status: 400 })
  }

  // Pour le mode WhatsApp, on renvoie simplement le statut enregistré
  return NextResponse.json({
    success: true,
    transaction_id: txnId,
    status: 'waiting_payment',
    message: 'Commande enregistrée. Le paiement se fait via WhatsApp.',
  })
}