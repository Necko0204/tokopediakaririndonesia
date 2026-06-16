import { Bell, Search, Store } from "lucide-react";
import type { Navigate } from "../../App";

interface CustomerHeaderProps {
  query: string;
  onQueryChange: (query: string) => void;
  navigate: Navigate;
}

export default function CustomerHeader({ query, onQueryChange, navigate }: CustomerHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6">
        <button className="grid h-10 w-10 place-items-center rounded bg-forest text-white" onClick={() => navigate("/")}>
          <Store size={21} />
        </button>
        <div className="relative min-w-0 flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            className="h-11 w-full rounded-full border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none focus:border-forest"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search products or order code"
          />
        </div>
        <button className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 text-slate-600" aria-label="Notifications">
          <Bell size={18} />
        </button>
        <button className="hidden rounded bg-forest px-4 py-2 text-sm font-bold text-white sm:block" onClick={() => navigate("/register?code=346192")}>
          Register
        </button>
      </div>
    </header>
  );
}
