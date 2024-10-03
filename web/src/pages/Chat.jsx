import React, { useEffect, useRef, useState } from "react";
import { useServices } from "../apis/services";
import NavbarAuth from "../components/NavBarAuth";
import { downloadFile, extractRootServices, getDocumentIds } from "../util";
import { GoSearch } from "react-icons/go";
import Avatar from "../assets/images/avatar.png";
import { TimeAgo, TimeAgoMessage } from "../components/common/TimeAgo";
import { GiConversation } from "react-icons/gi";
import { useAuth } from "../hooks/auth_context";
import {
  markMessageRead,
  searchChat,
  sendMessage,
  useChats,
  useMessagesChat,
} from "../apis/chat";
import { useQueryClient } from "@tanstack/react-query";
import { IoMdAttach } from "react-icons/io";
import { FaFile } from "react-icons/fa";
import { CircularProgress } from "@mui/material";
import { useParams } from "react-router-dom";
import { BroadcastChannel } from "broadcast-channel";
import {
  query,
  collection,
  orderBy,
  onSnapshot,
  limit,
  Firestore,
  where,
  doc,
} from "firebase/firestore";
import { db } from "../config/firebase_config";
export const ChatPage = () => {
  const { isLoading, error, data } = useServices();
  const [isSearchVisible, setSearchVisible] = useState(false);
  const { currentUser } = useAuth();
  const chatsData = useChats(currentUser.userId, currentUser.accessToken);
  let { chatRef } = useParams();
  let [chatsLastMessage, setChatsLastMessage] = useState([]);
  let [chatId, setChatId] = useState(chatRef || null);
  let [chat, setChat] = useState(null);

  let messagesData = useMessagesChat(chatId, currentUser.accessToken);
  const queryClient = useQueryClient(); // Get the query client instance
  let [term, setTerm] = useState("");
  let [loadingSearch, setLoadingSearch] = useState(false);
  let [searchedChats, setSearchedChats] = useState([]);

  const handleSearchToggle = () => {
    setSearchVisible(!isSearchVisible);
    setTerm("");
    setSearchedChats([]);
  };
  let [chats, setChats] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "chats"));
    const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
      const chats = [];
      QuerySnapshot.forEach((doc) => {
        chats.push({ ...doc.data(), id: doc.id });
      });
      setChats(
        chats.filter((chat) => {
          let users = getDocumentIds(chat.users);
          if (users.includes(currentUser.userId)) return chat;
        })
      );
    });

    return () => unsubscribe;
  }, [currentUser.userId]);

  const handleMessageAsRead = async (chatId) => {
    const chatData = {
      chatId: chatId,
      userId: currentUser.userId,
    };
    try {
      await markMessageRead(chatData, currentUser.accessToken);
    } catch (e) {}
  };

  const handleSelectedChat = (chatId) => {
    setChatId(chatId);
    setChat(
      chatsData.data.filter((chat) => {
        return chat.chatId === chatId;
      })[0]
    );
  };

  useEffect(() => {
    if (chatId && chatsData.data) {
      handleSelectedChat(chatId);
    }
  }, [chatId, chatsData.data]);

  const handleSearchChat = async () => {
    try {
      setLoadingSearch(true);
      if (term) {
        let result = await searchChat(
          term,
          currentUser.userId,
          currentUser.accessToken
        );
        setSearchedChats(result || []); // Ensure result is not null or undefined
        setLoadingSearch(false);
      }
    } catch (e) {
      setLoadingSearch(false);
    }
  };

  if (isLoading) return <div />;
  if (error) return <div>An error occurred while fetching the user data </div>;
  const services = extractRootServices(data);

  return (
    <>
      <NavbarAuth services={services} />
      <div className="max-w-[1240px] bg-white my-10 mx-auto flex gap-x-6">
        <div className="w-1/4 border border-slate-200 rounded-lg px-3 py-5">
          <div className="flex justify-between items-center h-10">
            {isSearchVisible ? (
              <>
                <input
                  type="text"
                  value={term}
                  onChange={(e) => {
                    setTerm(e.target.value);
                  }}
                  className="border border-gray-300 rounded-md px-2 py-1 outline-none"
                />
                <button disabled={loadingSearch} onClick={handleSearchChat}>
                  <GoSearch className="cursor-pointer" size={20} />
                </button>
                <span
                  onClick={handleSearchToggle}
                  className=" border-b text-lg border-black_04 cursor-pointer"
                >
                  Close
                </span>
              </>
            ) : (
              <>
                <p className="font-semibold text-lg">All messages</p>
                <GoSearch
                  className="cursor-pointer"
                  size={20}
                  onClick={handleSearchToggle}
                />
              </>
            )}
          </div>
          <div className="h-[500px] mt-5  overflow-y-auto flex flex-col gap-y-10">
            {isSearchVisible ? (
              isSearchVisible && loadingSearch ? (
                <div> searching ...</div>
              ) : term && searchedChats.length === 0 ? (
                <div> Sorry, we couldn't find any matches for your search.</div>
              ) : isSearchVisible && searchedChats.length !== 0 ? (
                searchedChats.map((chat) => {
                  return (
                    <div
                      key={chat.chatId}
                      onClick={() => {
                        handleSelectedChat(chat.chatId);
                        handleMessageAsRead(chat.chatId);
                      }}
                      className={
                        chatId === chat.chatId
                          ? `px-4 py-3 rounded-md flex items-center gap-1  cursor-pointer bg-slate-100`
                          : `px-4 py-3 rounded-md flex items-center gap-1  cursor-pointer `
                      }
                    >
                      <div className="w-1/4">
                        <img
                          loading="lazy"
                          src={
                            chat.otherUserPhotoUrl != null
                              ? chat.otherUserPhotoUrl
                              : Avatar
                          }
                          className="w-[50px] h-[50px] rounded-full object-cover"
                          alt=""
                        />
                      </div>
                      <div className="w-3/4">
                        <div className="flex justify-between items-center">
                          <p className="first-letter:uppercase font-semibold">
                            {chat.otherUserName}
                          </p>
                        </div>
                        <p
                          className={`text-xs text-black_04 mt-1 first-letter:uppercase w-20 truncate ${
                            !chat.users.includes(currentUser.userId)
                              ? "font-bold"
                              : ""
                          } `}
                        >
                          {chat.lastMessage}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div />
              )
            ) : chatsData.isLoading ? (
              <div> Loading...</div>
            ) : chatsData.isError ? (
              <div>Error occurs please refrech the page ! </div>
            ) : chatsData.data && chatsData.data.length !== 0 ? (
              chatsData.data.map((chat) => {
                return (
                  <div
                    key={chat.chatId}
                    onClick={() => {
                      handleSelectedChat(chat.chatId);
                      handleMessageAsRead(chat.chatId);
                    }}
                    className={
                      chatId === chat.chatId
                        ? `px-4 py-3 rounded-md flex items-center gap-1  cursor-pointer bg-slate-100`
                        : `px-4 py-3 rounded-md flex items-center gap-1  cursor-pointer `
                    }
                  >
                    <div className="w-1/4">
                      <img
                        loading="lazy"
                        src={
                          chat.otherUserPhotoUrl != null
                            ? chat.otherUserPhotoUrl
                            : Avatar
                        }
                        className="w-[50px] h-[50px] rounded-full object-cover"
                        alt=""
                      />
                    </div>
                    <div className="w-3/4">
                      <div className="flex justify-between items-center">
                        <p className="first-letter:uppercase font-semibold">
                          {chat.otherUserName}
                        </p>
                        <p className="text-[9px] text-gray-400">
                          {chat.lastMessageTime ? (
                            <TimeAgo time={chat.lastMessageTime} />
                          ) : null}
                        </p>
                      </div>
                      <p
                        className={`text-xs text-black_04 mt-1 first-letter:uppercase w-20 truncate ${
                          !chats
                            .find((c) => c.chatId === chat.chatId)
                            ?.lastMessageSeenBy.map((u) => u.id)
                            .includes(currentUser.userId)
                            ? "font-bold"
                            : ""
                        } `}
                      >
                        {
                          chats.find((c) => c.chatId === chat.chatId)
                            ?.lastMessage
                        }
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="h-full flex flex-col justify-center items-center">
                <GiConversation size={100} />
                <div className="mt-5 text-2xl font-semibold">
                  No Conversations
                </div>
                <p className=" mt-5 text-gray-700 ">
                  There are no conversations.
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="w-3/4 border border-slate-200 rounded-lg px-3 py-5">
          {messagesData.isLoading ? (
            <div className="flex justify-center items-start w-full h-full">
              <CircularProgress size={30} />
            </div>
          ) : !messagesData.data ? (
            <div className="h-full flex flex-col justify-center items-center">
              <GiConversation size={100} />
              <div className="mt-5 text-2xl font-semibold">
                Pick up where you left off
              </div>
              <p className=" mt-5 text-gray-700">
                Select a conversation and chat away.
              </p>
            </div>
          ) : (
            <Messages
              chatId={chatId}
              chat={chat || []}
              currentUser={currentUser}
            />
          )}
        </div>
      </div>
    </>
  );
};

const Messages = ({ chat, chatId, currentUser }) => {
  let [message, setMessage] = useState("");
  let [messages, setMessages] = useState("");
  const queryClient = useQueryClient(); // Get the query client instance
  let [file, setFile] = useState(null);
  let [isLoading, setIsLoading] = useState(false);

  const messageRef = useRef();

  useEffect(() => {
    if (chatId) {
      const documentRef = doc(db, "chats", chatId);
      const q = query(
        collection(db, "messages"),
        where("chatId", "==", documentRef)
      );
      const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
        const fetchedMessages = [];
        QuerySnapshot.forEach((doc) => {
          fetchedMessages.push({ ...doc.data(), id: doc.id });
        });
        const sortedMessages = fetchedMessages.sort(
          (a, b) => a.createdAt - b.createdAt
        );
        setMessages(sortedMessages);
      });
      return () => unsubscribe;
    }
  }, [chatId]);
  const handleSendMessage = async () => {
    if (message) {
      setIsLoading(true);
      const newMsg = {
        text: message,
        userSent: currentUser.userId,
      };

      await sendMessage(chat.chatId, newMsg, currentUser.accessToken, file);
      // await queryClient.invalidateQueries(["messageChat", chat.chatId]);
      queryClient.invalidateQueries(["chats", currentUser.userId]);
      setMessage("");
      setIsLoading(false);
      setFile(null);
    }
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (messageRef.current) {
      messageRef.current.scrollTop = messageRef.current.scrollHeight;
    }
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter" && message) {
      // Check if chat box is open
      event.preventDefault();
      handleSendMessage();
    }
  };
  const handleFileSelect = (event) => {
    let selectedFile = event.target.files[0];
    setFile(selectedFile);
  };
  const handleDownload = async (file) => {
    try {
      await downloadFile(file.url, file.name);
    } catch {
      alert("Could not download file");
    }
  };
  return (
    <div className="h-[550px] w-full flex flex-col">
      <div className="flex items-center mb-2">
        <img
          className="w-8 h-8 rounded-full object-cover mr-2"
          src={chat.otherUserPhotoUrl ? chat.otherUserPhotoUrl : Avatar}
          alt="User Avatar"
        />
        <div className="font-medium"> {chat && chat.otherUserName}</div>
      </div>
      <div className=" flex-1 h-full w-full overflow-y-auto" ref={messageRef}>
        <div className=" h-full px-4 py-2">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col justify-center items-center">
              <GiConversation size={40} />
              <div className="mt-2 text-sm text-center font-semibold">
                Open the dialogue with a friendly hello!
              </div>
            </div>
          ) : (
            messages.map((message) => {
              return (
                <div key={message.messageId}>
                  <div />
                  {message.userSent.id === currentUser.userId ? (
                    <div className="flex flex-col items-end mb-2">
                      <div>
                        {message.imageUrl && (
                          <img
                            src={message.imageUrl.url}
                            alt=""
                            onClick={() => {
                              handleDownload(message.imageUrl);
                            }}
                            className="w-40 h-40 rounded-md cursor-pointer object-cover mb-3"
                          />
                        )}
                        {message.fileUrl && (
                          <p
                            onClick={() => {
                              handleDownload(message.fileUrl);
                            }}
                            className=" bg-blue-400 py-2 px-3 cursor-pointer text-white rounded-md object-cover mb-3"
                          >
                            {message.fileUrl.name}
                          </p>
                        )}
                        <div className="bg-blue-500 overflow-auto  break-words text-white rounded-lg p-2  shadow mr-2 max-w-sm">
                          <div className=" text-wrap">{message.text}</div>

                          <p className="text-[9px] text-slate-50">
                            <TimeAgoMessage time={message.createdAt} />
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      {message.imageUrl && (
                        <img
                          src={message.imageUrl.url}
                          alt=""
                          onClick={() => {
                            handleDownload(message.imageUrl);
                          }}
                          className="w-40 h-40 rounded-md cursor-pointer object-cover mb-3"
                        />
                      )}
                      {message.fileUrl && (
                        <p
                          onClick={() => {
                            handleDownload(message.fileUrl);
                          }}
                          className=" bg-slate-100 py-2 px-3  cursor-pointer text-black_04 rounded-md object-cover max-w-sm mb-3"
                        >
                          {message.fileUrl.name}
                        </p>
                      )}
                      <div className="bg-white rounded-lg p-2 break-words shadow mb-2 max-w-sm">
                        {message.text}
                        <p className="text-[9px] text-gray-500 ">
                          {" "}
                          <TimeAgoMessage time={message.createdAt} />
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
      <div className="  px-4 py-2">
        <div className="flex items-center">
          <input
            className="w-full border rounded-lg py-2 px-4 mr-2"
            type="text"
            name="message"
            value={message}
            onKeyDown={handleKeyDown}
            onChange={(e) => {
              setMessage(e.target.value);
            }}
            autoComplete="off"
            placeholder="Send message..."
          />
          <button
            disabled={!message || isLoading}
            onClick={handleSendMessage}
            className={`bg-primary hover:bg-blue-500 text-white font-medium py-2 px-4 rounded-xl ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Sending..." : "Send"}
          </button>
        </div>
        <div className="mt-5 flex items-center">
          <label
            htmlFor="fileInput"
            className="cursor-pointer"
            title="Max file size: 50MB"
          >
            <IoMdAttach size={20} />
          </label>
          <input
            type="file"
            id="fileInput"
            accept="image/*,.doc,.pdf"
            className="hidden"
            onChange={handleFileSelect}
          />
          {file && (
            <div className="flex items-center ml-3  h-8 ">
              {file.type.startsWith("image") ? (
                <img
                  src={URL.createObjectURL(file)}
                  alt="Uploaded File"
                  className="h-8 w-8 object-cover rounded-full"
                />
              ) : (
                <div className="text-sm">{file.name}</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * :  ? (
              <div> searching ...</div>
            ) :  
 * 
 */
