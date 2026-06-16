import type { AppState } from "../types";

const storageKey = "orderops-app-state";

// Empty initial state - all data comes from Firestore
const emptyState: AppState = {
  admins: [],
  members: [],
  products: [],
  banks: [],
  transactions: [],
  orders: [],
  account: {
    username: "",
    password: "",
    withdrawalPassword: "",
  },
};

export async function loadStoredState(): Promise<AppState> {
  try {
    // Try to load from Firestore collections
    const { getAdmins } = await import("./adminsService");
    const { getMembers } = await import("./membersService");
    const { getProducts } = await import("./productsService");
    const { getBanks } = await import("./banksService");
    const { getTransactions } = await import("./transactionsService");
    const { getOrders } = await import("./ordersService");
    const { getSettings } = await import("./settingsService");

    const [admins, members, products, banks, transactions, orders, settings] = await Promise.all([
      getAdmins(),
      getMembers(),
      getProducts(),
      getBanks(),
      getTransactions(),
      getOrders(),
      getSettings(),
    ]);

    return {
      admins,
      members,
      products,
      banks,
      transactions,
      orders,
      account: settings || emptyState.account,
    };
  } catch (error) {
    console.error("Error loading from Firestore:", error);
  }

  // Fallback to localStorage
  const stored = window.localStorage.getItem(storageKey);
  if (stored) {
    return JSON.parse(stored) as AppState;
  }

  // Return empty state (database-first approach)
  return emptyState;
}

export async function saveStoredState(state: AppState) {
  // Always save to localStorage for offline support
  window.localStorage.setItem(storageKey, JSON.stringify(state));

  // Try to sync individual collections to Firestore
  try {
    // Note: For now, we're not syncing individual collection updates
    // The reducer handles collection-specific operations
    // This function is kept for backward compatibility
  } catch (error) {
    console.error("Error saving to Firestore:", error);
  }
}
