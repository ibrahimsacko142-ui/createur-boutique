'use client'

import Script from 'next/script'
import { useEffect, useRef, useState } from 'react'

/*
  Adsterra Ads — Next.js Script method (the reliable way)
*/

interface AdsterraBannerProps {
  placement?: 'banner' | 'native' | 'interstitial' | 'sidebar'
  className?: string
}

export default function AdsterraBanner({ placement = 'banner', className = '' }: AdsterraBannerProps) {
  const [show, setShow] = useState(false)
  const interstitialRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setShow(true)
  }, [])

  if (!show) return <div className={`w-full ${className}`} style={{ minHeight: '90px' }} />

  if (placement === 'banner') {
    return (
      <div className={`w-full flex justify-center ${className}`} style={{ minHeight: '90px' }}>
        <Script id="adsterra-banner" strategy="afterInteractive">
          {`atOptions = {
            'key' : 'ebdefeb6ac9aa3b99ef60ea84707c6be',
            'format' : 'iframe',
            'height' : 90,
            'width' : 728,
            'params' : {}
          };`}
        </Script>
        <Script
          src="https://www.highperformanceformat.com/ebdefeb6ac9aa3b99ef60ea84707c6be/invoke.js"
          strategy="afterInteractive"
        />
      </div>
    )
  }

  if (placement === 'native') {
    return (
      <div className={`w-full flex justify-center ${className}`} style={{ minHeight: '50px' }}>
        <Script
          src="https://pl30316034.effectivecpmnetwork.com/63/e4/56/63e4569ad5164536f78deac227dc0aa7.js"
          strategy="afterInteractive"
        />
      </div>
    )
  }

  if (placement === 'interstitial') {
    return (
      <div className={`w-full ${className}`} ref={interstitialRef}>
        <div id="container-6da7673432fce7c53a611838966a9302" />
        <Script
          src="https://pl30316031.effectivecpmnetwork.com/6da7673432fce7c53a611838966a9302/invoke.js"
          strategy="afterInteractive"
          async
        />
      </div>
    )
  }

  // sidebar
  return (
    <div className={`w-full flex justify-center ${className}`} style={{ minHeight: '50px' }}>
      <Script
        src="https://pl30316030.effectivecpmnetwork.com/bf/f3/d4/bff3d45803026d7e91fca0ab68237c39.js"
        strategy="afterInteractive"
      />
    </div>
  )
}