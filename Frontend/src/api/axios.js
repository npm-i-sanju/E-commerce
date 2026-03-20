import axios from "axios";


const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:8000/api",
   
//    withCredentials: true,
})

console.log("API base URL:", api.defaults.baseURL);

export default api;





















