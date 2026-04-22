---
version: alpha
name: Raffaele Vitale Portfolio + CRYBU Interface
description: Dual-surface design system that combines a warm editorial portfolio with a high-density enterprise AI operations cockpit.
colors:
  primary: "#1A1A1A"
  secondary: "#6B6B6B"
  tertiary: "#F73C1C"
  neutral: "#FAFAF8"
  neutral-alt: "#F2F1ED"
  border: "#E5E3DD"

  white: "#FFFFFF"
  black: "#000000"

  portfolio-accent: "#C45D3E"
  portfolio-accent-hover: "#B04E32"
  portfolio-accent-soft: "#E8A08A"
  portfolio-text: "#1A1A1A"
  portfolio-text-muted: "#6B6B6B"
  portfolio-text-faint: "#A3A3A3"
  portfolio-bg: "#FAFAF8"
  portfolio-bg-alt: "#F2F1ED"
  portfolio-bg-dark: "#141414"
  portfolio-card-dark: "#2B2B2B"
  portfolio-border: "#E5E3DD"

  enterprise-bg-dark: "#111111"
  enterprise-surface-dark: "#1A1A1A"
  enterprise-surface-dark-elevated: "#1E1E1E"
  enterprise-surface-dark-soft: "#242424"
  enterprise-text-dark: "#FFFFFF"
  enterprise-text-dark-secondary: "#CCCCCC"
  enterprise-text-dark-muted: "#888888"
  enterprise-text-dark-faint: "#555555"
  enterprise-border-dark: "#FFFFFF"
  enterprise-border-dark-soft: "#FFFFFF"

  enterprise-bg-light: "#F0F0F0"
  enterprise-surface-light: "#FFFFFF"
  enterprise-surface-light-soft: "#F5F5F5"
  enterprise-text-light: "#111111"
  enterprise-text-light-secondary: "#444444"
  enterprise-text-light-muted: "#777777"
  enterprise-text-light-faint: "#BBBBBB"
  enterprise-border-light: "#000000"
  enterprise-border-light-soft: "#000000"

  success: "#10B981"
  warning: "#F59E0B"
  danger: "#F73C1C"
  danger-hover: "#E63518"
  danger-bright: "#FF5638"
  info-violet: "#8B5CF6"
  info-magenta: "#EC4899"

  success-soft: "#10B981"
  warning-soft: "#F59E0B"
  danger-soft: "#F73C1C"
  danger-soft-strong: "#F73C1C"
  black-soft-4: "#000000"
  black-soft-6: "#000000"
  black-soft-8: "#000000"
  white-soft-4: "#FFFFFF"
  white-soft-6: "#FFFFFF"
  white-soft-8: "#FFFFFF"

typography:
  portfolio-display-hero:
    fontFamily: "Instrument Serif"
    fontSize: 112px
    fontWeight: 400
    lineHeight: 0.92
    letterSpacing: -0.03em
  portfolio-display-section:
    fontFamily: "Instrument Serif"
    fontSize: 72px
    fontWeight: 400
    lineHeight: 1
    letterSpacing: -0.02em
  portfolio-body-lg:
    fontFamily: "DM Sans"
    fontSize: 24px
    fontWeight: 400
    lineHeight: 1.55
  portfolio-body-md:
    fontFamily: "DM Sans"
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.65
  portfolio-body-sm:
    fontFamily: "DM Sans"
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.5
  portfolio-label-caps:
    fontFamily: "DM Sans"
    fontSize: 11px
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: 0.2em
  portfolio-meta-mono:
    fontFamily: "DM Mono"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.3

  enterprise-title-xl:
    fontFamily: "Lexend"
    fontSize: 34px
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: -0.01em
  enterprise-title-lg:
    fontFamily: "Lexend"
    fontSize: 20px
    fontWeight: 700
    lineHeight: 1.3
  enterprise-title-md:
    fontFamily: "Lexend"
    fontSize: 15px
    fontWeight: 700
    lineHeight: 1.35
  enterprise-body-md:
    fontFamily: "Lexend"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
  enterprise-body-sm:
    fontFamily: "Lexend"
    fontSize: 13px
    fontWeight: 500
    lineHeight: 1.45
  enterprise-label-xs:
    fontFamily: "Lexend"
    fontSize: 11px
    fontWeight: 600
    lineHeight: 1.35
  enterprise-metadata:
    fontFamily: "JetBrains Mono"
    fontSize: 11px
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: 0.02em

spacing:
  unit: 8px
  nano: 2px
  micro: 4px
  xs: 6px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  xl2: 32px
  xl3: 40px
  xl4: 64px
  section-vertical: 112px
  container-horizontal: 24px
  chat-compose-padding: 14px
  layout-header-height: 52px
  layout-promo-height: 38px
  layout-subbar-height: 48px
  layout-sidebar-width: 276px
  layout-sidepanel-width: 260px
  layout-chat-max-width: 48rem

