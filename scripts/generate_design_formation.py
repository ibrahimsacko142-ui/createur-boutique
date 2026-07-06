#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Programme de Formation : Design Graphique avec Canva - Studio Creatif"""

import os, sys, hashlib
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm, cm, inch
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY, TA_RIGHT
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.platypus import (SimpleDocTemplate, Paragraph, Spacer, PageBreak,
    Table, TableStyle, KeepTogether, HRFlowable)
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

# Palette
PAGE_BG = colors.HexColor('#f2f2f1'); SECTION_BG = colors.HexColor('#ececea')
CARD_BG = colors.HexColor('#efeeec'); TABLE_STRIPE = colors.HexColor('#f0efee')
HEADER_FILL = colors.HexColor('#514a33'); COVER_BLOCK = colors.HexColor('#62593d')
BORDER = colors.HexColor('#cdc9be'); ICON = colors.HexColor('#816d32')
ACCENT = colors.HexColor('#8a7227'); ACCENT_2 = colors.HexColor('#6f4fd0')
TEXT_PRIMARY = colors.HexColor('#1e1d1b'); TEXT_MUTED = colors.HexColor('#838079')

PAGE_W, PAGE_H = A4
MARGIN = 2.2 * cm
OUTPUT = '/home/z/my-project/download/ebooks/Programme_Formation_Design_Graphique_Canva.pdf'
BRAND = 'Studio Creatif'; FORMATION = 'Formation Design Graphique'

# Styles
s_cover_brand = ParagraphStyle('CB', fontName='FreeSerif-Bold', fontSize=11, leading=14, textColor=ACCENT_2, alignment=TA_CENTER, spaceAfter=4*mm)
s_cover_title = ParagraphStyle('CT', fontName='FreeSerif-Bold', fontSize=30, leading=36, textColor=TEXT_PRIMARY, alignment=TA_CENTER, spaceAfter=6*mm)
s_cover_sub = ParagraphStyle('CS', fontName='FreeSerif-Italic', fontSize=13, leading=19, textColor=TEXT_MUTED, alignment=TA_CENTER, spaceAfter=8*mm)
s_cover_quote = ParagraphStyle('CQ', fontName='FreeSerif-Italic', fontSize=11, leading=16, textColor=ACCENT_2, alignment=TA_CENTER, spaceAfter=10*mm)
s_cover_footer = ParagraphStyle('CF', fontName='FreeSerif', fontSize=9, leading=13, textColor=TEXT_MUTED, alignment=TA_CENTER)
s_toc_title = ParagraphStyle('TT', fontName='FreeSerif-Bold', fontSize=20, leading=26, textColor=TEXT_PRIMARY, spaceAfter=8*mm)
s_toc_h1 = ParagraphStyle('T1', fontName='FreeSerif', fontSize=12, leading=22, textColor=TEXT_PRIMARY, leftIndent=0)
s_toc_h2 = ParagraphStyle('T2', fontName='FreeSerif', fontSize=11, leading=20, textColor=TEXT_MUTED, leftIndent=20)
s_h1 = ParagraphStyle('H1', fontName='FreeSerif-Bold', fontSize=18, leading=24, textColor=TEXT_PRIMARY, spaceBefore=6*mm, spaceAfter=4*mm)
s_h2 = ParagraphStyle('H2', fontName='FreeSerif-Bold', fontSize=14, leading=19, textColor=ACCENT_2, spaceBefore=5*mm, spaceAfter=3*mm)
s_body = ParagraphStyle('B', fontName='FreeSerif', fontSize=10.5, leading=17, textColor=TEXT_PRIMARY, alignment=TA_JUSTIFY, spaceAfter=3*mm)
s_bullet = ParagraphStyle('BU', fontName='FreeSerif', fontSize=10.5, leading=17, textColor=TEXT_PRIMARY, leftIndent=16, bulletIndent=4, spaceAfter=2*mm, bulletFontName='FreeSerif-Bold', bulletFontSize=10.5, bulletColor=ACCENT_2)
s_label = ParagraphStyle('LA', fontName='FreeSerif-Bold', fontSize=9, leading=12, textColor=ACCENT_2, spaceBefore=4*mm, spaceAfter=1*mm)
s_label_text = ParagraphStyle('LT', fontName='FreeSerif', fontSize=10.5, leading=17, textColor=TEXT_PRIMARY, spaceAfter=2*mm)
s_th = ParagraphStyle('TH', fontName='FreeSerif-Bold', fontSize=10, leading=14, textColor=colors.white, alignment=TA_CENTER)
s_tc = ParagraphStyle('TC', fontName='FreeSerif', fontSize=10, leading=14, textColor=TEXT_PRIMARY)
s_tcc = ParagraphStyle('TCC', fontName='FreeSerif', fontSize=10, leading=14, textColor=TEXT_PRIMARY, alignment=TA_CENTER)

