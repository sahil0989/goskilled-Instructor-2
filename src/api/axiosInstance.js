import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://goskilled-backed-2-0.onrender.com",
});

export default axiosInstance;
