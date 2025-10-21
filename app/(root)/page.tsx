import React from 'react'
import TradingViewWidget from "@/components/TradingViewWidget";
import {
  HEATMAP_WIDGET_CONFIG,
  MARKET_DATA_WIDGET_CONFIG,
  MARKET_OVERVIEW_WIDGET_CONFIG,
  TOP_STORIES_WIDGET_CONFIG
} from "@/lib/constants";

/**
 * Home Component
 * Displays a dashboard of TradingView widgets for market analysis
 */
const Home = () => {
  // Base URL for TradingView widget scripts
  const scriptUrl = "https://s3.tradingview.com/external-embedding/embed-widget";

  return (
    <div className="flex min-h-screen home-wrapper">

      {/* Left section: Market Overview and Stock Heatmap */}
      <section className="grid w-full gap-8 home-section">
        {/* Market Overview Widget */}
        <div className="md:col-span-1 xl:col-span-1">
          <TradingViewWidget
            title="Market Overview"
            scriptUrl={`${scriptUrl}-market-overview.js`}
            config={MARKET_OVERVIEW_WIDGET_CONFIG}
            className="custom-chart"
            height={400}
          />
        </div>

        {/* Stock Heatmap Widget - Shows market sector performance */}
        <div className="md:col-span xl:col-span-2">
          <TradingViewWidget
            title="Stock Heatmap"
            scriptUrl={`${scriptUrl}-stock-heatmap.js`}
            config={HEATMAP_WIDGET_CONFIG}
            height={400}
          />
        </div>
      </section>

      {/* Right section: Top Stories and Market Data */}
      <section className="grid w-full gap-8 home-section">
        {/* Top Stories Timeline Widget */}
        <div className="h-full md:col-span-1 xl:col-span-1">
          <TradingViewWidget
            scriptUrl={`${scriptUrl}-timeline.js`}
            config={TOP_STORIES_WIDGET_CONFIG}
            height={400}
          />
        </div>

        {/* Market Data Widget - Real-time quotes */}
        <div className="h-full md:col-span-1 xl:col-span-2">
          <TradingViewWidget
            scriptUrl={`${scriptUrl}-market-quotes.js`}
            config={MARKET_DATA_WIDGET_CONFIG}
            height={400}
          />
        </div>
      </section>
    </div>
  )
}

export default Home
