"use client";

import AuthForm from "../../components/ui/AuthForm";
import OAuthButton from "../../components/ui/OAuthButton";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
      <h1 className="text-3xl font-bold mb-6">Sign Up</h1>

      {/* Signup form with email, password, username */}
      <AuthForm mode="signup" />

      {/* OAuth login options */}
      <OAuthButton provider="google" />
      <OAuthButton provider="github" />

      <p className="mt-4 text-sm text-gray-500">
        Already have an account?{" "}
        <a href="/login" className="text-blue-500 hover:underline">
          Login here
        </a>
      </p>
    </div>
  );
}
