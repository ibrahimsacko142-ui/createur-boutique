import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

/*
  ═══════════════════════════════════════════════════════════════
  POST /api/send-otp
  Envoie un code OTP à 6 chiffres par SMS (Twilio).
  Le code est stocké dans un cookie httpOnly signé (HMAC-SHA256),
  pas besoin de base de données.

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

    /* ── 3. Envoyer le SMS via Twilio ── */
    const sid = process.env.TWILIO_ACCOUNT_SID
    const token_tw = process.env.TWILIO_AUTH_TOKEN
    const from = process.env.TWILIO_PHONE_NUMBER
    let smsSent = false
    let smsError = ''

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
        const msg = err instanceof Error ? err.message : 'Erreur Twilio'
        smsError = msg
        console.error('[SMS OTP] Erreur Twilio :', msg)
      }
    }

    /* ── 4. Réponse + cookie httpOnly ── */
    const response = NextResponse.json({
      success: true,
      smsSent,
      devMode: !sid || !token_tw || !from,
      message: smsSent
        ? 'Code envoy\u00e9 par SMS'
        : !sid
          ? 'Mode d\u00e9veloppement : Twilio non configur\u00e9. Le code est retourn\u00e9 ci-dessous.'
          : `Erreur d\u2019envoi SMS : ${smsError}`,
      // En mode dev on retourne le code pour tester, en prod il n'est QUE dans le SMS
      ...(smsSent ? {} : { devOtp: otp }),
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
    console.error('[SMS OTP] Erreur serveur :', error)
    return NextResponse.json({ success: false, error: "Erreur serveur. R\u00e9essayez." }, { status: 500 })
  }
}