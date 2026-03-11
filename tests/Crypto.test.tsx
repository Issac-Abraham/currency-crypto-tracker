import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import Crypto from "../src/pages/Crypto";

const mockUseCryptoData = vi.fn();

vi.mock("../src/hooks/useCryptoData", () => ({
  useCryptoData: () => mockUseCryptoData(),
}));

describe("Crypto page", () => {
  it("calls refetchCryptos when retry is clicked on page error", async () => {
    const refetchCryptos = vi.fn();
    const user = userEvent.setup();

    mockUseCryptoData.mockReturnValue({
      cryptos: [],
      loading: false,
      isSyncing: false,
      error: "Network error",
      lastUpdated: null,
      chartData: [],
      chartLoading: false,
      chartError: null,
      chartLastUpdated: null,
      selectedCoinId: null,
      loadChartData: vi.fn(),
      refetchCryptos,
      retrySelectedChart: vi.fn(),
      refreshIntervalMs: 60_000,
    });

    render(<Crypto />);

    await user.click(screen.getByRole("button", { name: "Retry" }));
    expect(refetchCryptos).toHaveBeenCalledTimes(1);
  });

  it("calls loadChartData when retry chart is clicked", async () => {
    const loadChartData = vi.fn();
    const user = userEvent.setup();

    mockUseCryptoData.mockReturnValue({
      cryptos: [
        {
          id: "bitcoin",
          name: "Bitcoin",
          symbol: "btc",
          current_price: 70000,
          price_change_percentage_24h: 1.25,
          market_cap: 1300000000000,
          image: "https://example.com/btc.png",
        },
      ],
      loading: false,
      isSyncing: false,
      error: null,
      lastUpdated: new Date(),
      chartData: [],
      chartLoading: false,
      chartError: "Chart error",
      chartLastUpdated: null,
      selectedCoinId: "bitcoin",
      loadChartData,
      refetchCryptos: vi.fn(),
      retrySelectedChart: vi.fn(),
      refreshIntervalMs: 60_000,
    });

    render(<Crypto />);

    await user.click(screen.getByRole("button", { name: /bitcoin logo/i }));
    await user.click(screen.getByRole("button", { name: /retry chart/i }));
    expect(loadChartData).toHaveBeenCalledWith("bitcoin");
  });
});
