import type { Metadata } from 'next'
import PtcClient from './PtcClient'

export const metadata: Metadata = {
  title: 'Gagnez de l\'argent en regardant des pubs — Studio Créatif | Mali',
  description: 'Gagnez de l\'argent depuis votre téléphone en regardant des publicités. 1 FCFA par pub, retrait via Orange Money ou Wave. Inscrivez-vous gratuitement.',
  openGraph: {
    title: 'Gagnez de l\'argent avec Studio Créatif',
    description: 'Regardez des pubs, gagnez 1 FCFA par vue. Retrait Orange Money / Wave.',
    url: 'https://studio-creatif.org/gagner',
  },
}

export default function PtcPage() {
  return <PtcClient />
}