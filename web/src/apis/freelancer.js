import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../util";

import axios from "axios";

export const useFreelancerStatistic = (userId) => {
  return useQuery({
    queryKey: ["freelancerProfileStatistic", userId],
    queryFn: async () => {
      if (!userId) {
        return [];
      }

      try {
        const res = await axios.get(
          `${BASE_URL}freelancer/read-statistic/${userId}`
        );

        return res.data;
      } catch (error) {
        if (error.response && error.response.status === 404) {
          // Handle the case where the portfolio is not found (404)
          return null; // or null, depending on how you want to handle it
        } else {
          // Handle other errors
          throw error;
        }
      }
    },
    enabled: !!userId,

    staleTime: 600000,
  });
};
