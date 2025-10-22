'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut } from "lucide-react";
import NavItems from "@/components/NavItems";
import { signOut } from "@/lib/actions/auth.actions";

/**
 * UserDropdown Component
 * Provides user profile menu with:
 * - User avatar and info
 * - Sign out functionality
 * - Mobile navigation menu
 */
const UserDropdown = ({ user, initialStocks }: { user: User, initialStocks: StockWithWatchlistStatus[] }) => {
  const router = useRouter();

  /**
   * Handle user sign out and redirect to login
   */
  const handleSignOut = async () => {
    await signOut();
    router.push("/sign-in");
  }

  return (
    <DropdownMenu>
      {/* Dropdown trigger with user avatar */}
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-3 text-gray-4 hover:text-yellow-500">
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback className="bg-yellow-500 text-yellow-900 text-sm font-bold">
              {user.name[0]}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:flex flex-col items-start">
            <span className="text-base font-medium text-gray-400">
              {user.name}
            </span>
          </div>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="text-gray-400">
        {/* User profile header */}
        <DropdownMenuLabel>
          <div className="flex relative items-center gap-3 py-2">
            <Avatar className="h-10 w-10">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback className="bg-yellow-500 text-yellow-900 text-sm font-bold">
                {user.name[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col font-medium text-gray-400">
              <span className="text-base font-medium text-gray-400">
                {user.name}
              </span>
              <span className="text-sm text-gray-500">{user.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-600" />

        {/* Sign out button */}
        <DropdownMenuItem onClick={handleSignOut} className="text-gray-100 text-md font-medium focus:bg-transparent focus:text-yellow-500 transition-colors cursor-pointer">
          <LogOut className="h-4 w-4 hidden sm:block" />
          Logout
        </DropdownMenuItem>

        {/* Mobile navigation menu */}
        <DropdownMenuSeparator className="hidden sm:block bg-gray-600" />
        <nav className="sm:hidden">
          <NavItems initialStocks={initialStocks} />
        </nav>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
export default UserDropdown
