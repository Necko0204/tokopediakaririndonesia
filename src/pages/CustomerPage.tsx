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
  const assignedOrder = state.orders.find((order) => order.member === currentMember.username && order.status === "assigned");

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
