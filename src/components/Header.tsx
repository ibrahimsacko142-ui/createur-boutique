'use client'

import { useState, useEffect, useCallback } from 'react'
import { Menu, X, Sparkles, Sun, Moon, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { label: 'Accueil', href: '#accueil' },
  { label: 'Services', href: '#services' },
  { label: 'Résultats', href: '#ce-que-vous-obtenez' },
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'Inscription', href: '#inscription' },
  { label: 'À propos', href: '#apropos' },
  { label: 'Témoignages', href: '#temoignages' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Guides', href: '#blog' },
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
  const [mobileOpen, setMobileOpen] = useState(false)
  const { dark, toggle } = useTheme()
  const [scrollProgress, setScrollProgress] = useState(0)
  const [activeSection, setActiveSection] = useState('')

  // ═══ Scroll Progress ═══
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
      setScrollProgress(Math.min(progress, 100))
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // ═══ Intersection Observer for Scroll Spy ═══
  useEffect(() => {
    const sectionIds = navLinks.map(l => l.href.replace('#', '')).filter(Boolean)
    const observers: IntersectionObserver[] = []

    sectionIds.forEach(id => {
      const el = document.getElementById(id)
      if (!el) return
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              setActiveSection(id)
            }
          })
        },
        { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
      )
      observer.observe(el)
      observers.push(observer)
    })

    return () => observers.forEach(o => o.disconnect())
  }, [])

  // Close mobile menu on scroll spy change
  const handleNavClick = useCallback((href: string) => {
    setMobileOpen(false)
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 shadow-sm">
      {/* ═══ Progress Bar ═══ */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-transparent z-[1]">
        <motion.div
          className="h-full bg-gradient-to-r from-amber-400 via-orange-500 to-red-500"
          style={{ width: `${scrollProgress}%` }}
          transition={{ duration: 0.1, ease: 'linear' }}
        />
      </div>

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
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.replace('#', '')
            return (
              <a
                key={link.href}
                href={link.href}
                className={`relative px-2.5 py-2 text-xs font-medium transition-colors rounded-lg hover:bg-accent ${
                  isActive ? 'text-amber-600' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {link.label}
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-5 bg-amber-500 rounded-full"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </a>
            )
          })}
        </nav>

        {/* Actions + Mobile menu */}
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

          {/* CTA Button Desktop + Disponibilité Badge */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Disponibilité Live Badge */}
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              En ligne
            </div>
            <a href="https://wa.me/22397787244?text=Bonjour%20Sacko%20!%20Je%20souhaite%20discuter%20de%20mon%20projet." target="_blank" rel="noopener noreferrer">
              <Button size="sm" className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold shadow-md shadow-emerald-500/20 h-9 px-4 text-xs">
                <MessageCircle className="h-3.5 w-3.5 mr-1.5" /> Obtenir un service
              </Button>
            </a>
          </div>

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
                {navLinks.map((link) => {
                  const isActive = activeSection === link.href.replace('#', '')
                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => handleNavClick(link.href)}
                      className={`px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                        isActive
                          ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600'
                          : 'hover:bg-accent'
                      }`}
                    >
                      {link.label}
                    </a>
                  )
                })}
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
                  <Button className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold text-sm">
                    <MessageCircle className="h-4 w-4 mr-2" /> Obtenir un service
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