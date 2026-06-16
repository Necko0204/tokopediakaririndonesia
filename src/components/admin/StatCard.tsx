export default function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <article className="rounded bg-white p-5 shadow-panel">
      <div className="mb-5 grid h-11 w-11 place-items-center rounded bg-mint text-forest">{icon}</div>
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-black text-coral">{value}</p>
    </article>
  );
}
