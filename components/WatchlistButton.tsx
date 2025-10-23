"use client";

import React from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { toggleWatchlist } from "@/lib/actions/watchlist.actions";

/**
 * WatchlistButton Props
 * @property symbol - Stock symbol to watch
 * @property company - Company name (optional)
 * @property userEmail - Current user's email
 * @property initialInWatchlist - Whether stock is initially in watchlist
 */
interface WatchlistButtonProps {
  symbol: string;
  company?: string;
  userEmail: string;
  initialInWatchlist?: boolean;
}

/**
 * WatchlistButton Component
 * Toggle button for adding/removing stocks from watchlist
 * Features:
 * - Optimistic UI updates
 * - Loading state handling
 * - Success/error toasts
 * - Responsive design (shows text on desktop)
 */
const WatchlistButton: React.FC<WatchlistButtonProps> = ({ symbol, company, userEmail, initialInWatchlist = false }) => {
  // State for tracking watchlist status and loading state
  const [added, setAdded] = React.useState<boolean>(initialInWatchlist);
  const [loading, setLoading] = React.useState(false);

  /**
   * Handle watchlist toggle with optimistic updates
   */
  const onToggle = async () => {
    if (loading) return;
    const prev = added;
    setAdded(!prev);
    setLoading(true);
    try {
      const res = await toggleWatchlist(userEmail, symbol, company || symbol);
      if (!res?.ok) {
        setAdded(prev);
        toast.error("Failed to update watchlist.");
        return;
      }
      if (res.action === 'added') toast.success(`${symbol} added to Watchlist`);
      if (res.action === 'removed') toast.success(`${symbol} removed from Watchlist`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      aria-label={added ? "Remove from watchlist" : "Add to watchlist"}
      onClick={onToggle}
      className={(added ? "text-yellow-500" : "text-gray-500 hover:text-yellow-500") + " flex items-center gap-2"}
      disabled={loading}
      title={added ? `Remove ${symbol} from watchlist` : `Add ${symbol} to watchlist`}
    >
      <Star className="h-5 w-5" fill={added ? "currentColor" : "none"} />
      <span className="hidden sm:inline-block">
        {added ? "In Watchlist" : "Add to Watchlist"}
      </span>
    </button>
  );
};

export default WatchlistButton;
