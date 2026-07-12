import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

/*
  POST /api/ptc/claim
  Valide une vue de pub et crédite 1 FCFA à l'utilisateur.
  Sécurité : minimum 30 secondes entre chaque vue.

  Body : { phone: "223XXXXXXXX" }
*/

const EARN_PER_VIEW = 1 // FCFA
const MIN_INTERVAL_MS = 30_000 // 30 secondes

export async function POST(req: NextRequest) {
  try {
    const { phone } = await req.json()

    if (!phone || !/^[\d+\s]{8,15}$/.test(phone)) {
      return NextResponse.json({ success: false, error: 'Numéro invalide.' }, { status: 400 })
    }

    const cleanPhone = phone.replace(/\s/g, '')

    // Find or create user
    const user = await db.ptcUser.upsert({
      where: { phone: cleanPhone },
      update: {},
      create: { phone: cleanPhone },
    })

    // Check last view timestamp (anti-fraud)
    const lastView = await db.ptcView.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    })

    if (lastView) {
      const elapsed = Date.now() - lastView.createdAt.getTime()
      if (elapsed < MIN_INTERVAL_MS) {
        const waitSec = Math.ceil((MIN_INTERVAL_MS - elapsed) / 1000)
        return NextResponse.json({
          success: false,
          error: `Attendez ${waitSec} secondes avant la prochaine pub.`,
          waitSeconds: waitSec,
        }, { status: 429 })
      }
    }

    // Credit the user
    const updatedUser = await db.ptcUser.update({
      where: { id: user.id },
      data: {
        balance: { increment: EARN_PER_VIEW },
        totalViewed: { increment: 1 },
      },
    })

    // Record the view
    await db.ptcView.create({
      data: {
        userId: user.id,
        earned: EARN_PER_VIEW,
      },
    })

    return NextResponse.json({
      success: true,
      earned: EARN_PER_VIEW,
      newBalance: updatedUser.balance,
      totalViewed: updatedUser.totalViewed,
    })
  } catch (error) {
    console.error('[PTC CLAIM] Erreur:', error)
    return NextResponse.json({ success: false, error: 'Erreur serveur.' }, { status: 500 })
  }
}