"use client";

import AuthForm from "../../components/ui/AuthForm";
import OAuthButton from "../../components/ui/OAuthButton";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
      <h1 className="text-3xl font-bold mb-6">Login</h1>
      <AuthForm mode="login" />
      <OAuthButton provider="google" />
      <OAuthButton provider="github" />
    </div>
  );
}
