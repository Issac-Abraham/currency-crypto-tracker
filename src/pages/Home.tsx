import { Link } from "react-router-dom";

const Home = () => {
  return (
    <main className="min-h-[calc(100vh-72px)] bg-gray-50 px-4 py-10 text-gray-900 transition-colors duration-300 dark:bg-gray-900 dark:text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="rounded-xl bg-white p-8 shadow-md transition-colors duration-300 dark:bg-gray-800">
          <p className="mb-3 inline-flex rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
            Currency & Crypto Tracker
          </p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Track markets and convert currencies in one place
          </h1>
          <p className="mt-4 max-w-3xl text-base text-gray-600 dark:text-gray-300 sm:text-lg">
            Monitor top cryptocurrencies, view 7-day trends, and convert between
            global currencies with live exchange rates.
          </p>
        </section>

        <section className="mt-8 grid gap-6 md:grid-cols-2">
          <Link
            to="/converter"
            className="group rounded-xl bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:bg-gray-800"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Currency Converter</h2>
              <span className="text-indigo-500 transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </div>
            <p className="mt-3 text-gray-600 dark:text-gray-300">
              Convert between fiat currencies instantly and compare top rates at
              a glance.
            </p>
          </Link>

          <Link
            to="/crypto"
            className="group rounded-xl bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:bg-gray-800"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Crypto Tracker</h2>
              <span className="text-indigo-500 transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </div>
            <p className="mt-3 text-gray-600 dark:text-gray-300">
              Follow the top 10 coins, check 24h performance, and explore
              interactive 7-day charts.
            </p>
          </Link>
        </section>
      </div>
    </main>
  );
};

export default Home;
