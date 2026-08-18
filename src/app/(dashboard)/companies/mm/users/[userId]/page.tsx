"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { usersApi } from "@/lib/api/users";
import { Badge } from "@/components/ui/Badge";
import { UserDetailsSection } from "@/components/users/UserDetailsSection";
import { UserStatusSection } from "@/components/users/UserStatusSection";
import { UserMetadataSection } from "@/components/users/UserMetadataSection";
import type { ApiError } from "@/types/api";

const userEditSchema = z.object({
  email: z.string().email("Enter a valid email"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().min(6, "Enter a valid phone number"),
});

const userStatusSchema = z.object({
  status: z.enum(["ACTIVE", "INACTIVE", "PENDING"]),
});

type UserEditForm = z.infer<typeof userEditSchema>;
type UserStatusForm = z.infer<typeof userStatusSchema>;

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

export default function UserDetailsPage() {
  const params = useParams<{
    companyId: string | string[];
    userId: string | string[];
  }>();
  const queryClient = useQueryClient();

  const companyId =
    typeof params.companyId === "string"
      ? params.companyId
      : Array.isArray(params.companyId)
        ? (params.companyId[0] ?? "")
        : "";

  const userId =
    typeof params.userId === "string"
      ? params.userId
      : Array.isArray(params.userId)
        ? (params.userId[0] ?? "")
        : "";

  const { data: user, isLoading } = useQuery({
    queryKey: ["user", companyId, userId],
    queryFn: () => usersApi.get(companyId, userId),
    enabled: !!companyId && !!userId,
  });

  const detailForm = useForm<UserEditForm>({
    resolver: zodResolver(userEditSchema),
  });

  const statusForm = useForm<UserStatusForm>({
    resolver: zodResolver(userStatusSchema),
    defaultValues: { status: "ACTIVE" },
  });

  useEffect(() => {
    if (!user) return;

    detailForm.reset({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
    });
    statusForm.reset({ status: user.status });
  }, [user, detailForm, statusForm]);

  const { mutate: updateUser, isPending: isUpdatingUser } = useMutation({
    mutationFn: (values: UserEditForm) => {
      if (!companyId || !userId) {
        throw new Error("Company ID and User ID are required");
      }

      return usersApi.update(companyId, userId, {
        email: values.email,
        firstName: values.firstName,
        lastName: values.lastName,
        phone: values.phone,
      });
    },
    onSuccess: () => {
      toast.success("User details updated");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", companyId, userId] });
    },
    onError: (error: ApiError) => {
      toast.error(error.message ?? "Could not update user details");
    },
  });

  const { mutate: updateStatus, isPending: isUpdatingStatus } = useMutation({
    mutationFn: (values: UserStatusForm) => {
      if (!companyId || !userId) {
        throw new Error("Company ID and User ID are required");
      }

      return usersApi.updateStatus(companyId, userId, values.status);
    },
    onSuccess: () => {
      toast.success("User status updated");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", companyId, userId] });
    },
    onError: (error: ApiError) => {
      toast.error(error.message ?? "Could not update user status");
    },
  });

  const onUserSubmit = (values: UserEditForm) => {
    updateUser(values);
  };

  const onStatusSubmit = (values: UserStatusForm) => {
    updateStatus(values);
  };

  if (!companyId || !userId) {
    return (
      <div className="max-w-3xl space-y-6">
        <p className="text-danger">Company ID and User ID are required.</p>
      </div>
    );
  }

  if (isLoading || !user) {
    return (
      <div className="max-w-3xl space-y-6">
        <p className="text-slate-400">Loading user…</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <Link
          href={`/companies/${companyId}/users`}
          className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-slate-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to users
        </Link>
        <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-100">
              {user.firstName} {user.lastName}
            </h1>
            <p className="mt-1 text-sm text-slate-400">{user.email}</p>
          </div>
          <div className="flex gap-2">
            <Badge tone={getRoleBadgeTone(user.roleCode)}>
              {user.roleName ?? user.roleCode ?? "User"}
            </Badge>
            <Badge
              tone={
                user.status === "ACTIVE"
                  ? "success"
                  : user.status === "PENDING"
                    ? "warning"
                    : "neutral"
              }
            >
              {user.status}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <UserDetailsSection
          user={user}
          register={detailForm.register}
          errors={detailForm.formState.errors}
          isPending={isUpdatingUser}
          handleSubmit={detailForm.handleSubmit}
          onSubmit={onUserSubmit}
        />

        <UserStatusSection
          user={user}
          register={statusForm.register}
          errors={statusForm.formState.errors}
          isPending={isUpdatingStatus}
          handleSubmit={statusForm.handleSubmit}
          onSubmit={onStatusSubmit}
        />
      </div>

      <UserMetadataSection user={user} />
    </div>
  );
}
