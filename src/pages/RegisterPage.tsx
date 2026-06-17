import { Store, Send } from "lucide-react";
import { useState } from "react";
import type { Navigate } from "../App";
import { Field, inputClass } from "../components/common";
import { useAppStore } from "../store/AppStore";

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendOTPEmail(email: string, otp: string): Promise<boolean> {
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "noreply@tokopediakaririndonesia.com",
        to: email,
        subject: "Your OTP for Account Registration",
        html: `
          <h2>Verify Your Email</h2>
          <p>Your OTP code is:</p>
          <h1 style="color: #2d5016; font-size: 32px; letter-spacing: 2px;">${otp}</h1>
          <p>This code will expire in 5 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
        `,
      }),
    });
    return response.ok;
  } catch (error) {
    console.error("Error sending OTP:", error);
    return false;
  }
}

async function sendInvitationCode(email: string, invitationCode: string): Promise<boolean> {
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "noreply@tokopediakaririndonesia.com",
        to: email,
        subject: "Your Invitation Code - Tokopedia Kari Indonesia",
        html: `
          <h2>Welcome to Tokopedia Kari Indonesia</h2>
          <p>Your invitation code is:</p>
          <h1 style="color: #2d5016; font-size: 32px; letter-spacing: 2px; font-family: monospace;">${invitationCode}</h1>
          <p>Use this code during registration to connect your account to the correct admin team.</p>
          <p><strong>Keep this code safe and don't share it with anyone.</strong></p>
        `,
      }),
    });
    return response.ok;
  } catch (error) {
    console.error("Error sending invitation code:", error);
    return false;
  }
}

export default function RegisterPage({ navigate }: { navigate: Navigate }) {
  const { dispatch } = useAppStore();
  const code = new URLSearchParams(window.location.search).get("code") ?? "346192";
  const [step, setStep] = useState<"form" | "otp">("form");
  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    invitationCode: code,
    accountPassword: "",
    withdrawalPassword: "",
  });
  const [otp, setOtp] = useState("");
  const [sentOtp, setSentOtp] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendInvitationCode = async () => {
    if (!form.email.trim()) {
      setMessage("Please enter your email first");
      return;
    }

    setLoading(true);
    setMessage("Sending invitation code...");
    const sent = await sendInvitationCode(form.email, form.invitationCode);
    setLoading(false);

    if (sent) {
      setMessage("Invitation code sent to your email!");
    } else {
      setMessage("Failed to send invitation code. Please try again.");
    }
  };

  const handleSubmitForm = async (event: React.FormEvent) => {
    event.preventDefault();
    const generatedOtp = generateOTP();
    setSentOtp(generatedOtp);

    setMessage("Sending OTP to your email...");
    const sent = await sendOTPEmail(form.email, generatedOtp);

    if (sent) {
      setMessage("OTP sent! Check your email.");
      setStep("otp");
    } else {
      setMessage("Failed to send OTP. Please try again.");
    }
  };

  const handleVerifyOTP = (event: React.FormEvent) => {
    event.preventDefault();
    if (otp === sentOtp) {
      dispatch({
        type: "registerMember",
        payload: {
          username: form.username,
          email: form.email,
          phone: form.phone,
          invitationCode: form.invitationCode,
          accountPassword: form.accountPassword,
          withdrawalPassword: form.withdrawalPassword,
        },
      });
      setMessage("Account registered! Redirecting to store...");
      setTimeout(() => navigate("/"), 2000);
    } else {
      setMessage("Invalid OTP. Please try again.");
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-mint px-4 py-8 text-ink">
      <section className="w-full max-w-md rounded bg-white p-6 shadow-panel">
        <button className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-forest" onClick={() => navigate("/")}>
          <Store size={18} />
          Back to store
        </button>
        <h1 className="text-3xl font-black">Create customer account</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          {step === "form"
            ? "Register with your invitation code to connect the account to the correct admin team."
            : "Enter the OTP code sent to your email to verify your account."}
        </p>

        {step === "form" ? (
          <form className="mt-6 grid gap-3" onSubmit={handleSubmitForm}>
            <Field label="Username">
              <input
                className={inputClass}
                required
                value={form.username}
                onChange={(event) => setForm({ ...form, username: event.target.value })}
              />
            </Field>
            <Field label="Email">
              <div className="flex gap-2">
                <input
                  className={`${inputClass} flex-1`}
                  type="email"
                  required
                  value={form.email}
                  onChange={(event) => setForm({ ...form, email: event.target.value })}
                />
                <button
                  type="button"
                  onClick={handleSendInvitationCode}
                  disabled={loading}
                  className="rounded bg-forest px-3 py-2 text-white hover:bg-forest/90 disabled:bg-slate-400 flex items-center gap-1"
                  title="Send invitation code to this email"
                >
                  <Send size={16} />
                </button>
              </div>
            </Field>
            <Field label="Phone number">
              <input
                className={inputClass}
                required
                value={form.phone}
                onChange={(event) => setForm({ ...form, phone: event.target.value })}
              />
            </Field>
            <Field label="Invitation code">
              <input
                className={inputClass}
                required
                value={form.invitationCode}
                onChange={(event) => setForm({ ...form, invitationCode: event.target.value })}
              />
            </Field>
            <Field label="Password">
              <input
                className={inputClass}
                required
                type="password"
                value={form.accountPassword}
                onChange={(event) => setForm({ ...form, accountPassword: event.target.value })}
              />
            </Field>
            <Field label="Withdrawal password">
              <input
                className={inputClass}
                required
                type="password"
                value={form.withdrawalPassword}
                onChange={(event) => setForm({ ...form, withdrawalPassword: event.target.value })}
              />
            </Field>
            {message && (
              <p
                className={`rounded p-3 text-sm font-semibold ${
                  message.includes("Failed") ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"
                }`}
              >
                {message}
              </p>
            )}
            <button className="h-12 w-full rounded bg-forest font-bold text-white hover:bg-forest/90">Send OTP</button>
          </form>
        ) : (
          <form className="mt-6 grid gap-3" onSubmit={handleVerifyOTP}>
            <Field label="Enter OTP code">
              <input
                className={inputClass}
                placeholder="6-digit code"
                required
                maxLength={6}
                value={otp}
                onChange={(event) => setOtp(event.target.value.replace(/\D/g, ""))}
              />
            </Field>
            {message && (
              <p
                className={`rounded p-3 text-sm font-semibold ${
                  message.includes("Invalid") ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"
                }`}
              >
                {message}
              </p>
            )}
            <button className="h-12 w-full rounded bg-forest font-bold text-white hover:bg-forest/90">Verify OTP</button>
            <button
              type="button"
              onClick={() => {
                setStep("form");
                setOtp("");
                setMessage("");
              }}
              className="h-10 w-full rounded border-2 border-forest font-bold text-forest hover:bg-forest/10"
            >
              Back
            </button>
          </form>
        )}
      </section>
    </main>
  );
}
