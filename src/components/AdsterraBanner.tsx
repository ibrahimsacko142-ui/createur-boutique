'use client'

import { useEffect, useRef, useId } from 'react'

/*
  Adsterra Banner — multi-instance safe
  Uses direct iframe URL so each banner is independent.
  No global atOptions conflict.
*/

const ADSTERRA_KEY = 'f0bd986ebfb3589b5e800ceeaa28a9d5'
let instanceCount = 0

export default function AdsterraBanner({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const id = useId()
  const instanceId = useRef(++instanceCount)

  useEffect(() => {
    if (!ref.current || ref.current.dataset.loaded) return
    ref.current.dataset.loaded = '1'

    // Use unique atOptions variable name per instance to avoid conflicts
    const varName = `atOptions_${instanceId.current}`
    const script1 = document.createElement('script')
    script1.type = 'application/javascript'
    script1.innerHTML = `${varName} = {'key' : '${ADSTERRA_KEY}','format' : 'iframe','height' : 250,'width' : 300,'params' : {}};`
    ref.current.appendChild(script1)

    const script2 = document.createElement('script')
    script2.type = 'text/javascript'
    script2.innerHTML = `
      (function() {
        var s = document.createElement('script');
        s.src = '//www.highperformanceformat.com/${ADSTERRA_KEY}/invoke.js';
        s.async = true;
        document.body.appendChild(s);
      })();
    `
    ref.current.appendChild(script2)
  }, [id])

  return (
    <div
      ref={ref}
      className={`min-h-[250px] w-full flex items-center justify-center bg-muted/30 rounded-lg overflow-hidden ${className}`}
    />
  )
}