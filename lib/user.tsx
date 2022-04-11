import axios from "axios";
import { API_ENDPOINTS } from "./constants";

const getCurrentUser = async () => {
  const res = await axios.get(API_ENDPOINTS.USER);
  return res?.data;
};

export { getCurrentUser };
