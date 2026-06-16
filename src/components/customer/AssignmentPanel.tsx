import type { Order, Product } from "../../types";
import { formatRupiah } from "../../utils";

interface AssignmentPanelProps {
  order?: Order;
  featuredProduct?: Product;
  onComplete: (orderId: string) => void;
}

export default function AssignmentPanel({ order, featuredProduct, onComplete }: AssignmentPanelProps) {
  return (
    <section id="assignment" className="rounded bg-white p-5 shadow-panel">
      <h2 className="text-lg font-black">Current assignment</h2>
      {order && featuredProduct ? (
        <>
          <img className="mt-4 h-40 w-full rounded object-cover" src={featuredProduct.image} alt={order.productName} />
          <p className="mt-4 font-bold">{order.productName}</p>
          <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
            <p>
              <span className="block text-xs text-slate-500">Order value</span>
              {formatRupiah(order.value)}
            </p>
            <p>
              <span className="block text-xs text-slate-500">Commission</span>
              {formatRupiah(order.commission)}
            </p>
          </div>
          <button className="mt-4 w-full rounded bg-coral px-3 py-3 text-sm font-bold text-white" onClick={() => onComplete(order.id)}>
            Complete order
          </button>
        </>
      ) : (
        <p className="mt-4 rounded bg-slate-50 p-4 text-sm text-slate-500">No active assignment. Take an order from the product list.</p>
      )}
    </section>
  );
}
