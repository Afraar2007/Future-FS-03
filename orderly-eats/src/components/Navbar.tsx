import { Link, useRouterState } from "@tanstack/react-router";
import { ShoppingBag, UtensilsCrossed, User, Menu as MenuIcon, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "../lib/cart";
import { useAuth } from "@/lib/auth";

const links: { to: string; label: string }[] = [
  { to: "/", label: "Home" },
  { to: "/menu", label: "Menu" },
  { to: "/track", label: "Track Order" },
];

export function Navbar() {
  const { count } = useCart();
  const { user } = useAuth();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 group" onClick={() => setOpen(false)}>
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-pop transition-transform group-hover:rotate-[-6deg]">
            <UtensilsCrossed className="h-4 w-4" />
          </span>
          <span className="font-display text-2xl font-bold tracking-tight">
            Tandoor<span className="text-primary">.</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => {
            const active = path === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={[
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
                ].join(" ")}
              >
                {l.label}
              </Link>
            );
          })}
          {user?.role === "admin" && (
            <Link
              to="/admin"
              className={[
                "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                path === "/admin"
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
              ].join(" ")}
            >
              Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/auth"
            className="hidden items-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary md:inline-flex"
          >
            <User className="h-4 w-4" />
            {user ? user.name.split(" ")[0] : "Sign in"}
          </Link>

          <Link
            to="/cart"
            className="relative inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-pop transition-transform hover:scale-[1.03]"
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden sm:inline">Cart</span>
            {count > 0 && (
              <span className="grid min-w-5 place-items-center rounded-full bg-background px-1.5 text-[11px] font-bold text-primary">
                {count}
              </span>
            )}
          </Link>

          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle navigation"
          >
            {open ? <X className="h-4 w-4" /> : <MenuIcon className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border/60 bg-background md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-4 py-3">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-sm font-medium hover:bg-secondary"
              >
                {l.label}
              </Link>
            ))}
            {user?.role === "admin" && (
              <Link
                to="/admin"
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-sm font-medium hover:bg-secondary"
              >
                Admin
              </Link>
            )}
            <Link
              to="/auth"
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-3 text-sm font-medium hover:bg-secondary"
            >
              {user ? `Signed in: ${user.name}` : "Sign in"}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
