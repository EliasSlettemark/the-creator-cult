"use client";

import { Button, Theme } from "frosted-ui";
import localFont from "next/font/local";
import WhopLogo from "./WhopLogo";
import { signIn } from "next-auth/react";

const interVariable = localFont({
  src: "../../fonts/InterVariable.woff2",
  variable: "--inter-variable",
});

const AuthClient = () => {
  return (
    <html lang="en" suppressHydrationWarning className={interVariable.variable}>
      <body>
        <Theme asChild appearance="dark" grayColor="gray" accentColor="blue">
          <div id="root" className="w-full h-screen bg-gray-1 flex items-center justify-center">
            <Button
              variant="classic"
              size="4"
              onClick={() => signIn("whop")}
              className="flex items-center gap-2"
            >
              Sign in with <WhopLogo className="w-[137px] h-auto" />
            </Button>
          </div>
        </Theme>
      </body>
    </html>
  );
};

export default AuthClient;
