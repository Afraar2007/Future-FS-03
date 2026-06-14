import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FoodCard } from "@/components/FoodCard";
import { CATEGORIES, MENU, type Category } from "@/lib/menu";

export const Route = createFileRoute("/menu")({
  head: () => ({
    meta: [
      { title: "Menu — Tandoor" },
      { name: "description", content: "Browse the full Tandoor menu — mains, starters, desserts, and drinks." },
    ],
  }),
  component: MenuPage,
});

function MenuPage() {
  const [cat, setCat] = useState<Category>("All");
  const [q, setQ] = useState("");

  const items = useMemo(() => {
    return MENU.filter((m) => (cat === "All" ? true : m.category === cat)).filter((m) =>
      q.trim() === "" ? true : m.name.toLowerCase().includes(q.toLowerCase()),
    );
  }, [cat, q]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="border-b border-border/60 bg-warm-gradient">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="font-display text-4xl font-bold sm:text-5xl">Our menu</h1>
          <p className="mt-2 max-w-xl text-muted-foreground">
            A short, tight menu — every dish earns its place.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCat(c)}
                  className={[
                    "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                    cat === c
                      ? "bg-foreground text-background"
                      : "bg-card text-foreground hover:bg-secondary",
                  ].join(" ")}
                >
                  {c}
                </button>
              ))}
            </div>
            <label className="relative w-full sm:w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search dishes…"
                className="w-full rounded-full border border-border bg-card py-2.5 pl-9 pr-4 text-sm outline-none ring-primary/30 transition-shadow focus:ring-2"
              />
            </label>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
            No dishes match your search.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((item, i) => (
              <FoodCard key={item.id} item={item} index={i} />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
