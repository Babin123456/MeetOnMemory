# CI Pipeline Documentation

This document describes the Continuous Integration (CI) pipeline for **MeetOnMemory**. Every Push to `main`/`master` and every Pull Request triggers the full pipeline.

## Pipeline Architecture

The pipeline runs **5 independent parallel jobs**. Each job fails independently so contributors get precise, isolated feedback on what broke.

```
┌──────────────────────────────────────────────────────────────┐
│                   CI Pipeline (GitHub Actions)               │
│                                                              │
│   Triggered on: push to main/master, pull_request            │
│                                                              │
│   ┌─────────────┐  ┌──────────────────┐  ┌───────────────┐  │
│   │ Code Quality │  │ Backend          │  │ Frontend      │  │
│   │              │  │ Validation       │  │ Validation    │  │
│   │ • Prettier   │  │                  │  │               │  │
│   │ • ESLint     │  │ • npm ci         │  │ • npm ci      │  │
│   │   (server)   │  │ • Lint           │  │ • Lint        │  │
│   │ • ESLint     │  │ • Jest tests     │  │ • Vitest      │  │
│   │   (client)   │  │ • Coverage       │  │ • Prod build  │  │
│   │              │  │ • Startup check  │  │               │  │
│   └─────────────┘  └──────────────────┘  └───────────────┘  │
│                                                              │
│   ┌──────────────────┐  ┌─────────────────────────────────┐  │
│   │ Security Checks  │  │ Integration Tests               │  │
│   │                  │  │                                 │  │
│   │ • npm audit      │  │ • Auth endpoints                │  │
│   │   (server)       │  │ • Health check                  │  │
│   │ • npm audit      │  │ • Organization CRUD             │  │
│   │   (client)       │  │ • Meeting endpoints             │  │
│   │                  │  │ • Calendar/Knowledge guards     │  │
│   │                  │  │ • Policy endpoints              │  │
│   │                  │  │ • Route loading validation      │  │
│   └──────────────────┘  └─────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

## Job Details

### 1. Code Quality

**Purpose:** Enforce consistent formatting and catch static analysis errors.

| Check | Scope | Tool |
|-------|-------|------|
| Formatting | Changed files only | Prettier |
| Linting (server) | `server/**/*.js` | ESLint (flat config) |
| Linting (client) | `client/**/*.{js,jsx}` | ESLint + React plugins |

### 2. Backend Validation

**Purpose:** Verify the server builds, passes all tests, and can start without crashes.

| Step | What it does |
|------|--------------|
| `npm ci` | Clean install of server dependencies |
| `npm run lint` | ESLint checks |
| `npm run test:ci` | Runs all Jest test suites with `--ci --coverage` |
| `npm run test:startup` | Validates module imports, service initialization, and queue wrappers |

Coverage reports are uploaded as GitHub Actions artifacts (retained for 14 days).

### 3. Frontend Validation

**Purpose:** Ensure the client compiles, passes tests, and produces a deployable build.

| Step | What it does |
|------|--------------|
| `npm ci` | Clean install of client dependencies |
| `npm run lint` | ESLint checks |
| `npm run test:ci` | Runs all Vitest test suites in single-run mode |
| `npm run build` | Full Vite production build — catches import errors, missing modules, and TypeScript/JSX issues |

### 4. Security Checks

**Purpose:** Detect known vulnerabilities in dependencies.

| Step | Threshold |
|------|-----------|
| Server `npm audit` | `--audit-level=high` |
| Client `npm audit` | `--audit-level=high` |

Only **high** and **critical** severity vulnerabilities cause a build failure. Moderate and low severity issues are reported as warnings.

### 5. Integration Tests

**Purpose:** Verify critical API endpoints work end-to-end using `supertest` with an in-memory MongoDB instance.

**Covered endpoints:**
- Health check (`/api/health`, `/health`)
- CSRF token (`/api/csrf-token`)
- Authentication (register, login, session validation, wrong-password rejection)
- Organizations (create, list, auth guard)
- Meetings (list, auth guard)
- Calendar (auth guard)
- Knowledge Base (auth guard)
- Policies (list, auth guard)
- Assistant (auth guard)
- Notifications (auth guard)
- Route loading validation (404 for unknown routes)

---

## Separate Workflows

These workflows run independently from the main CI pipeline:

| Workflow | File | Trigger |
|----------|------|---------|
| CodeQL Security Analysis | `codeql.yml` | Push, PR, weekly schedule |
| Keep-Alive Health Check | `health-check.yml` | Every 10 min (cron) |
| PR Validation | `05-pr-check.yml` | PR events |

---

## Running Checks Locally

### Server

```bash
cd server

# Lint
npm run lint

# Full test suite
npm test

# Tests with coverage (mirrors CI)
npm run test:ci

# Startup validation
npm run test:startup

# Single integration test file
node --experimental-vm-modules node_modules/jest/bin/jest.js --forceExit tests/integration.test.js
```

### Client

```bash
cd client

# Lint
npm run lint

# Tests (watch mode)
npm test

# Tests (single run, mirrors CI)
npm run test:ci

# Production build
npm run build
```

### Formatting

```bash
# From repo root
npm run format:check    # Check only
npm run format          # Auto-fix
```

### Security

```bash
# We use `|| true` so that vulnerabilities display a warning in the logs
# without completely blocking the CI pipeline and deployment.
cd server && npm audit --audit-level=high || true
cd client && npm audit --audit-level=high || true
```

---

## Adding New Tests

### Backend (Jest)

1. Create a file in `server/tests/` with the `.test.js` extension.
2. Import `{ app }` from `../server.js` for supertest-based API tests.
3. The shared `setup.js` automatically provides MongoMemoryServer.
4. Tests using Vitest should be added to the Jest ignore list in `server/jest.config.js`.

### Frontend (Vitest)

1. Create a file with `.test.js` or `.test.jsx` extension.
2. Place it alongside the component or in a `__tests__/` directory.
3. Use `@testing-library/react` for component testing.
4. Configuration is in `client/vite.config.js` under `test`.

### Integration Tests

1. Add new `describe` blocks to `server/tests/integration.test.js`.
2. Use the `registerAndLogin()` helper for authenticated requests.
3. Use `createCsrfAgent()` for unauthenticated + CSRF scenarios.

---

## Troubleshooting

### Common CI Failures

| Issue | Fix |
|-------|-----|
| Prettier formatting error | Run `npm run format` from the repo root |
| ESLint error (server) | Run `npm run lint --prefix server` locally and fix warnings/errors |
| ESLint error (client) | Run `npm run lint --prefix client` locally and fix warnings/errors |
| Test timeout | Increase `testTimeout` in `server/jest.config.js` (default: 30s) |
| MongoMemoryServer download failure | Check network access; the binary is cached after first download |
| Build failure (client) | Run `npm run build --prefix client` locally to see the exact error |
| `npm audit` failure | Run `npm audit fix` to auto-fix, or `npm audit` to see details |

### Worker process force-exit warnings

The warning _"A worker process has failed to exit gracefully"_ is caused by open handles (timers, connections) in some test suites. The `--forceExit` flag ensures Jest exits cleanly. Use `--detectOpenHandles` locally to identify and fix leaks.
