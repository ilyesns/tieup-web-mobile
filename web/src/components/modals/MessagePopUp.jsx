import React, { useState, useRef, useEffect } from "react";
import { TimeAgo } from "../common/TimeAgo";
import { GiConversation } from "react-icons/gi";
import {
  getOrCreatChat,
  sendMessage,
  useChats,
  useMessagesChat,
} from "../../apis/chat";
import Avatar from "../../assets/images/avatar.png";
import { IoMdAttach } from "react-icons/io";
import { useAuth } from "../../hooks/auth_context";
import { useQueryClient } from "@tanstack/react-query";
export const MessagePopUp = React.memo(
  ({ isVisible, onClose, chatRef, recipient }) => {
    const { currentUser } = useAuth();
    let [chatId, setChatId] = useState(chatRef);
    let [chat, setChat] = useState(null);
    const chatsData = useChats(currentUser.userId, currentUser.accessToken);

    let messagesData = useMessagesChat(
      chatId || chatRef,
      currentUser.accessToken
    );
    useEffect(() => {
      if (chatRef) {
        setChat(
          chatsData.data.filter((chat) => {
            return chat.chatId === chatRef;
          })[0]
        );
      }
    }, [chatRef, chatsData.data]);
    if (!isVisible) return null;

    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center">
        <div className="flex flex-col">
          <button
            onClick={() => {
              onClose();
            }}
            className="place-self-end text-white text-xl"
          >
            X
          </button>
          <div className="w-full md:w-[700px] h-[600px] px-6 py-5 bg-white rounded-md flex items-center justify-center ">
            <Messages
              setChatId={setChatId}
              messages={messagesData.data || []}
              currentUser={currentUser}
              recipient={recipient}
            />
          </div>
        </div>
      </div>
    );
  }
);

const Messages = ({ messages, currentUser, recipient, setChatId }) => {
  let [message, setMessage] = useState("");
  const queryClient = useQueryClient(); // Get the query client instance
  let [file, setFile] = useState(null);
  let [isLoading, setIsLoading] = useState(false);
  const handleSendMessage = async () => {
    if (message) {
      setIsLoading(true);
      const newMsg = {
        text: message,
        userSent: currentUser.userId,
      };

      const chat = {
        senderId: currentUser.userId,
        recipientId: recipient.userId,
      };
      const result = await getOrCreatChat(chat, currentUser.accessToken);
      setChatId(result);
      await sendMessage(result, newMsg, currentUser.accessToken, file);
      queryClient.invalidateQueries(["messageChat", result]);
      queryClient.invalidateQueries(["chats", currentUser.userId]);
      setMessage("");
      setIsLoading(false);
      setFile(null);
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

  return (
    <>
      <div className="w-full h-full flex flex-col">
        <div className="flex items-center mb-2">
          <img
            className="w-8 h-8 rounded-full mr-2"
            src={recipient.photoURL ? recipient.photoURL : Avatar}
            alt="User Avatar"
          />
          <div className="font-medium"> {recipient && recipient.username}</div>
        </div>
        <div className=" flex-1 h-full overflow-y-auto">
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
                    {message.userSent === currentUser.userId ? (
                      <div className="flex  items-center justify-end mb-2">
                        <div>
                          {message.imageUrl && (
                            <img
                              src={message.imageUrl.url}
                              alt=""
                              className="w-40 h-40 rounded-md object-cover mb-3"
                            />
                          )}
                          {message.fileUrl && (
                            <p className=" bg-blue-400 py-2 px-3 cursor-pointer text-white rounded-md object-cover mb-3">
                              {message.fileUrl.name}
                            </p>
                          )}
                          <div className="bg-blue-500 text-white rounded-lg p-2 shadow mr-2 max-w-sm">
                            {message.text}
                            <p className="text-[9px] text-slate-50 ">
                              {" "}
                              <TimeAgo time={message.createdAt} />
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
                            className="w-40 h-40 rounded-md object-cover mb-3"
                          />
                        )}
                        {message.fileUrl && (
                          <p className=" bg-slate-100 py-2 px-3 cursor-pointer text-black_04 rounded-md object-cover max-w-sm mb-3">
                            {message.fileUrl.name}
                          </p>
                        )}
                        <div className="bg-white rounded-lg p-2 shadow mb-2 max-w-sm">
                          {message.text}
                          <p className="text-[9px] text-gray-500 ">
                            {" "}
                            <TimeAgo time={message.createdAt} />
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
    </>
  );
};
