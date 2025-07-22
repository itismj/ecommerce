"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { addToCart } from "@/services/cart";
import { Product } from "@/types";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    // Fetch products from the backend
    axios
      .get("http://localhost:8080/api/products")
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleAddToCart = async (productId: number) => {
    if (!token) {
      alert("You must be logged in to add items to your cart.");
      return;
    }

    try {
      await addToCart(productId, 1, token);
      alert("Product added to cart!");
    } catch (err) {
      console.error("Failed to add to cart:", err);
      alert("Failed to add product to cart. Please try again.");
    }
  };

  if (isLoading) {
    return <div className="text-center p-10">Loading products...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">🛍️ All Products</h1>
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <li
            key={product.id}
            className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col transition-transform hover:scale-105"
          >
            <img
              // Use the product's imageUrl or a fallback placeholder if it's missing
              src={
                product.imageUrl ||
                "https://via.placeholder.com/300x300.png?text=No+Image"
              }
              alt={product.name}
              className="w-full h-56 object-cover" // Creates a uniform image size
            />

            <div className="p-4 flex flex-col flex-grow">
              <h2 className="font-bold text-lg mb-1">{product.name}</h2>
              <p className="text-sm text-gray-600 mb-3 flex-grow">
                {product.description}
              </p>
              <p className="text-green-600 font-semibold text-xl mb-4">
                ${product.price.toFixed(2)}
              </p>

              <button
                onClick={() => handleAddToCart(product.id)}
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors mt-auto"
              >
                Add to Cart
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
