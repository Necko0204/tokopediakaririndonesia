import { BadgeDollarSign, Copy, Plus, RefreshCw, ShieldCheck, UserRound, Users } from "lucide-react";
import { useState } from "react";
import { Field, inputClass, Panel, Select } from "../common";
import { createAdmin } from "../../services/adminsService";
import { roleLabel } from "../../services/adminSession";
import { useAppStore } from "../../store/AppStore";
import type { AdminRole, StaffAdmin } from "../../types";
import { formatRupiah } from "../../utils";

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
    adminCode: generateInviteCode(),
    invitationCode: generateInviteCode(),
    registrationBonus: 0,
    role: "admin" as Exclude<AdminRole, "super_admin">,
  });
  const superAdmins = admins.filter((admin) => admin.role === "super_admin").length;
  const regularAdmins = admins.filter((admin) => admin.role === "admin").length;
  const employees = admins.filter((admin) => admin.role === "employee").length;
  const totalRegistrations = admins.reduce((sum, admin) => sum + admin.registrations, 0);

  const saveStaff = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setMessage("Saving staff account...");

    const duplicate = admins.find(
      (admin) =>
        admin.username === form.username ||
        admin.code === form.invitationCode ||
        admin.invitationCode === form.invitationCode ||
        admin.adminCode === form.adminCode,
    );
    if (duplicate) {
      setSaving(false);
      setMessage("Username or invitation code already exists.");
      return;
    }

    try {
      const staff = await createAdmin({
        name: form.name,
        code: form.invitationCode,
        adminCode: form.adminCode,
        invitationCode: form.invitationCode,
        registrationBonus: form.registrationBonus,
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
      setForm({ name: "", username: "", password: "", adminCode: generateInviteCode(), invitationCode: generateInviteCode(), registrationBonus: 0, role: "admin" });
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
      <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StaffSummary icon={<ShieldCheck />} label="Super admins" value={String(superAdmins)} tone="slate" />
        <StaffSummary icon={<Users />} label="Admins" value={String(regularAdmins)} tone="green" />
        <StaffSummary icon={<UserRound />} label="Employees" value={String(employees)} tone="blue" />
        <StaffSummary icon={<BadgeDollarSign />} label="Registrations" value={String(totalRegistrations)} tone="amber" />
      </div>

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

          <Field label="Admin code">
            <div className="flex gap-2">
              <input className={`${inputClass} min-w-0 flex-1`} required value={form.adminCode} onChange={(event) => setForm({ ...form, adminCode: event.target.value.replace(/\D/g, "").slice(0, 6) })} />
              <button type="button" className="shrink-0 rounded bg-slate-200 px-3 py-2 text-sm font-bold text-slate-700" onClick={() => setForm({ ...form, adminCode: generateInviteCode() })}>
                <RefreshCw size={15} />
              </button>
            </div>
          </Field>

          <Field label="Invitation code">
            <div className="flex gap-2">
              <input className={`${inputClass} min-w-0 flex-1`} required value={form.invitationCode} onChange={(event) => setForm({ ...form, invitationCode: event.target.value.replace(/\D/g, "").slice(0, 6) })} />
              <button type="button" className="shrink-0 rounded bg-slate-200 px-3 py-2 text-sm font-bold text-slate-700" onClick={() => setForm({ ...form, invitationCode: generateInviteCode() })}>
                <RefreshCw size={15} />
              </button>
            </div>
          </Field>

          <Field label="Registration bonus (IDR)">
            <input className={inputClass} type="number" min={0} value={form.registrationBonus || ""} onChange={(event) => setForm({ ...form, registrationBonus: Number(event.target.value) || 0 })} placeholder="0" />
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

      <div className="overflow-hidden rounded border border-slate-200 bg-white">
        <div className="flex flex-col gap-2 border-b border-slate-100 bg-slate-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-black text-slate-800">Staff directory</p>
            <p className="text-xs font-semibold text-slate-500">Manage login access, invitation codes, and daily performance.</p>
          </div>
          <span className="w-fit rounded-full bg-white px-3 py-1 text-xs font-black text-slate-500 ring-1 ring-slate-200">
            {admins.length} account{admins.length === 1 ? "" : "s"}
          </span>
        </div>
        <div className="overflow-x-auto">
        <table className="w-full min-w-[920px] border-separate border-spacing-0 text-left text-sm">
          <thead className="text-xs uppercase text-slate-500">
            <tr>
              <StaffTh>Account</StaffTh>
              <StaffTh>Role</StaffTh>
              <StaffTh>Username</StaffTh>
              <StaffTh>Admin code</StaffTh>
              <StaffTh>Invitation code</StaffTh>
              <StaffTh>Registration bonus</StaffTh>
              <StaffTh>Registrations</StaffTh>
              <StaffTh>Today deposit</StaffTh>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin.id} className="group">
                <StaffTd>
                  <div className="flex items-center gap-3">
                    <div className={`grid h-11 w-11 shrink-0 place-items-center rounded text-sm font-black ${roleTone(admin.role).avatar}`}>
                      {initials(admin.name)}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-black text-slate-900">{admin.name}</p>
                      <p className="text-xs font-semibold text-slate-500">ID {admin.id}</p>
                    </div>
                  </div>
                </StaffTd>
                <StaffTd>
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-black ${roleTone(admin.role).badge}`}>
                    {roleLabel(admin.role)}
                  </span>
                </StaffTd>
                <StaffTd>
                  <span className="font-bold text-slate-700">{admin.username ?? "-"}</span>
                </StaffTd>
                <StaffTd>
                  <CodePill value={admin.adminCode ?? admin.code} />
                </StaffTd>
                <StaffTd>
                  <CodePill value={admin.invitationCode ?? admin.code} accent />
                </StaffTd>
                <StaffTd className="font-black text-slate-800">{formatRupiah(admin.registrationBonus ?? 0)}</StaffTd>
                <StaffTd>
                  <span className="rounded bg-slate-100 px-2.5 py-1 text-xs font-black text-slate-700">{admin.registrations}</span>
                </StaffTd>
                <StaffTd className="font-black text-emerald-700">{formatRupiah(admin.todayDeposits)}</StaffTd>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </Panel>
  );
}

function StaffSummary({ icon, label, value, tone }: { icon: React.ReactNode; label: string; value: string; tone: "slate" | "green" | "blue" | "amber" }) {
  const toneClass = {
    slate: "bg-slate-50 text-slate-700 ring-slate-100",
    green: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    blue: "bg-sky-50 text-sky-700 ring-sky-100",
    amber: "bg-amber-50 text-amber-700 ring-amber-100",
  }[tone];

  return (
    <div className={`rounded p-4 ring-1 ${toneClass}`}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-wide opacity-75">{label}</p>
          <p className="mt-2 text-2xl font-black">{value}</p>
        </div>
        <span className="grid h-10 w-10 place-items-center rounded bg-white/70">{icon}</span>
      </div>
    </div>
  );
}

function StaffTh({ children }: { children: React.ReactNode }) {
  return <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 font-black first:pl-5">{children}</th>;
}

function StaffTd({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`border-b border-slate-100 px-4 py-4 align-middle group-hover:bg-slate-50 first:pl-5 ${className}`}>{children}</td>;
}

function CodePill({ value, accent = false }: { value: string; accent?: boolean }) {
  return (
    <button
      className={`inline-flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-black ${accent ? "bg-emerald-50 text-forest" : "bg-slate-100 text-slate-700"}`}
      onClick={() => navigator.clipboard.writeText(value)}
      title="Copy code"
      type="button"
    >
      {value}
      <Copy size={12} />
    </button>
  );
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "A";
}

function roleTone(role?: AdminRole) {
  if (role === "super_admin") {
    return {
      avatar: "bg-slate-900 text-white",
      badge: "bg-slate-900 text-white",
    };
  }
  if (role === "employee") {
    return {
      avatar: "bg-sky-100 text-sky-700",
      badge: "bg-sky-50 text-sky-700",
    };
  }
  return {
    avatar: "bg-emerald-100 text-forest",
    badge: "bg-emerald-50 text-forest",
  };
}
