import React from 'react';
import Link from 'next/link';
import { Shield, ArrowLeft } from 'lucide-react';

export default function AdminPage() {
  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto mt-8">
      <div className="rounded-xl border border-indigo-500/20 bg-card shadow-sm overflow-hidden">
        <div className="bg-indigo-500/10 p-6 border-b border-indigo-500/20 flex items-center gap-3">
          <div className="p-2 bg-indigo-500 rounded-lg">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">Top Secret Operations</p>
          </div>
        </div>
        
        <div className="p-6 flex flex-col gap-4">
          <div className="rounded-lg bg-green-500/10 border border-green-500/20 p-4">
            <p className="text-sm text-green-600 dark:text-green-400 font-medium">
              ✅ Access Granted! If you are seeing this page, the Next.js proxy verified your <code className="font-mono bg-green-500/20 px-1 rounded">userRole=admin</code> cookie.
            </p>
          </div>
          
          <div className="mt-4">
            <Link 
              href="/intermediate/rbac"
              className="inline-flex items-center gap-2 text-sm text-indigo-500 hover:text-indigo-600 font-semibold transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Back to RBAC Lab
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
