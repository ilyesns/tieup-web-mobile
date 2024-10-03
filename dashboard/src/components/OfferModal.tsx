import React, { useState } from "react";
import { searchUsers } from "../api/users";
import { Select, Option } from "@material-tailwind/react";
import Empty from "../assets/images/empty.jpg";
import { Tab } from "../pages/Customers";
import { Snipper } from "./common/Snipper";
import DateTimeDisplay from "./common/DateTimeDisplay";
import { deleteOffer, updateStatus } from "../api/offers";
import { Toast } from "flowbite-react";
import { HiCheck } from "react-icons/hi2";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../hooks/auth_context";
import { DeleteModal } from "./DeletePopUp";

export const OfferModal = ({
  toggleModal,
  isModalOpen,
  offer,
}: {
  isModalOpen: boolean;
  toggleModal: () => void;
  offer: any;
}) => {
  const [status, setStatus] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const queryClient = useQueryClient();
  const [isModalTwOpen, setisModalTwOpen] = useState(false);

  const toggleModalTwo = () => {
    setisModalTwOpen(!isModalTwOpen);
  };
  const openToast = () => {
    setShowToast(true);
  };
  const handleToastMessage = (message: string) => {
    setToastMessage(message);
  };

  const handleUpdateStatus = async () => {
    if (status) {
      try {
        setIsUpdating(true);
        const result = await updateStatus(offer.offerId, status, "");
        setToastMessage(result);
        queryClient.invalidateQueries({ queryKey: ["offers"] });

        setShowToast(true);
        setIsUpdating(false);
        toggleModal();
      } catch (e) {
        console.log(e);
        setIsUpdating(false);
      }
    }
  };

  return (
    <>
      {isModalTwOpen && (
        <DeleteModal
          isModalOpen={isModalOpen}
          isModalTwOpen={isModalTwOpen}
          offer={offer}
          toggleModal={toggleModal}
          toggleModalTwo={toggleModalTwo}
        />
      )}
      {isModalOpen && (
        <div
          id="default-modal"
          tabIndex={-1}
          aria-hidden="true"
          className="fixed top-0 right-0 left-0 z-[999] flex items-center justify-center w-full h-full overflow-y-auto overflow-x-hidden bg-gray-800 bg-opacity-50"
        >
          <div className="relative p-4 w-full max-w-[1240px]">
            <div className="relative bg-white rounded-lg shadow ">
              <div className="flex flex-col items-center justify-between p-4 md:p-5 rounded-t ">
                <div
                  key={offer.offerId}
                  className=" w-full mt-3 flex cursor-pointer flex-row justify-between items-center text-black_04   py-2 px-6 "
                >
                  <div className="flex gap-2 items-center">
                    <img
                      src={
                        !offer.gallery || !offer.gallery.images
                          ? Empty
                          : offer.gallery.images[0].url
                      }
                      className="w-20 h-20 rounded-lg aspect-auto"
                    />
                    <div className="first-letter:uppercase truncate w-32">
                      {offer.title}
                    </div>
                  </div>
                  <div className="first-letter:uppercase truncate w-32">
                    {offer.description}
                  </div>
                  <div className="w-10">{offer.freelancerUsername}</div>

                  <div
                    className={`uppercase p-2 rounded-lg w-26 text-white ${
                      offer.status === "pendingApproval"
                        ? "bg-yellow-300"
                        : offer.status === "active"
                        ? "bg-green-600"
                        : "bg-gray-500"
                    }`}
                  >
                    {offer.status}
                  </div>
                  <div className="text-sm ">
                    <DateTimeDisplay timestamp={offer.createdAt} />
                  </div>
                  <div className="w-72">
                    <select
                      id="countries"
                      onChange={(e) => {
                        setStatus(e.target.value);
                      }}
                      className="bg-gray-50 border border-gray-300 first-letter:uppercase  text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    >
                      <option defaultValue={""}>Update status</option>
                      <option value="active">Active</option>
                      <option value="pendingApproval">Pending</option>
                      <option value="denied">Denied</option>
                    </select>
                  </div>
                </div>
                <div className="flex w-full justify-between items-center p-4 mt-5">
                  <button
                    onClick={toggleModal}
                    disabled={isUpdating}
                    className="first-letter:uppercase p-2 rounded-md bg-gray-600 w-28 text-white"
                  >
                    cancel
                  </button>
                  <button
                    onClick={toggleModalTwo}
                    className="first-letter:uppercase p-2 rounded-md bg-secondary w-28 text-white"
                  >
                    delete
                  </button>
                  <button
                    onClick={handleUpdateStatus}
                    disabled={isUpdating || !status}
                    className="first-letter:uppercase p-2 rounded-md bg-primary w-28 text-white"
                  >
                    {isUpdating ? "updating.." : "update"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {showToast && (
        <div className=" fixed bottom-10 left-20 z-30">
          <Toast>
            <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
              <HiCheck className="h-5 w-5" />
            </div>
            <div className="ml-3 text-sm font-normal first-letter:uppercase">
              {toastMessage}
            </div>
            <Toast.Toggle onClick={() => setShowToast(false)} />
          </Toast>
        </div>
      )}
    </>
  );
};
