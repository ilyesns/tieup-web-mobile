import React, { useState } from "react";
import { searchUsers } from "../api/users";
import { Tab } from "../pages/Customers";
import { Snipper } from "./common/Snipper";

export const SearchUserModal = ({
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
      let res = await searchUsers("token", searchTerm);
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
            <div className="relative bg-white rounded-lg shadow ">
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
