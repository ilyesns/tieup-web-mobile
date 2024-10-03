import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../util";

import axios from "axios";

export const useNotifications = (userId) => {
  return useQuery({
    queryKey: ["notifications", userId],
    queryFn: async () => {
      if (!userId) {
        return [];
      }
      const res = await axios.get(`${BASE_URL}notifications/${userId}`); // Assuming this is the endpoint to get notifications
      return res.data;
    },
    enabled: !!userId,
    staleTime: 600000,
  });
};
