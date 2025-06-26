# Blikson Link Development Conventions

## Table of Contents

- [Project Overview](#project-overview)
- [General Guidelines](#general-guidelines)
- [Code Style](#code-style)
- [File Structure](#file-structure)
- [Naming Conventions](#naming-conventions)
- [TypeScript Conventions](#typescript-conventions)
- [API Design Conventions](#api-design-conventions)
- [Git Workflow](#git-workflow)
- [Documentation](#documentation)

## Project Overview

Blikson Link is a backend API gateway that unifies communication with multiple delivery companies through their software providers (like EcoTrack, Yalidine, etc.). It acts as a forwarding layer that standardizes how data is requested and returned.

## General Guidelines

- Follow the principle of "Clean Code" - code should be readable, maintainable, and self-documenting
- Keep functions small and focused on a single responsibility
- Use meaningful variable and function names
- Comment complex logic, but prefer self-documenting code
- Follow the DRY (Don't Repeat Yourself) principle
- Keep files focused and avoid creating monolithic modules
- Handle errors gracefully and provide meaningful error messages
- Use proper logging for debugging and monitoring

## Code Style

- Use 2 spaces for indentation
- Use semicolons at the end of statements
- Use double quotes for strings
- Use camelCase for variables and functions
- Use PascalCase for types and interfaces
- Maximum line length: 100 characters
- Use trailing commas in multi-line objects and arrays
- Use template literals for string interpolation

## File Structure

```bash
blikson-link/
│
├── src/
│   ├── apis/                    # API provider implementations
│   │   ├── ecotrack/           # EcoTrack provider
│   │   │   ├── actions/        # API action handlers (per action, e.g., createParcel.ts)
│   │   │   ├── config.ts       # Provider configuration (endpoints, methods)
│   │   │   └── utils.ts        # Provider-specific utilities (if any)
│   │   ├── yalidine/           # Yalidine provider (structure to match ecotrack as implemented)
│   │   └── noest/              # Noest provider (structure to match ecotrack as implemented)
│   │
│   ├── config/                 # Global configuration
│   │   ├── actions.ts          # Maps provider actions to endpoints/methods
│   │   └── companies.ts        # Company mappings and metadata
│   │
│   ├── routes/                 # API route definitions
│   │   └── v1.ts               # Version 1 API routes
│   │
│   ├── middleware/             # Request/response middleware
│   │   └── companyActionValidation.ts # Middleware for validating company/action
│   │
│   ├── types/                  # TypeScript type definitions
│   │   ├── api.types.ts        # Common API types (requests, responses)
│   │   ├── config.types.ts     # Config and provider types
│   │   └── providers/          # Provider-specific types
│   │       └── ecotrack/       # Ecotrack-specific types (one file per action, e.g., createParcel.types.ts)
│   │
│   ├── utils/                  # Utility functions
│   │   └── request.ts          # Request handling utilities
│   │
│   └── main.ts                 # Application entry point
│
├── .env                        # Environment variables
├── bunfig.toml                 # Bun configuration
├── README.md                   # Project documentation
└── .gitignore                  # Git ignore rules
```

## Naming Conventions

### Files and Directories

- API provider directories: lowercase (e.g., `ecotrack/`, `yalidine/`)
- Action files: camelCase (e.g., `createParcel.ts`)
- Type files: camelCase with `.types.ts` suffix (e.g., `api.types.ts`, `createParcel.types.ts`)
- Configuration files: `config.ts`
- Utility files: camelCase (e.g., `request.ts`)
- Test files: `*.test.ts` or `*.spec.ts`

### Functions and Variables

- Use camelCase for variables and functions
- Use descriptive names that indicate purpose
- Boolean variables should start with is/has/should (e.g., `isValid`, `hasError`)
- API action handlers should be verbs (e.g., `createParcel`, `trackParcel`)
- The noun chosen for the parcel is "Parcel"; do not use synonyms such as "Package"

## TypeScript Conventions

- Always use TypeScript for new code
- Define explicit types for function parameters and return values
- Use interfaces for API request/response types
- Use type aliases for complex types and enums (e.g., union string types)
- Avoid using `any` type
- Use proper type imports/exports
- Use type guards when necessary
- Provider-specific types are grouped under `src/types/providers/{provider}/` and named according to the action (e.g., `createParcel.types.ts`)
- All type files use the `.types.ts` suffix
- API response types should be generic and composable, supporting both success and error cases

Example:

```typescript
// src/types/api.types.ts
export interface BaseApiResponse {
  success: boolean;
  requestId: string;
  timestamp: string;
}

export interface ErrorResponse extends BaseApiResponse {
  success: false;
  error: {
    status: number;
    code: string;
    message: string;
    company?: string;
    action?: string;
    errorFields?: ZodIssue[];
  };
}

export interface SuccessResponse<T> extends BaseApiResponse {
  success: true;
  data: T;
}

export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;
```

Provider-specific example:

```typescript
// src/types/providers/ecotrack/createParcel.types.ts
export interface CreateParcelRequest {
  // ...fields
}
export interface CreateParcelResponseSuccess {
  success: true;
  tracking: string;
}
export interface CreateParcelResponseError {
  message: string;
  errors: Record<string, string[]>;
}
export type CreateParcelResponse =
  | CreateParcelResponseSuccess
  | CreateParcelResponseError;
```

## API Design Conventions

### Route Structure

- Use versioned routes (e.g., `/v1/:company/:action`)
- Keep routes RESTful and resource-oriented
- Use consistent HTTP methods (GET, POST, PUT, DELETE)
- Implement proper error handling and status codes

### Action Configuration

The `actions` configuration maps provider actions to their HTTP methods and endpoints:

```typescript
export const actions = {
  ecotrack: ecotrackActions,
  yalidine: {
    createParcel: {
      endpoint: "...",
      method: "POST",
    },
  },
  noest: {
    createParcel: {
      endpoint: "...",
      method: "POST",
    },
  },
};
```

This structure allows for:

- Direct lookup of HTTP methods and endpoints by action name
- Type-safe action names
- Easy validation of available actions
- Simple addition of new actions

### Response Format

- Use consistent response structure
- Include proper status codes
- Provide meaningful error messages
- Include request tracking IDs

Example:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  requestId: string;
}
```

### Error Handling

- Use proper HTTP status codes
- Return detailed error objects in a consistent format
- Include validation errors as needed

## Git Workflow

- Use feature branches for new features/bugfixes
- Write clear, descriptive commit messages
- Rebase and squash commits before merging to main
- Ensure all code passes linting and tests before merging

## Documentation

- Document all public functions and types
- Keep README.md up to date with setup and usage instructions
- Update this conventions file as the codebase evolves

## Best Practices

1. **Error Handling**
   - Use try-catch blocks for async operations
   - Implement proper error boundaries
   - Log errors appropriately
   - Provide user-friendly error messages

2. **Performance**
   - Implement proper caching strategies
   - Use connection pooling
   - Monitor response times
   - Optimize database queries

3. **Security**
   - Validate all input data
   - Implement proper authentication
   - Use environment variables for sensitive data
   - Follow security best practices
   - Rate limit API requests

4. **Testing**
   - Write unit tests for utilities
   - Write integration tests for API endpoints
   - Maintain good test coverage
   - Use proper testing libraries and tools

## Additional Resources

- [Bun Documentation](https://bun.sh/docs)
- [Hono Documentation](https://hono.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [ESLint Rules](https://eslint.org/docs/rules)
- [Prettier Configuration](https://prettier.io/docs/en/configuration.html)
