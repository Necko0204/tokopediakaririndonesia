import { Filter } from "lucide-react";
import { Panel } from "../common";
import { statusStyles } from "../../constants";
import { useAppStore } from "../../store/AppStore";
import type { Order } from "../../types";
import { formatRupiah, shortDate } from "../../utils";
import Filters from "./Filters";

export default function OrderTable({ orders }: { orders: Order[] }) {
  const { dispatch } = useAppStore();

  return (
    <Panel title="Order Intake Records" action={<button className="inline-flex items-center gap-2 rounded border border-slate-200 px-3 py-2 text-sm font-semibold"><Filter size={16} /> Filters</button>}>
      <Filters />
      <div className="mt-4 grid gap-4">
        {orders.map((order) => (
          <article key={order.id} className="grid gap-4 rounded border border-slate-200 bg-white p-4 md:grid-cols-[1fr_1.3fr_1fr_auto] md:items-center">
            <div>
              <p className="text-xs uppercase text-slate-500">Member</p>
              <p className="font-bold">{order.member}</p>
              <p className="text-xs text-slate-500">{shortDate(order.createdAt)}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-slate-500">Product</p>
              <p className="font-semibold">{order.productName}</p>
              <p className="text-xs text-slate-500">{order.productCode}</p>
            </div>
            <div>
              <p className="font-bold">{formatRupiah(order.value)}</p>
              <p className="text-sm text-emerald-700">Commission {formatRupiah(order.commission)}</p>
            </div>
            <div className="grid gap-2">
              <span className={`w-fit rounded px-3 py-1 text-xs font-bold capitalize ${statusStyles[order.status]}`}>{order.status}</span>
              {order.status === "assigned" && (
                <button className="rounded bg-forest px-3 py-2 text-xs font-bold text-white" onClick={() => dispatch({ type: "completeOrder", payload: { orderId: order.id } })}>
                  Complete
                </button>
              )}
            </div>
          </article>
        ))}
      </div>
    </Panel>
  );
}
