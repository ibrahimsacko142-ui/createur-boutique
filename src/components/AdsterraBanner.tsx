'use client'

import { useEffect, useRef, useState } from 'react'

/*
  Adsterra Ad Component — Placements réels
  ─────────────────────────────────────────
  Utilise dangerouslySetInnerHTML pour une compatibilité maximale
*/

interface AdsterraBannerProps {
  placement?: 'banner' | 'native' | 'interstitial' | 'sidebar'
  className?: string
}

const AD_CODES: Record<string, string> = {
  banner: `<script>
  atOptions = {
    'key' : 'ebdefeb6ac9aa3b99ef60ea84707c6be',
    'format' : 'iframe',
    'height' : 90,
    'width' : 728,
    'params' : {}
  };
</script>
<script src="https://www.highperformanceformat.com/ebdefeb6ac9aa3b99ef60ea84707c6be/invoke.js"></script>`,

  native: `<script src="https://pl30316034.effectivecpmnetwork.com/63/e4/56/63e4569ad5164536f78deac227dc0aa7.js"></script>`,

  interstitial: `<div id="container-6da7673432fce7c53a611838966a9302"></div>
<script async="async" data-cfasync="false" src="https://pl30316031.effectivecpmnetwork.com/6da7673432fce7c53a611838966a9302/invoke.js"></script>`,

  sidebar: `<script src="https://pl30316030.effectivecpmnetwork.com/bf/f3/d4/bff3d45803026d7e91fca0ab68237c39.js"></script>`,
}

export default function AdsterraBanner({ placement = 'banner', className = '' }: AdsterraBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className={`w-full ${className}`} style={{ minHeight: '90px' }} />
  }

  return (
    <div
      ref={containerRef}
      className={`w-full ${className}`}
      style={{ minHeight: placement === 'banner' ? '90px' : '50px' }}
      dangerouslySetInnerHTML={{ __html: AD_CODES[placement] || AD_CODES.banner }}
    />
  )
}