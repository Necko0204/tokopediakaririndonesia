import BalanceCard from "./BalanceCard";

interface CustomerHeroProps {
  balance: number;
  username?: string;
  phone?: string;
  onTopUp: () => void;
  onWithdraw: () => void;
}

const workAccountBanner = "/assets/work-account-banner.png";

export default function CustomerHero({ balance, username, phone, onTopUp, onWithdraw }: CustomerHeroProps) {
  return (
    <section className="bg-[#f4f6f5]">
      <div className="mx-auto max-w-7xl px-4 pb-6 sm:px-6">
        <div className="overflow-hidden rounded-b bg-white shadow-panel sm:rounded">
          <img
            className="h-36 w-full object-cover sm:h-44 lg:h-56"
            src={workAccountBanner}
            alt="Tokopedia work account promotion"
          />

          <div className="bg-gradient-to-r from-forest via-emerald-600 to-lime-500 px-4 py-6 text-white sm:px-6 lg:px-8">
            <div className="grid gap-5 lg:grid-cols-[1fr_360px] lg:items-end">
              <div className="min-w-0">
                <p className="text-xl font-medium text-white/90 sm:text-2xl">Welcome to the Tokopedia work account,</p>
                <h1 className="mt-2 break-words text-3xl font-black leading-tight sm:text-4xl">
                  {username || "Guest User"}
                </h1>
                <p className="mt-2 break-words text-xl font-semibold text-white/95 sm:text-2xl">
                  {phone || "Please log in to view your user number"}
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    className="rounded bg-white px-4 py-3 text-sm font-bold text-forest shadow-sm hover:bg-mint"
                    onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })}
                  >
                    Start ordering
                  </button>
                </div>
              </div>
              <BalanceCard balance={balance} onTopUp={onTopUp} onWithdraw={onWithdraw} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
