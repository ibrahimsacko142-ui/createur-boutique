import { NextRequest, NextResponse } from 'next/server'

/* ─── Z-AI SDK for text generation ─── */
async function generateText(prompt: string): Promise<string> {
  const ZAI = (await import('z-ai-web-dev-sdk')).default
  const zai = await ZAI.create()
  const response = await zai.chat.completions.create({
    model: 'glm-4-flash',
    messages: [
      {
        role: 'system',
        content: `Tu es un expert en communication WhatsApp professionnelle pour les entrepreneurs africains francophones.
Tu génères des messages WhatsApp courts, percutants et naturels.
Règles STRICTES :
- Maximum 120 mots
- Utilise des emojis pertinents mais modérés (max 4)
- Pas de formules robotiques type "Je me permets de vous contacter"
- Ton direct, chaleureux et professionnel
- Terminer par un call-to-action clair
- Ne JAMAIS mettre le texte entre guillemets ou backticks
- Retourne UNIQUEMENT le texte du message, rien d'autre`,
      },
      { role: 'user', content: prompt },
    ],
    temperature: 0.8,
    max_tokens: 300,
  })
  return response.choices[0]?.message?.content?.trim() || 'Erreur de génération.'
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { type, business, detail, tone } = body

    if (!type || !business) {
      return NextResponse.json({ error: 'Type et nom du business requis.' }, { status: 400 })
    }

    const toneMap: Record<string, string> = {
      pro: 'professionnel et poli',
      ami: 'amical et décontracté',
      urgent: 'urgent avec un sentiment de rareté',
      chaleureux: 'chaleureux et accueillant',
    }

    const typeMap: Record<string, string> = {
      promo: `une promotion pour "${detail || 'un produit/service'}" de ton business "${business}". Le client doit ressentir l'urgence et la valeur.`,
      suivi: `un suivi client après une commande ou un échange. Business : "${business}". ${detail ? `Contexte : ${detail}.` : ''}`,
      contact: `une prise de contact initiale avec un prospect. Business : "${business}". ${detail ? `Contexte : ${detail}.` : ''}`,
      felicitation: `un message de remerciement/félicitation à un client fidèle. Business : "${business}". ${detail ? `Détail : ${detail}.` : ''}`,
      rappel: `un rappel de rendez-vous ou d'échéance. Business : "${business}". ${detail ? `Détail : ${detail}.` : ''}`,
      collab: `une demande de collaboration professionnelle. Business : "${business}". ${detail ? `Projet : ${detail}.` : ''}`,
      relance: `une relance commerciale polie mais ferme. Business : "${business}". ${detail ? `Contexte : ${detail}.` : ''}`,
    }

    const toneDesc = toneMap[tone] || 'professionnel'
    const typeDesc = typeMap[type] || typeMap.promo

    const prompt = `Génère un message WhatsApp ${toneDesc} pour : ${typeDesc}`

    const message = await generateText(prompt)

    return NextResponse.json({ message })
  } catch (error) {
    console.error('Generate API error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la génération. Réessayez.' },
      { status: 500 }
    )
  }
}