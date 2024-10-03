import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../util";

import axios from "axios";

export const useFreelancerPortfolio = (userId) => {
  return useQuery({
    queryKey: ["freelancerPortfolio", userId],
    queryFn: async () => {
      if (!userId) {
        return [];
      }

      try {
        const res = await axios.get(
          `${BASE_URL}freelancer/read-portfolio/${userId}`
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

export const addPortfolioItem = async (data, token) => {
  try {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("link", data.link);
    if (data.images) {
      data.images.forEach((image, index) => {
        formData.append(`images`, image); // Ensure "images" field name
      });
    }

    // Add video to formData
    if (data.videos) {
      data.videos.forEach((video, index) => {
        formData.append(`videos`, video); // Ensure "images" field name
      });
    }

    const response = await axios.post(
      `${BASE_URL}freelancer/add-portfolio-item/${data.freelancerId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data", // Ensure correct content type
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    //  throw error; // Rethrow the error to be handled by the caller
  }
};
export const deletePortfolioItem = async (data, token) => {
  try {
    const response = await axios.post(
      `${BASE_URL}freelancer/delete-portfolio-item/${data.freelancerId}`,
      data,
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
