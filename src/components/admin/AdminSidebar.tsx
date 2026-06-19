import { adminTabIcon, type AdminTab } from "../../constants";
import { firebaseReady } from "../../firebase";

interface AdminSidebarProps {
  activeTab: AdminTab;
  tabs: readonly AdminTab[];
  persistence: "firebase" | "local";
  onTabChange: (tab: AdminTab) => void;
}

export default function AdminSidebar({ activeTab, tabs, persistence, onTabChange }: AdminSidebarProps) {
  return (
    <aside className="h-fit border-b border-slate-200 pb-4 lg:sticky lg:top-20 lg:border-b-0">
      <div className="mb-4 rounded bg-white p-4 shadow-panel">
        <p className="text-xs uppercase tracking-wide text-slate-500">Persistence</p>
        <div className="mt-2 flex items-center gap-2 text-sm font-semibold">
          <span className={`h-2.5 w-2.5 rounded-full ${firebaseReady ? "bg-emerald-500" : "bg-amber-500"}`} />
          {firebaseReady ? "Firebase connected" : "Local fallback"}
        </div>
        <p className="mt-2 text-xs leading-5 text-slate-500">Current writes save to {persistence}.</p>
      </div>
      <nav className="grid grid-cols-2 gap-2 lg:grid-cols-1">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`flex items-center gap-3 rounded px-3 py-3 text-left text-sm font-semibold ${activeTab === tab ? "bg-slate-900 text-white" : "bg-white text-slate-600 hover:bg-mint"}`}
          >
            {adminTabIcon(tab)}
            {tab}
          </button>
        ))}
      </nav>
    </aside>
  );
}
