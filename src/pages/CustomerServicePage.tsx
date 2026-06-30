import { HelpCircle, MessageSquare, Phone, Mail, FileText, BarChart3 } from "lucide-react";
import type { Navigate } from "../App";
import { useAppStore } from "../store/AppStore";

export default function CustomerServicePage({ navigate }: { navigate: Navigate }) {
  const { state } = useAppStore();

  const services = [
    {
      icon: <MessageSquare className="text-blue-600" size={32} />,
      title: "Live Chat",
      description: "Connect with our support team instantly",
      action: "Start Chat",
      color: "bg-blue-50 border-blue-200",
    },
    {
      icon: <Phone className="text-green-600" size={32} />,
      title: "Call Us",
      description: "Speak directly with a representative",
      action: "Call Now",
      color: "bg-green-50 border-green-200",
    },
    {
      icon: <Mail className="text-purple-600" size={32} />,
      title: "Email Support",
      description: "Send us an email and we'll respond within 24 hours",
      action: "Send Email",
      color: "bg-purple-50 border-purple-200",
    },
    {
      icon: <FileText className="text-orange-600" size={32} />,
      title: "Documentation",
      description: "Browse our help articles and FAQs",
      action: "Read More",
      color: "bg-orange-50 border-orange-200",
    },
    {
      icon: <HelpCircle className="text-red-600" size={32} />,
      title: "FAQ",
      description: "Find answers to common questions",
      action: "Browse FAQ",
      color: "bg-red-50 border-red-200",
    },
    {
      icon: <BarChart3 className="text-indigo-600" size={32} />,
      title: "My Account",
      description: "View your account information and history",
      action: "View Account",
      color: "bg-indigo-50 border-indigo-200",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-24">
      {/* Header */}
      <header className="bg-forest text-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <button
            onClick={() => navigate("/")}
            className="mb-4 text-sm font-semibold text-emerald-100 hover:text-white"
          >
            ← Back to Home
          </button>
          <h1 className="text-4xl font-black">Customer Service</h1>
          <p className="mt-2 text-emerald-100">We're here to help. Choose how you'd like to reach us.</p>
        </div>
      </header>

      {/* Services Grid */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <div
              key={index}
              className={`rounded-lg border-2 p-6 transition-all hover:shadow-lg hover:scale-105 ${service.color} cursor-pointer`}
            >
              <div className="mb-4">{service.icon}</div>
              <h3 className="mb-2 text-xl font-bold text-slate-900">{service.title}</h3>
              <p className="mb-6 text-sm text-slate-600">{service.description}</p>
              <button className="w-full rounded bg-forest px-4 py-2 font-bold text-white hover:bg-forest/90 transition">
                {service.action}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <h2 className="mb-8 text-3xl font-black">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            { q: "How do I track my order?", a: "Go to Task Order in the menu to see all your active orders and their status." },
            { q: "What payment methods do you accept?", a: "We accept bank transfers, e-wallets, and other payment methods configured in your account settings." },
            { q: "How long does delivery take?", a: "Delivery times vary. Check your order details for the estimated delivery date." },
            { q: "Can I cancel my order?", a: "You can cancel pending orders. Contact support for orders already in transit." },
            { q: "What is your refund policy?", a: "Refunds are processed within 5-7 business days of approval. Contact us for details." },
          ].map((faq, index) => (
            <details key={index} className="rounded border border-slate-200 p-4 hover:bg-slate-50">
              <summary className="cursor-pointer font-bold text-slate-900">
                {faq.q}
              </summary>
              <p className="mt-3 text-slate-600">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 bg-slate-50 rounded-lg">
        <h2 className="mb-8 text-3xl font-black text-center">Support Stats</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded bg-white p-6 text-center shadow">
            <p className="text-4xl font-black text-forest">24/7</p>
            <p className="text-sm text-slate-600 mt-2">Available Support</p>
          </div>
          <div className="rounded bg-white p-6 text-center shadow">
            <p className="text-4xl font-black text-forest">&lt;1 hour</p>
            <p className="text-sm text-slate-600 mt-2">Average Response Time</p>
          </div>
          <div className="rounded bg-white p-6 text-center shadow">
            <p className="text-4xl font-black text-forest">99%</p>
            <p className="text-sm text-slate-600 mt-2">Customer Satisfaction</p>
          </div>
        </div>
      </section>
    </main>
  );
}
