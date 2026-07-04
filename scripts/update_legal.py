#!/usr/bin/env python3
"""Replace the legal sections in page.tsx with new content from the uploaded file."""

import re

filepath = '/home/z/my-project/src/app/page.tsx'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Find the start of legalPage === 'mentions' section
mentions_start = content.find("{legalPage === 'mentions' && (")
confidentialite_start = content.find("{legalPage === 'confidentialite' && (")

if mentions_start == -1 or confidentialite_start == -1:
    print("ERROR: Could not find legal sections")
    exit(1)

# Find the end of the confidentialite section - it's the closing of FadeIn and Card
# We need to find the matching closing for the confidentialite block
conf_end_marker = "            )}\n          </div>\n        </section>"
conf_end_idx = content.find(conf_end_marker, confidentialite_start)

if conf_end_idx == -1:
    print("ERROR: Could not find end of confidentialite section")
    exit(1)

# The end includes the closing tags
section_end = conf_end_idx + len(conf_end_marker)

new_mentions = """{legalPage === 'mentions' && (
              <FadeIn>
                <Card className="border-0 shadow-lg max-w-4xl mx-auto">
                  <CardContent className="p-6 sm:p-10 space-y-6">
                    <h3 className="text-2xl font-bold">Mentions L\\u00e9gales</h3>
                    <div className="space-y-5 text-sm text-muted-foreground leading-relaxed">
                      <div>
                        <h4 className="font-bold text-foreground text-base mb-2">\\u00c9diteur du site</h4>
                        <p>Nom / Raison sociale : SK Designer Luxe (Cr\\u00e9ateur Boutique)<br />
                        Responsable : Ibrahim Sacko<br />
                        Localisation : Bamako, Mali<br />
                        Contact : contact@createurboutique.com / +223 97 78 72 44 (WhatsApp)</p>
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground text-base mb-2">H\\u00e9bergement</h4>
                        <p>Ce site est h\\u00e9berg\\u00e9 par Vercel Inc.<br />
                        Adresse : 340 S Lemon Ave #4133, Walnut, CA 91789, \\u00c9tats-Unis<br />
                        Site web : vercel.com</p>
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground text-base mb-2">Propri\\u00e9t\\u00e9 intellectuelle</h4>
                        <p>L&rsquo;ensemble des contenus pr\\u00e9sents sur ce site (textes, images, logos, vid\\u00e9os, cr\\u00e9ations graphiques) est la propri\\u00e9t\\u00e9 de SK Designer Luxe, sauf mention contraire. Toute reproduction, distribution ou utilisation sans autorisation pr\\u00e9alable est interdite.</p>
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground text-base mb-2">Responsabilit\\u00e9</h4>
                        <p>SK Designer Luxe s&rsquo;efforce d&rsquo;assurer l&rsquo;exactitude des informations diffus\\u00e9es sur ce site, mais ne peut garantir l&rsquo;absence d&rsquo;erreurs ou d&rsquo;omissions. L&rsquo;utilisateur du site est seul responsable de l&rsquo;usage qu&rsquo;il fait des informations fournies.</p>
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground text-base mb-2">Liens externes</h4>
                        <p>Ce site peut contenir des liens vers des sites tiers (WhatsApp, r\\u00e9seaux sociaux, plateformes de paiement). SK Designer Luxe n&rsquo;est pas responsable du contenu ou des pratiques de confidentialit\\u00e9 de ces sites externes.</p>
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground text-base mb-2">Droit applicable</h4>
                        <p>Les pr\\u00e9sentes mentions l\\u00e9gales sont soumises au droit malien.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            )}

            {legalPage === 'confidentialite' && (
              <FadeIn>
                <Card className="border-0 shadow-lg max-w-4xl mx-auto">
                  <CardContent className="p-6 sm:p-10 space-y-6">
                    <h3 className="text-2xl font-bold">Politique de Confidentialit\\u00e9</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">Derni\\u00e8re mise \\u00e0 jour : 5 juillet 2026</p>
                    <div className="space-y-5 text-sm text-muted-foreground leading-relaxed">
                      <div>
                        <h4 className="font-bold text-foreground text-base mb-2">1. Informations collect\\u00e9es</h4>
                        <p>Lorsque vous utilisez ce site, je peux collecter :<br />
                        - Les informations que vous fournissez via mes formulaires de contact (nom, num\\u00e9ro WhatsApp, email, description de votre projet)<br />
                        - Des donn\\u00e9es de navigation anonymes (pages visit\\u00e9es, dur\\u00e9e de visite, type d&rsquo;appareil) via des outils d&rsquo;analyse<br />
                        - Des cookies pour am\\u00e9liorer votre exp\\u00e9rience de navigation</p>
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground text-base mb-2">2. Utilisation des informations</h4>
                        <p>Les informations collect\\u00e9es servent \\u00e0 :<br />
                        - R\\u00e9pondre \\u00e0 vos demandes de devis ou de service<br />
                        - Am\\u00e9liorer la qualit\\u00e9 de mes services et de mon site<br />
                        - Vous contacter au sujet de votre commande ou formation<br />
                        - Afficher des publicit\\u00e9s pertinentes (si applicable)</p>
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground text-base mb-2">3. Partage des informations</h4>
                        <p>Je ne vends ni ne loue vos informations personnelles \\u00e0 des tiers. Elles peuvent \\u00eatre partag\\u00e9es uniquement :<br />
                        - Avec des prestataires techniques n\\u00e9cessaires au fonctionnement du site (h\\u00e9bergement)<br />
                        - Si la loi l&rsquo;exige</p>
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground text-base mb-2">4. Cookies et publicit\\u00e9</h4>
                        <p>Ce site peut utiliser des cookies, y compris ceux de services publicitaires tiers (comme Google AdSense), pour proposer des annonces adapt\\u00e9es \\u00e0 vos centres d&rsquo;int\\u00e9r\\u00eat. Vous pouvez d\\u00e9sactiver les cookies dans les param\\u00e8tres de votre navigateur \\u00e0 tout moment.</p>
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground text-base mb-2">5. S\\u00e9curit\\u00e9</h4>
                        <p>Je mets en oeuvre des mesures raisonnables pour prot\\u00e9ger vos informations, mais aucun syst\\u00e8me n&rsquo;est totalement s\\u00e9curis\\u00e9 \\u00e0 100%.</p>
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground text-base mb-2">6. Vos droits</h4>
                        <p>Vous pouvez \\u00e0 tout moment demander la suppression de vos donn\\u00e9es personnelles en me contactant via WhatsApp ou email.</p>
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground text-base mb-2">7. Contact</h4>
                        <p>Pour toute question concernant cette politique : contact@createurboutique.com</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            )}"""

