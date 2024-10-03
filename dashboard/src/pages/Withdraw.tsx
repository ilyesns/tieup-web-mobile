import React, { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { searchUsers, useUsers } from "../api/users";
import Empty from "../assets/images/empty.jpg";
import { useQueryClient } from "@tanstack/react-query";
import DateTimeDisplay from "../components/common/DateTimeDisplay";
import { formatName } from "../util/functions";
import { Snipper } from "../components/common/Snipper";
import { SearchUserModal } from "../components/SearchUserModal";
import { useOrders } from "../api/orders";
import { SearchOrderModal } from "../components/SearchOrderModal";
import { useOffers } from "../api/offers";
import { OfferModal } from "../components/OfferModal";
import { useWithdrawal } from "../api/withdrawal";
import { WithdrawalModal } from "../components/WithdrawalModal";

export const Withdraw = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    document.body.style.overflow = isModalOpen ? "auto" : "hidden";
  };
  const handleSelectedWithdrawal = (withdrawal: any) => {
    setSelectedWithdrawal(withdrawal);
    toggleModal();
  };

  return (
    <>
      {isModalOpen && (
        <WithdrawalModal
          isModalOpen={isModalOpen}
          withdrawal={selectedWithdrawal}
          toggleModal={toggleModal}
        />
      )}
      {/* <SearchOrderModal isModalOpen={isModalOpen} toggleModal={toggleModal} /> */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-semibold first-letter:uppercase ">
          Withdrawals On Demand
        </h1>

        <div className=" cursor-pointer  flex gap-2 items-center  md:order-1">
          <p className="text-gray-400 ">Searching by accnbr, contact info...</p>
          <CiSearch size={30} className="text-gray-600 cursor-pointer" />
        </div>
      </div>

      <TabBar handleSelectedWithdrawal={handleSelectedWithdrawal} />
    </>
  );
};

const TabBar = ({
  handleSelectedWithdrawal,
}: {
  handleSelectedWithdrawal: (offer: any) => void;
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0); // State to store total pages
  const pageSize = 10;
  const queryClient = useQueryClient(); // Get the query client instance

  const { data, isLoading, isError } = useWithdrawal(
    "token",
    currentPage,
    pageSize
  );

  useEffect(() => {
    if (data && data.totalPages) {
      setTotalPages(data.totalPages);
      queryClient.invalidateQueries({ queryKey: ["offers", currentPage] });
    }
  }, [currentPage, data, queryClient]);

  function handleTabClick(tab: string): void {
    setCurrentPage(0);
  }

  function handlePageClick(page: number): void {
    setCurrentPage(page);
  }

  return (
    <>
      {isLoading ? (
        <div className="mt-28 w-full flex items-center justify-center">
          <Snipper />
        </div>
      ) : isError ? (
        <div>Something went wrong..</div>
      ) : (
        data.lenght !== 0 && (
          <div className="flex flex-col justify-between">
            {
              <Tab
                data={data.withdrawalsWithApi}
                handleSelectedWithdrawal={handleSelectedWithdrawal}
              />
            }

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

export const Tab = ({
  data,
  handleSelectedWithdrawal,
}: {
  data: any;
  handleSelectedWithdrawal: (withdrawal: any) => void;
}) => {
  return (
    <div className=" bg-white text-medium border border-t-transparent text-gray-500 dark:text-gray-400   w-full">
      <div>
        <div className=" flex flex-row justify-between text-black_04 text-sm font-semibold uppercase py-2 px-6 ">
          <div className="">full name</div>
          <div className="">account number</div>
          <div>amount</div>
          <div>contact info</div>
          <div>status</div>
          <div>submitted at</div>
        </div>
        <div className="w-full h-[1px] bg-slate-200" />

        {data.map((withdrawal: any, index: number) => {
          return (
            <div
              onClick={
                withdrawal.status == "Checked"
                  ? undefined
                  : () => {
                      handleSelectedWithdrawal(withdrawal);
                    }
              }
              key={index}
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
                className={`uppercase p-2 rounded-lg w-28 text-center text-white ${
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
          );
        })}
      </div>
    </div>
  );
};
