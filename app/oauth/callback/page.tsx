"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function CallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const code = searchParams.get("code");

    if (code) {
      fetch("/api/oauth/whop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.isMember) {
            // Cookies are set by the API route, just redirect
            router.push("/dashboard");
          } else {
            router.push("/auth?error=not_member");
          }
        })
        .catch((err: any) => {
          console.error(err);
          router.push("/auth?error=auth_failed");
        });
    }
  }, [searchParams, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <p>Completing authentication...</p>
      </div>
    </div>
  );
}
