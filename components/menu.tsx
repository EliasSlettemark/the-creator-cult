import { GearIcon } from "@radix-ui/react-icons";
import { DropdownMenu, IconButton } from "frosted-ui";
import { LogoutButton } from "@/components/logout-button";

export function Menu() {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <IconButton variant="surface" size="3">
          <GearIcon width="20" height="20" color="var(--gray-10)" />
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end" size="2">
        <LogoutButton />
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
