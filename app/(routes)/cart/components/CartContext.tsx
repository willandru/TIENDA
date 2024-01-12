// CartContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

interface CartContextProps {
  quantityChanges: { name: string; quantity: number }[];
  setQuantityChanges: React.Dispatch<React.SetStateAction<{ name: string; quantity: number }[]>>;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [quantityChanges, setQuantityChanges] = useState<{ name: string; quantity: number }[]>([]);

  return (
    <CartContext.Provider value={{ quantityChanges, setQuantityChanges }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCartContext must be used within a CartProvider");
  }
  return context;
};
