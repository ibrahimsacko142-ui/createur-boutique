'use client'

import { useEffect, useRef } from 'react'

const ADSTERRA_KEY = 'f0bd986ebfb3589b5e800ceeaa28a9d5'

export default function AdsterraBanner({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!ref.current || ref.current.dataset.loaded) return
    ref.current.dataset.loaded = '1'
    const s1 = document.createElement('script')
    s1.type = 'application/javascript'
    s1.innerHTML = `atOptions = {'key' : '${ADSTERRA_KEY}','format' : 'iframe','height' : 250,'width' : 300,'params' : {}};`
    ref.current.appendChild(s1)
    const s2 = document.createElement('script')
    s2.src = `//www.highperformanceformat.com/${ADSTERRA_KEY}/invoke.js`
    ref.current.appendChild(s2)
  }, [])
  return <div ref={ref} className={className} />
}