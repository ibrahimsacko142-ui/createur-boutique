'use client'

import { useEffect, useRef } from 'react'

/*
  Adsterra Ad Banner Component
  ─────────────────────────────
  REPLACE 1234567 WITH YOUR REAL ADSTERRA ZONE ID after registering at adsterra.com
  Multiple zones can be used: one per placement position
*/

const ADSTERRA_ZONE_ID = '1234567' // ⚠️ REPLACE WITH YOUR ADSTERRA ZONE ID

interface AdsterraBannerProps {
  className?: string
  style?: React.CSSProperties
  zoneId?: string
}

export default function AdsterraBanner({ className = '', style = {}, zoneId }: AdsterraBannerProps) {
  const adRef = useRef<HTMLDivElement>(null)
  const pushed = useRef(false)
  const id = zoneId || ADSTERRA_ZONE_ID

  useEffect(() => {
    if (pushed.current || id === '1234567') return
    try {
      const w = window as unknown as { adsterra?: { push: (args: Record<string, unknown>) => void } }
      if (w.adsterra) {
        pushed.current = true
        w.adsterra.push({})
      }
    } catch {
      // Adsterra not loaded
    }
  }, [id])

  // Show placeholder in dev / before real zone ID
  if (id === '1234567') {
    return (
      <div
        className={`w-full rounded-xl border border-dashed border-amber-500/30 bg-amber-50/50 dark:bg-amber-900/10 flex items-center justify-center py-4 ${className}`}
        style={style}
      >
        <p className="text-[11px] text-amber-600/60 dark:text-amber-400/60 font-medium">
          Espace publicitaire Adsterra — Inscription sur adsterra.com
        </p>
      </div>
    )
  }

  return (
    <div ref={adRef} className={className} style={style}>
      <script
        async
        src={`//treningsmartlife.com/${id}/${id}.js`}
        suppressHydrationWarning
      />
    </div>
  )
}