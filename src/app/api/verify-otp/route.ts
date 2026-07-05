import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

/*
  ═══════════════════════════════════════════════════════════════
  POST /api/verify-otp
  Vérifie le code OTP saisi par l'utilisateur contre le cookie
  signé (httpOnly) posé par /api/send-otp.

  Body : { otp: "123456" }
  ═══════════════════════════════════════════════════════════════
*/

const OTP_SECRET = process.env.OTP_SECRET || 'studio-creatif-bamako-secret-key-2024'
const OTP_EXPIRY_MS = 5 * 60 * 1000 // 5 minutes

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const otp: string = (body.otp ?? '').trim()

    /* ── Validation basique ── */
    if (!/^\d{6}$/.test(otp)) {
      return NextResponse.json({ success: false, error: 'Entrez exactement 6 chiffres.' }, { status: 400 })
    }

    /* ── Lire le cookie OTP ── */
    const cookie = req.cookies.get('sc_otp')
    if (!cookie?.value) {
      return NextResponse.json({ success: false, error: 'Aucun code en attente. Demandez un nouveau code.' }, { status: 400 })
    }

    /* ── Décoder le token ── */
    let decoded: string
    try {
      decoded = Buffer.from(cookie.value, 'base64url').toString()
    } catch {
      return NextResponse.json({ success: false, error: 'Token invalide.' }, { status: 400 })
    }

    const parts = decoded.split(':')
    if (parts.length !== 3) {
      return NextResponse.json({ success: false, error: 'Token corrompu.' }, { status: 400 })
    }

    const [timestampStr, storedOtp, signature] = parts

    /* ── Vérifier la signature HMAC ── */
    const hmac = crypto.createHmac('sha256', OTP_SECRET)
    hmac.update(`${timestampStr}:${storedOtp}`)
    const expected = hmac.digest('hex')

    if (signature !== expected) {
      return NextResponse.json({ success: false, error: 'Token altéré.' }, { status: 400 })
    }

    /* ── Vérifier l'expiration (5 min) ── */
    const tokenTime = parseInt(timestampStr, 10)
    if (Number.isNaN(tokenTime) || Date.now() - tokenTime > OTP_EXPIRY_MS) {
      // Supprimer le cookie expiré
      const res = NextResponse.json({ success: false, error: 'Code expiré. Demandez un nouveau code.' }, { status: 400 })
      res.cookies.set('sc_otp', '', { maxAge: 0, path: '/' })
      return res
    }

    /* ── Comparer le code ── */
    if (otp !== storedOtp) {
      return NextResponse.json({ success: false, error: 'Code incorrect.' }, { status: 400 })
    }

    /* ── Succès → supprimer le cookie OTP ── */
    const response = NextResponse.json({ success: true, message: 'Code vérifié avec succès.' })
    response.cookies.set('sc_otp', '', { maxAge: 0, path: '/' })
    return response
  } catch (error) {
    console.error('[VERIFY OTP] Erreur serveur :', error)
    return NextResponse.json({ success: false, error: 'Erreur serveur. Réessayez.' }, { status: 500 })
  }
}