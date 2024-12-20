import { Product } from "@/sanity.types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface BasketItem {
  product: Product;
  quantity: number;
}

interface BasketState {
  items: BasketItem[];
  addItem: (product: Product, quantity: number) => void;
  removeItem: (product: Product) => void;
  clearBasket: () => void;
  getTotal: () => number;
  getItemCount: (product: Product) => number;
  getGroupedItems: () => BasketItem[];
}

const useBasketStore = create<BasketState>()(
  persist(
    (set, get) => ({
      items: [], // Initialize as an empty array
      addItem: (product, quantity) => {
        set((state) => {
          const existingItem = state.items.find((item) => item.product._id === product._id);
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.product._id === product._id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          } else {
            return {
              items: [...state.items, { product, quantity }],
            };
          }
        });
      },
      removeItem: (product) => {
        set((state) => ({
          items: state.items.reduce((acc, item) => {
            if (item.product._id === product._id) {
              if (item.quantity > 1) {
                // Reduce the quantity if greater than 1
                acc.push({ ...item, quantity: item.quantity - 1 });
              }
              // If quantity is 1, do not add it back to the array
            } else {
              acc.push(item); // Keep other items unchanged
            }
            return acc;
          }, [] as BasketItem[]),
        }));
      },
      clearBasket: () => set({ items: [] }), // Clears the basket
      getTotal: () => get().items.reduce((total, item) => total + (item.product.price ?? 0) * item.quantity, 0),
      getItemCount: (product) => {
        // Safe lookup with optional chaining
        const item = get().items.find((item) => item.product._id === product._id);
        return item ? item.quantity : 0;
      },
      getGroupedItems: () => get().items,
    }),
    {
      name: "basket-store", // Persisted store name
      },
  )
);

export default useBasketStore;
