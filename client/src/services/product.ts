import axios from "axios";

const BASE_URL = "http://localhost:8080/api/products";

export const getProducts = async () => {
  const res = await axios.get(BASE_URL);
  return res.data;
};
