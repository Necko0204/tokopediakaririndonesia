import { Plus } from "lucide-react";
import { useState } from "react";
import { Field, inputClass, Panel } from "../common";
import { formatRupiah, shortDate } from "../../utils";
import { useAppStore } from "../../store/AppStore";
import type { Member, Order, Product } from "../../types";

interface TaskAssignmentTableProps {
  orders: Order[];
  members: Member[];
  products: Product[];
}

export default function TaskAssignmentTable({ orders, members, products }: TaskAssignmentTableProps) {
  const { dispatch } = useAppStore();
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [isAssigning, setIsAssigning] = useState(false);
  const [message, setMessage] = useState("");

  // Filter orders that are waiting for assignment
  const waitingAssignmentOrders = orders.filter((order) => order.status === "waiting_assignment");

  const handleAssignProducts = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedOrderId || selectedProductIds.length === 0) {
      setMessage("Please select an order and at least one product");
      return;
    }

    const order = orders.find((o) => o.id === selectedOrderId);
    if (!order) {
      setMessage("Order not found");
      return;
    }

    setIsAssigning(true);
    setMessage("Assigning products...");

    try {
      // For now, assign the first selected product (in real scenario, could handle multiple)
      const firstProductId = selectedProductIds[0];
      const product = products.find((p) => p.id === firstProductId);
      
      if (!product) {
        throw new Error("Product not found");
      }

      // Calculate total required balance for all selected products
      const selectedProducts = products.filter((p) => selectedProductIds.includes(p.id));
      const totalRequiredBalance = selectedProducts.reduce((sum, p) => sum + p.price, 0);

      const updatedOrder: Order = {
        ...order,
        productCode: product.code,
        productName: product.name,
        value: product.price,
        commission: product.commission,
        requiredBalance: totalRequiredBalance,
        status: "product_assigned",
        assignedAt: new Date().toISOString().slice(0, 16).replace("T", " "),
      };

      dispatch({ type: "updateOrder", payload: updatedOrder });
      
      setMessage("Products assigned successfully!");
      setSelectedOrderId("");
      setSelectedProductIds([]);
      setShowAssignForm(false);
    } catch (error) {
      setMessage(`Error: ${error instanceof Error ? error.message : "Failed to assign products"}`);
    } finally {
      setIsAssigning(false);
    }
  };

  const getStatusColor = (status: Order["status"]) => {
    const colors: Record<Order["status"], string> = {
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
    return colors[status] || "bg-slate-100 text-slate-700";
  };

  return (
    <Panel
      title="Task Assignment Dashboard"
      action={
        <button 
          onClick={() => setShowAssignForm(!showAssignForm)}
          className="inline-flex items-center gap-2 rounded bg-forest px-3 py-2 text-sm font-semibold text-white"
        >
          <Plus size={16} /> Assign Products
        </button>
      }
    >
      {showAssignForm && (
        <form onSubmit={handleAssignProducts} className="mb-6 rounded bg-slate-50 p-4 grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Select Task (Waiting Assignment)">
              <select 
                className={inputClass} 
                required 
                value={selectedOrderId}
                onChange={(e) => setSelectedOrderId(e.target.value)}
              >
                <option value="">Choose a task...</option>
                {waitingAssignmentOrders.map((order) => {
                  const member = members.find((m) => m.username === order.member);
                  return (
                    <option key={order.id} value={order.id}>
                      {member?.username || order.member} - {order.referenceNumber}
                    </option>
                  );
                })}
              </select>
            </Field>

            <Field label="Select Products">
              <div className="space-y-2 border rounded p-2 bg-white max-h-40 overflow-y-auto">
                {products.length === 0 ? (
                  <p className="text-sm text-slate-500">No products available</p>
                ) : (
                  products.map((product) => (
                    <label key={product.id} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={selectedProductIds.includes(product.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedProductIds([...selectedProductIds, product.id]);
                          } else {
                            setSelectedProductIds(selectedProductIds.filter((id) => id !== product.id));
                          }
                        }}
                        className="rounded"
                      />
                      <span className="flex-1">{product.code} - {product.name}</span>
                      <span className="text-xs text-slate-500">{formatRupiah(product.price)}</span>
                    </label>
                  ))
                )}
              </div>
            </Field>
          </div>

          {message && (
            <p className={`rounded px-3 py-2 text-sm font-semibold ${
              message.includes("Error") || message.includes("Please")
                ? "bg-red-50 text-red-700"
                : "bg-emerald-50 text-emerald-700"
            }`}>
              {message}
            </p>
          )}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setShowAssignForm(false);
                setMessage("");
              }}
              className="flex-1 rounded border border-slate-200 px-3 py-2 font-bold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isAssigning}
              className="flex-1 rounded bg-forest px-3 py-2 font-bold text-white hover:bg-forest/90 disabled:bg-slate-400"
            >
              {isAssigning ? "Assigning..." : "Assign Products"}
            </button>
          </div>
        </form>
      )}

      <div className="grid gap-4">
        {orders.length === 0 ? (
          <p className="rounded bg-slate-50 p-4 text-sm text-slate-500">No task assignments yet.</p>
        ) : (
          orders.map((order) => {
            const member = members.find((m) => m.username === order.member);
            const assignedProduct = order.productCode ? products.find((p) => p.code === order.productCode) : null;
            
            return (
              <div
                key={order.id}
                className="rounded border border-slate-200 p-4 grid gap-4 md:grid-cols-[auto_1fr_auto_auto_auto] md:items-center"
              >
                <div className="md:col-span-1">
                  <p className="text-xs text-slate-500 uppercase">Member</p>
                  <p className="font-bold">{member?.username || "Unknown"}</p>
                  <p className="text-xs text-slate-600">{order.referenceNumber}</p>
                </div>

                <div>
                  <p className="text-xs text-slate-500 uppercase">Product</p>
                  <p className="font-bold">{assignedProduct?.name || "Pending..."}</p>
                  <p className="text-xs text-slate-600">{assignedProduct?.code || order.productCode || "-"}</p>
                </div>

                <div>
                  <p className="text-xs text-slate-500 uppercase">Amount</p>
                  <p className="font-bold">{formatRupiah(order.value || 0)}</p>
                  <p className="text-xs text-emerald-700">Comm: {formatRupiah(order.commission || 0)}</p>
                </div>

                <div>
                  <p className="text-xs text-slate-500 uppercase">Status</p>
                  <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>

                <div className="text-right">
                  <p className="text-xs text-slate-500 uppercase">Date</p>
                  <p className="text-sm font-bold">{shortDate(order.createdAt)}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Panel>
  );
}
