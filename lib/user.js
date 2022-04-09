const { default: axios } = require("axios");
const { API_ENDPOINTS } = require("./constants");

const getCurrentUser = async () => {
  const res = await axios.get(API_ENDPOINTS.USER);
  return res?.data;
};

module.exports = { getCurrentUser }
