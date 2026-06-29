"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import AuthCard from "@/components/AuthCard";
import AuthInput from "@/components/AuthInput";
import { registerUser } from "@/lib/auth";

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setIsLoading(true);

    try {
      await registerUser({
        full_name: fullName || undefined,
        email,
        password,
      });

      router.push("/login");
    } catch {
      setError("Registration failed. The email may already be registered.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthCard
      title="Create your account"
      subtitle="Start building your AI-powered market intelligence workspace."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <AuthInput
          label="Full name"
          type="text"
          value={fullName}
          placeholder="Your name"
          onChange={setFullName}
          required={false}
        />

        <AuthInput
          label="Email"
          type="email"
          value={email}
          placeholder="you@example.com"
          onChange={setEmail}
        />

        <AuthInput
          label="Password"
          type="password"
          value={password}
          placeholder="Minimum 6 characters"
          onChange={setPassword}
        />

        {error ? (
          <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-300">
            {error}
          </div>
        ) : null}

        <button
          suppressHydrationWarning
          type="submit"
          disabled={isLoading}
          className="w-full rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-400/20 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-400">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-cyan-300">
          Sign in
        </Link>
      </p>
    </AuthCard>
  );
}