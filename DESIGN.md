# DESIGN.md — MyGift.pk

**Design System Document** for AI agents building UI components.

## Brand Identity

**Brand**: MyGift.pk - Luxury Pakistani E-Commerce  
**Positioning**: Premium gifting destination for Pakistani diaspora + domestic market  
**Personality**: Elegant, exclusive, cultural, trustworthy  
**Tone**: Sophisticated but approachable, curated, premium without pretension

## Visual Language

### Color System

#### Primary Palette
- **Ink** (`#0f0608`) - Deep black, primary background
- **Surface** (`#1a0c10`) - Dark burgundy surface layer
- **Surface-2** (`#2a1a20`) - Lighter surface for depth
- **Gold** (`#c9a84c`) - Primary accent, warmth, luxury
- **Gold-Light** (`#d4b55e`) - Secondary gold for hover/disabled states

#### Semantic Colors
- **Cream** (`#f5f1ed`) - Primary text, high contrast on dark
- **Muted** (`#a8938a`) - Secondary text, subdued
- **Wine** (`#6b1b3d`) - Secondary accent, cultural richness
- **Rose** (`#d98a94`) - Tertiary accent, warm accent
- **Border** (`rgba(201,168,76,0.15)`) - Subtle borders at 15% gold opacity
- **Border-Hover** (`rgba(201,168,76,0.3)`) - 30% opacity on interactive states

#### Semantic Meanings
- **Gold**: Action, CTAs, affordances, hover states, premium features
- **Wine/Rose**: Secondary actions, success states, promotional content
- **Cream**: Body text, primary content
- **Muted**: Disabled states, secondary info, metadata

### Typography

#### Font Families
1. **Cormorant Garamond** (`--font-heading`)
   - Role: Hero headings, display, large titles
   - Weights: 300 (light), 400 (regular), 600 (semibold)
   - Style: Elegant, editorial, sophisticated

2. **Cinzel** (`--font-accent`)
   - Role: Labels, nav items, uppercase badges, callouts
   - Weights: 400 (regular), 600 (semibold)
   - Style: Geometric, capital-letter emphasis

3. **DM Sans** (`--font-sans`)
   - Role: Body text, UI elements, forms
   - Weights: 300 (light), 400 (regular), 500 (medium)
   - Style: Clean, modern, readable

#### Type Scale

| Element | Size | Weight | Line-height | Letter-spacing |
|---------|------|--------|-------------|-----------------|
| **H1 Hero** | 48px (desk) / 40px (mob) | Light (300) | 1.2 | -0.5px |
| **H2 Section** | 40px (desk) / 32px (mob) | Light (300) | 1.2 | -0.3px |
| **H3 Subsection** | 28px (desk) / 24px (mob) | Light (300) | 1.3 | 0 |
| **H4 Card title** | 20px | Regular (400) | 1.4 | 0 |
| **Body** | 16px | Regular (400) | 1.6 | 0 |
| **Small** | 14px | Regular (400) | 1.5 | 0 |
| **Label** | 12px | Medium (500) | 1.4 | 0.1em |
| **Eyebrow** | 10px | Medium (500) | 1.2 | 0.5em (caps) |

### Component Patterns

#### Buttons

**Primary CTA** (Gold filled)
```
- Background: var(--gold)
- Text: var(--ink), uppercase, font-accent, 12px, tracking-widest
- Padding: px-6 py-2.5 (16px vertical, 24px horizontal)
- Border-radius: 0px (sharp corners)
- Hover: background brightness +10%, cursor pointer
- Active: background brightness -10%
- Disabled: opacity-50, cursor-not-allowed
- Font: DM Sans medium or Cinzel semibold
```

**Outline CTA** (Gold border)
```
- Background: transparent
- Border: 1px solid var(--gold)
- Text: var(--gold), uppercase, font-accent
- Padding: px-6 py-2.5
- Hover: background-color var(--gold), text-var(--ink)
- Disabled: opacity-50, cursor-not-allowed
```

**Ghost CTA** (Text only)
```
- Background: transparent
- Border: none
- Text: var(--cream), underline on hover
- Hover: color var(--gold)
```

#### Cards / Panels

```
- Background: var(--surface)
- Border: 1px solid rgba(201,168,76,0.15) [var(--border)]
- Border-radius: 0px (sharp) or 4px (subtle rounded)
- Padding: 24px (p-6) or 32px (p-8)
- Shadow: none (use borders instead of shadows)
- Transition: border-color 300ms ease, all 300ms ease
- Hover border: rgba(201,168,76,0.3) [var(--border-hover)]
```

