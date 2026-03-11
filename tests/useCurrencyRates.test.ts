import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

describe("useCurrencyRates", () => {
  afterEach(() => {
    vi.resetModules();
    vi.restoreAllMocks();
  });

  it("loads rates and exposes sorted currencies", async () => {
    const fetchExchangeRates = vi.fn().mockResolvedValue({
      base: "USD",
      rates: { GBP: 0.79, EUR: 0.92, JPY: 145.1 },
    });

    vi.doMock("../src/services/currencyApi", () => ({
      fetchExchangeRates,
    }));

    const { useCurrencyRates } = await import("../src/hooks/useCurrencyRates");
    const { result } = renderHook(() => useCurrencyRates("USD"));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(fetchExchangeRates).toHaveBeenCalledWith("USD");
    expect(result.current.rates.EUR).toBe(0.92);
    expect(result.current.currencies).toEqual(["EUR", "GBP", "JPY"]);
    expect(result.current.lastUpdated).not.toBeNull();
  });

  it("exposes live refresh metadata", async () => {
    const fetchExchangeRates = vi.fn().mockResolvedValue({
      base: "USD",
      rates: { EUR: 0.9 },
    });

    vi.doMock("../src/services/currencyApi", () => ({
      fetchExchangeRates,
    }));

    const { useCurrencyRates } = await import("../src/hooks/useCurrencyRates");
    const { result } = renderHook(() => useCurrencyRates("USD"));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.refreshIntervalMs).toBe(60_000);
    expect(result.current.isSyncing).toBe(false);
  });
});
