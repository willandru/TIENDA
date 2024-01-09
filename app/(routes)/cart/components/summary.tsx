// @/app/(routes)/cart/components/summary.tsx

"use client";

import axios from "axios";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";

import Currency from "@/components/ui/currency";
import useCart from "@/hooks/use-cart";

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const Summary = () => {
  const searchParams = useSearchParams();
  const items = useCart((state) => state.items);
  const removeAll = useCart((state) => state.removeAll);

  useEffect(() => {
    if (searchParams.get("success")) {
      toast.success("Payment completed.");
      removeAll();
    }

    if (searchParams.get("canceled")) {
      toast.error("Something went wrong.");
    }
  }, [searchParams, removeAll]);

  const totalPrice = items.reduce((total, item) => {
    return total + Number(item.price);
  }, 0);

  const createOrder = async () => {
    try {
      // Make a POST request to your backend API endpoint for creating PayPal orders
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/checkout`,
        {
          productIds: items.map((item) => item.id),
        }
      );

      // Extract the order ID from the response data
      const orderId = response.data.id; // Adjust this based on your API response

      return orderId;
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  };

  return (
    <div className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
      <h2 className="text-lg font-medium text-gray-900">Order summary</h2>
      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <div className="text-base font-medium text-gray-900">Order total</div>
          <Currency value={totalPrice} />
        </div>
      </div>
      <PayPalScriptProvider
        options={{
          clientId:
            "AduVY56YuDHxaOTaQGuyVBxN2ZkHmrp4lYqHyDLaA82cG4ouE0QGbHvN2TWLNPUiM1Kv6HdPcs9TM0Qk",
        }}
      >
        <PayPalButtons
          style={{ color: "black" }}
          createOrder={(data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: totalPrice.toFixed(2),
                  },
                },
              ],
            });
          }}
          onApprove={async (data, actions) => {
            // Check if actions.order is defined before accessing its properties
            if (actions.order) {
              const details = await actions.order.capture();
              createOrder().then((orderId) => {
                toast.success("Payment completed.");
                removeAll();
              });
            }
          }}
          onError={(err) => {
            toast.error("Something went wrong with the payment.");
          }}
        />
      </PayPalScriptProvider>
    </div>
  );
};

export default Summary;
