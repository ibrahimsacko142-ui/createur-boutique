'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { Building2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Data ────────────────────────────────────────────────────────────────────

interface Client {
  name: string;
  sector: string;
  sectorLabel: string;
  accent: string;
  fontClass: string;
  iconChar: string;
}

const clients: Client[] = [
  {
    name: 'Le Baobab Restaurant',
    sector: 'restauration',
    sectorLabel: 'Restauration',
    accent: 'from-amber-500 to-orange-500',
    fontClass: 'font-serif italic',
    iconChar: '🌿',
  },
  {
    name: 'MaliTech Solutions',
    sector: 'tech',
    sectorLabel: 'Tech',
    accent: 'from-amber-400 to-yellow-500',
    fontClass: 'font-mono font-bold tracking-tight',
    iconChar: '💡',
  },
  {
    name: 'Djoliba Foods',
    sector: 'alimentation',
    sectorLabel: 'Alimentation',
    accent: 'from-orange-500 to-red-400',
    fontClass: 'font-sans font-extrabold uppercase tracking-wider',
    iconChar: '🌾',
  },
  {
    name: 'Awa Beauty Salon',
    sector: 'beaute',
    sectorLabel: 'Beauté',
    accent: 'from-rose-400 to-amber-500',
    fontClass: 'font-sans font-light tracking-widest',
    iconChar: '✨',
  },
  {
    name: 'Bamako Express',
    sector: 'transport',
    sectorLabel: 'Transport',
    accent: 'from-amber-600 to-orange-600',
    fontClass: 'font-sans font-black uppercase',
    iconChar: '🚚',
  },
  {
    name: 'Sahel Immobilier',
    sector: 'immobilier',
    sectorLabel: 'Immobilier',
    accent: 'from-yellow-600 to-amber-700',
    fontClass: 'font-serif font-bold',
    iconChar: '🏗️',
  },
  {
    name: 'Teranga Boutique',
    sector: 'commerce',
    sectorLabel: 'Commerce',
    accent: 'from-amber-500 to-yellow-600',
    fontClass: 'font-sans font-medium tracking-wide',
    iconChar: '🛍️',
  },
  {
    name: 'Faso Finance',
    sector: 'finance',
    sectorLabel: 'Finance',
    accent: 'from-stone-600 to-amber-700',
    fontClass: 'font-mono font-semibold tracking-widest',
    iconChar: '📊',
  },
  {
    name: 'Kéné Construction',
    sector: 'btp',
    sectorLabel: 'BTP',
    accent: 'from-orange-600 to-amber-800',
    fontClass: 'font-sans font-extrabold uppercase tracking-wider',
    iconChar: '⚒️',
  },
  {
    name: 'Ngoni Music',
    sector: 'culture',
    sectorLabel: 'Culture',
    accent: 'from-amber-400 to-orange-400',
    fontClass: 'font-serif italic font-semibold',
    iconChar: '🎵',
  },
  {
    name: 'Joliba Telecom',
    sector: 'telecom',
    sectorLabel: 'Télécom',
    accent: 'from-orange-500 to-yellow-500',
    fontClass: 'font-sans font-bold tracking-tight',
    iconChar: '📡',
  },
  {
    name: 'Bougouni Agro',
    sector: 'agriculture',
    sectorLabel: 'Agriculture',
    accent: 'from-lime-600 to-amber-600',
    fontClass: 'font-sans font-black uppercase tracking-wider',
    iconChar: '🌱',
  },
];

// Split into two rows for the marquee
const rowOne = clients.slice(0, 6);
const rowTwo = clients.slice(6, 12);

// ─── Logo Card ───────────────────────────────────────────────────────────────

