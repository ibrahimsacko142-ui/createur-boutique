import crypto from 'crypto'

function getIkeepayConfig() {
  const secret = process.env.IKEEPAY_SECRET_KEY
  const base = process.env.IKEEPAY_BASE_URL || 'https://api.ikeepay.com'

  if (!secret) {
    console.error('[iKeePay Config] IKEEPAY_SECRET_KEY is not set in environment variables')
  }

  return { secret: secret || '', base }
}

/* ═══ Initialize a transaction on iKeePay ═══ */
export async function initializeTransaction(data: {
  email: string
  amount: number // XOF : pas de sous-unité, 15000 FCFA = 15000
  reference: string
  currency?: string
  callback_url?: string
  metadata?: Record<string, unknown>
}) {
  const { secret, base } = getIkeepayConfig()

  if (!secret) {
    throw new Error('Clé API iKeePay non configurée. Contactez l\'administrateur.')
  }

  const url = `${base}/v1/transaction/initialize`
  console.log(`[iKeePay Init] Calling ${url} for ref=${data.reference} amount=${data.amount}`)

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${secret}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: data.email,
        amount: data.amount,
        reference: data.reference,
        currency: data.currency || 'XOF',
        callback_url: data.callback_url,
        metadata: data.metadata,
      }),
    })

    const text = await res.text()
    console.log(`[iKeePay Init] Response status=${res.status} body=${text.substring(0, 300)}`)

    if (!res.ok) {
      throw new Error(`iKeePay error ${res.status}: ${text.substring(0, 200)}`)
    }

    return JSON.parse(text)
  } catch (err: unknown) {
    const error = err as Error
    // Provide a user-friendly error based on the error type
    if (error.message?.includes('ENOTFOUND') || error.message?.includes('getaddrinfo')) {
      console.error(`[iKeePay Init] DNS resolution failed for ${new URL(base).hostname}`)
      throw new Error('Serveur de paiement injoignable. L\'URL de l\'API iKeePay est incorrecte.')
    }
    if (error.message?.includes('ECONNREFUSED')) {
      throw new Error('Serveur de paiement refuse la connexion. Réessayez plus tard.')
    }
    if (error.message?.includes('fetch failed')) {
      throw new Error('Erreur réseau avec le serveur de paiement. Vérifiez votre connexion.')
    }
    // Re-throw API errors as-is
    throw error
  }
}

/* ═══ Verify a transaction with iKeePay API (strict server-side check) ═══ */
export async function verifyTransaction(reference: string) {
  const { secret, base } = getIkeepayConfig()

  if (!secret) {
    throw new Error('Clé API iKeePay non configurée.')
  }

  const res = await fetch(`${base}/v1/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: {
      'Authorization': `Bearer ${secret}`,
    },
  })

  if (!res.ok) {
    const text = await res.text()
    console.error('[iKeePay Verify Error]', res.status, text)
    throw new Error(`iKeePay verification failed: ${res.status}`)
  }

  return res.json()
}

/* ═══ Verify webhook signature (HMAC-SHA512) — STRICT ═══ */
export function verifyWebhookSignature(rawBody: string, signature: string | null): boolean {
  const { secret } = getIkeepayConfig()

  if (!signature || !secret) {
    console.error('[iKeePay Webhook] Missing signature or secret key')
    return false
  }

  const expectedHash = crypto
    .createHmac('sha512', secret)
    .update(rawBody)
    .digest('hex')

  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedHash, 'hex')
    )
  } catch {
    return false
  }
}