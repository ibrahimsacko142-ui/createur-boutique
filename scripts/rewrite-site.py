#!/usr/bin/env python3
"""
Massive rewrite of page.tsx - from product catalog to professional showcase.
Uses raw strings and avoids triple-quote conflicts in JSX content.
"""
import re

PATH = '/home/z/my-project/src/app/page.tsx'

with open(PATH, 'r', encoding='utf-8') as f:
    content = f.read()

changes = 0

def safe_replace(src, old, new, label=""):
    global changes
    if old in src:
        src = src.replace(old, new, 1)
        changes += 1
        print(f"  ✅ {label}")
    else:
        print(f"  ⚠️  NOT FOUND: {label}")
    return src

# ═══════════════════════════════════════
# 1. HERO TITLE
# ═══════════════════════════════════════
content = safe_replace(content,
    "Je transforme vos idées en",
    "Donnez vie à vos projets digitaux et",
    "Hero title line 1"
)
content = safe_replace(content,
    "identités visuelles",
    "démarquez-vous.",
    "Hero title highlight"
)
# Remove the "professionnelles." sub-line
content = safe_replace(content,
    """                  <span className="block text-lg sm:text-xl font-medium text-muted-foreground mt-2">
                    professionnelles.
                  </span>""",
    "",
    "Hero subtitle removal"
)

# ═══════════════════════════════════════
# 2. HERO DESCRIPTION
# ═══════════════════════════════════════
content = safe_replace(content,
    "De la création de votre logo à l'habillage de vos réseaux et la conception de votre site web. Un design sur-mesure pour propulser votre business depuis Bamako.",
    "Création de logos, sites web et visuels sur-mesure pour propulser les entrepreneurs et créateurs de Bamako et d'ailleurs. Chaque projet est une opportunité de transformer votre vision en une réalité qui attire et fidélise.",
    "Hero description"
)

# ═══════════════════════════════════════
# 3. HERO BUTTONS
# ═══════════════════════════════════════
content = safe_replace(content,
    "Je souhaite discuter de mon projet",
    "Je souhaite lancer mon projet avec vous",
    "Hero CTA link 1"
)
content = safe_replace(content,
    '<MessageCircle className="mr-2 h-4 w-4" /> Discuter de mon projet',
    '<Rocket className="mr-2 h-4 w-4" /> Lancer mon projet',
    "Hero CTA button 1"
)
content = safe_replace(content,
    'href="#services">\n                    <Button size="lg" variant="outline" className="font-semibold hover:bg-accent transition-transform duration-200 hover:scale-105 active:scale-95">\n                      Découvrir le Studio',
    'href="https://wa.me/22397787244?text=Bonjour%20!%20J%27aimerais%20obtenir%20un%20devis%20gratuit%20pour%20mon%20projet." target="_blank" rel="noopener noreferrer">\n                    <Button size="lg" variant="outline" className="font-semibold hover:bg-accent transition-transform duration-200 hover:scale-105 active:scale-95">\n                      Obtenir un devis gratuit',
    "Hero CTA button 2"
)

# ═══════════════════════════════════════
# 4. HERO FLOATING CARD
# ═══════════════════════════════════════
content = safe_replace(content,
    "Livraison 24h",
    "100% Sur-mesure",
    "Hero floating card title"
)
content = safe_replace(content,
    "<p className=\"text-[10px] text-muted-foreground\">Garantie</p>",
    "<p className=\"text-[10px] text-muted-foreground\">Chaque pixel pensé pour vous</p>",
    "Hero floating card subtitle"
)
# Replace the bottom-left floating card content
content = safe_replace(content,
    """                    <div className="flex -space-x-2">
                      {[1,2,3,4].map((i) => (
                        <div key={i} className={`h-8 w-8 rounded-full border-2 border-white bg-gradient-to-br ${['from-amber-400 to-orange-500','from-emerald-400 to-teal-500','from-purple-400 to-pink-500','from-blue-400 to-cyan-500'][i-1]}`} />
                      ))}
                    </div>
                    <div>
                      <p className="text-xs font-bold">50+ Marques</p>
                      <p className="text-[10px] text-muted-foreground">Satisfaits</p>""",
    """                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
                        <Award className="h-5 w-5 text-amber-500" />
                      </div>
                    <div>
                      <p className="text-xs font-bold">50+ Marques</p>
                      <p className="text-[10px] text-muted-foreground">Propulsées</p>""",
    "Hero bottom-left card"
)

