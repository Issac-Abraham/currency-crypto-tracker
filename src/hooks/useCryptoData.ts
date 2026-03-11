import { useCallback, useEffect, useState } from "react";
import { fetchCryptoChart, fetchTopCryptos } from "../services/cryptoApi";
import type { ChartData, CryptoData } from "../types";

const AUTO_REFRESH_INTERVAL_MS = 60_000;

export const useCryptoData = () => {
  const [cryptos, setCryptos] = useState<CryptoData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [chartLoading, setChartLoading] = useState<boolean>(false);
  const [chartError, setChartError] = useState<string | null>(null);
  const [chartLastUpdated, setChartLastUpdated] = useState<Date | null>(null);
  const [selectedCoinId, setSelectedCoinId] = useState<string | null>(null);

  const loadCryptos = useCallback(async (showLoader: boolean = true) => {
    if (showLoader) {
      setLoading(true);
    } else {
      setIsSyncing(true);
    }
    setError(null);

    try {
      const data = await fetchTopCryptos();
      setCryptos(data);
      setLastUpdated(new Date());
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to load cryptocurrency data.");
      }
    } finally {
      if (showLoader) {
        setLoading(false);
      } else {
        setIsSyncing(false);
      }
    }
  }, []);

  useEffect(() => {
    void loadCryptos();
  }, [loadCryptos]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      void loadCryptos(false);
    }, AUTO_REFRESH_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [loadCryptos]);

  const loadChartData = useCallback(async (coinId: string) => {
    setChartLoading(true);
    setChartError(null);
    setSelectedCoinId(coinId);

    try {
      const data = await fetchCryptoChart(coinId);
      setChartData(data);
      setChartLastUpdated(new Date());
    } catch (err) {
      if (err instanceof Error) {
        setChartError(err.message);
      } else {
        setChartError("Failed to load chart data.");
      }
      setChartData([]);
    } finally {
      setChartLoading(false);
    }
  }, []);

  const retrySelectedChart = useCallback(async () => {
    if (!selectedCoinId) {
      return;
    }
    await loadChartData(selectedCoinId);
  }, [loadChartData, selectedCoinId]);

  const refetchCryptos = useCallback(async () => {
    await loadCryptos(true);
  }, [loadCryptos]);

  return {
    cryptos,
    loading,
    isSyncing,
    error,
    lastUpdated,
    chartData,
    chartLoading,
    chartError,
    chartLastUpdated,
    selectedCoinId,
    loadChartData,
    refetchCryptos,
    retrySelectedChart,
    refreshIntervalMs: AUTO_REFRESH_INTERVAL_MS,
  };
};
