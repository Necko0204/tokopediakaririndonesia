import { Search } from "lucide-react";
import { inputClass } from "../common";

export default function Filters() {
  return (
    <div className="grid gap-3 md:grid-cols-4">
      <input className={inputClass} placeholder="Promotion code" />
      <input className={inputClass} placeholder="Username / ID" />
      <input className={inputClass} placeholder="Phone number" />
      <button className="inline-flex h-11 items-center justify-center gap-2 rounded bg-sky-500 px-4 text-sm font-bold text-white">
        <Search size={17} /> Search
      </button>
    </div>
  );
}
