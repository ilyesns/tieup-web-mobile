import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BASE_URL } from "../util/constant";

export const useOffers = (token: string, page: number, pageSize: number) => {
  return useQuery({
    queryKey: ["offers", page],
    queryFn: async () => {
      const res = await axios.get(
        `${BASE_URL}admin/read-all-offers?page=${page}&pageSize=${pageSize}`
      );
      return res.data;
    },

    staleTime: 600000,
  });
};

export const updateStatus = async (
  offerId: string,
  status: string,
  token: string
) => {
  try {
    const response = await axios.post(
      `${BASE_URL}admin/update-offer-status/${offerId}`,
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
export const deleteOffer = async (offerId: string, token: string) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}freelancer/offer/delete-offer/${offerId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    //  throw error; // Rethrow the error to be handled by the caller
  }
};

export const searchOffers = async (token: string, searchValue: string) => {
  try {
    const res = await axios.get(
      `${BASE_URL}admin/search-offers?term=${searchValue}`
    );
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
