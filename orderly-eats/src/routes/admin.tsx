import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { DollarSign, ShoppingBag, TrendingUp, Users, Search, MoreHorizontal } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/lib/auth";
import { MENU } from "@/lib/menu";
import { advanceOrderStatus, getOrders } from "@/lib/api/order.functions";
import type { Order } from "@/lib/api/store.server";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Tandoor" }] }),
  component: AdminPage,
});

type OrderStatus = "New" | "Cooking" | "On the way" | "Delivered";

interface DisplayOrder {
  id: string;
  customer: string;
  items: number;
  total: number;
  status: OrderStatus;
}

const STATUSES: OrderStatus[] = ["New", "Cooking", "On the way", "Delivered"];

const MOCK_ORDERS: DisplayOrder[] = [
  { id: "TND-8K2P9", customer: "Aria Patel", items: 3, total: 42.5, status: "New" },
  { id: "TND-3LMQR", customer: "Jordan Lee", items: 2, total: 27.0, status: "Cooking" },
  { id: "TND-77YZX", customer: "Mira Chen", items: 5, total: 78.4, status: "On the way" },
  { id: "TND-09BHA", customer: "Sam Rivera", items: 1, total: 13.5, status: "Cooking" },
  { id: "TND-44DKE", customer: "Noor Hassan", items: 4, total: 56.2, status: "Delivered" },
  { id: "TND-55VFG", customer: "Ben Carter", items: 2, total: 22.0, status: "Delivered" },
];

function toDisplay(order: Order): DisplayOrder {
  return {
    id: order.id,
    customer: order.customer.name,
    items: order.items.length,
    total: order.total,
    status: order.status,
  };
}

function AdminPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<DisplayOrder[]>(MOCK_ORDERS);
  const [query, setQuery] = useState("");

  const fetchOrders = async () => {
    try {
      const backendOrders = await getOrders();
      setOrders(backendOrders.map(toDisplay));
    } catch {
      setOrders(MOCK_ORDERS);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const stats = useMemo(() => {
    const today = orders.reduce((s, o) => s + o.total, 0);
    return {
      revenue: today,
      orders: orders.length,
      active: orders.filter((o) => o.status !== "Delivered").length,
      avg: orders.length ? today / orders.length : 0,
    };
  }, [orders]);

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="mx-auto max-w-3xl px-4 py-24 text-center">
          <h1 className="font-display text-4xl font-bold">Admin access required</h1>
          <p className="mt-3 text-muted-foreground">
            Sign in with an admin account (any email containing
            <code className="mx-1 rounded bg-secondary px-1.5 py-0.5 text-sm">admin</code>) to view this dashboard.
          </p>
          <Link
            to="/auth"
            className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-pop"
          >
            Go to sign in
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const filtered = orders.filter((o) => {
    return o.id.toLowerCase().includes(query.toLowerCase()) || o.customer.toLowerCase().includes(query.toLowerCase());
  });

  const advance = async (id: string) => {
    try {
      const order = await advanceOrderStatus({ data: { id } });
      if (order) {
        setOrders((prev) =>
          prev.map((o) => (o.id === id ? toDisplay(order) : o)),
        );
      }
    } catch {
      setOrders((prev) =>
        prev.map((o) => {
          if (o.id !== id) return o;
          const i = STATUSES.indexOf(o.status);
          return { ...o, status: STATUSES[Math.min(i + 1, STATUSES.length - 1)] };
        }),
      );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="text-sm uppercase tracking-widest text-primary">Dashboard</div>
            <h1 className="font-display text-4xl font-bold sm:text-5xl">Good day, {user.name.split(" ")[0]}</h1>
          </div>
          <div className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString(undefined, {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Kpi icon={<DollarSign className="h-4 w-4" />} label="Revenue today" value={`₹${stats.revenue.toFixed(2)}`} delta="+12%" />
          <Kpi icon={<ShoppingBag className="h-4 w-4" />} label="Orders today" value={String(stats.orders)} delta="+4" />
          <Kpi icon={<TrendingUp className="h-4 w-4" />} label="Avg. ticket" value={`₹${stats.avg.toFixed(2)}`} delta="+₹2.10" />
          <Kpi icon={<Users className="h-4 w-4" />} label="Active orders" value={String(stats.active)} delta="live" />
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* Orders */}
          <div className="rounded-3xl bg-card shadow-card">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border p-5 sm:flex sm:justify-between">
              <h2 className="font-display text-xl font-bold">Live orders</h2>
              <label className="relative w-full max-w-xs">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  placeholder="Search orders…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full rounded-full border border-border bg-background py-2 pl-9 pr-3 text-sm outline-none ring-primary/30 focus:ring-2"
                />
              </label>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-5 py-3">Order</th>
                    <th className="px-5 py-3">Customer</th>
                    <th className="px-5 py-3">Items</th>
                    <th className="px-5 py-3">Total</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((o) => (
                    <tr key={o.id} className="border-t border-border/60 hover:bg-secondary/40">
                      <td className="px-5 py-3 font-mono text-xs">{o.id}</td>
                      <td className="px-5 py-3 font-medium">{o.customer}</td>
                      <td className="px-5 py-3 text-muted-foreground">{o.items}</td>
                      <td className="px-5 py-3 font-semibold">₹{o.total.toFixed(2)}</td>
                      <td className="px-5 py-3"><StatusPill status={o.status} /></td>
                      <td className="px-5 py-3 text-right">
                        <button
                          onClick={() => advance(o.id)}
                          disabled={o.status === "Delivered"}
                          className="rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold hover:bg-secondary disabled:opacity-50"
                        >
                          {o.status === "Delivered" ? "Done" : "Advance →"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top items */}
          <div className="rounded-3xl bg-card p-6 shadow-card">
            <h2 className="font-display text-xl font-bold">Top dishes</h2>
            <ul className="mt-4 space-y-3">
              {MENU.slice(0, 5).map((m, i) => (
                <li key={m.id} className="flex items-center gap-3">
                  <img src={m.image} alt={m.name} className="h-12 w-12 rounded-xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium">{m.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {120 - i * 14} sold · ₹{(m.price * (120 - i * 14)).toFixed(0)}
                    </div>
                  </div>
                  <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

function Kpi({
  icon,
  label,
  value,
  delta,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  delta: string;
}) {
  return (
    <div className="rounded-2xl bg-card p-5 shadow-card">
      <div className="flex items-center justify-between text-muted-foreground">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-secondary text-foreground">
          {icon}
        </span>
        <span className="text-xs font-semibold text-success">{delta}</span>
      </div>
      <div className="mt-3 text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 font-display text-2xl font-bold">{value}</div>
    </div>
  );
}

function StatusPill({ status }: { status: OrderStatus }) {
  const map: Record<OrderStatus, string> = {
    New: "bg-primary/10 text-primary",
    Cooking: "bg-saffron/20 text-foreground",
    "On the way": "bg-accent/60 text-accent-foreground",
    Delivered: "bg-success/15 text-success",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${map[status]}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" /> {status}
    </span>
  );
}