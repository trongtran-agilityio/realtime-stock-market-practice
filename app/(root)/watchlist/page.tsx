import { headers } from "next/headers";
import { auth } from "@/lib/better-auth/auth";
import { getWatchlistByEmail } from "@/lib/actions/watchlist.actions";
import WatchlistTable, { type WatchlistRow } from "@/components/WatchlistTable";

/**
 * Watchlist Page Component
 * Server Component that:
 * 1. Verifies user authentication
 * 2. Fetches user's watchlist (without metrics)
 * 3. Generates fake metrics per render
 * 4. Renders watchlist with metrics
 */
const WatchlistPage = async () => {
  // Get current user's session
  const session = await auth.api.getSession({ headers: await headers() });
  const email = session?.user?.email as string;

  // Fetch watchlist data (no metrics)
  const list = await getWatchlistByEmail(email);

  // Generate random metrics for UI only
  const rows: WatchlistRow[] = list.map((i: any) => ({
    id: i.id || i._id || `${i.symbol}-${i.company}`,
    symbol: i.symbol,
    company: i.company,
    price: +(50 + Math.random() * 450).toFixed(2),
    change: +((-5 + Math.random() * 10).toFixed(2)),
    marketCap: Math.floor(1e9 + Math.random() * 999e9),
    peRatio: +(5 + Math.random() * 35).toFixed(2),
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
