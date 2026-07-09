import { NextResponse } from 'next/server'

/* ═══ GET /api/ikeepay/debug ═══
   Endpoint de diagnostic pour vérifier la connectivité avec l'API iKeePay.
   À SUPPRIMER une fois le paiement fonctionnel en production. */

export async function GET() {
  const results: Record<string, string> = {}

  // 1. Check env vars
  results.secret_key_set = process.env.IKEEPAY_SECRET_KEY ? 'YES' : 'NO — IKEEPAY_SECRET_KEY manquante !'
  results.public_key_set = process.env.NEXT_PUBLIC_IKEEPAY_KEY ? 'YES' : 'NO'
  results.base_url = process.env.IKEEPAY_BASE_URL || '(default: https://api.ikeepay.com)'

  // 2. Test API connectivity
  const baseUrl = process.env.IKEEPAY_BASE_URL || 'https://api.ikeepay.com'
  const urlObj = new URL(baseUrl)
  results.api_host = urlObj.hostname

  try {
    const dnsStart = Date.now()
    const response = await fetch(`${baseUrl}/v1/transaction/initialize`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.IKEEPAY_SECRET_KEY || ''}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'debug@test.com',
        amount: 100,
        reference: `DEBUG-${Date.now()}`,
        currency: 'XOF',
      }),
    })
    const dnsTime = Date.now() - dnsStart
    results.http_status = String(response.status)
    results.response_time = `${dnsTime}ms`

    const text = await response.text()
    results.response_preview = text.substring(0, 500)

    if (response.ok) {
      results.status = 'OK — API iKeePay accessible et fonctionnelle !'
    } else {
      results.status = `ERROR ${response.status} — API a répondu mais avec une erreur`
    }
  } catch (err: unknown) {
    const error = err as Error
    results.status = 'CONNECTION FAILED'
    results.error_type = error.name || 'Unknown'
    results.error_message = error.message || String(error)

    if (error.message?.includes('ENOTFOUND') || error.message?.includes('getaddrinfo')) {
      results.diagnosis = `Le domaine "${urlObj.hostname}" ne résout pas en DNS. Vérifiez l'URL de base de l'API iKeePay dans votre dashboard iKeePay.`
    } else if (error.message?.includes('ECONNREFUSED')) {
      results.diagnosis = `Connexion refusée au serveur "${urlObj.hostname}". Le serveur est peut-être hors ligne.`
    } else if (error.message?.includes('ETIMEDOUT') || error.message?.includes('timeout')) {
      results.diagnosis = `Délai d'attente dépassé pour "${urlObj.hostname}". Le serveur est lent ou inaccessible.`
    } else {
      results.diagnosis = `Erreur réseau inconnue : ${error.message}`
    }
  }

  return NextResponse.json(results)
}