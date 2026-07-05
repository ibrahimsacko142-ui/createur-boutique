#!/usr/bin/env python3
"""Génère les ebooks PDF pour les formations Studio Créatif - Sacko"""

import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm, mm
from reportlab.lib.colors import HexColor, white, black
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY, TA_RIGHT
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, HRFlowable, KeepTogether
)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.graphics.shapes import Drawing, Rect, String, Line
from reportlab.graphics import renderPDF

# ─── FONTS ───
pdfmetrics.registerFont(TTFont('Carlito', '/usr/share/fonts/truetype/english/Carlito-Regular.ttf'))
pdfmetrics.registerFont(TTFont('Carlito-Bold', '/usr/share/fonts/truetype/english/Carlito-Bold.ttf'))
# Tinos is TTC (collection), use Carlito for body instead

W, H = A4
MARGIN = 2 * cm

# ─── COLORS ───
COLORS = {
    'design': {'primary': '#E11D48', 'secondary': '#F43F5E', 'accent': '#FFF1F2', 'gradient': ['#E11D48', '#F43F5E', '#FB7185']},
    'video': {'primary': '#7C3AED', 'secondary': '#8B5CF6', 'accent': '#F5F3FF', 'gradient': ['#7C3AED', '#8B5CF6', '#A78BFA']},
    'web': {'primary': '#2563EB', 'secondary': '#3B82F6', 'accent': '#EFF6FF', 'gradient': ['#2563EB', '#3B82F6', '#60A5FA']},
    'marketing': {'primary': '#0891B2', 'secondary': '#06B6D4', 'accent': '#ECFEFF', 'gradient': ['#0891B2', '#06B6D4', '#22D3EE']},
    'default': {'primary': '#D97706', 'secondary': '#F59E0B', 'accent': '#FFFBEB', 'gradient': ['#D97706', '#F59E0B', '#FBBF24']},
}

