// @/app/(routes)/cart/components/summary.tsx

"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";

import Button from "@/components/ui/button";
import Currency from "@/components/ui/currency";
import useCart from "@/hooks/use-cart";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { Product } from "@/types";

const Summary = () => {
  const searchParams = useSearchParams();
  const cart = useCart();
  const { items, removeAll, cartItems } = cart; // Destructure cartItems directly from the useCart store
  const [orderID, setOrderID] = useState<string | null>(null);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  useEffect(() => {
    if (searchParams.get('success')) {
      toast.success('Payment completed.');
      removeAll();
    }

    if (searchParams.get('canceled')) {
      toast.error('Something went wrong.');
    }

  }, [searchParams, removeAll, items, cartItems]);

  useEffect(() => {
    // Calculate the total price based on the current state of the cart
    const newTotalPrice = items.reduce(
      (total, item) => total + Number(item.price) * (cartItems[item.id] || 0),
      0
    );

    // Update the totalPrice state
    setTotalPrice(newTotalPrice);
  }, [items, cartItems]);


  return (
    <div className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
      <h2 className="text-lg font-medium text-gray-900 flex items-center justify-center">
        Order summary
      </h2>
      <div className="mt-6 space-y-4 mb-10">
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <div className="text-base font-medium text-gray-900">Order total</div>
          <Currency value={totalPrice} />
        </div>
      </div>

      <PayPalScriptProvider options={{ clientId: "AduVY56YuDHxaOTaQGuyVBxN2ZkHmrp4lYqHyDLaA82cG4ouE0QGbHvN2TWLNPUiM1Kv6HdPcs9TM0Qk" }}>
        <PayPalButtons
          style={{
            color: "black",
            layout: "horizontal",
          }}
          createOrder={async (data, actions) => {
            try {
              // Calculate the total price based on the current state of the cart
              const currentTotalPrice = items.reduce(
                (total, item) => total + Number(item.price) * (cartItems[item.id] || 0),
                0
              );

              /*const newTotalPrice = items.reduce(
                (total, item) => total + Number(item.price) * (cartItems[item.id] || 0),
                0
              );
              // Calculate the total price based on the current state of the cart
              const currentTotalPrice = newTotalPrice
              */

              // Check if totalPrice is 0
              if (currentTotalPrice <= 0) {
                toast.error('Amount cannot be zero.');
                return Promise.reject("Order amount cannot be zero.");
              }

              // If totalPrice is greater than 0, proceed with creating the order
              const order = await actions.order.create({
                purchase_units: [
                  {
                    amount: {
                      value: currentTotalPrice.toFixed(2),
                      currency_code: "USD",
                    },
                  },
                ],
              });

              console.log("SENDING FROM FRONTEND: ", order);
              return order;
            } catch (error) {
              console.error("Error creating order:", error);
              throw error;
            }
          }}

          onApprove={async (data, actions) => {
            try {
              const orderDetails = await actions.order?.get();
              // Handle the response or use it as needed...
              console.log('APPROVED:: Data:', data);
              console.log('APPROVED:: Order Details:', orderDetails);

              await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/checkout-approved`, {
                data,
                orderDetails,
                productIds: items.map((item) => item.id),
              });

              toast.success('Payment completed.');
              removeAll();

            } catch (error) {
              // Handle errors...
              console.error(error);
            }
          }}

          onCancel={async (data) => {
            console.log("It has been canceled: ", data)
            toast.error('Payment canceled.');

          }}
        />
      </PayPalScriptProvider>
    </div>
  );
};

export default Summary;
