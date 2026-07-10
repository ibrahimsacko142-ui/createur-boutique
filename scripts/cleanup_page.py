#!/usr/bin/env python3
"""Cleanup page.tsx: remove duplicate Payer buttons, fix structure, remove unused imports"""
import re

with open('/home/z/my-project/src/app/page.tsx', 'r') as f:
    content = f.read()

# 1. Fix service section Payer button (lines ~1420-1436)
old_services_btn = '''                        <div className="flex gap-2">
                        <a
                        href={`https://wa.me/22397787244?text=${encodeURIComponent(`Bonjour ! Je suis intéressé(e) par l'Offre Premium : ${section.cat}. Pouvez-vous me donner un devis ?`)}`}
                        target="_blank" rel="noopener noreferrer"
                        className="flex-1"
                      >
                        <Button variant="outline" className="w-full border-emerald-300 text-emerald-700 hover:bg-emerald-50 font-bold text-xs h-10">
                          <MessageCircle className="h-3.5 w-3.5 mr-1.5" /> WhatsApp
                        </Button>
                      </a>
                      <Button
                        onClick={() => openWhatsApp(`Offre Premium : ${section.cat}`, 15000, 'Service premium sur devis')}
                        className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs h-10 shadow-md shadow-amber-500/20"
                      >
                        <ShieldCheck className="h-3.5 w-3.5 mr-1.5" /> Payer
                      </Button>
                      </div>'''

new_services_btn = '''                        <a
                        href={`https://wa.me/22397787244?text=${encodeURIComponent(`Bonjour ! Je suis intéressé(e) par l'Offre Premium : ${section.cat}. Pouvez-vous me donner un devis ?`)}`}
                        target="_blank" rel="noopener noreferrer"
                      >
                        <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs h-10 shadow-md shadow-amber-500/20">
                          <MessageCircle className="h-3.5 w-3.5 mr-1.5" /> Commander via WhatsApp
                        </Button>
                      </a>'''

content = content.replace(old_services_btn, new_services_btn)

# 2. Fix Carrière Pro card Payer buttons
old_carriere_btn = '''                      <div className="flex gap-2">
                      <a
                        href={`https://wa.me/22397787244?text=${encodeURIComponent(`Bonjour ! Je souhaite commander : ${s.name} (${s.sub}) — ${s.price} FCFA.`)}`}
                        target="_blank" rel="noopener noreferrer"
                        className="flex-1"
                      >
                        <Button variant="outline" size="sm" className="w-full border-emerald-400/30 text-emerald-400 hover:bg-emerald-500/10 font-semibold text-xs h-9">
                          <MessageCircle className="h-3.5 w-3.5 mr-1.5" /> WhatsApp
                        </Button>
                      </a>
                      <Button
                        size="sm"
                        onClick={() => openWhatsApp(`${s.name} (${s.sub})`, parseInt(s.price.replace(/\\s/g, '')), s.hook)}
                        className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs h-9"
                      >
                        <ShieldCheck className="h-3.5 w-3.5 mr-1.5" /> Payer {s.price} F
                      </Button>
                      </div>'''

new_carriere_btn = '''                      <a
                        href={`https://wa.me/22397787244?text=${encodeURIComponent(`Bonjour ! Je souhaite commander : ${s.name} (${s.sub}) — ${s.price} FCFA.`)}`}
                        target="_blank" rel="noopener noreferrer"
                      >
                        <Button size="sm" className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs h-9">
                          <MessageCircle className="h-3.5 w-3.5 mr-1.5" /> Commander {s.price} F
                        </Button>
                      </a>'''

content = content.replace(old_carriere_btn, new_carriere_btn)

# 3. Fix Carrière Pro Pack Payer button
old_pack_btn = '''                    <div className="flex gap-2">
                      <a href="https://wa.me/22397787244?text=Bonjour%20!%20Je%20veux%20le%20Pack%20Lancement%20Carri%C3%A8re%20%C3%A0%203%20500%20FCFA." target="_blank" rel="noopener noreferrer">
                        <Button size="lg" variant="outline" className="border-emerald-400/50 text-emerald-300 hover:bg-emerald-500/10 font-bold px-6 whitespace-nowrap">
                          <MessageCircle className="h-5 w-5 mr-2" /> WhatsApp
                        </Button>
                      </a>
                      <Button
                        size="lg"
                        onClick={() => openWhatsApp('Pack Lancement Carrière (CV + Lettre + LinkedIn + Guide)', 3500, 'Pack complet : CV Premium + Lettre de motivation + Profil LinkedIn + Guide entretien')}
                        className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold shadow-xl shadow-amber-500/25 px-6 whitespace-nowrap"
                      >
                        <ShieldCheck className="h-5 w-5 mr-2" /> Payer 3 500 F
                      </Button>
                    </div>'''

new_pack_btn = '''                    <a href="https://wa.me/22397787244?text=Bonjour%20!%20Je%20veux%20le%20Pack%20Lancement%20Carri%C3%A8re%20%C3%A0%203%20500%20FCFA." target="_blank" rel="noopener noreferrer">
                      <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold shadow-xl shadow-amber-500/25 px-6 whitespace-nowrap">
                        <MessageCircle className="h-5 w-5 mr-2" /> Commander le Pack 3 500 F
                      </Button>
                    </a>'''