# ═══════════════════════════════════════
# 5. ABOUT SECTION - Text
# ═══════════════════════════════════════
content = safe_replace(content,
    "<h2 className=\"text-3xl sm:text-4xl font-bold tracking-tight\">À Propos</h2>",
    "<h2 className=\"text-3xl sm:text-4xl font-bold tracking-tight\">À Propos de Sacko</h2>",
    "About title"
)

content = safe_replace(content,
    "Je suis un créateur passionné par le design graphique et le digital, basé à Bamako, Mali. Mon objectif est de fournir des services de haute qualité qui répondent aux besoins réels de mes clients, avec un souci constant de l'esthétique et de l'efficacité. Chaque projet que je réalise est traité comme une opportunité de démontrer mon engagement envers l'excellence créative.",
    "Bienvenue ! Je suis Sacko, créateur digital passionné basé à Bamako. Mon objectif est d'accompagner les entreprises et les porteurs de projets dans la construction d'une image de marque forte, professionnelle et mémorable. De la première idée à la conception finale, je transforme votre vision en une réalité visuelle qui attire et fidélise vos clients.",
    "About paragraph 1"
)

content = safe_replace(content,
    "De la création de logos à la conception de sites web, en passant par le montage vidéo et le marketing digital, je mets mon expertise à votre service pour vous aider à vous démarquer et à atteindre vos objectifs. J'utilise les meilleurs outils professionnels du marché — CapCut Pro, Canva Pro, PicsArt Pro — pour garantir des résultats qui dépassent vos attentes.",
    "Je maîtrise les outils les plus demandés du marché — CapCut Pro, Canva Pro, PicsArt Pro — et je les mets au service de chaque projet pour garantir des résultats à la hauteur de vos ambitions. Que ce soit un logo percutant, un site web qui convertit, ou une identité visuelle complète, chaque création est pensée pour vous démarquer de la concurrence.",
    "About paragraph 2"
)

content = safe_replace(content,
    "Ma mission va au-delà de la simple création visuelle : je souhaite aider les jeunes entrepreneurs du Mali et d'Afrique à bâtir une image de marque forte et professionnelle. Que vous soyez étudiant, entrepreneur, entreprise ou créateur de contenu, j'ai la solution adaptée à vos besoins et à votre budget.",
    "Ma mission : aider les entrepreneurs et créateurs du Mali et d'Afrique à prendre le contrôle de leur image numérique. Je crois fermement que chaque business, même le plus modeste, mérite une identité visuelle qui inspire confiance et attire des clients. C'est cette conviction qui guide chaque projet que je réalise.",
    "About paragraph 3"
)

# About stats
content = safe_replace(content, "{ number: '500+', label: 'Projets' }", "{ number: '50+', label: 'Marques créées' }", "About stat 1")
content = safe_replace(content, "{ number: '200+', label: 'Clients' }", "{ number: '100%', label: 'Sur-mesure' }", "About stat 2")
content = safe_replace(content, "{ number: '98%', label: 'Satisfaction' }", "{ number: '5/5', label: 'Satisfaction' }", "About stat 3")

# About button
content = safe_replace(content,
    "Voir les tarifs",
    "Découvrir mes services",
    "About button text"
)

# About image
content = safe_replace(content,
    'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=800&h=500&fit=crop',
    '/demo-photo.png',
    "About image"
)

# About badge
content = safe_replace(content, "Ma Vision", "Qui suis-je", "About badge")

# About floating card
content = safe_replace(content, "Services Rapides", "50+ Projets livrés", "About floating card")
content = safe_replace(content, "Livraison professionnelle", "À Bamako et au-delà", "About floating subtitle")

# About overlay
content = safe_replace(content, "par Sacko &bull; Design &bull; Digital &bull; Créativité", "Créateur Digital &bull; Bamako, Mali", "About overlay text")

# ═══════════════════════════════════════
# 6. SERVICES SECTION HEADER
# ═══════════════════════════════════════
content = safe_replace(content, "Tarifs", "Ce que je propose", "Services badge")
content = safe_replace(content, "Nos Services & Tarifs", "Mes Services", "Services title")
content = safe_replace(content,
    "Des services premium adaptés à tous les budgets. Chaque prestation est livrée avec soin, révisions incluses et accompagnement personnalisé par Sacko.",
    "Découvrez comment chaque service peut transformer votre activité. Du logo qui capte l'attention au site web qui convertit, chaque création est conçue pour vous apporter des résultats concrets.",
    "Services description"
)

