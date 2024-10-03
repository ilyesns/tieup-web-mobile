import React, { useState } from "react";
import { searchUsers } from "../api/users";
import { Select, Option } from "@material-tailwind/react";

import { Tab } from "../pages/Customers";
import { Snipper } from "./common/Snipper";
import DateTimeDisplay from "./common/DateTimeDisplay";
import { Toast } from "flowbite-react";
import { HiCheck } from "react-icons/hi2";
import { useQueryClient } from "@tanstack/react-query";
import { updateStatus } from "../api/withdrawal";

export const WithdrawalModal = ({
  toggleModal,
  isModalOpen,
  withdrawal,
}: {
  isModalOpen: boolean;
  toggleModal: () => void;
  withdrawal: any;
}) => {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const queryClient = useQueryClient(); // Get the query client instance

  const openToast = () => {
    setShowToast(true);
  };
  const handleToastMessage = (message: string) => {
    setToastMessage(message);
  };

  const handleUpdateStatus = async () => {
    try {
      setIsUpdating(true);
      const result = await updateStatus(withdrawal.id, "Checked", "");
      setToastMessage(result);
      queryClient.invalidateQueries({ queryKey: ["withdrawals"] });

      setShowToast(true);
      setIsUpdating(false);
      toggleModal();
    } catch (e) {
      console.log(e);
      setIsUpdating(false);
    }
  };
  return (
    <>
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
                  key={withdrawal.withdrawalId}
                  className=" w-full mt-3 flex cursor-pointer flex-row justify-between items-center text-black_04   py-2 px-6 "
                >
                  <div className="flex gap-2 items-center">
                    <div className="first-letter:uppercase truncate">
                      {withdrawal.name}
                    </div>
                  </div>
                  <div className="first-letter:uppercase truncate ">
                    {withdrawal.accountNumber ? withdrawal.accountNumber : "_"}
                  </div>
                  <div className="first-letter:uppercase truncate ">
                    {withdrawal.amount ? withdrawal.amount : "_"}DT
                  </div>
                  <div className=" flex flex-col gap-2">
                    <p>{withdrawal.contactInfo.phoneNumber}</p>
                    <p>{withdrawal.contactInfo.email}</p>
                  </div>
                  <div
                    className={`uppercase p-2 rounded-lg w-26 text-white ${
                      withdrawal.status === "Unchecked"
                        ? "bg-yellow-300"
                        : "bg-green-600"
                    }`}
                  >
                    {withdrawal.status}
                  </div>

                  <div className="text-sm ">
                    <DateTimeDisplay
                      timestamp={withdrawal.institutionalUseOnly.dateProcessed}
                    />
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
                    onClick={handleUpdateStatus}
                    disabled={isUpdating}
                    className="first-letter:uppercase p-2 rounded-md bg-primary w-36 text-white"
                  >
                    {isUpdating ? "marking.." : "Mark as Checked"}
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
