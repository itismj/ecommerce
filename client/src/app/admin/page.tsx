"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Product } from "@/types";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "@/services/products";
import Notification from "@/components/Notification";

interface ProductFormState {
  name: string;
  description: string;
  price: string;
}

const INITIAL_FORM_STATE: ProductFormState = {
  name: "",
  description: "",
  price: "",
};

export default function AdminPage() {
  const { token, user } = useAuth();

  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<ProductFormState>(INITIAL_FORM_STATE);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({
    message: "",
    type: "" as "success" | "error",
  });

  useEffect(() => {
    if (user?.role === "ADMIN") {
      fetchProducts();
    }
  }, [user, token]);

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type });
    setTimeout(
      () => setNotification({ message: "", type: "" as "success" | "error" }),
      3000
    );
  };

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      showNotification("Failed to fetch products", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      description: product.description,
      price: String(product.price),
    });
    window.scrollTo(0, 0);
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setForm(INITIAL_FORM_STATE);
  };

  const handleSubmit = async () => {
    if (!token) return;
    if (!form.name || !form.price) {
      showNotification("Name and Price are required.", "error");
      return;
    }

    setIsLoading(true);
    try {
      const productData = { ...form, price: parseFloat(form.price) };
      const action = editingProduct ? "update" : "add";

      if (editingProduct) {
        await updateProduct(editingProduct.id, productData, token);
      } else {
        await addProduct(productData, token);
      }
      showNotification(`Product ${action}ed successfully!`, "success");
      handleCancelEdit();
      fetchProducts();
    } catch (err) {
      showNotification(
        `Failed to ${editingProduct ? "update" : "add"} product`,
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!token) return;
    if (window.confirm("Are you sure you want to delete this product?")) {
      setIsLoading(true);
      try {
        await deleteProduct(id, token);
        showNotification("Product deleted successfully", "success");
        fetchProducts();
      } catch (err) {
        showNotification("Failed to delete product", "error");
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (user?.role !== "ADMIN") {
    return <div className="text-center mt-10">🚫 Unauthorized</div>;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Notification
        message={notification.message}
        type={notification.type}
        onClose={() =>
          setNotification({ message: "", type: "" as "success" | "error" })
        }
      />

      <h1 className="text-2xl font-bold mb-4">📦 Admin Product Manager</h1>

      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-lg font-semibold mb-2">
          {editingProduct ? "✏️ Edit Product" : "➕ Add New Product"}
        </h2>
        {/* ... form inputs are the same ... */}
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleInputChange}
          className="input-field"
          disabled={isLoading}
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleInputChange}
          className="input-field"
          disabled={isLoading}
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleInputChange}
          className="input-field"
          disabled={isLoading}
        />

        <div className="flex gap-2 mt-2">
          <button
            onClick={handleSubmit}
            className="btn-primary"
            disabled={isLoading}
          >
            {isLoading
              ? "Saving..."
              : editingProduct
              ? "Save Changes"
              : "Add Product"}
          </button>
          {editingProduct && (
            <button
              onClick={handleCancelEdit}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              disabled={isLoading}
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      <ul className="space-y-2">
        {products.map((p) => (
          <li
            key={p.id}
            className="bg-white p-4 rounded shadow flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{p.name}</p>
              <p className="text-sm text-gray-500">{p.description}</p>
              <p className="text-green-600">${p.price}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEditClick(p)}
                className="text-blue-600 hover:underline"
                disabled={isLoading}
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(p.id)}
                className="text-red-600 hover:underline"
                disabled={isLoading}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
