export default function PremiumBanner() {
  return (
    <div className="mt-6 overflow-hidden rounded bg-mint">
      <div className="grid gap-4 p-5 md:grid-cols-[1fr_280px] md:items-center">
        <div>
          <p className="text-sm font-bold uppercase text-forest">Premium order area</p>
          <h2 className="mt-1 text-3xl font-black text-forest">Higher-value orders available today</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Complete eligible product orders to release commission into your account balance.</p>
        </div>
        <button className="rounded bg-forest px-4 py-3 text-sm font-bold text-white" onClick={() => document.getElementById("assignment")?.scrollIntoView({ behavior: "smooth" })}>
          View details
        </button>
      </div>
    </div>
  );
}
