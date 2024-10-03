import React from "react";
import { TbBrandCashapp } from "react-icons/tb";
import { RiPassPendingLine } from "react-icons/ri";
import { BiMoneyWithdraw } from "react-icons/bi";
import { HiOutlineUsers } from "react-icons/hi2";
import { TotalRevenueChart } from "../components/Chart";
import { useUsersNumber, useWallet } from "../api/users";
import { useAuth } from "../hooks/auth_context";
export const Dashboard = () => {
  const { currentUser, isLoggedIn } = useAuth();

  const { isLoading, data, isError } = useWallet(currentUser.userId!);
  const userNumber = useUsersNumber();

  return (
    <>
      {isLoading ? (
        <div> </div>
      ) : isError ? (
        <div>Error fetching data!</div>
      ) : (
        data && (
          <div>
            <div className="flex justify-between  gap-4 items-center">
              <div className="w-1/4 p-5 bg-white shadow-sm">
                <div className="flex justify-center items-center rounded-full   bg-gray-50  w-12 h-12">
                  <TbBrandCashapp className="text-primary" size={30} />
                </div>
                <div className="mt-3">
                  <h1 className="font-bold text-2xl ">{data.balance} TND</h1>
                  <div className="w-full flex justify-between items-center">
                    <p className="text-gray-400 text-sm mt-1">Total revenue</p>
                    <p className="text-green-500 text-sm mt-1">0.43%</p>
                  </div>
                </div>
              </div>
              <div className="w-1/4 p-5 bg-white shadow-sm">
                <div className="flex justify-center items-center rounded-full   bg-gray-50  w-12 h-12">
                  <RiPassPendingLine className="text-primary" size={30} />
                </div>
                <div className="mt-3">
                  <h1 className="font-bold text-2xl ">
                    {data.totalPendingClearance} TND
                  </h1>
                  <div className="w-full flex justify-between items-center">
                    <p className="text-gray-400 text-sm mt-1">
                      Total pending clearance
                    </p>
                    <p className="text-green-500 text-sm mt-1">1.43%</p>
                  </div>
                </div>
              </div>
              <div className="w-1/4 p-5 bg-white shadow-sm">
                <div className="flex justify-center items-center rounded-full   bg-gray-50  w-12 h-12">
                  <BiMoneyWithdraw className="text-primary" size={30} />
                </div>
                <div className="mt-3">
                  <h1 className="font-bold text-2xl ">0 TND</h1>
                  <div className="w-full flex justify-between items-center">
                    <p className="text-gray-400 text-sm mt-1">
                      Total withrawals by freelancers
                    </p>
                    <p className="text-green-500 text-sm mt-1">0%</p>
                  </div>
                </div>
              </div>
              <div className="w-1/4 p-5 bg-white shadow-sm">
                <div className="flex justify-center items-center rounded-full   bg-gray-50  w-12 h-12">
                  <HiOutlineUsers className="text-primary" size={30} />
                </div>
                <div className="mt-3">
                  <h1 className="font-bold text-2xl ">
                    {userNumber.data ? userNumber.data.num : "0"}
                  </h1>
                  <div className="w-full flex justify-between items-center">
                    <p className="text-gray-400 text-sm mt-1">Total users</p>
                    <p className="text-green-500 text-sm mt-1">0%</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-10  p-5 bg-white shadow-sm w-full max-h-[500px]">
              <TotalRevenueChart />
            </div>
          </div>
        )
      )}
    </>
  );
};
