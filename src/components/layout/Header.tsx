"use client";

import { LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export function Header() {
  const { user, logout } = useAuth();
  console.log("user", user);

  return (
    <header className="flex h-16 items-center justify-between border-b border-surface-border px-6">
      <div className="text-sm text-slate-400">
        {user?.companyId ? `Tenant: ${user.companyId}` : "Super admin"}
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium text-slate-100">
            {user ? `${user.firstName} ${user.lastName}` : "—"}
          </p>
          <p className="text-xs text-slate-500">{user?.role}</p>
        </div>
        <button
          onClick={() => logout()}
          className="rounded-lg p-2 text-slate-400 hover:bg-surface-raised hover:text-slate-200"
          aria-label="Log out"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
