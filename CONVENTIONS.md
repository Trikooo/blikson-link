# Blikson Link Development Conventions

## Table of Contents

- [Project Overview](#project-overview)
- [Directory Structure](#directory-structure)
- [Naming Conventions](#naming-conventions)
- [TypeScript & API Conventions](#typescript--api-conventions)
- [Error Handling & Logging](#error-handling--logging)
- [Testing](#testing)
- [Git Workflow](#git-workflow)
- [Documentation](#documentation)

---

## Project Overview

Blikson Link is a backend API gateway that unifies communication with multiple delivery companies (providers) such as EcoTrack and Yalidine. It acts as a proxy, standardizing requests and responses, handling validation, and providing a consistent developer experience.

---

## Directory Structure

```bash
blikson-link/
│
├── src/
│   ├── apis/                # Provider-specific API logic (ecotrack, yalidine, etc.)
│   │   └── {provider}/
│   │       ├── config.ts
│   │       ├── utils.ts
│   │       ├── services/
│   │       └── models/
│   ├── config/              # Global configuration (actions, companies, etc.)
│   ├── constants/           # Shared constants (e.g., wilayas)
│   ├── errors/              # Error and exception classes, error handler
│   ├── lib/                 # Library code (e.g., env)
│   ├── middleware/          # Hono middleware (error handling, logging, validation, etc.)
│   ├── plugins/             # Optional plugins
│   ├── public/              # Static assets (favicon, logo, etc.)
│   ├── routes/              # API route definitions (e.g., v1.ts)
│   ├── schemas/             # Zod schemas for validation
│   ├── types/               # TypeScript types and interfaces
│   │   └── providers/       # Provider-specific types
│   ├── utils/               # Utility functions (request, response, logging, etc.)
│   └── main.ts              # Application entry point
│
├── test/                    # Test files (mirrors provider structure)
├── README.md
├── CONVENTIONS.md
├── package.json
├── bunfig.toml
├── tsconfig.json
└── .gitignore
```

---

## Naming Conventions

- **Directories:** Lowercase (e.g., `ecotrack/`, `yalidine/`)
- **Files:** kebab-case (e.g., `error-handler.ts`, `create-parcels.ts`)
- **Type files:** `.types.ts` suffix (e.g., `create-parcel.types.ts`)
- **Schemas:** `.schemas.ts` suffix for Zod schemas
- **Error/Exception Classes:**
  - Classes extending `HTTPException` use the `Exception` suffix (e.g., `ApiException`, `TimeoutException`)
  - Classes extending `Error` use the `Error` suffix (e.g., `UnexpectedResponseError`)
- **Tests:** `*.test.ts` in `test/` directory, mirroring provider structure

---

## TypeScript & API Conventions

- **Always use TypeScript** for new code.
- **Explicit types** for all function parameters and return values.
- **Provider-specific types** are grouped under `src/types/providers/{provider}/` and named by action.
- **API response types** are generic and composable, supporting both success and error cases.
- **Error responses** always include a `timestamp` and `requestId`.

### Example: ErrorResponse

```typescript
export interface ErrorResponse extends BaseApiResponse {
  success: false;
  message: string;
  issues?: Partial<ZodIssue>[];
  timestamp: string;
}
```

### Provider-specific example

```typescript
// src/types/providers/ecotrack/create-parcel.types.ts
export interface CreateParcelRequest { /* ... */ }
export interface CreateParcelResponseSuccess { /* ... */ }
export interface CreateParcelResponseError { /* ... */ }
export type CreateParcelResponse = CreateParcelResponseSuccess | CreateParcelResponseError;
```

---

## Error Handling & Logging

- **All errors** are handled centrally in `middleware/on-error.ts`.
- **Custom exceptions** (extending `HTTPException`) use the `Exception` suffix.
- **Unexpected or logic errors** (extending `Error`) use the `Error` suffix.
- **Error responses** are consistent, with a timestamp, requestId, and provider.
- **Logging:**
  - All errors except validation errors are logged using `c.var.logger.error` and in Sentry.
  - Logs include message, name, stack, requestId, provider, path, method, status, and timestamp.
- **Proxy logic:**
  - If the proxy receives a 404, 405, or 422 from a provider, it is treated as an internal server error, as this indicates a bug in proxy logic.

---

## Testing

- **Test files** are located in `test/`, mirroring the provider and action structure.
- **Test file naming:** `*.test.ts`
- **Write both unit and integration tests** for API endpoints and utilities.

---

## Git Workflow

- Use feature branches for new features/bugfixes.
- Write clear, descriptive commit messages.
- Rebase and squash commits before merging to main.
- Ensure all code passes linting and tests before merging.

---

## Documentation

- Document all public functions, types, and middleware with JSDoc.
- Keep `README.md` and `CONVENTIONS.md` up to date.
- Update conventions as the codebase evolves.

---
