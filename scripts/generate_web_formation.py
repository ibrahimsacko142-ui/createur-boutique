#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Programme de Formation : Creation Web (HTML/CSS) - Studio Creatif"""

import os, sys, hashlib
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm, cm, inch
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY, TA_RIGHT
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import (SimpleDocTemplate, Paragraph, Spacer, PageBreak,
    Table, TableStyle, HRFlowable)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFontFamily
from reportlab.platypus.tableofcontents import TableOfContents

FONT_DIR = '/usr/share/fonts'
pdfmetrics.registerFont(TTFont('FreeSerif', f'{FONT_DIR}/truetype/freefont/FreeSerif.ttf'))
pdfmetrics.registerFont(TTFont('FreeSerif-Bold', f'{FONT_DIR}/truetype/freefont/FreeSerifBold.ttf'))
pdfmetrics.registerFont(TTFont('FreeSerif-Italic', f'{FONT_DIR}/truetype/freefont/FreeSerifItalic.ttf'))
pdfmetrics.registerFont(TTFont('FreeSerif-BoldItalic', f'{FONT_DIR}/truetype/freefont/FreeSerifBoldItalic.ttf'))
registerFontFamily('FreeSerif', normal='FreeSerif', bold='FreeSerif-Bold',
                    italic='FreeSerif-Italic', boldItalic='FreeSerif-BoldItalic')

HEADER_FILL = colors.HexColor('#514a33'); BORDER = colors.HexColor('#cdc9be')
ACCENT_2 = colors.HexColor('#6f4fd0'); TEXT_PRIMARY = colors.HexColor('#1e1d1b')
TEXT_MUTED = colors.HexColor('#838079'); TABLE_STRIPE = colors.HexColor('#f0efee')

PAGE_W, PAGE_H = A4; MARGIN = 2.2 * cm
OUTPUT = '/home/z/my-project/download/ebooks/Programme_Formation_Creation_Web_HTML_CSS.pdf'
BRAND = 'Studio Creatif'; FORMATION = 'Formation Creation Web'

s_cb = ParagraphStyle('CB', fontName='FreeSerif-Bold', fontSize=11, leading=14, textColor=ACCENT_2, alignment=TA_CENTER, spaceAfter=4*mm)
s_ct = ParagraphStyle('CT', fontName='FreeSerif-Bold', fontSize=30, leading=36, textColor=TEXT_PRIMARY, alignment=TA_CENTER, spaceAfter=6*mm)
s_cs = ParagraphStyle('CS', fontName='FreeSerif-Italic', fontSize=13, leading=19, textColor=TEXT_MUTED, alignment=TA_CENTER, spaceAfter=8*mm)
s_cq = ParagraphStyle('CQ', fontName='FreeSerif-Italic', fontSize=11, leading=16, textColor=ACCENT_2, alignment=TA_CENTER, spaceAfter=10*mm)
s_cf = ParagraphStyle('CF', fontName='FreeSerif', fontSize=9, leading=13, textColor=TEXT_MUTED, alignment=TA_CENTER)
s_tt = ParagraphStyle('TT', fontName='FreeSerif-Bold', fontSize=20, leading=26, textColor=TEXT_PRIMARY, spaceAfter=8*mm)
s_t1 = ParagraphStyle('T1', fontName='FreeSerif', fontSize=12, leading=22, textColor=TEXT_PRIMARY, leftIndent=0)
s_t2 = ParagraphStyle('T2', fontName='FreeSerif', fontSize=11, leading=20, textColor=TEXT_MUTED, leftIndent=20)
s_h1 = ParagraphStyle('H1', fontName='FreeSerif-Bold', fontSize=18, leading=24, textColor=TEXT_PRIMARY, spaceBefore=6*mm, spaceAfter=4*mm)
s_h2 = ParagraphStyle('H2', fontName='FreeSerif-Bold', fontSize=14, leading=19, textColor=ACCENT_2, spaceBefore=5*mm, spaceAfter=3*mm)
s_b = ParagraphStyle('B', fontName='FreeSerif', fontSize=10.5, leading=17, textColor=TEXT_PRIMARY, alignment=TA_JUSTIFY, spaceAfter=3*mm)
s_bu = ParagraphStyle('BU', fontName='FreeSerif', fontSize=10.5, leading=17, textColor=TEXT_PRIMARY, leftIndent=16, bulletIndent=4, spaceAfter=2*mm, bulletFontName='FreeSerif-Bold', bulletFontSize=10.5, bulletColor=ACCENT_2)
s_la = ParagraphStyle('LA', fontName='FreeSerif-Bold', fontSize=9, leading=12, textColor=ACCENT_2, spaceBefore=4*mm, spaceAfter=1*mm)
s_lt = ParagraphStyle('LT', fontName='FreeSerif', fontSize=10.5, leading=17, textColor=TEXT_PRIMARY, spaceAfter=2*mm)
s_th = ParagraphStyle('TH', fontName='FreeSerif-Bold', fontSize=10, leading=14, textColor=colors.white, alignment=TA_CENTER)
s_tc = ParagraphStyle('TC', fontName='FreeSerif', fontSize=10, leading=14, textColor=TEXT_PRIMARY)
s_tcc = ParagraphStyle('TCC', fontName='FreeSerif', fontSize=10, leading=14, textColor=TEXT_PRIMARY, alignment=TA_CENTER)

