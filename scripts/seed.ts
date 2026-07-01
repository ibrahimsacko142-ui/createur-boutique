import { db } from './src/lib/db'

async function seed() {
  const products = [
    {
      name: 'Sac Créateur Premium',
      description: 'Sac artisanal en cuir véritable, conçu à la main avec des finitions soignées. Chaque pièce est unique et porte la signature de son créateur.',
      price: 45000,
      image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop',
      category: 'produit',
      featured: true,
      stock: 8,
    },
    {
      name: "Collier Éclat d'Or",
      description: "Bijou artisanal en laiton doré, inspiré des motifs africains contemporains. Un accessoire qui allie tradition et modernité.",
      price: 15000,
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop',
      category: 'produit',
      featured: true,
      stock: 15,
    },
    {
      name: 'Lampe Design Teranga',
      description: 'Lampe décorative en bois sculpté et tissu wax. Apporte une ambiance chaleureuse et authentique à votre intérieur.',
      price: 28000,
      image: 'https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=400&h=400&fit=crop',
      category: 'produit',
      featured: true,
      stock: 5,
    },
    {
      name: 'T-shirt Créatif Original',
      description: "T-shirt 100% coton avec impression exclusive Créateur Boutique. Confortable et stylé, parfait pour toutes les occasions.",
      price: 8000,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
      category: 'produit',
      featured: true,
      stock: 25,
    },
    {
      name: 'Ensemble Parure Wax',
      description: "Ensemble complet en tissu wax de haute qualité. Un mélange parfait de couleurs vives et de coupes modernes.",
      price: 35000,
      image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&h=400&fit=crop',
      category: 'produit',
      featured: false,
      stock: 12,
    },
    {
      name: 'Tableau Art Moderne',
      description: "Peinture acrylique sur toile, représentant des scènes de la vie quotidienne africaine avec un style contemporain vibrant.",
      price: 75000,
      image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=400&fit=crop',
      category: 'produit',
      featured: false,
      stock: 3,
    },
    {
      name: 'Collection Capsule Été 2026',
      description: "Projet collaboratif réunissant 5 créateurs locaux autour d'une collection estivale exclusive. Pièces limitées, style urbain et africain.",
      price: 120000,
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=400&fit=crop',
      category: 'projet',
      featured: true,
      stock: 2,
    },
    {
      name: 'Atelier Formation Couture',
      description: "Projet de formation professionnelle en couture pour jeunes talents. Inclut 12 sessions pratiques et un kit de démarrage complet.",
      price: 50000,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=400&fit=crop',
      category: 'projet',
      featured: true,
      stock: 10,
    },
    {
      name: 'Mobilier Recyclé Design',
      description: "Collection de meubles créés à partir de matériaux recyclés. Chaque pièce raconte une histoire unique et contribue au développement durable.",
      price: 95000,
      image: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=400&h=400&fit=crop',
      category: 'projet',
      featured: false,
      stock: 4,
    },
    {
      name: 'Branding & Identité Visuelle',
      description: "Service complet de création d'identité visuelle pour votre marque : logo, charte graphique, supports de communication.",
      price: 200000,
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=400&fit=crop',
      category: 'projet',
      featured: true,
      stock: 999,
    },
  ]

  console.log('Seeding products...')
  for (const product of products) {
    await db.product.create({ data: product })
  }
  console.log(`Seeded ${products.length} products`)
}

seed()
  .catch(console.error)
  .finally(() => process.exit(0))