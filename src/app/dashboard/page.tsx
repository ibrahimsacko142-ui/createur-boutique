'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface Payment {
  cartId: string
  orderId: string
  amount: number
  product: string
  customerName: string
  customerPhone: string
  customerEmail: string
  status: string
  createdAt: string
  updatedAt: string
}

interface Stats {
  total: number
  completed: number
  pending: number
  failed: number
  revenue: number
}

const statusColors: Record<string, string> = {
  completed: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
  waiting_payment: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
  abandoned: 'bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400',
  payment_failed: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
}

const statusLabels: Record<string, string> = {
  completed: 'Complété',
  waiting_payment: 'En attente',
  abandoned: 'Abandonné',
  payment_failed: 'Échoué',
}

export default function DashboardPage() {
  const router = useRouter()
  const [pin, setPin] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [payments, setPayments] = useState<Payment[]>([])
  const [stats, setStats] = useState<Stats>({ total: 0, completed: 0, pending: 0, failed: 0, revenue: 0 })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchPayments = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/payments?pin=${pin}`)
      if (res.status === 401) {
        setAuthenticated(false)
        setError('PIN incorrect')
        return
      }
      const data = await res.json()
      if (data.success) {
        setPayments(data.payments || [])
        setStats(data.stats || { total: 0, completed: 0, pending: 0, failed: 0, revenue: 0 })
      } else {
        setError(data.error || 'Erreur de chargement')
      }
    } catch {
      setError('Erreur de connexion au serveur')
    } finally {
      setLoading(false)
    }
  }, [pin])

  const handleLogin = () => {
    if (pin.length >= 4) {
      setAuthenticated(true)
      fetchPayments()
    }
  }

  useEffect(() => {
    if (authenticated) {
      fetchPayments()
      // Auto-refresh toutes les 30 secondes
      const interval = setInterval(fetchPayments, 30000)
      return () => clearInterval(interval)
    }
  }, [authenticated, fetchPayments])

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 w-full max-w-sm">
          <div className="text-center mb-6">
            <div className="h-16 w-16 mx-auto rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-4">
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            </div>
            <h1 className="text-xl font-extrabold">Dashboard Admin</h1>
            <p className="text-sm text-gray-500 mt-1">Entrez votre PIN pour accéder</p>
          </div>
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            placeholder="Code PIN"
            className="w-full h-12 px-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 text-center text-lg font-mono tracking-widest focus:border-emerald-500 focus:outline-none dark:bg-gray-700 mb-4"
            autoFocus
          />
          <button
            onClick={handleLogin}
            disabled={pin.length < 4}
            className="w-full h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold disabled:opacity-40 hover:from-emerald-600 hover:to-teal-600 transition-colors"
          >
            Accéder
          </button>
          {error && <p className="text-red-500 text-xs text-center mt-3">{error}</p>}
          <button
            onClick={() => router.push('/')}
            className="w-full mt-3 text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            Retour au site
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            </div>
            <div>
              <h1 className="font-extrabold text-lg">Dashboard Paiements</h1>
              <p className="text-xs text-gray-500">Maketou — Studio Créatif</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchPayments}
              disabled={loading}
              className="h-9 px-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-sm font-semibold hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <svg className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              Actualiser
            </button>
            <button
              onClick={() => router.push('/')}
              className="h-9 px-4 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              Retour au site
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total', value: stats.total, color: 'bg-blue-500', light: 'bg-blue-50 dark:bg-blue-900/20' },
            { label: 'Complétés', value: stats.completed, color: 'bg-emerald-500', light: 'bg-emerald-50 dark:bg-emerald-900/20' },
            { label: 'En attente', value: stats.pending, color: 'bg-amber-500', light: 'bg-amber-50 dark:bg-amber-900/20' },
            { label: 'Revenus (FCFA)', value: stats.revenue.toLocaleString('fr-FR'), color: 'bg-purple-500', light: 'bg-purple-50 dark:bg-purple-900/20' },
          ].map((s) => (
            <div key={s.label} className={`${s.light} rounded-xl p-4 border border-gray-100 dark:border-gray-800`}>
              <p className="text-xs text-gray-500 font-medium">{s.label}</p>
              <p className="text-2xl font-extrabold mt-1">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Payments table */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <h2 className="font-bold text-base">Historique des paiements</h2>
            <span className="text-xs text-gray-400">{payments.length} paiement(s)</span>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="h-8 w-8 mx-auto rounded-full border-3 border-gray-200 border-t-emerald-500 animate-spin mb-3" />
              <p className="text-sm text-gray-500">Chargement des paiements...</p>
            </div>
          ) : payments.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-400 text-sm">Aucun paiement enregistré pour le moment.</p>
              <p className="text-gray-300 text-xs mt-1">Les paiements apparaîtront ici automatiquement.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800/50 text-left">
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Client</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Produit</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase text-right">Montant</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase text-center">Statut</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Réf</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {payments.map((p) => (
                    <tr key={p.cartId} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                      <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                        {new Date(p.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Bamako' })}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-xs">{p.customerName}</p>
                        <p className="text-[11px] text-gray-400">{p.customerPhone || p.customerEmail}</p>
                      </td>
                      <td className="px-4 py-3 text-xs max-w-[200px] truncate">{p.product}</td>
                      <td className="px-4 py-3 text-xs font-bold text-right whitespace-nowrap">{p.amount > 0 ? `${p.amount.toLocaleString('fr-FR')} F` : '—'}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold ${statusColors[p.status] || 'bg-gray-100 text-gray-500'}`}>
                          {statusLabels[p.status] || p.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[11px] font-mono text-gray-400 whitespace-nowrap">{p.orderId?.substring(0, 16)}...</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-gray-300 pb-4">
          Dashboard Studio Créatif — Paiements Maketou — Actualisation automatique toutes les 30s
        </p>
      </div>
    </div>
  )
}