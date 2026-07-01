import { NextResponse } from 'next/server'

const products = [
  { id: '1', name: 'Design Affiche Publicitaire', description: 'Affiche publicitaire moderne et professionnelle pour promouvoir votre activité, produit ou événement. Design unique et percutant.', price: 5000, image: null, category: 'service', featured: true, stock: 99, createdAt: new Date().toISOString() },
  { id: '2', name: 'Création de Logo', description: 'Logo professionnel et unique pour votre marque. Fichiers sources inclus (PNG, SVG, PDF).', price: 10000, image: null, category: 'service', featured: true, stock: 99, createdAt: new Date().toISOString() },
  { id: '3', name: 'Site Web Vitrine', description: 'Site web professionnel, moderne et responsive. Parfait pour présenter votre activité en ligne.', price: 50000, image: null, category: 'service', featured: true, stock: 99, createdAt: new Date().toISOString() },
  { id: '4', name: 'Montage Vidéo Pro', description: 'Montage vidéo professionnel avec effets, transitions et musique. Idéal pour vos réseaux sociaux.', price: 5000, image: null, category: 'service', featured: false, stock: 99, createdAt: new Date().toISOString() },
  { id: '5', name: 'Identité Visuelle Complète', description: 'Pack complet : logo, couleurs, typographie, cartes de visite. Tout pour une image de marque cohérente.', price: 25000, image: null, category: 'service', featured: true, stock: 99, createdAt: new Date().toISOString() },
  { id: '6', name: 'CapCut Pro', description: 'Abonnement CapCut Pro complet avec toutes les fonctionnalités premium débloquées.', price: 5000, image: null, category: 'outil', featured: true, stock: 50, createdAt: new Date().toISOString() },
  { id: '7', name: 'PicsArt Pro', description: 'Accès PicsArt Pro avec tous les outils de montage photo avancés et les effets premium.', price: 5000, image: null, category: 'outil', featured: true, stock: 50, createdAt: new Date().toISOString() },
  { id: '8', name: 'Canva Pro', description: 'Abonnement Canva Pro pour des créations graphiques illimitées avec modèles premium.', price: 5000, image: null, category: 'outil', featured: false, stock: 50, createdAt: new Date().toISOString() },
  { id: '9', name: 'IPTV Pro', description: 'Accès IPTV Pro avec des milliers de chaînes et contenus premium en streaming.', price: 10000, image: null, category: 'outil', featured: true, stock: 30, createdAt: new Date().toISOString() },
]

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')

    let filtered = [...products]
    if (category && category !== 'all') {
      filtered = filtered.filter(p => p.category === category)
    }
    if (featured === 'true') {
      filtered = filtered.filter(p => p.featured)
    }

    return NextResponse.json(filtered)
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  return NextResponse.json({ message: 'Fonction non disponible en production' }, { status: 200 })
}