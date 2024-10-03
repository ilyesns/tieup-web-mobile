import React, { useEffect, useState } from "react";
import NavbarFreelancer from "../components/NavBarFreelancer";
import { useAuth } from "../hooks/auth_context";
import { useGetUser } from "../apis/user_api";
import Avatar from "../assets/images/avatar.png";
import OfferImage from "../assets/images/offer.jpg";
import { FaStar } from "react-icons/fa6";
import {
  convertTimestampToComponents,
  extractRootServices,
  getCurrentMonthName,
  getDocumentIds,
} from "../util";
import { useChats } from "../apis/chat";
import { TimeAgo } from "../components/common/TimeAgo";
import Footer from "../components/Footer";
import { useServices } from "../apis/services";
import { MdAlarm } from "react-icons/md";
import { useOrdersFreelancer } from "../apis/order";
import { useFreelancerStatistic } from "../apis/freelancer";
import { CircularProgress } from "@mui/material";
import { useFreelancerWallet } from "../apis/wallet";
import TimeLeft from "../components/common/TimeLeft";
import { Link, useNavigate } from "react-router-dom";
import { useFreelancerOffers } from "../apis/freelancer_offer";
import empty from "../assets/images/empty.jpg";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "../config/firebase_config";

export const DashboardPage = () => {
  const { currentUser } = useAuth();
  const { data } = useGetUser(currentUser.userId, currentUser.accessToken);
  let chatsData = useChats(currentUser.userId, currentUser.accessToken);
  const serivceData = useServices();
  const navigate = useNavigate();
  const ordersData = useOrdersFreelancer(
    currentUser.userId,
    currentUser.accessToken
  );
  const offersData = useFreelancerOffers(
    currentUser.userId,
    currentUser.accessToken
  );
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

  const statisticProfile = useFreelancerStatistic(currentUser.userId);
  const wallet = useFreelancerWallet(currentUser.userId);
  if (serivceData.isLoading) return <div />;
  if (serivceData.error)
    return <div>An error occurred while fetching the user data </div>;
  const services = extractRootServices(serivceData.data);

  return (
    <div className="bg-slate-50 h-svh">
      <NavbarFreelancer />
      <div className="max-w-[1240px] mx-auto my-14">
        <div className="flex flex-col md:flex-row gap-x-6 gap-y-3">
          <div className="md:w-1/3 ">
            <div className="w-full bg-white p-3">
              <div className="flex flex-row gap-x-3 items-center my-3">
                <img
                  src={data?.photoURL ? data?.photoURL : Avatar}
                  className="rounded-full w-16 h-16"
                  alt=""
                />
                <div className="flex flex-col gap-y-2 ">
                  <div className="flex-row flex gap-x-2 items-center">
                    <p className="font-bold first-letter:uppercase text-lg">
                      {data?.firstName && data?.lastName && (
                        <>
                          {data.firstName} {data.lastName}
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>
              <div className="w-full h-[1px] bg-slate-200" />
              {statisticProfile.isLoading ? (
                <div className="flex justify-center items-center h-44">
                  <CircularProgress />
                </div>
              ) : statisticProfile.isError ? (
                <div>Error </div>
              ) : (
                <div className="my-3 flex flex-col gap-y-2">
                  <div className="flex justify-between items-center ">
                    <p className="text-black_04">My Level</p>
                    <p className="first-letter:uppercase">
                      {statisticProfile.data.sellerLevel}
                    </p>
                  </div>
                  <div className="flex justify-between items-center ">
                    <p className="text-black_04">Projects completed</p>
                    <p className="first-letter:uppercase">
                      {statisticProfile.data.orderCompletionRate}
                    </p>
                  </div>
                  <div className="flex justify-between items-center ">
                    <p className="text-black_04">Rating</p>
                    <div className="flex gap-1 items-center">
                      <FaStar className="text-black" />
                      <p className="first-letter:uppercase">
                        {statisticProfile.data.positiveRatingPercentage}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center ">
                    <p className="text-black_04">Response time</p>
                    <p className="first-letter:uppercase">
                      {statisticProfile.data.responseTime}
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className="w-full bg-white p-3 mt-5">
              <div className="flex justify-between items-center ">
                <p className="text-black_04">
                  Earned in <span>{getCurrentMonthName()}</span>
                </p>
                {wallet.data ? (
                  <p className="">{wallet.data.earningsInMonth} TND</p>
                ) : (
                  <p className="">- TND</p>
                )}
              </div>
            </div>
            <div className="w-full bg-white p-3 mt-5">
              <div className="flex justify-between items-center ">
                <p className="text-black_04">
                  Balance <span></span>
                </p>
                {wallet.data ? (
                  <p className="">{wallet.data.balance} TND</p>
                ) : (
                  <p className="">- TND</p>
                )}
              </div>
            </div>

            <div className="w-full bg-white  mt-5">
              <div className="flex justify-between  px-3 py-5 items-center ">
                <p className="text-black_04">Inbox</p>
                <p className="text-primary font-semibold cursor-pointer">
                  View All
                </p>
              </div>
              <div className="w-full h-[1px] bg-slate-200" />
              <div className="p-3 overflow-y-scroll h-60">
                {chatsData.isLoading ? (
                  <div>Loading..</div>
                ) : chatsData.error ? (
                  <div>error</div>
                ) : chatsData.data && chatsData.data.length === 0 ? (
                  <div className="flex justify-center items-center w-full h-1/2">
                    Empty list
                  </div>
                ) : (
                  <div className="px-3 flex flex-col gap-3 ">
                    {chatsData.data.map((chat) => {
                      return (
                        <div key={chat.chatId}>
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
                                <div className="  flex justify-between   items-center">
                                  <p className="text-lg text-black_04 font-semibold first-letter:uppercase ">
                                    {chat.otherUserName}
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
            </div>
          </div>
          <div className="md:w-2/3 ">
            <Orders />
            {ordersData.data && ordersData.data.length > 0 ? (
              ordersData.data.map((order) => {
                return (
                  <div key={order.orderId}>
                    <div className="bg-white mt-5 px-4 py-7 flex justify-between items-center">
                      {/* Offer Image */}
                      <img
                        src={order.offerImage}
                        alt=""
                        className="w-20 h-10 border rounded object-cover"
                      />
                      {/* Client  Information */}
                      <div className="font-semibold text-black_04 first-letter:uppercase">
                        {order.clientUserName}
                      </div>
                      {/* Order  price */}
                      <div className="flex-col">
                        <div className="text-gray-500 text-center">Price</div>
                        <p className="text-black_04">{order.basePrice}TND</p>
                      </div>
                      {/* Order  data place */}
                      <div className="flex-col">
                        <div className="text-gray-500 text-center">Due In</div>
                        <p className="text-black_04 flex gap-1 items-center text-sm">
                          <MdAlarm /> <TimeLeft createdAt={order.createdDate} />
                        </p>
                      </div>
                      {/* Order  Status */}
                      <div className="flex-col ">
                        <div className="text-gray-500 text-center">Status</div>
                        <div
                          className={`font-semibold uppercase text-white p-2 rounded-full ${
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
                      <div className="flex-col ">
                        <p
                          onClick={() => {
                            navigate("/manage_order");
                          }}
                          className="text-primary hover:text-blue-400 cursor-pointer p-1 text-sm rounded-full  "
                        >
                          View
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : offersData.isLoading ? (
              <CircularProgress size={20} />
            ) : offersData.data && offersData.data.length !== 0 ? (
              <>
                <div className=" bg-gray-50 text-medium border border-t-transparent text-gray-500 dark:text-gray-400 dark:bg-gray-800  w-full">
                  <div>
                    <div className="w-full h-[1px] bg-slate-200" />
                    <div className=" flex flex-row text-black_04 text-sm font-semibold uppercase py-2 px-6 ">
                      <div className="w-3/5">
                        <div>offer</div>
                      </div>
                      <div className="w-2/5 flex justify-between mr-14">
                        <div>impressions</div>
                        <div>clicks</div>
                        <div>orders</div>
                        <div>rating</div>
                      </div>
                    </div>
                    <div className="w-full h-[1px] bg-slate-200" />
                    {offersData.data.map((offer, index) => (
                      <div
                        key={index}
                        className=" mt-3 flex flex-row items-center text-black_04   py-2 px-6 "
                      >
                        <div className="w-3/5">
                          <div className="flex items-center gap-x-3">
                            <img
                              src={
                                offer.offer.gallery &&
                                offer.offer?.gallery.images &&
                                offer.offer?.gallery.images[0]
                                  ? offer.offer?.gallery.images[0].url
                                  : empty
                              } // Assuming you have the offerImage variable defined
                              className="w-20 h-10 object-cover rounded-md"
                              alt=""
                            />
                            <div>{offer.offer.title}</div>{" "}
                            {/* Assuming title is a property of the offer object */}
                          </div>
                        </div>
                        <div className="w-2/5 flex justify-between mr-7">
                          <div>{offer.statistic.impressions}</div>{" "}
                          {/* Assuming impressions is a property of the offer object */}
                          <div>{offer.statistic.clicks}</div>{" "}
                          {/* Assuming clicks is a property of the offer object */}
                          <div>{offer.statistic.totalMade}</div>{" "}
                          {/* Assuming orders is a property of the offer object */}
                          <div>{offer.statistic.totalRating}</div>{" "}
                          {/* Assuming rating is a property of the offer object */}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white mt-5 px-4 py-7">
                <div className="font-bold text-black_04 text-2xl">
                  Unlock Your Potential: Be the First to Offer Your Services on
                  TIE-UP!
                </div>
                <div className="text-black_04 mt-5 text-sm ">
                  Take the first step towards success by creating your first
                  offer on TIE-UP! Your journey to freelance greatness begins
                  here. Join us now and unleash your potential!
                </div>
                <div className="w-full flex justify-center">
                  <button
                    onClick={() => {
                      navigate("/manage_offer");
                    }}
                    className="mt-10  border py-3 px-2 border-primary hover:bg-primary hover:text-white  ease-in-out  hover:ease-in-out hover:duration-300 duration-300 rounded text-primary text-lg"
                  >
                    Create First Offer
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer services={services} />
    </div>
  );
};

const Orders = () => {
  const [selectedOrderStatus, setSelectedOrderStatus] =
    useState("Active Orders");

  const handleOrderStatusChange = (status) => {
    setSelectedOrderStatus(status);
  };

  return (
    <div className="p-3 bg-white flex items-center justify-between">
      <div className="flex gap-x-2 items-center">
        <p className="font-semibold text-lg text-black_04">
          {selectedOrderStatus}
        </p>
        <span className="text-gray-500">0</span>
        <span className="text-gray-500">(0 TND)</span>
      </div>
      <OrderStatus
        selectedOrderStatus={selectedOrderStatus}
        onOrderStatusChange={handleOrderStatusChange}
      />
    </div>
  );
};

const OrderStatus = ({ selectedOrderStatus, onOrderStatusChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleStatusSelect = (status) => {
    onOrderStatusChange(status);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <div
        onClick={toggleDropdown}
        className="text-black_04 cursor-pointer p-3 font-semibold   border    rounded   text-center inline-flex items-center "
      >
        {selectedOrderStatus}
        <svg
          className={`w-2.5 h-2.5 ms-3 transform transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </div>
      <div
        className={`${
          isOpen ? "block" : "hidden"
        } z-10 absolute right-0 mt-2 w-44 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700`}
        id="dropdown"
      >
        <ul
          className="py-2 text-sm text-gray-700 dark:text-gray-200"
          aria-labelledby="dropdownDefaultButton"
        >
          <li
            className="block cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            onClick={() => handleStatusSelect("Active Orders")}
          >
            Active Orders
          </li>
          <li
            className="block cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            onClick={() => handleStatusSelect("Completed")}
          >
            Completed
          </li>
          <li
            className="block cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            onClick={() => handleStatusSelect("Canceled")}
          >
            Canceled
          </li>
        </ul>
      </div>
    </div>
  );
};
