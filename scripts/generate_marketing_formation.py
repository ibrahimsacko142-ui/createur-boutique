#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Programme de Formation : Marketing Digital - Studio Creatif"""

import os, sys, hashlib
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm, cm
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
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
OUTPUT = '/home/z/my-project/download/ebooks/Programme_Formation_Marketing_Digital.pdf'
BRAND = 'Studio Creatif'; FORMATION = 'Formation Marketing Digital'

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

def phf(c,d):
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
story.append(Paragraph('Marketing Digital<br/>et Reseaux Sociaux',s_ct))
story.append(HRFlowable(width="30%",thickness=1,color=BORDER,spaceAfter=6*mm,spaceBefore=2*mm))
story.append(Paragraph('Formation complete en 6 semaines \u2014 du niveau debutant<br/>a la strategie digitale complete pour attirer des clients',s_cs))
story.append(Paragraph('\u00ab Apprendre le marketing digital, puis transformer cette competence en revenus \u00bb',s_cq))
story.append(Spacer(1,20*mm))
story.append(Paragraph(f'{BRAND} \u2014 Bamako, Mali',s_cf))
story.append(PageBreak())

# SOMMAIRE
toc=TableOfContents();toc.levelStyles=[s_t1,s_t2]
story.append(Paragraph('Sommaire',s_tt)); story.append(hr()); story.append(toc); story.append(PageBreak())

# 1. INTRO
story.append(hd('1. Introduction et objectifs du programme',s_h1,0)); story.append(hr())
story.append(Paragraph(f'Ce programme accompagne les membres du groupe WhatsApp <b>Formation Marketing Digital</b> de {BRAND} sur 6 semaines. L\'objectif est double : transmettre de vraies competences en marketing digital utilisables immediatement pour promouvoir une activite en ligne, et creer une communaute engagee qui devient ensuite un relais naturel pour les services payants de {BRAND} (strategie digitale complete, gestion de reseaux sociaux pour entreprises, publicite en ligne, creation de contenu).',s_b))
story.append(Paragraph('Chaque semaine, un module est envoye dans le groupe WhatsApp sous forme de messages detailles accompagnes de cas pratiques et d\'exemples concrets adaptes au contexte malien et africain. Les membres pratiquent a leur rythme et partagent leurs resultats pour obtenir des retours personnalises. Le marketing digital est devenu indispensable pour toute entreprise ou entrepreneur qui souhaite se developper et atteindre ses clients potentiels.',s_b))

story.append(hd('Objectifs cles du programme',s_h2,1))
for o in [
    'Comprendre les fondamentaux du marketing digital et son role dans la croissance d\'une activite',
    'Maitriser les principales plateformes sociales : Facebook, Instagram, TikTok, WhatsApp Business',
    'Savoir creer une strategie de contenu adaptee a son secteur et son public cible',
    'Comprendre les bases de la publicite payante (Facebook Ads) et du SEO',
    'Maitriser l\'analyse des performances avec les statistiques des plateformes',
    'Realiser un plan marketing digital complet applicable immediatement a son activite',
]:
    story.append(bu(o))

# 2. PROGRAMME
story.append(hd('2. Programme de formation \u2014 6 semaines',s_h1,0)); story.append(hr())
story.append(Paragraph('Un module par semaine, envoye dans le groupe WhatsApp sous forme de message texte detaille accompagne de cas pratiques. Chaque semaine se termine par un exercice pratique corrige publiquement.',s_b))

# S1
story.append(hd('Semaine 1 : Les fondamentaux du marketing digital',s_h2,1))
story.extend(lb('Objectif','Comprendre les bases du marketing digital, definir son public cible et poser les fondations d\'une strategie en ligne efficace.'))
story.extend(lb('Contenu',''))
for i in [
    'Qu\'est-ce que le marketing digital et pourquoi est-il indispensable en 2025',
    'La difference entre marketing traditionnel et marketing digital (avantages et specificites)',
    'Definir son public cible : buyer persona, age, localisation, centres d\'interet, problemes',
    'Les canaux digitaux principaux : reseaux sociaux, site web, WhatsApp, e-mail, Google',
    'L\'importance d\'une identite de marque coherente en ligne (nom, photo, bio, style visuel)',
    'Les objectifs marketing : notoriete, engagement, conversion, fidelisation (avec indicateurs)',
    'Etude de cas : analyse de 3 marques maliennes qui reussissent sur les reseaux sociaux',
]:
    story.append(bu(i))
story.extend(lb('Exercice pratique','Redigez votre buyer persona detaille (profil type de votre client ideal) et optimisez votre profil professionnel sur une plateforme sociale. Partagez les deux dans le groupe.'))

