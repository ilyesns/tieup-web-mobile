import React, { useRef, useState } from "react";
import { SearchUserModal } from "../components/SearchUserModal";
import { CiSearch } from "react-icons/ci";
import Image from "../assets/images/offer.jpg";
import { addService, searchServices, useServices } from "../api/services";
import { Snipper } from "../components/common/Snipper";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { ServiceModal } from "../components/ServiceModal";
import Avatar from "../assets/images/avatar.png";
import { IoIosArrowForward } from "react-icons/io";
import { ProfileModal } from "../components/ProfileModal";
import { signOutUser } from "../firebase_auth/firebase_auth";
import { useAuth } from "../hooks/auth_context";
import { useNavigate } from "react-router-dom";

export const Profile = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const { currentUser } = useAuth();
  const openToast = () => {
    setShowToast(true);
  };
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };
  const navigate = useNavigate();
  const handleSignOut = async () => {
    await signOutUser();
    navigate("/login");
  };
  return (
    <>
      {isModalOpen && (
        <ProfileModal isModalOpen={isModalOpen} toggleModal={toggleModal} />
      )}
      <div className="w-full bg-white rounded-md p-4">
        <div className="flex flex-row justify-between items-center mb-5">
          <h1 className="text-3xl font-semibold first-letter:uppercase ">
            My Profile
          </h1>
        </div>
        <div className="w-full flex items-center gap-4">
          <img
            src={currentUser.photoURL ? currentUser.photoURL : Avatar}
            alt=""
            className="w-28 h-28 rounded-md border object-fill bg-primary border-primary p-1"
          />
          <div className="flex flex-col gap-3">
            <div className="first-letter:uppercase text-2xl font-bold text-gray-900 ">
              {currentUser.fullName}
            </div>
            <div className="first-letter:uppercase text-xl font-semibold text-gray-900 ">
              {currentUser.email}
            </div>
          </div>
        </div>
      </div>
      <div className="my-5 text-gray-600">Account Settings</div>
      <div className="mt-5 w-full bg-white rounded-md  text-gray-800 p-4">
        <div className="w-full cursor-pointer bg-white shadow-md rounded-md p-3 flex justify-between items-center">
          <p className="text-lg"> Change Password</p>
          <IoIosArrowForward />
        </div>
        <div
          onClick={toggleModal}
          className="w-full cursor-pointer mt-5 bg-white shadow-md rounded-md p-3 flex justify-between items-center"
        >
          <p className="text-lg"> Edit Profile</p>
          <IoIosArrowForward />
        </div>
      </div>
      <div className="w-full mt-10 flex justify-center items-center">
        <button
          onClick={handleSignOut}
          className="border p-3 bg-white rounded-md duration-150 transition-all hover:bg-primary hover:text-white w-28 text-gray-800"
        >
          Log out
        </button>
      </div>
    </>
  );
};

export type FormFields = {
  name?: string;
  description?: string;
  topic?: string;
  parentServiceId?: string;
  image: FileList | string;
};
