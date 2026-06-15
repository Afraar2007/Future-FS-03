import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check, ChefHat, Bike, PartyPopper } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { z } from "zod";
import { getOrderById } from "../lib/api/order.functions";

const search = z.object({ id: z.string().optional() });

export const Route = createFileRoute("/track")({
  validateSearch: search,
  head: () => ({ meta: [{ title: "Track order — Tandoor" }] }),
  component: TrackPage,
});

interface Order {
  id: string;
  placedAt: number;
  items: { name: string; qty: number; price: number }[];
  total: number;
  status: "New" | "Cooking" | "On the way" | "Delivered";
}

const STAGES = [
  { key: "new", label: "Order confirmed", icon: Check, sub: "We received your order" },
  { key: "cooking", label: "In the kitchen", icon: ChefHat, sub: "Chefs are cooking fresh" },
  { key: "on-the-way", label: "On the way", icon: Bike, sub: "Your rider is heading over" },
  { key: "delivered", label: "Delivered", icon: PartyPopper, sub: "Enjoy your meal!" },
] as const;

function TrackPage() {
  const { id } = Route.useSearch();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [stage, setStage] = useState(0);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const load = async () => {
      let loaded: Order | null = null;
      if (id) {
        try {
          loaded = await getOrderById({ data: { id } });
        } catch {
          loaded = null;
        }
      }

      if (!loaded) {
        try {
          const raw = window.localStorage.getItem("tandoor-last-order");
          if (raw) {
            const o = JSON.parse(raw) as Partial<Order>;
            if (o.id && (!id || o.id === id)) {
              loaded = {
                id: o.id,
                placedAt: o.placedAt ?? Date.now(),
                items: o.items ?? [],
                total: o.total ?? 0,
                status: typeof o.status === "string" ? o.status : "New",
              };
            }
          }
        } catch {
          /* ignore */
        }
      }

      if (isMounted) {
        setOrder(loaded);
        setLoading(false);
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, [id]);

  useEffect(() => {
    if (!order) return;
    const initialStage = STAGES.findIndex(
      (s) => s.key === order.status.toLowerCase().replace(/ /g, "-"),
    );
    setStage(initialStage >= 0 ? initialStage : 0);
    const t = setInterval(() => {
      setStage((s) => Math.min(STAGES.length - 1, s + 1));
    }, 3500);
    return () => clearInterval(t);
  }, [order]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {!order ? (
          <div className="rounded-3xl border border-dashed border-border bg-card p-12 text-center">
            <h1 className="font-display text-3xl font-bold">No active order</h1>
            <p className="mt-2 text-muted-foreground">
              Place an order and we'll track it live here.
            </p>
            <Link
              to="/menu"
              className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-pop"
            >
              Browse menu
            </Link>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <div className="text-sm uppercase tracking-widest text-primary">Order</div>
                <h1 className="font-display text-4xl font-bold sm:text-5xl">{order.id}</h1>
              </div>
              <div className="text-right">
                <div className="text-xs text-muted-foreground">Estimated arrival</div>
                <div className="font-display text-2xl font-bold">
                  {new Date(order.placedAt + 30 * 60 * 1000).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>

            <ol className="mt-10 space-y-4">
              {STAGES.map((s, i) => {
                const done = i < stage;
                const active = i === stage;
                const Icon = s.icon;
                return (
                  <li
                    key={s.key}
                    className={[
                      "flex items-start gap-4 rounded-2xl border bg-card p-5 transition-all",
                      done
                        ? "border-success/30"
                        : active
                          ? "border-primary shadow-pop"
                          : "border-border opacity-60",
                    ].join(" ")}
                  >
                    <div
                      className={[
                        "relative grid h-11 w-11 shrink-0 place-items-center rounded-full",
                        done
                          ? "bg-success text-success-foreground"
                          : active
                            ? "bg-primary text-primary-foreground animate-pulse-ring"
                            : "bg-secondary text-muted-foreground",
                      ].join(" ")}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-semibold">{s.label}</div>
                      <div className="text-sm text-muted-foreground">{s.sub}</div>
                    </div>
                  </li>
                );
              })}
            </ol>

            <div className="mt-10 rounded-3xl bg-card p-6 shadow-card">
              <h2 className="font-display text-xl font-bold">Receipt</h2>
              <ul className="mt-4 space-y-2 text-sm">
                {order.items.map((it, i) => (
                  <li key={i} className="flex justify-between">
                    <span>
                      {it.name} <span className="text-muted-foreground">× {it.qty}</span>
                    </span>
                    <span className="font-semibold">₹{(it.price * it.qty).toFixed(2)}</span>
                  </li>
                ))}
                <li className="mt-2 flex justify-between border-t border-border pt-2 font-display text-lg font-bold">
                  <span>Total</span>
                  <span>₹{order.total.toFixed(2)}</span>
                </li>
              </ul>
            </div>
          </>
        )}
      </section>
      <Footer />
    </div>
  );
}
