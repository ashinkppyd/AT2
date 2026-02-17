import axios from "axios";

const api = axios.create({
  baseURL: "http://3.6.89.120/api/",
  withCredentials: true, 
});

export default api;
      