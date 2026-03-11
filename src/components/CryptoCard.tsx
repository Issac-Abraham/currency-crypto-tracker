import type { ReactNode } from "react";
import type { CryptoData } from "../types";

interface CryptoCardProps {
  coin: CryptoData;
  isFavorite: boolean;
  isExpanded: boolean;
  onToggleFavorite: (coinId: string) => void;
  onToggleExpand: (coinId: string) => void;
  children?: ReactNode;
}

const formatCompactCurrency = (value: number): string =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
    notation: "compact",
  }).format(value);

const CryptoCard = ({
  coin,
  isFavorite,
  isExpanded,
  onToggleFavorite,
  onToggleExpand,
  children,
}: CryptoCardProps) => {
  return (
    <article className="rounded-xl bg-white p-4 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:bg-gray-800">
      <div className="flex items-start justify-between gap-3">
        <button
          type="button"
          onClick={() => onToggleFavorite(coin.id)}
          className="text-lg transition-transform hover:scale-110"
          aria-label={`Toggle favorite for ${coin.name}`}
        >
          {isFavorite ? "★" : "☆"}
        </button>

        <button
          type="button"
          className="flex flex-1 items-center gap-3 text-left"
          onClick={() => onToggleExpand(coin.id)}
          aria-expanded={isExpanded}
        >
          <img
            src={coin.image}
            alt={`${coin.name} logo`}
            className="h-10 w-10 rounded-full"
          />
          <div>
            <h2 className="text-lg font-semibold">{coin.name}</h2>
            <p className="text-sm uppercase text-gray-500 dark:text-gray-300">
              {coin.symbol}
            </p>
          </div>
        </button>
      </div>

      <div className="mt-4 space-y-2 text-sm">
        <p>
          <span className="text-gray-600 dark:text-gray-300">Price:</span>{" "}
          <span className="font-semibold">
            {formatCompactCurrency(coin.current_price)}
          </span>
        </p>
        <p>
          <span className="text-gray-600 dark:text-gray-300">24h Change:</span>{" "}
          <span
            className={
              coin.price_change_percentage_24h >= 0
                ? "font-semibold text-green-500"
                : "font-semibold text-red-500"
            }
          >
            {coin.price_change_percentage_24h.toFixed(2)}%
          </span>
        </p>
        <p>
          <span className="text-gray-600 dark:text-gray-300">Market Cap:</span>{" "}
          <span className="font-semibold">
            {formatCompactCurrency(coin.market_cap)}
          </span>
        </p>
      </div>

      {isExpanded && children ? (
        <div className="mt-4 rounded-lg bg-gray-50 p-3 dark:bg-gray-900">
          {children}
        </div>
      ) : null}
    </article>
  );
};

export default CryptoCard;
