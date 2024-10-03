import React, { useState } from "react";
import { searchUsers } from "../api/users";
import { Snipper } from "./common/Snipper";
import { searchOffers } from "../api/offers";
import DateTimeDisplay from "./common/DateTimeDisplay";
import Empty from "../assets/images/empty.jpg";

export const SearchOfferModal = ({
  toggleModal,
  isModalOpen,
}: {
  isModalOpen: boolean;
  toggleModal: () => void;
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const handleSearch = async () => {
    if (searchTerm !== "") {
      setIsSearching(true);
      setIsLoading(true);
      let res = await searchOffers("token", searchTerm);
      setIsLoading(false);

      setUsers(res);
    }
  };

  const handleSearchEnter = (e: { key: string }) => {
    if (e.key === "Enter") {
      // Call your search function here
      handleSearch();
    }
  };
  return (
    <>
      {isModalOpen && (
        <div
          id="default-modal"
          tabIndex={-1}
          aria-hidden="true"
          className="fixed top-0 right-0 left-0 z-50 flex items-center justify-center w-full h-full overflow-y-auto overflow-x-hidden bg-gray-800 bg-opacity-50"
        >
          <div className="relative p-4 w-full max-w-[1240px]">
            <div className="relative bg-white rounded-lg shadow max-h-[1000px] ">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t ">
                <input
                  type="text"
                  name="search"
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                  }}
                  onKeyDown={handleSearchEnter}
                  placeholder="Type to search"
                  className="focus:outline-none p-2 w-full cursor-pointer bg-transparent "
                />
                <button
                  onClick={() => {
                    toggleModal();
                    setIsSearching(false);
                    setUsers([]);
                  }}
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              <div className="p-4 md:p-5 space-y-4">
                {isLoading && (
                  <div className="mt-5 w-full flex items-center justify-center">
                    <Snipper />
                  </div>
                )}
                {!isSearching && users.length === 0 && (
                  <div className="w-full text-center">Type for searching</div>
                )}
                {isSearching && users.length !== 0 && <Tab data={users} />}
                {isSearching && users.length === 0 && (
                  <div className=" mt-5 w-full text-center">
                    No results found.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const Tab = ({ data }: { data: any }) => {
  return (
    <div className=" bg-white text-medium border border-t-transparent text-gray-500 max-h-[600px] overflow-auto dark:text-gray-400   w-full">
      <div>
        <div className="w-full h-[1px] bg-slate-200" />

        {data.map((offer: any) => {
          return (
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
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
