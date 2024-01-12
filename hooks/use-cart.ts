import { create } from 'zustand';
import { toast } from 'react-hot-toast';
import { persist, createJSONStorage } from "zustand/middleware"; 

import { Product } from '@/types';
import { AlertTriangle } from 'lucide-react';

interface CartStore {
  items: Product[];
  addItem: (data: Product) => void;
  removeItem: (id: string) => void;
  removeAll: () => void;
  quantity: number;
  value: string;
  cartItems: { [productId: string]: number };
}

const useCart = create(
  persist<CartStore>((set, get) => ({
  items: [],
  addItem: (data: Product) => {
    const currentItems = get().items;
    const existingItem = currentItems.find((item) => item.id === data.id);

    if (existingItem) {
      // Increment quantity if the item already exists
      set({ items: [...get().items], cartItems: { ...get().cartItems, [data.id]: get().cartItems[data.id] + 1 } });
      return toast('Item quantity incremented.');
    }

    // Add a new item with quantity 1
    set({ items: [...get().items, data], cartItems: { ...get().cartItems, [data.id]: 1 } });
    toast.success('Item added to cart.');
  },
  cartItems:{}
  ,
  removeItem: (id: string) => {
    const updatedItems = [...get().items.filter((item) => item.id !== id)];
    const updatedCartItems = { ...get().cartItems };

    // Decrement quantity or remove the item from cartItems
    if (updatedCartItems[id] > 1) {
      updatedCartItems[id] -= 1;
    } else {
      delete updatedCartItems[id];
    }

    set({ items: updatedItems, cartItems: updatedCartItems });
    toast.success('Item removed from cart.');
  },
  quantity: 1
  ,
  value:''
  ,
  removeAll: () => set({ items: [] }),
}), {
  name: 'cart-storage',
  storage: createJSONStorage(() => localStorage)
}));

export default useCart;