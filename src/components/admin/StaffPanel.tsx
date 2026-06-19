import { Plus, RefreshCw } from "lucide-react";
import { useState } from "react";
import { Field, inputClass, Panel, Select } from "../common";
import { createAdmin } from "../../services/adminsService";
import { roleLabel } from "../../services/adminSession";
import { useAppStore } from "../../store/AppStore";
import type { AdminRole, StaffAdmin } from "../../types";

function generateInviteCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export default function StaffPanel({ admins }: { admins: StaffAdmin[] }) {
  const { dispatch } = useAppStore();
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    name: "",
    username: "",
    password: "",
    code: generateInviteCode(),
    role: "admin" as Exclude<AdminRole, "super_admin">,
  });

  const saveStaff = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setMessage("Saving staff account...");

    const duplicate = admins.find((admin) => admin.username === form.username || admin.code === form.code);
    if (duplicate) {
      setSaving(false);
      setMessage("Username or invitation code already exists.");
      return;
    }

    try {
      const staff = await createAdmin({
        name: form.name,
        code: form.code,
        registrations: 0,
        todayDeposits: 0,
        monthDeposits: 0,
        todayWithdrawals: 0,
        monthWithdrawals: 0,
        username: form.username,
        password: form.password,
        role: form.role,
      });
      dispatch({ type: "addAdmin", payload: staff });
      setForm({ name: "", username: "", password: "", code: generateInviteCode(), role: "admin" });
      setMessage("Staff account saved to Firebase.");
      setShowForm(false);
    } catch (error) {
      console.error("Failed to save staff account:", error);
      setMessage("Firebase save failed. Check Firestore admin rules.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Panel
      title="Admin & Employee Accounts"
      action={
        <button className="inline-flex items-center gap-2 rounded bg-forest px-3 py-2 text-sm font-semibold text-white" onClick={() => setShowForm(!showForm)}>
          <Plus size={16} />
          Add staff
        </button>
      }
    >
      {showForm && (
        <form className="mb-5 grid gap-4 rounded bg-slate-50 p-4" onSubmit={saveStaff}>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Display name">
              <input className={inputClass} required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Admin 4" />
            </Field>
            <Field label="Role">
              <Select value={form.role} onChange={(role) => setForm({ ...form, role: role as Exclude<AdminRole, "super_admin"> })} options={["admin", "employee"]} />
            </Field>
            <Field label="Username">
              <input className={inputClass} required value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} placeholder="admin4" />
            </Field>
            <Field label="Password">
              <input className={inputClass} required type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="Password" />
            </Field>
          </div>

          <Field label="Invitation code">
            <div className="flex gap-2">
              <input className={`${inputClass} min-w-0 flex-1`} required value={form.code} onChange={(event) => setForm({ ...form, code: event.target.value.replace(/\D/g, "").slice(0, 6) })} />
              <button type="button" className="shrink-0 rounded bg-slate-200 px-3 py-2 text-sm font-bold text-slate-700" onClick={() => setForm({ ...form, code: generateInviteCode() })}>
                <RefreshCw size={15} />
              </button>
            </div>
          </Field>

          {message && (
            <p className={`rounded px-3 py-2 text-sm font-semibold ${message.includes("failed") || message.includes("exists") ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>
              {message}
            </p>
          )}

          <button disabled={saving} className="rounded bg-forest px-4 py-3 font-bold text-white disabled:bg-slate-400">
            {saving ? "Saving..." : "Save staff account"}
          </button>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="text-xs uppercase text-slate-500">
            <tr>
              <th className="py-3">Name</th>
              <th>Role</th>
              <th>Username</th>
              <th>Invitation code</th>
              <th>Registrations</th>
              <th>Today deposit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {admins.map((admin) => (
              <tr key={admin.id}>
                <td className="py-4 font-semibold">{admin.name}</td>
                <td>{roleLabel(admin.role)}</td>
                <td>{admin.username ?? "-"}</td>
                <td className="font-bold text-forest">{admin.code}</td>
                <td>{admin.registrations}</td>
                <td>{admin.todayDeposits.toLocaleString("id-ID")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}
