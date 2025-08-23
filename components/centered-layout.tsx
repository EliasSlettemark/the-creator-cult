import type React from "react";
import { Navbar } from "./navbar";

export function CenteredPageLayout({
  breadcrumbs,
  children,
}: {
  breadcrumbs: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="pb-30 h-[calc(100vh-18px)] no-scrollbar overflow-scroll">
      <div className="px-4 sm:px-6">
        <div className="mx-auto max-w-6xl">{children}</div>
      </div>
    </div>
  );
}
