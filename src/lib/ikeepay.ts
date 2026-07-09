import crypto from 'crypto'

const IKEEPAY_SECRET = process.env.IKEEPAY_SECRET_KEY!
const IKEEPAY_BASE = process.env.IKEEPAY_BASE_URL || 'https://api.ikeepay.com'

/* ═══ Initialize a transaction on iKeePay ═══ */
export async function initializeTransaction(data: {
  email: string
  amount: number // XOF : pas de sous-unité, 15000 FCFA = 15000
  reference: string
  currency?: string
  callback_url?: string
  metadata?: Record<string, unknown>
}) {
  const res = await fetch(`${IKEEPAY_BASE}/v1/transaction/initialize`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${IKEEPAY_SECRET}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: data.email,
      amount: data.amount,
      reference: data.reference,
      currency: data.currency || 'XOF',
      channels: ['mobile_money', 'card'],
      callback_url: data.callback_url,
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
    console.error('[iKeePay Init Error]', res.status, text)
    throw new Error(`iKeePay initialization failed: ${res.status} - ${text}`)
  }

  return res.json()
}

/* ═══ Verify a transaction with iKeePay API (strict server-side check) ═══ */
export async function verifyTransaction(reference: string) {
  const res = await fetch(`${IKEEPAY_BASE}/v1/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: {
      'Authorization': `Bearer ${IKEEPAY_SECRET}`,
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
  if (!signature || !IKEEPAY_SECRET) {
    console.error('[iKeePay Webhook] Missing signature or secret key')
    return false
  }

  const expectedHash = crypto
    .createHmac('sha512', IKEEPAY_SECRET)
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