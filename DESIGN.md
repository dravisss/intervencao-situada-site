---
name: Intervenção Situada
colors:
  primary: "#1a6f69"
  primary-hover: "#135550"
  secondary: "#c48b4e"
  background: "#f7f4ec"
  surface: "#ffffff"
  text: "#2c3330"
  text-muted: "#646c68"
  border: "#e3decd"
  error: "#f44336"
  success: "#4caf50"
  info: "#26a69a"
  warning: "#ffb300"
typography:
  sans: "'Inter', system-ui, -apple-system, sans-serif"
  serif: "'Lora', Georgia, serif"
  mono: "'Menlo', 'Monaco', 'Courier New', monospace"
  body:
    fontFamily: Lora
    fontSize: 1.15rem
    fontWeight: 400
    lineHeight: 1.8
  heading:
    fontFamily: Inter
    fontWeight: 800
    lineHeight: 1.3
  label:
    fontFamily: Inter
    fontWeight: 600
    textTransform: uppercase
    letterSpacing: 1px
rounded:
  sm: 6px
  md: 12px
  lg: 16px
  xl: 20px
  pill: 30px
---

# Design System

## Overview
A warm, content-focused design for a philosophical-academic Portuguese-language guide on social systems intervention. Combines earthy tones (teal, gold, off-white) with serif body text for long-form reading. Supports light and dark themes via CSS custom properties.

