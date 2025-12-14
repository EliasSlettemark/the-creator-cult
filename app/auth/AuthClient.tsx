"use client";

import { Button, Theme } from "frosted-ui";
import localFont from "next/font/local";
import WhopLogo from "./WhopLogo";

const interVariable = localFont({
  src: "../../fonts/InterVariable.woff2",
  variable: "--inter-variable",
});

const AuthClient = () => {
  const handleWhopLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_WHOP_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_WHOP_REDIRECT_URI;
    
    const state = Math.random().toString(36).substring(2, 15);
    localStorage.setItem("whopAuthState", state);
    
    window.location.href = `https://whop.com/oauth?client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}`;
  };

  return (
    <html lang="en" suppressHydrationWarning className={interVariable.variable}>
      <body>
        <Theme asChild appearance="dark" grayColor="gray" accentColor="blue">
          <div className="flex flex-col min-h-screen items-center justify-center gap-4">
            <WhopLogo className="h-[120px] w-[120px]" />
            <Button
              size="4"
              variant="solid"
              color="orange"
              onClick={handleWhopLogin}
            >
              Login with Whop
            </Button>
          </div>
        </Theme>
      </body>
    </html>
  );
};

export default AuthClient;