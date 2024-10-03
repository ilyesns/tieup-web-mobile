import React, { useState, useEffect, useRef } from "react";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { Button } from "./common/Button";
import { IoNotificationsOutline } from "react-icons/io5";
import { LuMessagesSquare } from "react-icons/lu";
import { MdFavoriteBorder } from "react-icons/md";
import { LuInbox } from "react-icons/lu";

import { MdLanguage } from "react-icons/md";

import Avatar from "../assets/images/avatar.png";

import CategoryBar from "./Category_bar";
import { useNotifications } from "../apis/notification";
import { markMessageRead, useChats } from "../apis/chat";
import { useClientOrders } from "../apis/order";
import { signOutUser } from "../auth/firebase_auth";
import { Link, useNavigate } from "react-router-dom";
import { switchRole, useGetUser } from "../apis/user_api";
import { useAuth } from "../hooks/auth_context";
import axios from "axios";
import {
  BASE_URL,
  convertTimestampToComponents,
  filterChatsByLastMessageSeen,
  getDocumentIds,
} from "../util";
import { TimeAgo } from "./common/TimeAgo";
import { useQueryClient } from "@tanstack/react-query";
import TimestampToDate from "./common/TimestampToDate";
import { collection, doc, onSnapshot, query } from "firebase/firestore";
import { db } from "../config/firebase_config";

