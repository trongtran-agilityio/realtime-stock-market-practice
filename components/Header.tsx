import Link from "next/link";
import Image from "next/image";
import NavItems from "@/components/NavItems";
import UserDropdown from "@/components/UserDropdown";

/**
 * Header Component
 * Main navigation bar containing logo, nav items and user menu
 * @param user - Current authenticated user object
 */
const Header = ({ user }: { user: User }) => {
  return (
    <header className="sticky top-0 header">
      <div className="container header-wrapper">
        {/* Logo with home link */}
        <Link href="/">
          <Image src="/assets/icons/logo.svg" alt="Signalis logo" width={140} height={32} className="h-8 w-auto cursor-pointer" />
        </Link>

        {/* Navigation items - hidden on mobile */}
        <nav className="hidden sm:block">
          <NavItems />
        </nav>

        {/* User profile dropdown */}
        <UserDropdown user={user} />
      </div>
    </header>
  )
}
export default Header