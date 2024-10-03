import React, { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { searchUsers, useUsers } from "../api/users";
import Empty from "../assets/images/empty.jpg";
import { useQueryClient } from "@tanstack/react-query";
import DateTimeDisplay from "../components/common/DateTimeDisplay";
import { formatName } from "../util/functions";
import { Snipper } from "../components/common/Snipper";
import { SearchUserModal } from "../components/SearchUserModal";

export const Customers = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    document.body.style.overflow = isModalOpen ? "auto" : "hidden";
  };

  return (
    <>
      <SearchUserModal isModalOpen={isModalOpen} toggleModal={toggleModal} />
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-semibold first-letter:uppercase ">
          customers
        </h1>

        <div
          onClick={toggleModal}
          className=" cursor-pointer  flex gap-2 items-center  md:order-1"
        >
          <p className="text-gray-400 ">Searching by username..</p>
          <CiSearch size={30} className="text-gray-600 cursor-pointer" />
        </div>
      </div>

      <TabBar />
    </>
  );
};

const TabBar = () => {
  const [activeTab, setActiveTab] = useState("client");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0); // State to store total pages
  const pageSize = 10;
  const queryClient = useQueryClient(); // Get the query client instance

  const { data, isLoading, isError } = useUsers(
    "",
    currentPage,
    pageSize,
    activeTab
  );

  useEffect(() => {
    if (data && data.totalPages) {
      setTotalPages(data.totalPages);
      queryClient.invalidateQueries({ queryKey: ["users", currentPage] });
    }
  }, [currentPage, data, queryClient, activeTab]);

  function handleTabClick(tab: string): void {
    setActiveTab(tab);
    setCurrentPage(0);
  }

  function handlePageClick(page: number): void {
    setCurrentPage(page);
  }

  return (
    <>
      <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200  ">
        <li className="me-2">
          <button
            onClick={() => handleTabClick("client")}
            className={`inline-block p-4 ${
              activeTab === "client"
                ? "text-primary bg-white rounded-t-lg active  "
                : "rounded-t-lg hover:text-gray-600 hover:bg-gray-50 "
            }`}
          >
            Clients
          </button>
        </li>
        <li className="me-2">
          <button
            onClick={() => handleTabClick("freelancer")}
            className={`inline-block p-4 rounded-t-lg ${
              activeTab === "freelancer"
                ? "text-primary  bg-white active "
                : "hover:text-gray-600 hover:bg-gray-50 "
            }`}
          >
            Freelancers
          </button>
        </li>
      </ul>
      {isLoading ? (
        <div className="mt-28 w-full flex items-center justify-center">
          <Snipper />
        </div>
      ) : isError ? (
        <div>Something went wrong..</div>
      ) : (
        data.lenght !== 0 && (
          <div className="flex flex-col justify-between">
            {<Tab data={data.usersToApi} />}

            <div className="w-full flex justify-center items-center my-5">
              <nav aria-label="Page navigation">
                <ul className="flex items-center -space-x-px h-10 text-base">
                  <li>
                    <button
                      className="flex items-center justify-center px-4 h-10 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 "
                      onClick={() => handlePageClick(currentPage - 1)}
                      disabled={currentPage === 0}
                    >
                      <span className="sr-only">Previous</span>
                      <svg
                        className="w-3 h-3 rtl:rotate-180"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 6 10"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 1 1 5l4 4"
                        />
                      </svg>
                    </button>
                  </li>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <li key={i}>
                      <button
                        className={`flex items-center justify-center px-4 h-10 leading-tight ${
                          currentPage === i
                            ? "text-blue-600 bg-blue-50 border border-blue-300"
                            : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
                        } `}
                        onClick={() => handlePageClick(i)}
                      >
                        {i + 1}
                      </button>
                    </li>
                  ))}
                  <li>
                    <button
                      className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 "
                      onClick={() => handlePageClick(currentPage + 1)}
                      disabled={currentPage === totalPages - 1}
                    >
                      <span className="sr-only">Next</span>
                      <svg
                        className="w-3 h-3 rtl:rotate-180"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 6 10"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="m1 9 4-4-4-4"
                        />
                      </svg>
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        )
      )}
    </>
  );
};

export const Tab = ({ data }: { data: any }) => {
  return (
    <div className=" bg-white text-medium border border-t-transparent text-gray-500 max-h-[600px] overflow-auto dark:text-gray-400   w-full">
      <div>
        <div className=" flex flex-row text-black_04 text-sm font-semibold uppercase py-2 px-6 ">
          <div className="w-2/5">
            <div>full name</div>
          </div>
          <div className="w-3/5 flex justify-between mr-14">
            <div className="w-1/2 flex justify-between">
              <div>email</div>
              <div>username</div>
            </div>
            <div>phone number</div>
            <div>tax id</div>
            <div>Joined since</div>
          </div>
        </div>
        <div className="w-full h-[1px] bg-slate-200" />

        {data.map((user: any) => {
          return (
            <div
              key={user.userId}
              className=" w-full mt-3 flex flex-row justify-between items-center text-black_04   py-2 px-6 "
            >
              <div className="w-2/5">
                <div className="flex items-center gap-x-3">
                  <img
                    src={user.photoURL ? user.photoURL : Empty} // Assuming you have the offerImage variable defined
                    className="w-20 object-cover aspect-auto rounded-md"
                    alt=""
                  />
                  <div className="first-letter:uppercase">
                    {formatName(user.firstName, user.lastName)}
                  </div>{" "}
                  {/* Assuming title is a property of the offer object */}
                </div>
              </div>
              <div className="w-3/5 flex justify-between mr-14">
                <div className="w-1/2 flex justify-between">
                  <div className="">{user.email}</div>
                  <div>{user.username ? user.username : "_"}</div>
                </div>
                <div>{user.phoneNumber ? user.phoneNumber : "_"}</div>
                <div>{user.mat ? user.mat : "_"}</div>
                <div className="text-sm ">
                  <DateTimeDisplay timestamp={user.joinDate} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
