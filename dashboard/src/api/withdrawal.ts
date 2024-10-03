import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BASE_URL } from "../util/constant";

export const useWithdrawal = (
  token: string,
  page: number,
  pageSize: number
) => {
  return useQuery({
    queryKey: ["withdrawals", page],
    queryFn: async () => {
      const res = await axios.get(
        `${BASE_URL}admin/read-all-withdrawals?page=${page}&pageSize=${pageSize}`
      );
      return res.data;
    },

    staleTime: 600000,
  });
};

export const updateStatus = async (
  id: string,
  status: string,
  token: string
) => {
  try {
    const response = await axios.post(
      `${BASE_URL}admin/update-withdrawal-status/${id}`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (e) {
    console.log(e);
  }
};
