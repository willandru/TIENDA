//@/app/(routes)/cart/components/cart-items.tsx

import Image from "next/image";
import { toast } from "react-hot-toast";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';

import IconButton from "@/components/ui/icon-button";
import Currency from "@/components/ui/currency";
import useCart from "@/hooks/use-cart";
import { Product } from "@/types";
import { useState, useEffect } from "react";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

interface CartItemProps {
  data: Product;
}

const CartItem: React.FC<CartItemProps> = ({ data }) => {
  const cart = useCart();
  const [cartItems, setCartItems] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    // Set default quantity to 1 for each product when the component mounts
    setCartItems((prevItems) => ({ ...prevItems, [data.id]: 1 }));
  }, [data.id]);

  useEffect(() => {
    // Update the quantity when cartItems change externally
    setCartItems((prevItems) => ({ ...prevItems, [data.id]: cart.cartItems[data.id] || 0 }));
  }, [cart.cartItems, data.id]);

  const onRemove = () => {
    cart.removeItem(data.id);
  };

  const handleIncrement = () => {
    const inStock = Number(data.quantityInStock);
    const quantityInCart = cartItems[data.id] ? cartItems[data.id] + 1 : 1;

    if (quantityInCart <= inStock) {
      cart.incrementQuantity(data.id);
      setCartItems((prevItems) => ({ ...prevItems, [data.id]: quantityInCart }));
      // cart.onChevronUp(data); // Assuming this function handles the cart update
      toast('Quantity increased')
    } else {
      console.log('Out of Stock');
      toast('No more items available!')
      // toast.error('We ran out of Stock!');
    }
  };

  const handleDecrement = () => {
    let quantityInCart = cartItems[data.id] ? cartItems[data.id] - 1 : 0;

    if (quantityInCart >= 1) {
      cart.decrementQuantity(data.id);
      setCartItems((prevItems) => ({ ...prevItems, [data.id]: quantityInCart }));
      // cart.onChevronDown(data.id); // Assuming this function handles the cart update
      toast('Quantity decreased')
    } else {
      quantityInCart = 0;
      console.log('Minimum 0');
      // toast.error('We ran out of Stock!');
    }
  };

  const cartItemKey = uuidv4();
  const totalPrice = Number(data.price) * cartItems[data.id];

  return (
    
    <li key={cartItemKey} className="flex py-6 border-b" >
      <div className="relative h-24 w-24 rounded-md overflow-hidden sm:h-48 sm:w-48">
        <Image fill src={data.images[0].url} alt="" className="object-cover object-center" />
      </div>
      <div className="relative ml-4 flex flex-1 flex-col justify-between sm:ml-6">
        <div className="absolute z-10 right-0 top-0">
          <IconButton onClick={onRemove} icon={<X size={15} />} />
        </div>
        <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
          <div className="flex justify-between">
            <p className=" text-lg font-semibold text-black">{data.name}</p>
          </div>

          <div className="mt-1 flex text-sm">
            <p className="text-gray-500">{data.color.name}</p>
            <p className="ml-4 border-l border-gray-200 pl-4 text-gray-500">{data.size.name}</p>
          </div>
          <Currency value={Number(data.price) * cartItems[data.id]} />
        </div>
        <div className="relative ml-4 flex flex-1 flex-col justify-between sm:ml-6">
          <div className="absolute z-10 right-0 top-0 mt-14">
            <IconButton onClick={handleIncrement} icon={<ChevronUp size={15} style={{ marginBottom: '5px' }} />} className="mb-2" />
            <IconButton onClick={handleDecrement} icon={<ChevronDown size={15} style={{ marginTop: '5px' }} />} />
          </div>
          <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
            <div className="flex justify-between">
              <p className=" text-lg font-semibold text-black"></p>
            </div>
            <div className=" flex text-sm items-center mt-20">
              <p className="text-lg font-semibold text-black">Cantidad: </p>
              <p className="ml-4 border flex items-center justify-center h-8 w-8 text-gray-500">{cartItems[data.id]}</p>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

export default CartItem;