content = content.replace(old_pack_btn, new_pack_btn)

# 4. Fix Formation Premium Payer buttons
old_formation_btn = '''                      <div className="flex gap-2">
                      <a
                        href={`https://wa.me/22397787244?text=${encodeURIComponent(`Bonjour Sacko ! Je suis intéressé(e) par la formation Premium ${form.title} (${form.premium.price} FCFA). Comment y accéder ?`)}`}
                        target="_blank" rel="noopener noreferrer"
                        className="flex-1"
                      >
                        <Button variant="outline" className="w-full border-emerald-300 text-emerald-700 hover:bg-emerald-50 font-bold text-xs h-10">
                          <MessageCircle className="h-3.5 w-3.5 mr-1.5" /> WhatsApp
                        </Button>
                      </a>
                      <Button
                        onClick={() => openWhatsApp(`Formation Premium : ${form.title}`, form.premium.priceNum, `${form.subtitle} — ${form.duration}, ${form.lessons}`)}
                        className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs h-10 shadow-lg shadow-amber-500/20"
                      >
                        <ShieldCheck className="h-3.5 w-3.5 mr-1.5" /> Payer {form.premium.price} F
                      </Button>
                      </div>'''

new_formation_btn = '''                      <a
                        href={`https://wa.me/22397787244?text=${encodeURIComponent(`Bonjour Sacko ! Je suis intéressé(e) par la formation Premium ${form.title} (${form.premium.price} FCFA). Comment y accéder ?`)}`}
                        target="_blank" rel="noopener noreferrer"
                      >
                        <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs h-10 shadow-lg shadow-amber-500/20">
                          <MessageCircle className="h-3.5 w-3.5 mr-1.5" /> S'inscrire {form.premium.price} F
                        </Button>
                      </a>'''

content = content.replace(old_formation_btn, new_formation_btn)

# 5. Fix Book Detail Modal Payer button
old_book_btn = '''                        <div className="flex gap-2">
                        <a
                          href={`https://wa.me/22397787244?text=${encodeURIComponent(`Bonjour Sacko ! Je veux commander le livre : ${selectedBook.title} par ${selectedBook.author} (1 000 FCFA). Comment procéder ?`)}`}
                          target="_blank" rel="noopener noreferrer"
                          onClick={() => setSelectedBook(null)}
                          className="flex-1"
                        >
                          <Button variant="outline" className="w-full border-emerald-300 text-emerald-700 hover:bg-emerald-50 font-bold h-12">
                            <MessageCircle className="h-4 w-4 mr-2" /> WhatsApp
                          </Button>
                        </a>
                        <Button
                          onClick={() => { openWhatsApp(`Livre : ${selectedBook.title} (${selectedBook.author})`, 1000, 'Livre PDF — livraison instantanée via WhatsApp'); setSelectedBook(null) }}
                          className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold shadow-lg shadow-amber-500/20 h-12"
                        >
                          <ShieldCheck className="h-4 w-4 mr-2" /> Payer 1 000 F
                        </Button>
                        </div>'''

new_book_btn = '''                        <a
                          href={`https://wa.me/22397787244?text=${encodeURIComponent(`Bonjour Sacko ! Je veux commander le livre : ${selectedBook.title} par ${selectedBook.author} (1 000 FCFA). Comment procéder ?`)}`}
                          target="_blank" rel="noopener noreferrer"
                          onClick={() => setSelectedBook(null)}
                        >
                          <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold shadow-lg shadow-amber-500/20 h-12">
                            <MessageCircle className="h-4 w-4 mr-2" /> Commander 1 000 F
                          </Button>
                        </a>'''

content = content.replace(old_book_btn, new_book_btn)

# 6. Fix Book Pack Payer button
old_bookpack_btn = '''                    <div className="flex gap-2">
                    <a href={`https://wa.me/22397787244?text=${encodeURIComponent('Bonjour Sacko ! Je veux commander le Pack Complet de 12 livres (7 000 FCFA au lieu de 12 000). Comment procéder ?')}`} target="_blank" rel="noopener noreferrer" className="block">
                      <Button className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold shadow-lg shadow-emerald-500/20 whitespace-nowrap">
                        <MessageCircle className="h-4 w-4 mr-1.5" /> WhatsApp
                      </Button>
                    </a>
                    <Button
                      onClick={() => openWhatsApp('Pack Complet 12 livres (PDF)', 7000, '12 livres numériques en PDF — livraison instantanée via WhatsApp')}
                      className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold shadow-lg shadow-amber-500/20 whitespace-nowrap"
                    >
                      <ShieldCheck className="h-4 w-4 mr-1.5" /> Payer 7 000 F
                    </Button>
                  </div>'''

