import { NextRequest, NextResponse } from 'next/server'

const NANO_BANANA_API = 'https://zecora0.serv00.net/ai/NanoBanana.php'

/**
 * Friendly error mapping for known NanoBanana API errors.
 */
function mapApiError(apiError: string): string {
  const lower = (apiError || '').toLowerCase()

  if (lower.includes('no points') || lower.includes('log in') || lower.includes('login')) {
    return 'Service temporairement indisponible (crédits épuisés). L\'équipe technique est informée. Réessayez dans quelques heures ou contactez Sacko sur WhatsApp.'
  }
  if (lower.includes('invalid') || lower.includes('invalid image') || lower.includes('not a valid')) {
    return 'L\'image fournie est invalide. Utilisez une URL d\'image publique (JPEG, PNG) ou uploadez un fichier plus petit.'
  }
  if (lower.includes('nsfw') || lower.includes('inappropriate') || lower.includes('policy')) {
    return 'Le contenu demandé ne respecte pas les conditions d\'utilisation. Modifiez votre description et réessayez.'
  }
  if (lower.includes('timeout') || lower.includes('timed out')) {
    return 'Le serveur AI met trop de temps à répondre. Réessayez avec une résolution plus basse (1K).'
  }
  if (lower.includes('rate limit') || lower.includes('too many')) {
    return 'Trop de demandes. Attendez quelques secondes et réessayez.'
  }
  if (lower.includes('invalid url') || lower.includes('could not download') || lower.includes('failed to fetch')) {
    return 'Impossible de télécharger l\'image depuis l\'URL fournie. Vérifiez que l\'URL est accessible publiquement et se termine par .jpg, .png ou .webp.'
  }
  if (lower.includes('data:') || lower.includes('base64')) {
    return 'Les images uploadées locales ne sont pas supportées en ce moment. Veuillez fournir une URL d\'image publique (ex: lien d\'une image hébergée en ligne).'
  }

  // Default: forward original message
  return apiError || 'La génération a échoué. Réessayez dans quelques instants.'
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const text = formData.get('text') as string | null
    const links = formData.get('links') as string | null
    const ratio = formData.get('ratio') as string || '1:1'
    const res = (formData.get('res') as string) || '2K'

    if (!text && !links) {
      return NextResponse.json({ success: false, error: 'Texte ou image requis.' }, { status: 400 })
    }

    // For edit mode: validate that links is a public URL (not base64 data URL)
    if (links && links.startsWith('data:')) {
      return NextResponse.json({
        success: false,
        error: 'Les fichiers uploadés localement ne sont pas supportés. Veuillez coller une URL d\'image publique (lien d\'une image hébergée en ligne comme Imgur, Google Photos, etc.).',
      })
    }

    // Build form data for NanoBanana API
    const apiForm = new FormData()
    if (text) apiForm.append('text', text)
    if (links) apiForm.append('links', links)
    apiForm.append('ratio', ratio)
    apiForm.append('res', res)

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 120000) // 2 min timeout

    try {
      const apiRes = await fetch(NANO_BANANA_API, {
        method: 'POST',
        body: apiForm,
        signal: controller.signal,
      })

      clearTimeout(timeout)

      // Handle non-JSON responses
      const contentType = apiRes.headers.get('content-type') || ''
      let data: Record<string, unknown>

      if (contentType.includes('application/json')) {
        data = await apiRes.json()
      } else {
        const textBody = await apiRes.text()
        console.error('[Photo AI] Non-JSON response:', apiRes.status, textBody.substring(0, 500))
        return NextResponse.json({
          success: false,
          error: `Le service AI a répondu de manière inattendue (code ${apiRes.status}). Réessayez plus tard.`,
        })
      }

      if (data.success && data.url) {
        return NextResponse.json({
          success: true,
          url: data.url,
          mode: data.mode,
          resolution: data.resolution,
        })
      } else {
        const rawError = (data.error as string) || ''
        const friendlyError = mapApiError(rawError)
        console.error('[Photo AI] API error:', rawError)
        return NextResponse.json({
          success: false,
          error: friendlyError,
          rawError: rawError, // Include raw error for debugging
        })
      }
    } catch (fetchErr) {
      clearTimeout(timeout)
      const msg = fetchErr instanceof Error && fetchErr.name === 'AbortError'
        ? 'Délai dépassé (120s). Réessayez avec un prompt plus court ou une résolution plus basse.'
        : 'Serveur AI indisponible. Réessayez dans quelques instants.'
      return NextResponse.json({ success: false, error: msg })
    }
  } catch (error) {
    console.error('[Photo AI API] Error:', error)
    return NextResponse.json({ success: false, error: 'Erreur serveur interne.' }, { status: 500 })
  }
}