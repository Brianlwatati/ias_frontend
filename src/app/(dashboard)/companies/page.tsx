"use client";

import { useQuery } from "@tanstack/react-query";
import { companiesApi } from "@/lib/api/companies";
import { Badge } from "@/components/ui/Badge";
import { Table, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";

export default function CompaniesPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["companies"],
    queryFn: () => companiesApi.list({ page: 1, pageSize: 25 }),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-100">Companies</h1>
          <p className="mt-1 text-sm text-slate-400">Tenants provisioned on this IAS instance.</p>
        </div>
        <Button>New company</Button>
      </div>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell header>Name</TableCell>
            <TableCell header>Slug</TableCell>
            <TableCell header>Plan</TableCell>
            <TableCell header>Status</TableCell>
            <TableCell header>Members</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading && (
            <TableRow>
              <TableCell>Loading companies…</TableCell>
            </TableRow>
          )}
          {isError && (
            <TableRow>
              <TableCell>Could not load companies. Is ias_backend running?</TableCell>
            </TableRow>
          )}
          {data?.data.map((company) => (
            <TableRow key={company.id}>
              <TableCell>{company.name}</TableCell>
              <TableCell>
                <code className="text-slate-400">{company.slug}</code>
              </TableCell>
              <TableCell>
                <Badge tone="brand">{company.plan}</Badge>
              </TableCell>
              <TableCell>
                <Badge tone={company.isActive ? "success" : "neutral"}>
                  {company.isActive ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell>{company.memberCount ?? "—"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
