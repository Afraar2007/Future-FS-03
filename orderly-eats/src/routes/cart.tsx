import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "Cart — Tandoor" }] }),
  component: CartPage,
});

function CartPage() {
  const { detailed, setQuantity, remove, subtotal, clear } = useCart();
  const delivery = subtotal > 0 ? (subtotal >= 25 ? 0 : 2.99) : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + delivery + tax;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="font-display text-4xl font-bold sm:text-5xl">Your cart</h1>

        {detailed.length === 0 ? (
          <div className="mt-12 grid place-items-center rounded-3xl border border-dashed border-border bg-card p-16 text-center">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-secondary">
              <ShoppingBag className="h-7 w-7 text-muted-foreground" />
            </div>
            <h2 className="mt-4 font-display text-2xl font-bold">It's empty in here</h2>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Add a few dishes from the menu and they'll show up right here.
            </p>
            <Link
              to="/menu"
              className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-pop hover:scale-[1.03]"
            >
              Browse menu
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
            <ul className="space-y-4">
              {detailed.map(({ item, quantity, lineTotal }) => (
                <li
                  key={item.id}
                  className="grid grid-cols-[80px_minmax(0,1fr)_auto] items-center gap-4 rounded-2xl bg-card p-3 shadow-card sm:grid-cols-[100px_minmax(0,1fr)_auto_auto] sm:p-4"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    className="h-20 w-20 shrink-0 rounded-xl object-cover sm:h-24 sm:w-24"
                  />
                  <div className="min-w-0">
                    <Link to="/food/$id" params={{ id: item.id }}>
                      <div className="truncate font-display text-lg font-semibold">{item.name}</div>
                    </Link>
                    <div className="text-sm text-muted-foreground">₹{item.price.toFixed(2)} each</div>
                    <button
                      onClick={() => remove(item.id)}
                      className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" /> Remove
                    </button>
                  </div>
                  <div className="col-start-3 row-start-1 flex items-center gap-1 rounded-full border border-border bg-background p-1 sm:col-start-auto">
                    <button
                      onClick={() => setQuantity(item.id, quantity - 1)}
                      className="grid h-8 w-8 place-items-center rounded-full hover:bg-secondary"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <div className="w-6 text-center text-sm font-semibold">{quantity}</div>
                    <button
                      onClick={() => setQuantity(item.id, quantity + 1)}
                      className="grid h-8 w-8 place-items-center rounded-full hover:bg-secondary"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="col-span-3 text-right font-display text-lg font-bold sm:col-span-1">
                    ₹{lineTotal.toFixed(2)}
                  </div>
                </li>
              ))}
            </ul>

            <aside className="h-fit rounded-3xl bg-card p-6 shadow-card lg:sticky lg:top-24">
              <h2 className="font-display text-xl font-bold">Order summary</h2>
              <dl className="mt-4 space-y-2 text-sm">
                <Row label="Subtotal" value={`₹${subtotal.toFixed(2)}`} />
                <Row
                  label="Delivery"
                  value={delivery === 0 ? "Free" : `₹${delivery.toFixed(2)}`}
                />
                <Row label="Tax" value={`₹${tax.toFixed(2)}`} />
                <div className="my-2 border-t border-border" />
                <Row label="Total" value={`₹${total.toFixed(2)}`} bold />
              </dl>
              {subtotal < 25 && (
                <p className="mt-3 rounded-lg bg-accent/40 p-3 text-xs text-accent-foreground">
                  Add ₹{(25 - subtotal).toFixed(2)} more for free delivery.
                </p>
              )}
              <Link
                to="/checkout"
                className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-pop transition-transform hover:scale-[1.02]"
              >
                Checkout
              </Link>
              <button
                onClick={() => clear()}
                className="mt-2 inline-flex w-full items-center justify-center rounded-full py-2 text-xs text-muted-foreground hover:text-destructive"
              >
                Clear cart
              </button>
            </aside>
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <dt className={bold ? "font-semibold" : "text-muted-foreground"}>{label}</dt>
      <dd className={bold ? "font-display text-lg font-bold" : "font-semibold"}>{value}</dd>
    </div>
  );
}
