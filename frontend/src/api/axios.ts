import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

// The Interceptor: Automatically attaches your JWT Token to every request
instance.interceptors.request.use(
  (config) => {
    // 1. Try to find the token in localStorage
    let token = localStorage.getItem('token');
    
    // 2. If it's not there, check if it was saved inside the 'user' object
    if (!token) {
      const userString = localStorage.getItem('user');
      if (userString) {
        try {
          const parsedUser = JSON.parse(userString);
          token = parsedUser.token;
        } catch (e) {
          console.error("Error parsing user data");
        }
      }
    }

    // 3. If we found a token, attach it!
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;