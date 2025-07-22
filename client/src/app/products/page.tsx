"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { addToCart } from "@/services/cart";
import { Product } from "@/types";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);

  const { token } = useAuth();

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  const handleAddToCart = async (productId: number) => {
    if (!token) {
      alert("You must be logged in to add to cart");
      return;
    }

    try {
      await addToCart(productId, 1, token);
      alert("Added to cart!");
    } catch (err) {
      console.error("Failed to add to cart:", err);
      alert("Failed to add to cart");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">🛒 Products</h1>
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {products.map((product) => (
          <li
            key={product.id}
            className="border p-4 rounded shadow-sm bg-white hover:shadow-md transition"
          >
            <h2 className="font-bold text-lg">{product.name}</h2>
            <p className="text-sm text-gray-600">{product.description}</p>
            <p className="text-green-600 font-semibold mb-2">
              ${product.price}
            </p>
            <button
              onClick={() => handleAddToCart(product.id)}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Add to Cart
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
