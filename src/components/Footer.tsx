import { Instagram, Facebook, Twitter, Mail, MapPin, Phone, MessageCircle } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t bg-gradient-to-b from-muted/30 to-muted/50 mt-auto">
      {/* CTA bar before footer */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <p className="text-white font-bold text-lg">Besoin d&apos;un service ? Contactez-nous maintenant !</p>
            <p className="text-white/80 text-sm">Réponse rapide sur WhatsApp — Disponible 7j/7</p>
          </div>
          <a href="https://wa.me/22397787244?text=Bonjour%20!%20Je%20souhaite%20avoir%20des%20informations." target="_blank" rel="noopener noreferrer">
            <button className="bg-white text-emerald-600 hover:bg-white/90 font-bold text-sm px-6 py-2.5 rounded-full shadow-lg flex items-center gap-2 transition-colors">
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </button>
          </a>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 text-white font-bold text-base">
                C
              </div>
              <span className="text-lg font-bold">
                Créateur <span className="text-amber-500">Boutique</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Votre partenaire digital de confiance à Bamako. Design graphique, création de sites web, montage vidéo et outils numériques professionnels. Qualité, Créativité, Satisfaction — notre promesse depuis le premier jour.
            </p>
            <div className="flex gap-3 pt-1">
              <a href="#" className="text-muted-foreground hover:text-amber-500 transition-colors" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-amber-500 transition-colors" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-amber-500 transition-colors" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://wa.me/22397787244" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-emerald-500 transition-colors" aria-label="WhatsApp">
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Navigation</h3>
            <ul className="space-y-2.5">
              {['Accueil', 'Services', 'Offres', 'Blog', 'FAQ', 'Valeurs', 'Parrainage', 'Contact'].map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase()}`}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Nos Services</h3>
            <ul className="space-y-2.5">
              {['Design Graphique', 'Création de Logo', 'Site Web', 'Montage Vidéo', 'Marketing Digital', 'Formation Design', 'CapCut Pro', 'PicsArt Pro'].map((item) => (
                <li key={item}>
                  <a href="#services" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>Bamako, Mali</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span>+223 97 78 72 44</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span>contact@createurboutique.com</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <MessageCircle className="h-4 w-4 flex-shrink-0" />
                <a href="https://wa.me/22397787244" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-500 transition-colors">
                  WhatsApp Direct
                </a>
              </li>
            </ul>
            <div className="mt-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800">
              <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">Paiement via Wave</p>
              <p className="text-xs text-muted-foreground">+223 97 78 72 44</p>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Créateur Boutique. Tous droits réservés. Fait avec passion à Bamako, Mali.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <a href="#politique" className="hover:text-foreground transition-colors">Politique de service</a>
            <span>|</span>
            <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
            <span>|</span>
            <a href="#contact" className="hover:text-foreground transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  )
}