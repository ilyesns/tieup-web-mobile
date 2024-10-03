import React, { useEffect, useRef, useState } from "react";
import Footer from "../../components/Footer";
import { useOffersByService, useServices } from "../../apis/services";
import { extractRootServices, extractSubService, getOffer } from "../../util";
import { useAuth } from "../../hooks/auth_context";
import NavbarAuth from "../../components/NavBarAuth";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { Breadcrumbs } from "@material-tailwind/react";
import Landing3 from "../../assets/images/landing3.jpg";
import { BsArrowRepeat } from "react-icons/bs";
import { PiAlarmLight } from "react-icons/pi";
import Avatar from "../../assets/images/avatar.png";
import { FaStar } from "react-icons/fa";
import ReactPlayer from "react-player";
import { IoClose } from "react-icons/io5";
import MuiAlert from "@mui/material/Alert";

import { Carousel, IconButton } from "@material-tailwind/react";
import { Transition } from "@headlessui/react";
import { useGetUser } from "../../apis/user_api";
import useOnClickOutside from "../landing";
import LogIn from "../../components/modals/Login";
import SignUp from "../../components/modals/SignUp";
import NavbarUnAuth from "../../components/NavbarUnAuth";
import {
  checkChat,
  getOrCreatChat,
  sendMessage,
  useMessagesChat,
} from "../../apis/chat";
import { GiConversation } from "react-icons/gi";
import { useQueryClient } from "@tanstack/react-query";
import { TimeAgo } from "../../components/common/TimeAgo";
import { Snackbar } from "@mui/material";
import { OrderOverlay } from "../../components/OrderOverlay";
import { calculOrderTotal } from "../../apis/order";

