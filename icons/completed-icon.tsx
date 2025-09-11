import clsx from "clsx";
import type React from "react";

export function CompletedIcon({
  className,
  ...props
}: React.ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      className={clsx(className, "h-4 shrink-0")}
      {...props}
    >
      <circle cx="8" cy="8" r="8" className="fill-green-500" />
      <path
        d="M6.5 8.5L7.5 9.5L10.5 6.5"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
} 