"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
}

export default function AdminPage() {
  const { token, user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState({ name: "", description: "", price: "" });

  useEffect(() => {
    if (user?.role !== "ADMIN") return;
    fetchProducts();
  }, [token]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/products");
      setProducts(res.data);
    } catch (err) {
      alert("Failed to fetch products");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddProduct = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8080/api/products",
        {
          ...form,
          price: parseFloat(form.price),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setForm({ name: "", description: "", price: "" });
      fetchProducts();
    } catch (err) {
      alert("Failed to add product");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8080/api/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchProducts();
    } catch (err) {
      alert("Failed to delete product");
    }
  };

  if (user?.role !== "ADMIN") {
    return <div className="text-center mt-10">🚫 Unauthorized</div>;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📦 Admin Product Manager</h1>

      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-lg font-semibold mb-2">➕ Add New Product</h2>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleInputChange}
          className="input-field"
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleInputChange}
          className="input-field"
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleInputChange}
          className="input-field"
        />
        <button onClick={handleAddProduct} className="btn-primary mt-2">
          Add Product
        </button>
      </div>

      <ul className="space-y-2">
        {products.map((p) => (
          <li
            key={p.id}
            className="bg-white p-4 rounded shadow flex justify-between"
          >
            <div>
              <p className="font-semibold">{p.name}</p>
              <p className="text-sm text-gray-500">{p.description}</p>
              <p className="text-green-600">${p.price}</p>
            </div>
            <button
              onClick={() => handleDelete(p.id)}
              className="text-red-600 hover:underline"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