# S2
story.append(hd('Semaine 2 : Maitriser les reseaux sociaux',s_h2,1))
story.extend(lb('Objectif','Maitriser les specificites de chaque plateforme sociale et savoir adapter son contenu pour maximiser la portee et l\'engagement.'))
story.extend(lb('Contenu',''))
for i in [
    'Facebook : page professionnelle, groupe, format des posts, algorithme de portee',
    'Instagram : post, story, reel, IGTV, guide, la bio comme outil de conversion',
    'TikTok : format vertical, tendances, musique, hashtags, algorithme de recommandation',
    'WhatsApp Business : catalogue de produits, messages automatiques, etiquettes clients',
    'LinkedIn : profil professionnel, publications, reseautage (pour les activites B2B)',
    'Les bonnes pratiques communes : horaires de publication, frequence, interaction avec les commentaires',
    'Les erreurs fatales a eviter sur chaque plateforme',
]:
    story.append(bu(i))
story.extend(lb('Exercice pratique','Choisissez 2 plateformes adaptees a votre activite. Creez ou optimisez vos profils et publiez 3 contenus differents sur chaque plateforme (post, story, reel ou video courte). Partagez les liens dans le groupe.'))

# S3
story.append(hd('Semaine 3 : Strategie de contenu',s_h2,1))
story.extend(lb('Objectif','Apprendre a creer une strategie de contenu coherente qui attire, engage et convertit votre audience en clients.'))
story.extend(lb('Contenu',''))
for i in [
    'Le calendrier editorial : planifier ses publications a l\'avance (semaine ou mois)',
    'Les types de contenu qui fonctionnent : tutoriels, temoignages, coulisses, avant/apres, tendances',
    'L\'art du copywriting digital : ecrire des accroches qui captent l\'attention en 3 secondes',
    'Les hashtags : comment choisir les bons hashtags pour maximiser la portee de ses publications',
    'Le storytelling : raconter une histoire qui engage et cree un lien emotionnel avec l\'audience',
    'Le user-generated content : encourager ses clients a partager leurs experiences',
    'Repurposer du contenu : transformer un post en reel, un reel en story, un article en post',
]:
    story.append(bu(i))
story.extend(lb('Exercice pratique','Creez un calendrier editorial d\'une semaine (7 jours) avec un type de contenu et une accroche pour chaque jour. Publiez au moins 3 contenus en suivant ce calendrier et partagez vos statistiques d\'engagement dans le groupe.'))

# S4
story.append(hd('Semaine 4 : Publicite en ligne et SEO',s_h2,1))
story.extend(lb('Objectif','Comprendre les bases de la publicite payante et du referencement naturel pour attirer du trafic qualifie vers son activite.'))
story.extend(lb('Contenu',''))
for i in [
    'Introduction a la publicite en ligne : CPC, CPM, portee, clics, conversions',
    'Facebook Ads : creer sa premiere campagne publicitaire (objectif, audience, budget, creatif)',
    'Le ciblage publicitaire : localisation, age, interets, lookalike audience (audience similaire)',
    'Le budget publicitaire : comment definir un budget debutant et optimiser ses depenses',
    'Le SEO de base (referencement naturel) : mots-cles, titre, description, structure de contenu',
    'Google My Business : inscrire son entreprise sur Google pour etre visible localement',
    'Mesurer le retour sur investissement (ROI) de ses actions marketing',
]:
    story.append(bu(i))
story.extend(lb('Exercice pratique','Creez une campagne publicitaire Facebook (meme sans la lancer) : definissez l\'objectif, la cible, le budget et le visuel. Inscrivez egalement votre activite sur Google My Business. Partagez les captures d\'ecran dans le groupe.'))

# S5
story.append(hd('Semaine 5 : Analyser et optimiser ses performances',s_h2,1))
story.extend(lb('Objectif','Maitriser les outils d\'analyse pour comprendre ce qui fonctionne, identifier les axes d\'amelioration et prendre des decisions basees sur les donnees.'))
story.extend(lb('Contenu',''))
for i in [
    'Les statistiques Instagram : portee, impressions, engagement, abonnes, profil de l\'audience',
    'Les statistiques Facebook : portee des pages, performance des posts, insights d\'audience',
    'Les statistiques TikTok : vues, temps de visionnage, profil des spectateurs, tendances',
    'Les indicateurs cles (KPI) a suivre : taux d\'engagement, portee organique, taux de conversion',
    'Comment lire et interpreter les donnees : identifier les contenus qui performent le mieux',
    'L\'A/B testing : tester deux versions d\'un contenu pour voir laquelle performe le mieux',
    'Optimiser sa strategie en fonction des resultats : pivoter, doubler ou abandonner',
]:
    story.append(bu(i))
story.extend(lb('Exercice pratique','Analysez les statistiques de vos 2 plateformes sur les 2 dernieres semaines. Redigez un mini rapport avec : votre meilleur contenu, votre pire contenu, 3 actions d\'amelioration concretes. Partagez le rapport dans le groupe.'))

# S6
story.append(hd('Semaine 6 : Plan marketing complet et perspectives',s_h2,1))
story.extend(lb('Objectif','Realiser un plan marketing digital complet applicable immediatement et comprendre les perspectives d\'evolution vers le marketing avance.'))
story.extend(lb('Contenu',''))
for i in [
    'Construire un plan marketing digital : objectifs, strategie, tactiques, calendrier, budget, KPI',
    'L\'automatisation marketing : outils gratuits pour planifier et programmer ses publications',
    'Le marketing d\'influence : identifier et collaborer avec des influenceurs locaux',
    'L\'e-mail marketing : outils gratuits (Mailchimp), structure d\'un e-mail, taux d\'ouverture',
    'Presentation de la formation Premium Marketing Digital : strategie complete, publicite avancee, analytics',
    'Bilan de la formation : questionnaire de satisfaction et orientations individuelles',
]:
    story.append(bu(i))
