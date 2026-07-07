import { NextRequest, NextResponse } from 'next/server'

// ═══ MAKETOU — Passerelle de paiement pour le Mali ═══
// API : https://docs-api.maketou.com
// Base URL : https://api.maketou.net
// Le client est redirigé vers la page de paiement Maketou
// Après paiement, Maketou redirige vers redirectURL

const MAKETOU_API_KEY = process.env.MAKETOU_API_KEY || ''
const MAKETOU_BASE_URL = 'https://api.maketou.net'
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || ''

// ID du produit "Prix libre" dans la boutique Maketou
const MAKETOU_PRODUCT_GENERIC = process.env.MAKETOU_PRODUCT_GENERIC || ''

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
      productDocumentId,
    } = body

    // Validation
    if (!customerName) {
      return NextResponse.json({ error: 'Nom requis' }, { status: 400 })
    }

    // Vérifier que Maketou est configuré
    if (!MAKETOU_API_KEY) {
      return NextResponse.json({
        error: 'Paiement en cours de configuration',
        message: 'La clé API Maketou n\'est pas encore configurée. Le mode démonstration est actif.',
        demo: true,
      }, { status: 503 })
    }

    // Déterminer le productDocumentId
    const productId = productDocumentId || MAKETOU_PRODUCT_GENERIC
    if (!productId) {
      return NextResponse.json({
        error: 'Produit Maketou non configuré',
        message: 'Créez un produit "Prix libre" dans votre dashboard Maketou et ajoutez son ID dans MAKETOU_PRODUCT_GENERIC.',
      }, { status: 503 })
    }

    // Générer un ID de commande unique
    const orderId = transactionId || `SC-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`

    // Séparer prénom et nom
    const nameParts = customerName.trim().split(/\s+/)
    const firstName = nameParts[0] || ''
    const lastName = nameParts.slice(1).join(' ') || ''

    // Formater le téléphone pour le Mali
    let phone = customerPhone.replace(/\s/g, '')
    if (phone.startsWith('0')) phone = phone.substring(1)
    if (!phone.startsWith('+223') && !phone.startsWith('223')) phone = `223${phone}`

    // Créer le panier Maketou
    const maketouBody: Record<string, unknown> = {
      productDocumentId: productId,
      email: customerEmail || `${firstName.toLowerCase()}.${lastName.toLowerCase()}@client.studio-creatif.ml`,
      firstName,
      lastName,
      phone: phone || undefined,
      redirectURL: `${BASE_URL}/?payment_success=true&order=${orderId}`,
      meta: {
        orderId,
        product: product || description || 'Commande',
        source: 'studio-creatif-boutique',
        originalAmount: amount,
      },
    }

    // Si c'est un produit à prix libre, ajouter le montant
    if (amount && amount > 0) {
      maketouBody.customerPrice = amount
    }

    const response = await fetch(`${MAKETOU_BASE_URL}/api/v1/stores/cart/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MAKETOU_API_KEY}`,
      },
      body: JSON.stringify(maketouBody),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('[Maketou] Error:', data)
      return NextResponse.json({
        error: 'Erreur lors de la création du paiement',
        details: data.message || `Code: ${data.code || 'UNKNOWN'}`,
      }, { status: response.status })
    }

    const cartId = data.cart?.id
    const redirectUrl = data.redirectUrl
    const cartStatus = data.cart?.status || 'waiting_payment'

    if (!cartId || !redirectUrl) {
      console.error('[Maketou] Missing cartId or redirectUrl:', data)
      return NextResponse.json({
        error: 'Réponse Maketou invalide',
        details: 'cartId ou redirectUrl manquant.',
      }, { status: 500 })
    }

    // Enregistrer le paiement dans le store partagé (pour le dashboard)
    try {
      await fetch(`${BASE_URL}/api/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartId,
          orderId,
          amount: amount || 0,
          product: product || description || 'Commande',
          customerName,
          customerPhone,
          customerEmail,
          status: cartStatus,
          createdAt: data.cart?.createdAt || new Date().toISOString(),
        }),
      }).catch(() => {})
    } catch {
      // Non bloquant
    }

    // Notifier Sacko par WhatsApp
    const waMsg = `🛒 *NOUVELLE COMMANDE — Maketou*\n\n📋 Référence : ${orderId}\n👤 Client : ${customerName}\n📱 Tél : ${phone}\n📧 Email : ${customerEmail || 'Non renseigné'}\n💳 Produit : ${product || description}\n💰 Montant : ${(amount || 0).toLocaleString('fr-FR')} FCFA\n📡 Statut : En attente de paiement\n🔗 Cart : ${cartId}\n\n⏰ ${new Date().toLocaleString('fr-FR', { timeZone: 'Africa/Bamako' })}`

    fetch(`https://wa.me/22397787244?text=${encodeURIComponent(waMsg)}`).catch(() => {})

    return NextResponse.json({
      success: true,
      cart_id: cartId,
      order_id: orderId,
      redirect_url: redirectUrl,
      status: cartStatus,
    })
  } catch (error) {
    console.error('[Maketou] Payment create error:', error)
    return NextResponse.json({
      error: 'Erreur serveur de paiement',
    }, { status: 500 })
  }
}