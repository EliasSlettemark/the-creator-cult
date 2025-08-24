import "./globals.css";
import type { Metadata } from "next";
import { Theme } from "frosted-ui";
import { Inter } from "next/font/google";
import ClientSessionProvider from "./ClientSessionProvider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--inter-font",
});

export const metadata: Metadata = {
  title: "The Creator Cult",
  description: "A platform for creators",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} antialiased`}
        suppressHydrationWarning
      >
        <ClientSessionProvider>
          {children}
        </ClientSessionProvider>
      </body>
    </html>
  );
}
