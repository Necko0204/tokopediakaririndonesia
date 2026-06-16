import { useState } from "react";
import { inputClass } from "../common";
import { useAppStore } from "../../store/AppStore";
import type { Product } from "../../types";

const CATEGORIES = ["Electronics", "Health", "Home", "Lifestyle", "Fashion", "Beauty", "Sports", "Books"];

function generateProductCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export default function ProductForm() {
  const { dispatch } = useAppStore();
  const [form, setForm] = useState<Omit<Product, "id">>({
    code: generateProductCode(),
    name: "",
    price: 0,
    commission: 0,
    quantity: 1,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=600&q=80",
  });

  const handlePriceChange = (price: number) => {
    const commission = Math.round(price * 0.2); // 20% commission
    setForm({ ...form, price, commission });
  };

  const handleRegenCode = () => {
    setForm({ ...form, code: generateProductCode() });
  };

  return (
    <form
      className="grid gap-3 rounded bg-slate-50 p-4"
      onSubmit={(event) => {
        event.preventDefault();
        if (!form.name.trim()) {
          alert("Product name is required");
          return;
        }
        dispatch({ type: "addProduct", payload: form });
        setForm({
          code: generateProductCode(),
          name: "",
          price: 0,
          commission: 0,
          quantity: 1,
          category: "Electronics",
          image: "https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=600&q=80",
        });
      }}
    >
      <div className="grid gap-3 md:grid-cols-3">
        <div>
          <label className="text-xs font-bold text-slate-600">Code (Auto-generated)</label>
          <div className="mt-1 flex gap-2">
            <input className={inputClass} disabled value={form.code} />
            <button
              type="button"
              onClick={handleRegenCode}
              className="rounded bg-slate-300 px-3 py-2 font-bold text-slate-700 hover:bg-slate-400"
            >
              Regen
            </button>
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-600">Name *</label>
          <input
            className={inputClass}
            placeholder="Product name"
            required
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-600">Category *</label>
          <select
            className={inputClass}
            required
            value={form.category}
            onChange={(event) => setForm({ ...form, category: event.target.value })}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <div>
          <label className="text-xs font-bold text-slate-600">Price (IDR)</label>
          <input
            className={inputClass}
            type="number"
            placeholder="0"
            value={form.price || ""}
            onChange={(event) => handlePriceChange(Number(event.target.value) || 0)}
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-600">Commission (20% auto)</label>
          <input className={inputClass} type="number" disabled value={form.commission} />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-600">Quantity</label>
          <input
            className={inputClass}
            type="number"
            placeholder="1"
            value={form.quantity || ""}
            onChange={(event) => setForm({ ...form, quantity: Number(event.target.value) || 1 })}
          />
        </div>
      </div>

      <button className="rounded bg-forest px-4 py-2 font-bold text-white hover:bg-forest/90 md:col-span-3">
        Save product
      </button>
    </form>
  );
}
