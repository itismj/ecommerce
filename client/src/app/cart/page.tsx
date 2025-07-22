"use client";

import PrivateRoute from "@/components/PrivateRoute";
import { useAuth } from "@/context/AuthContext";
import { getCartItems, removeFromCart } from "@/services/cart";
import { useEffect, useState } from "react";
import Link from "next/link";

type CartItem = {
  productId: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  imageUrl?: string;
};

export default function CartPage() {
  const { token } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCart = async () => {
    if (!token) return;
    try {
      setIsLoading(true);
      const items = await getCartItems(token);
      setCartItems(items);
    } catch (error) {
      console.error("Failed to fetch cart items:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async (productId: number) => {
    if (!token) return;
    await removeFromCart(productId, token);
    fetchCart();
  };

  useEffect(() => {
    if (token) {
      fetchCart();
    }
  }, [token]);

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (isLoading) {
    return <div className="text-center p-10">Loading your cart...</div>;
  }

  return (
    <PrivateRoute requiredRole="USER">
      <div className="p-4 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">🛒 Your Shopping Cart</h1>
        {cartItems.length === 0 ? (
          <div className="text-center bg-white p-10 rounded-lg shadow-md">
            <p className="text-gray-600">Your cart is empty.</p>
            <Link
              href="/products"
              className="text-blue-600 hover:underline mt-4 inline-block"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div>
            <ul className="space-y-4">
              {cartItems.map((item) => (
                <li
                  key={item.productId}
                  className="border p-4 rounded-lg flex items-center bg-white shadow-sm"
                >
                  <img
                    src={item.imageUrl || "https://via.placeholder.com/100"}
                    alt={item.name}
                    className="h-24 w-24 object-cover rounded-md mr-4"
                  />
                  <div className="flex-grow">
                    <p className="font-semibold text-lg">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      ${item.price.toFixed(2)} x {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-xl text-green-600">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    <button
                      onClick={() => handleRemove(item.productId)}
                      className="text-red-500 hover:underline text-sm mt-2"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="text-right font-bold text-2xl mt-6 border-t-2 pt-4">
              Total: ${totalPrice.toFixed(2)}
            </div>
          </div>
        )}
      </div>
    </PrivateRoute>
  );
}