# ═══════════════════════════════════════
# 7. POURQUOI NOUS CHOISIR → COLLABORER
# ═══════════════════════════════════════
content = safe_replace(content, "Avantages", "Collaboration", "Pourquoi badge")
content = safe_replace(content, "Pourquoi Nous Choisir ?", "Pourquoi Collaborer Ensemble ?", "Pourquoi title")
content = safe_replace(content,
    "Des centaines de clients font confiance à Sacko et SK Designer Luxe à Bamako et au-delà. Voici ce qui nous distingue et fait de SK Designer Luxe le meilleur choix pour vos projets digitaux.",
    "Au-delà des compétences techniques, c'est une approche humaine et personnalisée qui fait la différence. Voici ce qui rend chaque collaboration unique et efficace.",
    "Pourquoi description"
)

# Replace each "Pourquoi" card
replacements_pourquoi = [
    ("Livraison Express 24h", "Créativité sur-mesure", "Pourquoi card 1 title"),
    ("Nous livrons vos projets en moins de 24 heures. Urgence ? Nous pouvons même faire en quelques heures pour les commandes prioritaires. Aucun compromis sur la qualité.",
     "Chaque projet est conçu selon vos besoins spécifiques. Aucun template pré-fait, aucune copie : votre identité visuelle sera unique et reflétera parfaitement l'essence de votre marque. Du premier croquis au fichier final, chaque détail est pensé pour vous.",
     "Pourquoi card 1 desc"),
    ("Qualité Professionnelle", "Rapidité & Efficacité", "Pourquoi card 2 title"),
    ("Chaque projet est réalisé avec des outils professionnels et suit un processus rigoureux. Résultats garantis à la hauteur de vos attentes.",
     "Des délais respectés pour que vous puissiez lancer vos campagnes à temps. Je comprends que le temps est précieux pour un entrepreneur : c'est pourquoi chaque projet est livré rapidement sans jamais compromettre la qualité.",
     "Pourquoi card 2 desc"),
    ("Paiement Flexible Wave", "Accompagnement de A à Z", "Pourquoi card 3 title"),
    ("Payez facilement via Wave, le moyen de paiement le plus populaire au Mali. Pas besoin de compte bancaire, juste votre téléphone.",
     "Une écoute attentive pour garantir un résultat qui dépasse vos attentes. De la première discussion sur WhatsApp à la livraison finale, je vous guide à chaque étape et j'ajuste jusqu'à ce que vous soyez entièrement satisfait.",
     "Pourquoi card 3 desc"),
    ("Support 7j/7", "Qualité Professionnelle", "Pourquoi card 4 title"),
    ("Besoin d'aide ? Notre équipe est disponible 7 jours sur 7 via WhatsApp. Réponse rapide garantie en moins de 30 minutes.",
     "Chaque création est réalisée avec les meilleurs outils du marché : Canva Pro, CapCut Pro, PicsArt Pro. Le résultat est un visuel qui rivalise avec ceux des grandes agences, à une fraction du prix.",
     "Pourquoi card 4 desc"),
    ("Révisions Gratuites", "Révisions Gratuites", "Pourquoi card 5 title"),
    ("Non satisfait ? Nous effectuons des révisions gratuites jusqu'à ce que le résultat vous convienne parfaitement. Votre satisfaction est notre priorité.",
     "Non satisfait ? J'effectue des révisions gratuites jusqu'à ce que le résultat vous convienne parfaitement. Votre satisfaction n'est pas une option, c'est mon engagement.",
     "Pourquoi card 5 desc"),
    ("200+ Clients Satisfaits", "Paiement Flexible Wave", "Pourquoi card 6 title"),
    ("Plus de 200 clients nous font confiance au Mali et en Afrique de l'Ouest. Leur satisfaction est notre meilleure publicité et notre plus grande fierté.",
     "Payez facilement via Wave au +223 97 78 72 44. Pas besoin de compte bancaire, juste votre téléphone. Simple, rapide et 100% sécurisé.",
     "Pourquoi card 6 desc"),
]
for old, new, label in replacements_pourquoi:
    content = safe_replace(content, old, new, label)

