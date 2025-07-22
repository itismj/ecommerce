import axios from "axios";

const BASE_URL = "http://localhost:8080/api/cart";

export const addToCart = async (
  productId: number,
  quantity: number,
  token: string
) => {
  await axios.post(
    `${BASE_URL}`,
    { productId, quantity },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const getCartItems = async (token: string) => {
  const res = await axios.get(BASE_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const removeFromCart = async (productId: number, token: string) => {
  await axios.delete(`${BASE_URL}/${productId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
