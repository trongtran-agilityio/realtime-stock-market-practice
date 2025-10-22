"use client"

import { useEffect, useState } from "react"
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command"
import { Button } from "@/components/ui/button";
import {Loader2, Star, TrendingUp} from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { searchStocks } from "@/lib/actions/finnhub.actions";
import Link from "next/link";

interface SearchCommandProps {
  renderAs?: 'button' | 'text';
  label?: string
  initialStocks: StockWithWatchlistStatus[];
}

export default function SearchCommand({ renderAs = 'button', label = 'Add stock', initialStocks }: SearchCommandProps) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(false)
  const [stocks, setStocks] = useState<StockWithWatchlistStatus[]>(initialStocks);

  const isSearchMode = searchTerm.trim();
  const displayStocks = isSearchMode ? stocks : stocks?.slice(0, 10);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setOpen((v) => !v)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [open])

  const handleSearch = async () => {
    if (!isSearchMode) return initialStocks;

    setLoading(true);
    try {
      const results = await searchStocks(searchTerm.trim());
      setStocks(results);
    } catch {
      setStocks([]);
    } finally {
      setLoading(false);
    }
  }

  const debouncedSearch = useDebounce(handleSearch, 300);

  useEffect(() => {
    debouncedSearch();
  }, [searchTerm]);

  const handleSelectStock = () => {
    setOpen(false);
    setSearchTerm('');
    setStocks(initialStocks);
  }

  return (
    <>
      {
        renderAs === 'text' ? (
          <span onClick={() => setOpen(true)} className="search-text">
            {label}
          </span>
        ) : (
          <Button onClick={() => setOpen(true)} className="search-btn">
            {label}
          </Button>
        )
      }

      <CommandDialog open={open} onOpenChange={setOpen} className="search-dialog">
        <div className="search-field">
          <CommandInput
            placeholder="Search stocks..."
            className="search-input"
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          {loading && <Loader2 className="search-loader" />}
        </div>

        <CommandList className="search-list">
          {loading ? (
            <CommandEmpty className="search-list-empty">Loading stocks ...</CommandEmpty>
          ) : displayStocks.length === 0 ? (
            <div className="search-list-indicator">
              {isSearchMode ? 'No Results found' : 'No stocks available'}
            </div>
          ) : (
            <CommandGroup>
              <div className="search-count">
                {isSearchMode ? 'Search results' : 'Popular stocks'}
                {" "} ({displayStocks.length || 0})
              </div>
              {displayStocks?.map((stock) => (
                <CommandItem key={stock.symbol} className="search-item" asChild>
                  <Link
                    href={`/stocks/${stock.symbol}`}
                    onClick={handleSelectStock}
                    className="search-item-link"
                  >
                    <TrendingUp className="h-4 w-4 text-gray-500" />
                    <div className="flex-1">
                      <div className="search-item-name">
                        {stock.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {stock.symbol} | {stock.exchange} | {stock.type}
                      </div>
                    </div>

                    {/* //TODO: Click on star to add/remove stock company to/from the Watchlist.*/}
                    <Star />
                  </Link>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  )
}
