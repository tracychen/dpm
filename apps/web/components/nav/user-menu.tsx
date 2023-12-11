"use client";

import { signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { truncateString } from "@/lib/utils";
import { Address, disconnect, fetchEnsName } from "@wagmi/core";
import { useRouter } from "next/navigation";
import { Icons } from "../icons";

interface UserMenuProps {
  imageUrl: string;
  evmAddress: string;
}

export async function UserMenu({ imageUrl, evmAddress }: UserMenuProps) {
  const router = useRouter();

  // const username = await fetchEnsName({
  //   address: evmAddress as Address,
  //   chainId: 1,
  // });
  // TODO replace with correct username
  const username = truncateString(evmAddress);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-x-2 hover:cursor-pointer">
          <Avatar className="h-10 w-10">
            <AvatarImage src={imageUrl} alt={username} />
            <AvatarFallback>
              <Icons.user className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <Icons.caretdown className="h-4 w-4" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {username || truncateString(evmAddress)}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {truncateString(evmAddress)}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="cursor-pointer"
            onSelect={() => router.push(`/account`)}
          >
            <Icons.user className="mr-2 h-4 w-4" />
            My Account
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onSelect={() => router.push("/settings")}
          >
            <Icons.settings className="mr-2 h-4 w-4" />
            Settings
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={async (event) => {
            event.preventDefault();
            await disconnect();
            await signOut({
              callbackUrl: "/",
            });
          }}
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
