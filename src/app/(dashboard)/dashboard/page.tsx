import { Building2, Package, ShieldCheck, Users } from "lucide-react";

const STATS = [
  { label: "Companies", value: "—", icon: Building2 },
  { label: "Active users", value: "—", icon: Users },
  { label: "Products", value: "—", icon: Package },
  { label: "Sessions today", value: "—", icon: ShieldCheck },
];

export default function DashboardOverviewPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold text-slate-100">Overview</h1>
        <p className="mt-1 text-sm text-slate-400">
          Snapshot of tenants, users, and products across the platform.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map(({ label, value, icon: Icon }) => (
          <div key={label} className="card">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">{label}</span>
              <Icon className="h-4 w-4 text-brand-500" />
            </div>
            <p className="mt-3 text-2xl font-semibold text-slate-100">{value}</p>
          </div>
        ))}
      </div>

      <div className="card">
        <p className="text-sm text-slate-400">
          Wire these cards up to your <code className="text-brand-300">/companies</code>,{" "}
          <code className="text-brand-300">/users</code>, and{" "}
          <code className="text-brand-300">/products</code> endpoints via React Query
          once ias_backend is running locally.
        </p>
      </div>
    </div>
  );
}
