import React from "react";
import TradingViewWidget from "@/components/TradingViewWidget";
import WatchlistButton from "@/components/WatchlistButton";
import {
  SYMBOL_INFO_WIDGET_CONFIG,
  CANDLE_CHART_WIDGET_CONFIG,
  BASELINE_WIDGET_CONFIG,
  TECHNICAL_ANALYSIS_WIDGET_CONFIG,
  COMPANY_PROFILE_WIDGET_CONFIG,
  COMPANY_FINANCIALS_WIDGET_CONFIG,
} from "@/lib/constants";

// Base URL for TradingView widget scripts
const TV_SCRIPT_BASE =
  "https://s3.tradingview.com/external-embedding/embed-widget";

interface StockDetailsProps {
  params: Promise <{
    symbol: string;
  }>;
}

/**
 * StockDetails Page
 * Dynamic stock detail view with responsive 2-column layout
 */
const StockDetails = async ({ params }: StockDetailsProps) => {
  const { symbol } = await params;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 min-h-screen home-wrapper">
      {/* Left column */}
      <section className="grid w-full gap-8">
        <div>
          <TradingViewWidget
            scriptUrl={`${TV_SCRIPT_BASE}-symbol-info.js`}
            config={SYMBOL_INFO_WIDGET_CONFIG(symbol)}
            height={170}
          />
        </div>

        <div>
          <TradingViewWidget
            scriptUrl={`${TV_SCRIPT_BASE}-advanced-chart.js`}
            config={CANDLE_CHART_WIDGET_CONFIG(symbol)}
            height={600}
            className="custom-chart"
          />
        </div>

        <div>
          <TradingViewWidget
            scriptUrl={`${TV_SCRIPT_BASE}-advanced-chart.js`}
            config={BASELINE_WIDGET_CONFIG(symbol)}
            height={600}
            className="custom-chart"
          />
        </div>
      </section>

      {/* Right column */}
      <section className="grid w-full gap-8">
        {/* Watchlist Button */}
        <div className="flex items-center gap-4">
          <WatchlistButton symbol={symbol} />
        </div>

        <div>
          <TradingViewWidget
            scriptUrl={`${TV_SCRIPT_BASE}-technical-analysis.js`}
            config={TECHNICAL_ANALYSIS_WIDGET_CONFIG(symbol)}
            height={400}
          />
        </div>

        <div>
          <TradingViewWidget
            scriptUrl={`${TV_SCRIPT_BASE}-symbol-profile.js`}
            config={COMPANY_PROFILE_WIDGET_CONFIG(symbol)}
            height={440}
          />
        </div>

        <div>
          <TradingViewWidget
            scriptUrl={`${TV_SCRIPT_BASE}-financials.js`}
            config={COMPANY_FINANCIALS_WIDGET_CONFIG(symbol)}
            height={464}
          />
        </div>
      </section>
    </div>
  );
};

export default StockDetails;
