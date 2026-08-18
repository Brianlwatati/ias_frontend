"use client";

import { Clock } from "lucide-react";
import type { ManagedUser } from "@/types/user";

export interface UserMetadataSectionProps {
  user: ManagedUser;
}

export function UserMetadataSection({ user }: UserMetadataSectionProps) {
  return (
    <section className="card space-y-5 p-5">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-neutral/10 p-2 text-neutral">
          <Clock className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-100">Activity</h2>
          <p className="text-sm text-slate-400">
            User account history and verification
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Created at
          </p>
          <p className="mt-1 text-sm text-slate-200">
            {new Date(user.createdAt).toLocaleString()}
          </p>
        </div>

        {user.updatedAt && (
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Last updated
            </p>
            <p className="mt-1 text-sm text-slate-200">
              {new Date(user.updatedAt).toLocaleString()}
            </p>
          </div>
        )}

        {user.emailVerifiedAt ? (
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Email verified
            </p>
            <p className="mt-1 text-sm text-slate-200">
              {new Date(user.emailVerifiedAt).toLocaleString()}
            </p>
          </div>
        ) : (
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Email verification
            </p>
            <p className="mt-1 text-sm text-warning">Not verified</p>
          </div>
        )}

        {user.lastLoginAt ? (
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Last login
            </p>
            <p className="mt-1 text-sm text-slate-200">
              {new Date(user.lastLoginAt).toLocaleString()}
            </p>
          </div>
        ) : (
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Last login
            </p>
            <p className="mt-1 text-sm text-slate-400">Never logged in</p>
          </div>
        )}
      </div>
    </section>
  );
}
