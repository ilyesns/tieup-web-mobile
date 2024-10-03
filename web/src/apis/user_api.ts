import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../util";

interface UserData {
  username: string;
  email: string;
  numberPhone?: string;
}

const createUser = async (userData: UserData): Promise<any> => {
  try {
    // Make a POST request to the server with the user data
    const response = await axios.post(`${BASE_URL}user/create`, userData);
    return response.data; // Return the response data
  } catch (error) {
    // Handle errors
    console.error("Error creating user:", error);
    throw error; // Rethrow the error to handle it in the calling code
  }
};
const updateUser = async (
  userData: UserData,
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

const mayBeCreateUser = async (userData: UserData): Promise<any> => {
  try {
    // Make a POST request to the server with the user data
    const response = await axios.post(
      `${BASE_URL}user/may-be-create`,
      userData
    );
    return response.data; // Return the response data
  } catch (error) {
    // Handle errors
    console.error("Error creating user:", error);
    throw error; // Rethrow the error to handle it in the calling code
  }
};
const getUser = async (userId: string, accessToken: string): Promise<any> => {
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

const useFreelancerDetails = (userId: string) => {
  return useQuery({
    queryKey: ["freelancerDetails", userId],
    queryFn: async () => {
      if (!userId) {
        return [];
      }
      const res = await axios.get(
        `${BASE_URL}freelancer/read-details/${userId}`
      ); // Assuming this is the endpoint to get notifications
      return res.data;
    },
    staleTime: 600000,
  });
};

const useGetUser = (userId: string, accessToken: string) => {
  return useQuery({
    queryKey: ["currentUser", userId],
    queryFn: async () => {
      if (!userId) {
        return [];
      }
      const response = await axios.get(`${BASE_URL}user/read/${userId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return response.data; // Return the response data
    },
    staleTime: 600000,
    enabled: !!userId && !!accessToken,
  });
};

const getFreelancer = async (userId: string): Promise<any> => {
  try {
    // Make a POST request to the server with the user data and access token in headers
    const response = await axios.get(
      `${BASE_URL}user/freelancer-profile/${userId}`
    );
    return response.data;
  } catch (error) {
    // Handle errors
    console.error("Error updating user:", error);
    throw error; // Rethrow the error to handle it in the calling code
  }
};
const switchRole = async (
  userId: string,
  accessToken: string
): Promise<any> => {
  try {
    // Make a POST request to the server with the user data and access token in headers
    const response = await axios.post(`${BASE_URL}user/switch-role/${userId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    // Handle errors
    console.error("Error updating user:", error);
    throw error; // Rethrow the error to handle it in the calling code
  }
};

const becomeFreelancer = async (
  userData: UserData,
  userId: string,
  accessToken: string
): Promise<any> => {
  try {
    // Make a POST request to the server with the user data and access token in headers
    const response = await axios.post(
      `${BASE_URL}user/become-freelancer/${userId}`,
      userData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    // Handle errors
    console.error("Error updating user:", error);
    throw error; // Rethrow the error to handle it in the calling code
  }
};
const sendEmailVerif = async (
  userId: string,
  accessToken: string
): Promise<any> => {
  try {
    // Make a POST request to the server with the user data and access token in headers
    const response = await axios.post(
      `${BASE_URL}user/send-email-verification/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    // Handle errors
    console.error("Error updating user:", error);
    throw error; // Rethrow the error to handle it in the calling code
  }
};
const updateFreelancerField = async (
  userData: UserData,
  userId: string,
  accessToken: string
): Promise<any> => {
  try {
    // Make a POST request to the server with the user data and access token in headers
    const response = await axios.post(
      `${BASE_URL}user/update-freelancer-field/${userId}`,
      userData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    // Handle errors
    console.error("Error updating user:", error);
    throw error; // Rethrow the error to handle it in the calling code
  }
};

const uploadPhoto = async (userId: string, file: File) => {
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

export {
  useGetUser,
  switchRole,
  getUser,
  getFreelancer,
  createUser,
  uploadPhoto,
  mayBeCreateUser,
  sendEmailVerif,
  useFreelancerDetails,
  updateUser,
  becomeFreelancer,
  updateFreelancerField,
};
