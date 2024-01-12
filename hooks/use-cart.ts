// @/hooks/use-cart.tsx

import { create } from 'zustand';
import { toast } from 'react-hot-toast';
// import { persist, createJSONStorage } from "zustand/middleware"; // Removed persist middleware

import { Product } from '@/types';

interface CartStore {
  items: Product[];
  addItem: (data: Product) => void;
  removeItem: (id: string) => void;
  removeAll: () => void;
  // quantity: number; // Removed for simplification
  // value: string;   // Removed for simplification
  cartItems: { [productId: string]: number };
}

const useCart = create<CartStore>((set, get) => ({
  items: [],
  cartItems: {},
  addItem: (data: Product) => {
    const currentItems = get().items;
    const existingItem = currentItems.find((item) => item.id === data.id);

    if (existingItem) {
      set({ items: [...get().items], cartItems: { ...get().cartItems, [data.id]: get().cartItems[data.id] + 1 } });
      return toast('Item quantity incremented.');
    }

    set({ items: [...get().items, data], cartItems: { ...get().cartItems, [data.id]: 1 } });
    toast.success('Item added to cart.');
  },
  removeItem: (id: string) => {
    const updatedItems = [...get().items.filter((item) => item.id !== id)];
    const updatedCartItems = { ...get().cartItems };

    if (updatedCartItems[id] > 1) {
      updatedCartItems[id] -= 1;
    } else {
      delete updatedCartItems[id];
    }

    set({ items: updatedItems, cartItems: updatedCartItems });
    toast.success('Item removed from cart.');
  },
  // quantity: 1,
  // value: '',
  removeAll: () => set({ items: [], cartItems: {} }),
}));

export default useCart;
