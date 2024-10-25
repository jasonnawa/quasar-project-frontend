import axios from 'axios';

const api = axios.create({
  baseURL: 'https://nestjs-ecommerce-api.onrender.com', // Adjust to your NestJS server URL
  timeout: 10000, // Optional timeout
});


export const registerUser = async () => {
  const response = await api.post('auth/register');
  return response.data;
};



export const loginUser = async () => {
  const response = await api.post('auth/login');
  return response.data;
};

export const getProducts = async () => {
  const response = await api.get('/products');
  return response.data;
};

export const getCart = async () => {
  const response = await api.get('/cart');
  return response.data;
};


export default api;
