# ModList

ModList is a community-driven marketplace built for automotive enthusiasts to buy, sell, and discover used car parts, aftermarket modifications, and accessories.

The goal is to replace the fragmented experience of jumping between Facebook groups, forums, WhatsApp chats, and generic marketplaces by providing a single platform tailored specifically for car communities.

Users can create listings, discover parts compatible with their vehicles, participate in discussions, and connect directly with other enthusiasts.

## What it offers

- Vehicle-aware marketplace for buying and selling parts
- Community forum for discussions, troubleshooting, and build showcases
- User profiles, favorites, and seller reputation
- Direct messaging between buyers and sellers
- Responsive web experience with a companion mobile application

## Architecture

ModList is built as a Turborepo monorepo with shared packages consumed by both the web and mobile applications.

```text
apps/
├── nextjs    → Web application
└── expo      → Mobile application

packages/
├── api       → tRPC routers
├── auth      → Authentication
├── db        → Drizzle schemas
├── ui        → Shared components
├── validators→ Shared Zod schemas
└── helpers   → Common utilities
```

## Technology

- Next.js 15
- React 19
- TypeScript
- tRPC
- PostgreSQL
- Drizzle ORM
- Tailwind CSS
- Expo
- Turborepo

## Core domains

### Marketplace

Listings are structured around vehicles rather than generic categories, allowing users to browse parts based on make, model, location, and category.

### Community

The forum enables enthusiasts to ask questions, share builds, and discover trending discussions around specific vehicles and modifications.

### Messaging

A dedicated chat system allows buyers and sellers to communicate without relying on external platforms.

## Local development

```bash
pnpm install

pnpm dev
```

### Useful commands

```bash
pnpm dev

pnpm build

pnpm lint

pnpm typecheck

pnpm db:push

pnpm db:studio
```

## Vision

ModList aims to become the operating system for automotive communities, combining marketplace discovery, community knowledge, and trusted peer-to-peer interactions into a single platform.

---

Built by Vimal Saraswat.
