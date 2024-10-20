import axios from "axios";

export const baseURL = "http://localhost:8080/";

const ApiResponse = axios.create({
  baseURL: `${baseURL}api/`,
  withCredentials: true,
});
export default ApiResponse;
