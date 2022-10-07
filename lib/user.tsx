import axios from "axios";
import { API_ENDPOINTS } from "./constants";

const getCurrentUser = async () => {
  try {
    const res = await axios.get(API_ENDPOINTS.USER);
    return res?.data;
  } catch (err) {
    return null;
  }
};

export { getCurrentUser };
