"use client";

import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { clearAuthToken, getCurrentUser } from "@/lib/auth";

type AuthGuardProps = {
  children: ReactNode;
};

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    async function verifyAccess() {
      try {
        const user = await getCurrentUser();

        if (!user) {
          clearAuthToken();
          router.replace("/login");
          return;
        }

        setHasAccess(true);
      } catch {
        clearAuthToken();
        router.replace("/login");
      } finally {
        setIsChecking(false);
      }
    }

    verifyAccess();
  }, [router]);

  if (isChecking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#070a12] text-white">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-4 text-sm text-slate-300">
          Checking secure access...
        </div>
      </main>
    );
  }

  if (!hasAccess) {
    return null;
  }

  return <>{children}</>;
}