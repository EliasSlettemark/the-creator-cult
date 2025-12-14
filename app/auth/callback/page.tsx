"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function CallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get("code");
      const state = searchParams.get("state");
      const storedState = localStorage.getItem("whopAuthState");

      if (!code) {
        router.push("/auth?error=no_code");
        return;
      }

      if (state !== storedState) {
        router.push("/auth?error=state_mismatch");
        return;
      }

      try {
        const response = await fetch("/api/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        });

        const { user, isMember } = await response.json();

        if (!isMember) {
          router.push("/auth?error=not_member");
          return;
        }

        // Cookies are set by the API route, just redirect
        router.push("/dashboard");
      } catch (error) {
        console.error("Auth error:", error);
        router.push("/auth?error=auth_failed");
      }
    };

    handleCallback();
  }, [searchParams, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <p>Completing authentication...</p>
      </div>
    </div>
  );
}