class TocDoc(SimpleDocTemplate):
    def afterFlowable(self, f):
        if hasattr(f, 'bookmark_name'):
            self.notify('TOCEntry', (getattr(f,'bookmark_level',0), getattr(f,'bookmark_text',''), self.page, getattr(f,'bookmark_key','')))

def phf(c, d):
    c.saveState(); c.setStrokeColor(BORDER); c.setLineWidth(0.5)
    c.line(MARGIN, PAGE_H-MARGIN+8*mm, PAGE_W-MARGIN, PAGE_H-MARGIN+8*mm)
    c.setFont('FreeSerif',8); c.setFillColor(TEXT_MUTED)
    c.drawString(MARGIN, PAGE_H-MARGIN+10*mm, f'{BRAND} \u2014 {FORMATION}')
    c.drawRightString(PAGE_W-MARGIN, PAGE_H-MARGIN+10*mm, 'Bamako, Mali')
    c.line(MARGIN, MARGIN-6*mm, PAGE_W-MARGIN, MARGIN-6*mm)
    c.drawCentredString(PAGE_W/2, MARGIN-10*mm, f'{BRAND} \u2014 Page {d.page}')
    c.restoreState()
def cpt(c,d): pass

def hd(t,s,l=0):
    k=f'h_{hashlib.md5(t.encode("utf-8")).hexdigest()[:8]}'
    p=Paragraph(f'<a name="{k}"/>{t}',s); p.bookmark_name=k; p.bookmark_level=l; p.bookmark_text=t; p.bookmark_key=k; return p
def bu(t): return Paragraph(f'<bullet>&bull;</bullet>{t}', s_bu)
def lb(l,t): return [Paragraph(l.upper(),s_la), Paragraph(t,s_lt)]
def hr(): return HRFlowable(width="100%",thickness=0.5,color=BORDER,spaceAfter=4*mm,spaceBefore=2*mm)

story = []

