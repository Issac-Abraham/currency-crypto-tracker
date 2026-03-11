import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ChartData } from "../types";

interface PriceChartProps {
  data: ChartData[];
  loading: boolean;
  error?: string | null;
  onRetry?: () => void;
}

const PriceChart = ({ data, loading, error = null, onRetry }: PriceChartProps) => {
  if (loading) {
    return (
      <div className="h-52 w-full space-y-3">
        <div className="h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-40 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-wrap items-center gap-3">
        <p className="text-sm text-red-500">{error}</p>
        {onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="rounded-lg bg-indigo-500 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-indigo-600"
          >
            Retry
          </button>
        ) : null}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <p className="text-sm text-gray-600 dark:text-gray-300">
        No chart data available.
      </p>
    );
  }

  return (
    <div className="h-52 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis
            dataKey="date"
            tick={{ fill: "#6B7280", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#6B7280", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            domain={["dataMin", "dataMax"]}
            tickFormatter={(value: number) => `$${value.toFixed(0)}`}
          />
          <Tooltip
            formatter={(value) => {
              const numericValue =
                typeof value === "number" ? value : Number(value ?? 0);
              return [`$${numericValue.toFixed(2)}`, "Price"];
            }}
            labelFormatter={(label) => `Date: ${String(label)}`}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#6366F1"
            strokeWidth={2.5}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PriceChart;
