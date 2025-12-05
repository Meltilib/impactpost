# Onboarding Asset Pipeline & Performance (2025-12-01 10:00)

## Overview
- Cut onboarding artwork payload from ~6.6MB of PNGs to ~0.63MB of optimized JPEGs.
- Added reproducible build-time optimizer (Sharp with sips fallback) and asset size budgets wired into CI scripts.
- Enabled Hermes explicitly and Metro `inlineRequires` to reduce startup cost; pointed onboarding screens to optimized assets.

## Problem
Onboarding PNGs bloated Metro export/build times and first-render decode costs. There was no guardrail to stop new oversized assets from landing.

## What Changed (with file references)
- **scripts/optimize-onboarding-images.js** — NEW build-time optimizer (≤1200px width, JPEG for non-alpha, removes superseded PNGs, Sharp+sips fallback).
- **scripts/check-onboarding-size.js** — NEW size budget check (900KB/file, 2MB total; env overrides).
- **package.json** — `assets:optimize` uses new script; `assets:check` added to `ci`; added devDependency `sharp`.
- **metro.config.js** — NEW; enables `inlineRequires`.
- **app.config.ts** — Sets `jsEngine: "hermes"` explicitly.
- **AGENTS.md** — Documents new asset commands.
- **app/(onboarding)/hero.tsx**, **app/(onboarding)/benefits.tsx**, **app/index.tsx** — Point to optimized JPEGs.
- **assets/onboarding/** — Optimized files:
  - `1-parent-holdingtwo.jpg` (~155KB)
  - `2-nuti-neural-heart.jpg` (~123KB)
  - `nuti_mascot_heart.jpg` (~111KB)
  - `welcome-phone.jpg` (~228KB)

## Validation
- `node scripts/optimize-onboarding-images.js`
- `node scripts/check-onboarding-size.js`

## Follow-ups
- Run `npm install` to add `sharp` to `package-lock.json` (network was restricted here).
- Commit optimized JPEGs and keep `assets:check` in CI to prevent regressions.
