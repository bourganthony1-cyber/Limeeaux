---
name: Lumiere Motion
colors:
  surface: '#121414'
  surface-dim: '#121414'
  surface-bright: '#37393a'
  surface-container-lowest: '#0c0f0f'
  surface-container-low: '#1a1c1c'
  surface-container: '#1e2020'
  surface-container-high: '#282a2b'
  surface-container-highest: '#333535'
  on-surface: '#e2e2e2'
  on-surface-variant: '#c4c5d9'
  inverse-surface: '#e2e2e2'
  inverse-on-surface: '#2f3131'
  outline: '#8e90a2'
  outline-variant: '#434656'
  surface-tint: '#b8c3ff'
  primary: '#b8c3ff'
  on-primary: '#002388'
  primary-container: '#2e5bff'
  on-primary-container: '#efefff'
  inverse-primary: '#124af0'
  secondary: '#c6c6c6'
  on-secondary: '#303030'
  secondary-container: '#474747'
  on-secondary-container: '#b5b5b5'
  tertiary: '#c8c6c5'
  on-tertiary: '#313030'
  tertiary-container: '#6e6d6d'
  on-tertiary-container: '#f3f0ef'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#dde1ff'
  primary-fixed-dim: '#b8c3ff'
  on-primary-fixed: '#001356'
  on-primary-fixed-variant: '#0035be'
  secondary-fixed: '#e2e2e2'
  secondary-fixed-dim: '#c6c6c6'
  on-secondary-fixed: '#1b1b1b'
  on-secondary-fixed-variant: '#474747'
  tertiary-fixed: '#e5e2e1'
  tertiary-fixed-dim: '#c8c6c5'
  on-tertiary-fixed: '#1c1b1b'
  on-tertiary-fixed-variant: '#474646'
  background: '#121414'
  on-background: '#e2e2e2'
  surface-variant: '#333535'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
  title-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 16px
  margin-mobile: 20px
  margin-desktop: 40px
---

## Brand & Style

The design system is anchored in a **Premium Modern** aesthetic, blending high-tech utility with executive-level sophistication. It evokes the feeling of a private concierge service—effortless, silent, and precise.

The visual direction utilizes **Dark-Mode-First** principles to reduce eye strain during nighttime travel while creating a "theatre" effect where content and maps take center stage. We combine **Minimalism** with subtle **Glassmorphism** to imply depth and technical "lightness." Every interaction should feel like a high-end digital cockpit: responsive, purposeful, and expensive.

## Colors

The palette is intentionally restricted to emphasize premium quality.

- **Primary (Electric Blue):** Used exclusively for high-priority actions (Request Ride, Confirm), active states, and navigation indicators. It provides a sharp contrast against the dark void.
- **Deep Blacks & Charcoals:** The background uses `#000000` for true depth, while cards and containers use `#121212` and `#1C1C1E` to create subtle hierarchy and separation without breaking the dark aesthetic.
- **Pure White:** Reserved for primary typography and iconography to ensure AAA accessibility and a crisp, "glowing" effect.

## Typography

This design system utilizes **Inter** for its geometric precision and exceptional legibility at small sizes.

- **Headlines:** Use tight letter-spacing and bold weights to communicate authority.
- **Body:** Standard weights with generous line-heights ensure readability for address inputs and trip details.
- **Micro-copy:** Use `label-caps` for secondary metadata (e.g., license plates, estimated time of arrival) to create a distinct visual contrast from primary interaction points.

## Layout & Spacing

The layout follows a **fluid grid** model optimized for high-density information.

- **Mobile:** A 4-column grid with 20px outer margins. Elements should leverage vertical stacking to maximize reachability in the "thumb zone."
- **Desktop/Tablet:** A 12-column grid. The map remains the base layer, with UI controls living in a 400px wide sidebar or floating "glass" modules.
- **Rhythm:** All spacing is derived from an 8px base unit. Consistent 16px gutters ensure that modular cards (e.g., "Select Ride Type") feel connected but distinct.

## Elevation & Depth

Depth is achieved through **Luminance and Blurs** rather than traditional drop shadows.

1.  **Level 0 (Base):** Pure Black (#000000). The foundation layer (Map or Background).
2.  **Level 1 (Surface):** Charcoal (#121212). Persistent UI elements like bottom sheets.
3.  **Level 2 (Glass Overlays):** Semi-transparent white (5-10% opacity) with a 20px backdrop blur. Used for floating map controls and temporary modals.
4.  **Borders:** Instead of shadows, use 1px inner strokes (`#FFFFFF` at 10% opacity) to define element edges. This mimics the light catching the edge of a physical glass panel.

## Shapes

The shape language is modern and approachable, utilizing a **Rounded (0.5rem / 8px)** base.

- **Containers & Cards:** Use a 16px (`rounded-lg`) or 24px (`rounded-xl`) corner radius to create a soft, premium feel that offsets the technicality of the dark theme.
- **Action Buttons:** Use a 12px radius for a sleek, "automotive" appearance.
- **Inputs:** Maintain a consistent 12px radius to match buttons, creating a cohesive "form-factor" across the app.

## Components

- **Buttons:** Primary buttons use the Electric Blue fill with white text. Secondary buttons should be transparent with a white 1px border.
- **Glass Cards:** Use for trip summaries and ride options. Require a `backdrop-filter: blur(20px)` and a subtle 1px border (`rgba(255,255,255,0.1)`).
- **Inputs:** Dark backgrounds (`#1C1C1E`) with clear white text. Focus states should transition the border color to Electric Blue.
- **Chips:** Small, pill-shaped indicators for ride attributes (e.g., "Fastest," "Eco-friendly"). Use low-opacity Electric Blue backgrounds with bright blue text.
- **Selection List:** For choosing vehicle types, use horizontal cards with high-quality PNG vehicle renders that "pop" against the dark background.
- **Map Markers:** Electric Blue pulses for the user's location; pure white for destination pins to ensure maximum contrast.