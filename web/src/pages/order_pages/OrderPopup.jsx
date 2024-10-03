import React, { useState, useRef, useEffect } from "react";
import empty from "../../assets/images/empty.jpg";
import TimestampToDate from "../../components/common/TimestampToDate";
import {
  addDelivery,
  calculOrderFreelancerFee,
  updateStatus,
  useOrderDeliveries,
} from "../../apis/order";
import { useAuth } from "../../hooks/auth_context";
import SizeConverter from "../../components/common/SizeConverter";
import { useQueryClient } from "@tanstack/react-query";
import { downloadFile } from "../../util";
import { RxQuestionMarkCircled } from "react-icons/rx";

export const OrderPopup = React.memo(
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
            {order.status === "inProgress" && (
              <ActiveOrderComponent
                order={order}
                onClose={onClose}
                currentUser={currentUser}
              />
            )}
            {order.status === "delivered" && (
              <DeliveredOrderComponent
                order={order}
                currentUser={currentUser}
              />
            )}
            {order.status === "late" && (
              <ActiveOrderComponent
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

const ActiveOrderComponent = ({ order, currentUser, onClose }) => {
  const [note, setNote] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const queryClient = useQueryClient();
  const deliveriesData = useOrderDeliveries(
    order.documentRef,
    currentUser.accessToken
  );
  const handleFile = (file) => {
    setFile(file);
  };
  const handleFileChange = (event, fileType) => {
    const file = event.target.files[0];

    // Handle dropped files based on file type
    handleFile(file);
  };

  const handleDeleteFile = () => {
    handleFile(null);
  };

  const handleFileDrop = (event, fileType) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];

    // Handle dropped files based on file type
    handleFile(file);
  };
  useEffect(() => {
    return () => {
      queryClient.invalidateQueries(["orderDeliveries", order.orderId]);
    };
  }, [queryClient, order.orderId]);

  const handleAddDelivery = async () => {
    try {
      setLoading(true);
      const orderData = {
        orderId: order.documentRef,
        note: note,
      };
      const result = await addDelivery(
        file,
        orderData,
        currentUser.accessToken
      );
      queryClient.invalidateQueries(["orderDeliveries", order.orderId]);

      setLoading(false);
      setFile(null);
      setNote("");
    } catch (e) {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    try {
      const orderData = {
        orderId: order.documentRef,
        status: "delivered",
      };
      setLoadingUpdate(true);

      await updateStatus(orderData, currentUser.accessToken);
      onClose();
      setLoadingUpdate(false);
    } catch (e) {
      setLoadingUpdate(false);
    }
  };
  return (
    <>
      <div className="flex justify-between items-center ">
        <img
          src={order.offerImage ? order.offerImage : empty}
          alt=""
          className="w-40 h-20 rounded-md border"
        />
        <button
          onClick={handleUpdateStatus}
          disabled={
            !deliveriesData.data ||
            loadingUpdate ||
            deliveriesData.data.length === 0
          }
          className={`font-semibold uppercase text-white py-2 px-3 rounded-md ${
            deliveriesData.data && deliveriesData.data.length !== 0
              ? "bg-green-600"
              : "bg-green-300"
          } `}
        >
          {loadingUpdate ? " Delivering..." : " Delivery Now"}
        </button>
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
      <div className="mt-10 flex gap-3 items-center">
        <div className=" font-semibold ">Add delivery</div>
      </div>
      <div>
        <div className="border rounded-md w-full p-3 ">
          <input
            type="text"
            placeholder="Add note for the delivery..."
            value={note}
            onChange={(e) => {
              setNote(e.target.value);
            }}
            className="border border-gray-300 rounded-md px-2 w-full py-1 outline-none"
          />
          <div className=" mt-4 flex justify-center items-center h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500">
            {file ? (
              <div className="flex flex-col  items-center gap-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm ">{file.name}</p>
                  </div>
                </div>
                <button
                  className="bg-red-500 text-white  px-2 py-1 rounded-md"
                  onClick={handleDeleteFile}
                >
                  Delete
                </button>
              </div>
            ) : (
              <label
                className="cursor-pointer"
                htmlFor="file"
                onDrop={(e) => handleFileDrop(e, "file")}
                onDragOver={(e) => e.preventDefault()}
              >
                <svg
                  className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  {/* Your file icon SVG */}
                </svg>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  Click to upload other files
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  PDF, DOCX, or other document formats
                </p>
                <input
                  id="file"
                  type="file"
                  accept=".pdf,.doc,.docx,image/*"
                  className="hidden"
                  size={5 * 1024 * 1024}
                  onChange={(e) => handleFileChange(e, "file")}
                />
              </label>
            )}
          </div>
        </div>

        <div className="flex justify-end mt-5">
          <button
            disabled={!note | !file | loading}
            onClick={handleAddDelivery}
            className="bg-primary px-4 py-2 mb-5 hover:bg-blue-400 rounded text-white text-sm"
          >
            {loading ? " Add..." : " Add"}
          </button>
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
      </div>
    </>
  );
};

const DeliveredOrderComponent = ({ order, currentUser }) => {
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

      {serviceFee && (
        <>
          <div className="mt-3 flex gap-3  items-center">
            <div className="font-semibold flex items-center  gap-1">Price</div>
            <p className="font-semibold ">{serviceFee.starterFromPrice} DT</p>
          </div>
          <div className="mt-3 flex gap-3  items-center">
            <div className="font-semibold flex items-center  gap-1">
              Service fee
              <div className="relative inline-block group">
                <RxQuestionMarkCircled size={19} />
                <div className="absolute hidden bg-gray-800 lowercase -top-[200%] left-1/2 w-60  -translate-x-1/2  text-white text-[9px] rounded px-2 py-1 whitespace-no-wrap group-hover:block">
                  This helps us operate our platform and offer 24/7 customer
                  support for your orders.{" "}
                </div>
              </div>
            </div>
            <p className="font-semibold ">{serviceFee.serviceFee} DT</p>
          </div>
          <div className="mt-3 flex gap-3  items-center">
            <div className="font-semibold flex items-center  gap-1">Total</div>
            <p className="font-semibold ">{serviceFee.total} DT</p>
          </div>
        </>
      )}
      <div className="mt-5 flex justify-between mx-auto items-center w-[50%]">
        <button
          onClick={() => handleUpdateStatus("cancelled")}
          className="text-lg rounded-md bg-secondary hover:bg-red-400 text-white px-3 py-2"
          disabled={loadingCancel} // Disable button when loading
        >
          {loadingCancel ? "Canceling..." : "Cancel"}{" "}
          {/* Display loading state */}
        </button>
        <button
          onClick={() => handleUpdateStatus("inProgress")}
          className="text-lg rounded-md bg-green-500 hover:bg-green-400 text-white px-3 py-2"
          disabled={loadingAccept} // Disable button when loading
        >
          {loadingAccept ? "Accepting..." : "Accept"}{" "}
          {/* Display loading state */}
        </button>
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
