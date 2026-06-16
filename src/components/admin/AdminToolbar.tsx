import { Search } from "lucide-react";
import { Select } from "../common";
import type { StaffAdmin } from "../../types";

interface AdminToolbarProps {
  admins: StaffAdmin[];
  selectedAdmin: string;
  query: string;
  onSelectedAdminChange: (admin: string) => void;
  onQueryChange: (query: string) => void;
}

export default function AdminToolbar({ admins, selectedAdmin, query, onSelectedAdminChange, onQueryChange }: AdminToolbarProps) {
  return (
    <div className="mb-5 flex flex-col gap-3 rounded bg-white p-4 shadow-panel md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-sm text-slate-500">Sponsored registration link</p>
        <p className="break-all text-lg font-bold text-forest">http://127.0.0.1:5173/register?code=346192</p>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Select value={selectedAdmin} onChange={onSelectedAdminChange} options={["All admins", ...admins.map((admin) => admin.name)]} />
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            className="h-11 w-full rounded border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none focus:border-forest sm:w-64"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search member, phone, code"
          />
        </div>
      </div>
    </div>
  );
}
