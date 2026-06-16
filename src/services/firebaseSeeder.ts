import * as adminsService from "../services/adminsService";
import * as membersService from "../services/membersService";
import * as productsService from "../services/productsService";
import * as banksService from "../services/banksService";
import * as transactionsService from "../services/transactionsService";
import * as ordersService from "../services/ordersService";
import * as settingsService from "../services/settingsService";
import { firebaseReady } from "../firebase";

/**
 * Seed Firestore with sample data
 * Call this manually when you want to populate the database with test data
 * Usage: await seedFirebase();
 */
export async function seedFirebase(): Promise<boolean> {
  if (!firebaseReady) {
    console.warn("Firebase not initialized, skipping seeding");
    return false;
  }

  try {
    console.log("Starting Firestore seed with sample data...");

    // Seed admins
    const admins = [
      { id: "a1", name: "Admin 1", code: "346192", registrations: 5, todayDeposits: 3200000, monthDeposits: 48300000, todayWithdrawals: 1250000, monthWithdrawals: 21900000 },
      { id: "a2", name: "Admin 2", code: "924894", registrations: 10, todayDeposits: 5600000, monthDeposits: 76600000, todayWithdrawals: 2100000, monthWithdrawals: 34250000 },
      { id: "a3", name: "Admin 3", code: "618076", registrations: 12, todayDeposits: 7350000, monthDeposits: 90450000, todayWithdrawals: 3900000, monthWithdrawals: 42100000 },
    ];
    for (const admin of admins) {
      await adminsService.createAdmin(admin);
    }
    console.log(`✓ Seeded ${admins.length} admins`);

    // Seed members
    const members = [
      { id: "14991", username: "raka.pratama", phone: "081375323198", invitationCode: "924894", referredBy: "Admin 2", level: "VIP" as const, balance: 0, totalOrders: 14, lastLogin: "2026-06-14 19:42" },
      { id: "14864", username: "maya.putri", phone: "08173045642", invitationCode: "346192", referredBy: "Admin 1", level: "Gold" as const, balance: 80800, totalOrders: 7, lastLogin: "2026-06-14 18:13" },
      { id: "14815", username: "dimas.store", phone: "082198765431", invitationCode: "618076", referredBy: "Admin 3", level: "Silver" as const, balance: 225000, totalOrders: 21, lastLogin: "2026-06-13 22:04" },
    ];
    for (const member of members) {
      await membersService.createMember(member);
    }
    console.log(`✓ Seeded ${members.length} members`);

    // Seed products
    const products = [
      { id: "p1", code: "OPR-5256", name: "OPPO Reno15 5G 8/256GB", price: 7699000, commission: 1539800, quantity: 42, category: "Electronics", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80" },
      { id: "p2", code: "NTR-220", name: "Nutrition Bundle 220g", price: 284000, commission: 42600, quantity: 118, category: "Health", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=600&q=80" },
      { id: "p3", code: "HME-774", name: "Smart Home Starter Kit", price: 1299000, commission: 194850, quantity: 63, category: "Home", image: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80" },
      { id: "p4", code: "FAS-118", name: "Daily Essentials Pack", price: 179000, commission: 26850, quantity: 230, category: "Lifestyle", image: "https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=600&q=80" },
    ];
    for (const product of products) {
      await productsService.createProduct(product);
    }
    console.log(`✓ Seeded ${products.length} products`);

    // Seed banks
    const banks = [
      { id: "b1", bank: "BCA", accountName: "OrderOps Indonesia", accountNumber: "8810 4455 2100", minDeposit: 100000, active: true },
      { id: "b2", bank: "Mandiri", accountName: "OrderOps Indonesia", accountNumber: "1330 9900 4432", minDeposit: 100000, active: true },
      { id: "b3", bank: "BNI", accountName: "OrderOps Indonesia", accountNumber: "7621 4040 9001", minDeposit: 250000, active: false },
    ];
    for (const bank of banks) {
      await banksService.createBank(bank);
    }
    console.log(`✓ Seeded ${banks.length} banks`);

    // Seed transactions
    const transactions = [
      { id: "t1", member: "maya.putri", admin: "Admin 1", type: "topup" as const, amount: 80800, status: "approved" as const, createdAt: "2026-06-14 08:30" },
      { id: "t2", member: "dimas.store", admin: "Admin 3", type: "withdrawal" as const, amount: 450000, status: "pending" as const, createdAt: "2026-06-14 11:18" },
      { id: "t3", member: "raka.pratama", admin: "Admin 2", type: "withdrawal" as const, amount: 1250000, status: "rejected" as const, createdAt: "2026-06-13 16:50" },
      { id: "t4", member: "nina.sales", admin: "Admin 2", type: "topup" as const, amount: 1200000, status: "pending" as const, createdAt: "2026-06-14 15:11" },
    ];
    for (const transaction of transactions) {
      await transactionsService.createTransaction(transaction);
    }
    console.log(`✓ Seeded ${transactions.length} transactions`);

    // Seed orders
    const orders = [
      { id: "o1", member: "maya.putri", productCode: "OPR-5256", productName: "OPPO Reno15 5G 8/256GB", value: 7699000, commission: 1539800, status: "assigned" as const, createdAt: "2026-06-14 10:20" },
      { id: "o2", member: "dimas.store", productCode: "NTR-220", productName: "Nutrition Bundle 220g", value: 284000, commission: 42600, status: "completed" as const, createdAt: "2026-06-14 09:05" },
      { id: "o3", member: "raka.pratama", productCode: "HME-774", productName: "Smart Home Starter Kit", value: 1299000, commission: 194850, status: "frozen" as const, createdAt: "2026-06-13 21:44" },
    ];
    for (const order of orders) {
      await ordersService.createOrder(order);
    }
    console.log(`✓ Seeded ${orders.length} orders`);

    // Seed settings
    await settingsService.updateSettings({
      username: "operations.owner",
      password: "admin123",
      withdrawalPassword: "000000",
    });
    console.log("✓ Seeded account settings");

    console.log("Firestore seeding complete!");
    return true;
  } catch (error) {
    console.error("Error seeding Firestore:", error);
    return false;
  }
}
