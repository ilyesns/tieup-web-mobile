import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../util";

import axios from "axios";

export const useFreelancerWallet = (userId) => {
  return useQuery({
    queryKey: ["freelancerWallet", userId],
    queryFn: async () => {
      if (!userId) {
        return [];
      }
      const res = await axios.get(
        `${BASE_URL}wallet/freelancer/read/${userId}`
      ); // Assuming this is the endpoint to get notifications
      return res.data;
    },
    staleTime: 600000,
  });
};
