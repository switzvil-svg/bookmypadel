# Design System Master File

> **LOGIC:** When building a specific page, first check `design-system/bookmypadel/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** BookMyPadel — padel stage/camp booking marketplace (two-sided: players + organizers)
**Category:** Travel-tech marketplace (Booking.com / Airbnb / GetYourGuide model), sports vertical
**Design Dials:** Variance 6/10 (Balanced / Modern) | Motion 6/10 (Standard) | Density 5/10 (Standard)

**Note on sourcing:** the `--design-system` search matched "Sports Team/Club" (team red/gold) and
no catalog color entry fit a padel travel-marketplace. Palette and type below are hand-tuned,
following the brief's own suggested direction (électrique blue / citron green) instead of the
red/gold sports-team match — documented here so the deviation is explicit, not silent.

---

## Global Rules

### Color Palette — "Court Blue / Citron"

Electric court-blue (padel court surface) as the brand/primary, citron-lime as the high-energy
accent/CTA (padel ball color), warm off-white paper background (keeps it premium/travel, not
gym-flyer). Dark ink for the "night court" dark sections (footer, organizer dashboard chrome).

| Role | Hex | CSS Variable | Usage |
|------|-----|--------------|-------|
| Primary | `#2F5BFF` | `--color-primary` | Brand, links, primary actions, active nav |
| Primary Hover | `#1E42E8` | `--color-primary-hover` | |
| On Primary | `#FFFFFF` | `--color-on-primary` | |
| Accent/CTA | `#C6F135` | `--color-accent` | Booking CTAs, badges ("Dernières places"), success micro-feedback |
| Accent Hover | `#B3DC22` | `--color-accent-hover` | |
| On Accent | `#0A1440` | `--color-on-accent` | Dark text on citron (contrast) |
| Ink (dark bg) | `#0A0E1A` | `--color-ink` | Dark sections: footer, org dashboard sidebar |
| Ink Soft | `#121828` | `--color-ink-soft` | Dark surface cards |
| Background | `#F7F8FC` | `--color-background` | App background |
| Paper | `#FFFFFF` | `--color-card` | Cards, sheets |
| Foreground | `#101426` | `--color-foreground` | Body text on light |
| Muted Foreground | `#5B6479` | `--color-muted-foreground` | Secondary text |
| Border | `#E1E5F0` | `--color-border` | |
| Success | `#16A34A` | `--color-success` | Confirmations |
| Warning | `#F59E0B` | `--color-warning` | Scarcity ("2 places restantes") |
| Destructive | `#E11D48` | `--color-destructive` | Errors, cancellations |
| Ring | `#2F5BFF` | `--color-ring` | Focus ring |

Full scales (Tailwind tokens `court`, `citron`, `ink`, `mist`) are defined in `tailwind.config.ts`.

**Color notes:** Blue = trust/travel-tech (Booking-blue lineage), citron = padel-ball energy and
the one color reserved for conversion moments (CTA buttons, price highlight, wishlist heart,
success states) so it stays high-signal instead of decorative.

### Typography — "Space Grotesk + DM Sans"

- **Heading/Display Font:** Space Grotesk (600/700) — confident, geometric, travel-tech, not a
  generic sport-condensed font; works at large hero sizes and in UI headers alike.
- **Body Font:** DM Sans (400/500/700) — highly readable at small sizes, neutral warmth.
- **Google Fonts:** loaded via `next/font/google` (not CSS `@import`, for perf/CLS).

```ts
// next/font
Space_Grotesk({ subsets: ["latin"], weight: ["500","600","700"], variable: "--font-display" })
DM_Sans({ subsets: ["latin"], weight: ["400","500","700"], variable: "--font-sans" })
```

Scale: hero 56/64px (mobile 34/40), h1 40px, h2 32px, h3 24px, h4 20px, body 16px, small 14px.
Line-height 1.1–1.2 for display, 1.5 for body. Base body must stay ≥16px (never <12px).

### Spacing Variables

*Density: 5/10 — Standard*

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | `4px` | Tight gaps |
| `--space-sm` | `8px` | Icon gaps, inline spacing |
| `--space-md` | `16px` | Standard padding |
| `--space-lg` | `24px` | Section padding |
| `--space-xl` | `32px` | Large gaps |
| `--space-2xl` | `48px` | Section margins |
| `--space-3xl` | `64px` | Hero padding |

### Shadow Depths

