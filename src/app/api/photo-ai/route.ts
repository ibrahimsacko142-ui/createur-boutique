import { NextRequest, NextResponse } from 'next/server'

const NANO_BANANA_API = 'https://zecora0.serv00.net/ai/NanoBanana.php'

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
      const data = await apiRes.json()

      if (data.success && data.url) {
        return NextResponse.json({
          success: true,
          url: data.url,
          mode: data.mode,
          resolution: data.resolution,
        })
      } else {
        return NextResponse.json({
          success: false,
          error: data.error || 'La génération a échoué. Vérifiez vos accès API ou réessayez.',
        })
      }
    } catch (fetchErr) {
      clearTimeout(timeout)
      const msg = fetchErr instanceof Error && fetchErr.name === 'AbortError'
        ? 'Délai dépassé (120s). Réessayez avec un prompt plus court.'
        : 'Serveur indisponible. Réessayez dans quelques instants.'
      return NextResponse.json({ success: false, error: msg })
    }
  } catch (error) {
    console.error('[Photo AI API] Error:', error)
    return NextResponse.json({ success: false, error: 'Erreur serveur.' }, { status: 500 })
  }
}