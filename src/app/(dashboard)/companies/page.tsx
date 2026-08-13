"use client";

import { useQuery } from "@tanstack/react-query";
import { companiesApi } from "@/lib/api/companies";
import { Badge } from "@/components/ui/Badge";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

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
          <p className="mt-1 text-sm text-slate-400">
            Tenants provisioned on this IAS instance.
          </p>
        </div>
        <Link href="/companies/new">
          <Button>New company</Button>
        </Link>
      </div>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell header>Name</TableCell>
            <TableCell header>Code</TableCell>
            <TableCell header>Status</TableCell>
            <TableCell header>Email</TableCell>
            <TableCell header>Phone</TableCell>
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
              <TableCell>
                Could not load companies. Is ias_backend running?
              </TableCell>
            </TableRow>
          )}
          {data?.data.map((company) => (
            <TableRow key={company.id}>
              <TableCell>{company.name}</TableCell>
              <TableCell>
                <code className="text-slate-400">{company.code}</code>
              </TableCell>

              <TableCell>
                <Badge
                  tone={company.status === "ACTIVE" ? "success" : "neutral"}
                >
                  {company.status === "ACTIVE" ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell>{company.email ?? "—"}</TableCell>
              <TableCell>{company.phone ?? "—"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
