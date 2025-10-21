'use client';

import React, { memo } from 'react';
import useTradingViewWidget from "@/hooks/useTradingViewWidget";
import { cn } from "@/lib/utils";

/**
 * TradingViewWidget Component
 * Renders TradingView widgets with custom configuration
 * 
 * @param title - Optional widget title
 * @param scriptUrl - TradingView widget script URL
 * @param config - Widget configuration object
 * @param height - Widget height in pixels
 * @param className - Additional CSS classes
 */

interface TradingViewWidgetProps {
  title?: string;
  scriptUrl: string;
  config: Record<string, unknown>;
  height?: number;
  className?: string;
}

const TradingViewWidget = ({ title, scriptUrl, config, height = 600, className }: TradingViewWidgetProps) => {
  // Initialize widget with custom hook
  const containerRef = useTradingViewWidget(scriptUrl, config, height);

  return (
    <div className="w-full">
      {title && <h3 className="font-semibold text-2xl text-gray-100 mb-5">{title}</h3>}
      <div className={cn("tradingview-widget-container", className)} ref={containerRef}>
        <div className="tradingview-widget-container__widget" style={{ height, width: "100%" }} />
      </div>
    </div>
  );
}

export default memo(TradingViewWidget);
