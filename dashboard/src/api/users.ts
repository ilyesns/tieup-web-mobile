import axios from "axios";
import { BASE_URL } from "../util/constant";
import { useQuery } from "@tanstack/react-query";
import { useMutation } from "react-query";

export const useUsers = (
  token: string,
  page: number,
  pageSize: number,
  role: string
) => {
  return useQuery({
    queryKey: ["users", page],
    queryFn: async () => {
      const res = await axios.get(
        `${BASE_URL}admin/read-all-users?role=${role}&page=${page}&pageSize=${pageSize}`
      );
      return res.data;
    },

    staleTime: 600000,
  });
};

export const useUsersNumber = () => {
  return useQuery({
    queryKey: ["usersNumber"],
    queryFn: async () => {
      const res = await axios.get(`${BASE_URL}admin/read-all-users-number`);
      return res.data;
    },

    staleTime: 600000,
  });
};

export const searchUsers = async (token: string, searchValue: string) => {
  try {
    const res = await axios.get(
      `${BASE_URL}admin/search-users?term=${searchValue}`
    );
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const updateUser = async (
  userData: any,
  userId: string,
  accessToken: string
): Promise<any> => {
  try {
    // Make a POST request to the server with the user data and access token in headers
    const response = await axios.post(
      `${BASE_URL}user/update/${userId}`,
      userData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data; // Return the response data
  } catch (error) {
    // Handle errors
    console.error("Error updating user:", error);
    throw error; // Rethrow the error to handle it in the calling code
  }
};

export const getUser = async (
  userId: string,
  accessToken: string
): Promise<any> => {
  try {
    // Make a POST request to the server with the user data
    const response = await axios.get(`${BASE_URL}user/read/${userId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data; // Return the response data
  } catch (error) {
    // Handle errors
    console.error("Error getting user:", error);
    throw error; // Rethrow the error to handle it in the calling code
  }
};

export const useWallet = (userId: string) => {
  return useQuery({
    queryKey: ["adminWallet", userId],
    queryFn: async () => {
      if (!userId) {
        return [];
      }
      const res = await axios.get(`${BASE_URL}admin/wallet-read/${userId}`); // Assuming this is the endpoint to get notifications
      return res.data;
    },
    staleTime: 600000,
  });
};

export const uploadPhoto = async (userId: string, file: File) => {
  try {
    if (!userId || !file) {
      throw new Error("Missing userId or file");
    }

    const formData = new FormData();
    formData.append("file", file);

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    const res = await axios.post(
      `${BASE_URL}user/upload-photo/${userId}`,
      formData,
      config
    );

    return res.data; // Return data if needed
  } catch (error) {
    console.error("Error uploading photo:", error);
    // You can add error handling logic here
    throw error; // Rethrow the error if necessary
  }
};
