import { NextRequest, NextResponse } from 'next/server'

/**
 * Temporary image upload endpoint.
 * Accepts a file, converts it to a base64 data URL that can be
 * passed as `links` to image editing APIs.
 * 
 * For NanoBanana-style APIs that need a public URL, we also
 * try to use the image as an inline base64 — if the API rejects it,
 * the user should provide a public URL instead.
 */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ success: false, error: 'Aucun fichier fourni.' }, { status: 400 })
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ success: false, error: 'Le fichier doit être une image.' }, { status: 400 })
    }

    // Limit size to 10 MB
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: 'Image trop volumineuse (max 10 Mo).' }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const base64 = Buffer.from(arrayBuffer).toString('base64')
    const dataUrl = `data:${file.type};base64,${base64}`

    return NextResponse.json({
      success: true,
      dataUrl,
      mimeType: file.type,
      size: file.size,
    })
  } catch (error) {
    console.error('[Upload Image API] Error:', error)
    return NextResponse.json({ success: false, error: 'Erreur lors du traitement du fichier.' }, { status: 500 })
  }
}