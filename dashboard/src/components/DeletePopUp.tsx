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

export const DeleteModal = ({
  toggleModal,
  toggleModalTwo,
  isModalOpen,
  isModalTwOpen,
  offer,
}: {
  isModalOpen: boolean;
  isModalTwOpen: boolean;
  toggleModal: () => void;
  toggleModalTwo: () => void;
  offer: any;
}) => {
  const [showToast, setShowToast] = useState(false);
  const { currentUser } = useAuth();
  const [toastMessage, setToastMessage] = useState("");

  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient(); // Get the query client instance

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const result = await deleteOffer(offer.offerId, currentUser.accessToken);
      setToastMessage(result);
      queryClient.invalidateQueries({ queryKey: ["offers"] });

      setShowToast(true);
      setIsDeleting(false);
      toggleModalTwo();
      toggleModal();
    } catch (e) {
      console.log(e);
      setIsDeleting(false);
    }
  };
  return (
    <>
      {isModalTwOpen && (
        <div
          id="default-modal"
          tabIndex={-1}
          aria-hidden="true"
          className="fixed top-0 right-0 left-0 z-[9999] flex items-center justify-center w-full h-full overflow-y-auto overflow-x-hidden bg-gray-800 bg-opacity-50"
        >
          <div className="relative p-4 w-full max-w-[1240px]">
            <div className="relative bg-white rounded-lg shadow ">
              <div className="flex flex-col items-center justify-between p-4 md:p-5 rounded-t ">
                <div className="flex w-full justify-between items-center p-4 mt-5">
                  <button
                    onClick={toggleModal}
                    disabled={isDeleting}
                    className="first-letter:uppercase p-2 rounded-md bg-gray-600 w-28 text-white"
                  >
                    cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="first-letter:uppercase p-2 rounded-md bg-secondary w-28 text-white"
                  >
                    {isDeleting ? "deleting.." : "delete"}
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