const NavbarAuth = ({ services }) => {
  const [menu, setMenu] = useState(false);
  const { currentUser, isLoggedIn } = useAuth();
  const user = useGetUser(currentUser.userId, currentUser.accessToken);
  let [userData, setUserData] = useState([]);
  let [termSearch, setTermSearch] = useState("");
  const queryClient = useQueryClient(); // Get the query client instance
  const navigate = useNavigate();
  useEffect(() => {
    if (user.data) {
      setUserData(user.data);
    }
  }, [user.data]);

  const toggleMenu = () => {
    setMenu(!menu);
  };
  const handleSearchSubmit = (event) => {
    event.preventDefault();

    // Navigate to search page with query parameter

    if (termSearch) navigate(`/search?term=${termSearch}`);
  };

  const handleSignOut = async () => {
    await signOutUser();
    navigate("/");
  };
  const handleSwitch = async () => {
    try {
      if (userData.role === "client") {
        await switchRole(currentUser.userId, currentUser.accessToken);

        navigate("/dashboard");
        window.location.reload();
      } else {
        await switchRole(currentUser.userId, currentUser.accessToken);
        navigate("/home");
        window.location.reload();
      }

      queryClient.invalidateQueries(["currentUser", currentUser.userId]);
    } catch (e) {}
  };

  return (
    <div
      className={
        "  top-0 w-full text-black bg-white z-10 ease-in-out duration-500"
      }
    >
      <div
        className={`flex justify-between items-center h-24 max-w-[1240px] mx-auto px-4 ${"text-black"} z-50`}
      >
        <div className="flex-grow flex items-center">
          <h1 className=" text-3xl font-bold text-primary mr-6">
            <Link to={`/`}>TIE-UP.</Link>{" "}
          </h1>
          {
            <div className="flex-grow mr-6  ease-in-out duration-500 opacity-100">
              <form>
                <label
                  htmlFor="search"
                  className="mb-2 text-sm font-medium text-gray-900 sr-only cursor-pointer dark:text-white"
                >
                  What service are you looking for today ?
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-500 dark:text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 20"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                      />
                    </svg>
                  </div>
                  <input
                    type="search"
                    id="search"
                    value={termSearch}
                    onChange={(e) => {
                      setTermSearch(e.target.value);
                    }}
                    className="block w-full p-3 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50   dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white "
                    placeholder=" What service are you looking for today ?"
                    required
                  />
                  <button
                    onClick={handleSearchSubmit}
                    type="submit"
                    className="text-white absolute end-2.5 bottom-2.5 bg-primary hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-1 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Search
                  </button>
                </div>
              </form>
            </div>
          }
        </div>

        <div className="hidden md:flex  items-center">
          <div className="flex items-center p-4 gap-7 ">
            <NotificationMenu
              user={userData}
              accessToken={currentUser.accessToken}
            />
          </div>

          {userData.isBeenFreelancer ? (
            <p
              onClick={handleSwitch}
              className="p-4 font-bold text-primary cursor-pointer"
            >
              {userData.role === "freelancer"
                ? "Switch to Buyer"
                : "Switch to Seller"}
            </p>
          ) : (
            <p
              onClick={() => {
                navigate("/become_seller");
              }}
              className="p-4 font-bold text-primary cursor-pointer"
            >
              Become a Seller
            </p>
          )}

          <UserMenu user={userData} />
        </div>
        {/** Mobile Menu */}
        <div className="block md:hidden" onClick={toggleMenu}>
          {menu ? (
            <AiOutlineClose size={20} className="text-black" />
          ) : (
            <AiOutlineMenu size={20} className="text-black" />
          )}
        </div>
        <div
          className={
            menu
              ? "fixed p-2 z-40 left-0 top-0 w-[60%] h-full text-white border-r border-r-gray-900  bg-[#000300] ease-in-out duration-500"
              : "ease-in-out p-2 duration-500 fixed text-white  h-full left-[-100%]"
          }
        >
          <div className=" mt-10 mb-2 flex gap-3 items-center  ">
            <img
              className="w-14 h-14 rounded-full"
              alt=""
              src={userData.photoURL ? userData.photoURL : Avatar}
            />
            <p className="font-bold">
              {userData.firstName + " " + userData.lastName}
            </p>
          </div>
          <div className="text-gray-300 font-semibold pl-2 flex flex-col gap-3 ">
            <Link to="/home">
              {" "}
              <p className="hover:bg-gray-500 p-2 rounded cursor-pointer">
                Home
              </p>
            </Link>
            <Link to="/profile">
              {" "}
              <p className="hover:bg-gray-500 p-2 rounded cursor-pointer">
                Profile
              </p>
            </Link>

            {userData.role === "freelancer" && (
              <Link to="/dashboard">
                <p className="hover:bg-gray-500 p-2 rounded cursor-pointer">
                  Dashbord
                </p>
              </Link>
            )}
            <p className="hover:bg-gray-500 p-2 rounded cursor-pointer">
              Inbox
            </p>
            <Expander
              title={"Browse services"}
              children={
                <div>
                  {services.map((service) => {
                    return (
                      <p
                        onClick={toggleMenu}
                        key={service.documentRef}
                        className="hover:bg-gray-500 p-2 rounded cursor-pointer"
                      >
                        <Link to={`/subservices/${service.documentRef}`}>
                          {service.name}
                        </Link>
                      </p>
                    );
                  })}
                </div>
              }
            />
            {userData.isBeenFreelancer ? (
              <p
                onClick={handleSwitch}
                className="hover:bg-gray-500 p-2 rounded cursor-pointer"
              >
                {userData.role === "freelancer"
                  ? "Switch to Buyer"
                  : "Switch to Seller"}
              </p>
            ) : (
              <p
                onClick={() => {
                  navigate("/become_seller");
                }}
                className="hover:bg-gray-500 p-2 rounded cursor-pointer"
              >
                Become a Seller
              </p>
            )}

            <p
              onClick={handleSignOut}
              className="hover:bg-gray-500 p-2 rounded cursor-pointer"
            >
              Logout
            </p>
            <div className="hover:bg-gray-500 p-2 rounded cursor-pointer">
              <div className="flex items-center flex-row gap-2 ">
                <MdLanguage size={20} />
                <span>English</span>
              </div>
            </div>
          </div>

          <Button label={"Join"} />
        </div>
      </div>
      <div className="md:block hidden">
        {
          <div className="ease-in-out duration-500 scale-y-100">
            <CategoryBar services={services} />
          </div>
        }
      </div>
    </div>
  );
};

const Expander = ({ title, children }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpansion = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="  rounded-md overflow-hidden">
      <div
        className="flex items-center justify-between pl-2 py-3 cursor-pointer transition-all duration-300"
        onClick={toggleExpansion}
        style={{ backgroundColor: expanded ? "#f0f0f0" : "transparent" }}
      >
        <h1 className="text-base font-medium">{title}</h1>
        <span
          className={`transform transition-transform ${
            expanded ? "rotate-180" : "rotate-0"
          }`}
        >
          ▼
        </span>
      </div>
      <div
        className={`overflow-y-auto border-t border-gray-200 transition-max-height duration-300 ${
          expanded ? "max-h-72" : "max-h-0"
        }`}
      >
        <div className="p-3">{children}</div>
      </div>
    </div>
  );
};

