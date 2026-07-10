import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, subject, message } = body

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Adresse email invalide' }, { status: 400 })
    }

    // 1) Stocker en SQLite
    await prisma.contactMessage.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        subject: (subject || 'Général').trim(),
        message: message.trim(),
      },
    })

    // 2) Envoyer un email de notification via Resend (si configuré)
    let emailSent = false
    if (process.env.RESEND_API_KEY) {
      try {
        const { Resend } = await import('resend')
        const resend = new Resend(process.env.RESEND_API_KEY)

        const emailSubject = `[Studio Créatif] Nouveau message de ${name}`
        const emailBody = `
          <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #f59e0b, #ea580c); padding: 24px; border-radius: 12px 12px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 20px;">Nouveau message de contact</h1>
            </div>
            <div style="padding: 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6; font-weight: 600; color: #6b7280; width: 120px;">Nom</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6; font-weight: 600; color: #6b7280;">Email</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;"><a href="mailto:${email}" style="color: #f59e0b;">${email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6; font-weight: 600; color: #6b7280;">Sujet</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">${subject || 'Général'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: 600; color: #6b7280; vertical-align: top;">Message</td>
                  <td style="padding: 8px 0; white-space: pre-wrap; line-height: 1.6;">${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</td>
                </tr>
              </table>
              <div style="margin-top: 20px; padding-top: 16px; border-top: 2px solid #f3f4f6; text-align: center;">
                <a href="https://wa.me/22397787244?text=${encodeURIComponent(`Bonjour ! Je suis ${name} (${email}). Sujet : ${subject || 'Général'}\n\n${message}`)}"
                   style="display: inline-block; background: #25D366; color: white; padding: 10px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">
                  Répondre sur WhatsApp
                </a>
              </div>
            </div>
          </div>
        `

        await resend.emails.send({
          from: 'Studio Créatif <onboarding@resend.dev>',
          to: ['contact@createurboutique.com'],
          replyTo: email,
          subject: emailSubject,
          html: emailBody,
        })
        emailSent = true
      } catch (emailError) {
        console.error('Email send failed (message still saved):', emailError)
      }
    }

    // 3) Auto-réponse au visiteur (si Resend configuré)
    if (process.env.RESEND_API_KEY) {
      try {
        const { Resend } = await import('resend')
        const resend = new Resend(process.env.RESEND_API_KEY)
        await resend.emails.send({
          from: 'Studio Créatif <onboarding@resend.dev>',
          to: [email],
          subject: 'Merci pour votre message — Studio Créatif',
          html: `
            <div style="font-family: system-ui, sans-serif; max-width: 560px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #f59e0b, #ea580c); padding: 20px; border-radius: 12px 12px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 18px;">Studio Créatif</h1>
              </div>
              <div style="padding: 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px; color: #374151; line-height: 1.7;">
                <p>Bonjour <strong>${name}</strong>,</p>
                <p>Merci pour votre message ! Je l'ai bien reçu et je vous répondrai dans les plus brefs délais (généralement sous 30 minutes pendant les heures ouvrables).</p>
                <p>En attendant, vous pouvez me joindre directement :</p>
                <ul style="margin: 12px 0; padding-left: 20px;">
                  <li><strong>WhatsApp :</strong> +223 97 78 72 44</li>
                  <li><strong>Email :</strong> contact@createurboutique.com</li>
                </ul>
                <p>À très vite !</p>
                <p style="margin-top: 20px; color: #9ca3af; font-size: 13px;">Sacko — Studio Créatif | Bamako, Mali</p>
              </div>
            </div>
          `,
        })
      } catch {
        // Auto-reply is nice-to-have, don't fail the request
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Message envoyé avec succès',
      emailSent,
    }, { status: 200 })
  } catch (error) {
    console.error('[Contact API] Error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// GET /api/contact?pin=XXX — Admin: list all messages
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const pin = searchParams.get('pin')

    if (pin !== (process.env.ADMIN_PIN || 'sacko2024')) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ success: true, messages })
  } catch (error) {
    console.error('[Contact API] GET Error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}