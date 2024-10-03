import React, { ChangeEvent, useRef, useState } from "react";

import DateTimeDisplay from "./common/DateTimeDisplay";
import { Toast } from "flowbite-react";
import { HiCheck } from "react-icons/hi2";
import { useQueryClient } from "@tanstack/react-query";
import Avatar from "../assets/images/avatar.png";
import { useForm } from "react-hook-form";
import { useAuth } from "../hooks/auth_context";
import { updateUser, uploadPhoto } from "../api/users";
import { Snipper } from "./common/Snipper";

export const ProfileModal = ({
  toggleModal,
  isModalOpen,
}: {
  isModalOpen: boolean;
  toggleModal: () => void;
}) => {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const { currentUser } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // State to hold the selected file
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const openToast = () => {
    setShowToast(true);
  };
  const handleToastMessage = (message: string) => {
    setToastMessage(message);
  };

  const {
    register,
    handleSubmit,
    setError,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      phoneNumber: currentUser.phoneNumber,
    },
  });
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      try {
        setIsUploading(true);
        await uploadPhoto(currentUser.userId!, files[0]);
        setSelectedFile(null); // Reset selected file
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        window.location.reload();
      } catch (e) {
        console.error("Upload failed:", e);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleChangePhoto = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Open file dialog
    }
  };

  const onSubmit = async (data: any) => {
    try {
      const userData = {
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
      };
      const result = await updateUser(
        userData,
        currentUser.userId!,
        currentUser.accessToken
      );
      toggleModal();
      window.location.reload();
    } catch (e) {
      console.error(e);
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
          <div className="relative p-4 w-full max-w-[1000px]">
            <div className="w-full text-end text-white text-2xl mb-2 cursor-pointer">
              <p onClick={toggleModal}> X</p>
            </div>
            <div className="relative bg-slate-100 rounded-lg shadow ">
              <div className="flex flex-col items-start  justify-between p-4 md:p-5 rounded-t ">
                <h1 className="text-3xl font-semibold ">Edit Profile</h1>
                <p className="text-gray-600 mt-3 text-sm">
                  Below are your profile details
                </p>
                <div className="flex mt-5 gap-4 items-center relative">
                  {isUploading && (
                    <div className="absolute w-32 h-32 rounded-full bg-white opacity-50">
                      {" "}
                      <div className="text-white w-32 h-32  flex justify-center items-center ">
                        {" "}
                        <Snipper />
                      </div>
                    </div>
                  )}
                  <img
                    src={currentUser.photoURL ? currentUser.photoURL : Avatar}
                    alt=""
                    className="w-32 h-32 rounded-full object-cover bg-primary"
                  />
                  <button
                    className="border h-fit bg-white px-4 py-3 rounded-md duration-150 transition-all hover:bg-primary hover:text-white"
                    onClick={handleChangePhoto} // Open the file input
                  >
                    Change Photo
                  </button>

                  <input
                    type="file"
                    ref={fileInputRef} // Reference to the input
                    onChange={handleFileChange} // Update state when file changes
                    style={{ display: "none" }} // Keep it hidden
                    accept="image/*" // Only allow image files
                  />
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="w-full">
                  <div className="mt-5 w-full">
                    <div className="mb-4">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="firstName"
                      >
                        First Name
                      </label>
                      <input
                        className="shadow appearance-none border  rounded w-full py-4 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="firstName"
                        type="text"
                        aria-invalid={errors.firstName ? "true" : "false"}
                        placeholder="Type your full firstName"
                        {...register("firstName", { required: true })}
                      />
                      {errors.firstName?.type === "required" && (
                        <div className="text-red-500">
                          This field is required
                        </div>
                      )}
                    </div>
                    <div className="mb-4">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="lastName"
                      >
                        Last Name
                      </label>
                      <input
                        className="shadow appearance-none border  rounded w-full py-4 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="lastName"
                        type="text"
                        aria-invalid={errors.lastName ? "true" : "false"}
                        placeholder="Type your full lastName"
                        {...register("lastName", { required: true })}
                      />
                      {errors.lastName?.type === "required" && (
                        <div className="text-red-500">
                          This field is required
                        </div>
                      )}
                    </div>
                    <div className="mb-4">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="phoneNumber"
                      >
                        Phone Number
                      </label>
                      <input
                        className="shadow  appearance-none border  rounded w-full py-4 px-3  no-number-spinner text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="phoneNumber"
                        aria-invalid={errors.phoneNumber ? "true" : "false"}
                        placeholder="Please insert the phoneNumber here"
                        maxLength={10} // Set max length (example: 10 digits)
                        onKeyDown={(e) => {
                          const isNumber = /^\d$/.test(e.key);
                          const isAllowedKey = [
                            "Backspace",
                            "ArrowLeft",
                            "ArrowRight",
                            "Delete",
                          ].includes(e.key);
                          if (!isNumber && !isAllowedKey) {
                            e.preventDefault(); // Prevent non-digit input
                          }
                        }}
                        {...register("phoneNumber", {
                          required: "This field is required",
                          validate: (value) =>
                            value.length <= 10 || "Max 10 digits", // Validation rule
                        })}
                      />
                      {errors.phoneNumber && (
                        <div className="text-red-500">
                          This field is required
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-5 w-full flex justify-between items-center">
                    <div className="flex flex-col gap-2">
                      <p className="first-letter:uppercase text-gray-500 text-sm">
                        the email associated with this account is:
                      </p>
                      <p className="font-bold text-lg">{currentUser.email}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <p className="first-letter:uppercase text-gray-500 text-sm">
                        Created On:
                      </p>
                      <p className="font-bold text-lg">
                        <DateTimeDisplay timestamp={currentUser.joinDate!} />
                      </p>
                    </div>
                  </div>
                  <div className="mt-5 w-full flex justify-between items-center">
                    <button
                      onClick={toggleModal}
                      className="px-4 py-2 border rounded-md text-lg bg-white transition-all duration-150 hover:bg-gray-100 hover:text-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      disabled={isSubmitting}
                      type="submit"
                      className="px-4 py-2 border rounded-md text-lg bg-primary text-white transition-all duration-150 hover:bg-blue-500 "
                    >
                      {isSubmitting ? "Saving.." : "Save Changes"}
                    </button>
                  </div>
                </form>
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
