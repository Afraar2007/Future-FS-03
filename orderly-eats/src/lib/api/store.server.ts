import { connectToDatabase } from "../db";
import { OrderModel } from "../models/Order";

export type OrderStatus = "New" | "Cooking" | "On the way" | "Delivered";

export interface OrderItem {
  id: string;
  name: string;
  qty: number;
  price: number;
}

export interface OrderCustomer {
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    apt?: string;
    city: string;
    zip: string;
  };
  notes?: string;
}

export interface Order {
  id: string;
  placedAt: number;
  items: OrderItem[];
  total: number;
  payMethod: "card" | "wallet" | "cash";
  customer: OrderCustomer;
  status: OrderStatus;
}

const STATUSES: OrderStatus[] = ["New", "Cooking", "On the way", "Delivered"];

// In-memory fallback when MongoDB is disabled / unavailable
const orders: Order[] = [
  {
    id: "TND-8K2P9",
    placedAt: Date.now() - 18 * 60 * 1000,
    items: [
      { id: "butter-chicken", name: "Butter Chicken", qty: 1, price: 14.5 },
      { id: "mango-lassi", name: "Mango Lassi", qty: 1, price: 4.5 },
    ],
    total: 19.0,
    payMethod: "card",
    status: "New",
    customer: {
      name: "Aria Patel",
      email: "aria@example.com",
      phone: "+1 555 011 2030",
      address: { street: "22 Curry Lane", city: "Brooklyn", zip: "11201" },
    },
  },
  {
    id: "TND-3LMQR",
    placedAt: Date.now() - 48 * 60 * 1000,
    items: [
      { id: "margherita-pizza", name: "Margherita Pizza", qty: 2, price: 12.0 },
    ],
    total: 24.0,
    payMethod: "cash",
    status: "Cooking",
    customer: {
      name: "Jordan Lee",
      email: "jordan@example.com",
      phone: "+1 555 017 2041",
      address: { street: "9 Spice Road", city: "Queens", zip: "11354" },
    },
  },
  {
    id: "TND-77YZX",
    placedAt: Date.now() - 92 * 60 * 1000,
    items: [
      { id: "hyderabadi-biryani", name: "Hyderabadi Biryani", qty: 1, price: 13.0 },
      { id: "samosa-platter", name: "Samosa Platter", qty: 1, price: 6.5 },
    ],
    total: 19.5,
    payMethod: "wallet",
    status: "On the way",
    customer: {
      name: "Mira Chen",
      email: "mira@example.com",
      phone: "+1 555 012 2087",
      address: { street: "88 Garden Ave", city: "Brooklyn", zip: "11215" },
    },
  },
];

/**
 * Try to initialise the Mongoose connection.
 * Returns true if the DB is usable, false to fall back to in-memory.
 */
async function isDbReady(): Promise<boolean> {
  if (process.env.MONGODB_ENABLED !== "true") return false;
  try {
    await connectToDatabase(process.env.MONGODB_DB);
    return true;
  } catch (err) {
    return false;
  }
}

export async function getOrders() {
  if (await isDbReady()) {
    const docs = await OrderModel.find().sort({ placedAt: -1 }).lean();
    return docs as unknown as Order[];
  }
  return [...orders];
}

export async function getOrder(id: string) {
  if (await isDbReady()) {
    const doc = await OrderModel.findOne({ id }).lean();
    return (doc ?? null) as Order | null;
  }
  return orders.find((order) => order.id === id) ?? null;
}

export async function createOrder(input: {
  items: OrderItem[];
  total: number;
  payMethod: "card" | "wallet" | "cash";
  customer: OrderCustomer;
}) {
  const order: Order = {
    id: `TND-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
    placedAt: Date.now(),
    status: "New",
    ...input,
  };

  if (await isDbReady()) {
    await OrderModel.create(order);
    return order;
  }

  orders.unshift(order);
  return order;
}

export async function advanceOrder(id: string) {
  if (await isDbReady()) {
    const existing = await OrderModel.findOne({ id }).lean();
    if (!existing) return undefined;
    const current = STATUSES.indexOf(existing.status as OrderStatus);
    const next = STATUSES[Math.min(current + 1, STATUSES.length - 1)];
    await OrderModel.updateOne({ id }, { $set: { status: next } });
    return { ...existing, status: next } as Order;
  }

  const order = orders.find((o) => o.id === id);
  if (!order) return undefined;
  const current = STATUSES.indexOf(order.status);
  order.status = STATUSES[Math.min(current + 1, STATUSES.length - 1)];
  return order;
}