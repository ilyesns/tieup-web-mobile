import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../util";

import axios from "axios";
export const askWithdrawal = async (token, data) => {
  try {
    const res = await axios.post(`${BASE_URL}freelancer/ask-withdrawal`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }); // Assuming this is the endpoint to get notifications
    return res.data;
  } catch (e) {}
};
