export default function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <article className="rounded-[1.35rem] border border-white bg-white/95 p-5 shadow-[0_18px_48px_rgba(15,23,42,0.07)] ring-1 ring-slate-100 hover:-translate-y-0.5 hover:shadow-[0_22px_56px_rgba(15,23,42,0.1)]">
      <div className="mb-5 grid h-11 w-11 place-items-center rounded-2xl bg-mint text-forest">{icon}</div>
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-black text-coral">{value}</p>
    </article>
  );
}
