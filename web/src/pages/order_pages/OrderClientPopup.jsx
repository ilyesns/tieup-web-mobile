import React, { useState, useRef, useEffect } from "react";
import empty from "../../assets/images/empty.jpg";
import TimestampToDate from "../../components/common/TimestampToDate";
import {
  addDelivery,
  calculOrderFreelancerFee,
  updateStatus,
  updateStatusComplete,
  useOrderDeliveries,
} from "../../apis/order";
import { useAuth } from "../../hooks/auth_context";
import SizeConverter from "../../components/common/SizeConverter";
import { useQueryClient } from "@tanstack/react-query";
import { downloadFile } from "../../util";
import { RxQuestionMarkCircled } from "react-icons/rx";

export const OrderClientPopup = React.memo(
  ({ isVisible, onClose, order, currentUser }) => {
    if (!isVisible) return null;

    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center">
        <div className="flex flex-col">
          <button
            onClick={() => {
              onClose();
            }}
            className="place-self-end text-white text-xl"
          >
            X
          </button>
          <div className="w-full md:w-[700px] h-[600px] bg-white rounded-md  p-7 overflow-y-auto  ">
            {(order.status === "inProgress" || order.status === "late") && (
              <ActiveOrderComponent order={order} currentUser={currentUser} />
            )}
            {order.status === "delivered" && (
              <DeliveredOrderComponent
                order={order}
                onClose={onClose}
                currentUser={currentUser}
              />
            )}

            {order.status === "completed" && (
              <CompletedOrderComponent
                order={order}
                currentUser={currentUser}
              />
            )}
            {order.status === "pending" && (
              <PendingOrderComponent
                order={order}
                currentUser={currentUser}
                onClose={onClose}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
);

const ActiveOrderComponent = React.memo(({ order, currentUser }) => {
  const [loading, setLoading] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const queryClient = useQueryClient();
  const deliveriesData = useOrderDeliveries(
    order.documentRef,
    currentUser.accessToken
  );

  useEffect(() => {
    return () => {
      queryClient.invalidateQueries(["orderDeliveries", order.orderId]);
    };
  }, [queryClient, order.orderId]);

  return (
    <>
      <div className="flex justify-between items-center ">
        <img
          src={order.offerImage ? order.offerImage : empty}
          alt=""
          className="w-40 h-20 rounded-md border"
        />
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
      <div className="mt-10 flex justify-between items-center">
        <div className=" line-clamp-4 max-w-80 font-semibold">
          {order.offerTitle}
        </div>{" "}
      </div>
      <div className="flex justify-between items-center">
        <div className="mt-3 flex gap-3 items-center">
          <div className=" font-semibold ">Ordered By</div>
          <p className="text-primary font-bold">{order.clientUserName}</p>
        </div>
        <div className="mt-3 flex gap-3 items-center">
          <div className=" font-semibold text-gray-500 ">Date ordered</div>
          <TimestampToDate timestamp={order.createdDate} />
        </div>
      </div>
      <div className="mt-3 flex gap-3 items-center">
        <div className=" font-semibold ">Order Number</div>
        <p className="text-primary font-bold">{order.orderId}</p>
      </div>

      <div>
        {deliveriesData.isLoading ? (
          <div className="w-5 h-5  border rounded-full animate-spin border-primary border-b-transparent " />
        ) : deliveriesData.error ? (
          <div>Something went wrong please refresh the page!</div>
        ) : (
          deliveriesData.data &&
          deliveriesData.data.length !== 0 && (
            <DeliveryList deliveries={deliveriesData.data} />
          )
        )}
      </div>
    </>
  );
});

const DeliveredOrderComponent = ({ order, currentUser, onClose }) => {
  const deliveriesData = useOrderDeliveries(
    order.documentRef,
    currentUser.accessToken
  );
  const queryClient = useQueryClient();

  const [loading, setLoading] = useState(false);

  const handleUpdateStatus = async () => {
    try {
      setLoading(true);
      const orderData = {
        orderId: order.documentRef,
        status: "completed",
      };

      await updateStatusComplete(orderData, currentUser.accessToken);

      queryClient.invalidateQueries(["orderDeliveries", order.orderId]);
      queryClient.invalidateQueries(["orders", currentUser.userId]);

      setLoading(false);
      onClose();

      // Reset loading state after status update
    } catch (e) {
      setLoading(false);

      // Reset loading state in case of error
    }
  };
  return (
    <>
      <div className="flex justify-between items-center">
        <img
          src={order.offerImage ? order.offerImage : empty}
          alt=""
          className="w-40 h-20 rounded-md border"
        />
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
      <div className="mt-10 flex justify-between items-center">
        <div className=" line-clamp-4 max-w-80 font-semibold">
          {order.offerTitle}
        </div>{" "}
      </div>
      <div className="flex justify-between items-center">
        <div className="mt-3 flex gap-3 items-center">
          <div className=" font-semibold ">Ordered By</div>
          <p className="text-primary font-bold">{order.clientUserName}</p>
        </div>
        <div className="mt-3 flex gap-3 items-center">
          <div className=" font-semibold text-gray-500 ">Date ordered</div>
          <TimestampToDate timestamp={order.createdDate} />
        </div>
      </div>
      <div className="mt-3 flex gap-3 items-center">
        <div className=" font-semibold ">Order Number</div>
        <p className="text-primary font-bold">{order.orderId}</p>
      </div>
      <div className="mt-3 flex gap-3 items-center">
        <div className=" font-semibold ">Deliveries:</div>
      </div>
      {deliveriesData.isLoading ? (
        <div className="w-5 h-5  border rounded-full animate-spin border-primary border-b-transparent " />
      ) : deliveriesData.error ? (
        <div>Something went wrong please refresh the page!</div>
      ) : (
        deliveriesData.data &&
        deliveriesData.data.length !== 0 && (
          <DeliveryList deliveries={deliveriesData.data} />
        )
      )}
      <div className=" w-full mt-3 flex justify-end">
        <button
          onClick={handleUpdateStatus}
          className="py-2 px-3 rounded-md w-40 flex justify-center bg-primary hover:bg-blue-400 text-white"
        >
          {loading ? (
            <div className="w-5 h-5  border rounded-full animate-spin border-white border-b-transparent" />
          ) : (
            "Mark as Complete"
          )}
        </button>
      </div>
    </>
  );
};
const CompletedOrderComponent = ({ order, currentUser }) => {
  const deliveriesData = useOrderDeliveries(
    order.documentRef,
    currentUser.accessToken
  );

  return (
    <>
      <div className="flex justify-between items-center">
        <img
          src={order.offerImage ? order.offerImage : empty}
          alt=""
          className="w-40 h-20 rounded-md border"
        />
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
      <div className="mt-10 flex justify-between items-center">
        <div className=" line-clamp-4 max-w-80 font-semibold">
          {order.offerTitle}
        </div>{" "}
      </div>
      <div className="flex justify-between items-center">
        <div className="mt-3 flex gap-3 items-center">
          <div className=" font-semibold ">Ordered By</div>
          <p className="text-primary font-bold">{order.clientUserName}</p>
        </div>
        <div className="mt-3 flex gap-3 items-center">
          <div className=" font-semibold text-gray-500 ">Date ordered</div>
          <TimestampToDate timestamp={order.createdDate} />
        </div>
      </div>
      <div className="mt-3 flex gap-3 items-center">
        <div className=" font-semibold ">Order Number</div>
        <p className="text-primary font-bold">{order.orderId}</p>
      </div>
      <div className="mt-3 flex gap-3 items-center">
        <div className=" font-semibold ">Deliveries:</div>
      </div>
      {deliveriesData.isLoading ? (
        <div className="w-5 h-5  border rounded-full animate-spin border-primary border-b-transparent " />
      ) : deliveriesData.error ? (
        <div>Something went wrong please refresh the page!</div>
      ) : (
        deliveriesData.data &&
        deliveriesData.data.length !== 0 && (
          <DeliveryList deliveries={deliveriesData.data} />
        )
      )}
    </>
  );
};
const PendingOrderComponent = ({ order, currentUser, onClose }) => {
  const [serviceFee, setServiceFee] = useState(null);
  const [loadingCancel, setLoadingCancel] = useState(false); // Loading state for cancel button
  const [loadingAccept, setLoadingAccept] = useState(false); // Loading state for accept button
  const queryClient = useQueryClient();

  const handleUpdateStatus = async (status) => {
    try {
      if (status === "cancelled") {
        setLoadingCancel(true); // Set loading state for cancel button
      } else if (status === "inProgress") {
        setLoadingAccept(true); // Set loading state for accept button
      }

      const orderData = {
        orderId: order.documentRef,
        status: status,
        fee: serviceFee.serviceFee,
      };

      await updateStatus(orderData, currentUser.accessToken);
      onClose();

      // Reset loading state after status update
      if (status === "cancelled") {
        setLoadingCancel(false);
      } else if (status === "inProgress") {
        setLoadingAccept(false);
      }
    } catch (e) {
      // Reset loading state in case of error
      if (status === "cancelled") {
        setLoadingCancel(false);
      } else if (status === "inProgress") {
        setLoadingAccept(false);
      }
    }
  };

  useEffect(() => {
    return () => {
      queryClient.invalidateQueries(["orderDeliveries", order.orderId]);
    };
  }, [queryClient, order.orderId]);
  useEffect(() => {
    calculOrderFreelancerFee(order.basePrice, currentUser.accessToken).then(
      (fee) => {
        setServiceFee(fee);
      }
    );
  }, [currentUser.accessToken, order.basePrice]);
  return (
    <>
      <div className="flex justify-between items-center">
        <img
          src={order.offerImage ? order.offerImage : empty}
          alt=""
          className="w-40 h-20 rounded-md border"
        />
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
      <div className="mt-10 flex justify-between items-center">
        <div className=" line-clamp-4 max-w-80 font-semibold">
          {order.offerTitle}
        </div>{" "}
      </div>
      <div className="flex justify-between items-center">
        <div className="mt-3 flex gap-3 items-center">
          <div className=" font-semibold ">Ordered By</div>
          <p className="text-primary font-bold">{order.clientUserName}</p>
        </div>
        <div className="mt-3 flex gap-3 items-center">
          <div className=" font-semibold text-gray-500 ">Date ordered</div>
          <TimestampToDate timestamp={order.createdDate} />
        </div>
      </div>
      <div className="mt-3 flex gap-3 items-center">
        <div className=" font-semibold ">Order Number</div>
        <p className="text-primary font-bold">{order.orderId}</p>
      </div>

      <div className="mt-20 flex justify-center border px-3 py-2 mx-auto items-center w-[70%]">
        Your order is currently pending freelancer acceptance
      </div>
    </>
  );
};

const DeliveryList = ({ deliveries }) => {
  const [loadingMap, setLoadingMap] = useState({});

  const handleDownload = async (delivery) => {
    try {
      setLoadingMap((prevLoadingMap) => ({
        ...prevLoadingMap,
        [delivery.deliveryNumber]: true, // Set loading state for this specific delivery
      }));
      await downloadFile(delivery.file.url, delivery.file.name);
    } catch (error) {
      console.error("Error downloading file:", error);
    } finally {
      setLoadingMap((prevLoadingMap) => ({
        ...prevLoadingMap,
        [delivery.deliveryNumber]: false, // Reset loading state for this specific delivery
      }));
    }
  };

  return (
    <div className="border rounded-md max-h-60 overflow-auto p-4">
      {deliveries.map((delivery) => {
        return (
          <div key={delivery.deliveryNumber}>
            <div className="flex justify-between items-center">
              <p className="font-semibold">Delivery Number</p>
              <p className="font-semibold text-primary">
                #{delivery.deliveryNumber}
              </p>
            </div>
            <div className=" mt-3 flex justify-between items-center">
              <p className="font-semibold">Delivered on:</p>
              <TimestampToDate timestamp={delivery.deliveryDate} />
            </div>
            <div className=" mt-3 flex justify-between items-start gap-x-4">
              <p className="font-semibold">Note:</p>
              <p className="font-thin text-sm line-clamp-4">{delivery.note}</p>
            </div>
            <div
              onClick={() => handleDownload(delivery)}
              className=" mt-3 flex items-center flex-col gap-2  cursor-pointer h-20 justify-center border rounded-md"
            >
              <p className="font-semibold text-xs">{delivery.file.name}</p>
              <div className="font-semibold text-xs">
                <SizeConverter sizeInBytes={delivery.file.size} />
              </div>
              {loadingMap[delivery.deliveryNumber] && (
                <div className="w-5 h-5  border rounded-full animate-spin border-primary border-b-transparent" />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
