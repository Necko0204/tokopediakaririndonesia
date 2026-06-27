import { ArrowLeft, CreditCard, KeyRound, LogOut, PackageCheck, ShieldCheck, UserRound, WalletCards } from "lucide-react";
import type { Navigate } from "../App";
import { Panel } from "../components/common";
import { clearActiveCustomerId, getActiveCustomer } from "../services/customerSession";
import { useAppStore } from "../store/AppStore";
import { formatRupiah, shortDate } from "../utils";

export default function ProfilePage({ navigate }: { navigate: Navigate }) {
  const { state } = useAppStore();
  const member = getActiveCustomer(state.members);

  if (!member) {
    return (
      <main className="grid min-h-screen place-items-center bg-mint px-4 text-ink">
        <section className="w-full max-w-md rounded bg-white p-6 text-center shadow-panel">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-mint text-forest">
            <UserRound size={26} />
          </div>
          <h1 className="mt-4 text-2xl font-black">Login required</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">Sign in to view your profile, balance, and order history.</p>
          <button className="mt-5 h-11 w-full rounded bg-forest font-bold text-white" onClick={() => navigate("/login")}>
            Go to login
          </button>
        </section>
      </main>
    );
  }

  const memberOrders = state.orders.filter((order) => order.member === member.username);
  const memberTransactions = state.transactions.filter((transaction) => transaction.member === member.username);

  const logout = () => {
    clearActiveCustomerId();
    navigate("/login");
  };

  return (
    <main className="min-h-screen bg-[#f4f6f5] pb-10 text-ink">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <button className="inline-flex items-center gap-2 text-sm font-bold text-forest" onClick={() => navigate("/")}>
            <ArrowLeft size={18} />
            Back to store
          </button>
          <button className="inline-flex items-center gap-2 rounded bg-slate-900 px-4 py-2 text-sm font-bold text-white" onClick={logout}>
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="rounded bg-gradient-to-r from-forest via-emerald-600 to-lime-500 p-6 text-white shadow-panel">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="grid h-16 w-16 place-items-center rounded-full bg-white/15 text-white">
                <UserRound size={30} />
              </div>
              <h1 className="mt-4 text-3xl font-black">{member.username}</h1>
              <p className="mt-1 text-sm text-white/80">{member.email ?? "No email on file"}</p>
            </div>
            <div className="grid gap-2 text-sm md:text-right">
              <span className="font-semibold text-white/80">Current balance</span>
              <strong className="text-3xl font-black">{formatRupiah(member.balance)}</strong>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_360px]">
          <div className="grid gap-5">
            <div className="grid gap-4 sm:grid-cols-3">
              <ProfileMetric icon={<WalletCards />} label="Balance" value={formatRupiah(member.balance)} />
              <ProfileMetric icon={<PackageCheck />} label="Total orders" value={String(member.totalOrders)} />
              <ProfileMetric icon={<ShieldCheck />} label="Level" value={member.level} />
            </div>

            <Panel title="Order history">
              <div className="space-y-3">
                {memberOrders.length ? (
                  memberOrders.map((order) => (
                    <div key={order.id} className="rounded border border-slate-200 p-4">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="font-bold">{order.productName}</p>
                          <p className="text-xs text-slate-500">
                            {order.productCode} · {shortDate(order.createdAt)}
                          </p>
                        </div>
                        <span className="rounded bg-mint px-2 py-1 text-xs font-bold capitalize text-forest">{order.status}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="rounded bg-slate-50 p-4 text-sm text-slate-500">No order history yet.</p>
                )}
              </div>
            </Panel>
          </div>

          <aside className="space-y-5">
            <Panel title="Account details">
              <ProfileRow label="Phone" value={member.phone} />
              <ProfileRow label="Invitation code" value={member.invitationCode} />
              <ProfileRow label="Referred by" value={member.referredBy} />
              <ProfileRow label="Last login" value={member.lastLogin} />
            </Panel>

            <div id="settings">
              <Panel title="Settings">
              <button className="flex w-full items-center gap-3 rounded border border-slate-200 px-3 py-3 text-left text-sm font-bold text-slate-700 hover:bg-slate-50">
                <KeyRound size={17} className="text-forest" />
                Change account password
              </button>
              <button className="mt-3 flex w-full items-center gap-3 rounded border border-slate-200 px-3 py-3 text-left text-sm font-bold text-slate-700 hover:bg-slate-50">
                <CreditCard size={17} className="text-forest" />
                Change withdrawal password
              </button>
              </Panel>
            </div>

            <Panel title="Recent records">
              <div className="space-y-2">
                {memberTransactions.length ? (
                  memberTransactions.slice(0, 5).map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between rounded bg-slate-50 p-3 text-sm">
                      <span className="capitalize">{transaction.type}</span>
                      <span className="font-bold">{formatRupiah(transaction.amount)}</span>
                    </div>
                  ))
                ) : (
                  <p className="rounded bg-slate-50 p-4 text-sm text-slate-500">No records yet.</p>
                )}
              </div>
            </Panel>
          </aside>
        </div>
      </section>
    </main>
  );
}

function ProfileMetric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <article className="rounded bg-white p-4 shadow-panel">
      <div className="grid h-10 w-10 place-items-center rounded bg-mint text-forest">{icon}</div>
      <p className="mt-4 text-xs font-bold uppercase text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-black">{value}</p>
    </article>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-slate-100 py-3 last:border-0">
      <p className="text-xs font-bold uppercase text-slate-500">{label}</p>
      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}
