'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { ShoppingCart, Menu, X, Sparkles, Sun, Moon, Trash2, MessageCircle, Package, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from '@/components/ui/sheet'
import { useCartStore } from '@/store/cart'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { label: 'Accueil', href: '#accueil' },
  { label: 'Services', href: '#services' },
  { label: 'Résultats', href: '#ce-que-vous-obtenez' },
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'À propos', href: '#apropos' },
  { label: 'Témoignages', href: '#temoignages' },
  { label: 'Guides', href: '#blog' },
  { label: 'Commander', href: '#commande-rapide' },
  { label: 'Contact', href: '#contact' },
]

function formatPrice(p: number) {
  if (p === 0) return 'Gratuit'
  return p.toLocaleString('fr-FR') + ' FCFA'
}

function useTheme() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('theme')
    if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setDark(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggle = () => {
    setDark(prev => {
      const next = !prev
      if (next) {
        document.documentElement.classList.add('dark')
        localStorage.setItem('theme', 'dark')
      } else {
        document.documentElement.classList.remove('dark')
        localStorage.setItem('theme', 'light')
      }
      return next
    })
  }

  return { dark, toggle }
}

export default function Header() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, clearCart, total, itemCount } = useCartStore()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { dark, toggle } = useTheme()
  const allFree = items.length > 0 && items.every(i => i.price === 0)

  const handleCheckoutWhatsApp = () => {
    if (items.length === 0) return
    let msg = 'Bonjour Sacko ! Je souhaite commander :\n\n'
    items.forEach((item, idx) => {
      msg += `${idx + 1}. ${item.name} — ${formatPrice(item.price)} (x${item.quantity})\n`
    })
    const totalAmount = total()
    msg += `\nTotal : ${formatPrice(totalAmount)}`
    if (allFree) {
      msg += '\n\n(Tous les services sont gratuits)'
    }
    msg += '\n\nMerci !'
    window.open(`https://wa.me/22397787244?text=${encodeURIComponent(msg)}`, '_blank')
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <a href="#accueil" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 text-white font-bold text-lg shadow-lg shadow-amber-500/25 group-hover:shadow-amber-500/40 transition-shadow">
            S
          </div>
          <span className="text-xl font-bold tracking-tight">
            SK <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">Designer Luxe</span>
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden xl:flex items-center gap-0.5">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-2.5 py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-accent"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Cart + Dark mode + Mobile menu */}
        <div className="flex items-center gap-1.5">
          {/* Dark mode toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggle}
            className="hover:bg-accent"
            aria-label="Changer le thème"
          >
            <AnimatePresence mode="wait">
              {dark ? (
                <motion.div
                  key="sun"
                  initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Sun className="h-5 w-5 text-amber-500" />
                </motion.div>
              ) : (
                <motion.div
                  key="moon"
                  initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Moon className="h-5 w-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>

          {/* CTA Button Desktop */}
          <a href="https://wa.me/22397787244?text=Bonjour%20Sacko%20!%20Je%20souhaite%20discuter%20de%20mon%20projet." target="_blank" rel="noopener noreferrer" className="hidden sm:block">
            <Button size="sm" className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold shadow-md shadow-amber-500/20 h-9 px-4 text-xs">
              <Sparkles className="h-3.5 w-3.5 mr-1.5" /> Lancer mon projet
            </Button>
          </a>

          {/* Cart Sheet */}
          <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="relative hover:bg-accent">
                <ShoppingCart className="h-5 w-5" />
                {itemCount() > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-[10px] font-bold text-white shadow-sm"
                  >
                    {itemCount()}
                  </motion.span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md flex flex-col">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-amber-500" />
                  Mon Panier
                  {items.length > 0 && (
                    <span className="text-sm font-normal text-muted-foreground">({itemCount()} {itemCount() > 1 ? 'services' : 'service'})</span>
                  )}
                </SheetTitle>
              </SheetHeader>

              <div className="flex-1 overflow-y-auto py-4">
                <AnimatePresence mode="popLayout">
                  {items.length === 0 ? (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center h-full text-muted-foreground gap-3"
                    >
                      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                        <ShoppingCart className="h-10 w-10 opacity-30" />
                      </div>
                      <p className="text-sm font-medium">Votre panier est vide</p>
                      <p className="text-xs text-muted-foreground/60 text-center max-w-[200px]">
                        Parcourez mes services et ajoutez ceux qui vous intéressent
                      </p>
                      <a href="#services" onClick={closeCart}>
                        <Button variant="outline" size="sm" className="mt-2 text-xs">
                          Voir les services
                        </Button>
                      </a>
                    </motion.div>
                  ) : (
                    <div className="space-y-3">
                      {/* Free badge */}
                      {allFree && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800"
                        >
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                          <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                            Tous les services sélectionnés sont gratuits
                          </span>
                        </motion.div>
                      )}

                      {items.map((item) => (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
                          transition={{ duration: 0.2 }}
                          className="flex gap-3 rounded-xl border p-3 hover:shadow-sm transition-all duration-200 group"
                        >
                          <div className="h-16 w-16 flex-shrink-0 rounded-lg bg-muted overflow-hidden">
                            {item.image ? (
                              <img src={item.image} alt={item.name} className="h-full w-full object-cover" loading="lazy" />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center">
                                <Package className="h-6 w-6 text-muted-foreground/30" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{item.name}</p>
                            <p className={`text-sm font-bold mt-1 ${item.price === 0 ? 'text-emerald-600' : 'text-amber-600'}`}>
                              {formatPrice(item.price)}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <div className="flex items-center border rounded-lg overflow-hidden">
                                <button
                                  className="h-7 w-7 flex items-center justify-center text-xs hover:bg-muted transition-colors active:scale-95"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                >
                                  -
                                </button>
                                <span className="h-7 w-8 flex items-center justify-center text-xs font-semibold border-x bg-muted/50">
                                  {item.quantity}
                                </span>
                                <button
                                  className="h-7 w-7 flex items-center justify-center text-xs hover:bg-muted transition-colors active:scale-95"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                >
                                  +
                                </button>
                              </div>
                              <button
                                className="ml-auto h-7 w-7 flex items-center justify-center rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                                onClick={() => removeItem(item.id)}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </AnimatePresence>
              </div>

              {items.length > 0 && (
                <SheetFooter className="border-t pt-4 space-y-3 flex-col">
                  {/* Summary */}
                  <div className="w-full space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{itemCount()} {itemCount() > 1 ? 'services' : 'service'}</span>
                      <span className={allFree ? 'text-emerald-600 font-bold' : 'font-medium'}>
                        {allFree ? 'Gratuit' : formatPrice(total())}
                      </span>
                    </div>
                    {!allFree && (
                      <div className="flex items-center justify-between text-lg font-bold pt-1 border-t">
                        <span>Total</span>
                        <span className="text-amber-600">{formatPrice(total())}</span>
                      </div>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="w-full space-y-2">
                    <Button
                      className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold shadow-md shadow-emerald-500/20 active:scale-[0.98] transition-transform"
                      onClick={handleCheckoutWhatsApp}
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      {allFree ? 'Commander via WhatsApp (Gratuit)' : 'Commander via WhatsApp'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-muted-foreground hover:text-red-600 hover:border-red-300 hover:bg-red-50 dark:hover:bg-red-950/20"
                      onClick={() => { clearCart() }}
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-1.5" /> Vider le panier
                    </Button>
                  </div>
                </SheetFooter>
              )}
            </SheetContent>
          </Sheet>

          {/* Mobile Menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="xl:hidden">
              <Button variant="ghost" size="icon" className="hover:bg-accent">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 text-white font-bold text-xs">S</div>
                  Menu
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 mt-4">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="px-3 py-2.5 text-sm font-medium rounded-lg hover:bg-accent transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
              <div className="mt-6 px-3 space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start text-sm"
                  onClick={() => { toggle(); setMobileOpen(false) }}
                >
                  {dark ? <Sun className="h-4 w-4 mr-2 text-amber-500" /> : <Moon className="h-4 w-4 mr-2" />}
                  {dark ? 'Mode clair' : 'Mode sombre'}
                </Button>
                <a href="https://wa.me/22397787244?text=Bonjour%20Sacko%20!%20Je%20souhaite%20discuter%20de%20mon%20projet." target="_blank" rel="noopener noreferrer" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold text-sm">
                    <Sparkles className="h-4 w-4 mr-2" /> Lancer mon projet
                  </Button>
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}