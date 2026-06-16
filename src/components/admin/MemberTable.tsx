import { Panel } from "../common";
import type { Member } from "../../types";
import { formatRupiah } from "../../utils";
import Filters from "./Filters";

export default function MemberTable({ members }: { members: Member[] }) {
  return (
    <Panel title="Member Management">
      <Filters />
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="border border-slate-200 p-3">Promotion code</th>
              <th className="border border-slate-200 p-3">Username</th>
              <th className="border border-slate-200 p-3">Balance</th>
              <th className="border border-slate-200 p-3">Orders</th>
              <th className="border border-slate-200 p-3">Last login</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id}>
                <td className="border border-slate-200 p-3 font-semibold">{member.invitationCode}</td>
                <td className="border border-slate-200 p-3">
                  <p className="font-bold">{member.username}</p>
                  <p className="text-coral">{member.phone}</p>
                  <p className="text-xs text-slate-500">ID: {member.id} · {member.referredBy}</p>
                  <span className="mt-2 inline-block rounded bg-amber-100 px-2 py-1 text-xs font-bold text-amber-700">{member.level}</span>
                </td>
                <td className="border border-slate-200 p-3 font-bold text-coral">{formatRupiah(member.balance)}</td>
                <td className="border border-slate-200 p-3">{member.totalOrders}</td>
                <td className="border border-slate-200 p-3">{member.lastLogin}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}
