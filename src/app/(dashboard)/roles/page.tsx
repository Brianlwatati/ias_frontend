"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { rolesApi } from "@/lib/api/roles";
import { Badge } from "@/components/ui/Badge";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";

export default function RolesPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["roles"],
    queryFn: () => rolesApi.list({ page: 1, pageSize: 25 }),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-100">Roles</h1>
          <p className="mt-1 text-sm text-slate-400">
            System-wide or product-scoped roles users can be assigned.
          </p>
        </div>
        <Link href="/roles/new">
          <Button>New role</Button>
        </Link>
      </div>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell header>Name</TableCell>
            <TableCell header>Code</TableCell>
            <TableCell header>Scope</TableCell>
            <TableCell header>Scope key</TableCell>
            <TableCell header>Product</TableCell>
            <TableCell header>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading && (
            <TableRow>
              <TableCell>Loading roles…</TableCell>
            </TableRow>
          )}
          {isError && (
            <TableRow>
              <TableCell>
                Could not load roles. Is ias_backend running?
              </TableCell>
            </TableRow>
          )}
          {data?.data.map((role) => (
            <TableRow key={role.id}>
              <TableCell>
                <div className="text-slate-100">{role.name}</div>
                {role.description && (
                  <div className="text-xs text-slate-500">
                    {role.description}
                  </div>
                )}
              </TableCell>
              <TableCell>
                <code className="text-slate-400">{role.code}</code>
              </TableCell>
              <TableCell>
                <Badge tone={role.scope === "SYSTEM" ? "brand" : "warning"}>
                  {role.scope}
                </Badge>
              </TableCell>
              <TableCell>
                <code className="text-slate-400">{role.roleScopeKey}</code>
              </TableCell>
              <TableCell>{role.productId ?? "—"}</TableCell>
              <TableCell>
                <Badge tone={role.status === "ACTIVE" ? "success" : "neutral"}>
                  {role.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