## Colors
- **Primary** (#1a6f69): Deep teal for links, interactive states, accordion icons
- **Primary Hover** (#135550): Darker teal for link hover
- **Secondary** (#c48b4e): Warm gold for accents, blockquote borders, callout titles, family section markers, tab active states
- **Background** (#f7f4ec): Warm off-white page background
- **Surface** (#ffffff): White for cards, content blocks, callout backgrounds
- **Text** (#2c3330): Very dark green-gray body text
- **Text Muted** (#646c68): Secondary text, nav links, metadata
- **Border** (#e3decd): Light warm beige borders, dividers

### Dark Mode
- **Background** (#111414): Near-black with green tint
- **Surface** (#1e293b): Dark slate for cards
- **Text** (#e2e8f0): Light gray-blue
- **Primary** (#4fd1c5): Bright teal
- **Secondary** (#fbbf24): Bright amber
- **Border** (#2d3748): Dark blue-gray
- **Header BG**: rgba(17, 20, 20, 0.95)

### Callout Colors
| Type | Border | Light BG | Dark BG |
|------|--------|----------|---------|
| Info | #26a69a | #e0f2f1 | rgba(38,166,154,0.1) |
| Quote | #c48b4e | #f9f6f0 | rgba(251,191,36,0.05) |
| Tip | #4caf50 | #e8f5e9 | rgba(76,175,80,0.1) |
| Warning | #ffb300 | #fff8e1 | rgba(255,179,0,0.1) |
| Abstract | #607d8b | #eceff1 | rgba(96,125,139,0.1) |
| Important | #f44336 | #ffebee | rgba(244,67,54,0.1) |

### Landing Page (Dark Elegant)
- **Background**: #0f1012
- **Gold Accent**: #c9a263
- **Card BG**: rgba(255,255,255,0.03) with 1px #2a2b30 border
- **Card Glow**: radial-gradient with gold at 25% opacity

## Typography
- **Headings (h1-h6)**: Inter, extra-bold (800), line-height 1.3
- **Body**: Lora, regular (400), 1.15rem, line-height 1.8
- **Labels/Uppercase**: Inter, 600, uppercase with 1px letter-spacing
- **Nav Links**: Inter, 600, 0.95rem
- **Code**: Menlo/Monaco monospace, 0.9em
- **Hero Title (article pages)**: Inter 800, 4rem, white on teal gradient
- **Hero Title (home page)**: Inter 800, 4.5rem, gradient text (teal to gold)
- **Callout Title**: Inter 800, 1.2rem, uppercase, colored per type

## Spacing
- **Container max-width**: 800px
- **Content block padding**: 40px
- **Callout padding**: 2em
- **Section padding**: 80px
- **Vertical blocks gap**: 40px
- **Cards grid gap**: 30px
- **Body line-height**: 1.8
- **Paragraph margin**: 1.5em bottom

## Components
- **Header**: Sticky, backdrop-filter blur(10px), 20px padding, bottom border
- **Hero (article)**: Teal gradient background (135deg, #0e2725, #1a6f69), angled bottom edge via ::after, white text
- **Content Blocks**: Surface bg, 1px border, 16px radius, subtle shadow
- **Cards Grid**: Auto-fit responsive grid (minmax 350px), 16px radius, hover lifts 10px with larger shadow
- **Nav Cards**: Surface bg, border, 16px radius; hover lifts with primary border color
- **Accordions**: Native `<details>`, 12px radius, + rotates to × on open
- **Callouts**: 6 types (info/quote/tip/warning/abstract/important), 12px radius, 6px colored left border, uppercase title
- **Tables**: Scroll wrapper, 12px radius, striped header (uppercase, 1px letter-spacing), 20px cell padding
- **Code Blocks**: Dark theme (#1a1b26), 12px radius, 2em padding, monospace
- **Blockquotes**: 4px gold left border, italic, surface bg, 0 8px 8px 0 radius
- **Family Sections**: 8px gold left border, 20px radius, 50px padding, subtle shadow
- **Fancy Canvas**: Multi-section card for tension mapping, 12px radius, 2px border, info-bg header
- **Buttons/Elegant**: Pill-shaped (30px radius), outline variant (gold border)
- **Tabs**: Pill-shaped (30px radius), active state with gold border on dark bg
- **Theme Toggle / Back-to-Top**: Fixed circular (50% radius), 55px, surface bg, hover lifts
- **Flashcards**: Progress bar, scene box with border, type badges (30px radius), tooltips

## Shadows
- **Cards**: 0 20px 40px rgba(0,0,0,0.08) on hover
- **Content blocks**: 0 4px 15px rgba(0,0,0,0.02)
- **Accordions**: 0 5px 15px rgba(0,0,0,0.05) on hover
- **Callouts**: 0 4px 15px rgba(0,0,0,0.03)
- **Tables**: 0 5px 20px rgba(0,0,0,0.05)
- **Code blocks**: 0 10px 30px rgba(0,0,0,0.2)
- **Theme buttons**: 0 5px 15px rgba(0,0,0,0.1)
- **Tooltips**: 0 4px 15px rgba(0,0,0,0.15)

## Animations
- **Theme transition**: background-color and color, 0.3s
- **Link hover**: color, 0.2s
- **Card hover**: transform and box-shadow, 0.3s
- **Accordion expand**: box-shadow 0.3s, icon rotate 0.3s
- **Tab/content fade-in**: fadeIn keyframe, 0.4s (opacity 0→1, translateY 10px→0)
- **Back-to-top**: opacity and transform, 0.2s
- **Theme toggle hover**: transform and box-shadow, 0.2s

## Responsive
- **Breakpoint**: 768px
- Reduces hero titles, stacks grids to single column, reduces FAB buttons to 45px, reduces family section padding

## Dark Mode
- Toggled via `data-theme="dark"` attribute on body
- Stored in localStorage, respects `prefers-color-scheme`
- Landing page uses `.dark-theme` class as permanent dark mode

## Do's and Don'ts
- Do use serif (Lora) for long-form article body text to optimize readability
- Do use the teal primary color sparingly for interactive elements only
- Do use the gold secondary color for visual accents and emphasis
- Do use uppercase + letter-spacing for labels, callout titles, and table headers
- Don't mix heading font (sans) with body font (serif) inappropriately
- Don't use the elegant landing page theme on article pages
- Don't apply border-radius inconsistently within the same view
- Do maintain proper contrast in both light and dark themes
- Do use callouts to break up long text, not for primary content
