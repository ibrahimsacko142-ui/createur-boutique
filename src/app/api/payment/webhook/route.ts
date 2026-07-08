import { NextRequest, NextResponse } from 'next/server'

// ═══ Webhook — Gardé pour compatibilité future ═══
export async function POST(req: NextRequest) {
  return NextResponse.json({ success: true, message: 'Webhook reçu' })
}