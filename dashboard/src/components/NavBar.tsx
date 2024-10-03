import React, { useState } from "react";
import Avatar from "../assets/images/avatar.png";
import { CiSearch } from "react-icons/ci";
import { useAuth } from "../hooks/auth_context";
import { Link, useNavigate } from "react-router-dom";
import { signOutUser } from "../firebase_auth/firebase_auth";

export const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser } = useAuth();
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOutUser();
    navigate("/login");
  };

  return (
    <nav className="bg-white border-gray-200 sticky top-0  z-10  mb-10 shadow-md ">
      <div className="max-w-screen-2xl flex     items-center justify-between mx-auto p-4">
        <div className="flex items-center  md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          <button
            type="button"
            className="flex text-sm relative bg-gray-800 rounded-full md:me-0 - focus:ring-gray-300 "
            onClick={toggleDropdown}
            aria-expanded={isOpen}
            aria-controls="user-dropdown"
          >
            <span className="sr-only">Open user menu</span>
            <img
              className="w-12 h-12 rounded-full"
              src={currentUser.photoURL ? currentUser.photoURL : Avatar}
              alt="user"
            />
            <div
              className={`${
                isOpen ? "block" : "hidden"
              } z-50 absolute mt-2 top-[119%] w-72 right-5 bg-white divide-y divide-gray-100  shadow `}
              id="user-dropdown"
            >
              <div className="px-4 py-3">
                <span className="block text-sm text-black first-letter:uppercase">
                  {currentUser.fullName}
                </span>
                <span className="block text-sm  text-gray-500 truncate ">
                  {currentUser.email}
                </span>
              </div>
              <ul className="py-2" aria-labelledby="user-menu-button">
                <Link to={"/profile"}>
                  <li className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100  ">
                    My profile
                  </li>
                </Link>
                <Link to={"/profile"}>
                  <li className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100  ">
                    Account Settings
                  </li>
                </Link>

                <li
                  onClick={handleSignOut}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 "
                >
                  Log out
                </li>
              </ul>
            </div>
          </button>
        </div>
        <div className="  w-full flex gap-2 items-center  md:order-1">
          <CiSearch size={30} className="text-gray-600" />

          <input
            type="text"
            placeholder="Type to search"
            className="focus:outline-none w-3/4 "
          />
        </div>
      </div>
    </nav>
  );
};
