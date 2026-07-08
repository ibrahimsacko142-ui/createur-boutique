import { NextResponse } from 'next/server'

// Products hardcoded — no database needed
const products = [
  { id: '1', name: 'Affiche Professionnelle', description: 'Affiche publicitaire haute qualité pour événements, promotions et communication visuelle. Format personnalisable, design moderne et percutant.', price: 2000, image: null, category: 'service', featured: true, stock: 99 },
  { id: '2', name: 'Logo Professionnel', description: 'Création de logo unique et mémorable pour votre marque, entreprise ou projet. Fichiers sources inclus (PNG, SVG, PDF).', price: 5000, image: null, category: 'service', featured: true, stock: 99 },
  { id: '3', name: 'Site Web Complet', description: 'Site web moderne et responsive, optimisé pour tous les appareils. Design sur mesure avec hébergement et nom de domaine.', price: 25000, image: null, category: 'service', featured: true, stock: 99 },
  { id: '4', name: 'Montage Vidéo', description: 'Montage vidéo professionnel pour vos contenus sociaux, publicités, clips musicaux et présentations.', price: 3000, image: null, category: 'service', featured: false, stock: 99 },
  { id: '5', name: 'Flyer Publicitaire', description: 'Flyer attrayant et professionnel pour vos événements, promotions et communications.', price: 1500, image: null, category: 'service', featured: false, stock: 99 },
  { id: '6', name: 'Carte de Visite', description: 'Carte de visite professionnelle et élégante. Design recto-verso avec fichiers imprimables.', price: 1000, image: null, category: 'service', featured: false, stock: 99 },
  { id: '7', name: 'CapCut Pro', description: 'Accès premium CapCut Pro avec toutes les fonctionnalités débloquées. Effets, filtres, transitions premium inclus.', price: 2500, image: null, category: 'outil', featured: true, stock: 50 },
  { id: '8', name: 'PicsArt Pro', description: 'Accès premium PicsArt Pro. Édition photo avancée, outils IA, stickers et templates exclusifs.', price: 2500, image: null, category: 'outil', featured: true, stock: 50 },
  { id: '9', name: 'IPTV Pro', description: 'Abonnement IPTV Pro avec plus de 10 000 chaînes. Films, séries, sports en direct et divertissement.', price: 3000, image: null, category: 'outil', featured: true, stock: 50 },
  { id: '10', name: 'Canva Pro', description: 'Accès Canva Pro. Templates premium, outils de design avancés, planification de contenu et brand kit.', price: 2000, image: null, category: 'outil', featured: false, stock: 50 },
  { id: '11', name: 'Formation Design Graphique', description: 'Formation complète en design graphique. Apprenez à créer des visuels professionnels avec les outils modernes.', price: 10000, image: null, category: 'formation', featured: true, stock: 30 },
  { id: '12', name: 'Formation Montage Vidéo', description: 'Apprenez le montage vidéo professionnel. De la prise de vue au rendu final avec effets avancés.', price: 10000, image: null, category: 'formation', featured: false, stock: 30 },
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const featured = searchParams.get('featured')

  let filtered = [...products]
  if (category && category !== 'all') {
    filtered = filtered.filter((p) => p.category === category)
  }
  if (featured === 'true') {
    filtered = filtered.filter((p) => p.featured)
  }

  return NextResponse.json(filtered)
}