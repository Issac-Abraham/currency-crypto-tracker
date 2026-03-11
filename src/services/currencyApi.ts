import axios from "axios";
import type { ExchangeRates } from "../types";

interface ExchangeRateApiResponse {
  result: string;
  base_code: string;
  conversion_rates: Record<string, number>;
}

const EXCHANGE_RATE_BASE_URL = "https://v6.exchangerate-api.com/v6";

export const fetchExchangeRates = async (
  baseCurrency: string = "USD"
): Promise<ExchangeRates> => {
  const apiKey = import.meta.env.VITE_EXCHANGE_RATE_API_KEY;

  if (!apiKey) {
    throw new Error("Missing VITE_EXCHANGE_RATE_API_KEY in environment variables.");
  }

  try {
    const url = `${EXCHANGE_RATE_BASE_URL}/${apiKey}/latest/${baseCurrency.toUpperCase()}`;
    const { data } = await axios.get<ExchangeRateApiResponse>(url);

    if (data.result !== "success") {
      throw new Error("ExchangeRate-API returned an unsuccessful response.");
    }

    return {
      base: data.base_code,
      rates: data.conversion_rates,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.["error-type"] ||
          "Failed to fetch currency exchange rates."
      );
    }
    throw new Error("Unexpected error occurred while fetching exchange rates.");
  }
};
