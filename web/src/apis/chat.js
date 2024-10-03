import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../util";

import axios from "axios";

export const useChats = (userId, accessToken) => {
  return useQuery({
    queryKey: ["chats", userId],
    queryFn: async () => {
      if (!userId || !accessToken) {
        return [];
      }
      const res = await axios.get(`${BASE_URL}chat/read-chats/${userId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }); // Assuming this is the endpoint to get notifications
      return res.data;
    },
    enabled: !!userId && !!accessToken,

    staleTime: 600000,
  });
};

export const useMessagesChat = (chatId, accessToken) => {
  return useQuery({
    queryKey: ["messageChat", chatId],
    queryFn: async () => {
      if (!chatId || !accessToken) {
        return [];
      }
      const res = await axios.get(
        `${BASE_URL}chat/read-messages-chat/${chatId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      ); // Assuming this is the endpoint to get notifications
      return res.data;
    },
    enabled: !!chatId && !!accessToken,

    staleTime: 600000,
  });
};

export const getOrCreatChat = async (data, token) => {
  const res = await axios.post(`${BASE_URL}chat/read-create`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }); // Assuming this is the endpoint to get notifications
  return res.data;
};
export const checkChat = async (data, token) => {
  const res = await axios.post(`${BASE_URL}chat/check-chat`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }); // Assuming this is the endpoint to get notifications
  return res.data;
};

export const searchChat = async (term, userId, token) => {
  const res = await axios.post(
    `${BASE_URL}chat/search/${userId}`,
    { term },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  ); // Assuming this is the endpoint to get notifications
  return res.data;
};

export const sendMessage = async (chatId, data, token, file) => {
  const formData = new FormData();
  formData.append("text", data.text);
  formData.append("userSent", data.userSent);
  if (file) {
    formData.append("file", file);
  }

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  };

  const res = await axios.post(
    `${BASE_URL}chat/send-message/${chatId}`,
    formData,
    config
  );
  return res.data;
};
export const markMessageRead = async (chatData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const res = await axios.post(
    `${BASE_URL}chat/mark-message-read/${chatData.chatId}`,
    chatData,
    config
  );
  return res.data;
};
