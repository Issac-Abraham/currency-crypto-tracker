import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import CurrencyConverter from "../src/components/CurrencyConverter";

const baseProps = {
  amount: 2,
  baseCurrency: "USD",
  targetCurrency: "EUR",
  currencies: ["USD", "EUR", "GBP"],
  rates: { EUR: 0.5, GBP: 0.8 },
  usdRates: {
    EUR: 0.9,
    GBP: 0.8,
    JPY: 120,
    CAD: 1.3,
    AUD: 1.5,
    CHF: 0.95,
    CNY: 7.1,
    INR: 83,
    NZD: 1.6,
    SEK: 10.2,
  },
  converterLoading: false,
  converterError: null,
  converterLastUpdated: new Date(),
  usdTableLoading: false,
  usdTableError: null,
  usdTableLastUpdated: new Date(),
  favoriteCurrencies: ["GBP"],
  onAmountChange: vi.fn(),
  onBaseCurrencyChange: vi.fn(),
  onTargetCurrencyChange: vi.fn(),
  onToggleFavoriteCurrency: vi.fn(),
  onRetryConverter: vi.fn(),
  onRetryTable: vi.fn(),
};

describe("CurrencyConverter", () => {
  it("shows converted amount using selected target rate", () => {
    render(<CurrencyConverter {...baseProps} />);

    expect(screen.getByText("1.0000 EUR")).toBeInTheDocument();
  });

  it("calls toggle favorite callback when star is clicked", async () => {
    const onToggleFavoriteCurrency = vi.fn();
    const user = userEvent.setup();

    render(
      <CurrencyConverter
        {...baseProps}
        onToggleFavoriteCurrency={onToggleFavoriteCurrency}
      />
    );

    await user.click(screen.getByRole("button", { name: /toggle favorite for gbp/i }));
    expect(onToggleFavoriteCurrency).toHaveBeenCalledWith("GBP");
  });

  it("shows retry actions and calls them when currency requests fail", async () => {
    const onRetryConverter = vi.fn();
    const onRetryTable = vi.fn();
    const user = userEvent.setup();

    render(
      <CurrencyConverter
        {...baseProps}
        converterError="Converter failed"
        usdTableError="Table failed"
        onRetryConverter={onRetryConverter}
        onRetryTable={onRetryTable}
      />
    );

    const retryButtons = screen.getAllByRole("button", { name: "Retry" });
    await user.click(retryButtons[0]);
    await user.click(retryButtons[1]);

    expect(onRetryConverter).toHaveBeenCalledTimes(1);
    expect(onRetryTable).toHaveBeenCalledTimes(1);
  });
});
