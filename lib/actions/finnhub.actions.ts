'use server';

import { getDateRange, validateArticle, formatArticle } from "@/lib/utils";

const finnhubBaseUrl = process.env.FINNHUB_BASE_URL;
const token = process.env.NEXT_PUBLIC_FINNHUB_API_KEY ?? '';
if (!token) {
  throw new Error('FINNHUB API key is not configured');
}

// Generic JSON fetcher with optional revalidation caching
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

// Formatted news article type returned by formatArticle
export type FormattedNewsArticle = ReturnType<typeof formatArticle>;

// Fetch market/company news with round-robin selection for provided symbols.
// - When symbols provided: fetch company news for each, pick up to 6 via round-robin
// - When no symbols: fetch general market news, dedupe, take top 6
// - Always validate articles before formatting
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
