import React, { useState } from "react";
import NavbarFreelancer from "../../components/NavBarFreelancer";
import { useAuth } from "../../hooks/auth_context";
import { updateOffer, useFreelancerOffers } from "../../apis/freelancer_offer";
import empty from "../../assets/images/empty.jpg";
import { Link, useNavigate } from "react-router-dom";
import { categorizeOffers, categorizeOrders } from "../../util";
import { useQueryClient } from "@tanstack/react-query";
import { OrderPopup } from "./OrderPopup";
import { useOrdersFreelancer } from "../../apis/order";
import TimestampToDate from "../../components/common/TimestampToDate";

export const ManageOrder = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { currentUser } = useAuth();

  const closeModal = () => {
    setShowModal(false);
  };
  const openModal = () => {
    setShowModal(true);
  };
  const handleOrderSelected = (order) => {
    setSelectedOrder(order);
  };

  return (
    <div className="bg-slate-50 h-svh">
      <OrderPopup
        isVisible={showModal}
        order={selectedOrder}
        onClose={closeModal}
        currentUser={currentUser}
      />
      <NavbarFreelancer />

      <div className="max-w-[1240px] mx-auto my-10">
        <div className="flex justify-between">
          <div className="text-xl md:text-4xl  ">Manage Orders</div>
          <form>
            <div className="relative">
              <input
                type="search"
                id="search"
                className="block w-full p-3 ps-2 text-sm text-gray-900  border-b  rounded-lg bg-gray-50    dark:text-white "
                placeholder=" Search My history"
                required
              />
              <div className="absolute inset-y-0 end-2 flex items-center ps-3 pointer-events-none">
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
            </div>
          </form>
        </div>
        <div className="mt-10">
          <TabBar
            openModal={openModal}
            handleOrderSelected={handleOrderSelected}
            closeModal={closeModal}
            currentUser={currentUser}
          />
        </div>
      </div>
    </div>
  );
};