#### Input Fields

```
- Background: var(--surface)
- Border: 1px solid var(--border)
- Border-radius: 4px
- Padding: 12px 16px
- Text: var(--cream), 16px
- Placeholder: var(--muted), opacity-60
- Focus: border-color var(--gold), outline none
- Label: var(--gold), 10px, uppercase, tracking-widest, font-accent, margin-bottom 8px
- Error: border-color var(--rose), text-color var(--rose)
- Disabled: opacity-50, background var(--surface-2), cursor-not-allowed
```

#### Navigation

```
- Background: var(--ink)
- Links: var(--cream), 12px, uppercase, font-accent, tracking-widest
- Link spacing: 24px horizontal gap
- Hover: color var(--gold), transition 200ms
- Active: text-decoration underline, color var(--gold)
- Mobile: Hamburger menu, drawer slides in from left, full-height
```

#### Modals / Overlays

```
- Backdrop: rgba(0,0,0,0.7) or rgba(15,6,8,0.8)
- Panel: background var(--surface), border 1px var(--border)
- Header: uppercase eyebrow + title, font-heading light
- Close: X icon (lucide-react), 24x24px, hover color var(--gold)
- Entrance: fadeIn 300ms, or zoomIn 400ms from center
- Exit: fadeOut 200ms
```

#### Product Cards

```
Structure:
  - Image (16:9 aspect ratio, cover fit)
  - Product name (H4, cream)
  - Price (gold, 18px, medium weight)
  - Optional badge (sale/new, wine background, uppercase small)
  - CTA button (outline style)

Hover state:
  - Image: slight scale (105%), opacity transition
  - Border: gold color var(--border-hover)
  - Price: might highlight in brighter gold

Animation:
  - Initial: opacity 0
  - Entrance: fadeInUp or zoomIn on scroll
  - Delay: stagger + (index * 100ms)
```

## Layouts & Patterns

### Hero Section

```
Pattern:
  - Full-width container, 500px+ height
  - Background: image with gradient overlay (dark-to-darker)
  - Content: positioned at bottom or center
  - Eyebrow: var(--gold), small uppercase, tracking-wide
  - Heading: H1, light weight, cream
  - Subheading (optional): var(--muted), 18px
  - CTA: 1-2 buttons, primary + secondary
  - No visible borders, clean edges
  - Mobile: height 60vh, content bottom-aligned
```

### Section Header

```
Pattern:
  - Center-aligned container
  - Eyebrow: 10px uppercase, var(--gold), tracking-widest, font-accent
  - Heading: H2, cream, margin-top 12px
  - Description (optional): var(--muted), max-width 600px, center, margin-top 16px
  - Margin-bottom: 48px (py-12) before grid
```

### Grid Layout

```
Product Grid:
  - Desktop: 3 or 4 columns
  - Tablet (sm): 2 columns
  - Mobile: 1 column, full width
  - Gap: 24px (gap-6) or 32px (gap-8)
  - Responsive: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"

Feature Grid:
  - 2-3 columns on desktop
  - 1 column on mobile
  - Cards with icon + title + description
```

### Page Structure

```
Standard page:
  - Header (sticky, z-40)
  - Hero or banner section
  - Main content sections (py-12 lg:py-16 padding)
  - Footer (py-8 lg:py-12, dark ink background)
  - Container: max-w-7xl, mx-auto, px-4 lg:px-8

Section spacing:
  - Vertical: 48px (py-12) between major sections
  - Desktop adds: 64px (py-16)
  - Horizontal: 16px padding on mobile, 32px on desktop
```

## Animation & Motion

### Entrance Animations
- **Hero headings**: `fadeInDown` (page load)
- **Body content**: `fadeInUp` (scroll-triggered)
- **Card lists**: `fadeInUp` with stagger (150ms delay between items)
- **Section images**: `zoomIn` (scroll-triggered)
- **Modals**: `zoomIn` from center or `fadeIn`

### Interaction Animations
- **Button hover**: Color transition (200ms), slight scale (103%)
- **Link hover**: Color change to gold (200ms)
- **Card hover**: Border color change + scale (105%) on image
- **Form focus**: Border to gold (150ms ease)

### Speed Profile
- **Fast** (300ms): Button hovers, transitions, small interactions
- **Normal** (400-500ms): Modal entrance, section reveals
- **Slow** (800ms+): Page-load animations, hero sequences
- Easing: `ease-in-out` for most, `ease-out` for exits

### Best Practices
- Always respect `prefers-reduced-motion`
- No `infinite` animations except loaders
- Delay list items for stagger effect
- Don't layer too many animations
- Use `will-change` for smooth 60fps performance

