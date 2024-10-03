import React, { useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { MdDashboard } from "react-icons/md";
import { ImUsers } from "react-icons/im";
import { BiSolidCategory } from "react-icons/bi";
import Logo from "../assets/images/Logo.png";
import { IoBagCheckOutline } from "react-icons/io5";
import { IoPricetagSharp } from "react-icons/io5";
import { BiMoneyWithdraw } from "react-icons/bi";
import { VscReport } from "react-icons/vsc";
import { CgProfile } from "react-icons/cg";
import { Link, useLocation } from "react-router-dom";

export const SideBar = () => {
  const [open, setOpen] = useState(true);
  const location = useLocation(); // Get the current path

  const isActive = (path: string) => {
    return location.pathname === path; // Check if the current path matches the link's path
  };

  return (
    <div
      className={`
    ${
      open ? "w-80" : "w-20"
    } sticky top-0  z-10  h-screen overflow-y-scroll duration-300 bg-primary  pt-8`}
    >
      <div className="flex h-full flex-col justify-between">
        <div>
          <main>
            <div className="flex justify-center">
              <div className="mt-10 bg-white p-3 w-fit rounded-lg">
                <img
                  src={Logo}
                  alt=""
                  className={`${open ? "w-24" : "w-10"}`}
                />
              </div>
            </div>
            <div className="flex flex-col px-3 mt-10">
              <Link to={"/"}>
                <div
                  className={` mt-5 px-3 py-2  hover:bg-gray-100 duration-150 rounded-md cursor-pointer hover:text-gray-900  flex gap-2  items-center 
                  ${
                    isActive("/")
                      ? " text-gray-900 bg-gray-100   "
                      : " text-white "
                  }                  `}
                >
                  <MdDashboard size={30} />

                  {open && (
                    <div className="font-semibold  uppercase">Dashboard</div>
                  )}
                </div>
              </Link>
              <Link to={"/customers"}>
                <div
                  className={` mt-5 px-3 py-2  hover:bg-gray-100 duration-150 rounded-md cursor-pointer hover:text-gray-900  flex gap-2  items-center 
                ${
                  isActive("/customers")
                    ? " text-gray-900 bg-gray-100   "
                    : " text-white "
                }                  `}
                >
                  <ImUsers size={30} />

                  {open && (
                    <div className="font-semibold  uppercase">customers</div>
                  )}
                </div>
              </Link>
              <Link to={"/services"}>
                <div
                  className={` mt-5 px-3 py-2  hover:bg-gray-100 duration-150 rounded-md cursor-pointer hover:text-gray-900  flex gap-2  items-center 
                      ${
                        isActive("/services")
                          ? " text-gray-900 bg-gray-100   "
                          : " text-white "
                      }                  `}
                >
                  <BiSolidCategory size={30} />

                  {open && (
                    <div className="font-semibold  uppercase">services</div>
                  )}
                </div>
              </Link>
              <Link to={"/orders"}>
                <div
                  className={` mt-5 px-3 py-2  hover:bg-gray-100 duration-150 rounded-md cursor-pointer hover:text-gray-900  flex gap-2  items-center 
                ${
                  isActive("/orders")
                    ? " text-gray-900 bg-gray-100   "
                    : " text-white "
                }                  `}
                >
                  <IoBagCheckOutline size={30} />

                  {open && (
                    <div className="font-semibold  uppercase">orders</div>
                  )}
                </div>
              </Link>
              <Link to={"/offers"}>
                <div
                  className={` mt-5 px-3 py-2  hover:bg-gray-100 duration-150 rounded-md cursor-pointer hover:text-gray-900  flex gap-2  items-center 
                ${
                  isActive("/offers")
                    ? " text-gray-900 bg-gray-100   "
                    : " text-white "
                }                  `}
                >
                  <IoPricetagSharp size={30} />

                  {open && (
                    <div className="font-semibold  uppercase">offers</div>
                  )}
                </div>
              </Link>
              <Link to={"/withdraw"}>
                <div
                  className={` mt-5 px-3 py-2  hover:bg-gray-100 duration-150 rounded-md cursor-pointer hover:text-gray-900  flex gap-2  items-center 
                ${
                  isActive("/withdraw")
                    ? " text-gray-900 bg-gray-100   "
                    : " text-white "
                }                  `}
                >
                  <BiMoneyWithdraw size={30} />

                  {open && (
                    <div className="font-semibold  uppercase">
                      withdraw on demand
                    </div>
                  )}
                </div>
              </Link>

              <div
                className={` mt-5 px-3 py-2  hover:bg-gray-100 duration-150 rounded-md cursor-pointer hover:text-gray-900  flex gap-2  items-center 
              ${
                isActive("/report")
                  ? " text-gray-900 bg-gray-100   "
                  : " text-white "
              }                  `}
              >
                <VscReport size={30} />

                {open && <div className="font-semibold  uppercase">report</div>}
              </div>

              <Link to={"/profile"}>
                <div
                  className={` mt-5 px-3 py-2  hover:bg-gray-100 duration-150 rounded-md cursor-pointer hover:text-gray-900  flex gap-2  items-center 
                ${
                  isActive("/profile")
                    ? " text-gray-900 bg-gray-100   "
                    : " text-white "
                }                  `}
                >
                  <CgProfile size={30} />

                  {open && (
                    <div className="font-semibold  uppercase">profile</div>
                  )}
                </div>
              </Link>
            </div>
          </main>
        </div>
        <div
          onClick={() => {
            setOpen(!open);
          }}
          className="flex justify-end mb-5 mr-5"
        >
          {open ? (
            <IoIosArrowBack
              size={33}
              className="text-white text-xl cursor-pointer hover:bg-white hover:text-primary rounded-full p-2"
            />
          ) : (
            <IoIosArrowForward
              size={33}
              className="text-white text-xl cursor-pointer hover:bg-white hover:text-primary rounded-full p-2"
            />
          )}
        </div>
      </div>
    </div>
  );
};

const SearchBar = () => {
  const [isOpen, setIsOpen] = useState(false); // State to manage dropdown visibility

  // Function to toggle dropdown visibility
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Function to handle category selection
  const handleCategorySelection = (category: string) => {
    // You can perform actions based on the selected category
    console.log("Selected category:", category);
    // For example, you can close the dropdown after selection
    setIsOpen(false);
  };

  // Function to handle form submission
  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    // Implement search functionality here
    console.log("Search submitted");
  };

  return (
    <form className="max-w-lg " onSubmit={handleSubmit}>
      <div className="flex relative">
        <label
          htmlFor="search-dropdown"
          className="mb-2 text-sm font-medium  text-gray-900 sr-only dark:text-white"
        >
          Your Email
        </label>
        <button
          id="dropdown-button"
          onClick={toggleDropdown} // Toggle dropdown on button click
          className="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-s-lg  "
          type="button"
        >
          <svg
            className={`w-2.5 h-2.5 ms-2.5 transform ${isOpen && "rotate-180"}`} // Rotate arrow icon when dropdown is open
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 10 6"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 1 4 4 4-4"
            />
          </svg>
        </button>
        <div
          id="dropdown"
          className={`${
            isOpen ? "block" : "hidden"
          } z-10 absolute top-full mt-1 bg-white divide-y  rounded-lg shadow w-44 d`}
        >
          <ul
            className="py-2 text-sm text-black dark:text-gray-200"
            aria-labelledby="dropdown-button"
          >
            <li>
              <button
                type="button"
                onClick={() => handleCategorySelection("customers")} // Handle category selection
                className="inline-flex w-full px-4 py-2 hover:bg-gray-100 text-black"
              >
                Customers
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => handleCategorySelection("services")} // Handle category selection
                className="inline-flex w-full px-4 py-2 hover:bg-gray-100 text-black"
              >
                Services
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => handleCategorySelection("orders")} // Handle category selection
                className="inline-flex w-full px-4 py-2 hover:bg-gray-100 text-black"
              >
                Orders
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => handleCategorySelection("offers")} // Handle category selection
                className="inline-flex w-full px-4 py-2 hover:bg-gray-100 text-black"
              >
                Offers
              </button>
            </li>
          </ul>
        </div>
        <div className="relative w-full">
          <input
            type="search"
            id="search-dropdown"
            className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 focus:bg-none focus:outline-none rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300 "
            placeholder="Search Mockups, Logos, Design Templates..."
            required
          />
          <button
            type="submit"
            className="absolute top-0 end-0 p-2.5 text-sm font-medium h-full text-white bg-primary rounded-e-lg border"
          >
            <svg
              className="w-4 h-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
            <span className="sr-only">Search</span>
          </button>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;
