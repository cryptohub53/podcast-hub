"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const signUpSchema = z.object({
    username: z.string()
        .min(3, "Username must be at least 3 characters")
        .max(20, "Username must be less than 20 characters")
        .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
    email: z.string()
        .email("Invalid email address"),
    password: z.string()
        .min(6, "Password must be at least 6 characters")
        .max(50, "Password must be less than 50 characters"),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignUpFormData>({
        resolver: zodResolver(signUpSchema),
    });

    const onSubmit = async (data: SignUpFormData) => {
        try {
            setIsLoading(true);
            setError(null);

            await authService.register({
                username: data.username,
                email: data.email,
                password: data.password,
            });

            router.push("/");
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to create account. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/5">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                        Join PodcastHub
                    </h1>
                    <p className="text-muted-foreground text-lg">Create your account to get started</p>
                </div>

                {/* Form Card */}
                <div className="bg-card border-2 border-border/50 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        {error && (
                            <div className="bg-red-500/10 text-red-500 text-sm p-4 rounded-lg border border-red-500/20 flex items-start gap-3">
                                <svg className="h-5 w-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="username" className="text-base font-semibold text-foreground">Username</Label>
                            <Input
                                id="username"
                                placeholder="johndoe"
                                className="h-12 bg-background border-2 border-border focus:border-primary transition-colors text-base"
                                {...register("username")}
                                disabled={isLoading}
                            />
                            {errors.username && (
                                <p className="text-sm text-red-500 flex items-center gap-1">
                                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    {errors.username.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-base font-semibold text-foreground">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="john@example.com"
                                className="h-12 bg-background border-2 border-border focus:border-primary transition-colors text-base"
                                {...register("email")}
                                disabled={isLoading}
                            />
                            {errors.email && (
                                <p className="text-sm text-red-500 flex items-center gap-1">
                                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-base font-semibold text-foreground">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                className="h-12 bg-background border-2 border-border focus:border-primary transition-colors text-base"
                                {...register("password")}
                                disabled={isLoading}
                            />
                            {errors.password && (
                                <p className="text-sm text-red-500 flex items-center gap-1">
                                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="text-base font-semibold text-foreground">Confirm Password</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="••••••••"
                                className="h-12 bg-background border-2 border-border focus:border-primary transition-colors text-base"
                                {...register("confirmPassword")}
                                disabled={isLoading}
                            />
                            {errors.confirmPassword && (
                                <p className="text-sm text-red-500 flex items-center gap-1">
                                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    {errors.confirmPassword.message}
                                </p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-200 mt-6"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Creating account...
                                </span>
                            ) : (
                                "Create Account"
                            )}
                        </Button>
                    </form>

                    <div className="mt-8 text-center">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-border"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-card text-muted-foreground">Already have an account?</span>
                            </div>
                        </div>
                        <Link
                            href="/login"
                            className="mt-4 inline-block text-primary hover:text-primary/80 font-semibold text-base transition-colors"
                        >
                            Log in instead →
                        </Link>
                    </div>
                </div>

                <p className="text-center text-sm text-muted-foreground mt-6">
                    By signing up, you agree to our Terms & Privacy Policy
                </p>
            </div>
        </div>
    );
}