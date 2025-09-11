import clsx from "clsx";
import type React from "react";

export function LockedIcon({
  className,
  ...props
}: React.ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      className={clsx(className, "h-4 shrink-0")}
      {...props}
    >
      <rect x="3" y="6" width="10" height="8" rx="2" />
      <path d="M5 6V4a3 3 0 1 1 6 0v2" />
    </svg>
  );
}