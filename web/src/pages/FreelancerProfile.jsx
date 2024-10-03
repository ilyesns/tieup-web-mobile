import React, { useEffect, useRef, useState } from "react";
import Footer from "../components/Footer";
import { useServices } from "../apis/services";
import { extractRootServices } from "../util";
import { useAuth } from "../hooks/auth_context";
import NavbarAuth from "../components/NavBarAuth";
import Avatar from "../assets/images/avatar.png";
import { Carousel, IconButton } from "@material-tailwind/react";
import ReactPlayer from "react-player";
import { IoCameraOutline } from "react-icons/io5";
import {
  getFreelancer,
  useFreelancerDetails,
  useGetUser,
} from "../apis/user_api";
import { useFreelancerOffers } from "../apis/freelancer_offer";
import { useFreelancerPortfolio } from "../apis/freelancer_portfolio";
import { useNavigate, useParams } from "react-router-dom";
import { GoArrowLeft } from "react-icons/go";
import useOnClickOutside from "./landing";
import LogIn from "../components/modals/Login";
import SignUp from "../components/modals/SignUp";
import NavbarUnAuth from "../components/NavbarUnAuth";
import { Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { checkChat, getOrCreatChat } from "../apis/chat";
import { useQueryClient } from "@tanstack/react-query";
import { MessagePopUp } from "../components/modals/MessagePopUp";

export const FreelancerProfilePage = () => {
  const modelNavRef = React.useRef(null);
  const [nav, setNav] = useState(false);
  const { isLoading, error, data } = useServices();
  const { userId } = useParams();
  const { currentUser, isLoggedIn } = useAuth();

  const [showModal, setShowModal] = useState(false);
  const [showTwoModal, setShowTwoModal] = useState(false);
  const modelRef = React.useRef(null);
  const modelTwoRef = React.useRef(null);

  const freelancerDetailsData = useFreelancerDetails(userId);
  const freelancerOfferData = useFreelancerOffers(userId);
  const freelancerPortfolioData = useFreelancerPortfolio(userId);
  //   const user = useGetUser(currentUser.userId, currentUser.accessToken);
  let [userData, setUserData] = useState([]);
  const [snackBar, setSnackBar] = useState(false);
  let [chatId, setChatId] = useState(null);
  const [messagePop, setMessagePop] = useState(false);
  const queryClient = useQueryClient(); // Get the query client instance

  useEffect(() => {
    if (userId) {
      getFreelancer(userId)
        .then((data) => {
          setUserData(data);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [userId]);

  const openToast = () => {
    setSnackBar(true);
  };

  const handleClosePopup = () => {
    setSnackBar(false); // Close the pop-up
  };

  const handleCloseMessagePopup = () => {
    setMessagePop(false);
  };

  const handleContact = async () => {
    if (isLoggedIn) {
      const chat = {
        senderId: currentUser.userId,
        recipientId: userData.userId,
      };

      try {
        queryClient.invalidateQueries(["chats", currentUser.userId]);

        if (currentUser.accessToken && !chatId) {
          const check = await checkChat(chat, currentUser.accessToken);
          setChatId(check);
        }

        setMessagePop(true);
      } catch (e) {
        console.log(e);
      }
    } else {
      openToast();
    }
  };

  useOnClickOutside(modelRef, () => setShowModal(false), showModal);
  useOnClickOutside(modelTwoRef, () => setShowTwoModal(false), showTwoModal);
  useOnClickOutside(modelNavRef, () => setNav(false), nav);

  const closeModal = () => {
    setShowModal(false);
  };
  if (isLoading) return <div />;
  if (error) return <div>An error occurred while fetching the user data </div>;

  const services = extractRootServices(data);

  return (
    <div className="bg-gray-50">
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
      <MessagePopUp
        isVisible={messagePop}
        recipient={userData}
        chatRef={chatId}
        onClose={handleCloseMessagePopup}
      />

      <div className="max-w-[1240px] flex flex-col md:flex-row mx-auto my-20">
        <div className=" md:w-2/3 p-2 ">
          <div className="flex  flex-col gap-y-3 text-black_04">
            <div className="flex flex-row gap-x-3 items-center">
              <img
                src={userData.photoURL ? userData.photoURL : Avatar}
                className="rounded-full w-32 h-32"
                alt=""
              />
              <div className="flex flex-col gap-y-2 ">
                <div className="flex-row flex gap-x-2 items-center">
                  <p className="font-bold text-xl first-letter:uppercase">
                    {" "}
                    {userData.firstName + " " + userData.lastName}
                  </p>
                  <p className="text-gray-500 text-base">{userData.username}</p>
                </div>
              </div>
            </div>
            {userData.role === "freelancer" &&
              (freelancerDetailsData.isLoading ? (
                <div />
              ) : freelancerDetailsData.error ? (
                <div> Error </div>
              ) : (
                freelancerDetailsData.data && (
                  <>
                    <AboutMeComponent
                      description={freelancerDetailsData.data.description}
                    />

                    <SkillsComponent
                      skills={freelancerDetailsData.data.skills}
                    />
                    <EducationsComponent
                      education={freelancerDetailsData.data.educations}
                    />
                    <CertificationsComponent
                      certifications={freelancerDetailsData.data.certifications}
                    />
                  </>
                )
              ))}
          </div>
        </div>

        <div className=" md:1/3">
          <div className="w-full flex flex-col items-end gap-y-5 ">
            <div className="border px-6 py-8 w-[300px]  rounded shadow-xs">
              <div className="flex flex-row gap-x-3 items-center">
                <img
                  src={userData.photoURL ? userData.photoURL : Avatar}
                  className="rounded-full w-12 h-12"
                  alt=""
                />
                <div className="flex flex-col gap-y-2 ">
                  <div className="flex-row flex gap-x-2 items-center">
                    <p className="font-bold text-xl first-letter:uppercase">
                      {userData.username}
                    </p>
                  </div>
                  <div className="text-gray-700">
                    <p>
                      Offine . <span>10:00 AM</span>
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={handleContact}
                className={`
              w-full hover:bg-gray-950 hover:text-white rounded border py-2 mt-6`}
              >
                Contact me
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1240px] mx-auto my-20 overflow-hidden">
        {freelancerOfferData.isLoading ? (
          <div />
        ) : freelancerOfferData.isError ? (
          <div> Error fetch data </div>
        ) : (
          freelancerOfferData.data.length !== 0 && (
            <div>
              <p className=" font-bold text-xl">My Offers </p>
              <div className="pl-2 mt-5 flex flex-wrap gap-x-3">
                {freelancerOfferData.data.map((offer) => {
                  if (offer.offer.status === "active") {
                    return (
                      <div key={offer.offer.offerId}>
                        <OfferItem offer={offer.offer} />
                      </div>
                    );
                  }
                })}
              </div>
            </div>
          )
        )}

        {freelancerPortfolioData.isLoading ? (
          <div />
        ) : freelancerPortfolioData.isError ? (
          <div> Error fetch data </div>
        ) : (
          freelancerPortfolioData.data !== null &&
          freelancerPortfolioData.data.length !== 0 && (
            <div>
              <p className="mt-6 font-bold text-xl">Portfolio </p>
              <div className="pl-2 mt-5 flex flex-wrap gap-x-3">
                <CarouselPortfolioArrows
                  portfolio={freelancerPortfolioData.data}
                />
              </div>
            </div>
          )
        )}
      </div>

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

function CarouselPortfolioArrows({ portfolio }) {
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
  const [hoveredItem, setHoveredItem] = useState(null);

  // List of items to be rendered in the carousel
  let items = [];

  if (portfolio) {
    items = portfolio.portfolioItems.map((portfolioItem, index) => {
      let mainSrc = null;
      let isVideo = false;

      // Check if portfolio item contains images
      if (portfolioItem.images && portfolioItem.images.length > 0) {
        mainSrc = portfolioItem.images[0];
      }

      // Check if portfolio item contains video
      if (portfolioItem.video) {
        mainSrc = portfolioItem.video;
        isVideo = true;
      }

      return {
        src: mainSrc,
        isVideo: isVideo,
        title: portfolioItem.title,
        description: portfolioItem.description,
        numberOfImages: portfolioItem.images ? portfolioItem.images.length : 0,
      };
    });
  }

  return (
    <Carousel
      className="rounded-xl"
      responsive={responsive}
      arrows={false}
      prevArrow={({ handlePrev }) => (
        <IconButton
          variant="text"
          color="white"
          size="lg"
          onClick={handlePrev}
          className="!absolute top-2/4 left-4 -translate-y-2/4"
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
          className="!absolute top-2/4 !right-4 -translate-y-2/4"
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
      {[...Array(Math.ceil(items.length / (items.length === 1 ? 1 : 2)))].map(
        (_, slideIndex) => (
          <div key={slideIndex} className="flex">
            {items
              .slice(
                slideIndex * (items.length === 1 ? 1 : 2),
                slideIndex * (items.length === 1 ? 1 : 2) +
                  (items.length === 1 ? 1 : 2)
              )
              .map((item, index) => (
                <div
                  key={index}
                  className={`w-${
                    items.length === 1 ? "full mr-3" : "1/2 mr-3"
                  } cursor-pointer relative `}
                  onMouseEnter={() => setHoveredItem(item.title)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  {item.src && item.src.type.includes("image") ? (
                    <img
                      src={item.src.url}
                      alt={item.alt}
                      className="h-[400px] w-full object-cover"
                    />
                  ) : (
                    <ReactPlayer
                      url={item.src.url}
                      controls={true}
                      width="100%"
                      height="400px"
                    />
                  )}
                  {/* Overlay */}
                  {hoveredItem === item.title && (
                    <div className="absolute inset-0 flex justify-center items-center">
                      <div className="bg-black opacity-30  absolute bottom-0 left-0 right-0 top-2/3 rounded-t-lg"></div>
                      <div className="p-4 text-white absolute bottom-0 left-0 right-0 top-1/2 z-20 flex flex-row justify-between items-end">
                        <p>{item.title}</p>
                        <div className="flex items-center gap-2 bg-black_04 opacity-50 p-2 rounded-full">
                          <IoCameraOutline />
                          <span> {item.numberOfImages}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>
        )
      )}
    </Carousel>
  );
}

export function CarouselOfferArrows({ gallery }) {
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

  const [hovered, setHovered] = useState(false);

  const handlePrev = (fn) => {
    fn();
    setHovered(false);
  };

  const handleNext = (fn) => {
    fn();
    setHovered(false);
  };

  let items = [];

  if (gallery.images) items = [...gallery.images];
  if (gallery.video) items = [...items, gallery.video];

  const isFirstItem =
    items.length > 0 && hovered && items.indexOf(items[0]) === 0;
  const isLastItem =
    items.length > 0 &&
    hovered &&
    items.indexOf(items[items.length - 1]) === items.length - 1;

  return (
    <div className="relative">
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
        // Pass "false" as a string
      >
        {items.map((item, index) => (
          <div key={index}>
            {item.type.includes("image") ? (
              <img
                src={item.url}
                alt={item.alt}
                className="h-[200px] w-full object-cover"
              />
            ) : (
              <ReactPlayer
                url={item.url}
                controls={true}
                width="100%"
                height="200px"
              />
            )}
          </div>
        ))}
      </Carousel>
    </div>
  );
}

function SkillsComponent({ skills }) {
  return (
    skills && (
      <div className="pl-2">
        <p className="font-bold text-lg">Skills </p>
        <div className="flex flex-wrap  gap-2">
          {skills.map((skill, index) => (
            <div key={index} className="flex gap-2">
              {Object.keys(skill).map((key, innerIndex) => {
                if (key === "name") {
                  return (
                    <p key={innerIndex} className="text-base">
                      {skill[key]}
                    </p>
                  );
                }
              })}
              {index !== skills.length - 1 && <span>•</span>}
            </div>
          ))}
        </div>
      </div>
    )
  );
}
function EducationsComponent({ education }) {
  return (
    education && (
      <div className="pl-2">
        <p className="font-bold text-lg">Educations </p>
        <div className="flex flex-wrap  gap-2">
          {education.map((education, index) => (
            <div key={index} className="flex gap-2">
              {Object.keys(education).map((key, innerIndex) => {
                if (key === "title") {
                  return (
                    <p key={innerIndex} className="text-base">
                      {education[key]} {education["yearGrad"]}
                    </p>
                  );
                }
              })}
              {index !== education.length - 1 && <span>•</span>}
            </div>
          ))}
        </div>
      </div>
    )
  );
}
function CertificationsComponent({ certifications }) {
  return (
    certifications && (
      <div className="pl-2">
        <p className="font-bold text-lg">Certifications </p>
        <div className="flex flex-wrap  gap-2">
          {certifications.map((skill, index) => (
            <div key={index} className="flex gap-2">
              {Object.keys(skill).map((key, innerIndex) => {
                if (key === "title") {
                  return (
                    <p key={innerIndex} className="text-base">
                      {skill[key]}
                    </p>
                  );
                }
              })}
              {index !== certifications.length - 1 && <span>•</span>}
            </div>
          ))}
        </div>
      </div>
    )
  );
}

function AboutMeComponent({ description }) {
  return (
    description && (
      <div className="pl-2 max-w-[700px]">
        <p className="font-bold text-lg">About me</p>
        <p className="text-base text-left">{description}</p>
      </div>
    )
  );
}

const OfferItem = ({ offer }) => {
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate(
      `/subservices/${offer.serviceId}/offers/${offer.subServiceId}/offer/${offer.documentRef}`
    );
  };

  return (
    <div className="inline-block group ">
      <div className="flex flex-col w-[300px] mr-2  items-start justify-start  border-gray-300_02 border border-solid bg-white-A700 overflow-hidden">
        <div className="w-full relative">
          <div className=" rounded-lg h-[200px]  w-full">
            <CarouselOfferArrows
              key={offer.documentRef}
              gallery={offer.gallery}
            />
          </div>
          <div onClick={handleNavigate} className="mx-2 mt-6 cursor-pointer">
            <div className=" mt-2 border-b-transparent group-hover:border-b-gray-500">
              {offer.title}
            </div>

            <div className="my-2 font-bold flex items-center gap-1">
              <p>From</p>
              <p className="ml-3">{offer.basicPlan.price}</p>
              <p>TND</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
