
export const NAV_ITEMS = [
  { href: '/', label: 'Dashboard'},
  { href: '/search', label: 'Search'},
  { href: '/watchlist', label: 'Watchlist'},
]

// TradingView Charts
export const MARKET_OVERVIEW_WIDGET_CONFIG = {
  colorTheme: 'dark', // dark/light mode
  dateRange: '12M', // last 12 months
  locale: 'en', // language
  largeChartUrl: '', // link to a large chart if needed
  isTransparent: true, // makes background transparent
  showFloatingTooltip: true, // show tooltip on hover
  plotLineColorGrowing: '#0FEDBE', // line color when price goes up
  plotLineColorFalling: '#0FEDBE', // line color when price falls
  gridLineColor: 'rgba(240, 243, 250, 0)', // grid line color
  scaleFontColor: '#DBDBDB', // font color for scale
  belowLineFillColorGrowing: 'rgba(41, 98, 255, 0.12)', // fill under line when growing
  belowLineFillColorFalling: 'rgba(41, 98, 255, 0.12)', // fill under line when falling
  belowLineFillColorGrowingBottom: 'rgba(41, 98, 255, 0)',
  belowLineFillColorFallingBottom: 'rgba(41, 98, 255, 0)',
  symbolActiveColor: 'rgba(15, 237, 190, 0.05)', // highlight color for active symbol
  tabs: [
    {
      title: 'Financial',
      symbols: [
        { s: 'NYSE:JPM', d: 'JPMorgan Chase' },
        { s: 'NYSE:WFC', d: 'Wells Fargo Co New' },
        { s: 'NYSE:BAC', d: 'Bank Amer Corp' },
        { s: 'NYSE:HSBC', d: 'Hsbc Hldgs Plc' },
        { s: 'NYSE:C', d: 'Citigroup Inc' },
        { s: 'NYSE:MA', d: 'Mastercard Incorporated' },
      ],
    },
    {
      title: 'Technology',
      symbols: [
        { s: 'NASDAQ:AAPL', d: 'Apple' },
        { s: 'NASDAQ:GOOGL', d: 'Alphabet' },
        { s: 'NASDAQ:MSFT', d: 'Microsoft' },
        { s: 'NASDAQ:FB', d: 'Meta Platforms' },
        { s: 'NYSE:ORCL', d: 'Oracle Corp' },
        { s: 'NASDAQ:INTC', d: 'Intel Corp' },
      ],
    },
    {
      title: 'Services',
      symbols: [
        { s: 'NASDAQ:AMZN', d: 'Amazon' },
        { s: 'NYSE:BABA', d: 'Alibaba Group Hldg Ltd' },
        { s: 'NYSE:T', d: 'At&t Inc' },
        { s: 'NYSE:WMT', d: 'Walmart' },
        { s: 'NYSE:V', d: 'Visa' },
      ],
    },
  ],
  support_host: 'https://www.tradingview.com', // TradingView host
  backgroundColor: '#141414', // background color
  width: '100%', // full width
  height: 600, // height in px
  showSymbolLogo: true, // show logo next to symbols
  showChart: true, // display mini chart
  timezone: "Asia/Ho_Chi_Minh",
};

export const HEATMAP_WIDGET_CONFIG = {
  dataSource: 'SPX500',
  blockSize: 'market_cap_basic',
  blockColor: 'change',
  grouping: 'sector',
  isTransparent: true,
  locale: 'en',
  symbolUrl: '',
  colorTheme: 'dark',
  exchanges: [],
  hasTopBar: false,
  isDataSetEnabled: false,
  isZoomEnabled: true,
  hasSymbolTooltip: true,
  isMonoSize: false,
  width: '100%',
  height: '600',
  timezone: "Asia/Ho_Chi_Minh",
};

export const TOP_STORIES_WIDGET_CONFIG = {
  displayMode: 'regular',
  feedMode: 'market',
  colorTheme: 'dark',
  isTransparent: true,
  locale: 'en',
  market: 'stock',
  width: '100%',
  height: '600',
};

export const MARKET_DATA_WIDGET_CONFIG = {
  title: 'Stocks',
  width: '100%',
  height: 600,
  locale: 'en',
  showSymbolLogo: true,
  colorTheme: 'dark',
  isTransparent: false,
  backgroundColor: '#0F0F0F',
  symbolsGroups: [
    {
      name: 'Financial',
      symbols: [
        { name: 'NYSE:JPM', displayName: 'JPMorgan Chase' },
        { name: 'NYSE:WFC', displayName: 'Wells Fargo Co New' },
        { name: 'NYSE:BAC', displayName: 'Bank Amer Corp' },
        { name: 'NYSE:HSBC', displayName: 'Hsbc Hldgs Plc' },
        { name: 'NYSE:C', displayName: 'Citigroup Inc' },
        { name: 'NYSE:MA', displayName: 'Mastercard Incorporated' },
      ],
    },
    {
      name: 'Technology',
      symbols: [
        { name: 'NASDAQ:AAPL', displayName: 'Apple' },
        { name: 'NASDAQ:GOOGL', displayName: 'Alphabet' },
        { name: 'NASDAQ:MSFT', displayName: 'Microsoft' },
        { name: 'NASDAQ:FB', displayName: 'Meta Platforms' },
        { name: 'NYSE:ORCL', displayName: 'Oracle Corp' },
        { name: 'NASDAQ:INTC', displayName: 'Intel Corp' },
      ],
    },
    {
      name: 'Services',
      symbols: [
        { name: 'NASDAQ:AMZN', displayName: 'Amazon' },
        { name: 'NYSE:BABA', displayName: 'Alibaba Group Hldg Ltd' },
        { name: 'NYSE:T', displayName: 'At&t Inc' },
        { name: 'NYSE:WMT', displayName: 'Walmart' },
        { name: 'NYSE:V', displayName: 'Visa' },
      ],
    },
  ],
};