new_bookpack_btn = '''                    <a href={`https://wa.me/22397787244?text=${encodeURIComponent('Bonjour Sacko ! Je veux commander le Pack Complet de 12 livres (7 000 FCFA au lieu de 12 000). Comment procéder ?')}`} target="_blank" rel="noopener noreferrer" className="block">
                      <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold shadow-lg shadow-amber-500/20 whitespace-nowrap">
                        <MessageCircle className="h-4 w-4 mr-1.5" /> Commander le Pack 7 000 F
                      </Button>
                    </a>'''

content = content.replace(old_bookpack_btn, new_bookpack_btn)

# 7. Fix Cart Panel Payer button
old_cart_btn = '''              <div className="flex gap-2">
                <a
                  href={`https://wa.me/22397787244?text=${encodeURIComponent(`Bonjour Sacko ! Je veux commander ${cart.length} livre(s) :\\n\\n${cart.map(t => `- ${t} (1 000 FCFA)`).join('\\n')}\\n\\nTotal : ${cart.length * 1000} FCFA. Comment procéder pour le paiement ?`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setShowCart(false)}
                  className="flex-1"
                >
                  <Button variant="outline" className="w-full border-emerald-300 text-emerald-700 hover:bg-emerald-50 font-bold h-11 text-sm">
                    <MessageCircle className="h-4 w-4 mr-2" /> WhatsApp
                  </Button>
                </a>
                <Button
                  onClick={() => { openWhatsApp(`${cart.length} livre(s) du panier`, Math.min(cart.length * 1000, 7000), cart.map(t => `- ${t}`).join('\\n')); setShowCart(false) }}
                  className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold shadow-lg shadow-amber-500/20 h-11 text-sm"
                >
                  <ShieldCheck className="h-4 w-4 mr-2" /> Payer {Math.min(cart.length * 1000, 7000).toLocaleString('fr-FR')} F
                </Button>
              </div>'''

new_cart_btn = '''              <a
                href={`https://wa.me/22397787244?text=${encodeURIComponent(`Bonjour Sacko ! Je veux commander ${cart.length} livre(s) :\\n\\n${cart.map(t => `- ${t} (1 000 FCFA)`).join('\\n')}\\n\\nTotal : ${cart.length * 1000} FCFA. Comment procéder pour le paiement ?`)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setShowCart(false)}
              >
                <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold shadow-lg shadow-amber-500/20 h-11 text-sm">
                  <MessageCircle className="h-4 w-4 mr-2" /> Commander {Math.min(cart.length * 1000, 7000).toLocaleString('fr-FR')} F
                </Button>
              </a>'''

content = content.replace(old_cart_btn, new_cart_btn)

# 8. Fix testimonial cards - move them inside the section (they're outside the closing </section>)
# The testimonial cards (lines ~2425-2458) are between the closing </section> of testimonials and the commande section
# We need to move them inside the testimonials section, before </section>
old_testim_structure = '''            </div>

            {/* Trust note */}
            <div className="mt-8 text-center">
              <p className="text-xs text-muted-foreground">
                Chaque message est <strong className="text-foreground">réel</strong>, reçu directement sur mon WhatsApp.
                Envie d&apos;être le prochain ?{' '}
                <a href="#commande-rapide" className="text-amber-600 font-semibold hover:underline">Commandez maintenant</a>.
              </p>
            </div>
          </div>
        </section>

            {/* Testimonial cards grid */}
            <div className="mt-10 grid sm:grid-cols-2 gap-4">'''

new_testim_structure = '''            </div>

            {/* Trust note */}
            <div className="mt-8 text-center">
              <p className="text-xs text-muted-foreground">
                Chaque message est <strong className="text-foreground">réel</strong>, reçu directement sur mon WhatsApp.
                Envie d&apos;être le prochain ?{' '}
                <a href="#commande-rapide" className="text-amber-600 font-semibold hover:underline">Commandez maintenant</a>.
              </p>
            </div>

            {/* Testimonial cards grid */}
            <div className="mt-10 grid sm:grid-cols-2 gap-4">'''

content = content.replace(old_testim_structure, new_testim_structure)

# Now find where the testimonial cards end and the commande section starts, and add the closing tags
old_testim_end = '''              ))}
            </div>



        {/* ═══ 15. COMMANDE RAPIDE'''

new_testim_end = '''              ))}
            </div>
          </div>
        </section>

        {/* ═══ 15. COMMANDE RAPIDE'''

content = content.replace(old_testim_end, new_testim_end)

# 9. Remove ShieldCheck and Lock from imports since we may have removed most ShieldCheck usage
# Actually, ShieldCheck is still used in the "Pourquoi nous choisir" section, so keep it.

# Write the cleaned file
with open('/home/z/my-project/src/app/page.tsx', 'w') as f:
    f.write(content)

print("Cleanup complete!")
print(f"File length: {len(content)} chars, {content.count(chr(10))} lines")

# Verify no more iKeePay
if 'iKeePay' in content:
    print("WARNING: iKeePay still found!")
else:
    print("✅ iKeePay references removed")

# Count remaining openWhatsApp calls
ow_count = content.count('openWhatsApp(')
print(f"Remaining openWhatsApp calls: {ow_count}")