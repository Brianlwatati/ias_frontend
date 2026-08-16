"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { companiesApi } from "@/lib/api/companies";
import { usersApi } from "@/lib/api/users";
import { Badge } from "@/components/ui/Badge";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";

function getRoleBadgeTone(
  roleCode?: string | null,
): "brand" | "warning" | "info" | "neutral" {
  const normalizedCode = (roleCode ?? "").toUpperCase();

  if (normalizedCode.includes("SUPER_ADMIN")) return "brand";
  if (normalizedCode.includes("_ADMIN")) return "warning";
  if (normalizedCode.includes("USER") || normalizedCode.includes("MEMBER"))
    return "info";

  return "neutral";
}

export default function UsersPage() {
  const [selectedCompanyId, setSelectedCompanyId] = useState("");

  const { data: companiesData, isLoading: isCompaniesLoading } = useQuery({
    queryKey: ["companies"],
    queryFn: () => companiesApi.list({ page: 1, pageSize: 100 }),
  });

  useEffect(() => {
    const companies = companiesData?.data || [];

    if (!companies || companies.length === 0) {
      return;
    }
    setSelectedCompanyId(
      (current) => current || String(companies[0]?.id ?? ""),
    );
  }, [companiesData]);

  const {
    data: usersData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["users", selectedCompanyId],
    queryFn: () =>
      usersApi.list({ page: 1, pageSize: 25, companyId: selectedCompanyId }),
    enabled: Boolean(selectedCompanyId),
  });

  const selectedCompany = companiesData?.data.find(
    (company) => String(company.id) === selectedCompanyId,
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-100">Users</h1>
          <p className="mt-1 text-sm text-slate-400">
            Manage users for the selected company.
          </p>
        </div>

        <div className="flex flex-col gap-2 md:min-w-[260px]">
          <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Company
          </label>
          <select
            className="input"
            value={selectedCompanyId}
            onChange={(event) => setSelectedCompanyId(event.target.value)}
            disabled={isCompaniesLoading || !companiesData?.data.length}
          >
            {!selectedCompanyId && <option value="">Select a company</option>}
            {companiesData?.data.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name} ({company.code})
              </option>
            ))}
          </select>
        </div>

        <Link
          href={
            selectedCompanyId
              ? `/users/new?companyId=${selectedCompanyId}`
              : "#"
          }
        >
          <Button disabled={!selectedCompanyId}>Invite user</Button>
        </Link>
      </div>

      {selectedCompany && (
        <div className="card flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Active company
            </p>
            <h2 className="mt-1 text-lg font-medium text-slate-100">
              {selectedCompany.name}
            </h2>
          </div>
          <Badge
            tone={selectedCompany.status === "ACTIVE" ? "success" : "neutral"}
          >
            {selectedCompany.status === "ACTIVE" ? "Active" : "Inactive"}
          </Badge>
        </div>
      )}

      <Table>
        <TableHead>
          <TableRow>
            <TableCell header>Name</TableCell>
            <TableCell header>Email</TableCell>
            <TableCell header>Phone</TableCell>
            <TableCell header>Role</TableCell>
            <TableCell header>Status</TableCell>
            <TableCell header>Last login</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isCompaniesLoading && (
            <TableRow>
              <TableCell>Loading companies…</TableCell>
            </TableRow>
          )}
          {!selectedCompanyId && !isCompaniesLoading && (
            <TableRow>
              <TableCell>Select a company to view users.</TableCell>
            </TableRow>
          )}
          {selectedCompanyId && isLoading && (
            <TableRow>
              <TableCell>Loading users…</TableCell>
            </TableRow>
          )}
          {selectedCompanyId && isError && (
            <TableRow>
              <TableCell>
                Could not load users for this company. Is ias_backend running?
              </TableCell>
            </TableRow>
          )}
          {selectedCompanyId &&
            !isLoading &&
            !isError &&
            usersData?.data.length === 0 && (
              <TableRow>
                <TableCell>
                  No users found for {selectedCompany?.name ?? "this company"}.
                </TableCell>
              </TableRow>
            )}
          {usersData?.data.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                {user.firstName} {user.lastName}
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.phone}</TableCell>
              <TableCell>
                <Badge tone={getRoleBadgeTone(user.roleCode)}>
                  {user.roleName ?? user.roleCode ?? "User"}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge tone={user.status === "ACTIVE" ? "success" : "neutral"}>
                  {user.status}
                </Badge>
              </TableCell>
              <TableCell>{user.lastLoginAt ?? "Never"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
