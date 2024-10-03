import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import { searchOffers, useServices } from "../apis/services";
import { extractRootServices } from "../util";
import { useAuth } from "../hooks/auth_context";
import NavbarAuth from "../components/NavBarAuth";

import useOnClickOutside from "./landing";
import SignUp from "../components/modals/SignUp";
import LogIn from "../components/modals/Login";
import NavbarUnAuth from "../components/NavbarUnAuth";
import LoadingPage from "../components/Loading";
import { useSearchParams } from "react-router-dom";
import { OfferItem } from "../components/common/OfferItem";

export const SearchPage = () => {
  const modelNavRef = React.useRef(null);
  const [nav, setNav] = useState(false);
  const { isLoading, error, data } = useServices();
  const { isLoggedIn } = useAuth();

  const [showModal, setShowModal] = useState(false);
  const [showTwoModal, setShowTwoModal] = useState(false);
  const modelRef = React.useRef(null);
  const modelTwoRef = React.useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const searchTerm = searchParams.get("term");
  const [searchResults, setSearchResults] = useState([]);
  let [loadingSearch, setLoadingSearch] = useState(false);
  useEffect(() => {
    const fetchOffers = async () => {
      if (searchTerm) {
        try {
          setLoadingSearch(true);
          const results = await searchOffers(searchTerm);
          setSearchResults(results);
          setLoadingSearch(false);
        } catch (error) {
          setLoadingSearch(false);

          console.error("Error fetching offers:", error);
          // Handle errors gracefully, e.g., display an error message to the user
        }
      } else {
        setSearchResults([]); // Clear results when search term is empty
      }
    };

    fetchOffers(); // Call fetchOffers initially and on search term changes
  }, [searchTerm]); // Dependency array: fetchOffers runs when searchTerm changes

  useOnClickOutside(modelRef, () => setShowModal(false), showModal);
  useOnClickOutside(modelTwoRef, () => setShowTwoModal(false), showTwoModal);
  useOnClickOutside(modelNavRef, () => setNav(false), nav);

  const closeModal = () => {
    setShowModal(false);
  };
  if (isLoading) return <LoadingPage />;
  if (error) return <div>An error occurred while fetching the user data </div>;
  const services = extractRootServices(data);
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
        <NavbarAuth services={services} />
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

      <div className="max-w-[1240px] mx-auto my-10 ">
        <div className="flex flex-col items-start justify-start w-full gap-6">
          <div className="flex flex-row justify-start ml-1 gap-2 ">
            <span className="text-gray-800_02  text-2xl ">Results for</span>
            <span className="text-gray-800_02 font-bold  text-2xl ">
              {searchTerm}
            </span>
          </div>
          {loadingSearch ? (
            <div className="w-full h-[50%] flex justify-center items-center">
              <div role="status">
                <svg
                  aria-hidden="true"
                  className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="w-full  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7 place-content-center">
              {searchResults && searchResults.length !== 0 ? (
                searchResults.map((offer) => {
                  return (
                    <OfferItem data={offer} key={offer.offer.documentRef} />
                  );
                })
              ) : (
                <div className="ml-5 my-20 text-gray-800_02  text-xl">
                  No results found for "{searchTerm}"
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer services={services} />
    </>
  );
};
