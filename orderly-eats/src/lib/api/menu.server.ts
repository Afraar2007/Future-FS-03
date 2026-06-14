export type Category = "Mains" | "Starters" | "Desserts" | "Drinks";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  price: number;
  category: Category;
  rating: number;
  prepMinutes: number;
  spicy?: boolean;
  veg: boolean;
  tags: string[];
}

const MENU: MenuItem[] = [
  {
    id: "samosa",
    name: "Samosa",
    description: "Crispy triangular pastry filled with spiced potatoes and peas.",
    longDescription: "Four hand-folded samosas with a flaky shell and fragrant potato-pea filling, served with mint-coriander chutney.",
    price: 10,
    category: "Starters",
    rating: 4.6,
    prepMinutes: 12,
    veg: true,
    tags: ["Crispy", "Street food"],
  },
  {
    id: "boratta",
    name: "Boratta",
    description: "Creamy burrata-style cheese with house bread.",
    longDescription: "A soft, creamy cheese served with grilled bread, olive oil and sea salt — a delicate, shareable starter.",
    price: 15,
    category: "Starters",
    rating: 4.5,
    prepMinutes: 8,
    veg: true,
    tags: ["Cheese", "Shareable"],
  },
  {
    id: "kuthu-boratta",
    name: "Kuthu Boratta",
    description: "Smoky spiced boratta twist.",
    longDescription: "A house-spiced, slightly smoky take on boratta served with roasted spices and warm flatbread.",
    price: 130,
    category: "Starters",
    rating: 4.4,
    prepMinutes: 10,
    veg: true,
    tags: ["Smoky", "Fusion"],
  },
  {
    id: "ombelet",
    name: "Ombelet",
    description: "Savory omelette with herbs and chilies.",
    longDescription: "Fluffy omelette loaded with fresh herbs, green chilies and a dash of pepper — a comforting, savory bite.",
    price: 20,
    category: "Mains",
    rating: 4.2,
    prepMinutes: 10,
    veg: false,
    tags: ["Comfort", "Breakfast"],
  },
  {
    id: "kala-vadai",
    name: "Kala Vadai",
    description: "Crisp lentil fritters with curry leaves.",
    longDescription: "Deep-fried medu vadai-style fritters made from black gram with curry leaves and spices. Crunchy outside, soft inside.",
    price: 10,
    category: "Starters",
    rating: 4.3,
    prepMinutes: 12,
    veg: true,
    tags: ["Crispy", "South Indian"],
  },
  {
    id: "methu-vadai",
    name: "Methu Vadai",
    description: "Fenugreek-spiced vadai, aromatic and crisp.",
    longDescription: "Vadai tempered with methi (fenugreek) and spices for an aromatic fritter perfect with chutney.",
    price: 10,
    category: "Starters",
    rating: 4.4,
    prepMinutes: 12,
    veg: true,
    tags: ["Tempered", "South Indian"],
  },
  {
    id: "nice-dosa",
    name: "Nice Dosa",
    description: "Crispy dosa with spiced potato filling.",
    longDescription: "Golden, crisp fermented dosa filled with spiced potato masala. Served with sambar and chutneys.",
    price: 35,
    category: "Mains",
    rating: 4.7,
    prepMinutes: 15,
    veg: true,
    tags: ["South Indian", "Crispy"],
  },
  {
    id: "sweet-bonda",
    name: "Sweet Bonda",
    description: "Sweet fried dumplings with jaggery and coconut.",
    longDescription: "Lightly sweetened bonda made with jaggery and coconut, deep-fried until golden — a traditional sweet treat.",
    price: 10,
    category: "Desserts",
    rating: 4.5,
    prepMinutes: 10,
    veg: true,
    tags: ["Sweet", "Traditional"],
  },
];

export function getMenu() {
  return [...MENU];
}

export function getMenuItem(id: string) {
  return MENU.find((item) => item.id === id);
}
