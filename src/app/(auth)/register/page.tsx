"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { authApi } from "@/lib/api/auth";
import { session } from "@/lib/auth/session";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

const registerSchema = z.object({
  companyName: z.string().min(2, "Company name is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) });

  async function onSubmit(values: RegisterForm) {
    setIsSubmitting(true);
    try {
      const {
        data: { tokens },
      } = await authApi.register(values);
      session.setAccessToken(tokens.accessToken);
      session.setAuthCookie();
      router.push("/dashboard");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not create account";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="flex flex-col items-center gap-2 text-center">
          <ShieldCheck className="h-8 w-8 text-brand-500" />
          <h1 className="text-lg font-semibold text-slate-100">
            Create your company
          </h1>
          <p className="text-sm text-slate-400">
            Sets up a new tenant and its first admin user
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="card space-y-4">
          <Input
            id="companyName"
            label="Company name"
            placeholder="Acme Inc."
            error={errors.companyName?.message}
            {...register("companyName")}
          />
          <div className="grid grid-cols-2 gap-3">
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
            label="Work email"
            placeholder="you@company.com"
            error={errors.email?.message}
            {...register("email")}
          />
          <Input
            id="password"
            type="password"
            label="Password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register("password")}
          />
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creating account…" : "Create account"}
          </Button>
        </form>
      </div>
    </div>
  );
}
