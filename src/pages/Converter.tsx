import { useState } from "react";
import CurrencyConverter from "../components/CurrencyConverter";
import { useCurrencyRates } from "../hooks/useCurrencyRates";

const FAVORITE_CURRENCIES_KEY = "favoriteCurrencies";
const DEFAULT_BASE = "USD";
const DEFAULT_TARGET = "EUR";
const getStoredFavoriteCurrencies = (): string[] => {
  const raw = localStorage.getItem(FAVORITE_CURRENCIES_KEY);
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

const Converter = () => {
  const [baseCurrency, setBaseCurrency] = useState<string>(DEFAULT_BASE);
  const [targetCurrency, setTargetCurrency] = useState<string>(DEFAULT_TARGET);
  const [amount, setAmount] = useState<number>(1);
  const [favoriteCurrencies, setFavoriteCurrencies] = useState<string[]>(
    getStoredFavoriteCurrencies
  );

  const {
    rates,
    currencies,
    loading: converterLoading,
    isSyncing: converterIsSyncing,
    error: converterError,
    lastUpdated: converterLastUpdated,
    refetch: refetchConverterRates,
    refreshIntervalMs,
  } = useCurrencyRates(baseCurrency);
  const {
    rates: usdRates,
    loading: usdTableLoading,
    isSyncing: usdTableIsSyncing,
    error: usdTableError,
    lastUpdated: usdTableLastUpdated,
    refetch: refetchUsdRates,
  } = useCurrencyRates("USD");

  const toggleFavoriteCurrency = (currency: string) => {
    setFavoriteCurrencies((prev) => {
      const isFavorite = prev.includes(currency);
      const updated = isFavorite
        ? prev.filter((item) => item !== currency)
        : [...prev, currency];
      localStorage.setItem(FAVORITE_CURRENCIES_KEY, JSON.stringify(updated));
      return updated;
    });
  };
  const isSyncing = converterIsSyncing || usdTableIsSyncing;

  return (
    <main className="min-h-[calc(100vh-72px)] bg-gray-50 px-4 py-10 text-gray-900 transition-colors duration-300 dark:bg-gray-900 dark:text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
          <span className="h-2 w-2 animate-pulse rounded-full bg-indigo-500" />
          Live updates every {Math.floor(refreshIntervalMs / 1000)}s
          <span className="text-indigo-400">•</span>
          {isSyncing ? "Syncing..." : "Idle"}
        </div>
        <CurrencyConverter
          amount={amount}
          baseCurrency={baseCurrency}
          targetCurrency={targetCurrency}
          currencies={currencies}
          rates={rates}
          usdRates={usdRates}
          converterLoading={converterLoading}
          converterError={converterError}
          converterLastUpdated={converterLastUpdated}
          usdTableLoading={usdTableLoading}
          usdTableError={usdTableError}
          usdTableLastUpdated={usdTableLastUpdated}
          favoriteCurrencies={favoriteCurrencies}
          onAmountChange={setAmount}
          onBaseCurrencyChange={setBaseCurrency}
          onTargetCurrencyChange={setTargetCurrency}
          onToggleFavoriteCurrency={toggleFavoriteCurrency}
          onRetryConverter={() => void refetchConverterRates()}
          onRetryTable={() => void refetchUsdRates()}
        />
      </div>
    </main>
  );
};

export default Converter;
