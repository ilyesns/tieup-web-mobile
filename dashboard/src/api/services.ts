import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BASE_URL } from "../util/constant";

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

export const addService = async (data: any, token: string) => {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("description", data.description);
  formData.append("topic", data.topic);
  formData.append("parentServiceId", data.parentServiceId);
  formData.append("isRoot", data.parentServiceId ? "false" : "true");
  try {
    formData.append("file", data.image[0]);

    const response = await axios.post(
      `${BASE_URL}admin/add-service`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    //  throw error; // Rethrow the error to be handled by the caller
  }
};

export const updateService = async (data: any, token: string) => {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("description", data.description);
  formData.append("topic", data.topic ? data.topic : null);
  formData.append("parentServiceId", data.parentServiceId);
  try {
    formData.append("file", data.image[0]);

    const response = await axios.post(
      `${BASE_URL}admin/update-service/${data.serviceId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    //  throw error; // Rethrow the error to be handled by the caller
  }
};

export const deleteService = async (serviceId: string, token: string) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}admin/delete-service/${serviceId}`,
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

export const searchServices = async (term: string, token: string) => {
  try {
    const res = await axios.get(
      `${BASE_URL}admin/search-services?term=${term}`
    );
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
