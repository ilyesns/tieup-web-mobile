import React, { useState, useEffect, useCallback, memo } from "react";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { Button } from "./common/Button";

import { MdLanguage } from "react-icons/md";

import CategoryBar from "./Category_bar";
import { useNavigate } from "react-router-dom";

const Navbar = ({
  setIsPopoverOpen,
  isPopoverOpen,
  showTwoModal,
  setShowTwoModal,
  modelNavRef,
  setNav,
  nav,
  services,
}) => {
  const [scrolling, setScrolling] = useState(false);
  const [currentScrollPos, setcurrentScrollPos] = useState(null);
  const navigate = useNavigate();
  const handleScroll = useCallback(() => {
    const currentScrollPos = window.pageYOffset;
    const visible = currentScrollPos > 300;
    setScrolling(visible);
    setcurrentScrollPos(currentScrollPos);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const handleNav = () => {
    setNav(!nav);
  };
  let [termSearch, setTermSearch] = useState("");
  const handleSearchSubmit = (event) => {
    event.preventDefault();

    // Navigate to search page with query parameter

    if (termSearch) navigate(`/search?term=${termSearch}`);
  };

  return (
    <div
      ref={modelNavRef}
      className={
        scrolling
          ? "sticky top-0 bg-white z-10 ease-in-out duration-500  "
          : "fixed   w-full text-black z-10 ease-in-out duration-500"
      }
    >
      <div
        className={`flex justify-between items-center h-24 max-w-[1240px] mx-auto px-4 ${
          scrolling ? "text-black" : "text-white"
        } z-50`}
      >
        <div className="flex-grow flex items-center">
          <h1 className=" text-3xl font-bold text-primary mr-6">TIE-UP.</h1>
          {scrolling ? (
            <div className="flex-grow mr-6  ease-in-out duration-500 opacity-100">
              <form>
                <label
                  htmlFor="search"
                  className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
                >
                  What service are you looking for today ?
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-500 dark:text-gray-400"
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
                  </div>
                  <input
                    type="search"
                    id="search"
                    value={termSearch}
                    onChange={(e) => {
                      setTermSearch(e.target.value);
                    }}
                    className="block w-full p-3 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50   dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white "
                    placeholder=" What service are you looking for today ?"
                    required
                  />
                  <button
                    onClick={handleSearchSubmit}
                    type="submit"
                    className="text-white absolute end-2.5 bottom-2.5 bg-primary hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-1 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Search
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="  mr-6  ease-in-out duration-500 opacity-0" />
          )}
        </div>

        <div className="hidden md:flex  items-center">
          <div className="flex items-center p-4  ">
            <MdLanguage size={20} />
            <p className="pl-2 font-bold">English</p>
          </div>
          <p className="p-4 font-bold">Become a Seller</p>
          <p
            onClick={() => setIsPopoverOpen(!isPopoverOpen)}
            className="p-4 font-bold cursor-pointer"
          >
            Sign in
          </p>
          <button
            onClick={() => setShowTwoModal(!showTwoModal)}
            className={`bg-transparent w-[80px] h-9 ml-2 hover:bg-primary hover:text-white border rounded-md  ${
              scrolling ? "text-black" : "text-white"
            }`}
          >
            Join
          </button>
        </div>
        {/** Mobile Menu */}
        <div onClick={handleNav} className="block md:hidden">
          {nav ? (
            <AiOutlineClose size={20} className="text-black" />
          ) : (
            <AiOutlineMenu size={20} className="text-black" />
          )}
        </div>
        <div
          className={
            nav
              ? "fixed left-0 z-40 top-0 w-[60%] h-full border-r border-r-gray-900 bg-[#000300] ease-in-out duration-500"
              : "ease-in-out z-40 duration-500 fixed left-[-100%]"
          }
        >
          <h1 className=" w-full text-3xl font-bold text-primary m-4">
            TIE-UP.
          </h1>
          <div className="flex items-center border-b m-2  p-4  ">
            <MdLanguage size={20} className="text-white" />
            <p className="pl-2   font-bold text-white">English</p>
          </div>
          <p className="p-4 font-bold  border-b text-white m-2">
            Become a Seller
          </p>
          <p
            onClick={() => {
              navigate("/login");
            }}
            className="p-4 font-bold  cursor-pointer  border-b text-white m-2"
          >
            Sign in
          </p>
          <p
            onClick={() => {
              navigate("/signup");
            }}
            className="p-4 font-bold cursor-pointer  border-b text-white m-2"
          >
            Join{" "}
          </p>
        </div>
      </div>
      <div className=" border-b border-t   md:block hidden">
        {scrolling ? (
          <div className="ease-in-out duration-500 scale-y-100">
            <CategoryBar services={services} />
          </div>
        ) : (
          <div className=" duration-500 scale-y-0" />
        )}
      </div>
    </div>
  );
};

export default memo(Navbar);
