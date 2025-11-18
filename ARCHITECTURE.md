# FlertéChat - Architecture Documentation

## 🏗️ VIBE CODING Architecture

This project follows **VIBE CODING** principles: clean, minimal, maintainable code organized by features.

## 📁 Folder Structure

```
client/src/
├── features/              # Feature-based organization
│   ├── auth/             # Authentication feature
│   │   ├── hooks/        # use-auth.ts
│   │   └── pages/        # login.tsx
│   │
│   ├── flerte/           # Main flerte feature (message generation)
│   │   ├── components/   # Feature-specific components
│   │   ├── hooks/        # Feature-specific hooks
│   │   └── pages/        # dashboard.tsx
│   │
│   ├── subscription/     # Subscription & plans feature
│   │   ├── components/   # countdown-banner.tsx
│   │   └── pages/        # plans.tsx, subscription.tsx, success.tsx
│   │
│   └── marketing/        # Marketing & public pages
│       └── pages/        # home.tsx, faq.tsx, terms.tsx, privacy.tsx, not-found.tsx
│
├── shared/               # Shared code used by 2+ features
│   ├── components/       # Shared components
│   │   └── ui/          # shadcn/ui components
│   ├── hooks/           # Shared hooks
│   ├── contexts/        # React contexts (ThemeContext)
│   ├── constants/       # app.ts (APP_TITLE, APP_LOGO, etc)
│   └── utils/           # Utility functions
│
└── lib/                 # External library configs
    ├── supabase.ts      # Supabase client
    └── trpc.ts          # tRPC client
```

## 🎯 Key Principles

### 1. Feature-Based Organization
- Each feature owns ALL its logic: UI, hooks, services, types
- **DO NOT** organize by layer (❌ /components, /hooks at root)
- **DO** organize by feature (✅ /features/auth, /features/flerte)

### 2. DRY (Don't Repeat Yourself)
- Extract repeated logic into utilities, hooks, or constants
- Never duplicate values, strings, or configs

### 3. KISS (Keep It Simple)
- Prefer the simplest implementation
- Avoid overengineering and unnecessary abstractions

### 4. YAGNI (You Aren't Gonna Need It)
- Implement ONLY what is explicitly required
- No future-proofing without a concrete need

### 5. Separation of Concerns
- Components: UI only
- Hooks/services: business logic, side effects, API calls
- No API configs inside UI components

## 📝 Naming Conventions

### Files
- `kebab-case`: `login-form.tsx`, `use-auth.ts`

### Components
- `PascalCase`: `LoginForm`, `Dashboard`

### Hooks
- `useCamelCase`: `useAuth`, `useFlerte`

### Variables/Functions
- `camelCase`: `handleSubmit`, `isLoading`

### Types/Interfaces
- `PascalCase`: `User`, `AuthResponse`

## 📦 Import Order

```typescript
// 1. React/core libs
import { useState } from "react";

// 2. Third-party libs
import { useLocation } from "wouter";

// 3. Shared modules
import { Button } from "@/shared/components/ui/button";
import { APP_TITLE } from "@/shared/constants/app";

// 4. Local feature modules
import { useAuth } from "@/features/auth/hooks/use-auth";
```

## 🔧 Path Aliases

Configured in `tsconfig.json`:

```json
{
  "paths": {
    "@/*": ["./client/src/*"],
    "@shared/*": ["./shared/*"]
  }
}
```

## ✅ When to Use Shared

Only move code to `/shared` when:
- At least **2 features** need it
- It's truly generic (not feature-specific)

Examples:
- ✅ UI components (Button, Dialog)
- ✅ Theme context
- ✅ App constants
- ❌ Feature-specific business logic

## 🚀 Benefits

1. **Token Efficiency**: Related files are close together
2. **Maintainability**: Clear ownership and boundaries
3. **Scalability**: Easy to add new features
4. **Discoverability**: Intuitive file location

## 📚 Feature Overview

### Auth
- Supabase authentication
- Login/signup flow
- `useAuth` hook for auth state

### Flerte
- Main dashboard
- Message generation
- Chat interface

### Subscription
- Plan selection
- Credit management
- Payment integration

### Marketing
- Landing page
- FAQ, Terms, Privacy
- Public-facing content
