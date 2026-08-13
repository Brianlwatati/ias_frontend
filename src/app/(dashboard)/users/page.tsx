"use client";

import { useQuery } from "@tanstack/react-query";
import { usersApi } from "@/lib/api/users";
import { Badge } from "@/components/ui/Badge";
import { Table, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";

const ROLE_TONE = {
  super_admin: "brand",
  company_admin: "warning",
  member: "neutral",
} as const;

export default function UsersPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["users"],
    queryFn: () => usersApi.list({ page: 1, pageSize: 25 }),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-100">Users</h1>
          <p className="mt-1 text-sm text-slate-400">
            Everyone with access, across every tenant.
          </p>
        </div>
        <Button>Invite user</Button>
      </div>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell header>Name</TableCell>
            <TableCell header>Email</TableCell>
            <TableCell header>Role</TableCell>
            <TableCell header>Status</TableCell>
            <TableCell header>Last login</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading && (
            <TableRow>
              <TableCell>Loading users…</TableCell>
            </TableRow>
          )}
          {isError && (
            <TableRow>
              <TableCell>Could not load users. Is ias_backend running?</TableCell>
            </TableRow>
          )}
          {data?.data.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                {user.firstName} {user.lastName}
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Badge tone={ROLE_TONE[user.role]}>{user.role}</Badge>
              </TableCell>
              <TableCell>
                <Badge tone={user.isActive ? "success" : "neutral"}>
                  {user.isActive ? "Active" : "Inactive"}
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
