'use client';

import { DropdownMenu } from "frosted-ui";
import { signOut } from "next-auth/react";

export function LogoutButton() {
  return (
    <DropdownMenu.Item onClick={() => signOut()}>
      Log out
    </DropdownMenu.Item>
  );
} 