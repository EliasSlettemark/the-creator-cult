import { SessionProvider } from "next-auth/react";
import HomeClient from "@/app/dashboard/HomeClient";

// Prevent prerendering - this page uses client-side hooks
export const dynamic = 'force-dynamic';

const HomePage = () => {
  return (
    <SessionProvider>
      <HomeClient />
    </SessionProvider>
  );
};

export default HomePage;