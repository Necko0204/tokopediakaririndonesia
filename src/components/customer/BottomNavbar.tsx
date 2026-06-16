import { CreditCard, Home, ReceiptText, ShoppingBag, User } from "lucide-react";

export default function BottomNavbar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white md:hidden">
      <div className="grid grid-cols-5 text-xs font-semibold text-slate-500">
        <BottomNav icon={<Home />} label="Home" active />
        <BottomNav icon={<ReceiptText />} label="Orders" />
        <BottomNav icon={<ShoppingBag />} label="Claim" raised />
        <BottomNav icon={<CreditCard />} label="Wallet" />
        <BottomNav icon={<User />} label="Me" />
      </div>
    </nav>
  );
}

function BottomNav({ icon, label, active, raised }: { icon: React.ReactNode; label: string; active?: boolean; raised?: boolean }) {
  return (
    <button className={`relative grid min-h-16 place-items-center py-2 ${active ? "text-forest" : ""}`}>
      <span className={`grid h-8 w-8 place-items-center ${raised ? "-mt-7 h-14 w-14 rounded-full bg-forest text-white shadow-panel" : ""}`}>{icon}</span>
      <span>{label}</span>
    </button>
  );
}
