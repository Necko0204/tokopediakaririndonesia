import { useState } from "react";
import { Field, inputClass, Panel } from "../common";
import { useAppStore } from "../../store/AppStore";
import type { AppState } from "../../types";

export default function AccountPanel({ account }: { account: AppState["account"] }) {
  const { dispatch } = useAppStore();
  const [form, setForm] = useState(account);
  const [message, setMessage] = useState("");

  const save = (nextMessage: string) => {
    dispatch({ type: "updateAccount", payload: form });
    setMessage(nextMessage);
  };

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Panel title="Account Username">
        <Field label="Display username">
          <input className={inputClass} value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} />
        </Field>
        <button className="mt-4 rounded bg-forest px-4 py-2 text-sm font-bold text-white" onClick={() => save("Account updated.")}>
          Save username
        </button>
        {message && <p className="mt-3 text-sm font-semibold text-emerald-700">{message}</p>}
      </Panel>
      <Panel title="Password Settings">
        <div className="grid gap-3">
          <input className={inputClass} placeholder="New account password" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
          <input className={inputClass} placeholder="New withdrawal password" type="password" value={form.withdrawalPassword} onChange={(event) => setForm({ ...form, withdrawalPassword: event.target.value })} />
        </div>
        <button className="mt-4 rounded bg-coral px-4 py-2 text-sm font-bold text-white" onClick={() => save("Passwords updated.")}>
          Update passwords
        </button>
      </Panel>
    </div>
  );
}