# Actually write it with real unicode characters
new_mentions_real = """{legalPage === 'mentions' && (
              <FadeIn>
                <Card className="border-0 shadow-lg max-w-4xl mx-auto">
                  <CardContent className="p-6 sm:p-10 space-y-6">
                    <h3 className="text-2xl font-bold">Mentions Légales</h3>
                    <div className="space-y-5 text-sm text-muted-foreground leading-relaxed">
                      <div>
                        <h4 className="font-bold text-foreground text-base mb-2">Éditeur du site</h4>
                        <p>Nom / Raison sociale : SK Designer Luxe (Créateur Boutique)<br />
                        Responsable : Ibrahim Sacko<br />
                        Localisation : Bamako, Mali<br />
                        Contact : contact@createurboutique.com / +223 97 78 72 44 (WhatsApp)</p>
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground text-base mb-2">Hébergement</h4>
                        <p>Ce site est hébergé par Vercel Inc.<br />
                        Adresse : 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis<br />
                        Site web : vercel.com</p>
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground text-base mb-2">Propriété intellectuelle</h4>
                        <p>L&rsquo;ensemble des contenus présents sur ce site (textes, images, logos, vidéos, créations graphiques) est la propriété de SK Designer Luxe, sauf mention contraire. Toute reproduction, distribution ou utilisation sans autorisation préalable est interdite.</p>
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground text-base mb-2">Responsabilité</h4>
                        <p>SK Designer Luxe s&rsquo;efforce d&rsquo;assurer l&rsquo;exactitude des informations diffusées sur ce site, mais ne peut garantir l&rsquo;absence d&rsquo;erreurs ou d&rsquo;omissions. L&rsquo;utilisateur du site est seul responsable de l&rsquo;usage qu&rsquo;il fait des informations fournies.</p>
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground text-base mb-2">Liens externes</h4>
                        <p>Ce site peut contenir des liens vers des sites tiers (WhatsApp, réseaux sociaux, plateformes de paiement). SK Designer Luxe n&rsquo;est pas responsable du contenu ou des pratiques de confidentialité de ces sites externes.</p>
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground text-base mb-2">Droit applicable</h4>
                        <p>Les présentes mentions légales sont soumises au droit malien.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            )}

            {legalPage === 'confidentialite' && (
              <FadeIn>
                <Card className="border-0 shadow-lg max-w-4xl mx-auto">
                  <CardContent className="p-6 sm:p-10 space-y-6">
                    <h3 className="text-2xl font-bold">Politique de Confidentialité</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">Dernière mise à jour : 5 juillet 2026</p>
                    <div className="space-y-5 text-sm text-muted-foreground leading-relaxed">
                      <div>
                        <h4 className="font-bold text-foreground text-base mb-2">1. Informations collectées</h4>
                        <p>Lorsque vous utilisez ce site, je peux collecter :<br />
                        - Les informations que vous fournissez via mes formulaires de contact (nom, numéro WhatsApp, email, description de votre projet)<br />
                        - Des données de navigation anonymes (pages visitées, durée de visite, type d&rsquo;appareil) via des outils d&rsquo;analyse<br />
                        - Des cookies pour améliorer votre expérience de navigation</p>
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground text-base mb-2">2. Utilisation des informations</h4>
                        <p>Les informations collectées servent à :<br />
                        - Répondre à vos demandes de devis ou de service<br />
                        - Améliorer la qualité de mes services et de mon site<br />
                        - Vous contacter au sujet de votre commande ou formation<br />
                        - Afficher des publicités pertinentes (si applicable)</p>
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground text-base mb-2">3. Partage des informations</h4>
                        <p>Je ne vends ni ne loue vos informations personnelles à des tiers. Elles peuvent être partagées uniquement :<br />
                        - Avec des prestataires techniques nécessaires au fonctionnement du site (hébergement)<br />
                        - Si la loi l&rsquo;exige</p>
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground text-base mb-2">4. Cookies et publicité</h4>
                        <p>Ce site peut utiliser des cookies, y compris ceux de services publicitaires tiers (comme Google AdSense), pour proposer des annonces adaptées à vos centres d&rsquo;intérêt. Vous pouvez désactiver les cookies dans les paramètres de votre navigateur à tout moment.</p>
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground text-base mb-2">5. Sécurité</h4>
                        <p>Je mets en oeuvre des mesures raisonnables pour protéger vos informations, mais aucun système n&rsquo;est totalement sécurisé à 100%.</p>
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground text-base mb-2">6. Vos droits</h4>
                        <p>Vous pouvez à tout moment demander la suppression de vos données personnelles en me contactant via WhatsApp ou email.</p>
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground text-base mb-2">7. Contact</h4>
                        <p>Pour toute question concernant cette politique : contact@createurboutique.com</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            )}"""

# Replace from mentions_start to section_end
new_content = content[:mentions_start] + new_mentions_real + content[section_end:]

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("SUCCESS: Legal sections replaced successfully")