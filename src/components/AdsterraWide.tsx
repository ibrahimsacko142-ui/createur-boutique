'use client'

/*
  Adsterra Banner 728x90 — format large
  Chaque pub est dans son propre iframe (srcdoc).
*/

const ADSTERRA_KEY = 'f0bd986ebfb3589b5e800ceeaa28a9d5'

const AD_HTML = `
<html>
<head>
<meta charset="utf-8">
<style>*{margin:0;padding:0;box-sizing:border-box}body{background:#f8f9fa;display:flex;align-items:center;justify-content:center;height:100vh;overflow:hidden}</style>
</head>
<body>
<script type="application/javascript">
var atOptions = {
  'key' : '${ADSTERRA_KEY}',
  'format' : 'iframe',
  'height' : 90,
  'width' : 728,
  'params' : {}
};
</script>
<script type="text/javascript" src="https://www.highperformanceformat.com/${ADSTERRA_KEY}/invoke.js"></script>
</body>
</html>
`

export default function AdsterraWide({ className = '' }: { className?: string }) {
  return (
    <div className={`w-full flex justify-center ${className}`}>
      <iframe
        srcDoc={AD_HTML}
        width="728"
        height="90"
        style={{ border: 'none', maxWidth: '100%' }}
        loading="lazy"
        title="Publicité"
      />
    </div>
  )
}