# ═══════════════════════════════════════
# 8. CTA FINAL
# ═══════════════════════════════════════
content = safe_replace(content,
    "Prêt à Donner Vie à Votre Projet ?",
    "Prêt à faire passer votre communication au niveau supérieur ?",
    "CTA title"
)
content = safe_replace(content,
    "Ne laissez pas votre idée attendre. Contactez-nous dès maintenant et transformez votre vision en réalité. Design professionnel, livraison rapide et satisfaction garantie.",
    "N'attendez plus pour donner à votre entreprise l'image qu'elle mérite. Contactez-moi dès aujourd'hui pour discuter de votre projet et obtenir un devis gratuit.",
    "CTA description"
)
content = safe_replace(content,
    "Commander sur WhatsApp",
    "Commander via WhatsApp",
    "CTA button 1"
)
content = safe_replace(content,
    "Je souhaite commander un service chez SK Designer Luxe",
    "Je suis prêt à lancer mon projet de communication",
    "CTA WhatsApp link 1"
)
content = safe_replace(content,
    'Voir les services <ArrowRight className="ml-2 h-4 w-4" />',
    "M'envoyer un message <Send className=\"ml-2 h-4 w-4\" />",
    "CTA button 2 text"
)
# Change CTA button 2 link to WhatsApp
content = safe_replace(content,
    'href="#services">\n                  <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 font-semibold text-base px-8">',
    'href="https://wa.me/22397787244?text=Bonjour%20!%20J%27aimerais%20discuter%20de%20mon%20projet%20avec%20vous." target="_blank" rel="noopener noreferrer">\n                  <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 font-semibold text-base px-8">',
    "CTA button 2 link"
)
content = safe_replace(content, "Livraison rapide", "Devis gratuit", "CTA trust 1")

# ═══════════════════════════════════════
# 9. COMMENT ÇA MARCHE
# ═══════════════════════════════════════
content = safe_replace(content,
    "Commander chez SK Designer Luxe est simple et rapide. Suivez ces 4 étapes pour obtenir votre design, site web ou outil numérique en moins de 24 heures.",
    "Travailler avec moi est simple et direct. Voici comment votre projet passe de l'idée à la réalité en quelques étapes.",
    "Comment ça marche description"
)
content = safe_replace(content,
    "Choisissez votre service",
    "Découvrez mes services",
    "Step 1 title"
)
content = safe_replace(content,
    "Parcourez notre catalogue de services, outils et formations. Sélectionnez ce dont vous avez besoin et ajoutez au panier.",
    "Explorez mes services de design, sites web, vidéo et formations. Identifiez ce qui correspond à votre projet et à vos objectifs.",
    "Step 1 desc"
)
content = safe_replace(content,
    "Contactez-nous",
    "Discutons de votre projet",
    "Step 2 title"
)
content = safe_replace(content,
    "Envoyez votre commande via WhatsApp ou le formulaire de contact. Décrivez votre projet en quelques mots.",
    "Envoyez-moi un message sur WhatsApp pour me présenter votre vision. Je vous écoute et vous guide vers la meilleure solution.",
    "Step 2 desc"
)
content = safe_replace(content,
    "Paiement via Wave",
    "Création & Production",
    "Step 3 title"
)
content = safe_replace(content,
    "Effectuez le paiement au numéro +223 97 78 72 44 via Wave. Simple, rapide et 100% sécurisé.",
    "Je conçois votre projet avec les meilleurs outils professionnels. Chaque détail est peaufiné pour un résultat qui vous ressemble.",
    "Step 3 desc"
)
content = safe_replace(content,
    "Réception & Livraison",
    "Livraison & Satisfaction",
    "Step 4 title"
)
content = safe_replace(content,
    "Recevez votre commande en moins de 24h. Révisions gratuites jusqu'à votre entière satisfaction.",
    "Recevez votre création et validez. Révisions gratuites jusqu'à ce que le résultat vous convienne parfaitement.",
    "Step 4 desc"
)

# ═══════════════════════════════════════
# 10. TOUTES LES OFFRES → SERVICES
# ═══════════════════════════════════════
content = safe_replace(content, "Toutes Mes Offres", "Tous les Services", "Offers title")
content = safe_replace(content,
    "Explorez l'ensemble de mes services et outils disponibles. Filtez par catégorie pour trouver ce dont vous avez besoin.",
    "Explorez l'ensemble de mes services, outils et ressources. Filtrer par catégorie pour trouver exactement ce dont votre projet a besoin.",
    "Offers description"
)

