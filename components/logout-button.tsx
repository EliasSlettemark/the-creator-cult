'use client';

import { DropdownMenu } from "frosted-ui";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();
  
  const handleLogout = () => {
    // Clear cookies
    document.cookie = "whop_user=; path=/; max-age=0";
    document.cookie = "whop_member=; path=/; max-age=0";
    // Redirect to auth page
    router.push("/auth");
  };

  return (
    <DropdownMenu.Item onClick={handleLogout}>
      Log out
    </DropdownMenu.Item>
  );
} 