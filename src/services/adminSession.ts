import type { AdminRole, StaffAdmin } from "../types";

const activeAdminKey = "orderops-active-admin-id";

export function getActiveAdminId() {
  return window.localStorage.getItem(activeAdminKey);
}

export function setActiveAdminId(adminId: string) {
  window.localStorage.setItem(activeAdminKey, adminId);
}

export function clearActiveAdminId() {
  window.localStorage.removeItem(activeAdminKey);
}

export function getActiveAdmin(admins: StaffAdmin[]) {
  const activeId = getActiveAdminId();
  return admins.find((admin) => admin.id === activeId) ?? null;
}

export function roleLabel(role?: AdminRole) {
  if (role === "super_admin") return "Super admin";
  if (role === "admin") return "Admin";
  if (role === "employee") return "Employee";
  return "Staff";
}

export function allowedTabsForRole(role?: AdminRole) {
  if (role === "super_admin") return ["Overview", "Members", "Orders", "Finance", "Catalog", "Staff", "Account"] as const;
  if (role === "admin") return ["Overview", "Members", "Orders", "Finance", "Catalog"] as const;
  return ["Overview", "Members", "Orders"] as const;
}
