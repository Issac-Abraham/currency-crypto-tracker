# 💱 Currency & Crypto Tracker

> A real-time currency converter and cryptocurrency tracker with live price charts, dark mode, and a favorites system — built with React, TypeScript, and public financial APIs.

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=flat&logo=vite)
![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=flat&logo=vercel)
![License](https://img.shields.io/badge/License-MIT-green?style=flat)

---

## 🔗 Live Demo

**[View Live App →](https://your-vercel-link.vercel.app)**

> *(Update this link after deploying to Vercel)*

---

## 📸 Screenshots

| Currency Converter | Crypto Tracker | Dark Mode |
|---|---|---|
| *(add screenshot)* | *(add screenshot)* | *(add screenshot)* |

---

## ✨ Features

- 🌍 **Real-time currency conversion** across 160+ global currencies
- 📈 **Live cryptocurrency prices** with 24h change indicators (top 10 by market cap)
- 📊 **7-day price trend charts** for any selected cryptocurrency
- 🌙 **Dark / Light mode** toggle with persistent preference
- ⭐ **Favorites system** — save your most-used currencies and coins
- 🔍 **Search & filter** across currencies and cryptocurrencies
- 📱 **Fully responsive** — works on desktop and mobile

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React 18 + TypeScript |
| **Build Tool** | Vite |
| **Charts** | Recharts |
| **Styling** | Tailwind CSS |
| **Currency API** | ExchangeRate-API (free tier) |
| **Crypto API** | CoinGecko API (free, no key needed) |
| **Deployment** | Vercel |

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- npm or yarn
- A free API key from [ExchangeRate-API](https://www.exchangerate-api.com/)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/currency-crypto-tracker.git

# 2. Navigate into the project
cd currency-crypto-tracker

# 3. Install dependencies
npm install

# 4. Set up environment variables
cp .env.example .env
```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_EXCHANGE_RATE_API_KEY=your_api_key_here
```

> **Note:** CoinGecko does not require an API key for the free tier.

### Running Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📁 Project Structure

```
currency-crypto-tracker/
├── public/
├── src/
│   ├── components/
│   │   ├── CurrencyConverter.tsx   # Live currency conversion UI
│   │   ├── CryptoCard.tsx          # Individual crypto price card
│   │   ├── PriceChart.tsx          # 7-day line chart component
│   │   └── Navbar.tsx              # Navigation + dark mode toggle
│   ├── hooks/
│   │   ├── useCurrencyRates.ts     # Fetches exchange rate data
│   │   └── useCryptoData.ts        # Fetches CoinGecko data
│   ├── pages/
│   │   ├── Home.tsx                # Landing dashboard
│   │   ├── Converter.tsx           # Currency converter page
│   │   └── Crypto.tsx              # Crypto tracker page
│   ├── services/
│   │   ├── currencyApi.ts          # ExchangeRate-API calls
│   │   └── cryptoApi.ts            # CoinGecko API calls
│   ├── types/
│   │   └── index.ts                # Shared TypeScript interfaces
│   ├── App.tsx
│   └── main.tsx
├── .env.example
├── .gitignore
└── README.md
```

---

## 🗺️ Roadmap

- [x] Currency converter with live rates
- [x] Crypto price tracker (top 10)
- [x] 7-day price chart
- [x] Dark / light mode
- [x] Favorites system
- [ ] Price alerts via email notification
- [ ] Portfolio tracker (track your holdings)
- [ ] Historical exchange rate comparison
- [ ] PWA support (installable on mobile)

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'feat: add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Your Name**
- GitHub: [@YOUR_USERNAME](https://github.com/YOUR_USERNAME)
- LinkedIn: [your-linkedin](https://linkedin.com/in/your-linkedin)

---

> ⭐ If you found this project useful, consider giving it a star on GitHub!
