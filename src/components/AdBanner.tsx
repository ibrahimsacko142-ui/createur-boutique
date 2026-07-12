'use client'

import { useEffect, useRef, useId } from 'react'

/*
  AdSense Ad Unit — multi-instance safe
  Each instance gets a unique container and properly pushes to adsbygoogle.
  Retries if adsbygoogle isn't loaded yet.
*/

const AD_CLIENT = 'ca-pub-5792648101445233'

export default function AdBanner({ className = '' }: { className?: string }) {
  const adRef = useRef<HTMLDivElement>(null)
  const pushed = useRef(false)
  const uniqueId = useId().replace(/:/g, '_')

  useEffect(() => {
    if (pushed.current) return

    const tryPush = () => {
      try {
        const w = window as unknown as { adsbygoogle: unknown[] }
        if (w.adsbygoogle && !pushed.current) {
          pushed.current = true
          w.adsbygoogle.push({})
        }
      } catch {
        // ignore
      }
    }

    // Try immediately
    tryPush()

    // Retry every 500ms for up to 5 seconds (in case AdSense loads late)
    const retries = [500, 1000, 1500, 2000, 3000, 5000]
    const timers = retries.map(delay => setTimeout(tryPush, delay))

    return () => {
      timers.forEach(clearTimeout)
    }
  }, [uniqueId])

  return (
    <div ref={adRef} className={`min-h-[90px] w-full ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', minHeight: '90px' }}
        data-ad-client={AD_CLIENT}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}