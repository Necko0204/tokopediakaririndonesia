const API_URL = "http://localhost:3001";

export interface PaymentResponse {
  success: boolean;
  token: string;
  redirect_url: string;
  orderId: string;
}

export interface PaymentStatusResponse {
  success: boolean;
  status: string;
  orderId: string;
  grossAmount: number;
}

export async function createPaymentTransaction(
  member: string,
  amount: number,
  type: "topup" | "withdraw",
): Promise<PaymentResponse> {
  try {
    const response = await fetch(`${API_URL}/api/payment/create-transaction`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ member, amount, type }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to create payment");
    }

    return data;
  } catch (error) {
    console.error("Payment creation error:", error);
    throw error;
  }
}

export async function checkPaymentStatus(orderId: string): Promise<PaymentStatusResponse> {
  try {
    const response = await fetch(`${API_URL}/api/payment/check-status`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderId }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to check payment status");
    }

    return data;
  } catch (error) {
    console.error("Status check error:", error);
    throw error;
  }
}

export function loadMidtransScript(): Promise<void> {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute("data-client-key", import.meta.env.VITE_MIDTRANS_CLIENT_KEY || "");
    script.onload = () => resolve();
    document.body.appendChild(script);
  });
}

export function showMidtransPayment(token: string, onClose?: () => void) {
  if (window.snap) {
    window.snap.pay(token, {
      onSuccess: (result: any) => {
        console.log("✓ Payment successful:", result);
      },
      onPending: (result: any) => {
        console.log("⏳ Payment pending:", result);
      },
      onError: (result: any) => {
        console.error("✗ Payment error:", result);
      },
      onClose: () => {
        console.log("Payment modal closed");
        onClose?.();
      },
    });
  }
}

declare global {
  interface Window {
    snap: any;
  }
}