story.extend(lb('Exercice pratique','Redigez votre plan marketing digital complet sur 1 page (objectifs, 2 plateformes choisies, calendrier mensuel, budget previsionnel, 3 KPI a suivre). Publiez-le dans le groupe pour retour et mise en avant des meilleurs plans.'))

# 3. REGLES
story.append(hd('3. Regles du groupe WhatsApp',s_h1,0)); story.append(hr())
story.append(Paragraph(f'Un cadre clair maintient la qualite du groupe et la credibilite de {BRAND}.',s_b))
for r in [
    'Respect et bienveillance entre tous les membres, sans exception',
    'Pas de publicite pour d\'autres formations ou services sans autorisation prealable',
    'Les exercices se postent dans le fil dedie pour garder le groupe lisible',
    'Les retours sont constructifs : critiquer le travail, jamais la personne',
    'Les membres inactifs pendant 2 semaines sans message peuvent etre retires du groupe',
    'Partagez vos resultats, vos statistiques et vos questions : c\'est ainsi que le groupe avance',
]:
    story.append(bu(r))

# 4. CALENDRIER
story.append(hd('4. Calendrier recapitulatif',s_h1,0)); story.append(hr())
story.append(Paragraph('Voici le planning complet de la formation sur 6 semaines. Chaque module necessite 2 a 3 heures de travail personnel.',s_b))
story.append(Spacer(1,4*mm))

aw=PAGE_W-2*MARGIN; cw=[aw*0.10,aw*0.30,aw*0.35,aw*0.25]
cd=[
    [Paragraph('<b>Sem.</b>',s_th),Paragraph('<b>Module</b>',s_th),Paragraph('<b>Contenu principal</b>',s_th),Paragraph('<b>Action cle</b>',s_th)],
    [Paragraph('1',s_tcc),Paragraph('Fondamentaux',s_tc),Paragraph('Marketing digital, buyer persona, identite, objectifs',s_tc),Paragraph('Buyer persona + profil optimise',s_tc)],
    [Paragraph('2',s_tcc),Paragraph('Reseaux sociaux',s_tc),Paragraph('Facebook, Instagram, TikTok, WhatsApp Business, LinkedIn',s_tc),Paragraph('3 contenus sur 2 plateformes',s_tc)],
    [Paragraph('3',s_tcc),Paragraph('Strategie de contenu',s_tc),Paragraph('Calendrier, copywriting, hashtags, storytelling',s_tc),Paragraph('Calendrier editorial 7 jours',s_tc)],
    [Paragraph('4',s_tcc),Paragraph('Publicite et SEO',s_tc),Paragraph('Facebook Ads, ciblage, budget, SEO, Google My Business',s_tc),Paragraph('Campagne + inscription Google',s_tc)],
    [Paragraph('5',s_tcc),Paragraph('Analyse et optimisation',s_tc),Paragraph('Statistiques, KPI, A/B testing, prise de decision',s_tc),Paragraph('Mini rapport d\'analyse',s_tc)],
    [Paragraph('6',s_tcc),Paragraph('Plan complet',s_tc),Paragraph('Plan marketing, automatisation, influence, e-mail, bilan',s_tc),Paragraph('Plan marketing 1 page',s_tc)],
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
story.append(Paragraph(f'Apres cette formation, vous aurez les bases pour promouvoir n\'importe quelle activite en ligne. Pour aller plus loin, {BRAND} propose la <b>formation Premium Marketing Digital</b> avec une strategie complete incluant la publicite avancee, l\'analytics detaille, le marketing d\'influence, l\'e-mail marketing automatise et la creation de funnels de vente. Cette formation est ideale pour devenir community manager professionnel ou gerer la communication digitale d\'une entreprise.',s_b))
story.append(Paragraph(f'Explorez egalement les autres formations de {BRAND} : <b>Design Graphique</b> avec Canva, <b>Montage Video</b> avec CapCut, et <b>Creation Web</b> pour construire votre site. Chaque formation suit la meme methode en 6 semaines.',s_b))
story.extend(lb('Contact','Pour toute question ou pour vous inscrire a la formation Premium, contactez-nous directement sur WhatsApp.'))

doc=TocDoc(OUTPUT,pagesize=A4,leftMargin=MARGIN,rightMargin=MARGIN,topMargin=MARGIN,bottomMargin=MARGIN,
    title='Programme de Formation Marketing Digital - Studio Creatif',author='Studio Creatif',
    subject='Formation Marketing Digital Reseaux Sociaux - 6 Semaines')
doc.multiBuild(story,onFirstPage=cpt,onLaterPages=phf)
print(f'OK: {OUTPUT}')