function ClientLogoCard({ client }: { client: Client }) {
  return (
    <motion.div
      whileHover={{ scale: 1.06, y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={cn(
        'group relative flex flex-col items-center justify-center gap-2',
        'rounded-xl border border-border/50 bg-white/60 backdrop-blur-sm',
        'px-6 py-5 min-w-[220px] md:min-w-[260px] mx-3',
        'cursor-default select-none',
        'hover:border-amber-400/60 hover:shadow-lg hover:shadow-amber-500/10',
        'transition-colors duration-300'
      )}
    >
      {/* Gradient accent bar on top */}
      <div
        className={cn(
          'absolute inset-x-0 top-0 h-[3px] rounded-t-xl bg-gradient-to-r opacity-0',
          'group-hover:opacity-100 transition-opacity duration-300',
          client.accent
        )}
      />

      {/* Icon */}
      <span className="text-2xl mb-1 group-hover:scale-110 transition-transform duration-300">
        {client.iconChar}
      </span>

      {/* Business Name */}
      <span
        className={cn(
          'text-base md:text-lg text-foreground/80 text-center leading-tight',
          'group-hover:text-foreground transition-colors duration-300',
          client.fontClass
        )}
      >
        {client.name}
      </span>

      {/* Sector Badge */}
      <Badge
        variant="secondary"
        className={cn(
          'text-[10px] font-medium px-2 py-0 h-5 rounded-full',
          'bg-amber-50 text-amber-700 border-amber-200/60',
          'group-hover:bg-amber-100 group-hover:text-amber-800',
          'transition-colors duration-300'
        )}
      >
        {client.sectorLabel}
      </Badge>
    </motion.div>
  );
}

// ─── Marquee Row ─────────────────────────────────────────────────────────────

function MarqueeRow({
  items,
  direction = 'left',
  delay = 0,
}: {
  items: Client[];
  direction?: 'left' | 'right';
  delay?: number;
}) {
  const doubled = [...items, ...items];

  return (
    <div className="relative overflow-hidden w-full">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 z-10 bg-gradient-to-r from-background to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 z-10 bg-gradient-to-l from-background to-transparent pointer-events-none" />

      <motion.div
        className="flex w-max gap-0"
        animate={{ x: direction === 'left' ? ['0%', '-50%'] : ['-50%', '0%'] }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: 'loop',
            duration: 30,
            ease: 'linear',
            delay,
          },
        }}
      >
        {doubled.map((client, i) => (
          <ClientLogoCard key={`${client.name}-${i}`} client={client} />
        ))}
      </motion.div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function ClientLogos() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <section
      id="clients"
      ref={sectionRef}
      className="relative py-20 md:py-28 overflow-hidden"
    >
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-50/40 via-background to-background pointer-events-none" />

      {/* Decorative blobs */}
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-amber-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-orange-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Header ─────────────────────────────────────────────────── */}
        <motion.div
          className="text-center mb-14 md:mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Small label */}
          <motion.div
            className="inline-flex items-center gap-2 mb-5"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-amber-400" />
            <Badge
              variant="outline"
              className="border-amber-300/50 bg-amber-50/60 text-amber-700 text-xs px-3 py-1 rounded-full"
            >
              <Building2 className="w-3.5 h-3.5 mr-1.5" />
              Ils nous font confiance
            </Badge>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-amber-400" />
          </motion.div>

          {/* Title */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Nos Clients{' '}
            <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 bg-clip-text text-transparent">
              Nous Font
            </span>{' '}
            Confiance
          </h2>

          {/* Subtitle */}
          <motion.p
            className="mt-4 text-muted-foreground text-base md:text-lg max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Nous accompagnons des entreprises de tous secteurs à Bamako et au-delà.
            Voici quelques-unes des marques qui nous ont choisi.
          </motion.p>

          {/* Decorative sparkle */}
          <motion.div
            className="flex justify-center mt-6"
            initial={{ opacity: 0, rotate: -90 }}
            animate={isInView ? { opacity: 1, rotate: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Sparkles className="w-5 h-5 text-amber-400/60" />
          </motion.div>
        </motion.div>

        {/* ── Marquee Rows ───────────────────────────────────────────── */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <MarqueeRow items={rowOne} direction="left" delay={0.5} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <MarqueeRow items={rowTwo} direction="right" delay={0.8} />
          </motion.div>
        </div>

        {/* ── Bottom CTA hint ────────────────────────────────────────── */}
        <motion.div
          className="mt-14 md:mt-20 text-center"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <p className="text-sm text-muted-foreground">
            Rejoignez les entreprises qui{' '}
            <span className="text-amber-600 font-medium">nous font confiance</span>{' '}
            pour propulser leur marque.
          </p>
        </motion.div>
      </div>
    </section>
  );
}