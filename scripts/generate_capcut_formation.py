#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Programme de Formation : Montage Video avec CapCut
Studio Creatif - Bamako, Mali
"""

import os, sys, hashlib, math
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm, cm, inch
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY, TA_RIGHT
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, PageBreak,
    Table, TableStyle, KeepTogether, HRFlowable,
)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFontFamily
from reportlab.platypus.tableofcontents import TableOfContents

# ━━ Cascade Palette ━━
PAGE_BG       = colors.HexColor('#f2f2f1')
SECTION_BG    = colors.HexColor('#ececea')
CARD_BG       = colors.HexColor('#efeeec')
TABLE_STRIPE  = colors.HexColor('#f0efee')
HEADER_FILL   = colors.HexColor('#514a33')
COVER_BLOCK   = colors.HexColor('#62593d')
BORDER        = colors.HexColor('#cdc9be')
ICON          = colors.HexColor('#816d32')
ACCENT        = colors.HexColor('#8a7227')
ACCENT_2      = colors.HexColor('#6f4fd0')
TEXT_PRIMARY   = colors.HexColor('#1e1d1b')
TEXT_MUTED     = colors.HexColor('#838079')

# ━━ Font Setup ━━
FONT_DIR = '/usr/share/fonts'

pdfmetrics.registerFont(TTFont('FreeSerif', f'{FONT_DIR}/truetype/freefont/FreeSerif.ttf'))
pdfmetrics.registerFont(TTFont('FreeSerif-Bold', f'{FONT_DIR}/truetype/freefont/FreeSerifBold.ttf'))
pdfmetrics.registerFont(TTFont('FreeSerif-Italic', f'{FONT_DIR}/truetype/freefont/FreeSerifItalic.ttf'))
pdfmetrics.registerFont(TTFont('FreeSerif-BoldItalic', f'{FONT_DIR}/truetype/freefont/FreeSerifBoldItalic.ttf'))
pdfmetrics.registerFont(TTFont('NotoSerifSC', f'{FONT_DIR}/truetype/noto-serif-sc/NotoSerifSC-Regular.ttf'))
pdfmetrics.registerFont(TTFont('NotoSerifSC-Bold', f'{FONT_DIR}/truetype/noto-serif-sc/NotoSerifSC-Bold.ttf'))

registerFontFamily('FreeSerif', normal='FreeSerif', bold='FreeSerif-Bold',
                    italic='FreeSerif-Italic', boldItalic='FreeSerif-BoldItalic')
registerFontFamily('NotoSerifSC', normal='NotoSerifSC', bold='NotoSerifSC-Bold')

# ━━ Constants ━━
PAGE_W, PAGE_H = A4
MARGIN = 2.2 * cm
OUTPUT = '/home/z/my-project/download/ebooks/Programme_Formation_Montage_Video_CapCut.pdf'
BRAND = 'Studio Creatif'
FORMATION = 'Formation Montage Video'

# ━━ Styles ━━
styles = getSampleStyleSheet()

s_cover_brand = ParagraphStyle('CoverBrand', fontName='FreeSerif-Bold', fontSize=11,
    leading=14, textColor=ACCENT_2, alignment=TA_CENTER, spaceAfter=4*mm, letterSpacing=3)
s_cover_title = ParagraphStyle('CoverTitle', fontName='FreeSerif-Bold', fontSize=30,
    leading=36, textColor=TEXT_PRIMARY, alignment=TA_CENTER, spaceAfter=6*mm)
s_cover_sub = ParagraphStyle('CoverSub', fontName='FreeSerif-Italic', fontSize=13,
    leading=19, textColor=TEXT_MUTED, alignment=TA_CENTER, spaceAfter=8*mm)
s_cover_quote = ParagraphStyle('CoverQuote', fontName='FreeSerif-Italic', fontSize=11,
    leading=16, textColor=ACCENT_2, alignment=TA_CENTER, spaceAfter=10*mm)
s_cover_footer = ParagraphStyle('CoverFooter', fontName='FreeSerif', fontSize=9,
    leading=13, textColor=TEXT_MUTED, alignment=TA_CENTER)

s_toc_title = ParagraphStyle('TOCTitle', fontName='FreeSerif-Bold', fontSize=20,
    leading=26, textColor=TEXT_PRIMARY, spaceAfter=8*mm)
s_toc_h1 = ParagraphStyle('TOCH1', fontName='FreeSerif', fontSize=12, leading=22,
    textColor=TEXT_PRIMARY, leftIndent=0)
s_toc_h2 = ParagraphStyle('TOCH2', fontName='FreeSerif', fontSize=11, leading=20,
    textColor=TEXT_MUTED, leftIndent=20)

s_h1 = ParagraphStyle('H1', fontName='FreeSerif-Bold', fontSize=18, leading=24,
    textColor=TEXT_PRIMARY, spaceBefore=6*mm, spaceAfter=4*mm)
s_h2 = ParagraphStyle('H2', fontName='FreeSerif-Bold', fontSize=14, leading=19,
    textColor=ACCENT_2, spaceBefore=5*mm, spaceAfter=3*mm)
s_h3 = ParagraphStyle('H3', fontName='FreeSerif-Bold', fontSize=12, leading=16,
    textColor=HEADER_FILL, spaceBefore=3*mm, spaceAfter=2*mm)
s_body = ParagraphStyle('Body', fontName='FreeSerif', fontSize=10.5, leading=17,
    textColor=TEXT_PRIMARY, alignment=TA_JUSTIFY, spaceAfter=3*mm)
s_body_bold = ParagraphStyle('BodyBold', fontName='FreeSerif-Bold', fontSize=10.5,
    leading=17, textColor=TEXT_PRIMARY, spaceAfter=3*mm)
s_bullet = ParagraphStyle('Bullet', fontName='FreeSerif', fontSize=10.5, leading=17,
    textColor=TEXT_PRIMARY, leftIndent=16, bulletIndent=4, spaceAfter=2*mm,
    bulletFontName='FreeSerif-Bold', bulletFontSize=10.5, bulletColor=ACCENT_2)
s_label = ParagraphStyle('Label', fontName='FreeSerif-Bold', fontSize=9, leading=12,
    textColor=ACCENT_2, spaceBefore=4*mm, spaceAfter=1*mm, letterSpacing=1.5)
s_label_text = ParagraphStyle('LabelText', fontName='FreeSerif', fontSize=10.5,
    leading=17, textColor=TEXT_PRIMARY, spaceAfter=2*mm)
s_table_header = ParagraphStyle('TH', fontName='FreeSerif-Bold', fontSize=10,
    leading=14, textColor=colors.white, alignment=TA_CENTER)
s_table_cell = ParagraphStyle('TC', fontName='FreeSerif', fontSize=10, leading=14,
    textColor=TEXT_PRIMARY)
s_table_cell_c = ParagraphStyle('TCC', fontName='FreeSerif', fontSize=10, leading=14,
    textColor=TEXT_PRIMARY, alignment=TA_CENTER)

# ━━ TocDocTemplate ━━
class TocDocTemplate(SimpleDocTemplate):
    def __init__(self, *args, **kwargs):
        SimpleDocTemplate.__init__(self, *args, **kwargs)
        self._page_count = 0

    def afterPage(self):
        self._page_count += 1

    def afterFlowable(self, flowable):
        if hasattr(flowable, 'bookmark_name'):
            level = getattr(flowable, 'bookmark_level', 0)
            text = getattr(flowable, 'bookmark_text', '')
            key = getattr(flowable, 'bookmark_key', '')
            self.notify('TOCEntry', (level, text, self.page, key))

# ━━ Header / Footer ━━
def page_header_footer(canvas, doc):
    canvas.saveState()
    # Header line
    canvas.setStrokeColor(BORDER)
    canvas.setLineWidth(0.5)
    canvas.line(MARGIN, PAGE_H - MARGIN + 8*mm, PAGE_W - MARGIN, PAGE_H - MARGIN + 8*mm)
    # Header text
    canvas.setFont('FreeSerif', 8)
    canvas.setFillColor(TEXT_MUTED)
    canvas.drawString(MARGIN, PAGE_H - MARGIN + 10*mm, f'{BRAND} \u2014 {FORMATION}')
    canvas.drawRightString(PAGE_W - MARGIN, PAGE_H - MARGIN + 10*mm, 'Bamako, Mali')
    # Footer line
    canvas.line(MARGIN, MARGIN - 6*mm, PAGE_W - MARGIN, MARGIN - 6*mm)
    # Footer
    canvas.setFont('FreeSerif', 8)
    canvas.setFillColor(TEXT_MUTED)
    canvas.drawCentredString(PAGE_W / 2, MARGIN - 10*mm, f'{BRAND} \u2014 Page {doc.page}')
    canvas.restoreState()

def cover_template(canvas, doc):
    pass  # No header/footer on cover

# ━━ Helpers ━━
def heading(text, style, level=0):
    key = f'h_{hashlib.md5(text.encode("utf-8")).hexdigest()[:8]}'
    p = Paragraph(f'<a name="{key}"/>{text}', style)
    p.bookmark_name = key
    p.bookmark_level = level
    p.bookmark_text = text
    p.bookmark_key = key
    return p

def bullet(text):
    return Paragraph(f'<bullet>&bull;</bullet>{text}', s_bullet)

def label_block(label, text):
    return [Paragraph(label.upper(), s_label), Paragraph(text, s_label_text)]

def hr():
    return HRFlowable(width="100%", thickness=0.5, color=BORDER, spaceAfter=4*mm, spaceBefore=2*mm)

# ━━ Build Story ━━
story = []

# ── COVER PAGE ──
story.append(Spacer(1, 60*mm))
story.append(Paragraph(BRAND.upper(), s_cover_brand))
story.append(HRFlowable(width="40%", thickness=1.5, color=ACCENT_2, spaceAfter=6*mm, spaceBefore=2*mm))
story.append(Paragraph('PROGRAMME DE FORMATION', ParagraphStyle('CT2', fontName='FreeSerif-Bold',
    fontSize=12, leading=16, textColor=TEXT_MUTED, alignment=TA_CENTER, spaceAfter=3*mm, letterSpacing=2)))
story.append(Paragraph('Montage Video<br/>avec CapCut', s_cover_title))
story.append(HRFlowable(width="30%", thickness=1, color=BORDER, spaceAfter=6*mm, spaceBefore=2*mm))
story.append(Paragraph('Formation complete en 6 semaines \u2014 du niveau debutant<br/>a la creation de videos professionnelles pour les reseaux sociaux', s_cover_sub))
story.append(Paragraph('\u00ab Apprendre le montage video, puis transformer cette competence en opportunite \u00bb', s_cover_quote))
story.append(Spacer(1, 20*mm))
story.append(Paragraph(f'{BRAND} \u2014 Bamako, Mali', s_cover_footer))
story.append(PageBreak())

# ── SOMMAIRE ──
toc = TableOfContents()
toc.levelStyles = [s_toc_h1, s_toc_h2]
story.append(Paragraph('Sommaire', s_toc_title))
story.append(hr())
story.append(toc)
story.append(PageBreak())

# ── 1. INTRODUCTION ──
story.append(heading('1. Introduction et objectifs du programme', s_h1, 0))
story.append(hr())
story.append(Paragraph(
    'Ce programme accompagne les membres du groupe WhatsApp <b>Formation Montage Video</b> de '
    f'{BRAND} sur 6 semaines. L\'objectif est double : transmettre de vraies competences utilisables '
    'immediatement pour creer du contenu video professionnel, et creer une communaute engagee qui '
    f'devient ensuite un relais naturel pour les services payants de {BRAND} (montage professionnel, '
    'creation de contenu pour entreprises, pack de templates videos, formation avancee).', s_body))
story.append(Paragraph(
    'Chaque semaine, un module est envoye dans le groupe WhatsApp sous forme de messages detailles '
    'accompagnes de captures d\'ecran et d\'exemples concrets. Les membres pratiquent a leur rythme et '
    'partagent leurs realisations dans le groupe pour obtenir des retours personnalises. Cette methode '
    'a fait ses preuves : elle combine theorie accessible et pratique immediate pour une progression '
    'rapide et durable.', s_body))
story.append(Paragraph(
    'CapCut a ete choisi comme outil principal pour cette formation car il est <b>gratuit</b>, '
    '<b>disponible sur mobile et ordinateur</b>, et offre des fonctionnalites qui rivalisent avec '
    'les logiciels professionnels payants. Que vous souhaitiez creer du contenu pour TikTok, '
    'Instagram Reels, YouTube Shorts ou simplement ameliorer vos videos personnelles, ce programme '
    'vous donnera toutes les bases necessaires pour demarrer avec confiance et progresser rapidement.', s_body))

story.append(Spacer(1, 4*mm))
story.append(heading('Objectifs cles du programme', s_h2, 1))
for obj in [
    'Maitriser l\'interface et les fonctionnalites essentielles de CapCut en 6 semaines',
    'Savoir decouper, monter et organiser des clips video avec un rythme professionnel',
    'Utiliser les transitions, textes, effets visuels et filtres pour creer des videos percutantes',
    'Maitriser l\'audio : musique, effets sonores, mixage et synchronisation',
    'Savoir exporter des videos optimisees pour chaque plateforme sociale',
    'Realiser un projet video complet de A a Z comme portfolio personnel',
]:
    story.append(bullet(obj))

# ── 2. PROGRAMME DE FORMATION ──
story.append(heading('2. Programme de formation \u2014 6 semaines', s_h1, 0))
story.append(hr())
story.append(Paragraph(
    'Un module par semaine, envoye dans le groupe WhatsApp sous forme de message texte detaille '
    'accompagne de captures d\'ecran et de cas pratiques. Chaque semaine se termine par un exercice '
    'pratique corrige publiquement pour encourager l\'engagement du groupe et la progression de '
    'chaque membre.', s_body))

# SEMAINE 1
story.append(Spacer(1, 6*mm))
story.append(heading('Semaine 1 : Decouvrir CapCut et premiers pas', s_h2, 1))
story.extend(label_block('Objectif', 'Poser les fondations : maitriser l\'interface de CapCut, comprendre les zones essentielles et realiser les premieres manipulations sur la timeline.'))
story.extend(label_block('Contenu', ''))
for item in [
    'Presentation de CapCut : pourquoi cet outil et pas un autre (gratuit, multi-plateforme, professionnel)',
    'Decouverte de l\'interface : zone de previsualisation, timeline, barre d\'outils, panneau des medias',
    'Creer un nouveau projet et importer ses premiers medias (videos, images, audio)',
    'Naviguer sur la timeline : zoom, deplacement, selection et deplacement de clips',
    'Les formats supportes : MP4, MOV, AVI pour la video ; MP3, WAV pour l\'audio',
    'Organisation des medias : nommer ses fichiers, utiliser les dossiers et les favoris',
    'Raccourcis clavier essentiels (version bureau) pour accelerer le workflow',
]:
    story.append(bullet(item))
story.extend(label_block('Exercice pratique',
    'Creer un premier projet dans CapCut, importer 3 videos differentes et les organiser '
    'sur la timeline dans l\'ordre souhaite. Exporter le resultat et le partager dans le groupe.'))

# SEMAINE 2
story.append(Spacer(1, 6*mm))
story.append(heading('Semaine 2 : Les coupes et le rythme du montage', s_h2, 1))
story.extend(label_block('Objectif', 'Apprendre les techniques de coupe essentielles et comprendre comment donner du rythme a un montage en synchronisant les images avec la musique.'))
story.extend(label_block('Contenu', ''))
for item in [
    'La coupe simple : placer le curseur et couper un clip pour ne garder que les meilleures parties',
    'Le fractionnement multiple : decouper un clip en plusieurs segments pour isoler les extraits cles',
    'Le rognage et le recadrage : ajuster la duree et le cadre visuel de chaque clip',
    'Les ratios d\'aspect : 16:9 (YouTube), 9:16 (TikTok/Reels), 1:1 (Instagram), 4:5 (Feed)',
    'Techniques avancees : J-Cut (audio avant l\'image) et L-Cut (audio apres l\'image)',
    'Synchronisation sur la musique : identifier les temps forts et couper en rythme (beat sync)',
    'Le montage dynamique : varier la duree des plans pour creer du mouvement et maintenir l\'attention',
]:
    story.append(bullet(item))
story.extend(label_block('Exercice pratique',
    'Monter une video de 60 secondes maximum en synchronisant vos coupes sur une musique. '
    'Utilisez au moins 5 clips differents et 2 techniques de coupe differentes (coupe simple + J-Cut '
    'ou L-Cut). Partagez le resultat dans le groupe.'))

# SEMAINE 3
story.append(Spacer(1, 6*mm))
story.append(heading('Semaine 3 : Transitions, textes et sous-titres', s_h2, 1))
story.extend(label_block('Objectif', 'Enrichir les montages avec des transitions professionnelles, du texte percutant et des sous-titres automatiques pour maximiser l\'impact et l\'accessibilite des videos.'))
story.extend(label_block('Contenu', ''))
for item in [
    'Les transitions fondamentales : fondu au noir, fondu enchaine, cut direct, glissement',
    'Quand utiliser quelle transition : regles de coherence selon le ton de la video',
    'Les erreurs de transition a eviter : surcharge, incoherence, transitions trop extravagantes',
    'Ajouter du texte : titres, sous-titres, legendes avec personnalisation complete',
    'Choisir la bonne typographie : lisibilite, contraste, coherence avec le style de la video',
    'Les sous-titres automatiques par intelligence artificielle : generation, correction, styles',
    'Animations de texte : entree, boucle et sortie pour des titres dynamiques et memorables',
    'Les bonnes pratiques de texte : contraste avec le fond, duree d\'affichage, taille adaptee',
]:
    story.append(bullet(item))
story.extend(label_block('Exercice pratique',
    'Creer une video avec au minimum 3 types de transitions differents, un titre anime '
    'et des sous-titres automatiques corriges. La video doit etre coherente dans son style '
    'et lisible sur telephone sans son.'))

# SEMAINE 4
story.append(Spacer(1, 6*mm))
story.append(heading('Semaine 4 : Musique, effets sonores et mixage audio', s_h2, 1))
story.extend(label_block('Objectif', 'Maitriser la dimension sonore du montage : ajouter de la musique, utiliser des effets sonores percutants et equilibrer les niveaux audio pour un resultat professionnel.'))
story.extend(label_block('Contenu', ''))
for item in [
    'L\'importance de l\'audio : pourquoi le son represente 50% de l\'impact d\'une video',
    'La bibliotheque musicale de CapCut : categories, recherche, import de musique personnelle',
    'Ajouter et couper de la musique : synchronisation, fade in/fade out, ajustement du volume',
    'Les effets sonores : whoosh, pop, clap, clic \u2014 comment et quand les utiliser avec impact',
    'Le mixage audio : equilibrer voix, musique et effets sonores (niveaux recommandes en dB)',
    'Droits d\'auteur : comprendre les licences, utiliser la musique de la bibliotheque CapCut en toute securite',
    'L\'enregistrement voix off directement dans CapCut : technique et astuces de qualite',
]:
    story.append(bullet(item))
story.extend(label_block('Exercice pratique',
    'Monter une video de 90 secondes avec une musique de fond, au moins 4 effets sonores '
    'positionnes precisement, et une voix off ou un texte parle. Verifiez que la voix est '
    'toujours claire et comprehensible par-dessus la musique.'))

# SEMAINE 5
story.append(Spacer(1, 6*mm))
story.append(heading('Semaine 5 : Filtres, couleur et effets speciaux', s_h2, 1))
story.extend(label_block('Objectif', 'Maitriser l\'etalonnage couleur et les effets visuels pour transformer l\'apparence des videos et creer une identite visuelle coherente et professionnelle.'))
story.extend(label_block('Contenu', ''))
for item in [
    'Les filtres de CapCut : presets par categorie, ajustement d\'intensite, application selective',
    'Les ajustements manuels : luminosite, contraste, saturation, temperature, teinte, nettete',
    'Correction couleur vs etalonnage : corriger les problemes techniques puis appliquer un style creatif',
    'Les looks populaires : cinematique (teal & orange), retro, clean, moody, vibrant',
    'Les effets de vitesse : ralenti (slow motion), accelere, speed ramping (courbes de vitesse)',
    'Les keyframes (images cles) : animer la position, l\'echelle, l\'opacite et la rotation',
    'L\'ecran vert (Chroma Key) : principe, utilisation dans CapCut, astuces pour un fond propre',
    'L\'effet Glitch et autres effets speciaux : utilisation moderee et percutante',
]:
    story.append(bullet(item))
story.extend(label_block('Exercice pratique',
    'Appliquer un look cinematique coherent (correction + etalonnage) a une video complete. '
    'Ajoutez au moins un effet de vitesse variable et une animation par keyframe sur un texte '
    'ou un element. Partagez le resultat avant/apres dans le groupe.'))

# SEMAINE 6
story.append(Spacer(1, 6*mm))
story.append(heading('Semaine 6 : Projet final, export et bonnes pratiques', s_h2, 1))
story.extend(label_block('Objectif', 'Realiser un projet video complet de A a Z en appliquant toutes les competences acquises, et maitriser les parametres d\'export pour chaque plateforme.'))
story.extend(label_block('Contenu', ''))
for item in [
    'La regle des 3 secondes : captiver l\'attention des le debut de la video',
    'Le workflow organise : import, coupe grossiere, musique, textes, effets, couleur, export',
    'Les parametres d\'export : resolution (HD, Full HD, 4K), debit binaire, format MP4/H.264',
    'Optimiser pour chaque plateforme : YouTube (16:9), TikTok/Reels (9:16), Instagram (1:1 ou 4:5)',
    'Checklist avant publication : 8 points de verification obligatoires',
    'Les erreurs courantes a eviter : les 10 pieges qui font paraitre amateur',
    'Projet final : brief de projet complet avec suivi personnalise et retour collectif',
    'Perspectives d\'evolution : passer a Premiere Pro, DaVinci Resolve, ou monter son activite',
]:
    story.append(bullet(item))
story.extend(label_block('Exercice pratique',
    'Realiser un projet video complet de 2 minutes minimum pour la plateforme de votre choix. '
    'Le projet doit integrer : coupe au rythme, transitions coherentes, texte/sous-titres, '
    'musique et effets sonores, etalonnage couleur, et au moins un effet special. '
    'Publiez-le dans le groupe pour correction collective et mise en avant.'))

# ── 3. REGLES DU GROUPE ──
story.append(heading('3. Regles du groupe WhatsApp', s_h1, 0))
story.append(hr())
story.append(Paragraph(
    'Un cadre clair maintient la qualite du groupe et la credibilite de ' + BRAND + '. '
    'Ces regles garantissent un environnement d\'apprentissage sain, respectueux et productif '
    'pour tous les membres. Elles s\'appliquent a chacun, sans exception, et contribuent '
    'directement a la qualite de l\'experience de formation pour l\'ensemble du groupe.', s_body))
for item in [
    'Respect et bienveillance entre tous les membres, sans exception',
    'Pas de publicite pour d\'autres formations ou services sans autorisation prealable',
    'Les exercices se postent dans le fil dedie pour garder le groupe lisible et organise',
    'Les retours sont constructifs : critiquer le travail, jamais la personne',
    'Les membres inactifs pendant 2 semaines sans message peuvent etre retires du groupe',
    'Partagez vos realisations, vos progres et vos difficultes : c\'est ainsi que le groupe avance',
    'Les questions sont les bienvenues : il n\'y a pas de question idiote en montage video',
    'Respectez les horaires de publication des modules pour maintenir le rythme de la formation',
]:
    story.append(bullet(item))

# ── 4. CALENDRIER RECAPITULATIF ──
story.append(heading('4. Calendrier recapitulatif', s_h1, 0))
story.append(hr())
story.append(Paragraph(
    'Voici le planning complet de la formation sur 6 semaines. Chaque module est concu pour '
    'etre suivi en 2 a 3 heures de travail personnel, a votre rythme. Les exercices pratiques '
    'sont essentiels : c\'est en pratiquant regulierement que vous progresserez le plus vite.', s_body))
story.append(Spacer(1, 4*mm))

avail_w = PAGE_W - 2 * MARGIN
col_widths = [avail_w * 0.10, avail_w * 0.30, avail_w * 0.35, avail_w * 0.25]

cal_data = [
    [Paragraph('<b>Sem.</b>', s_table_header),
     Paragraph('<b>Module</b>', s_table_header),
     Paragraph('<b>Contenu principal</b>', s_table_header),
     Paragraph('<b>Action cle</b>', s_table_header)],
    [Paragraph('1', s_table_cell_c),
     Paragraph('Decouverte de CapCut', s_table_cell),
     Paragraph('Interface, import, timeline, navigation', s_table_cell),
     Paragraph('Creer un premier projet', s_table_cell)],
    [Paragraph('2', s_table_cell_c),
     Paragraph('Coupes et rythme', s_table_cell),
     Paragraph('Coupe, fractionnement, J-Cut/L-Cut, beat sync', s_table_cell),
     Paragraph('Video 60s synchronisee', s_table_cell)],
    [Paragraph('3', s_table_cell_c),
     Paragraph('Transitions et textes', s_table_cell),
     Paragraph('Transitions, texte anime, sous-titres auto', s_table_cell),
     Paragraph('Video avec 3 transitions + sous-titres', s_table_cell)],
    [Paragraph('4', s_table_cell_c),
     Paragraph('Audio et mixage', s_table_cell),
     Paragraph('Musique, effets sonores, mixage, voix off', s_table_cell),
     Paragraph('Video 90s avec voix + musique', s_table_cell)],
    [Paragraph('5', s_table_cell_c),
     Paragraph('Couleur et effets', s_table_cell),
     Paragraph('Filtres, etalonnage, vitesse, keyframes', s_table_cell),
     Paragraph('Look cinematique + effet special', s_table_cell)],
    [Paragraph('6', s_table_cell_c),
     Paragraph('Projet final', s_table_cell),
     Paragraph('Export, bonnes pratiques, projet complet', s_table_cell),
     Paragraph('Projet video 2 min complet', s_table_cell)],
]

cal_table = Table(cal_data, colWidths=col_widths, repeatRows=1)
cal_table.setStyle(TableStyle([
    # Header
    ('BACKGROUND', (0, 0), (-1, 0), HEADER_FILL),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('BOTTOMPADDING', (0, 0), (-1, 0), 8),
    ('TOPPADDING', (0, 0), (-1, 0), 8),
    # Rows
    ('BOTTOMPADDING', (0, 1), (-1, -1), 6),
    ('TOPPADDING', (0, 1), (-1, -1), 6),
    ('LEFTPADDING', (0, 0), (-1, -1), 8),
    ('RIGHTPADDING', (0, 0), (-1, -1), 8),
    # Stripe
    ('BACKGROUND', (0, 1), (-1, 1), colors.white),
    ('BACKGROUND', (0, 2), (-1, 2), TABLE_STRIPE),
    ('BACKGROUND', (0, 3), (-1, 3), colors.white),
    ('BACKGROUND', (0, 4), (-1, 4), TABLE_STRIPE),
    ('BACKGROUND', (0, 5), (-1, 5), colors.white),
    ('BACKGROUND', (0, 6), (-1, 6), TABLE_STRIPE),
    # Grid
    ('GRID', (0, 0), (-1, -1), 0.5, BORDER),
    ('LINEBELOW', (0, 0), (-1, 0), 1.5, HEADER_FILL),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('ROUNDEDCORNERS', [4, 4, 4, 4]),
]))
story.append(cal_table)

# ── 5. PASSER AU NIVEAU SUPERIEUR ──
story.append(Spacer(1, 6*mm))
story.append(heading('5. Passer au niveau superieur', s_h1, 0))
story.append(hr())
story.append(Paragraph(
    f'Apres avoir complete cette formation de 6 semaines, vous aurez toutes les bases pour creer '
    'des videos professionnelles avec CapCut. Mais le montage video est un domaine qui evolue '
    'constamment, et il existe toujours de nouvelles techniques a decouvrir et de nouvelles competences '
    f'a acquerir. {BRAND} propose des avancees pour les membres les plus motives.', s_body))
story.append(Paragraph(
    'La <b>formation Premium Montage Video</b> vous permet d\'aller plus loin avec des outils '
    'professionnels comme Adobe Premiere Pro et DaVinci Resolve. Vous apprendrez des techniques '
    'avancees de montage, d\'etalonnage cinema, de compositing et d\'effets visuels qui vous '
    'ouvriront de nouvelles opportunites professionnelles. Cette formation est ideale si vous '
    'souhaitez faire du montage votre metier ou offrir des services de qualite superieure a vos clients.', s_body))
story.append(Paragraph(
    'Vous pouvez egalement explorer les autres formations de Studio Creatif : <b>Design Graphique</b> '
    'pour maitriser Canva, Photoshop et Illustrator ; <b>Creation Web</b> pour apprendre a construire '
    'des sites web professionnels ; et <b>Marketing Digital</b> pour developper votre presence en ligne '
    'et attirer des clients. Chaque formation suit la meme methode pedagogique en 6 semaines, '
    'avec des exercices pratiques et un suivi personnalise dans le groupe WhatsApp.', s_body))

story.append(Spacer(1, 4*mm))
story.extend(label_block('Contact', f'Pour toute question ou pour vous inscrire a la formation Premium, '
    f'contactez-nous directement sur WhatsApp.'))

# ━━ Build PDF ━━
doc = TocDocTemplate(
    OUTPUT,
    pagesize=A4,
    leftMargin=MARGIN, rightMargin=MARGIN,
    topMargin=MARGIN, bottomMargin=MARGIN,
    title='Programme de Formation Montage Video avec CapCut - Studio Creatif',
    author='Studio Creatif',
    subject='Formation Montage Video CapCut - 6 Semaines',
)

# First page = cover (no header/footer)
# Remaining pages = content (with header/footer)
doc.multiBuild(story, onFirstPage=cover_template, onLaterPages=page_header_footer)

print(f'PDF genere avec succes : {OUTPUT}')
print(f'Pages : {doc._page_count}')