import mongoose, { Schema, Document } from "mongoose";

export type OrderStatus = "New" | "Cooking" | "On the way" | "Delivered";

export interface IOrderItem {
  id: string;
  name: string;
  qty: number;
  price: number;
}

export interface IOrderCustomerAddress {
  street: string;
  apt?: string;
  village: string;
  zip: string;
}

export interface IOrderCustomer {
  name: string;
  email: string;
  phone: string;
  address: IOrderCustomerAddress;
  notes?: string;
}

export interface IOrder extends Document {
  id: string;
  placedAt: number;
  items: IOrderItem[];
  total: number;
  payMethod: "card" | "wallet" | "cash";
  customer: IOrderCustomer;
  status: OrderStatus;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    qty: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const OrderCustomerAddressSchema = new Schema<IOrderCustomerAddress>(
  {
    street: { type: String, required: true },
    apt: { type: String },
    village: { type: String, required: true },
    zip: { type: String, required: true },
  },
  { _id: false }
);

const OrderCustomerSchema = new Schema<IOrderCustomer>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: OrderCustomerAddressSchema, required: true },
    notes: { type: String },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    id: { type: String, required: true, unique: true, index: true },
    placedAt: { type: Number, required: true },
    items: { type: [OrderItemSchema], required: true },
    total: { type: Number, required: true, min: 0 },
    payMethod: {
      type: String,
      required: true,
      enum: ["card", "wallet", "cash"],
    },
    customer: { type: OrderCustomerSchema, required: true },
    status: {
      type: String,
      required: true,
      enum: ["New", "Cooking", "On the way", "Delivered"],
      default: "New",
    },
  },
  {
    timestamps: false,
  }
);

export const OrderModel =
  (mongoose.models.Order as mongoose.Model<IOrder>) ??
  mongoose.model<IOrder>("Order", OrderSchema);