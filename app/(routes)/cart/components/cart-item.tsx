//@/app/(routes)/cart/components/cart-items.tsx

import Image from "next/image";
import { toast } from "react-hot-toast";
import { X , ChevronDown, ChevronUp} from "lucide-react";

import IconButton from "@/components/ui/icon-button";
import Currency from "@/components/ui/currency";
import useCart from "@/hooks/use-cart";
import { Product } from "@/types";
import { useState } from "react";


interface CartItemProps {
  data: Product;
}

const CartItem: React.FC<CartItemProps> = ({
  data
}) => {
  const cart = useCart();
  const [quantity, setQuantity] = useState(1);


  const onRemove = () => {
    cart.removeItem(data.id);
  };


  const handleIncrement = () => {
    
    const inStock = Number(data.quantityInStock);
    const quantityInCart = quantity+1;
    if(quantityInCart <= inStock){
      setQuantity((prevQuantity) => Math.max(1, prevQuantity + 1));
    }
    else{
      console.log('Out of Stock');
      //toast.error('We run out of Stock¡');
      
    }   
    
    console.log("Increasing +1");
    console.log(inStock);
    console.log(quantityInCart);
    
    
  };

  const handleDecrement = () => {
    setQuantity((prevQuantity) => Math.max(1, prevQuantity - 1));
    console.log("Decreasing -1");
    console.log(quantity-1);

  };

  const precio= Number(data.price) * quantity;

  return ( 
    <li className="flex py-6 border-b">
      <div className="relative h-24 w-24 rounded-md overflow-hidden sm:h-48 sm:w-48">
        <Image
          fill
          src={data.images[0].url}
          alt=""
          className="object-cover object-center"
        />
      </div>
      <div className="relative ml-4 flex flex-1 flex-col justify-between sm:ml-6">
        <div className="absolute z-10 right-0 top-0">
          <IconButton onClick={onRemove} icon={<X size={15} />} />
        </div>
        <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
          <div className="flex justify-between">
            <p className=" text-lg font-semibold text-black">
              {data.name}
            </p>
          </div>

          <div className="mt-1 flex text-sm">
            <p className="text-gray-500">{data.color.name}</p>
            <p className="ml-4 border-l border-gray-200 pl-4 text-gray-500">{data.size.name}</p>
          </div>
          <Currency value={Number(data.price) * quantity} />

        </div>
        <div className="relative ml-4 flex flex-1 flex-col justify-between sm:ml-6">
        <div className="absolute z-10 right-0 top-0 mt-14">
          <IconButton onClick={handleIncrement} icon={<ChevronUp size={15} style={{ marginBottom: '5px' }}/>} className="mb-2" />
          <IconButton onClick={handleDecrement} icon={<ChevronDown size={15} style={{ marginTop: '5px' }} />} />
        </div>
        <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
          <div className="flex justify-between">
            <p className=" text-lg font-semibold text-black">
              
            </p>
          </div>

          <div className=" flex text-sm items-center mt-20">
            <p className="text-lg font-semibold text-black">Cantidad: </p>
            <p className="ml-4 border flex items-center justify-center h-8 w-8 text-gray-500">
            {quantity}
            </p>
          </div>

          
        </div>
        
      
      </div> 
      </div>
    </li>
  );
}
 
export default CartItem;