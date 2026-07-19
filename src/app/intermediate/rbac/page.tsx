import React from 'react';
import Link from 'next/link';
import { cookies } from 'next/headers';
import LabExplanation from '@/components/lab-explanation';
import RoleSwitcher from './role-switcher';
import { ShieldCheck, ArrowRight, AlertTriangle } from 'lucide-react';
import { ROLES, type Role } from '@/lib/roles';

export default async function RBACLabPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const cookieStore = await cookies();
  const rawRole = cookieStore.get('userRole')?.value;

  // Coerce stored value to a valid Role — fall back to 'guest'
  const currentRole: Role = (ROLES as readonly string[]).includes(rawRole ?? '')
    ? (rawRole as Role)
    : 'guest';

  const params = await searchParams;
  const errorMsg = params.error;

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Intermediate Lab: RBAC &amp; Middleware Proxy
        </h1>
        <p className="mt-2 text-muted-foreground text-sm sm:text-base">
          Practice Role-Based Access Control using Next.js{' '}
          <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">proxy.ts</code>{' '}
          to intercept requests, read cookies, and enforce permissions.
        </p>
      </div>

      {/* Lab Explanation */}
      <LabExplanation labSlug="rbac" />

      {errorMsg && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 flex gap-3 text-xs leading-relaxed text-muted-foreground">
          <AlertTriangle className="h-5 w-5 shrink-0 text-red-500" />
          <div>
            <span className="font-semibold text-red-500 block mb-1">Access Denied by Proxy</span>
            The proxy intercepted your request and redirected you back because your role{' '}
            (<code className="bg-muted px-1 rounded">{currentRole}</code>) does not have permission
            for the requested route.
            <br />
            <strong>Error code:</strong> {errorMsg}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RoleSwitcher currentRole={currentRole} />

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm flex flex-col gap-4">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-500" />
            Test Protected Routes
          </h2>
          <p className="text-xs text-muted-foreground">
            Try navigating to these pages. The proxy will check your{' '}
            <code className="bg-muted px-1 rounded">userRole</code> cookie before the page is rendered.
          </p>

          <div className="flex flex-col gap-3 mt-2">
            <Link
              href="/intermediate/rbac/admin"
              className="group flex items-center justify-between rounded-lg border border-border p-3 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all"
            >
              <div>
                <span className="text-sm font-semibold text-foreground group-hover:text-indigo-500">
                  Admin Dashboard
                </span>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Requires <code className="font-mono font-bold text-indigo-400">admin</code> role
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-indigo-500" />
            </Link>

            <Link
              href="/intermediate/rbac/user"
              className="group flex items-center justify-between rounded-lg border border-border p-3 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all"
            >
              <div>
                <span className="text-sm font-semibold text-foreground group-hover:text-emerald-500">
                  User Profile
                </span>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Requires <code className="font-mono font-bold text-emerald-400">user</code> or{' '}
                  <code className="font-mono font-bold text-indigo-400">admin</code> role
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-emerald-500" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
