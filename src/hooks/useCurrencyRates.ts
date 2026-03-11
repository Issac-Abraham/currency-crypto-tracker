import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchExchangeRates } from "../services/currencyApi";
import type { ExchangeRates } from "../types";

const AUTO_REFRESH_INTERVAL_MS = 60_000;

export const useCurrencyRates = (baseCurrency: string = "USD") => {
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadRates = useCallback(async (showLoader: boolean = true) => {
    if (showLoader) {
      setLoading(true);
    } else {
      setIsSyncing(true);
    }
    setError(null);

    try {
      const data = await fetchExchangeRates(baseCurrency);
      setExchangeRates(data);
      setLastUpdated(new Date());
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to load currency rates.");
      }
    } finally {
      if (showLoader) {
        setLoading(false);
      } else {
        setIsSyncing(false);
      }
    }
  }, [baseCurrency]);

  useEffect(() => {
    void loadRates();
  }, [loadRates]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      void loadRates(false);
    }, AUTO_REFRESH_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [loadRates]);

  const refetch = useCallback(async () => {
    await loadRates(true);
  }, [loadRates]);

  const currencies = useMemo(() => {
    if (!exchangeRates) {
      return [];
    }
    return Object.keys(exchangeRates.rates).sort((a, b) => a.localeCompare(b));
  }, [exchangeRates]);

  return {
    exchangeRates,
    rates: exchangeRates?.rates ?? {},
    currencies,
    loading,
    isSyncing,
    error,
    lastUpdated,
    refetch,
    refreshIntervalMs: AUTO_REFRESH_INTERVAL_MS,
  };
};