class TocDocTemplate(SimpleDocTemplate):
    def afterFlowable(self, flowable):
        if hasattr(flowable, 'bookmark_name'):
            level = getattr(flowable, 'bookmark_level', 0)
            text = getattr(flowable, 'bookmark_text', '')
            key = getattr(flowable, 'bookmark_key', '')
            self.notify('TOCEntry', (level, text, self.page, key))

def page_hf(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(BORDER); canvas.setLineWidth(0.5)
    canvas.line(MARGIN, PAGE_H - MARGIN + 8*mm, PAGE_W - MARGIN, PAGE_H - MARGIN + 8*mm)
    canvas.setFont('FreeSerif', 8); canvas.setFillColor(TEXT_MUTED)
    canvas.drawString(MARGIN, PAGE_H - MARGIN + 10*mm, f'{BRAND} \u2014 {FORMATION}')
    canvas.drawRightString(PAGE_W - MARGIN, PAGE_H - MARGIN + 10*mm, 'Bamako, Mali')
    canvas.line(MARGIN, MARGIN - 6*mm, PAGE_W - MARGIN, MARGIN - 6*mm)
    canvas.drawCentredString(PAGE_W / 2, MARGIN - 10*mm, f'{BRAND} \u2014 Page {doc.page}')
    canvas.restoreState()
def cover_tpl(canvas, doc): pass

def hdg(text, style, level=0):
    key = f'h_{hashlib.md5(text.encode("utf-8")).hexdigest()[:8]}'
    p = Paragraph(f'<a name="{key}"/>{text}', style)
    p.bookmark_name = key; p.bookmark_level = level; p.bookmark_text = text; p.bookmark_key = key
    return p
def bul(text): return Paragraph(f'<bullet>&bull;</bullet>{text}', s_bullet)
def lbl(l, t): return [Paragraph(l.upper(), s_label), Paragraph(t, s_label_text)]
def hr(): return HRFlowable(width="100%", thickness=0.5, color=BORDER, spaceAfter=4*mm, spaceBefore=2*mm)

story = []

# COVER
story.append(Spacer(1, 60*mm))
story.append(Paragraph(BRAND.upper(), s_cover_brand))
story.append(HRFlowable(width="40%", thickness=1.5, color=ACCENT_2, spaceAfter=6*mm, spaceBefore=2*mm))
story.append(Paragraph('PROGRAMME DE FORMATION', ParagraphStyle('x', fontName='FreeSerif-Bold', fontSize=12, leading=16, textColor=TEXT_MUTED, alignment=TA_CENTER, spaceAfter=3*mm)))
story.append(Paragraph('Design Graphique<br/>avec Canva', s_cover_title))
story.append(HRFlowable(width="30%", thickness=1, color=BORDER, spaceAfter=6*mm, spaceBefore=2*mm))
story.append(Paragraph('Formation complete en 6 semaines \u2014 du niveau debutant<br/>a la creation de visuels professionnels pour les reseaux sociaux', s_cover_sub))
story.append(Paragraph('\u00ab Apprendre le design graphique, puis transformer cette competence en opportunite \u00bb', s_cover_quote))
story.append(Spacer(1, 20*mm))
story.append(Paragraph(f'{BRAND} \u2014 Bamako, Mali', s_cover_footer))
story.append(PageBreak())

# SOMMAIRE
toc = TableOfContents(); toc.levelStyles = [s_toc_h1, s_toc_h2]
story.append(Paragraph('Sommaire', s_toc_title)); story.append(hr()); story.append(toc)
story.append(PageBreak())

# 1. INTRODUCTION
story.append(hdg('1. Introduction et objectifs du programme', s_h1, 0)); story.append(hr())
story.append(Paragraph(
    f'Ce programme accompagne les membres du groupe WhatsApp <b>Formation Design Graphique</b> de '
    f'{BRAND} sur 6 semaines. L\'objectif est double : transmettre de vraies competences en design '
    f'utilisable immediatement pour creer des visuels professionnels, et creer une communaute engagee '
    f'qui devient ensuite un relais naturel pour les services payants de {BRAND} (branding complet, '
    f'identite visuelle, creation de logos professionnels, packs de templates).', s_body))
story.append(Paragraph(
    'Chaque semaine, un module est envoye dans le groupe WhatsApp sous forme de messages detailles '
    'accompagnes de captures d\'ecran et d\'exemples concrets. Les membres pratiquent a leur rythme et '
    'partagent leurs realisations dans le groupe pour obtenir des retours personnalises. Canva a ete '
    'choisi comme outil principal car il est gratuit, accessible sur mobile et ordinateur, et offre '
    'des milliers de templates professionnels adaptes a tous les besoins.', s_body))

story.append(hdg('Objectifs cles du programme', s_h2, 1))
for o in [
    'Maitriser l\'interface de Canva et ses fonctionnalites essentielles en 6 semaines',
    'Comprendre les fondamentaux du design : composition, couleurs, typographie',
    'Savoir creer des visuels professionnels pour les reseaux sociaux (posters, stories, bannières)',
    'Maitriser la creation d\'identites visuelles coherentes (logo, palette, charte graphique)',
    'Savoir adapter et personnaliser des templates existants pour gagner du temps',
    'Realiser un portfolio de 10 visuels professionnels comme base de activite freelance',
]:
    story.append(bul(o))

# 2. PROGRAMME
story.append(hdg('2. Programme de formation \u2014 6 semaines', s_h1, 0)); story.append(hr())
story.append(Paragraph('Un module par semaine, envoye dans le groupe WhatsApp sous forme de message texte detaille accompagne de captures d\'ecran et de cas pratiques. Chaque semaine se termine par un exercice pratique corrige publiquement.', s_body))

# S1
story.append(hdg('Semaine 1 : Les fondamentaux du design', s_h2, 1))
story.extend(lbl('Objectif', 'Poser les fondations : comprendre les principes de composition, de couleurs et de typographie qui font la difference entre un visuel amateur et un visuel professionnel.'))
story.extend(lbl('Contenu', ''))
for i in [
    'La regle des tiers et l\'equilibre visuel : placer les elements aux bons endroits',
    'Theorie des couleurs : choisir 2 a 3 couleurs coherentes et harmonieuses',
    'Typographie : choisir et associer les polices (maximum 2 polices par visuel)',
    'Les 7 principes du design : alignement, contraste, proximite, repetition, espace blanc, hierarchie, proportion',
    'Decouverte de l\'interface Canva : templates, elements, texte, uploads, arriere-plans',
    'Creer son premier visuel en utilisant un template et en le personnalisant',
]:
    story.append(bul(i))
story.extend(lbl('Exercice pratique', 'Creer un premier visuel dans Canva en partant d\'un template existant et en le personnalisant (texte, couleurs, images). Publier le resultat dans le groupe.'))

# S2
story.append(hdg('Semaine 2 : Maitriser les outils Canva', s_h2, 1))
story.extend(lbl('Objectif', 'Maitriser tous les outils essentiels de Canva pour creer des visuels sans aucune limitation technique.'))
story.extend(lbl('Contenu', ''))
for i in [
    'Les outils de dessin et de forme : rectangles, cercles, lignes, formes personnalisees',
    'Le systeme de calques : superposer, organiser et verrouiller les elements',
    'Les filtres et ajustements : luminosite, contraste, saturation, flou',
    'L\'outil de recadrage et de decoupe pour les images et les arriere-plans',
    'Les grilles et repères d\'alignement pour un rendu propre et professionnel',
    'La bibliotheque d\'elements graphiques : icones, illustrations, photos libres de droits',
    'Enregistrer ses propres templates pour reutiliser ses creations favorites',
]:
    story.append(bul(i))
story.extend(lbl('Exercice pratique', 'Creer un visuel de A a Z sans utiliser de template (outil vide). Le visuel doit contenir au moins 3 formes, 2 polices differentes et une image libre de droits.'))

# S3
story.append(hdg('Semaine 3 : Identite visuelle et branding', s_h2, 1))
story.extend(lbl('Objectif', 'Creer une identite de marque simple, coherente et reconnaissable en utilisant les outils gratuits de Canva.'))
story.extend(lbl('Contenu', ''))
for i in [
    'Creer un logo simple et memorable avec le Logo Maker de Canva',
    'Construire une palette de couleurs de marque coherente (couleur primaire, secondaire, accent)',
    'Choisir une typographie de marque durable et adaptee a votre secteur d\'activite',
    'Creer des variations de logo (horizontal, vertical, icone seule, fond sombre/foncé)',
    'Cas pratique : identite visuelle complete pour un petit commerce malien',
    'Les erreurs de branding a eviter : trop de couleurs, logo trop complexe, incoherence',
]:
    story.append(bul(i))
story.extend(lbl('Exercice pratique', 'Creer un mini kit de marque (logo + 2 couleurs + 1 police) pour un projet fictif ou reel. Partagez le kit complet dans le groupe.'))

# S4
story.append(hdg('Semaine 4 : Visuels pour les reseaux sociaux', s_h2, 1))
story.extend(lbl('Objectif', 'Produire des visuels optimises pour chaque plateforme sociale en maitrisant les formats, les tailles et les bonnes pratiques specifiques.'))
story.extend(lbl('Contenu', ''))
for i in [
    'Les formats par plateforme : post Instagram (1080x1080), story (1080x1920), bannière Facebook (820x312), post LinkedIn (1200x627)',
    'Creer des carrousels Instagram percutants (5 a 10 slides coherentes)',
    'Les stories et reels : formats verticaux, textes lisibles, accroches visuelles',
    'Miniatures YouTube : accrocher l\'attention en une seconde, cohérence de chaîne',
    'Les bannières et couvertures professionnelles pour Facebook, LinkedIn et sites web',
    'Coherence visuelle entre tous les supports : utiliser un kit de marque constant',
]:
    story.append(bul(i))
story.extend(lbl('Exercice pratique', 'Creer 3 visuels coherents pour une meme marque sur 3 plateformes differentes (Instagram post, story, bannière Facebook). Utilisez le meme kit de marque.'))

# S5
story.append(hdg('Semaine 5 : Projets pratiques avances', s_h2, 1))
story.extend(lbl('Objectif', 'Mettre en pratique l\'ensemble des acquis sur des projets complets et realistes qui peuvent servir directement dans un contexte professionnel.'))
story.extend(lbl('Contenu', ''))
for i in [
    'Projet 1 : Flyer publicitaire complet pour un evenement ou une promotion',
    'Projet 2 : Presentation professionnelle (minimum 5 slides) pour une entreprise ou un projet',
    'Projet 3 : Carte de visite et papier a en-tete coherents avec une identite de marque',
    'Techniques avancees : transparence, masques, combinaison d\'images, effets speciaux',
    'Optimisation pour l\'impression : resolution 300 DPI, mode CMJN, marges de securite',
    'Travailler efficacement : organiser ses projets, utiliser les dossiers et les favoris',
]:
    story.append(bul(i))
story.extend(lbl('Exercice pratique', 'Realiser un projet complet de votre choix (flyer, presentation ou carte de visite) en utilisant tous les outils appris. Publiez-le dans le groupe pour correction collective.'))

# S6
story.append(hdg('Semaine 6 : Portfolio, freelancing et perspectives', s_h2, 1))
story.extend(lbl('Objectif', 'Finaliser un portfolio professionnel, comprendre les bases du freelancing en design et explorer les perspectives d\'evolution vers les outils professionnels payants.'))
story.extend(lbl('Contenu', ''))
for i in [
    'Constituer un portfolio de 10 visuels varis montrant l\'etendue de vos competences',
    'Les bases du freelancing en design : tarification, clients, livraison, revisions',
    'Comment presenter ses services et trouver ses premiers clients',
    'Presentation de la formation Premium Design Graphique (Photoshop, Illustrator)',
    'Ce que Photoshop et Illustrator apportent de plus par rapport a Canva',
    'Bilan de la formation : questionnaire de satisfaction et orientations individuelles',
]:
    story.append(bul(i))
story.extend(lbl('Exercice pratique', 'Compilez vos 10 meilleurs visuels de la formation en un portfolio organise. Choisissez : continuer avec Canva en freelance ou passer a la formation Premium.'))

# 3. REGLES
story.append(hdg('3. Regles du groupe WhatsApp', s_h1, 0)); story.append(hr())
story.append(Paragraph(f'Un cadre clair maintient la qualite du groupe et la credibilite de {BRAND}. Ces regles garantissent un environnement d\'apprentissage sain et productif pour tous les membres.', s_body))
for r in [
    'Respect et bienveillance entre tous les membres, sans exception',
    'Pas de publicite pour d\'autres formations ou services sans autorisation prealable',
    'Les exercices se postent dans le fil dedie pour garder le groupe lisible',
    'Les retours sont constructifs : critiquer le travail, jamais la personne',
    'Les membres inactifs pendant 2 semaines sans message peuvent etre retires du groupe',
    'Partagez vos realisations et vos progres : c\'est ainsi que le groupe avance',
]:
    story.append(bul(r))

# 4. CALENDRIER
story.append(hdg('4. Calendrier recapitulatif', s_h1, 0)); story.append(hr())
story.append(Paragraph('Voici le planning complet de la formation sur 6 semaines. Chaque module se suit en 2 a 3 heures de travail personnel.', s_body))
story.append(Spacer(1, 4*mm))

aw = PAGE_W - 2 * MARGIN
cw = [aw*0.10, aw*0.30, aw*0.35, aw*0.25]
cd = [
    [Paragraph('<b>Sem.</b>', s_th), Paragraph('<b>Module</b>', s_th), Paragraph('<b>Contenu principal</b>', s_th), Paragraph('<b>Action cle</b>', s_th)],
    [Paragraph('1', s_tcc), Paragraph('Fondamentaux du design', s_tc), Paragraph('Composition, couleurs, typographie, interface Canva', s_tc), Paragraph('Premier visuel personnalise', s_tc)],
    [Paragraph('2', s_tcc), Paragraph('Outils Canva', s_tc), Paragraph('Formes, calques, filtres, grilles, bibliotheque', s_tc), Paragraph('Visuel sans template', s_tc)],
    [Paragraph('3', s_tcc), Paragraph('Identite visuelle', s_tc), Paragraph('Logo, palette, typographie, kit de marque', s_tc), Paragraph('Mini kit de marque', s_tc)],
    [Paragraph('4', s_tcc), Paragraph('Reseaux sociaux', s_tc), Paragraph('Formats, carrousels, stories, miniatures, coherence', s_tc), Paragraph('3 visuels sur 3 plateformes', s_tc)],
    [Paragraph('5', s_tcc), Paragraph('Projets avances', s_tc), Paragraph('Flyer, presentation, carte de visite, impression', s_tc), Paragraph('Projet complet au choix', s_tc)],
    [Paragraph('6', s_tcc), Paragraph('Portfolio et freelancing', s_tc), Paragraph('Portfolio, tarification, clients, bilan', s_tc), Paragraph('Portfolio de 10 visuels', s_tc)],
]
t = Table(cd, colWidths=cw, repeatRows=1)
t.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), HEADER_FILL), ('TEXTCOLOR', (0,0), (-1,0), colors.white),
    ('BOTTOMPADDING', (0,0), (-1,-1), 6), ('TOPPADDING', (0,0), (-1,-1), 6),
    ('LEFTPADDING', (0,0), (-1,-1), 8), ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ('BACKGROUND', (0,1), (-1,1), colors.white), ('BACKGROUND', (0,2), (-1,2), TABLE_STRIPE),
    ('BACKGROUND', (0,3), (-1,3), colors.white), ('BACKGROUND', (0,4), (-1,4), TABLE_STRIPE),
    ('BACKGROUND', (0,5), (-1,5), colors.white), ('BACKGROUND', (0,6), (-1,6), TABLE_STRIPE),
    ('GRID', (0,0), (-1,-1), 0.5, BORDER), ('LINEBELOW', (0,0), (-1,0), 1.5, HEADER_FILL),
    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
]))
story.append(t)

