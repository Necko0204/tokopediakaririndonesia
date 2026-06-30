import { Boxes, ClipboardList, LayoutDashboard, ShieldCheck, UserCog, Users, WalletCards } from "lucide-react";
import type { TransactionStatus, OrderStatus } from "./types";

export const adminTabs = ["Overview", "Members", "Tasks", "Orders", "Finance", "Catalog", "Staff", "Account"] as const;
export type AdminTab = (typeof adminTabs)[number];

export const statusStyles: Record<TransactionStatus | OrderStatus, string> = {
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-emerald-100 text-emerald-700",
  rejected: "bg-rose-100 text-rose-700",
  no_task: "bg-slate-100 text-slate-700",
  waiting_assignment: "bg-amber-100 text-amber-700",
  product_assigned: "bg-sky-100 text-sky-700",
  waiting_shipment: "bg-purple-100 text-purple-700",
  belum_diserahkan: "bg-orange-100 text-orange-700",
  diserahkan: "bg-emerald-100 text-emerald-700",
  waiting: "bg-amber-100 text-amber-700",
  assigned: "bg-sky-100 text-sky-700",
  completed: "bg-emerald-100 text-emerald-700",
  frozen: "bg-rose-100 text-rose-700",
};

export function adminTabIcon(tab: AdminTab) {
  const props = { size: 18 };
  if (tab === "Overview") return <LayoutDashboard {...props} />;
  if (tab === "Members") return <Users {...props} />;
  if (tab === "Tasks") return <ClipboardList {...props} />;
  if (tab === "Orders") return <Boxes {...props} />;
  if (tab === "Finance") return <WalletCards {...props} />;
  if (tab === "Catalog") return <Boxes {...props} />;
  if (tab === "Staff") return <UserCog {...props} />;
  return <ShieldCheck {...props} />;
}