# ─── FORMATIONS DATA ───
FORMATIONS = [
    {
        'key': 'design',
        'title': 'Devenir Designer Pro',
        'subtitle': 'avec Canva & Illustrator',
        'price': '5 000',
        'duration': '6h',
        'lessons': '9 lecons',
        'level': 'Debutant',
        'icon': 'DESIGN',
        'color_key': 'design',
        'intro': (
            "Le design graphique est aujourd'hui l'une des competences les plus recherchees au Mali et en Afrique de l'Ouest. "
            "Chaque boutique, chaque entreprise, chaque entrepreneur a besoin d'une identite visuelle forte pour se démarquer. "
            "Avec cette formation, vous allez apprendre a creer des logos professionnels, des visuels pour les reseaux sociaux, "
            "des cartes de visite, des affiches et bien plus encore, en utilisant Canva et Adobe Illustrator."
        ),
        'chapitres': [
            {
                'titre': 'Chapitre 1 : Les bases du design graphique',
                'contenu': (
                    "Avant de commencer a creer, il faut comprendre les fondamentaux. Dans ce chapitre, vous allez decouvrir "
                    "les principes essentiels du design : la typographie, les couleurs, la hierarchie visuelle et l'equilibre. "
                    "Vous apprendrez a lire une image, a identifier ce qui rend un visuel professionnel ou amateur, et a "
                    "comprendre pourquoi certaines compositions attirent l'oeil tandis que d'autres passent inapercues.\n\n"
                    "Nous verrons aussi comment choisir les bonnes polices de caracteres, comment creer des palettes de couleurs "
                    "harmonieuses, et comment utiliser l'espace negatif pour donner de la respiration a vos creations. "
                    "Ces bases sont indispensables pour tous les chapitres qui suivent."
                ),
            },
            {
                'titre': 'Chapitre 2 : Maitriser Canva comme un pro',
                'contenu': (
                    "Canva est l'outil le plus accessible pour commencer en design, mais la plupart des utilisateurs n'exploitent "
                    "que 10% de ses possibilites. Dans ce chapitre, vous allez apprendre a utiliser les fonctionnalites avancees : "
                    "les templates personnalises, les elements graphiques pro, la gestion des calques, les effets de texture et "
                    "les animations.\n\n"
                    "Vous saurez creer des visuels aux dimensions exactes pour chaque plateforme (Facebook, Instagram, TikTok, "
                    "WhatsApp Status), utiliser la fonction de redimensionnement automatique, et organiser votre espace de travail "
                    "pour etre plus efficace. Nous creerons ensemble 5 projets pratiques : un logo, une affiche, un post Instagram, "
                    "une story et une carte de visite."
                ),
            },
            {
                'titre': 'Chapitre 3 : Introduction a Adobe Illustrator',
                'contenu': (
                    "Pour passer au niveau superieur, Illustrator est l'outil incontournable des professionnels. Vous y "
                    "apprendrez le dessin vectoriel, les formes complexes, les chemins de decoupe et l'export de fichiers "
                    "sources. Contrairement a Canva, Illustrator vous donne un controle total sur chaque pixel et chaque courbe.\n\n"
                    "Ce chapitre couvre l'interface, les outils de selection et de dessin, la creation de logos vectoriels "
                    "detailles, la gestion des couleurs CMJN pour l'impression, et l'export en plusieurs formats (AI, EPS, "
                    "SVG, PNG haute resolution). Vous comprendrez la difference entre image vectorielle et bitmap, et pourquoi "
                    "les professionnels utilisent les deux selon les situations."
                ),
            },
            {
                'titre': 'Chapitre 4 : Creer une identite visuelle complete',
                'contenu': (
                    "Un logo seul ne suffit pas. Une vraie identite visuelle comprend une charte graphique complete : couleurs "
                    "principales et secondaires, typographies, variations du logo (couleur, noir et blanc, icone seule), "
                    "et regles d'utilisation. C'est ce qui separe un designer amateur d'un professionnel.\n\n"
                    "Dans ce chapitre, vous allez creer de A a Z l'identite visuelle d'une entreprise fictive : le logo, "
                    "la palette de couleurs, les typographies, les applications pratiques (carte de visite, papeterie, "
                    "couverture de reseaux sociaux). Vous aurez un portfolio concret a montrer a vos futurs clients."
                ),
            },
            {
                'titre': 'Chapitre 5 : Trouver des clients et gagner de l argent',
                'contenu': (
                    "Avoir les competences ne suffit pas si vous ne savez pas comment les vendre. Ce chapitre est entierement "
                    "dedie a la commercialisation de vos services de design. Vous apprendrez a fixer vos prix selon le marche "
                    "malien, a presenter votre portfolio de maniere professionnelle, et a utiliser WhatsApp et les reseaux "
                    "sociaux comme outils de prospection.\n\n"
                    "Nous couvrirons les techniques pour repondre aux demandes de clients, gerer les revisions, livrer les "
                    "fichiers sources, et construire une reputation qui vous amenera des recommandations. Vous comprendrez "
                    "pourquoi la premiere commande gratuite (Offre Decouverte) est la meilleure strategie pour fideliser "
                    "vos clients a long terme."
                ),
            },
        ],
    },
    {
        'key': 'video',
        'title': 'Videos pour Reseaux Sociaux',
        'subtitle': 'Creer et monetiser',
        'price': '7 500',
        'duration': '8h',
        'lessons': '15 lecons',
        'level': 'Intermediaire',
        'icon': 'VIDEO',
        'color_key': 'video',
        'intro': (
            "La video est le format le plus consomme sur Internet en 2024. Sur Instagram, TikTok et YouTube, les contenus "
            "video generent jusqu'a 10 fois plus d'engagement que les images. Au Mali, de plus en plus d'entrepreneurs "
            "comprennent qu'ils ont besoin de videos professionnelles pour promouvoir leurs activites, mais ils ne savent "
            "pas comment les creer. C'est une opportunite enorme pour vous."
        ),
        'chapitres': [
            {
                'titre': 'Chapitre 1 : Les bases du montage video',
                'contenu': (
                    "Ce chapitre introduit les concepts fondamentaux du montage : les plans, les transitions, le rythme, "
                    "et la narration visuelle. Vous comprendrez la difference entre un plan d'ensemble, un plan moyen et un "
                    "gros plan, et quand utiliser chacun. Nous verrons aussi les formats video les plus demandes sur chaque "
                    "plateforme : reel Instagram (9:16), video YouTube (16:9), story (9:16), et post carre (1:1).\n\n"
                    "Vous apprendrez a organiser vos rushes, a faire un pre-montage rapide, et a structurer votre video "
                    "pour captiver l'attention des spectateurs des les 3 premieres secondes."
                ),
            },
            {
                'titre': 'Chapitre 2 : Maitriser CapCut Pro',
                'contenu': (
                    "CapCut est l'outil de montage le plus populaire pour les reseaux sociaux. Dans ce chapitre, vous allez "
                    "aller bien au-dela des fonctionnalites de base. Vous apprendrez le montage multi-pistes, les keyframes "
                    "pour les animations, les effets visuels avancees (glitch, zoom dynamique, transitions fluides), et le "
                    "calibrage couleur pour donner un look professionnel a vos videos.\n\n"
                    "Nous verrons comment ajouter des sous-titres dynamiques (tres demandes en 2024), comment synchroniser "
                    "les coupes avec la musique, comment utiliser les templates de CapCut comme point de depart puis les "
                    "personnaliser, et comment exporter dans la bonne qualite pour chaque plateforme."
                ),
            },
            {
                'titre': 'Chapitre 3 : Techniques avancees et effets speciaux',
                'contenu': (
                    "Ce chapitre est destine a ceux qui veulent se demarquer avec des effets visuels impressionnants. "
                    "Vous apprendrez le motion tracking (suivi de mouvement), le compositing (superposition d'images), "
                    "les animations de texte cinematographiques, et les transitions avancees entre les scenes.\n\n"
                    "Nous verrons aussi comment creer des intros et outros personnalises pour vos videos ou celles de vos "
                    "clients, comment utiliser les masks et les blend modes pour des effets uniques, et comment stabiliser "
                    "les videos tournees au telephone pour un rendu professionnel."
                ),
            },
            {
                'titre': 'Chapitre 4 : Strategies de contenu viral',
                'contenu': (
                    "Creer de belles videos ne suffit pas. Il faut aussi comprendre les algorithmes des plateformes pour "
                    "maximiser la portee de vos contenus. Ce chapitre couvre les strategies de contenu qui fonctionnent sur "
                    "Instagram, TikTok et YouTube en 2024 : les hooks (accroches) puissantes, les premieres 3 secondes "
                    "cruciales, la structure narratif qui retient l'attention, et les appels a l'action efficaces.\n\n"
                    "Vous apprendrez a analyser les statistiques de vos videos, a identifier ce qui fonctionne et pourquoi, "
                    "et a adapter votre strategie en consequence. Nous verrons aussi le calendrier de publication optimal "
                    "et comment repurposer une meme video pour plusieurs plateformes."
                ),
            },
            {
                'titre': 'Chapitre 5 : Monetiser ses competences video',
                'contenu': (
                    "Les competences en montage video sont tres demandees au Mali. Les boutiques, les restaurants, les "
                    "artistes, les influenceurs et les entreprises ont tous besoin de contenu video regulier. Ce chapitre "
                    "vous montre comment transformer cette demande en revenus.\n\n"
                    "Vous apprendrez a calculer vos prix (par video, par pack mensuel, par projet), a gerer plusieurs "
                    "clients en parallele, a creer des contrats simples, et a utiliser les temoignages de vos premiers "
                    "clients pour en attirer de nouveaux. Nous verrons aussi comment monter votre propre chaine ou compte "
                    "pour demontrer votre expertise et attirer des clients organiquement."
                ),
            },
        ],
    },
    {
        'key': 'web',
        'title': 'Site Web Professionnel',
        'subtitle': 'No-code + Next.js',
        'price': '10 000',
        'duration': '10h',
        'lessons': '12 lecons',
        'level': 'Intermediaire',
        'icon': 'WEB',
        'color_key': 'web',
        'intro': (
            "Avoir un site web professionnel n'est plus un luxe, c'est une necessite. Au Mali, plus de 60% des "
            "consommateurs recherchent des informations sur Internet avant de faire un achat. Si votre entreprise "
            "n'est pas en ligne, vous perdez des clients chaque jour. Cette formation vous donne les competences pour "
            "creer des sites web modernes, rapides et optimises, du simple no-code au developpement avec Next.js."
        ),
        'chapitres': [
            {
                'titre': 'Chapitre 1 : Introduction au developpement web',
                'contenu': (
                    "Ce chapitre pose les fondations : HTML, CSS et JavaScript, les trois langages du web. Vous comprendrez "
                    "comment une page web est construite, comment le navigateur interprete le code, et pourquoi la vitesse "
                    "de chargement est cruciale. Pas besoin d'etre un geek pour comprendre - chaque concept est explique "
                    "avec des exemples concrets et des analogies simples.\n\n"
                    "Nous verrons aussi les differents types de sites web (landing page, site vitrine, e-commerce, blog) "
                    "et comment choisir le bon type selon votre activite. Vous apprendrez a lire et modifier du code HTML/CSS "
                    "basique, ce qui sera indispensable pour personnaliser vos creations."
                ),
            },
            {
                'titre': 'Chapitre 2 : Creer un site sans coder (No-code)',
                'contenu': (
                    "Vous n'avez pas besoin de savoir programmer pour creer un site professionnel. Ce chapitre vous montre "
                    "comment utiliser les plateformes no-code les plus efficaces pour creer des sites vitrines, des landing "
                    "pages et des portfolios en quelques heures. Nous couvrirons les meilleures pratiques de design web, "
                    "l'optimisation mobile, et la mise en ligne.\n\n"
                    "Vous apprendrez a choisir un nom de domaine pertinent, a configurer l'hebergement, a installer un "
                    "certificat SSL (le petit cadenas vert dans la barre d'adresse), et a soumettre votre site a Google "
                    "pour qu'il apparaisse dans les resultats de recherche locaux."
                ),
            },
            {
                'titre': 'Chapitre 3 : Initiation a Next.js et React',
                'contenu': (
                    "Pour ceux qui veulent aller plus loin et creer des applications web puissantes, ce chapitre introduit "
                    "Next.js, le framework JavaScript le plus populaire en 2024. Vous apprendrez les composants React, "
                    "le routage, la gestion des donnees, et le deploiement automatique sur Vercel.\n\n"
                    "Chaque concept est illustre par un projet pratique. A la fin de ce chapitre, vous serez capable de "
                    "creer un site multi-pages avec navigation, formulaire de contact, et optimisation pour les moteurs "
                    "de recherche (SEO). Vous comprendrez pourquoi les grandes entreprises comme Netflix, TikTok et Uber "
                    "utilisent cette technologie."
                ),
            },
            {
                'titre': 'Chapitre 4 : SEO et referencement local',
                'contenu': (
                    "Un beau site ne sert a rien si personne ne le trouve. Ce chapitre est entierement consacre au SEO "
                    "(Search Engine Optimization) et au referencement local, essentiels pour les entreprises au Mali. "
                    "Vous apprendrez a optimiser vos pages pour Google, a utiliser Google My Business, et a apparaitre "
                    "dans les resultats de recherche locaux.\n\n"
                    "Nous verrons les mots-cles pertinents pour le marche malien, comment structurer vos pages pour un "
                    "bon referencement, comment obtenir des backlinks, et comment suivre vos positions dans Google avec "
                    "des outils gratuits. Vous comprendrez la difference entre SEO on-page et off-page, et comment "
                    "utiliser les reseaux sociaux pour booster votre visibilite en ligne."
                ),
            },
            {
                'titre': 'Chapitre 5 : Vendre ses services de creation web',
                'contenu': (
                    "Le marche de la creation web au Mali est en pleine croissance. Les entreprises comprennent qu'elles "
                    "doivent etre en ligne, mais elles n'ont pas les competences en interne. Ce chapitre vous montre "
                    "comment positionner vos services, calculer vos tarifs, et gerer des projets web complets de A a Z.\n\n"
                    "Vous apprendrez a faire un devis clair et professionnel, a gerer les expectations du client, a planifier "
                    "les livrables, et a assurer la maintenance apres livraison. Nous verrons aussi comment utiliser les "
                    "temoignages et les etudes de cas pour convaincre de nouveaux clients, et comment differencier vos "
                    "services de la concurrence."
                ),
            },
        ],
    },
    {
        'key': 'marketing',
        'title': 'Community Manager PME',
        'subtitle': 'Devenir Community Manager',
        'price': '6 000',
        'duration': '7h',
        'lessons': '10 lecons',
        'level': 'Debutant',
        'icon': 'MARKETING',
        'color_key': 'marketing',
        'intro': (
            "Les petites et moyennes entreprises (PME) du Mali perdent des milliers de clients chaque mois parce qu'elles "
            "ne savent pas utiliser les reseaux sociaux. Elles publient des fois en fois, sans strategie, sans "
            "regularite, et sans mesurer les resultats. En devenant Community Manager, vous etes la personne qui "
            "resout ce probleme - et c'est une competence tres bien payee."
        ),
        'chapitres': [
            {
                'titre': 'Chapitre 1 : Le role du Community Manager',
                'contenu': (
                    "Un Community Manager ne fait pas que publier des photos. C'est un strategiste digital qui gere la "
                    "presence en ligne d'une entreprise, cree du contenu engageant, interagit avec la communaute, analyse "
                    "les performances, et ajuste la strategie en continu. Ce chapitre detaille le quotidien d'un CM, "
                    "les competences requises, et les outils indispensables.\n\n"
                    "Vous comprendrez la difference entre un Community Manager et un social media manager, comment organiser "
                    "votre journee de travail, et comment gerer plusieurs clients en parallele sans perdre en qualite. "
                    "Nous verrons aussi les erreurs les plus courantes des debutants et comment les eviter."
                ),
            },
            {
                'titre': 'Chapitre 2 : Maitriser Facebook et Instagram',
                'contenu': (
                    "Facebook et Instagram restent les plateformes les plus utilisees au Mali. Ce chapitre vous apprend "
                    "a maitriser les deux plateformes : l'algorithme de distribution, les formats qui fonctionnent le mieux "
                    "(posts carres, reels, stories, carrousels), les heures de publication optimales, et les techniques "
                    "d'engagement.\n\n"
                    "Vous saurez creer un contenu calendar (calendrier editorial) sur 7 jours, utiliser les hashtags "
                    "strategiquement, lancer des concours et des giveaways, et repondre aux commentaires et messages "
                    "prives de maniere professionnelle. Nous verrons aussi comment utiliser les statistiques de chaque "
                    "plateforme pour mesurer vos resultats."
                ),
            },
            {
                'titre': 'Chapitre 3 : Strategie de contenu et calendrier editorial',
                'contenu': (
                    "Le contenu sans strategie, c'est du bruit. Ce chapitre vous apprend a creer une strategie de contenu "
                    "coherente qui aligne les publications sur les objectifs commerciaux de l'entreprise. Vous apprendrez "
                    "a definir des personas (profils types de clients), a creer des piliers de contenu, et a planifier "
                    "vos publications a l'avance.\n\n"
                    "Nous verrons comment adapter le ton et le style a chaque plateforme, comment varier les formats pour "
                    "maintenir l'interet de l'audience, et comment recycler un meme contenu en plusieurs formats differents. "
                    "Vous aurez a la fin un modele de calendrier editorial pret a l'emploi que vous pourrez adapter pour "
                    "chaque client."
                ),
            },
            {
                'titre': 'Chapitre 4 : Publicite digitale pour PME',
                'contenu': (
                    "La publicite payante sur les reseaux sociaux est un levier puissant pour les PME, mais il faut "
                    "savoir l'utiliser pour ne pas gaspiller de l'argent. Ce chapitre couvre les bases de la publicite "
                    "Facebook/Instagram : le ciblage geographique (Bamako, Sikasso, etc.), le ciblage par interets, "
                    "les budgets publicitaires adaptes aux PME maliennes, et la mesure du retour sur investissement.\n\n"
                    "Vous apprendrez a creer une campagne publicitaire efficace, a choisir le bon format d'annonce, "
                    "a optimiser les performances en cours de campagne, et a presenter des rapports clairs a vos clients. "
                    "Meme avec un petit budget (5 000 a 10 000 FCFA), il est possible d'obtenir des resultats concrets."
                ),
            },
            {
                'titre': 'Chapitre 5 : Trouver et gerer des clients en tant que CM',
                'contenu': (
                    "La demande en Community Managers au Mali est enorme et ne cesse de croitre. Les boutiques, les "
                    "restaurants, les salons de coiffure, les cabinets medicaux, les ecoles prives - tous ont besoin de "
                    "quelqu'un pour gerer leurs reseaux sociaux. Ce chapitre vous montre comment trouver vos premiers "
                    "clients et comment les gerer efficacement.\n\n"
                    "Vous apprendrez a calculer vos tarifs mensuels, a creer des packs de services, a rediger des contrats "
                    "simples, et a gerer les livrables hebdomadaires. Nous verrons comment utiliser les temoignages et "
                    "les resultats concrets (augmentation des abonnes, des ventes via les reseaux) pour fideliser vos "
                    "clients et en attirer de nouveaux par le bouche-a-oreille."
                ),
            },
        ],
    },
]

