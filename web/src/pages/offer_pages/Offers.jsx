import React, { useEffect, useRef, useState } from "react";
import Footer from "../../components/Footer";
import { useOffersByService, useServices } from "../../apis/services";
import { extractRootServices, extractSubService } from "../../util";
import { useAuth } from "../../hooks/auth_context";
import NavbarAuth from "../../components/NavBarAuth";
import { Link, useParams } from "react-router-dom";
import { Breadcrumbs } from "@material-tailwind/react";
import { FaStar } from "react-icons/fa";
import Landing3 from "../../assets/images/landing3.jpg";
import PaginationButtons from "../../components/PaginationButtons";
import { OfferItem } from "../../components/common/OfferItem";
import { useGetUser } from "../../apis/user_api";
import useOnClickOutside from "../landing";
import LogIn from "../../components/modals/Login";
import SignUp from "../../components/modals/SignUp";
import NavbarUnAuth from "../../components/NavbarUnAuth";
import { CircularProgress } from "@mui/material";

export const OffersPage = () => {
  const modelNavRef = React.useRef(null);
  const [nav, setNav] = useState(false);
  const { isLoading, error, data } = useServices();
  const { currentUser, isLoggedIn } = useAuth();
  const { serviceId, subServiceId } = useParams();
  const offersData = useOffersByService(
    subServiceId,
    isLoggedIn,
    currentUser.userId
  );
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
  const service = services.find((service) => service.documentRef === serviceId);
  const subService = data.find(
    (service) => service.documentRef === subServiceId
  );

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
        <BreadcrumbsDefault service={service} subService={subService} />
      </div>

      <div
        className={`flex flex-col rounded-lg bg-primary hover:bg-gradient-to-tr cursor-pointer items-start mt-10 justify-center h-60 max-w-[1240px] mx-auto pb-8 gap-[51px]   bg-cover bg-no-repeat `}
      >
        <div className="flex flex-col items-center justify-center w-full gap-[5px] p-[31px]">
          <h1 className=" text-4xl text-gray-50_01 flex gap-6">
            {subService.name}
          </h1>
          <div className="text-xl mt-3 text-gray-50_01">
            Unlock the possibilities and discover our services tailored just for
            you!
          </div>
        </div>
      </div>

      <div className="max-w-[1240px] mx-auto my-40 ">
        {offersData.isLoading ? (
          <div>
            <CircularProgress size={20} />{" "}
          </div>
        ) : !offersData.data || offersData.data.length === 0 ? (
          <div className="flex justify-center">
            This Sub Category has no offers yet.
          </div>
        ) : (
          offersData.data &&
          offersData.data.length !== 0 && (
            <div className="w-full h-full  grid grid-cols-1 justify-items-center items-center  md:grid-cols-3 gap-y-3 ">
              {offersData.data.map((offer) => {
                return <OfferItem key={offer.offer.documentRef} data={offer} />;
              })}
            </div>
          )
        )}
      </div>
      {/* <PaginationButtons currentPage={1} setCurrentPage={1} totalPages={6} /> */}
      <Footer services={services} />
    </>
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
