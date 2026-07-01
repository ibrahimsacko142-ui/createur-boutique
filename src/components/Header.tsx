'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { ShoppingCart, Menu, X, Sparkles, Sun, Moon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { useCartStore } from '@/store/cart'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { label: 'Accueil', href: '#accueil' },
  { label: 'Services', href: '#services' },
  { label: 'Formations', href: '#formations' },
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'Dépôt/Retrait', href: '#wallet' },
  { label: 'Blog', href: '#blog' },
  { label: 'Témoignages', href: '#temoignages' },
  { label: 'Parrainage', href: '#parrainage' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#contact' },
]

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
  const { items, isOpen, closeCart, removeItem, updateQuantity, total, itemCount } = useCartStore()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { dark, toggle } = useTheme()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <a href="#accueil" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 text-white font-bold text-lg shadow-lg shadow-amber-500/25 group-hover:shadow-amber-500/40 transition-shadow">
            C
          </div>
          <span className="text-xl font-bold tracking-tight">
            Créateur <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">Boutique</span>
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
          <a href="https://wa.me/22397787244?text=Bonjour%20!%20Je%20souhaite%20commander%20un%20service%20chez%20Cr%C3%A9ateur%20Boutique." target="_blank" rel="noopener noreferrer" className="hidden sm:block">
            <Button size="sm" className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold shadow-md shadow-amber-500/20 h-9 px-4 text-xs">
              <Sparkles className="h-3.5 w-3.5 mr-1.5" /> Commander
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
                  <ShoppingCart className="h-5 w-5 text-amber-500" />
                  Mon Panier ({itemCount()})
                </SheetTitle>
              </SheetHeader>

              <div className="flex-1 overflow-y-auto py-4">
                <AnimatePresence>
                  {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-3">
                      <ShoppingCart className="h-12 w-12 opacity-30" />
                      <p className="text-sm">Votre panier est vide</p>
                      <p className="text-xs text-muted-foreground/60">Ajoutez des services pour commencer</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {items.map((item) => (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className="flex gap-3 rounded-xl border p-3 hover:shadow-sm transition-shadow"
                        >
                          <div className="h-16 w-16 flex-shrink-0 rounded-lg bg-muted overflow-hidden">
                            {item.image ? (
                              <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                                IMG
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{item.name}</p>
                            <p className="text-sm font-bold text-amber-600 mt-1">
                              {item.price.toLocaleString('fr-FR')} FCFA
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              >
                                -
                              </Button>
                              <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                +
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 ml-auto text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={() => removeItem(item.id)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </AnimatePresence>
              </div>

              {items.length > 0 && (
                <div className="border-t pt-4 space-y-3">
                  <div className="flex items-center justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-amber-600">
                      {total().toLocaleString('fr-FR')} FCFA
                    </span>
                  </div>
                  <a href="https://wa.me/22397787244?text=Bonjour%20!%20Je%20souhaite%20commander%20un%20service." target="_blank" rel="noopener noreferrer">
                    <Button className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold shadow-md shadow-emerald-500/20">
                      Commander via WhatsApp
                    </Button>
                  </a>
                </div>
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
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 text-white font-bold text-xs">C</div>
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
                {/* Dark mode toggle in mobile */}
                <Button
                  variant="outline"
                  className="w-full justify-start text-sm"
                  onClick={() => { toggle(); setMobileOpen(false) }}
                >
                  {dark ? <Sun className="h-4 w-4 mr-2 text-amber-500" /> : <Moon className="h-4 w-4 mr-2" />}
                  {dark ? 'Mode clair' : 'Mode sombre'}
                </Button>
                <a href="https://wa.me/22397787244" target="_blank" rel="noopener noreferrer" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold text-sm">
                    <Sparkles className="h-4 w-4 mr-2" /> Commander maintenant
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