import { Instagram, Facebook, Twitter, Mail, MapPin, Phone } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t bg-muted/30 mt-auto">
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
              Votre partenaire digital pour le design graphique, la création de sites web et les outils numériques. Qualité, Créativité, Satisfaction.
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
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Navigation</h3>
            <ul className="space-y-2.5">
              {['Accueil', 'Services', 'Offres', 'Parrainage', 'Paiement', 'Avis', 'Contact'].map((item) => (
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
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Services</h3>
            <ul className="space-y-2.5">
              {['Design Graphique', 'Création de Logo', 'Site Web', 'Montage Vidéo', 'Marketing Digital'].map((item) => (
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
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t pt-6 text-center">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Créateur Boutique. Tous droits réservés. Fait avec passion.
          </p>
        </div>
      </div>
    </footer>
  )
}