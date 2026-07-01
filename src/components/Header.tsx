'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ShoppingCart, Menu, X } from 'lucide-react'
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
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#contact' },
]

export default function Header() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, total, itemCount } = useCartStore()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <a href="#accueil" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500 text-white font-bold text-lg">
            C
          </div>
          <span className="text-xl font-bold tracking-tight">
            Créateur <span className="text-amber-500">Boutique</span>
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Cart + Mobile menu */}
        <div className="flex items-center gap-2">
          {/* Cart Sheet */}
          <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {itemCount() > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white"
                  >
                    {itemCount()}
                  </motion.span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md flex flex-col">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Mon Panier ({itemCount()})
                </SheetTitle>
              </SheetHeader>

              <div className="flex-1 overflow-y-auto py-4">
                <AnimatePresence>
                  {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-3">
                      <ShoppingCart className="h-12 w-12 opacity-30" />
                      <p className="text-sm">Votre panier est vide</p>
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
                          className="flex gap-3 rounded-lg border p-3"
                        >
                          <div className="h-16 w-16 flex-shrink-0 rounded-md bg-muted overflow-hidden">
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
                              {item.price.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
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
                      {total().toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                    </span>
                  </div>
                  <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold">
                    Commander
                  </Button>
                </div>
              )}
            </SheetContent>
          </Sheet>

          {/* Mobile Menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 mt-4">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="px-3 py-2.5 text-sm font-medium rounded-md hover:bg-accent transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}