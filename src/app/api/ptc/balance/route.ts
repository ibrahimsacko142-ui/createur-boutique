import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

/*
  GET /api/ptc/balance?phone=223XXXXXXXX
  Retourne le solde, vues, code de parrainage et stats du parrainage.

  POST /api/ptc/balance
  Crée l'utilisateur s'il n'existe pas (login sans OTP).
  Body : { phone: "+223XXXXXXXX" }
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
      return NextResponse.json({ success: true, balance: 0, totalViewed: 0, isNew: true })
    }

    const referralCount = await db.ptcUser.count({ where: { referredBy: user.referralCode } })

    return NextResponse.json({
      success: true,
      balance: user.balance,
      totalViewed: user.totalViewed,
      referralCode: user.referralCode,
      referredBy: user.referredBy,
      referralCount,
      referralEarnings: user.referralEarnings,
      isNew: false,
    })
  } catch (error) {
    console.error('[PTC BALANCE] Erreur:', error)
    return NextResponse.json({ success: false, error: 'Erreur serveur.' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { phone } = await req.json()
    if (!phone || !/^[\d+\s]{8,15}$/.test(phone)) {
      return NextResponse.json({ success: false, error: 'Numéro invalide.' }, { status: 400 })
    }

    const cleanPhone = phone.replace(/\s/g, '')

    const user = await db.ptcUser.upsert({
      where: { phone: cleanPhone },
      update: {},
      create: { phone: cleanPhone },
    })

    return NextResponse.json({ success: true, phone: user.phone })
  } catch (error) {
    console.error('[PTC LOGIN] Erreur:', error)
    return NextResponse.json({ success: false, error: 'Erreur serveur.' }, { status: 500 })
  }
}