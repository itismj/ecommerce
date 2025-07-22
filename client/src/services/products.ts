import axios from "axios";
import { Product } from "@/types";

const API_URL = "http://localhost:8080/api/products";

export const getProducts = async (): Promise<Product[]> => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const addProduct = async (
  productData: Omit<Product, "id">,
  token: string
): Promise<Product> => {
  const response = await axios.post(API_URL, productData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateProduct = async (
  id: number,
  productData: Partial<Product>,
  token: string
): Promise<Product> => {
  const response = await axios.put(`${API_URL}/${id}`, productData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteProduct = async (
  id: number,
  token: string
): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