# Formations gratuites
FORMATIONS_GRATUITES = [
    {'title': 'Formation complete en Trading', 'desc': 'Apprenez les marches financiers, l\'analyse technique et les strategies de trading adaptees au contexte africain.'},
    {'title': 'Formation en Management et Gestion de projets', 'desc': 'Developpez vos competences de leadership, de planification et de gestion d\'equipe pour diriger des projets avec succes.'},
    {'title': 'Formation en Intelligence Artificielle', 'desc': 'Decouvrez comment utiliser l\'IA (ChatGPT, Midjourney, etc.) pour automatiser vos taches et booster votre productivite.'},
    {'title': 'Formation YouTube et monetisation', 'desc': 'Lancez votre chaine YouTube, creez du contenu engageant et apprenez a monetiser votre audience.'},
    {'title': 'Formation complete en Programmation', 'desc': 'De zero a developpeur : HTML, CSS, JavaScript, Python et les frameworks modernes.'},
    {'title': 'Formation en Infographie et Design', 'desc': 'Maitrisez les outils de creation graphique pour produire des visuels professionnels et impactants.'},
    {'title': 'Formation E-commerce', 'desc': 'Lancez votre boutique en ligne, gerez les paiements mobiles et livrez vos produits au Mali et en Afrique.'},
    {'title': 'Pack 10 000 templates et ressources Canva', 'desc': 'Un pack complet de templates professionnels pour tous vos projets de design.'},
    {'title': 'Formation en Maintenance informatique', 'desc': 'Apprenez a diagnostiquer, reparer et entretenir les ordinateurs et reseaux.'},
    {'title': 'Formation en Hacking et Securite informatique', 'desc': 'Comprenez les vulnerabilites pour mieux vous proteger et offrir des services de securite.'},
    {'title': 'Formation Revendeur IPTV', 'desc': 'Decouvrez le business de la vente de services IPTV et comment le lancer au Mali.'},
]


