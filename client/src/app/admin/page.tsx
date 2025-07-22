"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useAuth } from "@/context/AuthContext";
import { Product } from "@/types";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "@/services/products";
import Notification from "@/components/Notification";
import axios from "axios";

interface ProductFormState {
  name: string;
  description: string;
  price: string;
  quantity: string;
  imageUrl: string;
}

const INITIAL_FORM_STATE: ProductFormState = {
  name: "",
  description: "",
  price: "",
  quantity: "1",
  imageUrl: "",
};

export default function AdminPage() {
  const { token } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<ProductFormState>(INITIAL_FORM_STATE);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({
    message: "",
    type: "" as "success" | "error",
  });

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: "", type: "success" }), 3000);
  };

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      showNotification("Failed to fetch products. Check console.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: number) => {
    if (!token) return;
    if (
      window.confirm(
        "Are you sure? This will also remove the item from all user carts."
      )
    ) {
      setIsLoading(true);
      try {
        await deleteProduct(id, token);
        showNotification("Product deleted successfully", "success");
        await fetchProducts(); // Refreshes the list
      } catch (err) {
        console.error("Delete failed:", err);
        showNotification(
          "Failed to delete product. It might be in a user's cart.",
          "error"
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      description: product.description,
      price: String(product.price),
      quantity: String(product.quantity || 0),
      imageUrl: product.imageUrl || "",
    });
    setSelectedFile(null);
    window.scrollTo(0, 0);
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setForm(INITIAL_FORM_STATE);
    setSelectedFile(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) return;
    if (!form.name || !form.price || !form.quantity) {
      showNotification("Name, Price, and Quantity are required.", "error");
      return;
    }

    setIsLoading(true);
    let finalImageUrl = editingProduct?.imageUrl || "";

    if (selectedFile) {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", selectedFile);
      try {
        const res = await axios.post(
          "http://localhost:8080/api/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        finalImageUrl = res.data.url;
      } catch (err) {
        showNotification("Image upload failed.", "error");
        setIsLoading(false);
        setIsUploading(false);
        return;
      } finally {
        setIsUploading(false);
      }
    }

    try {
      const productData = {
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        quantity: parseInt(form.quantity, 10),
        imageUrl: finalImageUrl,
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, productData, token);
        showNotification("Product updated successfully!", "success");
      } else {
        await addProduct(productData, token);
        showNotification("Product added successfully!", "success");
      }

      handleCancelEdit();
      await fetchProducts();
    } catch (err) {
      showNotification(`Failed to save product`, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Notification
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ message: "", type: "success" })}
      />
      <h1 className="text-3xl font-bold mb-6">📦 Admin Product Manager</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md mb-8"
      >
        <h2 className="text-xl font-semibold mb-4">
          {editingProduct ? "✏️ Edit Product" : "➕ Add New Product"}
        </h2>

        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={handleInputChange}
          className="input-field"
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleInputChange}
          className="input-field min-h-[80px]"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleInputChange}
            className="input-field"
            step="0.01"
            required
          />
          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            value={form.quantity}
            onChange={handleInputChange}
            className="input-field"
            required
          />
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">
            Product Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <div className="mt-2 flex items-center gap-4">
            {form.imageUrl && !selectedFile && (
              <img
                src={form.imageUrl}
                alt="Current Product"
                className="h-24 w-24 object-cover rounded-md"
              />
            )}
            {selectedFile && (
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="New Preview"
                className="h-24 w-24 object-cover rounded-md"
              />
            )}
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isUploading
              ? "Uploading..."
              : isLoading
              ? "Saving..."
              : editingProduct
              ? "Save Changes"
              : "Add Product"}
          </button>
          {editingProduct && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <h2 className="text-2xl font-bold mb-4">Existing Products</h2>
      <ul className="space-y-3">
        {products.map((p) => (
          <li
            key={p.id}
            className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center"
          >
            <div className="flex items-center gap-4 flex-grow">
              <img
                src={p.imageUrl || "https://via.placeholder.com/80"} // Fallback image
                alt={p.name}
                className="h-20 w-20 object-cover rounded-md"
              />
              <div className="flex-grow">
                <p className="font-semibold text-lg">{p.name}</p>
                <p className="text-sm text-gray-500 truncate">
                  {p.description}
                </p>
                <div className="flex items-center gap-4 text-sm mt-1">
                  <p className="text-green-600 font-semibold">
                    ${p.price.toFixed(2)}
                  </p>
                  <p className="text-gray-600">Stock: {p.quantity}</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3 ml-4">
              <button
                onClick={() => handleEditClick(p)}
                className="text-blue-600 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(p.id)}
                className="text-red-600 hover:underline"
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
