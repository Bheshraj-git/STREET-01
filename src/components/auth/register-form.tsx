"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { registerSchema, type RegisterInput } from "@/lib/schemas/auth";
import { registerUser } from "@/lib/actions/register";
import { notify } from "@/lib/toast";

export function RegisterForm() {
    const router = useRouter();
    const [serverError, setServerError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<RegisterInput>({
        resolver: zodResolver(registerSchema),
    });

    async function onSubmit(values: RegisterInput) {
        setSubmitting(true);
        setServerError(null);

        const result = await registerUser(values);

        if (!result.ok) {
            if (result.field) {
                setError(result.field, { message: result.error });
            } else {
                setServerError(result.error);
            }
            setSubmitting(false);
            return;
        }

        // Auto-login
        const login = await signIn("credentials", {
            email: values.email,
            password: values.password,
            redirect: false,
        });

        if (!login || login.error) {
            router.push("/login?registered=1");
            return;
        }

        notify.success("Welcome to STREET/01");
        router.push("/account");
        router.refresh();
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
            <div>
                <label htmlFor="name" className="text-eyebrow mb-2 block">
                    Full name
                </label>
                <Input id="name" autoComplete="name" {...register("name")} />
                {errors.name && (
                    <p className="mt-1 text-xs text-sale">{errors.name.message}</p>
                )}
            </div>

            <div>
                <label htmlFor="email" className="text-eyebrow mb-2 block">
                    Email
                </label>
                <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    {...register("email")}
                />
                {errors.email && (
                    <p className="mt-1 text-xs text-sale">{errors.email.message}</p>
                )}
            </div>

            <div>
                <label htmlFor="password" className="text-eyebrow mb-2 block">
                    Password
                </label>
                <Input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    {...register("password")}
                />
                {errors.password && (
                    <p className="mt-1 text-xs text-sale">{errors.password.message}</p>
                )}
            </div>

            <div>
                <label htmlFor="confirmPassword" className="text-eyebrow mb-2 block">
                    Confirm password
                </label>
                <Input
                    id="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    {...register("confirmPassword")}
                />
                {errors.confirmPassword && (
                    <p className="mt-1 text-xs text-sale">
                        {errors.confirmPassword.message}
                    </p>
                )}
            </div>

            {serverError && (
                <div className="border border-sale/40 bg-sale/5 px-4 py-3 text-xs text-sale">
                    {serverError}
                </div>
            )}

            <Button type="submit" size="lg" disabled={submitting} className="mt-2 w-full">
                {submitting ? "Creating account…" : "Create account"}
            </Button>
        </form>
    );
}