def make_styles(color):
    """Create paragraph styles for a formation"""
    c = COLORS[color]
    s = {}
    s['title'] = ParagraphStyle('Title', fontName='Carlito-Bold', fontSize=28, leading=34, alignment=TA_CENTER, textColor=HexColor(c['primary']), spaceAfter=6)
    s['subtitle'] = ParagraphStyle('Subtitle', fontName='Carlito', fontSize=16, leading=22, alignment=TA_CENTER, textColor=HexColor('#64748B'), spaceAfter=12)
    s['h1'] = ParagraphStyle('H1', fontName='Carlito-Bold', fontSize=20, leading=26, textColor=HexColor(c['primary']), spaceBefore=18, spaceAfter=10)
    s['h2'] = ParagraphStyle('H2', fontName='Carlito-Bold', fontSize=14, leading=20, textColor=HexColor(c['primary']), spaceBefore=14, spaceAfter=8)
    s['body'] = ParagraphStyle('Body', fontName='Carlito', fontSize=10.5, leading=16, alignment=TA_JUSTIFY, spaceAfter=8, textColor=HexColor('#334155'))
    s['body_center'] = ParagraphStyle('BodyCenter', fontName='Carlito', fontSize=10.5, leading=16, alignment=TA_CENTER, spaceAfter=8, textColor=HexColor('#334155'))
    s['small'] = ParagraphStyle('Small', fontName='Carlito', fontSize=9, leading=13, alignment=TA_CENTER, textColor=HexColor('#94A3B8'))
    s['cta'] = ParagraphStyle('CTA', fontName='Carlito-Bold', fontSize=13, leading=18, alignment=TA_CENTER, textColor=white, spaceAfter=6)
    s['badge'] = ParagraphStyle('Badge', fontName='Carlito-Bold', fontSize=9, leading=13, alignment=TA_CENTER, textColor=white)
    s['cover_main'] = ParagraphStyle('CoverMain', fontName='Carlito-Bold', fontSize=32, leading=40, alignment=TA_CENTER, textColor=white)
    s['cover_sub'] = ParagraphStyle('CoverSub', fontName='Carlito', fontSize=16, leading=22, alignment=TA_CENTER, textColor=HexColor('#FFFFFFCC'))
    s['cover_price'] = ParagraphStyle('CoverPrice', fontName='Carlito-Bold', fontSize=36, leading=42, alignment=TA_CENTER, textColor=white)
    s['cover_detail'] = ParagraphStyle('CoverDetail', fontName='Carlito', fontSize=11, leading=16, alignment=TA_CENTER, textColor=HexColor('#FFFFFFBB'))
    s['toc_title'] = ParagraphStyle('TOCTitle', fontName='Carlito-Bold', fontSize=18, leading=24, textColor=HexColor(c['primary']), spaceBefore=10, spaceAfter=16)
    s['toc_item'] = ParagraphStyle('TOCItem', fontName='Carlito', fontSize=11, leading=20, textColor=HexColor('#334155'), leftIndent=20)
    s['footer'] = ParagraphStyle('Footer', fontName='Carlito', fontSize=8, leading=10, alignment=TA_CENTER, textColor=HexColor('#CBD5E1'))
    return s


def add_page_number(canvas, doc, color_hex, formation_title):
    """Add page number and footer to each page"""
    canvas.saveState()
    # Bottom line
    canvas.setStrokeColor(HexColor(color_hex))
    canvas.setLineWidth(0.5)
    canvas.line(MARGIN, 1.2*cm, W - MARGIN, 1.2*cm)
    # Page number
    canvas.setFont('Carlito', 8)
    canvas.setFillColor(HexColor('#94A3B8'))
    canvas.drawCentredString(W/2, 0.7*cm, f"Studio Creatif - {formation_title} | Page {doc.page}")
    # WhatsApp
    canvas.setFont('Carlito', 8)
    canvas.setFillColor(HexColor('#25D366'))
    canvas.drawRightString(W - MARGIN, 0.7*cm, "+223 97 78 72 44")
    canvas.restoreState()


def create_cover(c, formation, styles):
    """Create cover page elements"""
    elements = []
    color = COLORS[formation['color_key']]
    
    # Use a table to create colored background
    bg_data = [['']]
    bg_table = Table(bg_data, colWidths=[W - 2*MARGIN], rowHeights=[H - 3*MARGIN])
    bg_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), HexColor(color['primary'])),
        ('ROUNDEDCORNERS', [8, 8, 8, 8]),
    ]))
    elements.append(Spacer(1, -0.5*cm))
    
    # Decorative element
    deco = Table([['']], colWidths=[W - 2*MARGIN], rowHeights=[0.3*cm])
    deco.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), HexColor(color['secondary'])),
        ('ROUNDEDCORNERS', [4, 4, 0, 0]),
    ]))
    elements.append(deco)
    elements.append(Spacer(1, 4*cm))
    
    # Badge
    badge_data = [[Paragraph(f"FORMATION PREMIUM  |  {formation['level'].upper()}", styles['badge'])]]
    badge_table = Table(badge_data, colWidths=[6*cm])
    badge_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), HexColor('#FFFFFF30')),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 12),
        ('RIGHTPADDING', (0,0), (-1,-1), 12),
        ('ROUNDEDCORNERS', [10, 10, 10, 10]),
    ]))
    elements.append(badge_table)
    elements.append(Spacer(1, 1.5*cm))
    
    # Title
    elements.append(Paragraph(formation['title'], styles['cover_main']))
    elements.append(Spacer(1, 0.3*cm))
    elements.append(Paragraph(formation['subtitle'], styles['cover_sub']))
    elements.append(Spacer(1, 2*cm))
    
    # Price
    price_data = [[Paragraph(f"{formation['price']} FCFA", styles['cover_price'])]]
    price_table = Table(price_data, colWidths=[8*cm])
    price_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), HexColor('#FFFFFF20')),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('TOPPADDING', (0,0), (-1,-1), 10),
        ('BOTTOMPADDING', (0,0), (-1,-1), 10),
        ('ROUNDEDCORNERS', [12, 12, 12, 12]),
    ]))
    elements.append(price_table)
    elements.append(Spacer(1, 1*cm))
    
    # Details
    elements.append(Paragraph(f"{formation['duration']}  |  {formation['lessons']}  |  Niveau {formation['level']}", styles['cover_detail']))
    elements.append(Spacer(1, 3*cm))
    
    # Author
    elements.append(Paragraph("Par <b>Sacko</b>  -  Studio Creatif", styles['cover_detail']))
    elements.append(Spacer(1, 0.5*cm))
    elements.append(Paragraph("WhatsApp : +223 97 78 72 44", styles['cover_detail']))
    
    elements.append(PageBreak())
    return elements


def create_toc(c, formation, styles):
    """Create table of contents"""
    elements = []
    elements.append(Paragraph("Sommaire", styles['toc_title']))
    elements.append(Spacer(1, 0.3*cm))
    
    for i, ch in enumerate(formation['chapitres'], 1):
        elements.append(Paragraph(f"<b>{ch['titre']}</b>", styles['toc_item']))
    
    elements.append(Spacer(1, 1*cm))
    elements.append(HRFlowable(width="100%", thickness=0.5, color=HexColor(COLORS[formation['color_key']]['primary'])))
    elements.append(PageBreak())
    return elements


def create_intro(c, formation, styles):
    """Create introduction section"""
    elements = []
    elements.append(Paragraph("Introduction", styles['h1']))
    elements.append(HRFlowable(width="30%", thickness=2, color=HexColor(COLORS[formation['color_key']]['primary'])))
    elements.append(Spacer(1, 0.5*cm))
    elements.append(Paragraph(formation['intro'], styles['body']))
    elements.append(Spacer(1, 0.5*cm))
    
    # What you'll learn box
    color = COLORS[formation['color_key']]
    learn_items = []
    for ch in formation['chapitres']:
        learn_items.append([Paragraph(f"<b>{ch['titre']}</b>", ParagraphStyle('li', fontName='Carlito-Bold', fontSize=9.5, leading=14, textColor=HexColor(color['primary'])))])
    
    learn_data = [[Paragraph("Ce que vous allez apprendre :", ParagraphStyle('lh', fontName='Carlito-Bold', fontSize=11, leading=16, textColor=HexColor(color['primary'])))]] + learn_items
    learn_table = Table(learn_data, colWidths=[W - 2*MARGIN - 1*cm])
    learn_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), HexColor(color['accent'])),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 14),
        ('RIGHTPADDING', (0,0), (-1,-1), 14),
        ('ROUNDEDCORNERS', [8, 8, 8, 8]),
        ('BOX', (0,0), (-1,-1), 0.5, HexColor(color['primary'])),
    ]))
    elements.append(Spacer(1, 0.5*cm))
    elements.append(learn_table)
    elements.append(PageBreak())
    return elements


