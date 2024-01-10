//@/app/(routes)/cart/components/summary.tsx

"use client";

import axios from "axios";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";

import Button from "@/components/ui/button";
import Currency from "@/components/ui/currency";
import useCart from "@/hooks/use-cart";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";


const Summary = () => {
  const searchParams = useSearchParams();
  const items = useCart((state) => state.items);
  const removeAll = useCart((state) => state.removeAll);

  useEffect(() => {
    if (searchParams.get('success')) {
      toast.success('Payment completed.');
      removeAll();
    }

    if (searchParams.get('canceled')) {
      toast.error('Something went wrong.');
    }
  }, [searchParams, removeAll]);

  const totalPrice = items.reduce((total, item) => {
    return total + Number(item.price)
  }, 0);

  const onCheckout = async () => {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/checkout`, {
      productIds: items.map((item) => item.id)
    });

  }

  return ( 
    <div
      className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
    >
      <h2 className="text-lg font-medium text-gray-900">
        Order summary
      </h2>
      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <div className="text-base font-medium text-gray-900">Order total</div>
         <Currency value={totalPrice} />
        </div>
      </div>
 
      <PayPalScriptProvider options={{ clientId: "AduVY56YuDHxaOTaQGuyVBxN2ZkHmrp4lYqHyDLaA82cG4ouE0QGbHvN2TWLNPUiM1Kv6HdPcs9TM0Qk"}}>
        <PayPalButtons
          style={{
            color: "black"
          }}
          createOrder={(data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: totalPrice.toString(),
                    currency_code: "USD",
                  },
                },
              ],
            });
          }}
          onClick={onCheckout}
          onApprove={async (data, actions) => {
            try {
              const orderDetails = await actions.order?.get();

              // Handle the response or use it as needed...
              console.log('Data:', data);
              console.log('Order Details:', orderDetails);

              //const orderId = await myOrderID(); // Await the result of myOrderID

              await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/checkout-approved`, {
                data,
                orderDetails,
              });
            } catch (error) {
              // Handle errors...
              console.error(error);
            }
          }}
          onCancel={(data) => {
            console.log("It has been canceled: ", data);
          }}
        />
      </PayPalScriptProvider>
    </div>
  );
}
 
export default Summary;



      





