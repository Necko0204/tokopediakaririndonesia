export type UserLevel = "Starter" | "Silver" | "Gold" | "VIP";
export type TransactionStatus = "pending" | "approved" | "rejected";

export interface StaffAdmin {
  id: string;
  name: string;
  code: string;
  registrations: number;
  todayDeposits: number;
  monthDeposits: number;
  todayWithdrawals: number;
  monthWithdrawals: number;
}

export interface Member {
  id: string;
  username: string;
  email: string;
  phone: string;
  invitationCode: string;
  referredBy: string;
  level: UserLevel;
  balance: number;
  totalOrders: number;
  lastLogin: string;
  accountPassword?: string;
  withdrawalPassword?: string;
}

export interface Product {
  id: string;
  code: string;
  name: string;
  price: number;
  commission: number;
  quantity: number;
  category: string;
  image: string;
}

export interface BankPlacement {
  id: string;
  bank: string;
  accountName: string;
  accountNumber: string;
  minDeposit: number;
  active: boolean;
}

export interface Transaction {
  id: string;
  member: string;
  admin: string;
  type: "topup" | "withdrawal";
  amount: number;
  status: TransactionStatus;
  createdAt: string;
}

export interface Order {
  id: string;
  member: string;
  productCode: string;
  productName: string;
  value: number;
  commission: number;
  status: "assigned" | "completed" | "frozen";
  createdAt: string;
}

export interface AppState {
  admins: StaffAdmin[];
  members: Member[];
  products: Product[];
  banks: BankPlacement[];
  transactions: Transaction[];
  orders: Order[];
  account: {
    username: string;
    password: string;
    withdrawalPassword: string;
  };
}
