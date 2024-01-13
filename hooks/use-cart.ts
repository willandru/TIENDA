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
  incrementQuantity: (id: string) => void;
  decrementQuantity: (id: string) => void;
  onChevronUp: (data: Product) => void;
  onChevronDown: (id: string) => void;
}

const useCart = create<CartStore>((set, get) => ({
  items: [],
  cartItems: {},
  incrementQuantity: (id: string) => {
    set((state) => {
      const updatedCartItems = { ...state.cartItems };
      updatedCartItems[id] = (updatedCartItems[id] || 0) + 1;
      return { cartItems: updatedCartItems };
    });
  },
  decrementQuantity: (id: string) => {
    set((state) => {
      const updatedCartItems = { ...state.cartItems };
      if (updatedCartItems[id] > 1) {
        updatedCartItems[id] -= 1;
      } else {
        delete updatedCartItems[id];
      }
      return { cartItems: updatedCartItems };
    });
  },
  addItem: (data: Product) => {
    const currentItems = get().items;
    const existingItem = currentItems.find((item) => item.id === data.id);
    
    if (existingItem) {
      return toast('Item already in cart.');
    }

  
    set({ items: [...get().items, data], cartItems: { ...get().cartItems, [data.id]: 1 } });
    toast.success('Item added to cart.');
  },
  onChevronUp: (data: Product) => {
    set((state) => {
      const updatedCartItems = { ...state.cartItems };
      updatedCartItems[data.id] = (updatedCartItems[data.id] || 0) + 1;
      return { cartItems: updatedCartItems };
    });
    
  }
  ,
  onChevronDown:(id: string) => {
    const updatedItems = [...get().items.filter((item) => item.id !== id)];
    const updatedCartItems = { ...get().cartItems };

    console.log("DOWN :",updatedCartItems);
    console.log("DOWN-ID :", id);
    
    if (updatedCartItems[id] > 1) {
      updatedCartItems[id] -= 1;
    } 

    set({ items: updatedItems, cartItems: updatedCartItems });
    
  }
  ,
  removeItem: (id: string) => {
    const updatedItems = [...get().items.filter((item) => item.id !== id)];
    const updatedCartItems = { ...get().cartItems };

    if (updatedCartItems[id] > 1) {
      updatedCartItems[id] -= 1;
    } else {
      delete updatedCartItems[id];
    }

    set({ items: updatedItems, cartItems: updatedCartItems });
    toast.success('Item removed from cart');
  },
  // quantity: 1,
  // value: '',
  removeAll: () => set({ items: [], cartItems: {} }),
}));

export default useCart;
