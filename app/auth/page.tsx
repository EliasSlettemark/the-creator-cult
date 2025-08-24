import { SessionProvider } from "next-auth/react";
import AuthClient from "./AuthClient";

// Prevent prerendering - this page uses client-side components
export const dynamic = 'force-dynamic';

export default function AuthPage() {
  return (
    <SessionProvider>
      <AuthClient />
    </SessionProvider>
  );
}