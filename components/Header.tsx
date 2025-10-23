import Link from "next/link";
import Image from "next/image";
import NavItems from "@/components/NavItems";
import UserDropdown from "@/components/UserDropdown";
import { searchStocks } from "@/lib/actions/finnhub.actions";
import { getWatchlistSymbolsByEmail } from "@/lib/actions/watchlist.actions";

/**
 * Header Component
 * Main navigation bar containing logo, nav items and user menu
 * @param user - Current authenticated user object
 */
const Header = async ({ user }: { user: User }) => {

  const initialStocks = await searchStocks();
  const watchlistSymbols = await getWatchlistSymbolsByEmail(user.email);

  return (
    <header className="sticky top-0 header">
      <div className="container header-wrapper">
        {/* Logo with home link */}
        <Link href="/">
          <Image src="/assets/icons/logo.svg" alt="Signalis logo" width={140} height={32} className="h-8 w-auto cursor-pointer" />
        </Link>

        {/* Navigation items - hidden on mobile */}
        <nav className="hidden sm:block">
          <NavItems initialStocks={initialStocks} userEmail={user.email} watchlistSymbols={watchlistSymbols} />
        </nav>

        {/* User profile dropdown */}
        <UserDropdown
          user={user}
          initialStocks={initialStocks}
          watchlistSymbols={watchlistSymbols}
        />
      </div>
    </header>
  )
}
export default Header