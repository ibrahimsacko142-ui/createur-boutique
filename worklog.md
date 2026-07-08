---
Task ID: 1
Agent: Main Agent
Task: Remplacer Maketou par CinetPay comme passerelle de paiement

Work Log:
- Analysé l'image fournie par l'utilisateur (pinadvertise.com - portefeuille de liaison)
- Recherché les alternatives de paiement pour le Mali (CinetPay, PayDunya, Orange Money)
- Confirmé que CinetPay supporte le Mali avec Orange Money Mali (2.5% commission)
- Lu la documentation API CinetPay (endpoint v2/payment, v2/payment/check)
- Réécrit `.env.local` : supprimé MAKETOU_API_KEY et MAKETOU_PRODUCT_GENERIC, ajouté CINETPAY_API_KEY et CINETPAY_SITE_ID
- Réécrit `src/app/api/payment/create/route.ts` : API CinetPay (POST /v2/payment avec apikey, site_id, amount, currency=XOF)
- Réécrit `src/app/api/payment/status/route.ts` : Vérification via POST /v2/payment/check
- Réécrit `src/app/api/payment/webhook/route.ts` : Webhook CinetPay avec notification WhatsApp
- Mis à jour `src/app/api/payments/route.ts` : Remplacé les appels Maketou par CinetPay, ajouté méthode PATCH pour webhook
- Mis à jour `src/app/page.tsx` : 17 remplacements Maketou → CinetPay (textes, toasts, FAQ, badges)
- Mis à jour `src/components/Footer.tsx` : Badge Maketou → CinetPay
- Mis à jour `src/app/dashboard/page.tsx` : Labels Maketou → CinetPay
- Vérifié qu'aucune référence à Maketou ne reste dans le code source
- Build Next.js réussi sans erreur (8.7s compilation)

Stage Summary:
- Maketou entièrement supprimé et remplacé par CinetPay
- Build réussi, prêt pour déploiement
- Reste à l'utilisateur : créer un compte CinetPay, obtenir API key + site ID, configurer dans Vercel