## Responsive Design

### Breakpoints (Tailwind)
- **Mobile-first**: Default mobile, override at breakpoints
- `sm` (640px): Tablet landscape
- `lg` (1024px): Desktop
- `xl` (1280px): Large desktop

### Mobile Optimizations
- Touch targets: 44x44px minimum
- Buttons: Full-width or large on mobile
- Forms: Single column, larger inputs
- Images: `object-cover` to prevent layout shift
- Drawers: Full-height, slide from left/right
- Spacing: Reduced margins on mobile

### Desktop Enhancements
- Hover states (not available on touch)
- Wider layouts (2-3 columns vs 1)
- Tooltips, popovers
- Sidebar navigation (vs drawer)

## Dark Theme Principles

- ✅ **DO**: Use dark backgrounds (ink, surface) with light text (cream, muted)
- ✅ **DO**: Accent with warm colors (gold, wine, rose)
- ✅ **DO**: Use borders instead of shadows for depth
- ✅ **DO**: High contrast: cream on ink passes WCAG AAA
- ✅ **DO**: Reduce animation on reduced-motion users
- ✅ **DO**: Use 15-30% opacity overlays on dark
- ❌ **DON'T**: Use white or light gray text
- ❌ **DON'T**: Use drop shadows (use borders/outlines)
- ❌ **DON'T**: Use overly bright or neon colors
- ❌ **DON'T**: Forget about 2x pixel-density screens (test at 2x zoom)

## Brand Application

### Use of Gold
- CTA buttons (primary actions)
- Hover states on interactive elements
- Eyebrow labels (section headers)
- Accents in hero sections
- Active navigation items
- Borders on focus states

### Restricted Gold Usage
- Don't use gold as background for large areas
- Don't use gold for body text
- Don't scatter gold too liberally (less is more, luxury principle)
- Don't use gold on every element

### Cultural Design Considerations
- Pakistan-focused: Respect cultural aesthetics
- Diaspora appeal: Premium, international luxury feel
- Multi-currency: Support USD/GBP/AED (future)
- Gifting focus: Warm, celebratory tone without being cartoonish
- Trust signals: Testimonials, reviews, secure badges

## Accessibility

- **Color contrast**: Cream on ink = 11:1 ratio (WCAG AAA)
- **Font sizes**: Minimum 14px for body, 12px for labels
- **Interactive elements**: 44x44px tap targets
- **Form labels**: Always visible, associated with inputs
- **Motion**: Respect `prefers-reduced-motion` media query
- **Images**: Meaningful `alt` text, decorative `alt=""`
- **ARIA**: Use for modals, alerts, live regions
- **Focus states**: Visible outline or border highlight

## Technical Implementation (Next.js)

### CSS Variables
Define in `globals.css`:
```css
:root {
  --ink: #0f0608;
  --surface: #1a0c10;
  --gold: #c9a84c;
  /* ... */
}
```

### Tailwind Config
Extend `tailwind.config.ts`:
```ts
colors: {
  ink: 'var(--ink)',
  surface: 'var(--surface)',
  gold: 'var(--gold)',
  /* ... */
}
```

### Component Usage
```jsx
// Use Tailwind classes with CSS variables
<h1 className="font-heading text-4xl font-light text-[var(--cream)]">
  Title
</h1>

// Utility classes
<button className="border border-[var(--gold)] hover:bg-[var(--gold)] hover:text-[var(--ink)]">
  Action
</button>
```

### Images
- Always use Next.js `<Image>` component
- Set `fill` for containers, or explicit `width`/`height`
- Use `object-cover` for backgrounds
- Lazy-load below the fold
- Responsive `sizes` attribute

### Animations
- Use Framer Motion for complex interactions
- Use Tailwind `animate-*` for simple transitions
- Prefer CSS animations over JS when possible
- Test at 60fps on mobile

## When AI Builds Components

1. **Read this DESIGN.md first** to understand brand values
2. **Match color values exactly** from the palette section
3. **Follow typography scale** — don't make up font sizes
4. **Use Tailwind utilities** — write `className` not `style`
5. **Respect responsive breakpoints** — mobile-first approach
6. **Include proper `alt` text** on images
7. **Add ARIA attributes** for modals and interactive elements
8. **Test accessibility** — keyboard nav, screen readers
9. **Animate thoughtfully** — not everything needs animation
10. **Review before commit** — screenshot on mobile and desktop

---

**Last updated**: April 2026  
**Maintained by**: MyGift.pk Design System
