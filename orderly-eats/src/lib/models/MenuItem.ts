import mongoose, { Schema, Document } from "mongoose";

export interface IMenuItem extends Document {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  price: number;
  image: string;
  imageUrl: string;
  category: "Mains" | "Starters" | "Desserts" | "Drinks";
  rating: number;
  prepMinutes: number;
  spicy?: boolean;
  veg: boolean;
  tags: string[];
}

const MenuItemSchema = new Schema<IMenuItem>(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    longDescription: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, required: true },
    imageUrl: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ["Mains", "Starters", "Desserts", "Drinks"],
    },
    rating: { type: Number, required: true, min: 0, max: 5 },
    prepMinutes: { type: Number, required: true, min: 1 },
    spicy: { type: Boolean },
    veg: { type: Boolean, required: true },
    tags: { type: [String], default: [] },
  },
  {
    timestamps: false,
  },
);

export const MenuItemModel =
  (mongoose.models.MenuItem as mongoose.Model<IMenuItem>) ??
  mongoose.model<IMenuItem>("MenuItem", MenuItemSchema);