# COVER
story.append(Spacer(1,60*mm))
story.append(Paragraph(BRAND.upper(),s_cb))
story.append(HRFlowable(width="40%",thickness=1.5,color=ACCENT_2,spaceAfter=6*mm,spaceBefore=2*mm))
story.append(Paragraph('PROGRAMME DE FORMATION',ParagraphStyle('x',fontName='FreeSerif-Bold',fontSize=12,leading=16,textColor=TEXT_MUTED,alignment=TA_CENTER,spaceAfter=3*mm)))
story.append(Paragraph('Creation de Sites Web<br/>avec HTML et CSS',s_ct))
story.append(HRFlowable(width="30%",thickness=1,color=BORDER,spaceAfter=6*mm,spaceBefore=2*mm))
story.append(Paragraph('Formation complete en 6 semaines \u2014 du niveau debutant<br/>a la creation de sites web responsifs et professionnels',s_cs))
story.append(Paragraph('\u00ab Apprendre a creer des sites web, puis transformer cette competence en opportunite \u00bb',s_cq))
story.append(Spacer(1,20*mm))
story.append(Paragraph(f'{BRAND} \u2014 Bamako, Mali',s_cf))
story.append(PageBreak())

# SOMMAIRE
toc=TableOfContents();toc.levelStyles=[s_t1,s_t2]
story.append(Paragraph('Sommaire',s_tt)); story.append(hr()); story.append(toc); story.append(PageBreak())

# 1. INTRO
story.append(hd('1. Introduction et objectifs du programme',s_h1,0)); story.append(hr())
story.append(Paragraph(f'Ce programme accompagne les membres du groupe WhatsApp <b>Formation Creation Web</b> de {BRAND} sur 6 semaines. L\'objectif est double : transmettre de vraies competences en developpement web utilisables immediatement pour creer des sites professionnels, et creer une communaute engagee qui devient ensuite un relais naturel pour les services payants de {BRAND} (creation de sites complets, boutiques en ligne, applications web personnalisees).',s_b))
story.append(Paragraph('Chaque semaine, un module est envoye dans le groupe WhatsApp sous forme de messages detailles accompagnes de captures d\'ecran, de fragments de code et d\'exemples concrets. Les membres pratiquent a leur rythme et partagent leurs realisations pour obtenir des retours personnalises. HTML et CSS ont ete choisis car ce sont les langages fondamentaux du web : les maitriser ouvre la porte a tous les frameworks et technologies modernes.',s_b))

story.append(hd('Objectifs cles du programme',s_h2,1))
for o in [
    'Comprendre le fonctionnement du web et le role de HTML et CSS dans la creation de pages',
    'Maitriser les balises HTML essentielles pour structurer le contenu d\'une page web',
    'Savoir styliser une page avec CSS : couleurs, polices, mise en page, espacements',
    'Creer des mises en page responsives qui s\'adaptent a tous les ecrans (telephone, tablette, ordinateur)',
    'Mettre en ligne un site web gratuitement et le rendre accessible sur internet',
    'Realiser un site web complet de 3 a 5 pages comme portfolio personnel',
]:
    story.append(bu(o))

# 2. PROGRAMME
story.append(hd('2. Programme de formation \u2014 6 semaines',s_h1,0)); story.append(hr())
story.append(Paragraph('Un module par semaine, envoye dans le groupe WhatsApp sous forme de message texte detaille accompagne de code source et d\'exemples visuels. Chaque semaine se termine par un exercice pratique corrige publiquement.',s_b))

# S1
story.append(hd('Semaine 1 : Introduction au developpement web',s_h2,1))
story.extend(lb('Objectif','Comprendre les bases du web, configurer son environnement de travail et ecrire ses premieres lignes de code HTML.'))
story.extend(lb('Contenu',''))
for i in [
    'Comment fonctionne le web : navigateur, serveur, URL, DNS (explique simplement)',
    'HTML et CSS : que sont ces langages et pourquoi sont-ils indispensables',
    'Les outils necessaires : un navigateur web, un editeur de code (VS Code gratuit), un terminal',
    'Votre premiere page HTML : structure de base (DOCTYPE, html, head, body)',
    'Les balises essentielles : h1 a h6, p, a, img, ul/ol/li, div, span',
    'Enregistrer et ouvrir son fichier HTML dans le navigateur',
]:
    story.append(bu(i))
