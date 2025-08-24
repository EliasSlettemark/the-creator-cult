"use client";

import { Button } from "frosted-ui";
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
        <div className="w-full h-screen flex items-center justify-center bg-gray-1">
          <Button
            variant="classic"
            size="4"
            onClick={() => signIn("whop")}
          >
            Sign in with <WhopLogo className="w-[137px] h-auto" />
          </Button>
        </div>
      </body>
    </html>
  );
};

export default AuthClient;
