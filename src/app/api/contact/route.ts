import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, subject, message } = body

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 })
    }

    // Log contact message (no database needed — could be connected to email service later)
    console.log('📩 Nouveau message de contact:', { name, email, subject, message })

    return NextResponse.json({ success: true, message: 'Message envoyé avec succès' }, { status: 200 })
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}