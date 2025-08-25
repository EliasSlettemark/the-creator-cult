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
            <div
              className="absolute inset-0 bg-panel-translucent -z-[1]"
              style={{ filter: "url(#myFilter" }}
            />
            <Button
              variant="classic"
              size="4"
              onClick={() => signIn("whop",)}
            >
              Sign in with <WhopLogo className="w-[137px] h-auto" />
            </Button>
          </div>
        </Theme>
        <svg>
          <defs>
            <filter id="myFilter">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.55"
                numOctaves="2"
              />
              <feComponentTransfer>
                <feFuncA type="linear" slope="89" intercept="-15" />
              </feComponentTransfer>
              <feComposite in="SourceGraphic" operator="in" />
            </filter>
          </defs>
        </svg>
      </body>
    </html>
  );
};

export default AuthClient;
