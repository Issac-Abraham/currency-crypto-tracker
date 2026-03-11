import { useMemo } from "react";

interface CurrencyConverterProps {
  amount: number;
  baseCurrency: string;
  targetCurrency: string;
  currencies: string[];
  rates: Record<string, number>;
  usdRates: Record<string, number>;
  converterLoading: boolean;
  converterError: string | null;
  converterLastUpdated: Date | null;
  usdTableLoading: boolean;
  usdTableError: string | null;
  usdTableLastUpdated: Date | null;
  favoriteCurrencies: string[];
  onAmountChange: (value: number) => void;
  onBaseCurrencyChange: (value: string) => void;
  onTargetCurrencyChange: (value: string) => void;
  onToggleFavoriteCurrency: (currency: string) => void;
  onRetryConverter: () => void;
  onRetryTable: () => void;
}

const TOP_CURRENCIES = [
  "EUR",
  "GBP",
  "JPY",
  "CAD",
  "AUD",
  "CHF",
  "CNY",
  "INR",
  "NZD",
  "SEK",
];

const CurrencyTableSkeleton = () => (
  <>
    {Array.from({ length: 6 }).map((_, index) => (
      <tr key={`currency-skeleton-${index}`} className="border-b border-gray-100 dark:border-gray-700">
        <td className="px-3 py-3">
          <div className="h-4 w-4 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        </td>
        <td className="px-3 py-3">
          <div className="h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        </td>
        <td className="px-3 py-3">
          <div className="h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        </td>
      </tr>
    ))}
  </>
);

const CurrencyConverter = ({
  amount,
  baseCurrency,
  targetCurrency,
  currencies,
  rates,
  usdRates,
  converterLoading,
  converterError,
  converterLastUpdated,
  usdTableLoading,
  usdTableError,
  usdTableLastUpdated,
  favoriteCurrencies,
  onAmountChange,
  onBaseCurrencyChange,
  onTargetCurrencyChange,
  onToggleFavoriteCurrency,
  onRetryConverter,
  onRetryTable,
}: CurrencyConverterProps) => {
  const formatLastUpdated = (timestamp: Date | null): string =>
    timestamp
      ? `Last updated: ${timestamp.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })}`
      : "Last updated: --";

  const convertedAmount = useMemo(() => {
    const rate = rates[targetCurrency];
    if (!rate) {
      return 0;
    }
    return amount * rate;
  }, [amount, rates, targetCurrency]);

  const tableCurrencies = useMemo(() => {
    const availableTop = TOP_CURRENCIES.filter((currency) => usdRates[currency]);
    const fallback = Object.keys(usdRates)
      .filter((currency) => currency !== "USD" && !TOP_CURRENCIES.includes(currency))
      .slice(0, Math.max(0, 10 - availableTop.length));

    return [...availableTop, ...fallback].slice(0, 10).sort((a, b) => {
      const aFav = favoriteCurrencies.includes(a) ? 1 : 0;
      const bFav = favoriteCurrencies.includes(b) ? 1 : 0;
      if (aFav !== bFav) {
        return bFav - aFav;
      }
      return a.localeCompare(b);
    });
  }, [favoriteCurrencies, usdRates]);

  return (
    <div className="flex flex-col gap-8">
      <section className="rounded-xl bg-white p-6 shadow-md transition-colors duration-300 dark:bg-gray-800">
        <h1 className="text-2xl font-bold sm:text-3xl">Currency Converter</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Convert values instantly using live exchange rates.
        </p>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {formatLastUpdated(converterLastUpdated)}
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Amount
            </span>
            <input
              type="number"
              min="0"
              step="any"
              value={amount}
              onChange={(event) => onAmountChange(Number(event.target.value))}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none transition focus:border-indigo-500 dark:border-gray-600 dark:bg-gray-900"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Base Currency
            </span>
            <select
              value={baseCurrency}
              onChange={(event) => onBaseCurrencyChange(event.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none transition focus:border-indigo-500 dark:border-gray-600 dark:bg-gray-900"
            >
              {currencies.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Target Currency
            </span>
            <select
              value={targetCurrency}
              onChange={(event) => onTargetCurrencyChange(event.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none transition focus:border-indigo-500 dark:border-gray-600 dark:bg-gray-900"
            >
              {currencies.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </label>

          <div className="flex flex-col justify-end">
            <div className="rounded-lg bg-indigo-50 px-4 py-3 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
              <p className="text-sm font-medium">Converted Result</p>
              <p className="mt-1 text-xl font-bold">
                {converterLoading
                  ? "Loading rates..."
                  : `${convertedAmount.toFixed(4)} ${targetCurrency}`}
              </p>
            </div>
          </div>
        </div>

        {converterError && (
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <p className="text-sm text-red-500">{converterError}</p>
            <button
              type="button"
              onClick={onRetryConverter}
              className="rounded-lg bg-indigo-500 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-indigo-600"
            >
              Retry
            </button>
          </div>
        )}
      </section>

      <section className="rounded-xl bg-white p-6 shadow-md transition-colors duration-300 dark:bg-gray-800">
        <h2 className="text-xl font-semibold">Top 10 Currencies vs USD</h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          Favorites are pinned to the top of this list.
        </p>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {formatLastUpdated(usdTableLastUpdated)}
        </p>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="px-3 py-2 font-semibold">Fav</th>
                <th className="px-3 py-2 font-semibold">Currency</th>
                <th className="px-3 py-2 font-semibold">Rate (USD)</th>
              </tr>
            </thead>
            <tbody>
              {usdTableLoading ? (
                <CurrencyTableSkeleton />
              ) : (
                tableCurrencies.map((currency) => {
                  const isFavorite = favoriteCurrencies.includes(currency);
                  return (
                    <tr
                      key={currency}
                      className="border-b border-gray-100 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700/40"
                    >
                      <td className="px-3 py-3">
                        <button
                          type="button"
                          onClick={() => onToggleFavoriteCurrency(currency)}
                          className="transition-transform hover:scale-110"
                          aria-label={`Toggle favorite for ${currency}`}
                        >
                          {isFavorite ? "★" : "☆"}
                        </button>
                      </td>
                      <td className="px-3 py-3 font-medium">{currency}</td>
                      <td className="px-3 py-3">{usdRates[currency].toFixed(4)}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {usdTableError && (
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <p className="text-sm text-red-500">{usdTableError}</p>
            <button
              type="button"
              onClick={onRetryTable}
              className="rounded-lg bg-indigo-500 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-indigo-600"
            >
              Retry
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default CurrencyConverter;
