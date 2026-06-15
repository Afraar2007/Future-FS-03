import { Link } from "@tanstack/react-router";
import { Plus, Star, Flame, Leaf } from "lucide-react";
import type { MenuItem } from "../lib/menu";
import { useCart } from "../lib/cart";

export function FoodCard({ item, index = 0 }: { item: MenuItem; index?: number }) {
  const { add } = useCart();
  return (
    <article
      className="group animate-float-up overflow-hidden rounded-3xl bg-card shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-pop"
      style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
    >
      <Link to="/food/$id" params={{ id: item.id }} className="block">
        <div className="relative aspect-[5/4] overflow-hidden bg-muted">
          <img
            src={item.image}
            alt={item.name}
            loading="lazy"
            width={800}
            height={640}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-background/85 px-2 py-1 text-xs font-semibold backdrop-blur">
            <Star className="h-3 w-3 fill-saffron text-saffron" />
            {item.rating.toFixed(1)}
          </div>
          <div className="absolute right-3 top-3 flex gap-1">
            {item.spicy && (
              <span className="grid h-7 w-7 place-items-center rounded-full bg-primary/90 text-primary-foreground">
                <Flame className="h-3.5 w-3.5" />
              </span>
            )}
            {item.veg && (
              <span className="grid h-7 w-7 place-items-center rounded-full bg-success/90 text-success-foreground">
                <Leaf className="h-3.5 w-3.5" />
              </span>
            )}
          </div>
        </div>
      </Link>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link to="/food/$id" params={{ id: item.id }}>
              <h3 className="truncate font-display text-xl font-semibold leading-tight">
                {item.name}
              </h3>
            </Link>
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{item.description}</p>
          </div>
          <div className="shrink-0 text-right">
            <div className="font-display text-xl font-bold text-foreground">
              ₹{item.price.toFixed(2)}
            </div>
            <div className="text-[11px] text-muted-foreground">{item.prepMinutes} min</div>
          </div>
        </div>
        <button
          onClick={() => add(item.id, 1)}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-foreground py-2.5 text-sm font-semibold text-background transition-transform hover:scale-[1.02] active:scale-95"
        >
          <Plus className="h-4 w-4" /> Add to cart
        </button>
      </div>
    </article>
  );
}
