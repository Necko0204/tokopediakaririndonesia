export default function SecurityItem({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="flex gap-3 rounded border border-slate-200 p-4">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded bg-mint text-forest">{icon}</div>
      <div>
        <p className="font-bold">{title}</p>
        <p className="text-sm leading-5 text-slate-500">{text}</p>
      </div>
    </div>
  );
}
