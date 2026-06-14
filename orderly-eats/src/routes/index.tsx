import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Clock, Truck, Sparkles, Star } from "lucide-react";
import hero from "@/assets/hero-feast.jpg";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FoodCard } from "@/components/FoodCard";
import { MENU } from "@/lib/menu";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tandoor — Modern food, delivered hot" },
      {
        name: "description",
        content:
          "Order signature butter chicken, biryani, wood-fired pizza and more from Tandoor. Delivered in 30 minutes.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const popular = MENU.slice(0, 4);
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-warm-gradient" aria-hidden />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 pt-12 pb-20 sm:px-6 md:grid-cols-2 md:items-center md:pt-20 md:pb-28 lg:px-8">
          <div className="animate-float-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-primary" /> New menu, dropped this week
            </span>
            <h1 className="mt-5 font-display text-5xl font-bold leading-[1.02] tracking-tight sm:text-6xl md:text-7xl">
              Slow-cooked classics,
              <span className="text-gradient-warm"> delivered hot.</span>
            </h1>
            <p className="mt-5 max-w-md text-lg text-muted-foreground">
              From dum biryani to wood-fired pizza — order your comfort food in two taps and track
              it from kitchen to door.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/menu"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-pop transition-transform hover:scale-[1.04]"
              >
                Browse the menu <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/track"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
              >
                Track an order
              </Link>
            </div>

            <dl className="mt-10 grid grid-cols-3 gap-6 text-sm">
              <Stat icon={<Clock className="h-4 w-4" />} value="28 min" label="Avg. delivery" />
              <Stat icon={<Star className="h-4 w-4 fill-current" />} value="4.8 / 5" label="12k ratings" />
              <Stat icon={<Truck className="h-4 w-4" />} value="Free" label="over ₹25" />
            </dl>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 -z-10 rounded-[3rem] bg-primary/20 blur-3xl" />
            <div className="overflow-hidden rounded-[2rem] shadow-pop ring-1 ring-border">
              <img
                src={hero}
                alt="A warm overhead spread of biryani, butter chicken, naan, samosas and lassi on a terracotta surface"
                width={1600}
                height={1200}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 left-6 hidden rounded-2xl bg-card p-4 shadow-pop ring-1 ring-border sm:block">
              <div className="text-xs text-muted-foreground">Tonight's special</div>
              <div className="font-display text-lg font-bold">Hyderabadi Biryani</div>
              <div className="text-sm text-primary">20% off · ends 10pm</div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-sm font-semibold uppercase tracking-widest text-primary">
              Crowd favourites
            </div>
            <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Popular this week</h2>
          </div>
          <Link
            to="/menu"
            className="hidden text-sm font-semibold text-foreground hover:text-primary sm:inline-flex"
          >
            See full menu →
          </Link>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {popular.map((item, i) => (
            <FoodCard key={item.id} item={item} index={i} />
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] bg-foreground px-6 py-14 text-background sm:px-12">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">From our kitchen to your door</h2>
          <p className="mt-2 max-w-xl text-background/70">
            Real chefs. Real ingredients. A frictionless order experience.
          </p>
          <ol className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              { n: "01", t: "Pick your dish", d: "Browse a tightly curated menu of signatures and weekly specials." },
              { n: "02", t: "Checkout in seconds", d: "Saved address, saved card, one-tap reorder of past favourites." },
              { n: "03", t: "Track live", d: "Watch your order from wok to wheel — no refresh needed." },
            ].map((s) => (
              <li key={s.n} className="rounded-2xl border border-background/10 bg-background/5 p-6">
                <div className="font-display text-3xl font-bold text-saffron">{s.n}</div>
                <div className="mt-2 font-semibold">{s.t}</div>
                <div className="mt-1 text-sm text-background/70">{s.d}</div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div>
      <dt className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted-foreground">
        <span className="text-primary">{icon}</span>
        {label}
      </dt>
      <dd className="mt-1 font-display text-2xl font-bold">{value}</dd>
    </div>
  );
}
