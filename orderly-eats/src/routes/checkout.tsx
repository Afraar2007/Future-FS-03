import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { CreditCard, Wallet, Banknote } from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { placeOrder } from "@/lib/api/order.functions";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — Tandoor" }] }),
  component: CheckoutPage,
});

type Pay = "card" | "wallet" | "cash";

function CheckoutPage() {
  const { detailed, subtotal, clear } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [pay, setPay] = useState<Pay>("card");
  const [submitting, setSubmitting] = useState(false);

  const delivery = subtotal >= 25 ? 0 : 2.99;
  const tax = subtotal * 0.08;
  const total = subtotal + delivery + tax;

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    const form = new FormData(e.currentTarget);
    const customer = {
      name: form.get("name")?.toString().trim() ?? "",
      email: form.get("email")?.toString().trim() ?? "",
      phone: form.get("phone")?.toString().trim() ?? "",
      address: {
        street: form.get("street")?.toString().trim() ?? "",
        apt: form.get("apt")?.toString().trim() ?? undefined,
        city: form.get("city")?.toString().trim() ?? "",
        zip: form.get("zip")?.toString().trim() ?? "",
      },
      notes: form.get("notes")?.toString().trim() || undefined,
    };

    try {
      // Try to place order via the server (persists to MongoDB)
      const order = await placeOrder({
        data: {
          items: detailed.map((d) => ({
            id: d.item.id,
            name: d.item.name,
            qty: d.quantity,
            price: d.item.price,
          })),
          total,
          payMethod: pay,
          customer,
        },
      });

      window.localStorage.setItem("tandoor-last-order", JSON.stringify(order));
      clear();
      navigate({ to: "/track", search: { id: order.id } });
    } catch (error) {
      console.error(error);
      // Fallback: save order locally if server call fails
      const localOrder = {
        id: `TND-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
        placedAt: Date.now(),
        items: detailed.map((d) => ({
          id: d.item.id,
          name: d.item.name,
          qty: d.quantity,
          price: d.item.price,
        })),
        total,
        status: "New" as const,
      };
      window.localStorage.setItem("tandoor-last-order", JSON.stringify(localOrder));
      clear();
      navigate({ to: "/track", search: { id: localOrder.id } });
    } finally {
      setSubmitting(false);
    }
  };

  if (detailed.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="mx-auto max-w-3xl px-4 py-20 text-center">
          <h1 className="font-display text-3xl font-bold">Nothing to checkout yet</h1>
          <Link
            to="/menu"
            className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-pop"
          >
            Browse menu
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="font-display text-4xl font-bold sm:text-5xl">Checkout</h1>

        <form onSubmit={onSubmit} className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="space-y-6">
            <Card title="Contact">
              <Grid>
                <Field label="Full name" defaultValue={user?.name ?? ""} required name="name" />
                <Field label="Email" type="email" defaultValue={user?.email ?? ""} required name="email" />
                <Field label="Phone" type="tel" required name="phone" placeholder="+1 555 010 2042" />
              </Grid>
            </Card>

            <Card title="Delivery address">
              <Grid>
                <Field label="Street address" required name="street" placeholder="42 Saffron Lane" />
                <Field label="Apt / Suite" name="apt" />
                <Field label="City" required name="city" placeholder="Brooklyn" />
                <Field label="ZIP" required name="zip" placeholder="11201" />
              </Grid>
              <Field
                label="Delivery notes (optional)"
                name="notes"
                textarea
                placeholder="Leave at door, ring twice…"
              />
            </Card>

            <Card title="Payment">
              <div className="grid gap-3 sm:grid-cols-3">
                <PayOption active={pay === "card"} onClick={() => setPay("card")} icon={<CreditCard className="h-4 w-4" />} label="Card" />
                <PayOption active={pay === "wallet"} onClick={() => setPay("wallet")} icon={<Wallet className="h-4 w-4" />} label="Wallet" />
                <PayOption active={pay === "cash"} onClick={() => setPay("cash")} icon={<Banknote className="h-4 w-4" />} label="Cash" />
              </div>
              {pay === "card" && (
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <Field label="Card number" name="card" placeholder="4242 4242 4242 4242" />
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Expiry" name="exp" placeholder="MM/YY" />
                    <Field label="CVC" name="cvc" placeholder="123" />
                  </div>
                </div>
              )}
            </Card>
          </div>

          <aside className="h-fit rounded-3xl bg-card p-6 shadow-card lg:sticky lg:top-24">
            <h2 className="font-display text-xl font-bold">Order summary</h2>
            <ul className="mt-4 space-y-3 text-sm">
              {detailed.map(({ item, quantity, lineTotal }) => (
                <li key={item.id} className="flex items-center gap-3">
                  <img src={item.image} alt={item.name} className="h-12 w-12 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium">{item.name}</div>
                    <div className="text-xs text-muted-foreground">× {quantity}</div>
                  </div>
                  <div className="font-semibold">₹{lineTotal.toFixed(2)}</div>
                </li>
              ))}
            </ul>
            <div className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
              <Row label="Subtotal" value={`₹${subtotal.toFixed(2)}`} />
              <Row label="Delivery" value={delivery === 0 ? "Free" : `₹${delivery.toFixed(2)}`} />
              <Row label="Tax" value={`₹${tax.toFixed(2)}`} />
              <div className="my-2 border-t border-border" />
              <Row label="Total" value={`₹${total.toFixed(2)}`} bold />
            </div>
            <button
              disabled={submitting}
              className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-pop transition-transform hover:scale-[1.02] disabled:opacity-60"
            >
              {submitting ? "Placing order…" : `Place order · ₹${total.toFixed(2)}`}
            </button>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              By placing your order you agree to our terms.
            </p>
          </aside>
        </form>
      </section>
      <Footer />
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl bg-card p-6 shadow-card">
      <h2 className="font-display text-xl font-bold">{title}</h2>
      <div className="mt-4 space-y-4">{children}</div>
    </div>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>;
}

function Field({
  label,
  textarea,
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; textarea?: boolean }) {
  return (
    <label className="block sm:col-span-1">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      {textarea ? (
        <textarea
          {...(rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          rows={3}
          className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none ring-primary/30 transition-shadow focus:ring-2"
        />
      ) : (
        <input
          {...rest}
          className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none ring-primary/30 transition-shadow focus:ring-2"
        />
      )}
    </label>
  );
}

function PayOption({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold transition-colors",
        active
          ? "border-primary bg-primary/10 text-primary"
          : "border-border bg-background text-foreground hover:bg-secondary",
      ].join(" ")}
    >
      {icon}
      {label}
    </button>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={bold ? "font-semibold" : "text-muted-foreground"}>{label}</span>
      <span className={bold ? "font-display text-lg font-bold" : "font-semibold"}>{value}</span>
    </div>
  );
}