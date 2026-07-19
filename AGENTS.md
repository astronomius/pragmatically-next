<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Pragmatic Next.js Labs Context

## Overview
This is a production-grade, highly interactive learning sandbox designed to practice, demonstrate, and enforce cutting-edge engineering patterns in **React 19** and **Next.js 16.2 (Canary)**.

## Project Structure
- `/src/app/basic`: Core web vitals and client rendering (Theme Switcher, Image Optimization, Lazy Loading).
- `/src/app/intermediate`: Interactivity and routing patterns (Optimistic Updates, Error Boundaries, Form Shortcuts & Bindings, RBAC Proxy, Search Params Filtering).
- `/src/app/advanced`: Experimental Next.js features (Instant Shop PPR, Motion Gallery View Transitions, Infinite Scroller Action, `use` Hook).
- `/src/components`: Reusable UI components.
- `/src/lib`: Utilities, mock databases, and shared logic.

## Technical Stack & Tooling
- **Framework:** Next.js 16.2 (Canary) with React 19.
- **Styling:** Tailwind CSS v4. Use modern utility patterns and CSS variables for theming.
- **Package Manager:** `bun` is the exclusive package manager. Use `bun run`, `bun add`, etc. Avoid npm/yarn/pnpm.
- **Testing:** Testing is configured using `vitest` alongside `@testing-library/react`. 

## Agent Guidelines
1. **React 19 Patterns:** Use React 19 hooks and features natively. Do NOT use deprecated patterns. Avoid `useMemo` where `use()` applies; use `useActionState` and `useFormStatus` instead of older form tracking.
2. **Component Architecture:** Favor React Server Components (RSC) by default. Use `"use client"` *only* when client-side interactivity, DOM access, or React state/hooks are required. 
3. **Data Mutations:** Prefer Server Actions (`'use server'`) defined in separate files or inline for form submissions and database mutations.
4. **Caching & Fetching:** Be aware of the new `'use cache'` directive for Next.js caching.
5. **Testing:** Write component tests using Vitest and React Testing Library. Ensure DOM elements are accessible and testable.
6. **Error Handling:** Use granular error boundaries (e.g. custom `ComponentErrorBoundary`) inside route segments to isolate component crashes instead of taking down the entire page layout.
