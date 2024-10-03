import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BASE_URL } from "../util/constant";

export const useOrders = (token: string, page: number, pageSize: number) => {
  return useQuery({
    queryKey: ["orders", page],
    queryFn: async () => {
      const res = await axios.get(
        `${BASE_URL}admin/read-all-orders?page=${page}&pageSize=${pageSize}`
      );
      return res.data;
    },

    staleTime: 600000,
  });
};

export const searchOrders = async (token: string, searchValue: string) => {
  try {
    const res = await axios.get(
      `${BASE_URL}admin/search-orders?term=${searchValue}`
    );
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
