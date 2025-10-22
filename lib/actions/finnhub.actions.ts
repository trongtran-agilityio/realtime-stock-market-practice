'use server';

import { getDateRange, validateArticle, formatArticle } from "@/lib/utils";
import { cache } from "react";
import { POPULAR_STOCK_SYMBOLS } from "@/lib/constants";

/**
 * Finnhub API Configuration
 * Requires FINNHUB_API_KEY in environment
 */
const finnhubBaseUrl = process.env.FINNHUB_BASE_URL;
const token = process.env.NEXT_PUBLIC_FINNHUB_API_KEY ?? '';
if (!token) {
  throw new Error('FINNHUB API key is not configured');
}

/**
 * Generic JSON fetcher with optional revalidation
 * @param url API endpoint URL
 * @param revalidateSeconds Cache duration in seconds
 */
export async function fetchJSON<T>(url: string, revalidateSeconds?: number): Promise<T> {
  const headers: HeadersInit = {};
  const init: RequestInit = revalidateSeconds
    ? { method: 'GET', cache: 'force-cache', next: { revalidate: revalidateSeconds }, headers }
    : { method: 'GET', cache: 'no-store', headers };

  const res = await fetch(url, init);
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Finnhub request failed: ${res.status} ${res.statusText} ${text}`.trim());
  }
  return res.json() as Promise<T>;
}


/**
 * Formatted news article type returned by formatArticle
 */
export type FormattedNewsArticle = ReturnType<typeof formatArticle>;


/**
 * Fetch and format news articles
 * - For specific symbols: Gets company news with round-robin selection
 * - Without symbols: Gets general market news
 * - Always returns up to 6 validated and formatted articles
 */
export async function getNews(symbols?: string[]): Promise<FormattedNewsArticle[]> {
  try {
    const { from, to } = getDateRange(5);

    // Helper: dedupe by key (id/url/headline)
    const dedupe = <T,>(items: T[], makeKey: (it: T) => string) => {
      const seen = new Set<string>();
      const out: T[] = [];
      for (const it of items) {
        const key = makeKey(it);
        if (!key) continue;
        if (!seen.has(key)) {
          seen.add(key);
          out.push(it);
        }
      }
      return out;
    };

    // No symbols: get general market news
    if (!symbols || symbols.length === 0) {
      const url = `${finnhubBaseUrl}/news?category=general&token=${token}`;
      const articles = await fetchJSON<RawNewsArticle[]>(url, 300);

      const valid = articles.filter(a => validateArticle(a));
      const unique = dedupe(valid, (a) => `${a.id}|${a.url}|${a.headline}`);
      const top = unique.slice(0, 6);

      return top.map((a, idx) => formatArticle(a, false, undefined, idx));
    }

    // With symbols: clean and uppercase
    const cleanSymbols = Array.from(new Set(
      symbols
        .map(s => (s || '').trim().toUpperCase())
        .filter(Boolean)
    ));

    if (cleanSymbols.length === 0) {
      // Fallback to general news when no valid symbols
      return getNews();
    }

    // Prefetch company news for each symbol
    const companyNewsMap = new Map<string, RawNewsArticle[]>();
    await Promise.all(
      cleanSymbols.map(async (sym) => {
        try {
          const url = `${finnhubBaseUrl}/company-news?symbol=${encodeURIComponent(sym)}&from=${from}&to=${to}&token=${token}`;
          const list = await fetchJSON<RawNewsArticle[]>(url);
          companyNewsMap.set(sym, list.filter(a => validateArticle(a)));
        } catch (err) {
          console.error(`Error fetching company news for ${sym}:`, err);
          companyNewsMap.set(sym, []);
        }
      })
    );

    // Round-robin pick up to 6 articles
    const results: FormattedNewsArticle[] = [];
    const indices: Record<string, number> = Object.fromEntries(cleanSymbols.map(s => [s, 0]));

    for (let round = 0; round < 6; round++) {
      for (const sym of cleanSymbols) {
        if (results.length >= 6) break;
        const list = companyNewsMap.get(sym) || [];
        let idx = indices[sym] ?? 0;

        // Advance until find a valid, unseen article
        while (idx < list.length && !validateArticle(list[idx])) idx++;
        if (idx >= list.length) {
          indices[sym] = idx; // exhausted
          continue;
        }

        const article = list[idx];
        indices[sym] = idx + 1;
        results.push(formatArticle(article, true, sym, round));
        if (results.length >= 6) break;
      }
      if (results.length >= 6) break;
    }

    // If still empty, fallback to general news
    if (results.length === 0) {
      return getNews();
    }

    // Sort by datetime desc
    return results.sort((a, b) => (b.datetime || 0) - (a.datetime || 0)).slice(0, 6);

  } catch (e) {
    console.error('Failed to fetch news:', e);
    throw new Error('Failed to fetch news');
  }
}

/**
 * Fetch company profile from Finnhub API
 * Features:
 * - Retrieves company logo, name, and metadata
 * - Caches responses for 1 hour
 * - Falls back to default values on error
 * 
 * @param symbol - Stock ticker symbol (e.g., 'AAPL')
 * @returns Company profile with logo URL and basic info
 */
export async function getCompanyProfile(symbol: string): Promise<{
  logo: string | null;
  name: string;
  country?: string;
  exchange?: string;
  marketCapitalization?: number;
}> {
  try {
    const url = `${finnhubBaseUrl}/stock/profile2?symbol=${encodeURIComponent(symbol.toUpperCase())}&token=${token}`;
    // Cache profile data for 1 hour to reduce API calls
    const profile = await fetchJSON<{
      logo?: string;
      name?: string;
      country?: string;
      exchange?: string;
      marketCapitalization?: number;
    }>(url, 3600);

    return {
      logo: profile.logo || null,
      name: profile.name || symbol,
      country: profile.country,
      exchange: profile.exchange,
      marketCapitalization: profile.marketCapitalization
    };
  } catch (error) {
    console.error(`Error fetching company profile for ${symbol}:`, error);
    return { logo: null, name: symbol };
  }
}

/**
 * Search for stocks by query or get popular stocks
 * Features:
 * - Search by symbol/name when query provided
 * - Returns top 10 popular stocks when no query
 * - Enriches results with company profiles
 * - Caches results to minimize API calls
 * - React cache wrapper for automatic request deduplication
 * 
 * @param query - Optional search query
 * @returns Array of stocks with logos and watchlist status
 */
export const searchStocks = cache(async (query?: string): Promise<StockWithWatchlistStatus[]> => {

  const trimmed = typeof query === 'string' ? query.trim() : '';
  let results: FinnhubSearchResult[] = [];

  try {
    if (trimmed) {
      const url = `${finnhubBaseUrl}/search?q=${encodeURIComponent(trimmed)}&token=${token}`;
      const data = await fetchJSON<FinnhubSearchResponse>(url, 1800);
      results = Array.isArray(data?.result) ? data.result : [];

    } else {
      // By default, fetch top 10 popular symbols's profiles
      const top10Symbols = POPULAR_STOCK_SYMBOLS.slice(0, 10);
      const top10Profiles = await Promise.all(
        top10Symbols.map(async (symbol) => {
          try {
            const url = `${finnhubBaseUrl}/stock/profile2?symbol=${encodeURIComponent(symbol)}&token=${token}`;
            const profile = await fetchJSON<any>(url, 3600);
            return { symbol, profile } as { symbol: string, profile: any };

          } catch (e) {
            console.error(`Error fetching profile for ${symbol}`, e);
            return { symbol, profile: null } as { symbol: string, profile: any };
          }
        })
      );

      results = top10Profiles
        .filter(({ profile }) => profile?.name)
        .map(({ symbol, profile }) => {
          const exchange: string | undefined = profile?.exchange || undefined;

          const r: FinnhubSearchResult = {
            symbol,
            description: profile.name!,
            displaySymbol: symbol,
            type: 'Common stock.'
          };
          (r as any).__exchange = exchange; // internal only
          return r;
        });
    }

    // Fetch company profiles to have logos and official names
    const profilePromises = results.slice(0, 15).map(async (item) => {
      try {
        const upperSymbol = (item.symbol || '').toUpperCase();
        const profile = await getCompanyProfile(upperSymbol);
        return {
          result: item,
          profile,
          symbol: upperSymbol
        }

      } catch (error) {
        console.error(`Error fetching company profile for ${item.symbol}:`, error);
        return {
          result: item,
          profile: { logo: null, name: item.description || item.symbol || '' },
          symbol: (item.symbol || '').toUpperCase()
        }
      }
    });

    const profiledResults = await Promise.all(profilePromises);

    const mapped: StockWithWatchlistStatus[] = profiledResults
      .map(({ result: r, profile, symbol: upper }) => {
        const name = r.description || upper;
        const exchangeFromDisplay = (r.displaySymbol as string | undefined) || undefined;
        const exchangeFromProfile = (r as any).__exchange as string | undefined;
        const exchange = exchangeFromDisplay || exchangeFromProfile || 'US';
        const type = r.type || 'Stock';
        const item: StockWithWatchlistStatus = {
          symbol: upper,
          name,
          exchange,
          type,
          logoUrl: profile.logo,
          officialName: profile.name,
          isInWatchlist: false,
        };
        return item;
      });

    return mapped;

  } catch (error) {
    console.error('Error in stock search:', error);
    return [];
  }
});