story.extend(lb('Exercice pratique','Creer votre premiere page HTML contenant un titre, un paragraphe, une liste a puces, un lien et une image. Partagez une capture d\'ecran du resultat dans le groupe.'))

# S2
story.append(hd('Semaine 2 : Structurer le contenu avec HTML',s_h2,1))
story.extend(lb('Objectif','Maitriser toutes les balises HTML pour structurer n\'importe quel type de contenu web de maniere semantique et accessible.'))
story.extend(lb('Contenu',''))
for i in [
    'La semantique HTML : pourquoi utiliser les bonnes balises (header, nav, main, footer, article, section)',
    'Les formulaires : input (texte, email, mot de passe, fichier), select, textarea, button',
    'Les tableaux : thead, tbody, tr, td, th pour presenter des donnees structurees',
    'Les medias : balises audio, video, iframe pour integrer des contenus riches',
    'Les attributs HTML importants : id, class, src, href, alt, title, placeholder',
    'Les bonnes pratiques : accessibilite, alt sur les images, structure logique, validation W3C',
]:
    story.append(bu(i))
story.extend(lb('Exercice pratique','Creer une page HTML semantique complete avec un en-tete, une navigation, une section principale (contenant un paragraphe, une image et un tableau), un formulaire de contact et un pied de page.'))

# S3
story.append(hd('Semaine 3 : Styliser avec CSS - les bases',s_h2,1))
story.extend(lb('Objectif','Apprendre a styliser n\'importe quel element HTML avec CSS : couleurs, polices, arriere-plans, bordures et espacements.'))
story.extend(lb('Contenu',''))
for i in [
    'Les 3 methodes pour appliquer du CSS : inline, interne (style) et externe (fichier .css)',
    'Les selecteurs CSS : par balise, par classe (.class), par identifiant (#id), combinés',
    'Les propriétés de texte : color, font-size, font-family, font-weight, text-align, line-height',
    'Les arriere-plans et bordures : background-color, background-image, border, border-radius',
    'Le modele de boite (box model) : margin, padding, width, height, box-sizing',
    'Les couleurs en CSS : noms, hexadecimaux (#ff0000), RGB, RGBA (avec transparence)',
]:
    story.append(bu(i))
story.extend(lb('Exercice pratique','Creer un fichier CSS externe et styliser la page HTML de la semaine 2. Appliquez des couleurs de marque, une police soignee, des espacements harmonieux et des bordures arrondies sur les elements du formulaire.'))

# S4
story.append(hd('Semaine 4 : Mise en page et flexbox',s_h2,1))
story.extend(lb('Objectif','Maitriser les techniques modernes de mise en page CSS pour creer des designs complexes et responsifs.'))
story.extend(lb('Contenu',''))
for i in [
    'Le positionnement CSS : static, relative, absolute, fixed, sticky (avec exemples concrets)',
    'Flexbox : display flex, justify-content, align-items, flex-direction, flex-wrap, gap',
    'La grille CSS (CSS Grid) : grid-template-columns, grid-template-rows, grid-gap, grid-area',
    'Creer une barre de navigation responsive avec Flexbox',
    'Les medias queries : adapter le design selon la taille de l\'ecran (mobile, tablette, desktop)',
    'Le design mobile-first : concevoir d\'abord pour le telephone, puis adapter pour les grands ecrans',
]:
    story.append(bu(i))
story.extend(lb('Exercice pratique','Transformer votre page en un site multi-sections avec une navigation fixe, une banniere hero, une section services en grille (3 colonnes sur desktop, 1 sur mobile) et un pied de page. Le site doit etre parfaitement lisible sur telephone.'))

