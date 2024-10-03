import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../util";
import axios from "axios";

export const useFreelancerOffers = (userId: string, token: string) => {
  return useQuery({
    queryKey: ["freelancerOffers", userId],
    queryFn: async () => {
      if (!userId) {
        return [];
      }
      const config = {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      };
      const res = await axios.get(
        `${BASE_URL}freelancer/offer/read-all/${userId}`,
        config
      ); // Assuming this is the endpoint to get notifications
      return res.data;
    },
    staleTime: 600000,
    enabled: !!userId,
  });
};

export const useFreelancerOffer = (offerId: string, token: string) => {
  return useQuery({
    queryKey: ["freelancerOffer", offerId],
    queryFn: async () => {
      if (!offerId) {
        return [];
      }
      const config = {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      };
      const res = await axios.get(
        `${BASE_URL}freelancer/offer/read/${offerId}`,
        config
      ); // Assuming this is the endpoint to get notifications
      return res.data;
    },
    staleTime: 600000,
    enabled: !!offerId,
  });
};

export const createOffer = async (
  userId: string,
  token: string,
  offerData: any
) => {
  try {
    const response = await axios.post(
      `${BASE_URL}freelancer/offer/add/${userId}`,
      offerData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating offer:", error);
  }
};
export const updateOffer = async (
  offerId: string,
  token: string,
  offerData: any
) => {
  try {
    const response = await axios.post(
      `${BASE_URL}freelancer/offer/update/${offerId}`,
      offerData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating offer:", error);
  }
};
export const createPlan = async (
  offerId: string,
  token: string,
  planData: any
) => {
  try {
    const response = await axios.post(
      `${BASE_URL}freelancer/offer/add-plan/${offerId}`,
      planData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
  }
};
export const updatePlan = async (
  offerId: string,
  token: string,
  planData: any
) => {
  try {
    const response = await axios.post(
      `${BASE_URL}freelancer/offer/update-plan/${offerId}`,
      planData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
  }
};

export const createGallery = async (
  offerId: string,
  token: string,
  galleryData: any
) => {
  try {
    const formData = new FormData();

    if (galleryData.images) {
      galleryData.images.forEach((image: File, index: number) => {
        formData.append(`images`, image); // Ensure "images" field name
      });
    }

    // Add video to formData
    if (galleryData.video) {
      formData.append("video", galleryData.video[0]); // Ensure "video" field name
    }

    // Add document to formData
    if (galleryData.document) {
      formData.append("document", galleryData.document[0]); // Ensure "document" field name
    }

    const response = await axios.post(
      `${BASE_URL}freelancer/offer/add-gallery/${offerId}`,
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
export const updateGallery = async (
  offerId: string,
  token: string,
  galleryData: any
) => {
  try {
    const formData = new FormData();

    if (galleryData.images) {
      galleryData.images.forEach((image: File, index: number) => {
        formData.append(`images`, image); // Ensure "images" field name
      });
    }

    // Add video to formData
    if (galleryData.video) {
      formData.append("video", galleryData.video[0]); // Ensure "video" field name
    }

    // Add document to formData
    if (galleryData.document) {
      formData.append("document", galleryData.document[0]); // Ensure "document" field name
    }

    const response = await axios.post(
      `${BASE_URL}freelancer/offer/update-gallery/${offerId}`,
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
export const deleteGalleryItem = async (
  offerId: string,
  token: string,
  item: any
) => {
  try {
    const response = await axios.post(
      `${BASE_URL}freelancer/offer/delete-gallery-item/${offerId}`,
      item,
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