export const OfferPage = () => {
  const modelNavRef = React.useRef(null);
  const [nav, setNav] = useState(false);
  const servicesData = useServices();
  const { currentUser, isLoggedIn } = useAuth();
  const { serviceId, subServiceId, offerId } = useParams();
  const offersData = useOffersByService(
    subServiceId,
    isLoggedIn,
    currentUser.userId
  );
  const [offerData, setOfferData] = useState(null);
  const user = useGetUser(currentUser.userId, currentUser.accessToken);
  const [showModal, setShowModal] = useState(false);
  const [showTwoModal, setShowTwoModal] = useState(false);
  const modelRef = React.useRef(null);
  const modelTwoRef = React.useRef(null);
  let [userData, setUserData] = useState([]);
  const queryClient = useQueryClient(); // Get the query client instance

  const navigate = useNavigate();
  const [snackBar, setSnackBar] = useState(false);
  useEffect(() => {
    if (user.data) {
      setUserData(user.data);
    }
    queryClient.invalidateQueries(["chats", currentUser.userId]);
  }, [user.data]);

  const openToast = () => {
    setSnackBar(true);
  };

  const handleClosePopup = () => {
    setSnackBar(false); // Close the pop-up
  };

  useOnClickOutside(modelRef, () => setShowModal(false), showModal);
  useOnClickOutside(modelTwoRef, () => setShowTwoModal(false), showTwoModal);
  useOnClickOutside(modelNavRef, () => setNav(false), nav);
  let [basePrice, setBasePrice] = useState(0);

  const closeModal = () => {
    setShowModal(false);
  };
  useEffect(() => {
    if (offersData.data) {
      setOfferData(getOffer(offersData.data, offerId));
      let data = getOffer(offersData.data, offerId);

      setBasePrice(data.offer.basicPlan.price);
    }
  }, [offerId, offersData.data]);

  const [overlayVisible, setOverlayVisible] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("basic"); // State to track selected plan
  const [isLoading, setIsLoading] = useState(false);
  let [total, setTotal] = useState();
  const toggleOverlay = async () => {
    if (isLoggedIn) {
      try {
        setIsLoading(true);
        const data = {
          basePrice: basePrice,
        };
        const result = await calculOrderTotal(data, currentUser.accessToken);
        setIsLoading(false);
        setTotal(result);
        setOverlayVisible(true);
        // Toggle body overflow to disable scrolling
        document.body.style.overflow = overlayVisible ? "auto" : "hidden";
      } catch (e) {}
    } else {
      openToast();
    }
  };
  const closeOverlay = () => {
    setOverlayVisible(false);
    document.body.style.overflow = overlayVisible ? "auto" : "hidden";
  };
  const basicPlan = () => {
    setSelectedPlan("basic");
    setBasePrice(offerData.offer.basicPlan.price);
  };
  const premiumPlan = () => {
    setSelectedPlan("premium");
    setBasePrice(offerData.offer.premiumPlan.price);
  };
  if (servicesData.isLoading) return <div />;
  if (servicesData.error)
    return <div>An error occurred while fetching the user data </div>;
  const services = extractRootServices(servicesData.data);
  const service = services.find((service) => service.documentRef === serviceId);
  const subService = servicesData.data.find(
    (service) => service.documentRef === subServiceId
  );

  return (
    <div className="relative">
      {showModal && (
        <LogIn
          isOpen={showModal}
          modelRef={modelRef}
          onRequestClose={closeModal}
        />
      )}
      {showTwoModal && (
        <SignUp
          isOpen={showTwoModal}
          modelRef={modelTwoRef}
          onRequestClose={closeModal}
        />
      )}
      {isLoggedIn ? (
        <NavbarAuth
          modelNavRef={modelNavRef}
          nav={nav}
          setNav={setNav}
          services={services}
          user={userData}
        />
      ) : (
        <NavbarUnAuth
          modelNavRef={modelNavRef}
          setShowTwoModal={setShowTwoModal}
          showTwoModal={showTwoModal}
          setIsPopoverOpen={setShowModal}
          isPopoverOpen={showTwoModal}
          nav={nav}
          setNav={setNav}
          services={services}
        />
      )}

      <div className="max-w-[1240px] mx-auto mt-3">
        <BreadcrumbsDefault service={service} subService={subService} />
      </div>

      <div className="max-w-[1240px] mx-auto my-20 ">
        {offersData.isLoading ? (
          <div className="w-full h-[50%] flex justify-center items-center">
            <div role="status">
              <svg
                aria-hidden="true"
                className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : (
          offersData.data &&
          offerData && (
            <div className="w-full h-full flex flex-col gap-y-6 md:flex-row justify-between items-start">
              <div className="w-full md:w-2/3 overflow-hidden mr-10">
                <div className="text-3xl text-pretty font-semibold w-full">
                  {offerData.offer.title}
                </div>
                <div className="flex flex-row mt-5 items-center gap-3">
                  <img
                    alt=""
                    src={offerData.user ? offerData.user.photoURL : Avatar}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="font-semibold">
                    {offerData.user?.username}
                  </div>
                  <div className="text-gray-400 first-letter:uppercase">
                    {offerData.levelUser.sellerLevel}
                  </div>
                  <div className="text-gray-400">|</div>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <FaStar />

                    <span className=" text-black_900_e5">
                      ({offerData.levelUser.positiveRatingPercentage})
                    </span>
                  </div>
                </div>
                <div className="mt-5">
                  <CarouselCustomArrows gallery={offerData.offer.gallery} />
                </div>
                <div className="mt-5 ml-1">
                  <div className="text-xl font-semibold">About this Offer</div>
                  <div className="font-serif mt-5 whitespace-break-spaces ">
                    {offerData.offer.description}
                  </div>

                  <div
                    className="font-xl font-bold mt-10
              "
                  >
                    About the seller
                  </div>
                  <div className="flex items-center gap-x-4 mt-4">
                    <img
                      alt=""
                      src={offerData.user ? offerData.user.photoURL : Avatar}
                      className="w-20 h-20 rounded-full"
                    />
                    <div className="flex flex-col  gap-y-2 ">
                      <p className="font-bold first-letter:uppercase">
                        {offerData.user?.firstName +
                          " " +
                          offerData.user?.lastName}
                      </p>
                      <p className="text-sm text-gray-700">
                        {offerData.user.skills &&
                          offerData.user.skills[0].name +
                            " " +
                            offerData.user.skills[0].experience}
                      </p>
                      <p className="flex gap-1 items-center font-bold">
                        <FaStar />
                        {offerData.levelUser.positiveRatingPercentage}.0
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      navigate(`/freelancer_profile/${offerData.user.userId}`);
                    }}
                    className="w-36 h-10 border mt-3 rounded-md border-black hover:bg-slate-900 hover:text-white "
                  >
                    View profile
                  </button>
                </div>
              </div>
              <PricingComponent
                toggleOverlay={toggleOverlay}
                data={offerData.offer}
                basicPlan={basicPlan}
                premiumPlan={premiumPlan}
                selectedPlan={selectedPlan}
                isLoading={isLoading}
              />
            </div>
          )
        )}
      </div>
      {offerData && (
        <>
          {" "}
          <ChatBox
            data={offerData.user}
            currentUser={currentUser}
            isLoggedIn={isLoggedIn}
            openToast={openToast}
          />
          <OrderOverlay
            currentUser={currentUser}
            total={total}
            offer={offerData.offer || []}
            selectedPlan={
              selectedPlan === "basic"
                ? offerData.offer.basicPlan
                : offerData.offer.premiumPlan
            }
            isOpen={overlayVisible}
            onClose={closeOverlay}
          />
        </>
      )}
      <Footer services={services} />
      <Snackbar
        open={snackBar}
        onClose={handleClosePopup}
        autoHideDuration={5000}
      >
        <MuiAlert elevation={6} variant="filled" severity="error">
          Please login to get touch freelancer.
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export function BreadcrumbsDefault({ service, subService }) {
  return (
    <Breadcrumbs>
      <Link to="/home" className="opacity-60">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
      </Link>
      <Link to="/services" className="opacity-60">
        Services
      </Link>
      <Link to={`/subservices/${service.documentRef}`}>{service.name}</Link>
      <Link className="text-primary">{subService.name}</Link>
    </Breadcrumbs>
  );
}

const PricingComponent = ({
  data,
  currentUser,
  isLoggedIn,
  openToast,
  toggleOverlay,
  selectedPlan,
  basicPlan,
  premiumPlan,
  isLoading,
}) => {
  // Basic and Premium plan details
  const plans = {
    basic: {
      name: data.basicPlan.title,
      promo: "Basic Promo",
      price: data.basicPlan.price + " DT",
      description: data.basicPlan.description,
      delivery: data.basicPlan.deliveryTime,
      revision: data.basicPlan.revisionNumber,
    },
    premium: {
      name: data.premiumPlan.title,
      promo: "Premium Promo",
      price: data.premiumPlan.price + " DT",
      description: data.premiumPlan.description,
      delivery: data.premiumPlan.deliveryTime,
      revision: data.premiumPlan.revisionNumber,
    },
  };

  // Function to toggle between Basic and Premium plans

  return (
    <div className="w-full md:w-1/3">
      <div className="flex justify-between items-center border">
        <div
          className={` h-14 w-full flex justify-center  items-center font-semibold ${
            selectedPlan === "basic"
              ? "text-primary"
              : "bg-slate-100 cursor-pointer "
          }`}
          onClick={basicPlan}
        >
          Basic
        </div>
        <div
          className={`h-14 w-full flex justify-center items-center font-semibold ${
            selectedPlan === "premium"
              ? "  text-primary"
              : "bg-slate-100 cursor-pointer"
          }`}
          onClick={premiumPlan}
        >
          Premium
        </div>
      </div>
      <div className="w-full py-7 px-4 border">
        <div className="flex flex-row justify-between items-center">
          <div className="font-bold text-xl">{plans[selectedPlan].promo}</div>
          <div className="">{plans[selectedPlan].price}</div>
        </div>
        <div className="text-sm text-ellipsis mt-5">
          {plans[selectedPlan].description}
        </div>

        <div className="flex flex-row justify-between items-center mt-5">
          <div className="flex gap-2 items-center font-semibold">
            <PiAlarmLight size={18} /> {plans[selectedPlan].delivery}
          </div>
          <div className="flex gap-2 items-center font-semibold">
            <BsArrowRepeat size={18} /> {plans[selectedPlan].revision}
          </div>
        </div>
        <button
          onClick={toggleOverlay}
          className={`w-full text-white  rounded mt-10 h-10 bg-primary flex justify-center items-center`}
        >
          {isLoading ? (
            <p className=" w-5 h-5 rounded-full  border-white border-t-transparent border animate-spin" />
          ) : (
            "Contine"
          )}
        </button>
      </div>
    </div>
  );
};

export function CarouselCustomArrows({ gallery }) {
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  // List of items to be rendered in the carousel
  let items = [];

  if (gallery.images) items = [...gallery.images];
  if (gallery.video) items = [...items, gallery.video];

  return (
    <Carousel
      className="rounded-xl"
      responsive={responsive}
      arrows="false"
      prevArrow={({ handlePrev }) => (
        <IconButton
          variant="text"
          color="white"
          size="lg"
          onClick={handlePrev}
          className="!absolute top-2/4 left-4 -translate-y-2/4 text-primary"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
        </IconButton>
      )}
      nextArrow={({ handleNext }) => (
        <IconButton
          variant="text"
          color="white"
          size="lg"
          onClick={handleNext}
          className="!absolute top-2/4 !right-4 -translate-y-2/4 text-primary"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
            />
          </svg>
        </IconButton>
      )}
    >
      {items.map((item, index) => (
        <div key={index}>
          {item.type.includes("image") ? (
            <img
              src={item.url}
              alt={item.alt}
              className="h-[400px] w-full object-cover"
            />
          ) : (
            <ReactPlayer
              url={item.url}
              controls={true}
              width="100%"
              height="400px"
            />
          )}
        </div>
      ))}
    </Carousel>
  );
}

const ChatBox = ({ data, currentUser, isLoggedIn, openToast }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [chatId, setChatId] = useState(null);
  const messagesData = useMessagesChat(chatId, currentUser.accessToken);
  const [message, setMessage] = useState("");
  const queryClient = useQueryClient(); // Get the query client instance
  let [isLoading, setIsLoading] = useState(false);

  const chatBoxRef = useRef(null);
  const toggleChatBox = async () => {
    if (isLoggedIn) {
      queryClient.invalidateQueries(["messageChat", chatId]);
      queryClient.invalidateQueries(["chats", currentUser.userId]);
      if (!chatId) {
        const chat = {
          senderId: currentUser.userId,
          recipientId: data.userId,
        };

        try {
          if (currentUser.accessToken && !chatId) {
            const check = await checkChat(chat, currentUser.accessToken);

            setChatId(check);
          }
        } catch (e) {
          console.log(e);
        }
      }
      setIsOpen(!isOpen);
    } else {
      openToast();
    }
  };

  const handleSendMessage = async () => {
    if (message) {
      const newMsg = {
        text: message,
        userSent: currentUser.userId,
      };
      const chat = {
        senderId: currentUser.userId,
        recipientId: data.userId,
      };
      setIsLoading(true);
      const result = await getOrCreatChat(chat, currentUser.accessToken);

      await sendMessage(result, newMsg, currentUser.accessToken);
      queryClient.invalidateQueries(["messageChat", result]);
      queryClient.invalidateQueries(["chats", currentUser.userId]);
      setMessage("");
      setIsLoading(false);
      setChatId(result);
    }
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter" && isOpen) {
      // Check if chat box is open
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-10 left-10 z-10">
      <Transition
        show={isOpen}
        enter="transition-transform duration-300"
        enterFrom="transform scale-0"
        enterTo="transform scale-100"
        leave="transition-transform duration-300"
        leaveFrom="transform scale-100"
        leaveTo="transform scale-0"
      >
        {(status) => (
          <div
            ref={chatBoxRef}
            className={`bg-white bottom-10 shadow-xl rounded-lg w-80 h-80 ${
              status === "entering" || status === "exiting"
                ? "transition-transform duration-300"
                : ""
            }`}
          >
            {/* Chat box content */}
            <div className="h-full">
              <div className="flex flex-row items-center gap-x-2 p-4">
                <img
                  alt=""
                  src={data.photoURL ? data.photoURL : Avatar}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex flex-col items-start gap-1">
                  <p className="font-bold text-sm text-black_04">
                    Message {data.username ? data.username : ""}
                  </p>
                  <p className="text-[10px] text-black_04">online</p>
                </div>
              </div>
              <div className="w-full border-b" />
              <div className="flex flex-col h-full">
                <div className="h-2/4 p-5 overflow-y-auto">
                  {messagesData.isLoading ? (
                    <div>Loading.. </div>
                  ) : messagesData.isError ? (
                    <div> Something went wrong!please refresh the page!</div>
                  ) : !messagesData.data || messagesData.data.length === 0 ? (
                    <div className="h-full flex flex-col justify-center items-center">
                      <GiConversation size={40} />
                      <div className="mt-2 text-sm text-center font-semibold">
                        Open the dialogue with a friendly hello!
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-y-3">
                      {messagesData.data.map((message) => {
                        return (
                          <div
                            key={message.messageId}
                            className={
                              message.userSent === currentUser.userId
                                ? `flex justify-end`
                                : ``
                            }
                          >
                            <div>
                              {message.imageUrl && (
                                <img
                                  src={message.imageUrl.url}
                                  alt=""
                                  className="w-20 h-20 rounded-md object-cover mb-3"
                                />
                              )}
                              {message.fileUrl && (
                                <p className="  text-[11px] bg-blue-400 py-2 px-3 cursor-pointer text-white rounded-md max-w-sm object-cover mb-3">
                                  {message.fileUrl.name}
                                </p>
                              )}
                              <div className="flex flex-col justify-end">
                                <p className=" text-black_04">{message.text}</p>
                                <p className="text-[9px] text-gray-500">
                                  {" "}
                                  <TimeAgo time={message.createdAt} />
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {/*  */}
                </div>
                <div className="h-1/3 ">
                  <div className="w-full border-b" />
                  <div className="p-3 flex flex-row gap-2">
                    <input
                      type="text"
                      name="message"
                      id="message"
                      value={message}
                      onChange={(e) => {
                        setMessage(e.target.value);
                      }}
                      autoComplete="off"
                      onKeyDown={handleKeyDown} // Added event listener for Enter key
                      className="block  w-2/3 rounded-md border-0 py-1.5 pl-7  text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:to-black sm:text-sm sm:leading-6"
                      placeholder="Type a message"
                    />
                    <button
                      disabled={!message || isLoading}
                      onClick={handleSendMessage}
                      className="w-30 w-1/3 h-10 border  text-sm rounded-md border-black hover:bg-slate-900 hover:text-white "
                    >
                      {isLoading ? "Sending..." : "Send"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* Close button */}
            <button
              onClick={toggleChatBox}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 focus:outline-none"
            >
              <IoClose className="h-6 w-6" />
            </button>
          </div>
        )}
      </Transition>
      {!isOpen && (
        <button
          onClick={toggleChatBox}
          className=" bg-white shadow-xl flex items-center text-black rounded-full p-3 fixed bottom-10 left-10 "
        >
          <div className="flex flex-row items-center gap-x-2">
            <img
              alt=""
              src={data.photoURL ? data.photoURL : Avatar}
              className="w-10 h-10 rounded-full object-cover "
            />
            <div className="flex flex-col items-start gap-1">
              <p className="font-bold text-sm text-black_04">
                Message {data.firstName ? data.firstName + " " : ""}{" "}
                {data.lastName ? data.lastName : ""}
              </p>
              <p className="text-[10px] text-black_04">online</p>
            </div>
          </div>
        </button>
      )}
    </div>
  );
};
