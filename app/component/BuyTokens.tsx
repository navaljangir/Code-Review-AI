"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { createRazorpayOrder } from "../lib/Razorpay/RazorPayInitiation";
import { Button } from "@/components/ui/button";
import { verifyPayment } from "../lib/Razorpay/VerifyPayment";
import { AddToken } from "../lib/AddTokens";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const packs = [
  {
    type: "GOLD",
    tokens: 50,
    price: 1,
    badge: "Most Popular",
    cardNumber: "•••• 3521",
    expiry: "12/26",
  },
  {
    type: "PLATINUM",
    tokens: 120,
    price: 1000,
    badge: "20% More",
    cardNumber: "•••• 7849",
    expiry: "09/27",
  },
  {
    type: "DIAMOND",
    tokens: 300,
    price: 2000,
    badge: "Best Value",
    cardNumber: "•••• 2153",
    expiry: "03/28",
  },
];

export default function Checkout() {
  const [amount, setAmount] = useState(0); // Default ₹1
  const [loading, setLoading] = useState(false);
  const session = useSession();
  const [tokens, setTokens] = useState(0);
  const userId = session.data?.user.id;
  const email = session.data?.user.email;
  const router = useRouter()
  const handlePayment = async (packAmount: number, packTokens: number) => {
    setAmount(packAmount);
    setTokens(packTokens);
    setLoading(true);
    // Call the server action to create an order
    const order = await createRazorpayOrder(amount);
    // console.log(order)
    if ("success" in order && !order.success) {
      alert("Error creating order");
      setLoading(false);
      return;
    }

    // // Initialize Razorpay
    if ("id" in order && "amount" in order && "currency" in order) {
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: Number(order.amount),
        currency: order.currency,
        name: "Code AI Review",
        description: "Test Transaction",
        order_id: order.id,
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          const payload = {
            userid: email!,
            amount: Number(amount),
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          };
          const verifyResponse = await verifyPayment(
            payload.razorpay_order_id,
            payload.razorpay_payment_id,
            payload.razorpay_signature
          );
          if (verifyResponse.success) {
            await AddToken(tokens, userId!);
            toast.success(`Tokens Purchased Successfully`);
            router.push('/chat')
          }else{
            toast.success('Error While Purchasing')
          }
        },
        theme: {
          color: "#3399cc",
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    }
    setLoading(false);
  };
  return (
    <div className="min-h-screen bg-slate-900 p-8 flex flex-col justify-center">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-amber-400 mb-4">
          AI Review Token Cards
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto mb-12 text-lg">
          Purchase premium token cards for AI code reviews. Choose your tier.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {packs.map((pack, index) => (
            <div
              key={index}
              className="relative h-64 w-96 mx-auto rounded-2xl overflow-hidden bg-gradient-to-br from-amber-600 via-amber-500 to-amber-400 transition-transform hover:-translate-y-2 hover:shadow-2xl"
            >
              {/* Card Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent w-1/2 transform -skew-x-12" />

              {/* Card Content */}
              <div className="p-6 h-full flex flex-col justify-between">
                {/* Card Header */}
                <div className="flex justify-between items-start">
                  <div className="text-amber-900">
                    <svg
                      className="w-12 h-12"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 0L8 4h8l-4-4zM4 8L0 12l4 4V8zm16 0v8l4-4-4-4zm-8 8l-4 4 4 4 4-4-4-4z" />
                    </svg>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-amber-900 font-semibold">
                      VALID THRU
                    </div>
                    <div className="text-xl text-amber-800 font-mono">
                      {pack.expiry}
                    </div>
                  </div>
                </div>

                {/* Card Number */}
                <div className="flex justify-between font-mono text-2xl text-amber-800 mb-4">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="w-16 h-8 bg-amber-700/30 rounded-sm"
                    />
                  ))}
                </div>

                {/* Card Footer */}
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-xs text-amber-800">
                      CARDHOLDER NAME
                    </div>
                    <div className="text-xl font-bold text-amber-900">
                      {pack.type}
                    </div>
                  </div>
                  <div className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm">
                    {pack.badge}
                  </div>
                </div>
              </div>

              {/* Purchase Info Overlay */}
              <div className="absolute inset-0 flex items-center justify-center text-center transition-all group-hover:bottom-4">
                <div className="inline-block bg-slate-900/90 backdrop-blur-sm px-8 py-4 rounded-2xl shadow-xl">
                  <div className="text-2xl font-bold text-amber-400 mb-2">
                    {pack.tokens} Tokens
                  </div>
                  <Button
                    className="bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 font-bold py-2 px-6 rounded-full hover:opacity-90 transition-opacity"
                    onClick={() => {
                      handlePayment(pack.price, pack.tokens);
                    }}
                    disabled={loading}
                  >
                    {loading ? "Purchasing...." : `Buy Now - ₹${pack.price}`}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-slate-500 text-sm">
          <p>Secure PCI-compliant transactions · Instant digital delivery</p>
        </div>
      </div>
    </div>
  );
}
