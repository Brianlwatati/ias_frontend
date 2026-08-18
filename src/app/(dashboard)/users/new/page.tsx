"use client";

import { Suspense, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { usersApi } from "@/lib/api/users";
import { companiesApi } from "@/lib/api/companies";
import { rolesApi } from "@/lib/api/roles";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { ApiError } from "@/types/api";

// Kept in sync with the SYSTEM_ROLE_TONE / getSystemRoleLabel mapping on the
// users list page — update both places together if the backend adds roles.
const SYSTEM_ROLES = [
  // { id: 1, label: "Super Administrator" }, // Not used in the UI, but exists in the backend
  { id: 2, label: "Company Administrator" },
];

const userSchema = z.object({
  companyId: z.string().min(1, "Select a company"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(6, "Enter a valid phone number"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  systemRoleId: z.string().min(1, "Select a role"),
});

type UserForm = z.infer<typeof userSchema>;

function NewUserForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const companyIdFromQuery = searchParams.get("companyId") ?? "";

  const { data: companies } = useQuery({
    queryKey: ["companies"],
    queryFn: () => companiesApi.list({ page: 1, pageSize: 100 }),
  });

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<UserForm>({
    resolver: zodResolver(userSchema),
    defaultValues: { companyId: companyIdFromQuery, systemRoleId: "2" },
  });

  const selectedCompanyId = watch("companyId");

  const { data: companyRolesData, isLoading: isLoadingRoles } = useQuery({
    queryKey: ["company-roles", selectedCompanyId],
    queryFn: () =>
      rolesApi.list({
        page: 1,
        pageSize: 100,
        companyId: selectedCompanyId,
      }),
    enabled: Boolean(selectedCompanyId),
  });

  const availableRoles =
    selectedCompanyId && companyRolesData
      ? companyRolesData.data
      : SYSTEM_ROLES;

  useEffect(() => {
    if (!availableRoles.length) {
      return;
    }

    const currentRoleId = watch("systemRoleId");
    const hasCurrentRole = availableRoles.some(
      (role) => String(role.id) === currentRoleId,
    );

    if (!currentRoleId || !hasCurrentRole) {
      setValue("systemRoleId", String(availableRoles[0]?.id), {
        shouldValidate: true,
      });
    }
  }, [availableRoles, setValue, watch]);

  const { mutate, isPending } = useMutation({
    mutationFn: (payload: {
      companyId: number;
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      password: string;
      systemRoleId: number;
    }) => usersApi.create(payload.companyId, payload),
    onSuccess: (_, variables) => {
      toast.success("User created");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      router.push(`/users?companyId=${variables.companyId}`);
    },
    onError: (error: ApiError) => {
      toast.error(error.message ?? "Could not create user");
    },
  });

  function onSubmit(values: UserForm) {
    mutate({
      companyId: Number(values.companyId),
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      phone: values.phone,
      password: values.password,
      systemRoleId: Number(values.systemRoleId),
    });
  }

  return (
    <div className="w-full space-y-6">
      <div>
        <Link
          href="/users"
          className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-slate-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to users
        </Link>
        <h1 className="mt-3 text-xl font-semibold text-slate-100">
          Invite user
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Creates a user under the selected company.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="card space-y-4">
        <div className="space-y-1.5">
          <label
            htmlFor="companyId"
            className="text-sm font-medium text-slate-300"
          >
            Company
          </label>
          <Controller
            name="companyId"
            control={control}
            render={({ field }) => (
              <select id="companyId" className="input" {...field}>
                <option value="">Select a company…</option>
                {companies?.data.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name} ({company.code})
                  </option>
                ))}
              </select>
            )}
          />
          {errors.companyId && (
            <p className="text-xs text-danger">{errors.companyId.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            id="firstName"
            label="First name"
            error={errors.firstName?.message}
            {...register("firstName")}
          />
          <Input
            id="lastName"
            label="Last name"
            error={errors.lastName?.message}
            {...register("lastName")}
          />
        </div>

        <Input
          id="email"
          type="email"
          label="Email"
          placeholder="user@company.com"
          error={errors.email?.message}
          {...register("email")}
        />
        <Input
          id="phone"
          type="tel"
          label="Phone"
          placeholder="+1 555 123 4567"
          error={errors.phone?.message}
          {...register("phone")}
        />
        <Input
          id="password"
          type="password"
          label="Temporary password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register("password")}
        />

        <div className="space-y-1.5">
          <label
            htmlFor="systemRoleId"
            className="text-sm font-medium text-slate-300"
          >
            Role
          </label>
          <select
            id="systemRoleId"
            className="input"
            disabled={isLoadingRoles || !availableRoles.length}
            {...register("systemRoleId")}
          >
            {!availableRoles.length && (
              <option value="">No roles available for this company</option>
            )}
            {availableRoles.map((role) => (
              <option key={role.id} value={role.id}>
                {"label" in role ? role.label : role.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Link href="/users">
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Creating…" : "Create user"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default function NewUserPage() {
  return (
    <Suspense fallback={<div className="max-w-lg space-y-6" />}>
      <NewUserForm />
    </Suspense>
  );
}
