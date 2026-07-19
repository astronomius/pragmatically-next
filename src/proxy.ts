import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ROLES, ROLE_PERMISSIONS, type Role } from '@/lib/roles';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── RBAC: protect /intermediate/rbac/admin and /intermediate/rbac/user ──
  const rawRole = request.cookies.get('userRole')?.value;

  // Coerce cookie value to a valid Role — fall back to 'guest' for unknown values
  const role: Role = (ROLES as readonly string[]).includes(rawRole ?? '')
    ? (rawRole as Role)
    : 'guest';

  // All paths that are protected (union of all roles' permitted paths)
  const protectedPaths = [
    '/intermediate/rbac/admin',
    '/intermediate/rbac/user',
  ];

  for (const protectedPath of protectedPaths) {
    if (pathname.startsWith(protectedPath)) {
      // Check if the current role has permission for this path
      const hasPermission = ROLE_PERMISSIONS[role].some((p) =>
        pathname.startsWith(p)
      );
      if (!hasPermission) {
        const url = request.nextUrl.clone();
        url.pathname = '/intermediate/rbac';
        url.searchParams.set(
          'error',
          protectedPath.includes('admin') ? 'unauthorized-admin' : 'unauthorized-user'
        );
        return NextResponse.redirect(url);
      }
    }
  }

  // ── Legacy: redirect /about/* ──
  if (pathname.startsWith('/about')) {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/about/:path*', '/intermediate/rbac/admin/:path*', '/intermediate/rbac/user/:path*'],
};
