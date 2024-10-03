import React, { useEffect, useRef, useState } from "react";
import Footer from "../components/Footer";
import { useServices } from "../apis/services";
import { extractRootServices, extractSubServicesByServiceId } from "../util";
import LoadingPage from "../components/Loading";
import { useAuth } from "../hooks/auth_context";
import NavbarAuth from "../components/NavBarAuth";
import { FaHandPaper, FaStar } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import { CategoryItem } from "../components/common/CategoryItem";
import { Breadcrumbs } from "@material-tailwind/react";
import { useGetUser } from "../apis/user_api";
import useOnClickOutside from "./landing";
import LogIn from "../components/modals/Login";
import SignUp from "../components/modals/SignUp";
import NavbarUnAuth from "../components/NavbarUnAuth";

export const SubServicesPage = () => {
  const modelNavRef = React.useRef(null);
  const [nav, setNav] = useState(false);
  const { currentUser, isLoggedIn } = useAuth();
  const { serviceId } = useParams();
  const { isLoading, error, data } = useServices();
  const user = useGetUser(currentUser.userId, currentUser.accessToken);

  const [showModal, setShowModal] = useState(false);
  const [showTwoModal, setShowTwoModal] = useState(false);
  const modelRef = React.useRef(null);
  const modelTwoRef = React.useRef(null);
  let [userData, setUserData] = useState([]);

  useEffect(() => {
    if (user.data) {
      setUserData(user.data);
    }
  }, [user.data]);

  useOnClickOutside(modelRef, () => setShowModal(false), showModal);
  useOnClickOutside(modelTwoRef, () => setShowTwoModal(false), showTwoModal);
  useOnClickOutside(modelNavRef, () => setNav(false), nav);

  const closeModal = () => {
    setShowModal(false);
  };
  if (isLoading) return <div />;
  if (error) return <div>An error occurred while fetching the user data </div>;
  const services = extractRootServices(data);
  const subService = extractSubServicesByServiceId(data, serviceId);
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
        <BreadcrumbsDefault serviceName={subService.rootName} />
      </div>

      <div
        className={`flex flex-col rounded-lg bg-primary hover:bg-gradient-to-tr cursor-pointer items-start mt-10 justify-center h-60 max-w-[1240px] mx-auto pb-8 gap-[51px]   bg-cover bg-no-repeat `}
      >
        <div className="flex flex-col items-center justify-center w-full gap-[5px] p-[31px]">
          <h1 className=" text-4xl text-gray-50_01 flex gap-6">
            {subService.rootName}
          </h1>
          <div className="text-xl mt-3 text-gray-50_01">
            Unlock the possibilities and discover our services tailored just for
            you!
          </div>
        </div>
      </div>

      <div className="max-w-[1240px] mx-auto my-20 ">
        <div className="flex flex-col items-start justify-start w-full gap-6">
          <div className="w-full flex  flex-wrap justify-center md:justify-normal gap-7  row-span-4 ">
            {subService.map((sub) => {
              return (
                <div
                  key={sub.documentRef}
                  className="w-full sm:w-1/2 md:w-1/3 lg:w-1/5 p-2"
                >
                  <Link
                    to={`/subservices/${serviceId}/offers/${sub.documentRef}`}
                  >
                    <CategoryItem service={sub} />
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

export function BreadcrumbsDefault({ serviceName }) {
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
      <Link className="text-primary">{serviceName}</Link>
    </Breadcrumbs>
  );
}
