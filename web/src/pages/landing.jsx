import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Landing1 from "../assets/images/landing1.jpg";
import Landing2 from "../assets/images/landing2.jpg";
import Landing3 from "../assets/images/landing3.jpg";
import { CiCircleCheck } from "react-icons/ci";
import Footer from "../components/Footer";
import SignUp from "../components/modals/SignUp";
import LogIn from "../components/modals/Login";
import { useServices } from "../apis/services";
import { extractRootServices } from "../util";
import { RiArrowRightSLine, RiArrowLeftSLine } from "react-icons/ri";
import LoadingPage from "../components/Loading";
import { useAuth } from "../hooks/auth_context";
import {
  Link,
  ScrollRestoration,
  useLoaderData,
  useNavigate,
} from "react-router-dom";

export const LandingPage = () => {
  const [sliderState, setSliderState] = React.useState(0);
  const sliderRef = React.useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [showTwoModal, setShowTwoModal] = useState(false);
  const modelRef = React.useRef(null);
  const modelTwoRef = React.useRef(null);
  const modelNavRef = React.useRef(null);
  const [nav, setNav] = useState(false);
  const { isLoading, error, data } = useServices();

  useOnClickOutside(modelRef, () => setShowModal(false), showModal);
  useOnClickOutside(modelTwoRef, () => setShowTwoModal(false), showTwoModal);
  useOnClickOutside(modelNavRef, () => setNav(false), nav);

  if (isLoading) return <div />;
  if (error) return <div>An error occurred while fetching the user data </div>;

  const closeModal = () => {
    setShowModal(false);
  };
  const services = extractRootServices(data);
  return (
    <>
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

      <Navbar
        modelNavRef={modelNavRef}
        setShowTwoModal={setShowTwoModal}
        showTwoModal={showTwoModal}
        setIsPopoverOpen={setShowModal}
        isPopoverOpen={showTwoModal}
        nav={nav}
        setNav={setNav}
        services={services}
      />

      <RandomPhoto photos={[Landing1, Landing2, Landing3]} />
      <div className="max-w-[1240px] mx-auto my-20 overflow-hidden scroll whitespace-nowrap scroll-smooth scrollbar-hide items-center relative">
        <div className="flex flex-col items-start justify-start w-full gap-6">
          <div className="flex flex-row justify-start ml-1 ">
            <span className="text-gray-800_02 font-bold text-2xl md:text-4xl ">
              Popular services
            </span>
          </div>

          <Slide data={data} />
        </div>
      </div>
      <div className="bg-sky-200 mb-10 pb-10">
        <div className="max-w-[1240px] p-20 w-full  mx-auto text-center flex flex-col gap-5 md:flex-row justify-center items-center">
          <div className="flex justify-start flex-col items-start">
            <h1 className="text-[22px] md:text-3xl font-bold text-gray-800_02 mb-7">
              The best part? Everything.
            </h1>
            <div className="flex flex-col mb-10">
              <div className="flex flex-row gap-1 items-center">
                <CiCircleCheck size={40} />
                <p className="text-[17.5px] md:text-2xl font-bold text-gray-800_02">
                  Tieup: Tunisia's Leading Freelance Platform
                </p>
              </div>
              <p className="text-sm md:text-[18px] text-start  text-gray-800_02">
                Tieup: The first freelance platform in Tunisia, leading the way
                in digital transformation (Dt).
              </p>
            </div>
            <div className="flex flex-col  mb-10">
              <div className="flex flex-row gap-1 items-center">
                <CiCircleCheck size={40} />
                <p className="text-[17.5px] md:text-2xl font-bold text-gray-800_02">
                  Tieup: Evolving to Meet Your Needs Daily
                </p>
              </div>
              <p className=" text-sm md:text-[18px]  text-start  text-gray-800_02">
                Continuously evolving to meet your needs – Tieup offers more and
                more every day
              </p>
            </div>
            <div className="flex flex-col  mb-10">
              <div className="flex flex-row gap-1 items-center">
                <CiCircleCheck size={40} />
                <p className="text-[17.5px] md:text-2xl font-bold text-gray-800_02">
                  Security with Tieup's Freelance Network
                </p>
              </div>
              <p className="text-sm md:text-[18px] text-start  text-gray-800_02">
                Experience unmatched security and reliability with Tieup’s
                freelance network.
              </p>
            </div>
            <div className="flex flex-col ">
              <div className="flex flex-row  gap-1 items-center">
                <CiCircleCheck size={40} />
                <p className="text-[17.5px] md:text-2xl font-bold text-gray-800_02">
                  Join Tieup: Innovation and Top Talent in Tunisia{" "}
                </p>
              </div>
              <p className="text-sm md:text-[18px] text-start  text-gray-800_02">
                Join Tieup: Where innovation meets top-tier freelance talent in
                Tunisia.
              </p>
            </div>
          </div>
          <div>
            <img
              src={Landing3}
              alt="/"
              className="w-48 md:w-[500px] object-cover "
            />
          </div>
        </div>
      </div>
      <div className="max-w-[1240px] mx-auto my-10 ">
        <div className="flex flex-col items-start justify-start w-full gap-6">
          <div className="flex flex-row justify-start ml-1 ">
            <span className="text-gray-800_02 font-bold text-2xl md:text-4xl">
              You need it, we've got it
            </span>
          </div>
          <div className="w-full flex  flex-wrap justify-center md:justify-normal gap-7  row-span-4 ">
            {services.map((service) => {
              return (
                <div
                  key={service.documentRef}
                  className="w-full sm:w-1/2 md:w-1/3 lg:w-1/5 p-2"
                >
                  {" "}
                  <Link
                    preventScrollReset={false}
                    to={`/subservices/${service.documentRef}`}
                  >
                    <CategoryItem service={service} />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <Footer services={services} />
    </>
  );
};

const CategoryItem = ({ service }) => {
  return (
    <div className="flex flex-col justify-center items-center group cursor-pointer ">
      <img src={service.image} className="w-36 mb-2 rounded-md" alt="" />
      <span className="border-b-2  w-[30%] group-hover:border-b-[#0074E9] group-hover:w-[50%] ease-in-out duration-300"></span>
      <div className="text-[16px] text-center">{service.name}</div>
    </div>
  );
};

const RandomPhoto = ({ photos }) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  let [termSearch, setTermSearch] = useState("");
  const navigate = useNavigate();

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    // Navigate to search page with query parameter

    if (termSearch) navigate(`/search?term=${termSearch}`);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentPhotoIndex((prevIndex) => (prevIndex + 1) % photos.length);
    }, 3000); // Change photo every 3 seconds (adjust as needed)

    return () => clearInterval(intervalId);
  }, [photos]);

  return (
    <div className="relative w-full h-svh">
      {photos.map((photo, index) => (
        <img
          key={index}
          src={photo}
          alt="Random"
          className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${
            currentPhotoIndex === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      <div className="absolute inset-0 bg-black opacity-50 flex items-center" />
      <div className="absolute  top-1/2 left-[20%]  -translate-y-1/ text-white max-w-3xl mx-auto px-6">
        <h1 className="text-4xl md:text-6xl  font-bold leading-tight mb-4">
          Find the right freelance service, right away
        </h1>
        <form>
          <label htmlFor="search" className="sr-only">
            What service are you looking for today?
          </label>
          <div className="relative">
            <input
              type="search"
              id="search2"
              value={termSearch}
              onChange={(e) => {
                setTermSearch(e.target.value);
              }}
              className="block w-full p-4 rounded-lg bg-white placeholder-gray-500 text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="What service are you looking for today?"
              required
            />
            <button
              onClick={handleSearchSubmit}
              type="submit"
              className="absolute inset-y-0 right-0 px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Search
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function useOnClickOutside(ref, handler, isOpen) {
  useEffect(() => {
    const listener = (event) => {
      // Do nothing if clicking ref's element or descendent elements
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };
    if (isOpen) {
      document.body.style.overflow = "hidden"; // Hide scrolling when modal is open
    } else {
      document.body.style.overflow = "";
    }
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [isOpen, ref]);
}

export const Slide = ({ data }) => {
  const slideLeft = () => {
    var slider = document.getElementById("slider");
    slider.scrollLeft = slider.scrollLeft - 600;
  };

  const slideRight = () => {
    var slider = document.getElementById("slider");
    slider.scrollLeft = slider.scrollLeft + 600;
  };
  return (
    <div className="   flex items-center ">
      <RiArrowLeftSLine
        className="opacity-50 cursor-pointer hover:opacity-100"
        onClick={slideLeft}
        size={40}
      />
      <div
        id="slider"
        className="w-full h-full   overflow-x-scroll scroll whitespace-nowrap scroll-smooth scrollbar-hide items-center"
      >
        {data.map((item, index) => (
          <div
            key={index}
            className="inline-block hover:scale-105     ease-in-out duration-300"
          >
            <Link
              to={
                item.isRoot
                  ? `/subservices/${item.documentRef}`
                  : `/subservices/${item.parentServiceId}/offers/${item.documentRef}`
              }
            >
              <img
                className="w-60 h-40 md:w-80 md:h-60 object-cover rounded-lg  p-2 cursor-pointer  "
                src={item.image}
                alt="/"
              />
              <h1 className="w-full text-center text-sm">{item.name}</h1>
            </Link>
          </div>
        ))}
      </div>
      <div className="absolute top-[50%] right-0  h-full">
        <RiArrowRightSLine
          className="text-white md:text-black opacity-50 cursor-pointer hover:opacity-100"
          onClick={slideRight}
          size={40}
        />
      </div>
    </div>
  );
};
