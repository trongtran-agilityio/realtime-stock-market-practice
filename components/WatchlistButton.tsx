"use client";

import React from "react";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";

interface WatchlistButtonProps {
  symbol: string;
}

/**
 * Minimal WatchlistButton placeholder.
 * Renders a button for adding/removing a symbol to/from a watchlist.
 * This satisfies layout/rendering requirements; actual CRUD can be added later.
 */
const WatchlistButton: React.FC<WatchlistButtonProps> = ({ symbol }) => {
  const [added, setAdded] = React.useState(false);

  // TODO: Not yet implement add to watchlist feature.

  return (
    <Button
      variant='default'
      className={cn(
        'flex items-center gap-2 transition-all',
        added ? 'watchlist-icon-added' : ''
      )}
      onClick={() => setAdded((s) => !s)}
    >
      {added ? `Remove ${symbol} from watchlist` : `Add ${symbol} to watchlist`}
    </Button>
  );
};

export default WatchlistButton;