rounded:
  none: 0px
  xs: 4px
  sm: 6px
  md: 8px
  lg: 10px
  xl: 12px
  xl2: 14px
  xl3: 16px
  xl4: 18px
  xl5: 20px
  full: 9999px

radii:
  card: "{rounded.xl3}"
  panel: "{rounded.xl5}"
  input: "{rounded.xl}"
  chip: "{rounded.full}"

shadows:
  none: "none"
  nav-float: "0 1px 8px rgba(0, 0, 0, 0.04), 0 0 1px rgba(0, 0, 0, 0.06)"
  card-soft: "0 4px 24px rgba(0, 0, 0, 0.08)"
  card-strong: "0 24px 48px rgba(0, 0, 0, 0.20)"
  dark-overlay: "0 24px 48px rgba(0, 0, 0, 0.40)"
  accent-glow: "0 12px 32px rgba(247, 60, 28, 0.20)"
  success-glow: "0 0 0 1px rgba(16, 185, 129, 0.25), 0 8px 24px rgba(16, 185, 129, 0.18)"

elevation:
  level-0: "{shadows.none}"
  level-1: "{shadows.nav-float}"
  level-2: "{shadows.card-soft}"
  level-3: "{shadows.card-strong}"
  level-4: "{shadows.dark-overlay}"

motion:
  duration-fast: 150ms
  duration-standard: 240ms
  duration-medium: 300ms
  duration-slow: 500ms
  duration-marquee: 40s
  duration-aurora-drift: 25s
  duration-aurora-shift: 18s
  duration-glow-float: 12s
  easing-standard: "cubic-bezier(0.22, 1, 0.36, 1)"
  easing-emphasized: "cubic-bezier(0.4, 0, 0.2, 1)"
  easing-linear: "linear"

layout:
  portfolio-max-width: 80rem
  enterprise-content-max-width: 96rem
  mobile-breakpoint: 768px
  desktop-breakpoint: 1024px

components:
  nav-pill-portfolio:
    backgroundColor: "{colors.enterprise-surface-light}"
    textColor: "{colors.portfolio-text}"
    typography: "{typography.portfolio-body-sm}"
    rounded: "{rounded.full}"
    padding: "{spacing.sm}"
    height: 40px

  button-primary-portfolio:
    backgroundColor: "{colors.portfolio-text}"
    textColor: "{colors.white}"
    typography: "{typography.portfolio-body-md}"
    rounded: "{rounded.full}"
    padding: "{spacing.lg}"
    height: 56px
  button-primary-portfolio-hover:
    backgroundColor: "{colors.portfolio-accent}"

  button-secondary-portfolio:
    backgroundColor: "{colors.portfolio-bg}"
    textColor: "{colors.portfolio-text}"
    typography: "{typography.portfolio-body-md}"
    rounded: "{rounded.full}"
    padding: "{spacing.lg}"
    height: 56px

  card-profile-portfolio:
    backgroundColor: "{colors.portfolio-card-dark}"
    textColor: "{colors.white}"
    typography: "{typography.portfolio-body-sm}"
    rounded: "{rounded.xl3}"
    padding: "{spacing.xl2}"

  shell-header-enterprise-dark:
    backgroundColor: "{colors.enterprise-surface-dark}"
    textColor: "{colors.enterprise-text-dark}"
    typography: "{typography.enterprise-body-sm}"
    height: "{spacing.layout-header-height}"
    padding: "{spacing.md}"

  shell-header-enterprise-light:
    backgroundColor: "{colors.enterprise-surface-light}"
    textColor: "{colors.enterprise-text-light}"
    typography: "{typography.enterprise-body-sm}"
    height: "{spacing.layout-header-height}"
    padding: "{spacing.md}"

  badge-live-enterprise:
    backgroundColor: "rgba(16, 185, 129, 0.12)"
    textColor: "{colors.success}"
    typography: "{typography.enterprise-label-xs}"
    rounded: "{rounded.full}"
    padding: "{spacing.sm}"

  button-primary-enterprise:
    backgroundColor: "{colors.danger}"
    textColor: "{colors.white}"
    typography: "{typography.enterprise-body-sm}"
    rounded: "{rounded.xl}"
    padding: "{spacing.lg}"
    height: 40px
  button-primary-enterprise-hover:
    backgroundColor: "{colors.danger-hover}"

  input-enterprise:
    backgroundColor: "{colors.enterprise-surface-light}"
    textColor: "{colors.enterprise-text-light}"
    typography: "{typography.enterprise-body-md}"
    rounded: "{rounded.xl3}"
    padding: "{spacing.chat-compose-padding}"
    height: 56px

  chat-bubble-bot-dark:
    backgroundColor: "{colors.enterprise-surface-dark-elevated}"
    textColor: "{colors.enterprise-text-dark-secondary}"
    typography: "{typography.enterprise-body-md}"
    rounded: "{rounded.xl}"
    padding: "{spacing.lg}"

  chat-bubble-user-dark:
    backgroundColor: "{colors.enterprise-surface-dark-soft}"
    textColor: "{colors.white}"
    typography: "{typography.enterprise-body-md}"
    rounded: "{rounded.xl}"
    padding: "{spacing.lg}"

  chat-bubble-user-light:
    backgroundColor: "{colors.danger}"
    textColor: "{colors.white}"
    typography: "{typography.enterprise-body-md}"
    rounded: "{rounded.xl}"
    padding: "{spacing.lg}"

  panel-params-enterprise-dark:
    backgroundColor: "{colors.enterprise-surface-dark}"
    textColor: "{colors.enterprise-text-dark}"
    typography: "{typography.enterprise-body-sm}"
    rounded: "{rounded.none}"
    width: "{spacing.layout-sidepanel-width}"

  panel-params-enterprise-light:
    backgroundColor: "{colors.enterprise-surface-light}"
    textColor: "{colors.enterprise-text-light}"
    typography: "{typography.enterprise-body-sm}"
    rounded: "{rounded.none}"
    width: "{spacing.layout-sidepanel-width}"
