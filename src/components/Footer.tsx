import { Instagram, Facebook, Mail, MapPin, Phone, MessageCircle, Sparkles, Heart } from 'lucide-react'
// TikTok SVG icon component
function TikTokIcon({ className = 'h-[1.125rem] w-[1.125rem]' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.87a8.16 8.16 0 0 0 4.77 1.52V6.94a4.85 4.85 0 0 1-1.01-.25z" />
    </svg>
  )
}

export default function Footer() {
  return (
    <footer className="border-t bg-gradient-to-b from-muted/30 to-muted/50 mt-auto">
      {/* CTA bar before footer */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIxLjUiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wOCkiLz48L3N2Zz4=')] opacity-50" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <p className="text-white font-bold text-lg flex items-center gap-2 justify-center sm:justify-start">
              <Sparkles className="h-5 w-5" /> Besoin d&apos;un service ?
            </p>
            <p className="text-white/80 text-sm">Réponse rapide sur WhatsApp — Disponible 7j/7</p>
          </div>
          <a href="https://wa.me/22397787244?text=Bonjour%20!%20Je%20souhaite%20avoir%20des%20informations." target="_blank" rel="noopener noreferrer" className="bg-white text-emerald-600 hover:bg-white/90 font-bold text-sm px-6 py-2.5 rounded-full shadow-lg flex items-center gap-2 transition-all hover:scale-105">
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 text-white font-bold text-lg shadow-lg shadow-amber-500/20">
                S
              </div>
              <span className="text-lg font-bold">
                Studio <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">Créatif</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Votre studio créatif de confiance à Bamako. Design, sites web, montage vidéo, formations. Simple, rapide, honnête.
            </p>
            <div className="flex gap-2.5 pt-1">
              <a href="https://www.instagram.com/sk_designer_luxe" target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted hover:bg-amber-100 dark:hover:bg-amber-900/30 hover:text-amber-500 transition-all group" aria-label="Instagram">
                <Instagram className="h-[1.125rem] w-[1.125rem]" />
              </a>
              <a href="https://www.facebook.com/skdesignerluxe" target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted hover:bg-amber-100 dark:hover:bg-amber-900/30 hover:text-amber-500 transition-all group" aria-label="Facebook">
                <Facebook className="h-[1.125rem] w-[1.125rem]" />
              </a>
              <a href="https://www.tiktok.com/@sk_designer_luxe" target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted hover:bg-amber-100 dark:hover:bg-amber-900/30 hover:text-amber-500 transition-all group" aria-label="TikTok">
                <TikTokIcon />
              </a>
              <a href="https://wa.me/22397787244" target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted hover:bg-emerald-100 dark:hover:bg-emerald-900/30 hover:text-emerald-500 transition-all group" aria-label="WhatsApp">
                <MessageCircle className="h-[1.125rem] w-[1.125rem]" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Navigation</h3>
            <ul className="space-y-2.5">
              {[
                { label: 'Accueil', href: '#accueil' },
                { label: 'Services', href: '#services' },
                { label: 'Formations', href: '#formations' },
                { label: 'Boutique', href: '#boutique' },
                { label: 'Coachs', href: '#coachs' },
                { label: 'Blog', href: '#blog' },
                { label: 'FAQ', href: '#faq' },
                { label: 'Contact', href: '#contact' },
              ].map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="text-sm text-muted-foreground hover:text-amber-600 transition-colors">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Mes Services</h3>
            <ul className="space-y-2.5">
              {['Design Graphique', 'Création de Logo', 'Site Web', 'Montage Vidéo', 'Marketing Digital', 'Formation Design'].map((item) => (
                <li key={item}>
                  <a href="#services" className="text-sm text-muted-foreground hover:text-amber-600 transition-colors">
                    {item}
                  </a>
                </li>
              ))}
              <li key="canva-pro">
                <a href="https://www.canva.com/brand/join?token=nbyqrtelBOlUiCNiK170Ew&referrer=team-invite" target="_blank" rel="noopener noreferrer" className="text-sm text-cyan-600 dark:text-cyan-400 font-medium hover:text-cyan-500 transition-colors">
                  Canva Pro (gratuit)
                </a>
              </li>
              <li key="capcut-pro">
                <a href="#services" className="text-sm text-muted-foreground hover:text-amber-600 transition-colors">
                  CapCut Pro
                </a>
              </li>
              <li key="picsart-pro">
                <a href="#services" className="text-sm text-muted-foreground hover:text-amber-600 transition-colors">
                  PicsArt Pro
                </a>
              </li>
              <li key="groupe-wa">
                <a href="https://chat.whatsapp.com/Khpz5MVeokK9X9X5i3INX2" target="_blank" rel="noopener noreferrer" className="text-sm text-emerald-600 font-medium hover:text-emerald-500 transition-colors">
                  Groupe Formation WhatsApp
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-amber-500" />
                <span>Bamako, Mali</span>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 flex-shrink-0 text-amber-500" />
                <span>+223 97 78 72 44</span>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 flex-shrink-0 text-amber-500" />
                <span>contact@createurboutique.com</span>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <MessageCircle className="h-4 w-4 flex-shrink-0 text-emerald-500" />
                <a href="https://wa.me/22397787244" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-500 transition-colors">
                  WhatsApp Direct
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Paiement & Contact */}
        <div className="mt-8 pt-6 border-t">
          <h3 className="text-xs font-semibold uppercase tracking-wider mb-3 text-center">Commandez & Payez facilement</h3>
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 border border-transparent px-4 py-1.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
              <MessageCircle className="h-3 w-3" />
              WhatsApp
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-orange-100 dark:bg-orange-900/30 border border-transparent px-3 py-1.5 text-[10px] font-bold text-orange-700 dark:text-orange-400">
              <span className="h-2 w-2 rounded-full bg-orange-500" />
              Orange Money
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 border border-transparent px-3 py-1.5 text-[10px] font-bold text-yellow-700 dark:text-yellow-400">
              <span className="h-2 w-2 rounded-full bg-yellow-500" />
              Moov Money
            </span>
          </div>
          <p className="text-[10px] text-muted-foreground text-center mt-2">Commande via WhatsApp — Paiement mobile money — Confirmation instantanée</p>
        </div>

        <div className="mt-8 border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            &copy; {new Date().getFullYear()} Studio Créatif. Tous droits réservés. Fait avec <Heart className="h-3 w-3 text-red-500 fill-red-500" /> à Bamako, Mali.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <a href="https://wa.me/22397787244?text=Bonjour%20!%20Je%20souhaite%20consulter%20vos%20mentions%20l%C3%A9gales." target="_blank" rel="noopener noreferrer" className="hover:text-amber-600 transition-colors">Mentions légales</a>
            <span className="text-border">|</span>
            <a href="#faq" className="hover:text-amber-600 transition-colors">FAQ</a>
            <span className="text-border">|</span>
            <a href="#contact" className="hover:text-amber-600 transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  )
}