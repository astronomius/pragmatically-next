'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ROLES, type Role } from '@/lib/roles';

export async function setRole(role: Role) {
  // Validate against the shared allowlist — reject any value not in ROLES
  if (!(ROLES as readonly string[]).includes(role)) {
    throw new Error(`Invalid role: "${role}". Must be one of: ${ROLES.join(', ')}`);
  }

  const cookieStore = await cookies();
  cookieStore.set('userRole', role, {
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    httpOnly: true,            // not accessible from JS — prevents XSS reads
    sameSite: 'lax',           // CSRF protection
  });

  // redirect() is the idiomatic Next.js way to navigate after a mutation
  redirect('/intermediate/rbac');
}