# 5. NIVEAU SUPERIEUR
story.append(hdg('5. Passer au niveau superieur', s_h1, 0)); story.append(hr())
story.append(Paragraph(f'Apres cette formation, vous maitriserez Canva pour creer des visuels professionnels. Pour aller plus loin, {BRAND} propose la <b>formation Premium Design Graphique</b> avec Photoshop et Illustrator. Vous apprendrez le retouche photo avancee, la creation de logos vectoriels, l\'illustration numerique et le branding professionnel. Cette formation est ideale pour offrir des services de haute qualite a vos clients et vous differencier sur le marche.', s_body))
story.append(Paragraph(f'Vous pouvez egalement explorer les autres formations de {BRAND} : <b>Montage Video</b> avec CapCut et Premiere Pro, <b>Creation Web</b> pour construire des sites professionnels, et <b>Marketing Digital</b> pour developper votre presence en ligne. Chaque formation suit la meme methode pedagogique en 6 semaines avec exercices pratiques et suivi personnalise.', s_body))
story.extend(lbl('Contact', 'Pour toute question ou pour vous inscrire a la formation Premium, contactez-nous directement sur WhatsApp.'))

doc = TocDocTemplate(OUTPUT, pagesize=A4, leftMargin=MARGIN, rightMargin=MARGIN,
    topMargin=MARGIN, bottomMargin=MARGIN,
    title='Programme de Formation Design Graphique avec Canva - Studio Creatif',
    author='Studio Creatif', subject='Formation Design Graphique Canva - 6 Semaines')
doc.multiBuild(story, onFirstPage=cover_tpl, onLaterPages=page_hf)
print(f'OK: {OUTPUT}')