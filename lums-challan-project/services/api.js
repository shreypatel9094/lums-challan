import axios from 'axios';  
  
const API_BASE_URL = 'http://localhost:5000/api';  
  
const api = axios.create({  
  baseURL: API_BASE_URL,  
});  
  
// Add a request interceptor to include the auth token  
api.interceptors.request.use(  
  (config) = 
    const token = localStorage.getItem('token');  
    if (token) {  
      config.headers.Authorization = `Bearer ${token}`;  
    }  
    return config;  
  },  
  (error) = 
    return Promise.reject(error);  
  }  
);  
  
// Auth APIs  
export const register = (userData) =, userData);  
export const login = (credentials) =, credentials);  
  
// Customer APIs  
export const getCustomers = () = 
export const getCustomer = (id) = 
export const createCustomer = (customerData) =, customerData);  
export const updateCustomer = (id, customerData) =, customerData);  
export const deleteCustomer = (id) = 
  
