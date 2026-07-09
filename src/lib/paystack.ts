import crypto from 'crypto'

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY!
const PAYSTACK_BASE = 'https://api.paystack.co'

/* ═══ Initialize a transaction on Paystack ═══ */
export async function initializeTransaction(data: {
  email: string
  amount: number // in smallest currency unit (XOF = no decimals, so 15000 FCFA = 15000)
  reference: string
  currency?: string
  metadata?: Record<string, unknown>
}) {
  const res = await fetch(`${PAYSTACK_BASE}/transaction/initialize`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${PAYSTACK_SECRET}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: data.email,
      amount: data.amount,
      reference: data.reference,
      currency: data.currency || 'XOF',
      channels: ['mobile_money', 'card'], // Orange Money, Moov Money, Cards
      metadata: {
        custom_fields: [
          {
            display_name: 'Service',
            variable_name: 'service',
            type: 'string',
          },
        ],
        ...data.metadata,
      },
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    console.error('[Paystack Init Error]', res.status, text)
    throw new Error(`Paystack initialization failed: ${res.status}`)
  }

  return res.json()
}

/* ═══ Verify a transaction with Paystack API (strict server-side check) ═══ */
export async function verifyTransaction(reference: string) {
  const res = await fetch(`${PAYSTACK_BASE}/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: {
      'Authorization': `Bearer ${PAYSTACK_SECRET}`,
    },
  })

  if (!res.ok) {
    const text = await res.text()
    console.error('[Paystack Verify Error]', res.status, text)
    throw new Error(`Paystack verification failed: ${res.status}`)
  }

  return res.json()
}

/* ═══ Verify webhook signature (HMAC-SHA512) — STRICT ═══ */
export function verifyWebhookSignature(rawBody: string, signature: string | null): boolean {
  if (!signature || !PAYSTACK_SECRET) {
    console.error('[Webhook] Missing signature or secret key')
    return false
  }

  const expectedHash = crypto
    .createHmac('sha512', PAYSTACK_SECRET)
    .update(rawBody)
    .digest('hex')

  // Timing-safe comparison to prevent timing attacks
  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedHash, 'hex')
    )
  } catch {
    return false
  }
}