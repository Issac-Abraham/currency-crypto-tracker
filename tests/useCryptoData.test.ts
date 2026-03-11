import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

describe("useCryptoData", () => {
  afterEach(() => {
    vi.resetModules();
    vi.restoreAllMocks();
  });

  it("loads top cryptos and exposes last updated timestamp", async () => {
    const fetchTopCryptos = vi.fn().mockResolvedValue([
      {
        id: "bitcoin",
        name: "Bitcoin",
        symbol: "btc",
        current_price: 70000,
        price_change_percentage_24h: 1.3,
        market_cap: 1300000000000,
        image: "https://example.com/btc.png",
      },
    ]);

    vi.doMock("../src/services/cryptoApi", () => ({
      fetchTopCryptos,
      fetchCryptoChart: vi.fn(),
    }));

    const { useCryptoData } = await import("../src/hooks/useCryptoData");
    const { result } = renderHook(() => useCryptoData());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.cryptos).toHaveLength(1);
    expect(result.current.cryptos[0].id).toBe("bitcoin");
    expect(result.current.lastUpdated).not.toBeNull();
  });

  it("loads chart data for selected coin", async () => {
    const fetchTopCryptos = vi.fn().mockResolvedValue([]);
    const fetchCryptoChart = vi.fn().mockResolvedValue([
      { date: "Mar 1", price: 70000 },
      { date: "Mar 2", price: 70500 },
    ]);

    vi.doMock("../src/services/cryptoApi", () => ({
      fetchTopCryptos,
      fetchCryptoChart,
    }));

    const { useCryptoData } = await import("../src/hooks/useCryptoData");
    const { result } = renderHook(() => useCryptoData());

    await waitFor(() => expect(result.current.loading).toBe(false));
    await act(async () => {
      await result.current.loadChartData("bitcoin");
    });

    expect(fetchCryptoChart).toHaveBeenCalledWith("bitcoin");
    expect(result.current.selectedCoinId).toBe("bitcoin");
    expect(result.current.chartData).toHaveLength(2);
    expect(result.current.chartLastUpdated).not.toBeNull();
  });

  it("exposes live refresh metadata", async () => {
    const fetchTopCryptos = vi.fn().mockResolvedValue([]);

    vi.doMock("../src/services/cryptoApi", () => ({
      fetchTopCryptos,
      fetchCryptoChart: vi.fn(),
    }));

    const { useCryptoData } = await import("../src/hooks/useCryptoData");
    const { result } = renderHook(() => useCryptoData());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.refreshIntervalMs).toBe(60_000);
    expect(result.current.isSyncing).toBe(false);
  });
});
