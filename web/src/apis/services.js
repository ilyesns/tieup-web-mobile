import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../util";
import axios from "axios";

export const useServices = () => {
  return useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const res = await axios.get(`${BASE_URL}service/read-services`);
      return res.data;
    },
    staleTime: 600000,
    gcTime: 500000,
  });
};
export const useOffersByService = (serviceId, isLoggedIn, currentUserId) => {
  return useQuery({
    queryKey: ["offers", serviceId],
    queryFn: async () => {
      if (!serviceId) {
        return [];
      }
      const url = `${BASE_URL}service/offer/read-offers/${serviceId}?userId=${currentUserId}`;
      const res = await axios.get(url);
      return res.data;
    },
    staleTime: 600000,
    enabled: !!serviceId || !isLoggedIn || !!currentUserId,
  });
};
export const useOffers = () => {
  return useQuery({
    queryKey: ["offers"],
    queryFn: async () => {
      const res = await axios.get(`${BASE_URL}offer/read-all`);
      return res.data;
    },
    staleTime: 600000,
    gcTime: 500000,
  });
};

export const searchOffers = async (term) => {
  try {
    const res = await axios.get(
      `${BASE_URL}service/offer/read-searched-offers?term=${term}`
    );
    return res.data;
  } catch (e) {
    console.log(e);
  }
};
