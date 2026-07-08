import { NextRequest, NextResponse } from 'next/server'

// ═══ CINETPAY — Passerelle de paiement pour le Mali ═══
// API : https://api-checkout.cinetpay.com/v2/payment
// Le client est redirigé vers la page de paiement CinetPay
// Après paiement, CinetPay redirige vers return_url et envoie un webhook à notify_url

const CINETPAY_API_KEY = process.env.CINETPAY_API_KEY || ''
const CINETPAY_SITE_ID = process.env.CINETPAY_SITE_ID || ''
const CINETPAY_BASE_URL = 'https://api-checkout.cinetpay.com/v2'
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || ''

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const {
      amount,
      product,
      description,
      customerName,
      customerPhone,
      customerEmail,
      transactionId,
    } = body

    // Validation
    if (!customerName) {
      return NextResponse.json({ error: 'Nom requis' }, { status: 400 })
    }

    if (!amount || amount < 100) {
      return NextResponse.json({ error: 'Le montant minimum est de 100 FCFA' }, { status: 400 })
    }

    // Vérifier que CinetPay est configuré
    if (!CINETPAY_API_KEY || CINETPAY_API_KEY === 'VOTRE_CLE_API_ICI' || !CINETPAY_SITE_ID || CINETPAY_SITE_ID === 'VOTRE_SITE_ID_ICI') {
      return NextResponse.json({
        error: 'Paiement en cours de configuration',
        message: 'Les identifiants CinetPay ne sont pas encore configurés. Le mode démonstration est actif.',
        demo: true,
      }, { status: 503 })
    }

    // Générer un ID de transaction unique
    const txnId = transactionId || `SC-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`

    // Séparer prénom et nom
    const nameParts = customerName.trim().split(/\s+/)
    const firstName = nameParts[0] || ''
    const lastName = nameParts.slice(1).join(' ') || ''

    // Formater le téléphone pour le Mali
    let phone = (customerPhone || '').replace(/\s/g, '')
    if (phone.startsWith('0')) phone = phone.substring(1)
    if (!phone.startsWith('+223') && !phone.startsWith('223')) phone = `223${phone}`

    // Construire la requête CinetPay
    const cinetpayBody = {
      apikey: CINETPAY_API_KEY,
      site_id: CINETPAY_SITE_ID,
      transaction_id: txnId,
      amount: amount,
      currency: 'XOF',
      description: product || description || `Commande Studio Créatif — ${amount} FCFA`,
      notify_url: `${BASE_URL}/api/payment/webhook`,
      return_url: `${BASE_URL}/?payment_success=true&txn_id=${txnId}`,
      customer_id: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@client.studio-creatif.ml`,
      customer_name: customerName,
      customer_surname: lastName || firstName,
      customer_phone_number: phone || undefined,
      customer_email: customerEmail || undefined,
      customer_city: 'Bamako',
      customer_country: 'ML',
      customer_state: 'Bamako',
      lang: 'FR',
      metadata: JSON.stringify({
        orderId: txnId,
        product: product || description || 'Commande',
        source: 'studio-creatif-boutique',
        customerPhone: customerPhone,
      }),
    }

    console.log('[CinetPay] Creating payment:', { txnId, amount, currency: 'XOF', customerName })

    const response = await fetch(`${CINETPAY_BASE_URL}/payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cinetpayBody),
    })

    const data = await response.json()

    console.log('[CinetPay] Response:', JSON.stringify(data).substring(0, 500))

    if (!response.ok || data.code !== '201') {
      console.error('[CinetPay] Error:', data)
      return NextResponse.json({
        error: 'Erreur lors de la création du paiement',
        details: data.message || data.description || `Code: ${data.code || 'UNKNOWN'}`,
      }, { status: response.status || 500 })
    }

    const paymentToken = data.data?.payment_token
    const paymentUrl = data.data?.payment_url

    if (!paymentToken && !paymentUrl) {
      console.error('[CinetPay] Missing payment_token or payment_url:', data)
      return NextResponse.json({
        error: 'Réponse CinetPay invalide',
        details: 'payment_token ou payment_url manquant.',
      }, { status: 500 })
    }

    // L'URL de redirection est soit payment_url, soit construite avec le token
    const redirectUrl = paymentUrl || `https://checkout.cinetpay.com/?token=${paymentToken}`

    // Enregistrer le paiement dans le store partagé (pour le dashboard)
    try {
      await fetch(`${BASE_URL}/api/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartId: txnId,
          orderId: txnId,
          amount,
          product: product || description || 'Commande',
          customerName,
          customerPhone,
          customerEmail,
          status: 'PENDING',
          createdAt: new Date().toISOString(),
        }),
      }).catch(() => {})
    } catch {
      // Non bloquant
    }

    // Notifier Sacko par WhatsApp
    const waMsg = `🛒 *NOUVELLE COMMANDE — CinetPay*\n\n📋 Référence : ${txnId}\n👤 Client : ${customerName}\n📱 Tél : ${phone}\n📧 Email : ${customerEmail || 'Non renseigné'}\n💳 Produit : ${product || description}\n💰 Montant : ${amount.toLocaleString('fr-FR')} FCFA\n📡 Statut : En attente de paiement\n🔗 Token : ${paymentToken?.substring(0, 20)}...\n\n⏰ ${new Date().toLocaleString('fr-FR', { timeZone: 'Africa/Bamako' })}`

    fetch(`https://wa.me/22397787244?text=${encodeURIComponent(waMsg)}`).catch(() => {})

    return NextResponse.json({
      success: true,
      transaction_id: txnId,
      payment_token: paymentToken,
      redirect_url: redirectUrl,
      status: 'PENDING',
    })
  } catch (error) {
    console.error('[CinetPay] Payment create error:', error)
    return NextResponse.json({
      error: 'Erreur serveur de paiement',
    }, { status: 500 })
  }
}