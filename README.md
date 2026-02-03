# Recommend - Next.js Application

## **Overview**

**Recommend** is a modern Next.js application designed for scalable, professional use. It leverages a structured CI/CD workflow, strong code quality tooling, centralized logging, and production-ready practices to ensure reliable development, deployment, and monitoring.

---

## **Table of Contents**

1. [Project Setup](#project-setup)
2. [Tooling](#tooling)
3. [State Management](#state-management)
4. [Testing](#testing)
5. [Logger](#logger)
6. [CI/CD Workflow](#cicd-workflow)
7. [Branching Strategy](#branching-strategy)
8. [Environments](#environments)
9. [Deployment](#deployment)

---

## **Project Setup**

### Install Dependencies

```bash
pnpm install
```

### Run Development Server

```bash
pnpm dev
```

### Build

```bash
pnpm build
```

### Start Production Server

```bash
pnpm start
```

---

## **Tooling**

* **Framework**: Next.js
* **Runtime**: Node.js
* **Package Manager**: pnpm
* **Code Quality**: ESLint, Prettier, TypeScript
* **Git Hooks**: Husky + lint-staged (optional pre-commit checks)
* **Icons**: Lucide React
* **Logging & Error Tracking**:

  * `console.log` in development
  * Sentry in production

---

## **State Management**

* **Form State**: React Hook Form
* **Server State**: TanStack Query (React Query)

---

## **Testing**

* **Unit & Integration**: Jest + React Testing Library
* **End-to-End (E2E)**: Cypress

Run tests:

```bash
pnpm test
pnpm test:watch
pnpm e2e
```

---

## **Logger**

A centralized logger for environment-aware logging.

```ts
import { logger } from '@/lib/logger'

logger.info('Page loaded', { route: '/home' })
logger.warn('Deprecated API used')
logger.error('Something went wrong')
logger.error(new Error('Network request failed'), { userId: 123 })
```

**Features:**

* Logs `info`, `warn`, `error` levels
* Uses **console** in development
* Sends logs to **Sentry** in production
* Supports optional extra context for debugging

---

## **CI/CD Workflow**

Automated workflow using **GitHub Actions**:

1. **Continuous Integration (CI)**

   * Triggers on pull requests and pushes to `develop` or `main`
   * Installs dependencies (`pnpm install --frozen-lockfile`)
   * Runs linting (`pnpm lint`) and type checks (`pnpm tsc`)
   * Runs unit & integration tests
   * Builds the Next.js application (`pnpm build`)

2. **Continuous Deployment (CD)**

   * Automatically deploys to **staging** (`develop`) or **production** (`main`) using Vercel
   * Injects environment-specific secrets securely
   * Generates preview deployments for pull requests

---

## **Branching Strategy**

| Branch      | Purpose                   |
| ----------- | ------------------------- |
| `main`      | Production-ready code     |
| `develop`   | Staging / QA              |
| `feature/*` | New features or bug fixes |

**Rules:**

* All development starts from `develop`
* Pull Requests are required for merging into `develop` or `main`
* `main` branch is always deployable

---

## **Environments**

* **Development**: local development (`pnpm dev`)
* **Staging**: auto-deploy from `develop` branch
* **Production**: auto-deploy from `main` branch

---

## **Deployment**

* Recommended hosting: **Vercel**
* Requires GitHub secrets:

  * `VERCEL_TOKEN`
  * `VERCEL_ORG_ID`
  * `VERCEL_PROJECT_ID`
