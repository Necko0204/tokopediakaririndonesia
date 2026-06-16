import { useMemo, useState } from "react";
import type { Navigate } from "../App";
import AccountPanel from "../components/admin/AccountPanel";
import AdminHeader from "../components/admin/AdminHeader";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminToolbar from "../components/admin/AdminToolbar";
import CatalogAdmin from "../components/admin/CatalogAdmin";
import FinanceTable from "../components/admin/FinanceTable";
import MemberTable from "../components/admin/MemberTable";
import OrderTable from "../components/admin/OrderTable";
import OverviewPanel from "../components/admin/OverviewPanel";
import type { AdminTab } from "../constants";
import { useAppStore } from "../store/AppStore";

export default function AdminPage({ navigate }: { navigate: Navigate }) {
  const { state, persistence } = useAppStore();
  const [activeTab, setActiveTab] = useState<AdminTab>("Overview");
  const [query, setQuery] = useState("");
  const [selectedAdmin, setSelectedAdmin] = useState("All admins");

  const totals = useMemo(() => {
    const adminScope = selectedAdmin === "All admins" ? state.admins : state.admins.filter((admin) => admin.name === selectedAdmin);
    return {
      registrations: adminScope.reduce((sum, admin) => sum + admin.registrations, 0),
      todayDeposits: adminScope.reduce((sum, admin) => sum + admin.todayDeposits, 0),
      monthDeposits: adminScope.reduce((sum, admin) => sum + admin.monthDeposits, 0),
      todayWithdrawals: adminScope.reduce((sum, admin) => sum + admin.todayWithdrawals, 0),
      monthWithdrawals: adminScope.reduce((sum, admin) => sum + admin.monthWithdrawals, 0),
    };
  }, [selectedAdmin, state.admins]);

  const filteredMembers = state.members.filter((member) => {
    const adminMatch = selectedAdmin === "All admins" || member.referredBy === selectedAdmin;
    const textMatch = `${member.username} ${member.phone} ${member.invitationCode}`.toLowerCase().includes(query.toLowerCase());
    return adminMatch && textMatch;
  });

  return (
    <main className="min-h-screen bg-cloud text-ink">
      <AdminHeader navigate={navigate} />
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[250px_1fr]">
        <AdminSidebar activeTab={activeTab} persistence={persistence} onTabChange={setActiveTab} />
        <section className="min-w-0">
          <AdminToolbar admins={state.admins} selectedAdmin={selectedAdmin} query={query} onSelectedAdminChange={setSelectedAdmin} onQueryChange={setQuery} />
          {activeTab === "Overview" && <OverviewPanel state={state} totals={totals} />}
          {activeTab === "Members" && <MemberTable members={filteredMembers} />}
          {activeTab === "Orders" && <OrderTable orders={state.orders} />}
          {activeTab === "Finance" && <FinanceTable transactions={state.transactions} />}
          {activeTab === "Catalog" && <CatalogAdmin products={state.products} />}
          {activeTab === "Account" && <AccountPanel account={state.account} />}
        </section>
      </div>
    </main>
  );
}
