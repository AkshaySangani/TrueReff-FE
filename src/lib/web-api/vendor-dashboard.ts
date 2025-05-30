import axios from "./axios";

export const getStatesInfo = async () => {
  try {
    const response = await axios.get(`/auth/vendor-dashboard/states`);
    return response?.data?.data;
  } catch (error) {
    throw error;
  }
};
