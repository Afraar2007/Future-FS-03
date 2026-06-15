import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Clock, Flame, Leaf, Minus, Plus, Star } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getItem, MENU } from "../lib/menu";
import { useCart } from "../lib/cart";
import { FoodCard } from "@/components/FoodCard";

export const Route = createFileRoute("/food/$id")({
  loader: ({ params }) => {
    const item = getItem(params.id);
    if (!item) throw notFound();
    return { item };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.item.name} — Tandoor` },
          { name: "description", content: loaderData.item.description },
          { property: "og:title", content: `${loaderData.item.name} — Tandoor` },
          { property: "og:description", content: loaderData.item.description },
          { property: "og:image", content: loaderData.item.image },
        ]
      : [],
  }),
  notFoundComponent: () => (
    <div className="grid min-h-screen place-items-center p-6 text-center">
      <div>
        <div className="font-display text-3xl font-bold">Dish not found</div>
        <Link to="/menu" className="mt-4 inline-block text-primary underline">
          Back to menu
        </Link>
      </div>
    </div>
  ),
  component: FoodDetail,
});

function FoodDetail() {
  const { item } = Route.useLoaderData();
  const { add } = useCart();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);

  const related = MENU.filter((m) => m.id !== item.id && m.category === item.category).slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          to="/menu"
          className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to menu
        </Link>

        <div className="mt-6 grid gap-10 md:grid-cols-2">
          <div className="relative">
            <div className="absolute -inset-6 -z-10 rounded-[3rem] bg-primary/15 blur-3xl" />
            <div className="overflow-hidden rounded-[2rem] shadow-pop ring-1 ring-border">
              <img
                src={item.image}
                alt={item.name}
                width={800}
                height={800}
                className="aspect-square h-full w-full object-cover"
              />
            </div>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold">
                {item.category}
              </span>
              {item.veg && (
                <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
                  <Leaf className="h-3 w-3" /> Veg
                </span>
              )}
              {item.spicy && (
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  <Flame className="h-3 w-3" /> Spicy
                </span>
              )}
            </div>

            <h1 className="mt-4 font-display text-4xl font-bold sm:text-5xl">{item.name}</h1>

            <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Star className="h-4 w-4 fill-saffron text-saffron" />
                <span className="font-semibold text-foreground">{item.rating.toFixed(1)}</span> ·
                2.1k ratings
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-4 w-4" /> {item.prepMinutes} min
              </span>
            </div>

            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              {item.longDescription}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {item.tags.map((t: string) => (
                <span
                  key={t}
                  className="rounded-full border border-border bg-card px-3 py-1 text-xs"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="mt-8 flex items-end justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Price</div>
                <div className="font-display text-4xl font-bold">
                  ₹{(item.price * qty).toFixed(2)}
                </div>
              </div>
              <div className="flex items-center gap-1 rounded-full border border-border bg-card p-1">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="grid h-9 w-9 place-items-center rounded-full hover:bg-secondary"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <div className="w-8 text-center font-semibold">{qty}</div>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="grid h-9 w-9 place-items-center rounded-full hover:bg-secondary"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button
                onClick={() => add(item.id, qty)}
                className="rounded-full border border-border bg-card py-3.5 text-sm font-semibold hover:bg-secondary"
              >
                Add to cart
              </button>
              <button
                onClick={() => {
                  add(item.id, qty);
                  navigate({ to: "/checkout" });
                }}
                className="rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-pop transition-transform hover:scale-[1.02]"
              >
                Order now
              </button>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-20">
            <h2 className="font-display text-2xl font-bold sm:text-3xl">You might also like</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r, i) => (
                <FoodCard key={r.id} item={r} index={i} />
              ))}
            </div>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
