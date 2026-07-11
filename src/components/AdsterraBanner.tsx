'use client'

import { useEffect, useRef } from 'react'

/*
  Adsterra Ad Component — 4 placements disponibles
  ──────────────────────────────────────────────────
  placement:
    "banner"      → Bannière 728x90 (atOptions)
    "native"      → Annonce native (script auto)
    "interstitial" → Pop-under / interstitial
    "sidebar"     → Annonce supplémentaire
*/

interface AdsterraBannerProps {
  placement?: 'banner' | 'native' | 'interstitial' | 'sidebar'
  className?: string
}

const AD_CONFIGS = {
  banner: {
    key: 'ebdefeb6ac9aa3b99ef60ea84707c6be',
    format: 'iframe',
    height: 90,
    width: 728,
    src: 'https://www.highperformanceformat.com/ebdefeb6ac9aa3b99ef60ea84707c6be/invoke.js',
  },
  native: {
    src: 'https://pl30316034.effectivecpmnetwork.com/63/e4/56/63e4569ad5164536f78deac227dc0aa7.js',
  },
  interstitial: {
    containerId: 'container-6da7673432fce7c53a611838966a9302',
    src: 'https://pl30316031.effectivecpmnetwork.com/6da7673432fce7c53a611838966a9302/invoke.js',
  },
  sidebar: {
    src: 'https://pl30316030.effectivecpmnetwork.com/bf/f3/d4/bff3d45803026d7e91fca0ab68237c39.js',
  },
}

export default function AdsterraBanner({ placement = 'banner', className = '' }: AdsterraBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const loaded = useRef(false)

  useEffect(() => {
    if (loaded.current || !containerRef.current) return
    loaded.current = true

    const config = AD_CONFIGS[placement]

    if (placement === 'banner') {
      // Banner ad using atOptions
      const w = window as unknown as Record<string, unknown>
      w.atOptions = {
        key: config.key,
        format: config.format,
        height: config.height,
        width: config.width,
        params: {},
      }
      const script = document.createElement('script')
      script.src = (config as { src: string }).src
      script.async = true
      containerRef.current.appendChild(script)
    } else if (placement === 'interstitial') {
      // Interstitial with container div
      const cfg = config as { containerId: string; src: string }
      const div = document.createElement('div')
      div.id = cfg.containerId
      containerRef.current.appendChild(div)
      const script = document.createElement('script')
      script.src = cfg.src
      script.async = true
      script.setAttribute('data-cfasync', 'false')
      containerRef.current.appendChild(script)
    } else {
      // Native / sidebar — simple script
      const script = document.createElement('script')
      script.src = (config as { src: string }).src
      script.async = true
      containerRef.current.appendChild(script)
    }
  }, [placement])

  return (
    <div
      ref={containerRef}
      className={`w-full flex justify-center ${className}`}
      style={{ minHeight: placement === 'banner' ? '90px' : '50px' }}
    />
  )
}