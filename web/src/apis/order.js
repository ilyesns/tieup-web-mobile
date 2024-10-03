import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../util";

import axios from "axios";

export const useClientOrders = (userId, token) => {
  return useQuery({
    queryKey: ["orders", userId],
    queryFn: async () => {
      if (!userId) {
        return [];
      }
      const res = await axios.get(
        `${BASE_URL}order/client/read-all/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    },
    enabled: !!userId && !!token,

    staleTime: 600000,
  });
};
export const useOrdersFreelancer = (userId, token) => {
  return useQuery({
    queryKey: ["ordersFreelancer", userId],
    queryFn: async () => {
      if (!userId) {
        return [];
      }
      const res = await axios.get(
        `${BASE_URL}order/freelancer/read-all/${userId}`
      );
      return res.data;
    },
    enabled: !!userId && !!token,

    staleTime: 600000,
  });
};

export const calculOrderTotal = async (basePrice, token) => {
  try {
    const response = await axios.post(
      `${BASE_URL}order/client/calcul-total-return-details`,
      basePrice,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error calculing total :", error);
  }
};

export const placeOrder = async (orderData, token) => {
  try {
    const response = await axios.post(
      `${BASE_URL}order/client/place`,
      orderData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error calculing total :", error);
  }
};
export const updateStatus = async (orderData, token) => {
  try {
    const response = await axios.post(
      `${BASE_URL}order/freelancer/update-status/${orderData.orderId}`,
      orderData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error update status  :", error);
  }
};
export const updateStatusComplete = async (orderData, token) => {
  try {
    const response = await axios.post(
      `${BASE_URL}order/client/update-status/${orderData.orderId}`,
      orderData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error update status  :", error);
  }
};

export const addDelivery = async (file, orderData, token) => {
  const formData = new FormData();
  formData.append("note", orderData.note);
  if (file) {
    formData.append("file", file);
  }

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  };

  try {
    const response = await axios.post(
      `${BASE_URL}order/delivery/add/${orderData.orderId}`,
      formData,
      config
    );
    return response.data;
  } catch (error) {
    console.error("Error calculing total :", error);
  }
};

export const useOrderDeliveries = (orderId, token) => {
  return useQuery({
    queryKey: ["orderDeliveries", orderId],
    queryFn: async () => {
      if (!orderId) {
        return [];
      }
      const res = await axios.get(
        `${BASE_URL}order/delivery/read-all/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    },
    enabled: !!orderId && !!token,

    staleTime: 600000,
  });
};

export const calculOrderFreelancerFee = async (basePrice, token) => {
  try {
    const response = await axios.post(
      `${BASE_URL}order/freelancer/calcul-total-return-details`,
      { basePrice },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error calculing total :", error);
  }
};
