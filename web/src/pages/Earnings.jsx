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
import Footer from "../components/Footer";
import { useServices } from "../apis/services";
import { useFreelancerWallet } from "../apis/wallet";
import { WithdrawalModal } from "../components/modals/WithdrawalModal";
import { HiCheck } from "react-icons/hi2";
import { Toast } from "flowbite-react";
export const EarningsPage = () => {
  const { currentUser } = useAuth();
  const { data } = useGetUser(currentUser.userId, currentUser.accessToken);
  const serivceData = useServices();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const wallet = useFreelancerWallet(currentUser.userId);
  if (serivceData.isLoading) return <div />;
  if (serivceData.error)
    return <div>An error occurred while fetching the user data </div>;
  const services = extractRootServices(serivceData.data);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    document.body.style.overflow = isModalOpen ? "auto" : "hidden";
  };
  const openToast = () => {
    setShowToast(true);
  };

  return (
    <div className="bg-slate-50 h-svh">
      <NavbarFreelancer />
      {isModalOpen && (
        <WithdrawalModal
          isVisible={isModalOpen}
          openToast={openToast}
          onClose={toggleModal}
        />
      )}
      <div className="max-w-[1240px] mx-auto my-14">
        <div className="flex flex-col md:flex-row gap-x-6 gap-y-3">
          <button
            onClick={toggleModal}
            className="p-2 bg-primary text-white text-lg rounded-md shadow-sm"
          >
            Ask for withdrawal
          </button>
        </div>
      </div>
      {showToast && (
        <div className=" fixed bottom-10 left-20 z-30">
          <Toast>
            <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
              <HiCheck className="h-5 w-5" />
            </div>
            <div className="ml-3 text-sm font-normal first-letter:uppercase">
              Your withdrawal request has been successfully submitted to the
              administrators.
            </div>
            <Toast.Toggle onClick={() => setShowToast(false)} />
          </Toast>
        </div>
      )}
      <Footer services={services} />
    </div>
  );
};
