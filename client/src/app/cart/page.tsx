"use client";

import PrivateRoute from "@/components/PrivateRoute";
import { useAuth } from "@/context/AuthContext";
import { getCartItems, removeFromCart } from "@/services/cart";
import { useEffect, useState } from "react";

type CartItem = {
  productId: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
};

export default function CartPage() {
  const { token } = useAuth();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const fetchCart = async () => {
    if (!token) return;
    const items = await getCartItems(token);
    setCartItems(items);
  };

  const handleRemove = async (productId: number) => {
    if (!token) return;

    await removeFromCart(productId, token);
    fetchCart();
  };

  useEffect(() => {
    fetchCart();
  }, [token]);

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <PrivateRoute>
      <div className="p-4 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">🛒 Your Cart</h1>
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div>
            <ul className="space-y-3">
              {cartItems.map((item) => (
                <li
                  key={item.productId}
                  className="border p-3 rounded flex justify-between items-center bg-white shadow-sm"
                >
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.description}</p>

                    <p className="text-sm">
                      ${item.price.toFixed(2)} x {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg text-green-600">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    <button
                      onClick={() => handleRemove(item.productId)}
                      className="text-red-500 hover:underline text-sm mt-1"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="text-right font-bold text-xl mt-4 border-t pt-4">
              Total: ${totalPrice.toFixed(2)}
            </div>
          </div>
        )}
      </div>
    </PrivateRoute>
  );
}
