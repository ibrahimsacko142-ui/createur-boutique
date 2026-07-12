import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

/*
  POST /api/ptc/referral
  Applique un code de parrainage à l'utilisateur connecté.
  Body : { phone: "223XXXXXXXX", referralCode: "abc123" }
*/

export async function POST(req: NextRequest) {
  try {
    const { phone, referralCode } = await req.json()

    if (!phone || !referralCode) {
      return NextResponse.json({ success: false, error: 'Données manquantes.' }, { status: 400 })
    }

    const cleanPhone = phone.replace(/\s/g, '')

    const user = await db.ptcUser.findUnique({ where: { phone: cleanPhone } })
    if (!user) {
      return NextResponse.json({ success: false, error: 'Utilisateur non trouvé.' }, { status: 404 })
    }

    if (user.referralCode === referralCode) {
      return NextResponse.json({ success: false, error: 'Vous ne pouvez pas utiliser votre propre code.' }, { status: 400 })
    }

    if (user.referredBy) {
      return NextResponse.json({ success: false, error: 'Vous avez déjà un parrain.' }, { status: 400 })
    }

    const referrer = await db.ptcUser.findUnique({ where: { referralCode } })
    if (!referrer) {
      return NextResponse.json({ success: false, error: 'Code de parrainage invalide.' }, { status: 404 })
    }

    const REFERRAL_BONUS = 10
    const REFERRER_BONUS = 5

    await db.$transaction([
      db.ptcUser.update({
        where: { phone: cleanPhone },
        data: {
          referredBy: referralCode,
          balance: { increment: REFERRAL_BONUS },
        },
      }),
      db.ptcUser.update({
        where: { referralCode },
        data: {
          referralCount: { increment: 1 },
          referralEarnings: { increment: REFERRER_BONUS },
          balance: { increment: REFERRER_BONUS },
        },
      }),
    ])

    const updatedUser = await db.ptcUser.findUnique({ where: { phone: cleanPhone } })

    return NextResponse.json({
      success: true,
      message: `Parrainage appliqué ! +${REFERRAL_BONUS} FCFA pour vous, +${REFERRER_BONUS} FCFA pour votre parrain.`,
      bonus: REFERRAL_BONUS,
      newBalance: updatedUser?.balance,
    })
  } catch (error) {
    console.error('[PTC REFERRAL] Erreur:', error)
    return NextResponse.json({ success: false, error: 'Erreur serveur.' }, { status: 500 })
  }
}