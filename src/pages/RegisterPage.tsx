import { Store } from "lucide-react";
import { useState } from "react";
import type { Navigate } from "../App";
import { Field, inputClass } from "../components/common";
import { useAppStore } from "../store/AppStore";

export default function RegisterPage({ navigate }: { navigate: Navigate }) {
  const { dispatch } = useAppStore();
  const code = new URLSearchParams(window.location.search).get("code") ?? "346192";
  const [form, setForm] = useState({
    username: "",
    phone: "",
    invitationCode: code,
    accountPassword: "",
    withdrawalPassword: "",
  });
  const [message, setMessage] = useState("");

  return (
    <main className="grid min-h-screen place-items-center bg-mint px-4 py-8 text-ink">
      <section className="w-full max-w-md rounded bg-white p-6 shadow-panel">
        <button className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-forest" onClick={() => navigate("/")}>
          <Store size={18} />
          Back to store
        </button>
        <h1 className="text-3xl font-black">Create customer account</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">Register with your invitation code to connect the account to the correct admin team.</p>
        <form
          className="mt-6 grid gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            dispatch({ type: "registerMember", payload: form });
            setMessage("Account registered. You can now return to the store.");
          }}
        >
          <Field label="Username">
            <input className={inputClass} required value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} />
          </Field>
          <Field label="Phone number">
            <input className={inputClass} required value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
          </Field>
          <Field label="Invitation code">
            <input className={inputClass} required value={form.invitationCode} onChange={(event) => setForm({ ...form, invitationCode: event.target.value })} />
          </Field>
          <Field label="Password">
            <input className={inputClass} required type="password" value={form.accountPassword} onChange={(event) => setForm({ ...form, accountPassword: event.target.value })} />
          </Field>
          <Field label="Withdrawal password">
            <input className={inputClass} required type="password" value={form.withdrawalPassword} onChange={(event) => setForm({ ...form, withdrawalPassword: event.target.value })} />
          </Field>
          {message && <p className="rounded bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">{message}</p>}
          <button className="h-12 w-full rounded bg-forest font-bold text-white">Register account</button>
        </form>
      </section>
    </main>
  );
}
