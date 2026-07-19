'use client';

import React, { useTransition } from 'react';
import { setRole } from './actions';
import { type Role } from '@/lib/roles';
import { Shield, User, Ghost, Loader2 } from 'lucide-react';

interface RoleSwitcherProps {
  currentRole: Role;
}

const ROLE_CONFIG: {
  role: Role;
  label: string;
  icon: React.ReactNode;
  activeClass: string;
}[] = [
  {
    role: 'admin',
    label: 'Admin',
    icon: <Shield className="h-4 w-4" />,
    activeClass: 'border-indigo-500 bg-indigo-500/10 text-indigo-500',
  },
  {
    role: 'user',
    label: 'User',
    icon: <User className="h-4 w-4" />,
    activeClass: 'border-emerald-500 bg-emerald-500/10 text-emerald-500',
  },
  {
    role: 'guest',
    label: 'Guest',
    icon: <Ghost className="h-4 w-4" />,
    activeClass: 'border-amber-500 bg-amber-500/10 text-amber-500',
  },
];

export default function RoleSwitcher({ currentRole }: RoleSwitcherProps) {
  const [isPending, startTransition] = useTransition();

  const handleSetRole = (role: Role) => {
    startTransition(async () => {
      await setRole(role);
    });
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">Current Role</h2>
        {isPending && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <span>Updating...</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 mb-2">
        <span className="font-mono text-sm px-2 py-1 bg-muted rounded font-bold text-primary">
          {currentRole}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {ROLE_CONFIG.map(({ role, label, icon, activeClass }) => (
          <button
            key={role}
            id={`set-role-${role}`}
            onClick={() => handleSetRole(role)}
            disabled={isPending}
            className={`flex items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-semibold transition-all ${
              currentRole === role
                ? activeClass
                : 'border-border bg-muted text-muted-foreground hover:bg-muted/70 hover:text-foreground'
            }`}
          >
            {icon} {label}
          </button>
        ))}
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed mt-2">
        Selecting a role writes to the <code className="bg-muted px-1 rounded">userRole</code> cookie.
        The proxy will intercept navigation and read this cookie to determine access.
      </p>
    </div>
  );
}
