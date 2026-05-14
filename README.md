# Geetha Krishna Portfolio

Production-ready portfolio built with **Next.js App Router**, **TypeScript**, and **Tailwind CSS v4**.

## Stack

- Next.js 16 (App Router)
- React 19
- Tailwind CSS v4
- GSAP + Framer Motion
- Vitest + Testing Library

## Scripts

```bash
npm run dev       # Start local development server
npm run lint      # Lint codebase
npm run test      # Run unit tests in watch mode
npm run test:ci   # Run unit tests once with coverage
npm run build     # Production build
npm run start     # Start production server
```

## Quality gates

The CI workflow runs the following checks on pull requests:

1. `npm run lint`
2. `npm run test:ci`
3. `npm run build`

## Environment

Set `NEXT_PUBLIC_SITE_URL` in your environment for canonical URLs, sitemap, and robots metadata.

Example:

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```
