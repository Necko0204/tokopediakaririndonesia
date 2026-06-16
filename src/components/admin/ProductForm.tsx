import { useState } from "react";
import { inputClass } from "../common";
import { useAppStore } from "../../store/AppStore";
import type { Product } from "../../types";

export default function ProductForm() {
  const { dispatch } = useAppStore();
  const [form, setForm] = useState<Omit<Product, "id">>({
    code: "",
    name: "",
    price: 0,
    commission: 0,
    quantity: 1,
    category: "",
    image: "https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=600&q=80",
  });

  return (
    <form
      className="grid gap-3 rounded bg-slate-50 p-4 md:grid-cols-3"
      onSubmit={(event) => {
        event.preventDefault();
        dispatch({ type: "addProduct", payload: form });
      }}
    >
      <input className={inputClass} placeholder="Code" required value={form.code} onChange={(event) => setForm({ ...form, code: event.target.value })} />
      <input className={inputClass} placeholder="Name" required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
      <input className={inputClass} placeholder="Category" required value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} />
      <input className={inputClass} type="number" placeholder="Price" required value={form.price} onChange={(event) => setForm({ ...form, price: Number(event.target.value) })} />
      <input className={inputClass} type="number" placeholder="Commission" required value={form.commission} onChange={(event) => setForm({ ...form, commission: Number(event.target.value) })} />
      <input className={inputClass} type="number" placeholder="Quantity" required value={form.quantity} onChange={(event) => setForm({ ...form, quantity: Number(event.target.value) })} />
      <button className="rounded bg-forest px-4 py-2 font-bold text-white md:col-span-3">Save product</button>
    </form>
  );
}
