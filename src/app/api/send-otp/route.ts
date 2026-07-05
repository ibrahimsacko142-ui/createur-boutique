import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

/*
  ═══════════════════════════════════════════════════════════════
  POST /api/send-otp
  Génère un code OTP à 6 chiffres, le signe avec HMAC-SHA256,
  le stocke dans un cookie httpOnly (pas de base de données).
  Le code est renvoyé au frontend pour affichage immédiat.

  Si TWILIO_ACCOUNT_SID est configuré, le code est aussi envoyé
  par SMS en plus d'être affiché (mode hybride).

  Body : { phone: "+22370000000" }
  ═══════════════════════════════════════════════════════════════
*/

const OTP_SECRET = process.env.OTP_SECRET || 'studio-creatif-bamako-secret-key-2024'
const OTP_EXPIRY_MS = 5 * 60 * 1000 // 5 minutes

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const phone: string = body.phone ?? ''

    if (!phone || phone.replace(/\D/g, '').length < 8) {
      return NextResponse.json({ success: false, error: 'Numéro de téléphone invalide.' }, { status: 400 })
    }

    /* ── 1. Générer le code OTP ── */
    const otp = Math.floor(100_000 + Math.random() * 900_000).toString()
    const timestamp = Date.now().toString()

    /* ── 2. Signer le token (HMAC-SHA256) ── */
    const hmac = crypto.createHmac('sha256', OTP_SECRET)
    hmac.update(`${timestamp}:${otp}`)
    const signature = hmac.digest('hex')
    const token = Buffer.from(`${timestamp}:${otp}:${signature}`).toString('base64url')

    /* ── 3. Tenter l'envoi SMS si Twilio est configuré (optionnel) ── */
    const sid = process.env.TWILIO_ACCOUNT_SID
    const token_tw = process.env.TWILIO_AUTH_TOKEN
    const from = process.env.TWILIO_PHONE_NUMBER
    let smsSent = false

    if (sid && token_tw && from) {
      try {
        const twilio = (await import('twilio')).default
        const client = twilio(sid, token_tw)
        await client.messages.create({
          body: `\ud83d\udd10 Studio Cr\u00e9atif\n\nVotre code de v\u00e9rification est : ${otp}\n\nCe code expire dans 5 minutes.`,
          from,
          to: phone,
        })
        smsSent = true
      } catch (err: unknown) {
        console.error('[SMS OTP] Erreur Twilio (non bloquant) :', err instanceof Error ? err.message : err)
      }
    }

    /* ── 4. Réponse + cookie httpOnly ── */
    const response = NextResponse.json({
      success: true,
      smsSent,
      otp,
      message: smsSent
        ? 'Code envoyé par SMS'
        : 'Code de vérification généré',
    })

    response.cookies.set('sc_otp', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: Math.floor(OTP_EXPIRY_MS / 1000),
      path: '/',
    })

    return response
  } catch (error) {
    console.error('[SEND OTP] Erreur serveur :', error)
    return NextResponse.json({ success: false, error: 'Erreur serveur. Réessayez.' }, { status: 500 })
  }
}