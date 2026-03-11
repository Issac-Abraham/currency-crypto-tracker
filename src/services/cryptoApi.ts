import axios from "axios";
import type { ChartData, CryptoData } from "../types";

interface CoinGeckoChartResponse {
  prices: [number, number][];
}

const COINGECKO_BASE_URL = "https://api.coingecko.com/api/v3";

export const fetchTopCryptos = async (): Promise<CryptoData[]> => {
  try {
    const { data } = await axios.get<CryptoData[]>(
      `${COINGECKO_BASE_URL}/coins/markets`,
      {
        params: {
          vs_currency: "usd",
          order: "market_cap_desc",
          per_page: 10,
          page: 1,
          sparkline: false,
        },
      }
    );

    return data;
  } catch {
    throw new Error("Failed to fetch top cryptocurrencies.");
  }
};

export const fetchCryptoChart = async (coinId: string): Promise<ChartData[]> => {
  try {
    const { data } = await axios.get<CoinGeckoChartResponse>(
      `${COINGECKO_BASE_URL}/coins/${coinId}/market_chart`,
      {
        params: {
          vs_currency: "usd",
          days: 7,
        },
      }
    );

    return data.prices.map(([timestamp, price]) => ({
      date: new Date(timestamp).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      }),
      price,
    }));
  } catch {
    throw new Error("Failed to fetch cryptocurrency chart data.");
  }
};