| Level | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 1px 2px rgba(16,20,38,0.06)` | Subtle lift |
| `--shadow-md` | `0 8px 20px -4px rgba(16,20,38,0.12)` | Cards, buttons |
| `--shadow-lg` | `0 20px 40px -8px rgba(16,20,38,0.18)` | Sticky booking module, dropdowns |
| `--shadow-xl` | `0 30px 60px -12px rgba(16,20,38,0.25)` | Modals, hero image, wizard step card |

Radius scale: `--radius-sm: 8px`, `--radius-md: 14px`, `--radius-lg: 20px`, `--radius-full: 999px`.
Cards/imagery lean toward the larger radii (Airbnb-like softness); buttons use `md`/`full` (pill).

---

## Component Specs

### Buttons

```css
.btn-primary {
  background: #2F5BFF; color: #fff; padding: 12px 24px; border-radius: 999px;
  font-weight: 600; transition: all 200ms cubic-bezier(.22,1,.36,1); cursor: pointer;
}
.btn-primary:hover { background: #1E42E8; transform: translateY(-1px); box-shadow: var(--shadow-md); }

.btn-cta {
  background: #C6F135; color: #0A1440; padding: 14px 28px; border-radius: 999px;
  font-weight: 700; transition: all 200ms ease; cursor: pointer;
}
.btn-cta:hover { background: #B3DC22; transform: translateY(-1px); }

.btn-secondary {
  background: transparent; color: #101426; border: 1.5px solid #E1E5F0;
  padding: 12px 24px; border-radius: 999px; font-weight: 600; transition: all 200ms ease;
}
.btn-secondary:hover { border-color: #2F5BFF; color: #2F5BFF; }
```

### Cards (stage/result cards — Airbnb-style)

```css
.card {
  background: #fff; border-radius: 20px; overflow: hidden;
  box-shadow: var(--shadow-sm); transition: box-shadow 250ms ease, transform 250ms ease;
}
.card:hover { box-shadow: var(--shadow-lg); transform: translateY(-4px); }
.card img { transition: transform 400ms cubic-bezier(.22,1,.36,1); }
.card:hover img { transform: scale(1.05); }
```

### Inputs / Search bar

```css
.input {
  padding: 12px 16px; border: 1px solid #E1E5F0; border-radius: 14px;
  font-size: 16px; transition: border-color 200ms ease, box-shadow 200ms ease;
}
.input:focus { border-color: #2F5BFF; outline: none; box-shadow: 0 0 0 3px rgba(47,91,255,0.15); }
```

### Modals / Sheets

```css
.modal-overlay { background: rgba(10,14,26,0.55); backdrop-filter: blur(4px); }
.modal { background: #fff; border-radius: 24px; padding: 32px; box-shadow: var(--shadow-xl); }
```

---

## Style Guidelines

**Style:** Premium travel-tech, warm-minimal with one energetic accent color (citron), generous
photography, soft large-radius cards, confident display type. Booking.com's density of
information + Airbnb's photographic warmth + GetYourGuide's "experience" framing.

**Keywords:** Premium, trustworthy, energetic accent, photographic, spacious, confident type.

**Key effects:** immersive photo cards with hover zoom, sticky compacting search bar, animated
step wizard, skeleton loaders, scarcity badges, scroll-reveal sections.

### Page Pattern

Hero-centric on marketing pages (home) → search-centric utility pattern on results (sticky
filters + sticky compact search) → conversion-centric on stage detail (sticky booking module) →
step-centric on the booking tunnel (animated wizard, one primary CTA per step).

---

## Motion (Framer Motion, since stack = Next.js/React — GSAP reserved only if a scroll-pin effect is needed)

- **Scroll reveal (sections):** `initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true, margin:"-80px"}} transition={{duration:0.5, ease:[0.22,1,0.36,1]}}`
- **Stagger children (grids/lists):** parent `staggerChildren:0.06`, child fade+y as above.
- **Card hover:** `whileHover={{y:-4}}` + CSS image `scale(1.05)` on hover (see `.card` above).
- **Wizard step transitions:** `AnimatePresence mode="wait"`, slide+fade `x: 24→0→-24`, `duration:0.3`.
- **Sticky search bar compaction:** driven by scroll position (Framer `useScroll`/`useTransform`),
  height/padding interpolated, not re-mounted (avoid layout thrash).
- **Skeleton loaders:** CSS shimmer gradient animation, `animation: shimmer 1.4s ease infinite`.
- **Success micro-feedback (favorite/booking confirm):** scale pop `0.8→1.15→1` spring, citron color flash.
- Respect `prefers-reduced-motion`: reduce/skip transform animations, keep opacity fades only.

---

## Anti-Patterns (Do NOT Use)

- ❌ Emojis as icons — use `lucide-react` SVG icons throughout
- ❌ Missing `cursor-pointer` on clickable elements
- ❌ Layout-shifting hovers (animate `transform`/`opacity`, not `width`/`height`)
- ❌ Low contrast text — maintain 4.5:1 minimum, especially citron-on-white (citron is for
  buttons/badges with dark text or dark backgrounds, never as body text color)
- ❌ Instant state changes — always transition 150–300ms
- ❌ Invisible focus states
- ❌ Generic red "sports team" look — this is a travel marketplace, not a club crest

## Pre-Delivery Checklist

- [ ] No emojis used as icons (lucide-react only)
- [ ] `cursor-pointer` on all clickable elements
- [ ] Hover states with smooth transitions (150-300ms)
- [ ] Text contrast 4.5:1 minimum (check citron usage)
- [ ] Focus states visible for keyboard navigation
- [ ] `prefers-reduced-motion` respected
- [ ] Responsive: 375px, 768px, 1024px, 1440px
- [ ] No content hidden behind sticky navbars/search bars
- [ ] No horizontal scroll on mobile
