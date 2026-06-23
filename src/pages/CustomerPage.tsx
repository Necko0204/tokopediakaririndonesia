import { useEffect, useMemo, useState } from "react";
import type { Navigate } from "../App";
import AssignmentPanel from "../components/customer/AssignmentPanel";
import BottomNavbar from "../components/customer/BottomNavbar";
import CustomerHeader, { type CustomerNotification } from "../components/customer/CustomerHeader";
import CustomerHero from "../components/customer/CustomerHero";
import DepositDestination from "../components/customer/DepositDestination";
import PremiumBanner from "../components/customer/PremiumBanner";
import ProductGrid from "../components/customer/ProductGrid";
import RecentRecords from "../components/customer/RecentRecords";
import StoreShortcutGrid from "../components/customer/StoreShortcutGrid";
import TransactionModal from "../components/customer/TransactionModal";
import { clearActiveCustomerId, getActiveCustomerId } from "../services/customerSession";
import { useAppStore } from "../store/AppStore";
import type { Product } from "../types";

export default function CustomerPage({ navigate }: { navigate: Navigate }) {
  const { state, dispatch, persistence } = useAppStore();
  const [query, setQuery] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [activeModal, setActiveModal] = useState<"topup" | "withdraw" | null>(null);
  const [activeCustomerId, setActiveCustomerIdState] = useState(() => getActiveCustomerId());

  useEffect(() => {
    setActiveCustomerIdState(getActiveCustomerId());
  }, [state.members]);

  const currentMember = state.members.find((member) => member.id === activeCustomerId) ?? state.members[0];
  const assignedOrder = currentMember ? state.orders.find((order) => order.member === currentMember.username && order.status === "assigned") : undefined;
  const assignedProduct = assignedOrder ? state.products.find((product) => product.code === assignedOrder.productCode) : undefined;
  const notifications = useMemo<CustomerNotification[]>(() => {
    if (!currentMember) return [];

    const orderNotifications = state.orders
      .filter((order) => order.member === currentMember.username && order.status !== "completed")
      .slice(0, 3)
      .map((order) => ({
        id: `order-${order.id}`,
        title: order.status === "assigned" ? "Order ready to complete" : "Order is frozen",
        text: `${order.productName} · ${order.productCode}`,
        tone: order.status === "frozen" ? ("danger" as const) : ("info" as const),
      }));

    const transactionNotifications = state.transactions
      .filter((transaction) => transaction.member === currentMember.username)
      .slice(0, 4)
      .map((transaction) => ({
        id: `transaction-${transaction.id}`,
        title:
          transaction.status === "pending"
            ? `${transaction.type === "topup" ? "Top-up" : "Withdrawal"} pending`
            : `${transaction.type === "topup" ? "Top-up" : "Withdrawal"} ${transaction.status}`,
        text: `${transaction.amount.toLocaleString("id-ID")} IDR · ${transaction.createdAt}`,
        tone:
          transaction.status === "approved"
            ? ("success" as const)
            : transaction.status === "rejected"
              ? ("danger" as const)
              : ("warning" as const),
      }));

    return [...orderNotifications, ...transactionNotifications].slice(0, 6);
  }, [currentMember, state.orders, state.transactions]);

  const filteredProducts = useMemo(
    () => state.products.filter((product) => `${product.name} ${product.code} ${product.category}`.toLowerCase().includes(query.toLowerCase())),
    [query, state.products],
  );

  const toggleFavorite = (productId: string) => {
    setFavorites((items) => (items.includes(productId) ? items.filter((id) => id !== productId) : [...items, productId]));
  };

  const takeOrder = (product: Product) => {
    dispatch({ type: "createOrder", payload: { member: currentMember!.username, productId: product.id } });
  };

  const logout = () => {
    clearActiveCustomerId();
    setActiveCustomerIdState(null);
    navigate("/login");
  };

  // Show empty state if no data
  if (!currentMember || state.members.length === 0) {
    return (
      <main className="min-h-screen bg-[#f4f6f5] pb-24 text-ink flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">No Data Available</h1>
          <p className="text-gray-600 mb-6">Please seed Firestore with sample data to continue.</p>
          <button
            onClick={() => navigate("/admin")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Admin Panel
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f6f5] pb-24 text-ink">
      <CustomerHeader
        query={query}
        activeUsername={activeCustomerId ? currentMember.username : undefined}
        notifications={notifications}
        onQueryChange={setQuery}
        onLogout={logout}
        navigate={navigate}
      />
      <CustomerHero
        balance={currentMember.balance}
        persistence={persistence}
        onTopUp={() => setActiveModal("topup")}
        onWithdraw={() => setActiveModal("withdraw")}
      />

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <StoreShortcutGrid navigate={navigate} onTopUp={() => setActiveModal("topup")} onWithdraw={() => setActiveModal("withdraw")} />
        <PremiumBanner />

        <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_340px]">
          <ProductGrid
            products={filteredProducts}
            favorites={favorites}
            onClearSearch={() => setQuery("")}
            onToggleFavorite={toggleFavorite}
            onTakeOrder={takeOrder}
          />
          <aside className="space-y-5">
            <AssignmentPanel order={assignedOrder} featuredProduct={assignedProduct} onComplete={(orderId) => dispatch({ type: "completeOrder", payload: { orderId } })} />
            <DepositDestination banks={state.banks} />
            <RecentRecords transactions={state.transactions} />
          </aside>
        </div>
      </section>

      <BottomNavbar isLoggedIn={Boolean(activeCustomerId)} navigate={navigate} />
      {activeModal && <TransactionModal type={activeModal} member={currentMember.username} onClose={() => setActiveModal(null)} />}
    </main>
  );
}
