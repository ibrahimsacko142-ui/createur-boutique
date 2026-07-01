import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')

    const where: Record<string, unknown> = {}
    if (category && category !== 'all') {
      where.category = category
    }
    if (featured === 'true') {
      where.featured = true
    }

    const products = await db.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(products)
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, description, price, image, category, featured, stock } = body

    const product = await db.product.create({
      data: {
        name,
        description: description || null,
        price: parseFloat(price),
        image: image || null,
        category: category || 'produit',
        featured: featured || false,
        stock: stock || 10,
      },
    })

    return NextResponse.json(product, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Erreur lors de la création' }, { status: 500 })
  }
}