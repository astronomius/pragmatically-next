export interface LabItem {
  id: string;
  title: string;
  slug: string;
  chapter: "Basic" | "Intermediate" | "Advanced";
  path: string;
  shortDescription: string;
  difficulty: "Easy" | "Medium" | "Hard";
  practices: string[];
  explanation: {
    what: string;
    apis: string[];
    howItWorks: string;
  };
}

export const labsRegistry: LabItem[] = [
  {
    id: "theme-switcher",
    title: "Theme Switcher",
    slug: "theme",
    chapter: "Basic",
    path: "/basic/theme",
    shortDescription: "Preventing hydration flashes and styling UI based on client-side state.",
    difficulty: "Easy",
    practices: [
      "Blocking rendering flashes using inline script tags in layout header",
      "Syncing document element attributes with browser local storage",
      "Using React 19 suppressHydrationWarning to handle server/client mismatches"
    ],
    explanation: {
      what: "A premium settings panel demonstrating client-side preference sync. It shows how the browser can run direct, synchronous Javascript parsing scripts before the main HTML body paints, avoiding the unsightly light-theme flash on initial loads.",
      apis: [
        "suppressHydrationWarning",
        "React.useId() for stable hydration identifiers",
        "dangerouslySetInnerHTML for inline execution scripts"
      ],
      howItWorks: "Next.js renders HTML on the server. If the server does not know the user's stored theme, it will render a default (light). When the browser parses the HTML, it runs our inline `<script>` in the `<head>` *before* rendering the `<body>`. The script reads from `localStorage` and sets the `data-theme` attribute on the `<html>` tag. When React hydrates, `suppressHydrationWarning` tells it to accept the DOM state modified by the script instead of throwing hydration mismatch warnings."
    }
  },
  {
    id: "optimistic-tasks",
    title: "Optimistic Task Board",
    slug: "tasks",
    chapter: "Intermediate",
    path: "/intermediate/tasks",
    shortDescription: "A lag-free Kanban board using Server Actions and optimistic updates.",
    difficulty: "Medium",
    practices: [
      "React 19 useOptimistic for instant user feedback during network requests",
      "React 19 Form Actions (useActionState, useFormStatus) for mutations",
      "Progressive enhancement with native form element validation"
    ],
    explanation: {
      what: "An interactive Kanban tracker backed by local file database actions. Clicking to transition a task or add a new ticket updates the UI immediately, while the network action handles the database sync in the background.",
      apis: [
        "useOptimistic()",
        "useActionState() (formerly useFormState)",
        "useFormStatus()",
        "Next.js Server Actions with revalidatePath()"
      ],
      howItWorks: "When a status edit or creation is dispatched, `useOptimistic` captures the action and updates the visual state instantly. Simultaneously, the Server Action is called asynchronously to update the local JSON database file. Once the server finishes writing and calls `revalidatePath`, React updates the server state and replaces the optimistic state with the actual server values without any layout jank or reload."
    }
  },
  {
    id: "instant-shop",
    title: "Instant Shop storefront",
    slug: "shop",
    chapter: "Advanced",
    path: "/advanced/shop",
    shortDescription: "Partial Prerendering (PPR) and cached shell navigations.",
    difficulty: "Hard",
    practices: [
      "Next.js Partial Prerendering (PPR) for static HTML shell streaming",
      "Next.js 16 'use cache' directive for instant details caching",
      "unstable_instant = { prefetch: 'static' } configuration for client navigation validation"
    ],
    explanation: {
      what: "A responsive game items shop. The product description and layout are cached statically and load immediately, while the live warehouse stock levels stream in dynamically behind a Suspense fallback.",
      apis: [
        "'use cache' directive",
        "unstable_instant export",
        "Suspense for rendering boundaries"
      ],
      howItWorks: "The details page exports `unstable_instant = { prefetch: 'static' }`, which runs validation on compile time. Next.js generates a static shell for the layout and description. The inventory fetch is slow and dynamic. When a user clicks a product link, Next.js instantly displays the static shell (description and placeholder fallbacks) from the client's prefetch cache, then streams the live inventory from the server on the same connection as it resolves."
    }
  },
  {
    id: "motion-gallery",
    title: "Motion Gallery transition",
    slug: "gallery",
    chapter: "Advanced",
    path: "/advanced/gallery",
    shortDescription: "Declaring custom animations using the View Transitions API.",
    difficulty: "Hard",
    practices: [
      "React 19 ViewTransition component matching",
      "Link transitionTypes and useRouter options for directional navigation",
      "Same-route tab crossfades using changing keys"
    ],
    explanation: {
      what: "A modern, animated photography collection. Opening images triggers a shared-element morph. Clicking navigation triggers directional sliding, and swapping tabs triggers crossfades.",
      apis: [
        "<ViewTransition> component",
        "transitionTypes link prop",
        "key changes to trigger in-place animation"
      ],
      howItWorks: "When navigating to a detail route, React identifies elements on the old page and new page that share the same `name` property. It triggers the browser's View Transitions API, which takes snapshots of both elements, computes the layout delta, and runs a CSS keyframe morph. By adding custom `transitionTypes` (like `nav-forward`), we apply CSS selectors (e.g. `::view-transition-new(.nav-forward)`) to trigger custom directional slides."
    }
  }
];
