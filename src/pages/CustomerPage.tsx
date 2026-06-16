import { useMemo, useState } from "react";
import type { Navigate } from "../App";
import AssignmentPanel from "../components/customer/AssignmentPanel";
import BottomNavbar from "../components/customer/BottomNavbar";
import CustomerHeader from "../components/customer/CustomerHeader";
import CustomerHero from "../components/customer/CustomerHero";
import DepositDestination from "../components/customer/DepositDestination";
import PremiumBanner from "../components/customer/PremiumBanner";
import ProductGrid from "../components/customer/ProductGrid";
import RecentRecords from "../components/customer/RecentRecords";
import StoreShortcutGrid from "../components/customer/StoreShortcutGrid";
import TransactionModal from "../components/customer/TransactionModal";
import { useAppStore } from "../store/AppStore";
import type { Product } from "../types";

export default function CustomerPage({ navigate }: { navigate: Navigate }) {
  const { state, dispatch, persistence } = useAppStore();
  const [query, setQuery] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [activeModal, setActiveModal] = useState<"topup" | "withdraw" | null>(null);

  const currentMember = state.members[0];
  const featuredProduct = state.products[0];
  const assignedOrder = currentMember ? state.orders.find((order) => order.member === currentMember.username && order.status === "assigned") : undefined;

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

  const filteredProducts = useMemo(
    () => state.products.filter((product) => `${product.name} ${product.code} ${product.category}`.toLowerCase().includes(query.toLowerCase())),
    [query, state.products],
  );

  const toggleFavorite = (productId: string) => {
    setFavorites((items) => (items.includes(productId) ? items.filter((id) => id !== productId) : [...items, productId]));
  };

  const takeOrder = (product: Product) => {
    dispatch({ type: "createOrder", payload: { member: currentMember.username, productId: product.id } });
  };

  return (
    <main className="min-h-screen bg-[#f4f6f5] pb-24 text-ink">
      <CustomerHeader query={query} onQueryChange={setQuery} navigate={navigate} />
      <CustomerHero
        balance={currentMember.balance}
        persistence={persistence}
        navigate={navigate}
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
            <AssignmentPanel order={assignedOrder} featuredProduct={featuredProduct} onComplete={(orderId) => dispatch({ type: "completeOrder", payload: { orderId } })} />
            <DepositDestination banks={state.banks} />
            <RecentRecords transactions={state.transactions} />
          </aside>
        </div>
      </section>

      <BottomNavbar />
      {activeModal && <TransactionModal type={activeModal} member={currentMember.username} onClose={() => setActiveModal(null)} />}
    </main>
  );
}
