// import axios from "axios";

// export const api = axios.create({
//   baseURL: "/",
//   headers: { "X-Requested-With": "XMLHttpRequest" },
// });

// // Example React Query fetcher
// export const fetcher = async (url: string) => {
//   const { data } = await api.get(url);
//   return data;
// };




// src/lib/api.ts
import axios from 'axios';

export const api = axios.create({
  baseURL: '/',
  headers: { 'Content-Type': 'application/json' },
});
