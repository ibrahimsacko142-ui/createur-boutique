'use client'

import { useEffect, useRef } from 'react'

/*
  Adsterra Banner — approche originale qui marchait.
  Chaque instance est décalée pour éviter les conflits atOptions.
*/

const ADSTERRA_KEY = 'f0bd986ebfb3589b5e800ceeaa28a9d5'
let counter = 0

export default function AdsterraBanner({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const delay = useRef((counter++) * 1500) // décalage de 1.5s entre chaque instance

  useEffect(() => {
    if (!ref.current) return

    const timer = setTimeout(() => {
      const s1 = document.createElement('script')
      s1.type = 'application/javascript'
      s1.innerHTML = `atOptions = {'key' : '${ADSTERRA_KEY}','format' : 'iframe','height' : 250,'width' : 300,'params' : {}};`
      ref.current!.appendChild(s1)

      const s2 = document.createElement('script')
      s2.src = `//www.highperformanceformat.com/${ADSTERRA_KEY}/invoke.js`
      ref.current!.appendChild(s2)
    }, delay.current)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      ref={ref}
      className={`min-h-[250px] w-full ${className}`}
    />
  )
}