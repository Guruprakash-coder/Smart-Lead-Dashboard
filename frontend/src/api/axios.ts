import axios from 'axios';

const instance = axios.create({
  // This tells Vite: "If we are on Vercel, use the live URL. If we are testing locally, use localhost"
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

export default instance;