# S5
story.append(hd('Semaine 5 : Projets pratiques avances',s_h2,1))
story.extend(lb('Objectif','Mettre en pratique l\'ensemble des acquis sur des projets realistes et complets qui peuvent servir directement dans un contexte professionnel.'))
story.extend(lb('Contenu',''))
for i in [
    'Projet 1 : Page d\'atterrissage (landing page) complete avec appel a l\'action',
    'Projet 2 : Portfolio personnel presentant vos competences et realisations',
    'Les animations CSS : transitions, transforms, @keyframes pour des effets subtils et professionnels',
    'Optimisation des images : formats WebP, compression, attribut loading="lazy"',
    'Les pseudo-classes et pseudo-elements : :hover, :focus, ::before, ::after',
    'Bonne pratiques de code : indentation, commentaires, noms de classe significatifs',
]:
    story.append(bu(i))
story.extend(lb('Exercice pratique','Realisez une landing page professionnelle pour un produit ou service fictif. La page doit inclure une navigation, une section hero avec un appel a l\'action, une section fonctionnalites, des temoignages et un formulaire de contact. Publiez le resultat dans le groupe.'))

# S6
story.append(hd('Semaine 6 : Mise en ligne et perspectives',s_h2,1))
story.extend(lb('Objectif','Mettre votre site en ligne gratuitement, comprendre l\'hebergement web et les noms de domaine, et explorer les perspectives d\'evolution vers le developpement avance.'))
story.extend(lb('Contenu',''))
for i in [
    'L\'hebergement web gratuit : Netlify, Vercel, GitHub Pages (deploiement en un clic)',
    'Les noms de domaine : comment choisir et configurer un nom de domaine professionnel',
    'Mettre en ligne votre site sur Netlify : creer un compte, glisser-deposer, obtenir votre URL',
    'Le SEO de base : balises meta (title, description), structure des titres, images optimisees',
    'Presentation de la formation Premium Creation Web : site complet avec Next.js, base de donnees',
    'Ce que Next.js et React apportent de plus par rapport au HTML/CSS pur',
    'Bilan de la formation et orientations individuelles',
]:
    story.append(bu(i))
story.extend(lb('Exercice pratique','Mettez en ligne votre site complet sur Netlify (gratuit) et partagez le lien dans le groupe. Choisissez : continuer en freelance avec HTML/CSS ou passer a la formation Premium pour apprendre Next.js.'))

# 3. REGLES
story.append(hd('3. Regles du groupe WhatsApp',s_h1,0)); story.append(hr())
story.append(Paragraph(f'Un cadre clair maintient la qualite du groupe et la credibilite de {BRAND}.',s_b))
for r in [
    'Respect et bienveillance entre tous les membres, sans exception',
    'Pas de publicite pour d\'autres formations ou services sans autorisation prealable',
    'Les exercices se postent dans le fil dedie pour garder le groupe lisible',
    'Les retours sont constructifs : critiquer le travail, jamais la personne',
    'Les membres inactifs pendant 2 semaines sans message peuvent etre retires du groupe',
    'Partagez vos realisations, vos codes et vos questions : c\'est ainsi que le groupe avance',
]:
    story.append(bu(r))

# 4. CALENDRIER
story.append(hd('4. Calendrier recapitulatif',s_h1,0)); story.append(hr())
story.append(Paragraph('Voici le planning complet de la formation sur 6 semaines. Chaque module necessite 3 a 4 heures de travail personnel.',s_b))
story.append(Spacer(1,4*mm))

