'use client'

import { useEffect, useRef } from 'react'

/* ─── AdSense Ad Unit ─── */
/* Places an auto-ads responsive banner. 
   Google will serve appropriate ads based on the page content. */
export default function AdBanner({ style = {}, slot = 'auto' }: { style?: React.CSSProperties; slot?: string }) {
  const adRef = useRef<HTMLDivElement>(null)
  const pushed = useRef(false)

  useEffect(() => {
    // Ensure adsbygoogle is loaded and we only push once per unit
    if (pushed.current) return
    try {
      const w = window as unknown as { adsbygoogle: unknown[] }
      if (w.adsbygoogle) {
        pushed.current = true
        ;(w.adsbygoogle).push({})
      }
    } catch {
      // AdSense not loaded yet (ad blocker, etc.)
    }
  }, [])

  return (
    <div ref={adRef} style={{ ...style }}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', minHeight: '90px' }}
        data-ad-client="ca-pub-5792648101445233"
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}