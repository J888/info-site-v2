import axios from "axios";
import { LoginStatus } from "../../interfaces/LoginStatus";
import { API_ENDPOINTS } from "../constants";
import { getCurrentUser } from "../user";

export const loginHandler = async (providedUsername, password): Promise<LoginStatus> => {

  let loginRes;
  try {
    loginRes = await axios.post(API_ENDPOINTS.LOGIN, {
      username: providedUsername,
      password,
    });
    console.log(`loginRes: `, loginRes)
  } catch (err) {
    return {
      unauthorized: true,
      success: false,
      isAdmin: false
    }
  }

  const user = await getCurrentUser();
  return {
    success: !!user,
    isAdmin: user.admin
  }
};
