# Next JS Pragmatic Labs 🧪

A production-grade, highly interactive learning sandbox designed to practice, demonstrate, and enforce cutting-edge engineering patterns in **React 19** and **Next.js 16 (Canary)**.

This repository organizes learning materials into a documentation-style chapter sidebar containing interactive sub-applications (labs), each accompanied by a collapsible technical explanation breaking down how the underlying APIs function under the hood.

---

## 🗂️ Lab Registry & Chapters

The sandbox is structured into three progressive chapters:

### 🟢 1. Basic Chapter
*   **Theme Switcher & Hydration Sync**
    *   **Practices:** Hydration flash prevention, client-side preference persistence, and server/client date sync.
    *   **How it works:** Implements a synchronous `<script>` inside layout `<head>` to parse `localStorage` before the body paints, eliminating styling flashes. Demonstrates how to display locale-dependent date/time structures safely without triggering React hydration mismatches via lazy states and `suppressHydrationWarning`.

### 🔵 2. Intermediate Chapter
*   **Optimistic Task Board**
    *   **Practices:** Zero-latency optimistic UI updates and React 19 Form Actions.
    *   **How it works:** A Kanban-style task card grid. Shifting cards or adding/deleting tickets updates the client UI instantly using React 19's `useOptimistic`, while the background Server Actions sync variables with the local file database with simulated network latency.

### 🟣 3. Advanced Chapter
*   **Instant Shop (PPR & `use cache`)**
    *   **Practices:** Partial Prerendering (PPR), Next.js 16 `'use cache'` directive, and prefetch validation.
    *   **How it works:** The shop page instantly serves a static HTML shell for layout and product details cached with `'use cache'`. The slow warehouse inventory count is wrapped in a dynamic `<Suspense>` boundary and streams over the connection once resolved.
    *   **Validation:** Uses the `unstable_instant` export with sample parameter mockups to validate shell rendering stability at build time.

*   **Motion Gallery (View Transitions)**
    *   **Practices:** Declarative React 19 `<ViewTransition>` layout morphs, tab crossfades, and spatial link directional slides.
    *   **How it works:** Navigating between gallery thumbnails and detail pages triggers browser-level shared element morphing. Changing tab filters triggers grid-container crossfades, and previous/next page arrows inject `transitionTypes` (e.g. `nav-forward`) to slide elements horizontally using custom CSS pseudo-element overrides.

---

## 🛠️ Tech Stack & Configurations

*   **Core:** React 19, Next.js 16.2 (Canary)
*   **Styling:** Tailwind CSS v4 (Glassmorphic dark/light variables)
*   **Icons:** Lucide React
*   **Server Experiments Enabled (`next.config.ts`):**
    *   `cacheComponents: true` (for granular `'use cache'` functionality)
    *   `viewTransition: true` (for the `<ViewTransition>` component)
    *   `instantNavigationDevToolsToggle: true` (for instant shell testing overlays)

---

## 🚀 Getting Started

Ensure you have [Bun](https://bun.sh) installed.

### 1. Install Dependencies
```bash
bun install
```

### 2. Launch Development Workspace
```bash
bun run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the labs dashboard. Enable the Next.js DevTools panel to test **Instant Navigations**.

### 3. Run ESLint Rules Checks
```bash
bun run lint
```
*Note: Configured with strict rules verifying nested component declarations, hooks usage inside effects, and unescaped HTML characters.*

### 4. Build Production Sandbox (PPR Compilation)
```bash
bun run build
```
Generates statically optimized shells with streaming dynamic zones for the partial prerendered routes.
