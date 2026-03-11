export interface CryptoData {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  image: string;
}

export interface ExchangeRates {
  base: string;
  rates: Record<string, number>;
}

export interface ChartData {
  date: string;
  price: number;
}
