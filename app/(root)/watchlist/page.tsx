import { headers } from "next/headers";
import { auth } from "@/lib/better-auth/auth";
import { getWatchlistByEmail } from "@/lib/actions/watchlist.actions";
import WatchlistTable, { type WatchlistRow } from "@/components/WatchlistTable";

/**
 * Watchlist Page Component
 * Server Component that:
 * 1. Verifies user authentication
 * 2. Fetches user's watchlist
 * 3. Formats data for table display
 * 4. Renders watchlist with metrics
 */
const WatchlistPage = async () => {
  // Get current user's session
  const session = await auth.api.getSession({ headers: await headers() });
  const email = session?.user?.email as string;

  // Fetch watchlist data with metrics
  const list = await getWatchlistByEmail(email);

  // Format data for table display, ensuring number types
  const rows: WatchlistRow[] = list.map((i: any) => ({
    id: i.id || i._id || `${i.symbol}-${i.company}`,
    symbol: i.symbol,
    company: i.company,
    price: Number(i.price ?? 0),
    change: Number(i.change ?? 0),
    marketCap: Number(i.marketCap ?? 0),
    peRatio: Number(i.peRatio ?? 0),
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-200">Watchlist</h1>
        <p className="text-sm text-gray-500">{rows.length} items</p>
      </div>
      <WatchlistTable initial={rows} userEmail={email} />
    </div>
  );
};

export default WatchlistPage;