# ═══════════════════════════════════════
# 11. BLOG → GUIDES & RESSOURCES
# ═══════════════════════════════════════
content = safe_replace(content, "Conseils & Astuces", "Guides, Articles & Ressources", "Blog title")
content = safe_replace(content,
    "Articles et conseils pour vous aider à réussir dans le design et le digital.",
    "Des articles approfondis, des guides pratiques et des ressources pour vous aider à maîtriser le design et le digital. Tout ce qu'il faut savoir, gratuitement.",
    "Blog description"
)

# ═══════════════════════════════════════
# 12. NOS VALEURS
# ═══════════════════════════════════════
content = safe_replace(content,
    "Ce qui définit notre travail et notre engagement envers chaque client.",
    "Ce qui guide mon travail et mon engagement envers chaque projet.",
    "Valeurs description"
)

# ═══════════════════════════════════════
# 13. ADD SHOWCASE SECTION before services
# ═══════════════════════════════════════
showcase = '''
        {/* ═══ CE QUE VOUS OBTENEZ ═══ */}
        <section className="py-16 sm:py-20 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <FadeIn className="text-center mb-14">
              <Badge variant="secondary" className="mb-3 bg-blue-100 text-blue-700 border-blue-200">
                <TrendingUp className="h-3 w-3 mr-1" /> Résultats
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Ce que vous obtenez concrètement</h2>
              <p className="mt-4 text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Chaque service est conçu pour vous apporter un bénéfice réel et mesurable. Voici ce que mes clients obtiennent après avoir travaillé avec moi.
              </p>
            </FadeIn>

            <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: Palette,
                  title: 'Création de Logos & Identité Visuelle',
                  desc: "Votre logo est l'âme de votre entreprise. Obtenez un design unique, moderne et professionnel qui capte immédiatement l'attention et inspire confiance à vos futurs clients.",
                  color: 'from-amber-400 to-orange-500',
                },
                {
                  icon: PenTool,
                  title: 'Affiches Publicitaires & Visuels',
                  desc: "Communiquez sur vos événements, vos produits ou vos promotions avec des visuels percutants conçus pour maximiser votre impact sur les réseaux sociaux et en format physique.",
                  color: 'from-emerald-400 to-teal-500',
                },
                {
                  icon: Globe,
                  title: 'Création de Sites Web Professionnels',
                  desc: "Offrez à votre entreprise une vitrine ouverte 24h/24. Des sites web rapides, fluides et adaptés aux mobiles pour renforcer votre crédibilité et augmenter vos ventes en ligne.",
                  color: 'from-blue-400 to-indigo-500',
                },
                {
                  icon: GraduationCap,
                  title: 'Formations Digitales Pratiques',
                  desc: "Prenez le contrôle de votre communication numérique. Des formations pratiques et accessibles pour maîtriser les outils digitaux essentiels à votre croissance.",
                  color: 'from-purple-400 to-pink-500',
                },
              ].map((item) => (
                <motion.div key={item.title} variants={cardVariants}>
                  <Card className="h-full border-0 shadow-md hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
                    <CardContent className="p-6">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${item.color} text-white mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                        <item.icon className="h-6 w-6" />
                      </div>
                      <h3 className="font-bold text-sm mb-3">{item.title}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                      <a href="#services" className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-amber-600 hover:text-amber-700 transition-colors">
                        En savoir plus <ArrowUpRight className="h-3 w-3" />
                      </a>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </StaggerContainer>
          </div>
        </section>

'''

if '{/* ═══ SERVICES & TARIFS PAR CATÉGORIE ═══ */}' in content:
    content = content.replace(
        '{/* ═══ SERVICES & TARIFS PAR CATÉGORIE ═══ */}',
        showcase + '{/* ═══ SERVICES & TARIFS PAR CATÉGORIE ═══ */}',
        1
    )
    print("  ✅ Showcase section added")
    changes += 1
else:
    print("  ⚠️  Services section marker not found")

# ═══════════════════════════════════════
# WRITE
# ═══════════════════════════════════════
with open(PATH, 'w', encoding='utf-8') as f:
    f.write(content)

print(f"\n🎯 {changes} changes applied. File written.")