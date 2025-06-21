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
│   │   │   ├── actions/        # API action handlers
│   │   │   ├── config.ts       # Provider configuration
│   │   │   └── companies.ts    # Company-specific logic
│   │   │
│   │   ├── yalidine/          # Yalidine provider
│   │   │   ├── actions/        # API action handlers
│   │   │   └── config.ts       # Provider configuration
│   │   │
│   │   ├── noest/             # Noest provider
│   │   │   ├── actions/        # API action handlers
│   │   │   └── config.ts       # Provider configuration
│   │
│   ├── config/                 # Global configuration
│   │   └── companies.ts        # Company mappings
│   │
│   ├── routes/                 # API route definitions
│   │   └── v1.ts              # Version 1 API routes
│   │
│   ├── middleware/            # Request/response middleware
│   │   └── errorHandler.ts    # Global error handling
│   │
│   ├── types/                 # TypeScript type definitions
│   │   ├── api.ts            # Common API types (requests, responses)
│   │   ├── parcel.ts         # Common parcel types
│   │   ├── provider.ts       # Provider interface types
│   │   │
│   │   ├── providers/        # Provider-specific types
│   │   │   ├── ecotrack.ts   # EcoTrack types
│   │   │   ├── yalidine.ts   # Yalidine types
│   │   │   └── noest.ts      # Noest types
│   │   │
│   │   └── index.ts          # Type exports
│   │
│   ├── utils/                 # Utility functions
│   │   ├── request.ts         # Request handling utilities
│   │   └── respond.ts         # Response formatting utilities
│   │
│   └── main.ts               # Application entry point
│
├── .env                      # Environment variables
├── bunfig.toml              # Bun configuration
├── README.md                # Project documentation
└── .gitignore              # Git ignore rules
```

## Naming Conventions

### Files and Directories

- API provider directories: lowercase (e.g., `ecotrack/`, `yalidine/`)
- Action files: camelCase (e.g., `createShipment.ts`, `trackPackage.ts`)
- Configuration files: `config.ts`
- Utility files: camelCase (e.g., `request.ts`, `respond.ts`)
- Test files: `*.test.ts` or `*.spec.ts`

### Functions and Variables

- Use camelCase for variables and functions
- Use descriptive names that indicate purpose
- Boolean variables should start with is/has/should (e.g., `isValid`, `hasError`)
- API action handlers should be verbs (e.g., `createParcel`, `trackParcel`)
- the noun chosen for the parcel is "Parcel", don't use other synonyms such as "Package" or anything else.

## TypeScript Conventions

- Always use TypeScript for new code
- Define explicit types for function parameters and return values
- Use interfaces for API request/response types
- Use type aliases for complex types
- Avoid using `any` type
- Use proper type imports/exports
- Use type guards when necessary

Example:

```typescript
interface ShipmentRequest {
  trackingNumber: string;
  company: string;
  provider: string;
}

type ProviderResponse = {
  success: boolean;
  data: unknown;
  error?: string;
};

async function trackParcel(request: ShipmentRequest): Promise<ProviderResponse> {
  // Implementation
}
```

## API Design Conventions

### Route Structure

- Use versioned routes (e.g., `/v1/:company/:action`)
- Keep routes RESTful and resource-oriented
- Use consistent HTTP methods (GET, POST, PUT, DELETE)
- Implement proper error handling and status codes

### Action Configuration

The `actions` configuration maps provider actions to their HTTP methods:

```typescript
export const actions = {
  ecotrack: {
    trackParcel: "GET",
    createParcel: "POST",
    updateParcel: "PUT",
    deleteParcel: "DELETE"
  },
  yalidine: {
    trackParcel: "GET",
    createParcel: "POST"
  }
} as const;
```

This structure allows for:

- Direct lookup of HTTP methods by action name
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
- Implement global error handling middleware
- Log errors appropriately
- Provide user-friendly error messages
- Include error tracking IDs

## Git Workflow

### Branch Naming

- Feature branches: `feature/description`
- Bug fixes: `fix/description`
- Hotfixes: `hotfix/description`
- Releases: `release/version`

### Commit Messages

- Use past tense
- Start with a verb
- Keep first line under 50 characters
- Use body for detailed explanation
- Reference issues when applicable

Example:

```bash
feat: added EcoTrack parcel tracking

- Implemented tracking endpoint
- Added error handling
- Added request validation

Closes #123
```

## Documentation

### Code Comments

- Use JSDoc for function documentation
- Comment complex business logic
- Keep comments up to date
- Use TODO comments for future improvements

Example:

```typescript
/**
 * Tracks a parcel using the specified provider
 * @param request - The tracking request parameters
 * @returns The tracking response from the provider
 * @throws {ApiError} If the provider request fails
 */
async function trackShipment(request: ShipmentRequest): Promise<ProviderResponse> {
  // Implementation
}
```

### API Documentation

- Document all API endpoints
- Include request/response examples
- Document error scenarios
- Keep documentation up to date with code changes

## Best Practices

1. **Error Handling**
   - Use try-catch blocks for async operations
   - Implement proper error boundaries
   - Log errors appropriately
   - Provide user-friendly error messages

2. **HTTP Client Usage**
   - Use `axios` for making HTTP requests
   - Configure retries and timeouts
   - Implement proper error handling
   - Use request/response interceptors

   Example configuration:

```typescript
import axios from "axios";
import axiosRetry from "axios-retry";

// Create axios instance
const client = axios.create({
  timeout: 5000,
  headers: {
    "Content-Type": "application/json"
  }
});

// Configure retries
axiosRetry(client, {
  retries: 3,
  retryDelay: (retryCount) => {
    return retryCount * 1000; // Progressive delay
  },
  retryCondition: (error) => {
    return axiosRetry.isNetworkOrIdempotentRequestError(error) || // Default retry conditions
           error.response?.status === 429 || // Rate limit
           error.response?.status >= 500;    // Server errors
  }
});

// Request interceptor
client.interceptors.request.use(
  (config) => {
    // Add auth headers, etc.
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
client.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Log retry attempts
    if (error.config?.__retryCount) {
      console.log(`Retry attempt ${error.config.__retryCount} for ${error.config.url}`);
    }

    // Handle specific error cases
    if (error.response?.status === 429) {
      console.log("Rate limited, waiting before retry...");
    }

    return Promise.reject(error);
  }
);

// Usage example
try {
  const response = await client.post("/api/endpoint", {
    // request body
  });
} catch (error) {
  if (axios.isAxiosError(error)) {
    console.error("Request failed:", error.response?.data);
  }
}
```

3. **Performance**
   - Implement proper caching strategies
   - Use connection pooling
   - Monitor response times
   - Optimize database queries

4. **Security**
   - Validate all input data
   - Implement proper authentication
   - Use environment variables for sensitive data
   - Follow security best practices
   - Rate limit API requests

5. **Testing**
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
