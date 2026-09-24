# Product Showcase

A product catalog and shopping cart app built with Next.js. It lets users browse, search, filter, and sort products from the [DummyJSON](https://dummyjson.com) API, view full product details, and manage a shopping cart that persists across page reloads.

This is a front-end showcase: there is no backend of its own and no checkout flow. Product data comes from the public DummyJSON API; the cart is stored entirely in the browser (`localStorage`).

## Prerequisites

- **Node.js** 20.9 or later
- **npm** (the project is set up with `package-lock.json`)

## Installation and Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Set up environment variables (see below).

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Copy `.env.example` to `.env.local` and adjust if needed:

```bash
cp .env.example .env.local
```

| Variable                   | Required | Default                 | Description                                 |
| -------------------------- | -------- | ----------------------- | ------------------------------------------- |
| `NEXT_PUBLIC_API_BASE_URL` | No       | `https://dummyjson.com` | Base URL the app fetches product data from. |

No other environment variables are used. The app runs fine with no `.env.local` file at all, since the default already points at the public DummyJSON API.

## Commands

| Command                 | Description                                             |
| ----------------------- | ------------------------------------------------------- |
| `npm install`           | Install dependencies                                    |
| `npm run dev`           | Start the development server (with hot reload)          |
| `npm run build`         | Build the app for production                            |
| `npm start`             | Start the production server (run `npm run build` first) |
| `npm test`              | Run the test suite once                                 |
| `npm run test:watch`    | Run tests in watch mode                                 |
| `npm run test:coverage` | Run tests and print a coverage report                   |
| `npm run lint`          | Lint the codebase with ESLint                           |

## Project Structure

```
src/
  app/                  Next.js App Router routes (pages, layouts, loading/error states)
  components/
    ui/                 Generic, reusable UI primitives (Button, Card, Select, Dialog, Tabs, ...)
    query/              Shared loading / empty / error state components for data-fetching UI
    layout/              Site chrome: Header, Footer
  config/               Static app configuration (site metadata, API base URL/timeout)
  constants/            App-wide constants (e.g. page size)
  features/
    products/           Everything related to browsing and viewing products
      components/        Product list, product detail, filters, cards, skeletons, etc.
      hooks/              useProductFilters — reads/writes list filters to/from the URL
      constants/          Sort option definitions
      types/              Product and filter-state types
      utils/              Small pure helpers (e.g. stock-availability status)
    cart/                Everything related to the shopping cart
      components/         Cart page UI, add-to-cart button, cart badge
      hooks/              useAddToCart — adds an item and shows a toast
      store/              Zustand cart store (state + actions + selectors)
      types/              Cart item type
  hooks/                 Shared, non-feature-specific hooks (React Query hooks, useDebounce)
  lib/
    api/                 Axios client, API error type, endpoint path builders
    query/                React Query client setup and query-key builders
    format/               Formatting helpers (price, text)
    utils/                 Small generic utilities (the cn() className helper)
  providers/             App-wide providers mounted in the root layout (React Query, cart
                          hydration, scroll-to-top on navigation)
  services/              Functions that call the API client for a specific resource (products)
tests/                   All automated tests, mirroring the src/ structure (see below)
public/                 Static assets
```

### Tests live in a separate `tests/` directory

Tests are **not** colocated next to the source files they test. They live under a top-level `tests/` directory, organized to mirror `src/` by feature/category:

```
tests/
  cart/           Tests for src/features/cart
  products/       Tests for src/features/products
  components/     Tests for src/components
  hooks/          Tests for src/hooks
  utils/          Tests for src/lib (api client, query keys, formatting, cn)
  providers/      Tests for src/providers
  services/       Tests for src/services
  test-utils/     Shared test fixtures (e.g. a mock Product factory)
```

## Libraries and Tools

| Library                         | Purpose                                                                                                        |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| **Next.js** (App Router)        | Framework: routing, layouts, loading/error UI, dynamic imports                                                 |
| **React**                       | UI library                                                                                                     |
| **TypeScript**                  | Static typing across the whole codebase                                                                        |
| **Tailwind CSS**                | Utility-first styling                                                                                          |
| **TanStack React Query**        | Fetching, caching, and re-fetching product data from the API                                                   |
| **Zustand**                     | Lightweight client state store for the shopping cart, persisted to `localStorage`                              |
| **Axios**                       | HTTP client used by the API layer                                                                              |
| **tailwind-merge**              | Resolves conflicting Tailwind classes when a component's default classes are overridden via a `className` prop |
| **Jest**                        | Test runner                                                                                                    |
| **React Testing Library**       | Renders components and queries them the way a user would                                                       |
| **@testing-library/user-event** | Simulates realistic user interactions (typing, clicking, keyboard navigation) in tests                         |
| **ESLint**                      | Linting (Next.js's recommended config)                                                                         |

## Architecture

**Pages are thin.** Files under `src/app` mostly just lazy-load a feature component (via `next/dynamic`, with a skeleton `loading` fallback) and render it inside a page-level layout wrapper. The actual UI and logic live in `src/features`.

**Feature-based organization.** Each feature under `src/features` (`products`, `cart`) owns its own `components/`, `hooks/`, `types/`, and `utils/` (and, for `cart`, a `store/`), and exposes its public API through a single `index.ts` barrel file. Other code imports from `@/features/products` or `@/features/cart`, not from internal file paths.

**Two kinds of state:**

- **Server state** (product/category data from the API) is managed by **TanStack React Query**. Hooks in `src/hooks/product/use-product.ts` (e.g. `useProducts`, `useProductDetail`, `useSearchProducts`) wrap `useQuery` and call functions from the services layer. Query keys are centralized in `src/lib/query/query-keys.ts` so cache entries stay consistent.
- **Client state** (the shopping cart) is managed by **Zustand**. The store in `src/features/cart/store/cart-store.ts` holds cart items and exposes actions (`addItem`, `updateQuantity`, `removeItem`, `clearCart`) and selectors (`selectCartCount`, `selectCartSubtotal`, `selectIsProductInCart`). It's persisted to `localStorage` and rehydrated on the client via `StoreHydrator` in `src/providers`.

**Filters live in the URL.** The product list's search, category, and sort filters are read from and written to the URL's query string via `useProductFilters` (`src/features/products/hooks`), so a filtered view can be bookmarked or shared as a link, and the browser's back/forward buttons work as expected.

**API calls flow in one direction:** a component calls a React Query hook (`src/hooks`) → the hook calls a service function (`src/services`) → the service function calls the shared API client (`src/lib/api/client.ts`), which is a thin Axios wrapper that sets the base URL/timeout and maps failed requests to a typed `ApiError`.

## Where to find things

| Concern                           | Location                                                                                      |
| --------------------------------- | --------------------------------------------------------------------------------------------- |
| API calls                         | `src/services/*` (calls `src/lib/api/client.ts`)                                              |
| Server/remote state (React Query) | `src/hooks/product/use-product.ts`                                                            |
| Client state (cart)               | `src/features/cart/store/cart-store.ts`                                                       |
| URL-based filter state            | `src/features/products/hooks/use-product-filters.ts`                                          |
| Shared UI components              | `src/components/ui`, `src/components/query`, `src/components/layout`                          |
| Feature-specific components       | `src/features/products/components`, `src/features/cart/components`                            |
| Shared hooks                      | `src/hooks`                                                                                   |
| Feature-specific hooks            | `src/features/products/hooks`, `src/features/cart/hooks`                                      |
| Utilities                         | `src/lib` (generic) and `src/features/*/utils` (feature-specific)                             |
| Tests                             | `tests/` (mirrors `src/`, see [Project Structure](#tests-live-in-a-separate-tests-directory)) |
