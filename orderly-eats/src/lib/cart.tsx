import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { MENU, type MenuItem } from "./menu";

export interface CartLine {
  id: string;
  quantity: number;
}

interface CartContextValue {
  lines: CartLine[];
  add: (id: string, qty?: number) => void;
  remove: (id: string) => void;
  setQuantity: (id: string, qty: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
  detailed: { item: MenuItem; quantity: number; lineTotal: number }[];
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "tandoor-cart-v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
      if (raw) setLines(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* ignore */
    }
  }, [lines, hydrated]);

  const value = useMemo<CartContextValue>(() => {
    const detailed = lines
      .map((l) => {
        const item = MENU.find((m) => m.id === l.id);
        if (!item) return null;
        return { item, quantity: l.quantity, lineTotal: item.price * l.quantity };
      })
      .filter(Boolean) as { item: MenuItem; quantity: number; lineTotal: number }[];

    return {
      lines,
      add: (id, qty = 1) =>
        setLines((prev) => {
          const ex = prev.find((p) => p.id === id);
          if (ex) return prev.map((p) => (p.id === id ? { ...p, quantity: p.quantity + qty } : p));
          return [...prev, { id, quantity: qty }];
        }),
      remove: (id) => setLines((prev) => prev.filter((p) => p.id !== id)),
      setQuantity: (id, qty) =>
        setLines((prev) =>
          qty <= 0
            ? prev.filter((p) => p.id !== id)
            : prev.map((p) => (p.id === id ? { ...p, quantity: qty } : p)),
        ),
      clear: () => setLines([]),
      count: detailed.reduce((n, d) => n + d.quantity, 0),
      subtotal: detailed.reduce((n, d) => n + d.lineTotal, 0),
      detailed,
    };
  }, [lines]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
