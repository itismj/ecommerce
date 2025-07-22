"use client";

import PrivateRoute from "@/components/PrivateRoute";
import { useAuth } from "@/context/AuthContext";
import { getCartItems, removeFromCart } from "@/services/cart";
import { useEffect, useState } from "react";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
};

export default function CartPage() {
  const { token } = useAuth();
  const [cartItems, setCartItems] = useState<Product[]>([]);

  const fetchCart = async () => {
    if (!token) return;
    const items = await getCartItems(token);
    setCartItems(items);
  };

  const handleRemove = async (id: number) => {
    if (!token) return;
    await removeFromCart(id, token);
    fetchCart(); // refresh cart
  };

  useEffect(() => {
    fetchCart();
  }, [token]);

  return (
    <PrivateRoute>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">🛒 Your Cart</h1>
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <ul className="space-y-2">
            {cartItems.map((item) => (
              <li
                key={item.id}
                className="border p-2 rounded flex justify-between"
              >
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm">{item.description}</p>
                  <p className="text-sm text-green-600">${item.price}</p>
                </div>
                <button
                  onClick={() => handleRemove(item.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </PrivateRoute>
  );
}
