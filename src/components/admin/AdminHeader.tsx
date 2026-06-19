import { Bell, LogOut } from "lucide-react";
import type { Navigate } from "../../App";
import { adminTabIcon } from "../../constants";
import { roleLabel } from "../../services/adminSession";
import type { StaffAdmin } from "../../types";

export default function AdminHeader({ activeAdmin, navigate, onLogout }: { activeAdmin: StaffAdmin; navigate: Navigate; onLogout: () => void }) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded bg-slate-900 text-white">{adminTabIcon("Overview")}</div>
          <div>
            <h1 className="text-lg font-bold leading-tight">Admin Board</h1>
            <p className="text-xs text-slate-500">Registrations, deposits, releases, catalog, and staff activity</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="hidden rounded border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 sm:block" onClick={() => navigate("/")}>
            Customer store
          </button>
          <button className="grid h-10 w-10 place-items-center rounded border border-slate-200 text-slate-600" aria-label="Notifications">
            <Bell size={18} />
          </button>
          <div className="hidden text-right sm:block">
            <p className="text-sm font-bold">{activeAdmin.name}</p>
            <p className="text-xs text-slate-500">{roleLabel(activeAdmin.role)}</p>
          </div>
          <button className="inline-flex items-center gap-2 rounded bg-coral px-3 py-2 text-sm font-semibold text-white" onClick={onLogout}>
            <LogOut size={16} />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </div>
    </header>
  );
}
