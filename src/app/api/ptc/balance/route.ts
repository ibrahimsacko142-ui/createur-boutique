import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

/*
  GET /api/ptc/balance?phone=223XXXXXXXX
  Retourne le solde et le nombre de vues d'un utilisateur.
*/

export async function GET(req: NextRequest) {
  try {
    const phone = req.nextUrl.searchParams.get('phone')
    if (!phone) {
      return NextResponse.json({ success: false, error: 'Numéro manquant.' }, { status: 400 })
    }

    const cleanPhone = phone.replace(/\s/g, '')
    const user = await db.ptcUser.findUnique({ where: { phone: cleanPhone } })

    if (!user) {
      return NextResponse.json({
        success: true,
        balance: 0,
        totalViewed: 0,
        isNew: true,
      })
    }

    return NextResponse.json({
      success: true,
      balance: user.balance,
      totalViewed: user.totalViewed,
      isNew: false,
    })
  } catch (error) {
    console.error('[PTC BALANCE] Erreur:', error)
    return NextResponse.json({ success: false, error: 'Erreur serveur.' }, { status: 500 })
  }
}