---

## Overview

This system intentionally blends two visual personalities that coexist in one product ecosystem.

- A warm editorial portfolio surface emphasizes craft, identity, and narrative pacing.
- A dense enterprise control surface emphasizes speed, operativity, and at-a-glance status.

The shared principle is clarity under motion: even with animated gradients, live indicators, and dynamic modules, hierarchy stays immediately legible.

## Colors

Color is split into two operational palettes.

- Portfolio palette: warm neutrals, terracotta accent, and restrained contrast. It feels tactile and human.
- Enterprise palette: monochrome dark and light surfaces with a high-signal orange accent, plus semantic green and amber for state.

Semantic status usage is strict.

- Green communicates live/healthy/runtime activity.
- Orange-red drives primary action and urgency.
- Amber marks setup or pending conditions.
- Violet and magenta are supportive chart accents, not primary action colors.

Translucent overlays and alpha borders are essential to the system identity and should be preserved in both themes.

## Typography

Typography is role-based, not decorative.

- Portfolio display text uses Instrument Serif for expressive editorial contrast.
- Portfolio body and navigation use DM Sans to keep reading smooth and modern.
- Metadata and technical microcopy use DM Mono only when precision is needed.
- Enterprise UI uses Lexend for all operational content because it stays readable at small sizes and high density.
- Enterprise timestamps and diagnostic labels use JetBrains Mono to signal technical context.

Type hierarchy should preserve the existing tension between expressive serif headlines and strict sans operational text.

## Layout & Spacing

The portfolio experience is spacious and vertical, with long section rhythm and generous breathing room around hero content.

The enterprise experience is shell-based and dimensioned.

- Fixed header, promo strip, and subbar heights establish stable scanning rails.
- Sidebar and parameters panel widths are locked to keep cognitive mapping stable.
- Chat and dashboard zones remain fluid inside this shell.

Spacing follows an 8px-root rhythm with micro offsets for controls and dense list rows.

## Elevation & Depth

Depth is achieved differently across surfaces.

- Portfolio: ambient aurora gradients, fine grain texture, soft glows, and minimal shadow weight.
- Enterprise: tonal layering, low-alpha hairline borders, and selective heavy overlays only for modals and floating panels.

Live states should feel luminous through soft glows, while base containers remain flat enough for data readability.

## Shapes

Shape language is rounded but disciplined.

- Portfolio primary actions and navigation pills are fully rounded.
- Portfolio cards favor medium-large corner radii.
- Enterprise controls use tighter radii for density and precision.
- Chips, toggles, and status pills remain fully rounded.

Mixing sharp and rounded geometry in the same view should be avoided unless the sharp edge is a deliberate panel boundary.

## Components

Component behavior should follow these intent rules.

- Portfolio CTAs are high-contrast and cinematic, with clear hover inversion.
- Enterprise primary actions use orange-red with short, crisp transitions.
- Sidebar rows, module chips, and chat bubbles rely on subtle border and tone shifts, not heavy color fills.
- Parameter panels and shell headers are structural anchors and must retain strict alignment.
- Live badges and operational indicators should stay small, bright, and consistently green.

## Do's and Don'ts

- Do preserve the dual-surface identity: editorial warmth for portfolio, operational precision for enterprise.
- Do keep status colors semantic and consistent across modules.
- Do keep motion short and meaningful; prioritize clarity over spectacle in enterprise flows.
- Do maintain high text contrast in both themes, especially in dense side panels.
- Don't use violet or magenta as primary CTA colors.
- Don't flatten all shadows equally; portfolio and enterprise depth models are intentionally different.
- Don't over-expand the type scale in enterprise contexts where scanning speed matters.