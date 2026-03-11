import { useMemo, useState } from "react";
import CryptoCard from "../components/CryptoCard";
import PriceChart from "../components/PriceChart";
import { useCryptoData } from "../hooks/useCryptoData";

const FAVORITE_CRYPTOS_KEY = "favoriteCryptos";

const getStoredFavoriteCryptos = (): string[] => {
  const raw = localStorage.getItem(FAVORITE_CRYPTOS_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter((item): item is string => typeof item === "string");
  } catch {
    return [];
  }
};

const CryptoGridSkeleton = () => (
  <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
    {Array.from({ length: 6 }).map((_, index) => (
      <article
        key={`crypto-skeleton-${index}`}
        className="rounded-xl bg-white p-4 shadow-md dark:bg-gray-800"
      >
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-3 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <div className="h-3 w-40 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-3 w-36 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-3 w-44 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        </div>
      </article>
    ))}
  </section>
);

const formatLastUpdated = (timestamp: Date | null): string =>
  timestamp
    ? `Last updated: ${timestamp.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })}`
    : "Last updated: --";

const Crypto = () => {
  const [favoriteCryptos, setFavoriteCryptos] = useState<string[]>(
    getStoredFavoriteCryptos
  );
  const [expandedCoinId, setExpandedCoinId] = useState<string | null>(null);

  const {
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
    refreshIntervalMs,
  } = useCryptoData();

  const sortedCryptos = useMemo(() => {
    return [...cryptos].sort((a, b) => {
      const aFav = favoriteCryptos.includes(a.id) ? 1 : 0;
      const bFav = favoriteCryptos.includes(b.id) ? 1 : 0;
      if (aFav !== bFav) {
        return bFav - aFav;
      }
      return a.market_cap > b.market_cap ? -1 : 1;
    });
  }, [cryptos, favoriteCryptos]);

  const toggleFavoriteCrypto = (coinId: string) => {
    setFavoriteCryptos((prev) => {
      const isFavorite = prev.includes(coinId);
      const updated = isFavorite
        ? prev.filter((item) => item !== coinId)
        : [...prev, coinId];
      localStorage.setItem(FAVORITE_CRYPTOS_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const handleExpandCard = async (coinId: string) => {
    if (expandedCoinId === coinId) {
      setExpandedCoinId(null);
      return;
    }
    setExpandedCoinId(coinId);
    await loadChartData(coinId);
  };

  return (
    <main className="min-h-[calc(100vh-72px)] bg-gray-50 px-4 py-10 text-gray-900 transition-colors duration-300 dark:bg-gray-900 dark:text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="rounded-xl bg-white p-6 shadow-md transition-colors duration-300 dark:bg-gray-800">
          <h1 className="text-2xl font-bold sm:text-3xl">Crypto Tracker</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Top 10 cryptocurrencies by market cap. Tap a card to view its 7-day
            price trend.
          </p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {formatLastUpdated(lastUpdated)}
          </p>
          <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
            <span className="h-2 w-2 animate-pulse rounded-full bg-indigo-500" />
            Live updates every {Math.floor(refreshIntervalMs / 1000)}s
            <span className="text-indigo-400">•</span>
            {isSyncing ? "Syncing..." : "Idle"}
          </div>
        </section>

        {loading ? (
          <CryptoGridSkeleton />
        ) : (
          <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {sortedCryptos.map((coin) => {
              const isFavorite = favoriteCryptos.includes(coin.id);
              const isExpanded = expandedCoinId === coin.id;
              const isSelected = selectedCoinId === coin.id;
              const currentChartError =
                isExpanded && isSelected && !chartLoading ? chartError : null;

              return (
                <CryptoCard
                  key={coin.id}
                  coin={coin}
                  isFavorite={isFavorite}
                  isExpanded={isExpanded}
                  onToggleFavorite={toggleFavoriteCrypto}
                  onToggleExpand={(coinId) => void handleExpandCard(coinId)}
                >
                  <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                    7-Day Price Chart
                  </p>
                  <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                    {formatLastUpdated(isSelected ? chartLastUpdated : null)}
                  </p>
                  <PriceChart
                    data={isSelected ? chartData : []}
                    loading={chartLoading && isSelected}
                    error={currentChartError}
                  />
                  {currentChartError ? (
                    <button
                      type="button"
                      onClick={() => void loadChartData(coin.id)}
                      className="mt-3 rounded-lg bg-indigo-500 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-indigo-600"
                    >
                      Retry chart
                    </button>
                  ) : null}
                </CryptoCard>
              );
            })}
          </section>
        )}

        {error && (
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <p className="text-sm text-red-500">{error}</p>
            <button
              type="button"
              onClick={() => void refetchCryptos()}
              className="rounded-lg bg-indigo-500 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-indigo-600"
            >
              Retry
            </button>
          </div>
        )}
      </div>
    </main>
  );
};

export default Crypto;
