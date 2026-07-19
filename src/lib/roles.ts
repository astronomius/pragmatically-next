export const ROLES = ['admin', 'user', 'guest'] as const;
export type Role = (typeof ROLES)[number];

/** Map each role to the routes it is permitted to access. */
export const ROLE_PERMISSIONS: Record<Role, string[]> = {
  admin: ['/intermediate/rbac/admin', '/intermediate/rbac/user'],
  user: ['/intermediate/rbac/user'],
  guest: [],
};