const TabBar = ({
  openModal,
  closeModal,
  handleOrderSelected,
  currentUser,
}) => {
  const [activeTab, setActiveTab] = useState("active");
  let ordersData = useOrdersFreelancer(
    currentUser.userId,
    currentUser.accessToken
  );

  const categorizedOrders = categorizeOrders(ordersData.data || []);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  const renderTabContent = () => {
    switch (activeTab) {
      case "active":
        return (
          <Tab
            user={currentUser}
            title={"active"}
            orders={categorizedOrders.inProgress || []}
            openModal={openModal}
            closeModal={closeModal}
            handleOrderSelected={handleOrderSelected}
          />
        );
      case "pending":
        return (
          <Tab
            title={"pending"}
            openModal={openModal}
            closeModal={closeModal}
            orders={categorizedOrders.pending || []}
            handleOrderSelected={handleOrderSelected}
          />
        );
      case "late":
        return (
          <Tab
            title={"late"}
            openModal={openModal}
            orders={categorizedOrders.late || []}
            handleOrderSelected={handleOrderSelected}
          />
        );
      case "delivered":
        return (
          <DeliveredTab
            title={"delivered"}
            openModal={openModal}
            orders={categorizedOrders.delivered || []}
            handleOrderSelected={handleOrderSelected}
          />
        );
      case "completed":
        return (
          <CompletedTab
            title={"completed"}
            openModal={openModal}
            orders={categorizedOrders.completed || []}
            handleOrderSelected={handleOrderSelected}
          />
        );
      case "cancelled":
        return (
          <CancelledTab
            title={"cancelled"}
            openModal={openModal}
            orders={categorizedOrders.cancelled || []}
            handleOrderSelected={handleOrderSelected}
          />
        );

      default:
        return null;
    }
  };
  if (ordersData.isLoading) <div>Loading ...</div>;
  return (
    <>
      <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
        <li className="me-2">
          <button
            onClick={() => handleTabClick("active")}
            className={`inline-block p-4 ${
              activeTab === "active"
                ? "text-primary bg-gray-100 rounded-t-lg active dark:bg-gray-800 dark:text-blue-500"
                : "rounded-t-lg hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300"
            }`}
          >
            Active
          </button>
        </li>
        <li className="me-2">
          <button
            onClick={() => handleTabClick("pending")}
            className={`inline-block p-4 rounded-t-lg ${
              activeTab === "pending"
                ? "text-primary bg-gray-100 active dark:bg-gray-800 dark:text-blue-500"
                : "hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300"
            }`}
          >
            Pending
          </button>
        </li>
        <li className="me-2">
          <button
            onClick={() => handleTabClick("late")}
            className={`inline-block p-4 rounded-t-lg ${
              activeTab === "late"
                ? "text-primary bg-gray-100 active dark:bg-gray-800 dark:text-blue-500"
                : "hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300"
            }`}
          >
            Late
          </button>
        </li>
        <li className="me-2">
          <button
            onClick={() => handleTabClick("delivered")}
            className={`inline-block p-4 rounded-t-lg ${
              activeTab === "delivered"
                ? "text-primary bg-gray-100 active dark:bg-gray-800 dark:text-blue-500"
                : "hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300"
            }`}
          >
            Delivered
          </button>
        </li>
        <li className="me-2">
          <button
            onClick={() => handleTabClick("completed")}
            className={`inline-block p-4 rounded-t-lg ${
              activeTab === "completed"
                ? "text-primary bg-gray-100 active dark:bg-gray-800 dark:text-blue-500"
                : "hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300"
            }`}
          >
            Completed
          </button>
        </li>
        <li className="me-2">
          <button
            onClick={() => handleTabClick("cancelled")}
            className={`inline-block p-4 rounded-t-lg ${
              activeTab === "cancelled"
                ? "text-primary bg-gray-100 active dark:bg-gray-800 dark:text-blue-500"
                : "hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300"
            }`}
          >
            Cancelled
          </button>
        </li>
      </ul>
      {renderTabContent()}
    </>
  );
};
const Tab = ({ user, title, orders, openModal, handleOrderSelected }) => {
  return (
    <div className=" bg-gray-50 text-medium border border-t-transparent text-gray-500 dark:text-gray-400 dark:bg-gray-800  w-full">
      <h3 className=" p-3 text-lg uppercase font-bold text-gray-900 dark:text-white mb-2">
        {title} orders
      </h3>
      <div>
        <div className="w-full h-[1px] bg-slate-200" />
        <div className=" flex flex-row text-black_04 text-sm font-semibold uppercase py-2 px-6  ">
          <div className="w-2/5">
            <div>Buyer</div>
          </div>
          <div className="w-3/5">
            <div>offer</div>
          </div>
          <div className="w-2/5 flex justify-between ">
            <div>due on</div>
            <div>total</div>
            <div>status</div>
          </div>
        </div>
        <div className="w-full h-[1px] bg-slate-200" />
        <div>
          {!orders || orders.length === 0 ? (
            <div className="p-6"> No Orders Found!</div>
          ) : (
            orders.map((order) => {
              return (
                <div
                  onClick={() => {
                    handleOrderSelected(order);
                    openModal();
                  }}
                  className="  mt-3 flex flex-row items-center text-black_04  cursor-pointer  py-2 px-6 "
                  key={order.orderId}
                >
                  <div className="w-2/5">
                    <div className="flex items-center gap-x-3">
                      <img
                        loading="lazy"
                        src={
                          order.clientPhotoUrl ? order.clientPhotoUrl : empty
                        } // Assuming you have the userPhotoURL variable defined
                        className="w-20 h-10 object-cover rounded-md"
                        alt=""
                      />
                      <div>{order.clientUserName}</div>{" "}
                      {/* Assuming title is a property of the username object */}
                    </div>
                  </div>
                  <div className="w-3/5">
                    <div className="flex items-center gap-x-3">
                      <img
                        loading="lazy"
                        src={order.offerImage ? order.offerImage : empty} // Assuming you have the offer photo variable defined
                        className="w-20 h-10 object-cover rounded-md"
                        alt=""
                      />
                      <div className="truncate max-w-72">
                        {order.offerTitle}
                      </div>{" "}
                      {/* Assuming title is a property of the offer object */}
                    </div>
                  </div>
                  <div className="w-2/5 flex justify-between items-center ">
                    {/* Assuming due on is a property of the order object */}
                    <div>
                      <TimestampToDate timestamp={order.createdDate} />
                    </div>{" "}
                    {/* Assuming total is a property of the order object */}
                    <div>{order.basePrice} TND</div>{" "}
                    {/* Assuming status is a property of the order object */}
                    <div
                      className={`font-semibold uppercase text-white py-2 px-3 rounded-md ${
                        order.status === "pending"
                          ? "bg-yellow-300"
                          : order.status === "inProgress"
                          ? "bg-green-300"
                          : order.status === "delivered"
                          ? "bg-green-600"
                          : order.status === "completed"
                          ? "bg-primary"
                          : order.status === "cancelled"
                          ? "bg-red-600"
                          : "bg-gray-500"
                      } `}
                    >
                      {order.status}
                    </div>{" "}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
const DeliveredTab = ({
  user,
  title,
  orders,
  openModal,
  handleOrderSelected,
}) => {
  return (
    <div className=" bg-gray-50 text-medium border border-t-transparent text-gray-500 dark:text-gray-400 dark:bg-gray-800  w-full">
      <h3 className=" p-3 text-lg uppercase font-bold text-gray-900 dark:text-white mb-2">
        {title} orders
      </h3>
      <div>
        <div className="w-full h-[1px] bg-slate-200" />
        <div className=" flex flex-row text-black_04 text-sm font-semibold uppercase py-2 px-6  ">
          <div className="w-2/5">
            <div>Buyer</div>
          </div>
          <div className="w-3/5">
            <div>offer</div>
          </div>
          <div className="w-2/5 flex justify-between ">
            <div>delivered on</div>
            <div>total</div>
            <div>status</div>
          </div>
        </div>
        <div className="w-full h-[1px] bg-slate-200" />
        <div>
          {!orders || orders.length === 0 ? (
            <div className="p-6"> No Orders Found!</div>
          ) : (
            orders.map((order) => {
              return (
                <div
                  onClick={() => {
                    handleOrderSelected(order);
                    openModal();
                  }}
                  className="  mt-3 flex flex-row items-center text-black_04  cursor-pointer  py-2 px-6 "
                  key={order.orderId}
                >
                  <div className="w-2/5">
                    <div className="flex items-center gap-x-3">
                      <img
                        loading="lazy"
                        src={
                          order.clientPhotoUrl ? order.clientPhotoUrl : empty
                        } // Assuming you have the userPhotoURL variable defined
                        className="w-20 h-10 object-cover rounded-md"
                        alt=""
                      />
                      <div>{order.clientUserName}</div>{" "}
                      {/* Assuming title is a property of the username object */}
                    </div>
                  </div>
                  <div className="w-3/5">
                    <div className="flex items-center gap-x-3">
                      <img
                        loading="lazy"
                        src={order.offerImage ? order.offerImage : empty} // Assuming you have the offer photo variable defined
                        className="w-20 h-10 object-cover rounded-md"
                        alt=""
                      />
                      <div className="truncate max-w-72">
                        {order.offerTitle}
                      </div>{" "}
                      {/* Assuming title is a property of the offer object */}
                    </div>
                  </div>
                  <div className="w-2/5 flex justify-between items-center ">
                    {/* Assuming due on is a property of the order object */}
                    <div>
                      <TimestampToDate timestamp={order.deliveredAt} />
                    </div>{" "}
                    {/* Assuming total is a property of the order object */}
                    <div>{order.basePrice} TND</div>{" "}
                    {/* Assuming status is a property of the order object */}
                    <div
                      className={`font-semibold uppercase text-white py-2 px-3 rounded-md ${
                        order.status === "pending"
                          ? "bg-yellow-300"
                          : order.status === "inProgress"
                          ? "bg-green-300"
                          : order.status === "delivered"
                          ? "bg-green-600"
                          : order.status === "completed"
                          ? "bg-primary"
                          : order.status === "cancelled"
                          ? "bg-red-600"
                          : "bg-gray-500"
                      } `}
                    >
                      {order.status}
                    </div>{" "}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
const CompletedTab = ({
  user,
  title,
  orders,
  openModal,
  handleOrderSelected,
}) => {
  return (
    <div className=" bg-gray-50 text-medium border border-t-transparent text-gray-500 dark:text-gray-400 dark:bg-gray-800  w-full">
      <h3 className=" p-3 text-lg uppercase font-bold text-gray-900 dark:text-white mb-2">
        {title} orders
      </h3>
      <div>
        <div className="w-full h-[1px] bg-slate-200" />
        <div className=" flex flex-row text-black_04 text-sm font-semibold uppercase py-2 px-6  ">
          <div className="w-2/5">
            <div>Buyer</div>
          </div>
          <div className="w-3/5">
            <div>offer</div>
          </div>
          <div className="w-2/5 flex justify-between ">
            <div>completed on</div>
            <div>total</div>
            <div>status</div>
          </div>
        </div>
        <div className="w-full h-[1px] bg-slate-200" />
        <div>
          {!orders || orders.length === 0 ? (
            <div className="p-6"> No Orders Found!</div>
          ) : (
            orders.map((order) => {
              return (
                <div
                  onClick={() => {
                    handleOrderSelected(order);
                    openModal();
                  }}
                  className="  mt-3 flex flex-row items-center text-black_04  cursor-pointer  py-2 px-6 "
                  key={order.orderId}
                >
                  <div className="w-2/5">
                    <div className="flex items-center gap-x-3">
                      <img
                        loading="lazy"
                        src={
                          order.clientPhotoUrl ? order.clientPhotoUrl : empty
                        } // Assuming you have the userPhotoURL variable defined
                        className="w-20 h-10 object-cover rounded-md"
                        alt=""
                      />
                      <div>{order.clientUserName}</div>{" "}
                      {/* Assuming title is a property of the username object */}
                    </div>
                  </div>
                  <div className="w-3/5">
                    <div className="flex items-center gap-x-3">
                      <img
                        loading="lazy"
                        src={order.offerImage ? order.offerImage : empty} // Assuming you have the offer photo variable defined
                        className="w-20 h-10 object-cover rounded-md"
                        alt=""
                      />
                      <div className="truncate max-w-72">
                        {order.offerTitle}
                      </div>{" "}
                      {/* Assuming title is a property of the offer object */}
                    </div>
                  </div>
                  <div className="w-2/5 flex justify-between items-center ">
                    {/* Assuming due on is a property of the order object */}
                    <div>
                      <TimestampToDate timestamp={order.completedAt} />
                    </div>{" "}
                    {/* Assuming total is a property of the order object */}
                    <div>{order.basePrice} TND</div>{" "}
                    {/* Assuming status is a property of the order object */}
                    <div
                      className={`font-semibold uppercase text-white py-2 px-3 rounded-md ${
                        order.status === "pending"
                          ? "bg-yellow-300"
                          : order.status === "inProgress"
                          ? "bg-green-300"
                          : order.status === "delivered"
                          ? "bg-green-600"
                          : order.status === "completed"
                          ? "bg-primary"
                          : order.status === "cancelled"
                          ? "bg-secondary"
                          : "bg-gray-500"
                      } `}
                    >
                      {order.status}
                    </div>{" "}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
const CancelledTab = ({
  user,
  title,
  orders,
  openModal,
  handleOrderSelected,
}) => {
  return (
    <div className=" bg-gray-50 text-medium border border-t-transparent text-gray-500 dark:text-gray-400 dark:bg-gray-800  w-full">
      <h3 className=" p-3 text-lg uppercase font-bold text-gray-900 dark:text-white mb-2">
        {title} orders
      </h3>
      <div>
        <div className="w-full h-[1px] bg-slate-200" />
        <div className=" flex flex-row text-black_04 text-sm font-semibold uppercase py-2 px-6  ">
          <div className="w-2/5">
            <div>Buyer</div>
          </div>
          <div className="w-3/5">
            <div>offer</div>
          </div>
          <div className="w-2/5 flex justify-between ">
            <div>Cancelled on</div>
            <div>total</div>
            <div>status</div>
          </div>
        </div>
        <div className="w-full h-[1px] bg-slate-200" />
        <div>
          {!orders || orders.length === 0 ? (
            <div className="p-6"> No Orders Found!</div>
          ) : (
            orders.map((order) => {
              return (
                <div
                  onClick={() => {
                    handleOrderSelected(order);
                    openModal();
                  }}
                  className="  mt-3 flex flex-row items-center text-black_04  cursor-pointer  py-2 px-6 "
                  key={order.orderId}
                >
                  <div className="w-2/5">
                    <div className="flex items-center gap-x-3">
                      <img
                        loading="lazy"
                        src={
                          order.clientPhotoUrl ? order.clientPhotoUrl : empty
                        } // Assuming you have the userPhotoURL variable defined
                        className="w-20 h-10 object-cover rounded-md"
                        alt=""
                      />
                      <div>{order.clientUserName}</div>{" "}
                      {/* Assuming title is a property of the username object */}
                    </div>
                  </div>
                  <div className="w-3/5">
                    <div className="flex items-center gap-x-3">
                      <img
                        loading="lazy"
                        src={order.offerImage ? order.offerImage : empty} // Assuming you have the offer photo variable defined
                        className="w-20 h-10 object-cover rounded-md"
                        alt=""
                      />
                      <div className="truncate max-w-72">
                        {order.offerTitle}
                      </div>{" "}
                      {/* Assuming title is a property of the offer object */}
                    </div>
                  </div>
                  <div className="w-2/5 flex justify-between items-center ">
                    {/* Assuming due on is a property of the order object */}
                    <div>
                      <TimestampToDate timestamp={order.cancelledAt} />
                    </div>{" "}
                    <div>{order.basePrice} TND</div>{" "}
                    {/* Assuming status is a property of the order object */}
                    <div
                      className={`font-semibold uppercase text-sm text-white py-2 px-3 rounded-md ${
                        order.status === "pending"
                          ? "bg-yellow-300"
                          : order.status === "inProgress"
                          ? "bg-green-300"
                          : order.status === "delivered"
                          ? "bg-green-600"
                          : order.status === "completed"
                          ? "bg-primary"
                          : order.status === "cancelled"
                          ? "bg-secondary"
                          : "bg-gray-500"
                      } `}
                    >
                      {order.status}
                    </div>{" "}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default TabBar;