const NotificationMenu = ({ user, accessToken }) => {
  const [isNotificationMenuOpen, setIsNotificationMenuOpen] = useState(false);
  const [isMessageMenuOpen, setIsMessageMenuOpen] = useState(false);
  const [isFavoriteMenuOpen, setIsFavoriteMenuOpen] = useState(false);
  const [isOrderMenuOpen, setIsOrderMenuOpen] = useState(false);
  const notificationRef = useRef(null);
  const messageRef = useRef(null);
  const favoriteRef = useRef(null);
  const orderRef = useRef(null);
  const navigate = useNavigate();
  let notificationData = useNotifications(user.userId);
  let chatsData = useChats(user.userId, accessToken);
  let [chats, setChats] = useState([]);
  let ordersData = useClientOrders(user.userId, accessToken);
  let [notifChat, setNotifChat] = useState(0);
  let [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setIsLoading(true);
    const q = query(collection(db, "chats"));
    const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
      const chats = [];
      QuerySnapshot.forEach((doc) => {
        chats.push({ ...doc.data(), id: doc.id });
      });
      setChats(
        chats.filter((chat) => {
          let users = getDocumentIds(chat.users);
          if (users.includes(user.userId)) return chat;
        })
      );
      setNotifChat(filterChatsByLastMessageSeen(chats, user.userId).length);
    });
    setIsLoading(false);

    return () => unsubscribe;
  }, [user.userId]);

  useEffect(() => {
    const handleDocumentClick = (e) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(e.target)
      ) {
        setIsNotificationMenuOpen(false);
      }
      if (messageRef.current && !messageRef.current.contains(e.target)) {
        setIsMessageMenuOpen(false);
      }
      if (favoriteRef.current && !favoriteRef.current.contains(e.target)) {
        setIsFavoriteMenuOpen(false);
      }
      if (orderRef.current && !orderRef.current.contains(e.target)) {
        setIsOrderMenuOpen(false);
      }
    };

    document.addEventListener("click", handleDocumentClick);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  const handleMessageAsRead = async (chatId) => {
    const chatData = {
      chatId: chatId,
      userId: user.userId,
    };
    try {
      await markMessageRead(chatData, user.accessToken);
    } catch (e) {}
  };

  const toggleNotificationMenu = () => {
    setIsNotificationMenuOpen(!isNotificationMenuOpen);
  };

  const toggleMessageMenu = () => {
    setIsMessageMenuOpen(!isMessageMenuOpen);
  };

  const toggleFavoriteMenu = () => {
    setIsFavoriteMenuOpen(!isFavoriteMenuOpen);
  };
  const toggleOrderMenu = () => {
    setIsOrderMenuOpen(!isOrderMenuOpen);
  };
  return (
    <div className="flex items-center space-x-4">
      {/* Notification Icon */}
      <div ref={notificationRef} className="relative inline-block">
        <IoNotificationsOutline
          size={23}
          className="cursor-pointer hover:text-primary"
          onClick={toggleNotificationMenu}
        />
        {isNotificationMenuOpen && (
          <div className="absolute top-10 right-0 z-40 bg-white border border-gray-200 shadow-md rounded-md w-[300px] h-[200px] overflow-auto">
            <div className="flex items-center justify-between mb-2 p-2 ">
              <h2 className="text-lg font-semibold flex items-center gap-2 ">
                <IoNotificationsOutline /> Notification
              </h2>
              {/* Close button */}
            </div>
            {/* Notification Menu Content */}

            {notificationData.isLoading ? (
              <div>Loading..</div>
            ) : notificationData.error ? (
              <div>error</div>
            ) : notificationData.data.length === 0 ? (
              <div className="flex justify-center items-center w-full h-1/2">
                Empty list
              </div>
            ) : (
              <div className="px-3 flex flex-col gap-3 ">
                {notificationData.data.map((notification) => {
                  return (
                    <div key={notification.id}>
                      {/* Messages Menu Content */}
                      <>
                        <IoNotificationsOutline size={23} />
                        <p>
                          <p className="text-[13px]">
                            Find a comprehensive software development agency to
                            handle it all.
                          </p>
                          <p className="text-[10px] text-gray-400 ">1 month</p>
                        </p>
                      </>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Message Icon */}
      <div ref={messageRef} className="relative inline-block">
        <div className="relative">
          <LuMessagesSquare
            size={23}
            className="cursor-pointer hover:text-primary"
            onClick={toggleMessageMenu}
          />
          {notifChat >= 1 && (
            <span className="bg-red-500 text-white text-xs font-bold py-1 px-2 rounded-full absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2">
              {notifChat}
            </span>
          )}
        </div>
        {isMessageMenuOpen && (
          <div className="absolute top-10 right-0 z-40 bg-white border border-gray-200 shadow-md rounded-md w-[300px] h-[200px] overflow-auto">
            <div className="flex items-center justify-between mb-2 p-2  ">
              <h2 className="text-lg font-semibold flex items-center gap-2 ">
                <LuMessagesSquare /> Inbox
              </h2>
              {/* Close button */}
            </div>

            {chatsData.isLoading || isLoading ? (
              <div>Loading..</div>
            ) : chatsData.error ? (
              <div>error</div>
            ) : chatsData.data.length === 0 ? (
              <div className="flex justify-center items-center w-full h-1/2">
                Empty list
              </div>
            ) : (
              <div className="px-3 flex flex-col gap-3 ">
                {chatsData.data.map((chat) => {
                  return (
                    <div
                      key={chat.chatId}
                      onClick={() => {
                        handleMessageAsRead(chat.chatId);
                      }}
                    >
                      {/* Messages Menu Content */}
                      <Link to={`/chat/${chat.chatId}`}>
                        <div className="w-full hover:text-gray-400 cursor-pointer flex gap-2 items-center">
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
                          <div>
                            <div className="  flex justify-between   items-center ">
                              <p className="text-base text-black_04 font-semibold first-letter:uppercase ">
                                {chat.otherUserName}
                              </p>
                            </div>
                            <p
                              className={`text-xs text-black_04 mt-1 first-letter:uppercase w-20 truncate ${
                                !chats
                                  .find((c) => c.chatId === chat.chatId)
                                  ?.lastMessageSeenBy.map((u) => u.id)
                                  .includes(user.userId)
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
                          <p className=" flex-grow flex justify-end text-[10px] text-gray-400 ">
                            {chat.lastMessageTime ? (
                              <TimeAgo time={chat.lastMessageTime} />
                            ) : null}
                          </p>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Favorite Icon */}
      <div ref={favoriteRef} className="relative inline-block">
        <MdFavoriteBorder
          size={23}
          className="cursor-pointer hover:text-primary"
          onClick={toggleFavoriteMenu}
        />
        {isFavoriteMenuOpen && (
          <div className="absolute top-10 right-0 z-40 bg-white border border-gray-200 shadow-md rounded-md w-[300px] h-[200px] overflow-auto">
            <div className="flex items-center justify-between mb-2 p-2 ">
              <h2 className="text-lg font-semibold flex items-center gap-2 ">
                <MdFavoriteBorder /> Favorite
              </h2>
              {/* Close button */}
            </div>
            <div className="px-3 flex flex-col gap-3 ">
              {/* Messages Menu Content */}
              <div className="hover:text-gray-400 cursor-pointer flex gap-2 items-center">
                <MdFavoriteBorder size={23} />
                <p>
                  <p className="text-[13px]">
                    Find a comprehensive software development agency to handle
                    it all.
                  </p>
                </p>
              </div>
              <div className="hover:text-gray-400 cursor-pointer flex gap-2 items-center">
                <MdFavoriteBorder size={23} />
                <p>
                  <p className="text-[13px]">
                    Find a comprehensive software development agency to handle
                    it all.
                  </p>
                </p>
              </div>
              <div className="hover:text-gray-400 cursor-pointer flex gap-2 items-center">
                <MdFavoriteBorder size={23} />
                <p>
                  <p className="text-[13px]">
                    Find a comprehensive software development agency to handle
                    it all.
                  </p>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Order Menu*/}
      <div ref={orderRef} className="relative inline-block">
        <p
          onClick={toggleOrderMenu}
          className="p-4 font-bold text-[17px] cursor-pointer hover:text-primary"
        >
          Orders
        </p>
        {isOrderMenuOpen && (
          <div className="absolute top-15 right-0 z-40 bg-white border border-gray-200 shadow-md rounded-md w-[600px] h-[400px] overflow-auto">
            <div className="flex items-center justify-between mb-2 p-2 ">
              <h2 className="text-lg font-semibold flex items-center gap-2 ">
                <LuInbox /> Orders
              </h2>
              {/* Close button */}
            </div>
            {/* Messages Menu Content */}

            {ordersData.isLoading ? (
              <div>Loading..</div>
            ) : ordersData.error ? (
              <div>error</div>
            ) : !ordersData.data || ordersData.data.length === 0 ? (
              <div className="flex justify-center items-center w-full h-1/2">
                Empty list
              </div>
            ) : (
              <div className="px-3 flex flex-col gap-3 ">
                {ordersData.data.map((order) => {
                  return (
                    <div
                      onClick={() => {
                        navigate("/orders");
                      }}
                      key={order.documentRef}
                    >
                      {/* Messages Menu Content */}
                      <div className=" group  mt-3 flex flex-row items-center text-sm text-black_04  cursor-pointer  py-2 px-6 ">
                        <div className="flex items-center gap-x-3 uppercase font-semibold">
                          <LuInbox size={23} />
                          <div className=" group-hover:text-gray-400">
                            {order.orderId}
                          </div>{" "}
                        </div>

                        <div className="mx-6 w-full  flex justify-between items-center ">
                          {/* Assuming due on is a property of the order object */}
                          <div className="first-letter:uppercase">
                            {" "}
                            <TimestampToDate timestamp={order.createdDate} />
                          </div>{" "}
                          {/* Assuming total is a property of the order object */}
                          <div className="font-semibold ">
                            {order.basePrice} TND
                          </div>{" "}
                          {/* Assuming status is a property of the order object */}
                          <div
                            className={`font-semibold uppercase text-white py-2 px-3 rounded-md ${
                              order.status === "pending"
                                ? "bg-yellow-300"
                                : order.status === "inProgress"
                                ? "bg-green-300"
                                : order.status === "delivered"
                                ? "bg-green-600"
                                : order.status === "completed"
                                ? "bg-primary"
                                : order.status === "cancelled"
                                ? "bg-red-600"
                                : "bg-gray-500"
                            } `}
                          >
                            {order.status}
                          </div>{" "}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export const UserMenu = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef(null);

  const handleSignOut = async () => {
    await signOutUser();
    window.location.reload();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        type="button"
        className="flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
        id="user-menu-button"
        aria-expanded={isOpen}
        onClick={toggleMenu}
      >
        <span className="sr-only">Open user menu</span>
        <img
          className="w-8 h-8 rounded-full object-cover"
          alt=""
          src={user.photoURL ? user.photoURL : Avatar}
        />
      </button>
      <div
        className={`absolute right-0 mt-2 w-48 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600 ${
          isOpen ? "block z-40" : "hidden"
        }`}
        id="user-dropdown"
      >
        <div className="px-4 py-3">
          <span className="block text-sm text-gray-900 dark:text-white">
            {user.firstName + " " + user.lastName}
          </span>
          <span className="block text-sm text-gray-500 truncate dark:text-gray-400">
            {user.email}
          </span>
        </div>
        <ul className="py-2" aria-labelledby="user-menu-button">
          <Link to="/profile">
            <li className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white cursor-pointer">
              Profile
            </li>
          </Link>
          {user.role === "freelancer" && (
            <Link to="/dashboard">
              <li className="block px-4 cursor-pointer py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">
                Dashboard
              </li>
            </Link>
          )}

          <li>
            <button
              onClick={handleSignOut}
              className="block w-full text-start px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
            >
              Sign out
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};
export default NavbarAuth;
