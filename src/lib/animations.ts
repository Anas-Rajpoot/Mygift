import { Variants } from 'framer-motion'

/**
 * ANIMATION VARIANTS — Framer Motion
 * Use these consistently across all animated components
 */

/* ============================================
   ENTRANCE ANIMATIONS
   ============================================ */

export const fadeUp: Variants = {
  initial: { opacity: 0, y: 32 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
}

export const fadeDown: Variants = {
  initial: { opacity: 0, y: -32 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
}

export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
}

export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.94 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
}

export const slideInRight: Variants = {
  initial: { opacity: 0, x: 60 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
  },
}

export const slideInLeft: Variants = {
  initial: { opacity: 0, x: -60 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
  },
}

/* ============================================
   STAGGER ANIMATIONS (parent container)
   ============================================ */

export const stagger: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0,
    },
  },
}

export const staggerFast: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0,
    },
  },
}

export const staggerSlow: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0,
    },
  },
}

/* ============================================
   STEP TRANSITIONS (GiftLab + Diaspora)
   Direction-aware: dir > 0 = next, dir < 0 = prev
   ============================================ */

export const stepVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.45,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction > 0 ? -60 : 60,
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
}

/* ============================================
   HOVER STATES (use in whileHover prop)
   ============================================ */

export const hoverScale = {
  scale: 1.02,
  transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
}

export const hoverLift = {
  y: -4,
  transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
}

export const hoverGlow = {
  borderColor: 'rgba(201, 168, 76, 0.6)',
  transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
}

/* ============================================
   SCROLL ANIMATIONS (whileInView config)
   ============================================ */

export const viewportOnce = {
  once: true,
  margin: '-80px' as const,
}

/* ============================================
   EASING CURVE (premium feel)
   Use: ease: ease for consistent smoothness
   ============================================ */

export const ease = [0.16, 1, 0.3, 1] as const

/* ============================================
   CONTAINER ANIMATIONS (for grid layouts)
   ============================================ */

export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
}

export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
}

/* ============================================
   SPRING ANIMATIONS (for price counters, bounces)
   ============================================ */

export const springConfig = {
  type: 'spring' as const,
  stiffness: 100,
  damping: 10,
  mass: 1,
}

export const bounceConfig = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 8,
  mass: 0.5,
}

/* ============================================
   BACKDROP / OVERLAY ANIMATIONS
   ============================================ */

export const backdropVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
}