def create_chapters(c, formation, styles):
    """Create all chapter content"""
    elements = []
    for ch in formation['chapitres']:
        elements.append(Paragraph(ch['titre'], styles['h1']))
        elements.append(HRFlowable(width="30%", thickness=2, color=HexColor(COLORS[formation['color_key']]['primary'])))
        elements.append(Spacer(1, 0.3*cm))
        
        # Split content by \n\n for paragraphs
        paragraphs = ch['contenu'].split('\n\n')
        for p in paragraphs:
            if p.strip():
                elements.append(Paragraph(p.strip(), styles['body']))
                elements.append(Spacer(1, 0.3*cm))
        
        elements.append(Spacer(1, 0.5*cm))
    
    return elements


def create_premium_section(c, formation, styles):
    """Create premium upgrade / CTA section"""
    elements = []
    color = COLORS[formation['color_key']]
    
    elements.append(PageBreak())
    elements.append(Paragraph("Pourquoi choisir la version Premium ?", styles['h1']))
    elements.append(HRFlowable(width="30%", thickness=2, color=HexColor(color['primary'])))
    elements.append(Spacer(1, 0.5*cm))
    
    benefits = [
        ["Acces complet a toutes les lecons", "Oui"],
        ["Suivi personnel par Sacko", "Oui"],
        ["Support WhatsApp illimite", "Oui"],
        ["Certificat de participation", "Oui"],
        ["Acces gratuit Canva Pro / CapCut Pro", "Oui"],
        ["Mises a jour gratuites", "Oui"],
        ["Communaute d'entrepreneurs", "Oui"],
    ]
    
    benefit_header = [
        Paragraph("<b>Avantage</b>", ParagraphStyle('bh', fontName='Carlito-Bold', fontSize=10, textColor=white)),
        Paragraph("<b>Premium</b>", ParagraphStyle('bh2', fontName='Carlito-Bold', fontSize=10, textColor=white, alignment=TA_CENTER)),
    ]
    benefit_rows = [benefit_header]
    for b in benefits:
        benefit_rows.append([
            Paragraph(b[0], ParagraphStyle('bc', fontName='Carlito', fontSize=10, leading=16, textColor=HexColor('#334155'))),
            Paragraph(b[1], ParagraphStyle('bc2', fontName='Carlito-Bold', fontSize=10, textColor=HexColor(color['primary']), alignment=TA_CENTER)),
        ])
    
    benefit_table = Table(benefit_rows, colWidths=[(W - 2*MARGIN)*0.7, (W - 2*MARGIN)*0.3])
    benefit_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), HexColor(color['primary'])),
        ('TEXTCOLOR', (0,0), (-1,0), white),
        ('BACKGROUND', (0,1), (-1,-1), HexColor(color['accent'])),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [HexColor(color['accent']), white]),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('LEFTPADDING', (0,0), (-1,-1), 12),
        ('RIGHTPADDING', (0,0), (-1,-1), 12),
        ('GRID', (0,0), (-1,-1), 0.5, HexColor(color['primary'] + '40')),
        ('ROUNDEDCORNERS', [8, 8, 8, 8]),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    elements.append(benefit_table)
    elements.append(Spacer(1, 1.5*cm))
    
    # CTA
    cta_data = [[Paragraph("Commencez maintenant - Contactez Sacko sur WhatsApp", styles['cta'])]]
    cta_table = Table(cta_data, colWidths=[W - 2*MARGIN - 2*cm])
    cta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), HexColor('#25D366')),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('TOPPADDING', (0,0), (-1,-1), 14),
        ('BOTTOMPADDING', (0,0), (-1,-1), 14),
        ('ROUNDEDCORNERS', [12, 12, 12, 12]),
    ]))
    elements.append(cta_table)
    elements.append(Spacer(1, 0.5*cm))
    elements.append(Paragraph("+223 97 78 72 44", ParagraphStyle('wa', fontName='Carlito-Bold', fontSize=14, alignment=TA_CENTER, textColor=HexColor('#25D366'))))
    elements.append(Spacer(1, 1*cm))
    
    # Other formations teaser
    elements.append(Paragraph("Autres formations disponibles", styles['h2']))
    elements.append(Spacer(1, 0.3*cm))
    for f in FORMATIONS_GRATUITES[:5]:
        elements.append(Paragraph(f"<b>{f['title']}</b> - {f['desc']}", ParagraphStyle('other', fontName='Carlito', fontSize=9, leading=14, textColor=HexColor('#64748B'), leftIndent=10, spaceAfter=6)))
    elements.append(Paragraph("...et 6 autres formations !", ParagraphStyle('more', fontName='Carlito-Bold', fontSize=9, textColor=HexColor(color['primary']), leftIndent=10)))
    
    return elements


def generate_formation_pdf(formation, output_dir):
    """Generate complete PDF for one formation"""
    filename = f"Formation_{formation['key'].upper()}_{formation['title'].replace(' ', '_')}.pdf"
    filepath = os.path.join(output_dir, filename)
    color = COLORS[formation['color_key']]
    styles = make_styles(formation['color_key'])
    
    doc = SimpleDocTemplate(
        filepath,
        pagesize=A4,
        leftMargin=MARGIN,
        rightMargin=MARGIN,
        topMargin=2*cm,
        bottomMargin=2*cm,
    )
    
    elements = []
    elements += create_cover(doc, formation, styles)
    elements += create_toc(doc, formation, styles)
    elements += create_intro(doc, formation, styles)
    elements += create_chapters(doc, formation, styles)
    elements += create_premium_section(doc, formation, styles)
    
    doc.build(elements, onFirstPage=lambda c,d: add_page_number(c, d, color['primary'], formation['title']),
              onLaterPages=lambda c,d: add_page_number(c, d, color['primary'], formation['title']))
    
    return filepath