aw=PAGE_W-2*MARGIN; cw=[aw*0.10,aw*0.30,aw*0.35,aw*0.25]
cd=[
    [Paragraph('<b>Sem.</b>',s_th),Paragraph('<b>Module</b>',s_th),Paragraph('<b>Contenu principal</b>',s_th),Paragraph('<b>Action cle</b>',s_th)],
    [Paragraph('1',s_tcc),Paragraph('Introduction au web',s_tc),Paragraph('Fonctionnement du web, HTML de base, outils',s_tc),Paragraph('Premiere page HTML',s_tc)],
    [Paragraph('2',s_tcc),Paragraph('HTML avance',s_tc),Paragraph('Semantique, formulaires, tableaux, medias, validation',s_tc),Paragraph('Page semantique complete',s_tc)],
    [Paragraph('3',s_tcc),Paragraph('CSS - les bases',s_tc),Paragraph('Selecteurs, texte, boite, couleurs, fichiers externes',s_tc),Paragraph('CSS externe sur la page S2',s_tc)],
    [Paragraph('4',s_tcc),Paragraph('Mise en page',s_tc),Paragraph('Flexbox, CSS Grid, positionnement, responsive, mobile-first',s_tc),Paragraph('Site multi-sections responsive',s_tc)],
    [Paragraph('5',s_tcc),Paragraph('Projets avances',s_tc),Paragraph('Landing page, portfolio, animations, pseudo-classes',s_tc),Paragraph('Landing page professionnelle',s_tc)],
    [Paragraph('6',s_tcc),Paragraph('Mise en ligne',s_tc),Paragraph('Hebergement, domaine, SEO, Next.js, bilan',s_tc),Paragraph('Site en ligne sur Netlify',s_tc)],
]
t=Table(cd,colWidths=cw,repeatRows=1)
t.setStyle(TableStyle([
    ('BACKGROUND',(0,0),(-1,0),HEADER_FILL),('TEXTCOLOR',(0,0),(-1,0),colors.white),
    ('BOTTOMPADDING',(0,0),(-1,-1),6),('TOPPADDING',(0,0),(-1,-1),6),
    ('LEFTPADDING',(0,0),(-1,-1),8),('RIGHTPADDING',(0,0),(-1,-1),8),
    ('BACKGROUND',(0,1),(-1,1),colors.white),('BACKGROUND',(0,2),(-1,2),TABLE_STRIPE),
    ('BACKGROUND',(0,3),(-1,3),colors.white),('BACKGROUND',(0,4),(-1,4),TABLE_STRIPE),
    ('BACKGROUND',(0,5),(-1,5),colors.white),('BACKGROUND',(0,6),(-1,6),TABLE_STRIPE),
    ('GRID',(0,0),(-1,-1),0.5,BORDER),('LINEBELOW',(0,0),(-1,0),1.5,HEADER_FILL),
    ('VALIGN',(0,0),(-1,-1),'MIDDLE'),
]))
story.append(t)

# 5. NIVEAU SUPERIEUR
story.append(hd('5. Passer au niveau superieur',s_h1,0)); story.append(hr())
story.append(Paragraph(f'Apres cette formation, vous saurez creer des sites web complets en HTML et CSS. Pour aller plus loin, {BRAND} propose la <b>formation Premium Creation Web</b> avec Next.js et les technologies modernes. Vous apprendrez a creer des sites dynamiques avec des bases de donnees, des systemes d\'authentification, des boutiques en ligne et des tableaux de bord. Cette formation est ideale pour offrir des services web professionnels a haute valeur ajoutee.',s_b))
story.append(Paragraph(f'Explorez egalement les autres formations de {BRAND} : <b>Design Graphique</b> avec Canva, <b>Montage Video</b> avec CapCut, et <b>Marketing Digital</b> pour developper votre activite en ligne. Chaque formation suit la meme methode en 6 semaines.',s_b))
story.extend(lb('Contact','Pour toute question ou pour vous inscrire a la formation Premium, contactez-nous directement sur WhatsApp.'))

doc=TocDoc(OUTPUT,pagesize=A4,leftMargin=MARGIN,rightMargin=MARGIN,topMargin=MARGIN,bottomMargin=MARGIN,
    title='Programme de Formation Creation Web HTML CSS - Studio Creatif',author='Studio Creatif',
    subject='Formation Creation Web HTML CSS - 6 Semaines')
doc.multiBuild(story,onFirstPage=cpt,onLaterPages=phf)
print(f'OK: {OUTPUT}')