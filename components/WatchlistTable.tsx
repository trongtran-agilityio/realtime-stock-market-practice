"use client";

import React from "react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Star } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { toggleWatchlist } from "@/lib/actions/watchlist.actions";
import { formatMarketCapValue } from "@/lib/utils";

/**
 * Watchlist data row type definition
 * Represents a single stock entry in the watchlist
 */
export type WatchlistRow = {
  id: string;
  symbol: string;
  company: string;
  price: number;
  change: number; // percentage
  marketCap: number;
  peRatio: number;
};

// Number of items to load per scroll
const PAGE_SIZE = 20;

/**
 * WatchlistTable Component
 * Displays user's watchlist with infinite scroll and real-time updates
 * Features:
 * - Infinite scroll pagination
 * - Optimistic UI updates
 * - Add/remove stocks with animation
 * - Sort by various metrics
 * 
 * @param initial - Initial watchlist data
 * @param userEmail - Current user's email for actions
 */
export default function WatchlistTable({
  initial,
  userEmail,
}: {
  initial: WatchlistRow[];
  userEmail: string;
}) {
  // State for managing table data and UI
  const [data, setData] = React.useState(initial);
  const [visibleCount, setVisibleCount] = React.useState(Math.min(PAGE_SIZE, initial.length));
  const [unstarred, setUnstarred] = React.useState<Set<string>>(new Set());
  const loaderRef = React.useRef<HTMLDivElement | null>(null);

  /**
   * Infinite scroll implementation using Intersection Observer
   * Loads more items when user scrolls near bottom
   */
  React.useEffect(() => {
    const el = loaderRef.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      const first = entries[0];
      if (first.isIntersecting) {
        setVisibleCount((c) => Math.min(c + PAGE_SIZE, data.length));
      }
    });
    io.observe(el);
    return () => io.disconnect();
  }, [data.length]);

  /**
   * Handle adding/removing stocks from watchlist
   * Uses optimistic updates for better UX
   * 
   * @param symbol - Stock symbol to toggle
   * @param company - Company name for new additions
   */
  const handleToggle = async (symbol: string, company: string) => {
    const wasInWatchlist = !unstarred.has(symbol);

    // Optimistic update: toggle star state but keep row visible
    const prevSet = new Set(unstarred);
    const nextSet = new Set(unstarred);
    if (wasInWatchlist) {
      nextSet.add(symbol); // mark as unstarred (removed in DB)
    } else {
      nextSet.delete(symbol); // mark as starred (added in DB)
    }
    setUnstarred(nextSet);

    // Attempt server update
    const res = await toggleWatchlist(userEmail, symbol, company);

    // Handle server response and show appropriate toast
    if (!res?.ok) {
      // Rollback on failure
      setUnstarred(prevSet);
      toast.error("Failed to update watchlist. Please try again.");
      return;
    }

    // Update UI based on server action
    if (res.action === "removed") {
      setUnstarred((s) => new Set(s).add(symbol));
      toast.success(`${symbol} removed from Watchlist`);
    } else if (res.action === "added") {
      setUnstarred((s) => {
        const copy = new Set(s);
        copy.delete(symbol);
        return copy;
      });
      toast.success(`${symbol} added to Watchlist`);
    } else {
      toast.success(`${symbol} updated`);
    }
  };

  // Get currently visible rows based on scroll position
  const visible = data.slice(0, visibleCount);

  return (
    <div className="space-y-2">
      <Table>
        {/* Table header with column titles */}
        <TableHeader>
          <TableRow>
            <TableHead className="w-10"></TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Symbol</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Change</TableHead>
            <TableHead className="text-right">Market Cap</TableHead>
            <TableHead className="text-right">P/E Ratio</TableHead>
          </TableRow>
        </TableHeader>

        {/* Table body with watchlist entries */}
        <TableBody>
          {visible.map((row) => (
            <TableRow key={row.id}>
              <TableCell className="w-10">
                <button
                  aria-label="Toggle watchlist"
                  onClick={() => handleToggle(row.symbol, row.company)}
                  className={(unstarred.has(row.symbol) ? "text-gray-500 hover:text-yellow-500" : "text-yellow-500")}
                  title={unstarred.has(row.symbol) ? "Add to watchlist" : "Remove from watchlist"}
                >
                  <Star className="h-4 w-4" fill={unstarred.has(row.symbol) ? "none" : "currentColor"} />
                </button>
              </TableCell>
              <TableCell>
                <Link href={`/stocks/${row.symbol}`} className="hover:text-yellow-500">
                  {row.company}
                </Link>
              </TableCell>
              <TableCell className="font-mono">{row.symbol}</TableCell>
              <TableCell className="text-right">${row.price.toFixed(2)}</TableCell>
              <TableCell className={"text-right " + (row.change >= 0 ? "text-green-500" : "text-red-500")}>
                {row.change > 0 ? "+" : ""}
                {row.change.toFixed(2)}%
              </TableCell>
              <TableCell className="text-right">{formatMarketCapValue(row.marketCap)}</TableCell>
              <TableCell className="text-right">{row.peRatio.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>

        {/* Empty state message */}
        {data.length === 0 && <TableCaption>No items in your watchlist yet.</TableCaption>}
      </Table>

      {/* Infinite scroll trigger element */}
      <div ref={loaderRef} className="h-6" />
    </div>
  );
}