FORMATIONS_GRATUITES_DATA = [
    {
        'key': 'trading', 'title': 'Formation complete en Trading', 'level': 'Avance',
        'color_key': 'default',
        'intro': "Le trading est un domaine fascinant qui permet de generer des revenus depuis n'importe ou avec une connexion Internet. Cette formation couvre les marches financiers, l'analyse technique, l'analyse fondamentale et les strategies de gestion du risque adaptees au contexte africain. Vous apprendrez a lire les graphiques, a identifier les tendances, et a prendre des decisions eclairées.",
        'chapitres': [
            {'titre': 'Chapitre 1 : Introduction aux marches financiers', 'contenu': "Decouvrez les differents marches (forex, actions, cryptomonnaies), leur fonctionnement et leurs specificites. Vous comprendrez comment les prix se forment, quels sont les principaux acteurs du marche, et comment les evenements economiques influencent les cours. Ce chapitre pose les bases essentielles pour tout debutant en trading.\n\nNous verrons aussi les plateformes de trading accessibles depuis le Mali, comment ouvrir un compte, et les premiers pas pour commencer a pratiquer avec un compte de demonstration sans risquer d'argent."},
            {'titre': 'Chapitre 2 : Analyse technique', 'contenu': "L'analyse technique est la methode la plus utilisee par les traders. Vous apprendrez a lire les chandeliers japonais, a identifier les supports et resistances, a tracer les lignes de tendance, et a utiliser les indicateurs techniques (RSI, MACD, moyennes mobiles, Bandes de Bollinger). Chaque indicateur est explique avec des exemples concrets.\n\nVous decouvrirez comment combiner plusieurs indicateurs pour augmenter la probabilite de vos trades, comment reconnaitre les figures chartistes les plus fiables, et comment utiliser les timeframes multiples pour affiner votre analyse."},
            {'titre': 'Chapitre 3 : Gestion du risque et money management', 'contenu': "Le secret des traders rentables n'est pas de gagner tous les trades, mais de gerer les pertes. Ce chapitre vous apprend les regles d'or de la gestion du risque : le risk-reward ratio, la taille de position, le stop-loss, et le take-profit. Vous comprendrez pourquoi la discipline est plus importante que la strategie.\n\nNous verrons aussi comment creer un journal de trading, comment analyser vos performances, et comment ajuster votre strategie en fonction des resultats. La gestion emotionnelle est egalement couverte : comment eviter les decisions impulsives et rester fonce sur votre plan."},
        ],
    },
    {
        'key': 'management', 'title': 'Formation en Management et Gestion de projets', 'level': 'Intermediaire',
        'color_key': 'web',
        'intro': "Le management et la gestion de projets sont des competences transversales qui servent dans tous les domaines. Que vous dirigiez une equipe, que vous lanciez votre propre entreprise, ou que vous coordonniez des projets, cette formation vous donne les methodes et outils pour reussir. Vous apprendrez les frameworks reconnus (Agile, Kanban, Gantt) et comment les adapter au contexte malien.",
        'chapitres': [
            {'titre': 'Chapitre 1 : Les fondamentaux du management', 'contenu': "Ce chapitre couvre les bases du management : les differents styles de leadership, la delegation efficace, la communication interpersonnelle, et la resolution de conflits. Vous comprendrez comment motiver votre equipe, comment donner du feedback constructif, et comment creer un environnement de travail positif.\n\nNous verrons aussi les specificites du management en Afrique, ou les relations humaines et le respect de la hierarchie jouent un role central. Vous apprendrez a adapter les theories occidentales au contexte local."},
            {'titre': 'Chapitre 2 : Gestion de projets pratique', 'contenu': "Apprenez a planifier, executer et suivre des projets de A a Z avec des methodes eprouvees. Ce chapitre couvre le cycle de vie d'un projet, la definition des objectifs SMART, la decomposition en taches (WBS), le diagramme de Gantt, et la methode Agile avec ses sprints et retrospectives.\n\nVous utiliserez des outils gratuits (Trello, Notion, Google Sheets) pour mettre en pratique chaque concept. A la fin, vous serez capable de gerer n'importe quel projet, de l'organisation d'un evenement au lancement d'un produit."},
            {'titre': 'Chapitre 3 : Leadership et prise de decision', 'contenu': "Un bon manager est avant tout un bon leader. Ce chapitre vous apprend a prendre des decisions strategiques en contexte d'incertitude, a communiquer votre vision, a gerer le changement, et a developper l'autonomie de votre equipe. Vous comprendrez la difference entre management et leadership, et pourquoi vous avez besoin des deux.\n\nNous verrons des etudes de cas concrets d'entreprises maliennes qui ont reussi grace a un bon leadership, et les lecons a en tirer pour votre propre parcours professionnel."},
        ],
    },
    {
        'key': 'ia', 'title': 'Formation en Intelligence Artificielle', 'level': 'Avance',
        'color_key': 'video',
        'intro': "L'intelligence artificielle transforme tous les secteurs : design, marketing, programmation, gestion. Cette formation vous apprend a maitriser les outils IA les plus puissants (ChatGPT, Midjourney, Canva AI, etc.) pour automatiser vos taches, booster votre productivite, et offrir des services a forte valeur ajoutee a vos clients. L'IA n'est pas l'avenir, c'est le present.",
        'chapitres': [
            {'titre': 'Chapitre 1 : Comprendre l Intelligence Artificielle', 'contenu': "Demystifions l'IA. Ce chapitre explique en termes simples ce qu'est l'intelligence artificielle, le machine learning, et les grands modeles de langage (LLM). Vous comprendrez comment ChatGPT fonctionne, ce qu'il peut faire et ce qu'il ne peut pas faire, et comment l'utiliser efficacement dans votre travail quotidien.\n\nNous verrons aussi les enjeux ethiques de l'IA, les limites actuelles, et comment rester critique face aux resultats generes. L'objectif n'est pas de devenir chercheur en IA, mais de devenir un utilisateur expert qui tire le maximum de ces outils."},
            {'titre': 'Chapitre 2 : ChatGPT et les assistants IA', 'contenu': "ChatGPT est l'outil le plus puissant a votre disposition. Ce chapitre vous apprend a rediger des prompts efficaces, a utiliser ChatGPT pour creer du contenu, a analyser des donnees, a generer des idees, et a automatiser des taches repetitives. Vous decouvrirez les techniques de prompt engineering qui font la difference entre une reponse moyenne et une reponse exceptionnelle.\n\nNous verrons aussi comment utiliser ChatGPT pour la redaction de contenus publicitaires, la creation de scripts video, l'analyse de marches, et la personnalisation de messages pour vos clients. Chaque cas d'usage est illustre par des exemples concrets adaptes au marche malien."},
            {'titre': 'Chapitre 3 : IA pour le design et la creation', 'contenu': "L'IA revolutionne la creation visuelle. Ce chapitre couvre Midjourney, DALL-E, et les outils integres dans Canva et CapCut. Vous apprendrez a generer des images, a creer des logos, a modifier des photos, et a produire du contenu visuel professionnel en quelques minutes au lieu de quelques heures.\n\nVous comprendrez comment integrer l'IA dans votre flux de travail de designer ou de community manager sans perdre votre touche personnelle. L'IA est un assistant, pas un remplacant - et ce chapitre vous montre exactement comment tirer parti de cette distinction."},
        ],
    },
    {
        'key': 'youtube', 'title': 'Formation YouTube et monetisation', 'level': 'Intermediaire',
        'color_key': 'design',
        'intro': "YouTube est la plus grande plateforme video au monde et une source de revenus formidable pour les createurs africains. Cette formation vous guide dans la creation de votre chaine, la production de contenu engageant, l'optimisation pour l'algorithme, et les differentes methodes de monetisation adaptees au marche malien et africain.",
        'chapitres': [
            {'titre': 'Chapitre 1 : Lancer sa chaine YouTube', 'contenu': "De l'idee a la premiere video. Ce chapitre couvre la creation de votre chaine, l'optimisation du profil (nom, description, banniere), le choix de votre niche (education, divertissement, vlog, tutoriels), et l'equipement necessaire pour commencer avec un petit budget. Vous n'avez pas besoin de materiel couteux pour commencer.\n\nNous verrons aussi comment trouver des idees de videos qui repondent aux besoins de votre audience cible, comment planifier votre calendrier de publication, et comment creer vos premieres videos meme si vous n'avez jamais filme auparavant."},
            {'titre': 'Chapitre 2 : Creer du contenu qui marche', 'contenu': "Le contenu est roi, mais la presentation est la reine. Ce chapitre vous apprend a structurer vos videos pour maximiser la retention d'audience, a ecrire des scripts efficaces, a utiliser les miniatures et les titres qui attirent les clics, et a maitriser le montage pour un rendu professionnel.\n\nNous verrons les formats qui fonctionnent le mieux en 2024 : les tutos, les listes, les comparaisons, les vlogs, et les videos storytime. Vous apprendrez a analyser ce qui fonctionne chez les createurs maliens et africains qui reussissent, et a adapter ces strategies a votre propre contenu."},
            {'titre': 'Chapitre 3 : Monetiser sa chaine', 'contenu': "Combien gagne un YouTuber malien ? Ce chapitre detaille toutes les sources de revenus : la monetisation YouTube (AdSense), les sponsors et partenariats, l'affiliation, la vente de produits et services, et les dons. Vous comprendrez les criteres pour activer la monetisation et comment y parvenir rapidement.\n\nNous verrons aussi comment utiliser YouTube comme outil de marketing pour votre activite principale (design, formation, commerce), comment attirer des clients via vos videos, et comment construire une communaute engagee qui vous suit sur le long terme."},
        ],
    },
    {
        'key': 'programmation', 'title': 'Formation complete en Programmation', 'level': 'Avance',
        'color_key': 'web',
        'intro': "La programmation est la competence la plus demandee au monde. Cette formation vous prend de zero et vous amene a un niveau intermediaire en HTML, CSS, JavaScript et Python. Vous serez capable de creer des sites web, des scripts d'automatisation, et de comprendre les bases des frameworks modernes. C'est un investissement qui vous servira toute votre vie.",
        'chapitres': [
            {'titre': 'Chapitre 1 : HTML et CSS - Les bases du web', 'contenu': "Tout commence par HTML et CSS. Ce chapitre vous apprend a creer des pages web structurées avec HTML et a les styliser avec CSS. Vous maitriserez les balises essentielles, les selecteurs CSS, la mise en page Flexbox, et le responsive design. A la fin de ce chapitre, vous serez capable de creer une page web complete et responsive.\n\nChaque concept est illustre par des exercices pratiques. Vous creerez progressivement un portfolio en ligne qui presentera vos projets tout au long de la formation. Cet approche project-based rend l'apprentissage concret et motiveur."},
            {'titre': 'Chapitre 2 : JavaScript - Rendre le web interactif', 'contenu': "JavaScript est le langage qui donne vie aux pages web. Vous apprendrez les variables, les fonctions, les evenements, la manipulation du DOM, et les appels API. Vous serez capable de creer des formulaires interactifs, des carrousels, des menus dynamiques, et des animations.\n\nNous verrons aussi les bases d'ES6 (arrow functions, destructuring, async/await) et comment utiliser les outils modernes du developpeur (VS Code, Git, Chrome DevTools). Ces fondamentaux sont indispensables pour aborder les frameworks dans le chapitre suivant."},
            {'titre': 'Chapitre 3 : Python - Automatisation et donnees', 'contenu': "Python est le langage le plus polyvalent : il sert au developpement web, a l'analyse de donnees, a l'automatisation, et bien plus. Ce chapitre couvre les bases de Python (variables, boucles, fonctions, listes, dictionnaires) et vous montre comment creer des scripts pratiques pour automatiser des taches quotidiennes.\n\nVous apprendrez a lire et ecrire des fichiers, a traiter des donnees CSV/Excel, a envoyer des emails automatiques, et a creer des bots simples. Chaque script est un outil concret que vous pourrez utiliser immediatement dans votre travail ou votre entreprise."},
        ],
    },
    {
        'key': 'infographie', 'title': 'Formation en Infographie et Design', 'level': 'Debutant',
        'color_key': 'marketing',
        'intro': "L'infographie est l'art de transformer des donnees complexes en visuels clairs et attractifs. Dans un monde ou l'attention est la ressource la plus rare, savoir creer des infographies percutantes est une competence tres valorisee. Cette formation vous apprend a maitriser les outils et les techniques pour produire des visuels professionnels.",
        'chapitres': [
            {'titre': 'Chapitre 1 : Principes de l infographie', 'contenu': "Qu'est-ce qui fait une bonne infographie ? Ce chapitre couvre les principes de la visualisation de donnees : comment choisir le bon type de graphique, comment organiser l'information de maniere logique, comment utiliser la couleur pour guider l'oeil du lecteur, et comment raconter une histoire avec des donnees.\n\nVous apprendrez a analyser des infographies professionnelles pour comprendre les choix de design, et a appliquer ces principes a vos propres creations. Nous verrons aussi les erreurs les plus courantes a eviter."},
            {'titre': 'Chapitre 2 : Outils et techniques', 'contenu': "Ce chapitre vous montre comment creer des infographies avec Canva, Piktochart et des outils gratuits. Vous apprendrez a utiliser les templates comme point de depart, a personnaliser les graphiques, a integrer des icones et des illustrations, et a exporter dans les bons formats pour le web et l'impression.\n\nNous verrons aussi comment creer des infographies animees pour les reseaux sociaux, et comment adapter vos creations aux differentes plateformes sans tout refaire a chaque fois."},
            {'titre': 'Chapitre 3 : Projets pratiques', 'contenu': "La pratique fait la maitrise. Dans ce chapitre, vous creerez 5 infographies completes sur des themes varies : statistiques d'entreprise, processus en etapes, comparaison de produits, chronologie historique, et donnees de marche. Chaque projet est un element de portfolio concret que vous pourrez montrer a vos clients.\n\nVous apprendrez aussi a transformer des donnees brutes (tableaux Excel, rapports) en infographies professionnelles, une competence tres demande par les entreprises et organisations au Mali."},
        ],
    },
    {
        'key': 'ecommerce', 'title': 'Formation E-commerce', 'level': 'Intermediaire',
        'color_key': 'default',
        'intro': "Le commerce electronique est en pleine explosion en Afrique. Avec l'essor des paiements mobiles et de la livraison a domicile, il n'a jamais ete aussi facile de vendre en ligne. Cette formation vous guide dans la creation de votre boutique en ligne, la gestion des commandes, et les strategies pour attirer et fidéliser vos clients.",
        'chapitres': [
            {'titre': 'Chapitre 1 : Lancer sa boutique en ligne', 'contenu': "De l'idee a la premiere vente. Ce chapitre couvre le choix de votre niche, la creation de votre boutique (avec Shopify, WooCommerce ou une solution simple), l'ajout de produits, la configuration des paiements mobiles (Orange Money, Wave, MTN Mobile Money), et la mise en place de la livraison.\n\nVous comprendrez les specificites du e-commerce au Mali : les defis logistiques, les habitudes d'achat des consommateurs, et les solutions pratiques pour surmonter les obstacles. Chaque etape est illustree par des exemples concrets de boutiques maliennes qui reussissent."},
            {'titre': 'Chapitre 2 : Marketing et acquisition de clients', 'contenu': "Une boutique sans clients n'est rien. Ce chapitre vous apprend a attirer du trafic vers votre boutique avec les reseaux sociaux, la publicite ciblee, le marketing de contenu, et les partenariats avec des influenceurs locaux. Vous decouvrirez les strategies qui fonctionnent specifiquement pour le marche malien.\n\nNous verrons comment creer des campagnes publicitaires efficaces avec un petit budget, comment utiliser les reseaux sociaux pour generer des ventes, et comment construire une base de clients fideles qui reviennent et recommandent votre boutique."},
            {'titre': 'Chapitre 3 : Gerer et faire grandir votre boutique', 'contenu': "La gestion quotidienne d'une boutique en ligne : commandes, stock, retours, service client, et analyse des performances. Ce chapitre vous montre comment automatiser les taches repetitives, comment gerer la croissance, et comment scaler votre activite.\n\nVous apprendrez a utiliser les tableaux de bord pour suivre vos ventes, a identifier les produits les plus rentables, a optimiser vos fiches produits pour convertir mieux, et a planifier les periodes de forte demande (fetes, rentree, evenements speciaux)."},
        ],
    },
    {
        'key': 'templates', 'title': 'Pack 10 000 templates et ressources Canva', 'level': 'Tous niveaux',
        'color_key': 'design',
        'intro': "Ce pack est une mine d'or pour tout designer, community manager ou entrepreneur. Avec 10 000 templates professionnels organised par categorie et par plateforme, vous aurez toujours le bon visuel pour chaque situation. Plus besoin de partir de zero - personnalisez et publiez en quelques minutes.",
        'chapitres': [
            {'titre': 'Chapitre 1 : Presentation du pack', 'contenu': "Decouvrez le contenu complet du pack : templates de posts Instagram, stories, affiches, logos, cartes de visite, bannières YouTube, miniatures, presentations, et bien plus. Chaque categorie est organisee par theme (business, food, fashion, education, technology) pour que vous trouvez rapidement ce dont vous avez besoin.\n\nVous apprendrez a naviguer dans les dossiers, a utiliser les filtres de recherche, et a personnaliser les templates tout en gardant une coherence visuelle. Le pack est structure pour etre utilise aussi bien par des debutants que par des professionnels."},
            {'titre': 'Chapitre 2 : Personnalisation professionnelle', 'contenu': "Un template est un point de depart, pas un produit final. Ce chapitre vous apprend a personnaliser les templates de maniere professionnelle : modifier les couleurs pour respecter votre charte graphique, remplacer les images par des photos pertinentes, ajuster la typographie, et ajouter votre logo.\n\nVous decouvrirez comment creer des variants d'un meme template pour differentes plateformes (post Instagram en carree, story en vertical, bannière Facebook en paysage) tout en gardant une identite visuelle coherente. Cette technique vous fera gagner des heures de travail."},
            {'titre': 'Chapitre 3 : Utilisation commerciale', 'contenu': "Comment utiliser ces templates pour servir vos clients et generer des revenus. Ce chapitre couvre la creation de packs de visuels pour les entreprises (pack mensuel de 20 posts), la personnalisation rapide pour les commandes urgentes, et la creation de portfolios impréssionnants avec les meilleurs templates du pack.\n\nVous apprendrez aussi a creer vos propres templates personnalises a partir de ceux du pack, a les organiser pour votre workflow, et a les utiliser comme base pour proposer des services de design a forte valeur ajoutee."},
        ],
    },
    {
        'key': 'maintenance', 'title': 'Formation en Maintenance informatique', 'level': 'Intermediaire',
        'color_key': 'web',
        'intro': "La maintenance informatique est une competence indispensable dans un monde de plus en plus connecte. Chaque bureau, chaque ecole, chaque entreprise a des ordinateurs qui necessitent un entretien regulier. Cette formation vous donne les competences pour diagnostiquer, reparer et entretenir les ordinateurs et les reseaux.",
        'chapitres': [
            {'titre': 'Chapitre 1 : Hardware - Comprendre et diagnostiquer', 'contenu': "Ce chapitre couvre les composants d'un ordinateur (processeur, RAM, disque dur, carte graphique, alimentation), leur fonctionnement, et les pannes les plus courantes. Vous apprendrez a ouvrir un PC, a identifier les composants, a diagnostiquer les problemes materiels, et a effectuer les reparations de base.\n\nNous verrons aussi comment assembler un ordinateur a partir de pieces, comment choisir les composants selon le budget et l'usage, et comment installer un systeme d'exploitation proprement. Ces competences sont tres demandees au Mali et permettent de generer des revenus rapidement."},
            {'titre': 'Chapitre 2 : Logiciel et securite', 'contenu': "Les problemes logiciels sont les plus frequents. Ce chapitre vous apprend a resoudre les problemes de Windows, a installer et configurer les logiciels essentiels, a optimiser les performances d'un ordinateur lent, et a proteger les systemes contre les virus et les malwares.\n\nVous decouvrirez les outils gratuits les plus efficaces pour la maintenance logicielle, comment creer des sauvegardes automatiques, et comment configurer un ordinateur pour qu'il reste rapide et securise sur le long terme. Nous verrons aussi la maintenance des smartphones Android, tres demandee au Mali."},
            {'titre': 'Chapitre 3 : Reseaux et depannage', 'contenu': "La connectivite est essentielle. Ce chapitre couvre les bases des reseaux informatiques : configuration WiFi, partage de connexion, depannage de connexion, installation de routeurs, et creation de petits reseaux pour les bureaux et les cybercafes.\n\nVous apprendrez a diagnostiquer les problemes de connexion, a configurer un reseau securise, et a offrir des services de maintenance reseau aux entreprises locales. Cette competence complete votre profil de technicien informatique polyvalent."},
        ],
    },
    {
        'key': 'hacking', 'title': 'Formation en Hacking et Securite informatique', 'level': 'Avance',
        'color_key': 'video',
        'intro': "La cybersécurité est un enjeu majeur pour les entreprises et les particuliers. Comprendre les techniques de hacking permet de mieux se proteger et d'offrir des services de sécurité très demandés. Cette formation couvre les vulnérabilités courantes, les techniques de test de pénétration, et les bonnes pratiques de sécurité adaptées au contexte africain.",
        'chapitres': [
            {'titre': 'Chapitre 1 : Introduction a la securite informatique', 'contenu': "Ce chapitre pose les bases de la sécurité informatique : les types de menaces (virus, phishing, ransomware, attaques de force brute), les vecteurs d'attaque les plus courants en Afrique, et les mesures de protection essentielles. Vous comprendrez comment les attaquants pensent et operent.\n\nNous verrons aussi le cadre legal de la cybersécurité au Mali, les bonnes pratiques pour protéger ses comptes en ligne, et comment sensibiliser votre entourage aux risques numériques. L'objectif est de devenir un défenseur, pas un attaquant."},
            {'titre': 'Chapitre 2 : Tests de penetration ethiques', 'contenu': "Le test de penetration (pentest) est une méthode autorisée pour découvrir les failles d'un système avant que les pirates ne les exploitent. Ce chapitre couvre les outils et techniques de base : reconnaissance, scanning, exploitation de vulnérabilités, et rédaction de rapports.\n\nVous apprendrez à utiliser des outils comme Nmap, Wireshark et Metasploit dans un environnement contrôlé, à identifier les vulnérabilités les plus courantes dans les sites web et les réseaux, et à proposer des solutions de remédiation concrètes. Chaque exercice est réalisé dans un cadre légal et éthique."},
            {'titre': 'Chapitre 3 : Securiser les systemes', 'contenu': "Ce chapitre est consacré à la défense : comment configurer un pare-feu, comment chiffrer ses données, comment gérer les accès et les mots de passe, comment sauvegarder ses données de manière sécurisée, et comment mettre en place une politique de sécurité pour une petite entreprise.\n\nVous découvrirez aussi les spécificités de la sécurité mobile (smartphones Android très populaires au Mali), la sécurité des transactions mobile money, et comment offrir des services d'audit de sécurité aux entreprises locales qui en ont cruellement besoin."},
        ],
    },
    {
        'key': 'iptv', 'title': 'Formation Revendeur IPTV', 'level': 'Debutant',
        'color_key': 'marketing',
        'intro': "L'IPTV est un secteur en pleine croissance en Afrique. Des millions de personnes cherchent des alternatives accessibles pour accéder aux chaînes de télévision du monde entier. Cette formation vous apprend à comprendre le business de l'IPTV, à trouver des fournisseurs fiables, et à construire une activité de revente rentable au Mali et en Afrique de l'Ouest.",
        'chapitres': [
            {'titre': 'Chapitre 1 : Comprendre l IPTV', 'contenu': "Qu'est-ce que l'IPTV ? Comment ça fonctionne ? Quelle est la difference entre IPTV, streaming et la télévision traditionnelle ? Ce chapitre repond à toutes ces questions et vous donne une compréhension claire du secteur. Vous découvrirez les types de contenu disponibles (chaînes internationales, sport, films, séries, chaînes africaines) et les appareils compatibles.\n\nNous verrons aussi le cadre légal au Mali, les précautions à prendre, et comment choisir des fournisseurs sérieux. L'objectif est de vous donner toutes les informations pour démarrer votre activité en toute connaissance de cause."},
            {'titre': 'Chapitre 2 : Trouver des fournisseurs et gerer les abonnements', 'contenu': "Le choix du fournisseur est crucial pour la qualité de votre service. Ce chapitre vous apprend à évaluer les fournisseurs IPTV, à tester la qualité du flux, la stabilité, le support technique, et le rapport qualité-prix. Vous découvrirez les critères essentiels pour éviter les arnaques et choisir des partenaires fiables.\n\nVous apprendrez aussi à gérer les abonnements de vos clients : activation, renouvellement, résolution des problèmes techniques, et support client. Un bon service après-vente est la clé pour fidéliser vos clients et générer du bouche-à-oreille."},
            {'titre': 'Chapitre 3 : Marketing et developpement de l activite', 'contenu': "Comment trouver vos premiers clients et développer votre activité de revente IPTV. Ce chapitre couvre le marketing digital pour l'IPTV, les stratégies de tarification adaptées au marché malien, la création de packs attractifs, et la fidélisation de votre clientèle.\n\nVous découvrirez comment utiliser WhatsApp, Facebook et Instagram pour promouvoir vos services, comment créer des démonstrations pour convaincre les prospects, et comment construire une réputation qui vous amènera des clients réguliers. Nous verrons aussi comment diversifier vos revenus avec des services complémentaires (installation, configuration, maintenance)."},
        ],
    },
]


if __name__ == '__main__':
    output_dir = '/home/z/my-project/download/ebooks'
    os.makedirs(output_dir, exist_ok=True)
    
    # Premium formations
    for f in FORMATIONS:
        print(f"Generation : {f['title']}...")
        path = generate_formation_pdf(f, output_dir)
        size = os.path.getsize(path) / 1024
        print(f"  OK -> {path} ({size:.0f} KB)")
    
    # Free formations
    for f in FORMATIONS_GRATUITES_DATA:
        f_with_price = {**f, 'price': 'Gratuit', 'duration': 'Variable', 'lessons': 'Variable', 'subtitle': '', 'icon': f['key'].upper()}
        print(f"Generation : {f['title']}...")
        path = generate_formation_pdf(f_with_price, output_dir)
        size = os.path.getsize(path) / 1024
        print(f"  OK -> {path} ({size:.0f} KB)")
    
    print(f"\n{len(FORMATIONS) + len(FORMATIONS_GRATUITES_DATA)} ebooks generes dans {output_dir}/")