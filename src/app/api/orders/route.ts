import { NextRequest, NextResponse } from 'next/server'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'

const DATA_DIR = join(process.cwd(), 'data')
const ORDERS_FILE = join(DATA_DIR, 'orders.json')
const ADMIN_PIN = process.env.ADMIN_PIN || 'sacko2024'

interface Order {
  id: string
  service: string
  secteur: string
  name: string
  phone: string
  status: 'en_attente' | 'confirmee' | 'en_cours' | 'livree' | 'annulee'
  amount: string
  paymentMethod: string
  createdAt: string
  updatedAt: string
  notes: string
}

function ensureDataDir() {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true })
}

function readOrders(): Order[] {
  ensureDataDir()
  if (!existsSync(ORDERS_FILE)) return []
  try {
    return JSON.parse(readFileSync(ORDERS_FILE, 'utf-8'))
  } catch {
    return []
  }
}

function writeOrders(orders: Order[]) {
  ensureDataDir()
  writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf-8')
}

const statusLabels: Record<string, string> = {
  en_attente: 'En attente de confirmation',
  confirmee: 'Paiement confirmé',
  en_cours: 'En cours de réalisation',
  livree: 'Livré',
  annulee: 'Annulée',
}

// GET /api/orders?id=XXX — Check by order ID (public)
// GET /api/orders?phone=XXX — Check by phone (public)
// GET /api/orders?pin=XXX — Admin: list all orders
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const orderId = searchParams.get('id')
    const pin = searchParams.get('pin')
    const phone = searchParams.get('phone')

    // Admin view
    if (pin === ADMIN_PIN) {
      const orders = readOrders()
      const stats = {
        total: orders.length,
        en_attente: orders.filter(o => o.status === 'en_attente').length,
        en_cours: orders.filter(o => o.status === 'en_cours').length,
        livree: orders.filter(o => o.status === 'livree').length,
        annulee: orders.filter(o => o.status === 'annulee').length,
      }
      return NextResponse.json({ success: true, stats, orders })
    }

    // Public: check by ID
    if (orderId) {
      const orders = readOrders()
      const order = orders.find(o => o.id === orderId)
      if (!order) {
        return NextResponse.json({ error: 'Commande non trouvée' }, { status: 404 })
      }
      return NextResponse.json({
        success: true,
        order: {
          id: order.id,
          service: order.service,
          status: order.status,
          statusLabel: statusLabels[order.status],
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
        }
      })
    }

    // Public: check by phone
    if (phone) {
      const orders = readOrders()
      const userOrders = orders.filter(o => o.phone === phone)
      return NextResponse.json({
        success: true,
        orders: userOrders.map(o => ({
          id: o.id,
          service: o.service,
          status: o.status,
          statusLabel: statusLabels[o.status],
          createdAt: o.createdAt,
          updatedAt: o.updatedAt,
        }))
      })
    }

    return NextResponse.json({ error: 'Paramètre manquant (id ou phone requis)' }, { status: 400 })
  } catch (error) {
    console.error('[Orders API] Error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// POST /api/orders — Create new order
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { service, secteur, name, phone, amount } = body

    if (!service || !name || !phone) {
      return NextResponse.json({ error: 'Service, nom et téléphone sont requis' }, { status: 400 })
    }

    const orders = readOrders()
    const id = 'SC-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 5).toUpperCase()
    const now = new Date().toISOString()

    const newOrder: Order = {
      id,
      service: service || '',
      secteur: secteur || '',
      name: name || '',
      phone: phone || '',
      status: 'en_attente',
      amount: amount || '',
      paymentMethod: '',
      createdAt: now,
      updatedAt: now,
      notes: '',
    }

    orders.push(newOrder)
    writeOrders(orders)

    return NextResponse.json({ success: true, orderId: id, message: 'Commande enregistrée' })
  } catch (error) {
    console.error('[Orders API] Error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// PATCH /api/orders — Update order status (admin only)
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, status, pin, paymentMethod, notes } = body

    if (pin !== ADMIN_PIN) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    if (!id || !status) {
      return NextResponse.json({ error: 'id et status requis' }, { status: 400 })
    }

    const validStatuses = ['en_attente', 'confirmee', 'en_cours', 'livree', 'annulee']
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Statut invalide' }, { status: 400 })
    }

    const orders = readOrders()
    const order = orders.find(o => o.id === id)
    if (!order) {
      return NextResponse.json({ error: 'Commande non trouvée' }, { status: 404 })
    }

    order.status = status
    order.updatedAt = new Date().toISOString()
    if (paymentMethod) order.paymentMethod = paymentMethod
    if (notes) order.notes = notes

    writeOrders(orders)

    return NextResponse.json({ success: true, message: 'Statut mis à jour' })
  } catch (error) {
    console.error('[Orders API] Error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}