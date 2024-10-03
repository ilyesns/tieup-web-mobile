import React, { useEffect, useRef, useState } from "react";
import Footer from "../components/Footer";
import { useOffers, useServices } from "../apis/services";
import { BASE_URL, extractRootServices, extractSubServices } from "../util";
import { useAuth } from "../hooks/auth_context";
import NavbarAuth from "../components/NavBarAuth";
import BG from "../assets/images/img_frame_153x896.png";
import { FaHandPaper } from "react-icons/fa";
import { CategoryItem } from "../components/common/CategoryItem";
import { Slide } from "../components/common/Slide";
import Navbar from "../components/Navbar";
import useOnClickOutside from "./landing";
import SignUp from "../components/modals/SignUp";
import LogIn from "../components/modals/Login";
import { useGetUser } from "../apis/user_api";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import NavbarUnAuth from "../components/NavbarUnAuth";
import { useLocation } from "react-router-dom";
import LoadingPage from "../components/Loading";
import {Slide as ServiceSlide} from "./landing";
export const HomePage = () => {
  const modelNavRef = React.useRef(null);
  const [nav, setNav] = useState(false);
  const { isLoading, error, data } = useServices();
  const { currentUser, isLoggedIn } = useAuth();
  const user = useGetUser(currentUser.userId, currentUser.accessToken);
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [showTwoModal, setShowTwoModal] = useState(false);
  const modelRef = React.useRef(null);
  const modelTwoRef = React.useRef(null);
  let [userData, setUserData] = useState([]);

  const offersData = useOffers();
  const location = useLocation();
  const message = location.state?.message;
  useEffect(() => {
    if (user.data) {
      setUserData(user.data);
    }
  }, [user.data]);

  useEffect(() => {
    const isError = sessionStorage.getItem("showErrorMessage");
    if (isError) {
      setShowErrorMessage(true);
      sessionStorage.removeItem("showErrorMessage"); // Remove the item after showing the error message
    }
  }, []);

  useOnClickOutside(modelRef, () => setShowModal(false), showModal);
  useOnClickOutside(modelTwoRef, () => setShowTwoModal(false), showTwoModal);
  useOnClickOutside(modelNavRef, () => setNav(false), nav);

  const closeModal = () => {
    setShowModal(false);
  };
  if (isLoading) return <LoadingPage />;
  if (error) return <div>An error occurred while fetching the user data </div>;
  const services = extractRootServices(data);
  const subServices = extractSubServices(data);
  return (
    <>
      {showErrorMessage && (
        <div className="bg-secondary w-full flex justify-center text-white text-lg">
          Access Denied
        </div>
      )}

      <div className="w-full bg-red-400">
        <div className="max-w-[1240px] mx-auto flex justify-center items-center">
          {message && <p>{message}</p>}
        </div>
      </div>
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
        <NavbarAuth services={services} />
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

      {isLoggedIn && (
        <div
          className={`flex flex-col  rounded-lg
         bg-primary  hover:bg-gradient-to-tr cursor-pointer items-start mt-10 justify-center h-60 max-w-[1240px] mx-auto pb-8 gap-[51px]   bg-cover bg-no-repeat ${BG}`}
        >
          <div className="flex flex-col items-start justify-center w-full gap-[5px] p-[31px]">
            <h1 className=" text-4xl text-gray-50_01 flex gap-6">
              Welcome back , {userData.firstName + " " + userData.lastName}
              <p>
                <FaHandPaper />
              </p>
            </h1>
            <div className="text-xl mt-3 text-gray-50_01">
              Unlock the possibilities and discover our services tailored just
              for you!
            </div>
            <div className="text-[18px] mt-1 text-gray-50_01 border-b border-transparent hover:border-b hover:border-gray-300">
              Figure out our services {`>`}
            </div>
          </div>
        </div>
      )}
      

          <div className="max-w-[1240px] mx-auto my-20  overflow-hidden scroll whitespace-nowrap scroll-smooth scrollbar-hide items-center relative">
        <div className="flex flex-col items-start justify-start w-full gap-6">
          <div className="flex flex-row justify-start ml-1 ">
            <span className="text-gray-800_02 font-bold text-4xl ">
              Popular services
            </span>
          </div>

          <ServiceSlide data={subServices.slice(0, 10)} />
        </div>
      </div>
      
      {offersData.data && (
        <>
          
          <div className="max-w-[1240px] mx-auto my-20    ">
            <div className="flex flex-col items-start justify-start  gap-6">
              <div className="flex flex-row justify-start ml-1 ">
                <span className="text-gray-800_02 font-bold text-4xl ">
                  Offers you may like
                </span>
              </div>
              <Slide key={"222"} data={offersData.data} />
            </div>
          </div>
        </>
      )}

      <div className="max-w-[1240px] mx-auto my-20 ">
        <div className="flex flex-col items-start justify-start w-full gap-6">
          <div className="flex flex-row justify-start ml-1 ">
            <span className="text-gray-800_02 font-bold text-4xl ">
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
                  <Link to={`/subservices/${service.documentRef}`}>
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
