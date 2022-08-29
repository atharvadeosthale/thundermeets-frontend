// @ts-nocheck
import axios from "axios";

const base_url = "https://thunder-meets.herokuapp.com";

const accesToken: string | null | boolean | null =
  typeof window !== "undefined" ? localStorage.getItem("access") : null;
// console.log(accesToken())

export const axiosInstance = axios.create({
  baseURL: base_url,
  timeout: 5000,
  headers: {
    Authorization: accesToken ? "JWT" + " " + accesToken : null,
    "Content-Type": "application/json",
    accept: "application/json",
  },
});
