import React, { useState } from "react";
import { FaRegCircleCheck } from "react-icons/fa6";
import { MdRestartAlt } from "react-icons/md";
import { RxQuestionMarkCircled } from "react-icons/rx";
import { placeOrder } from "../apis/order";
import { Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";

export const OrderOverlay = ({
  onClose,
  isOpen,
  offer,
  selectedPlan,
  total,
  currentUser,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [snackBar, setSnackBar] = useState(false);
  const [result, setResult] = useState(null);

  const openToast = () => {
    setSnackBar(true);
  };
  const handleClosePopup = () => {
    setSnackBar(false); // Close the pop-up
  };
  const handlePlaceOrder = async () => {
    try {
      const orderData = {
        offerId: offer.offerId,
        freelancerId: offer.freelancerId,
        clientId: currentUser.userId,
        total: total.total,
        base: selectedPlan.price,
        serviceFee: total.serviceFee,
        expiration: selectedPlan.deliveryTime,
        description: offer.title,
        plan: selectedPlan.planType,
      };
      setIsLoading(true);
      const result = await placeOrder(orderData, currentUser.accessToken);
      setResult(result);
      window.location.href = result.payUrl;

      setIsLoading(false);
    } catch (e) {
      openToast();
      setIsLoading(false);
    }
  };

  if (!total) return <div />;
  return (
    <div
      className={`fixed inset-0 z-10 transition-opacity duration-300 ease-in-out  ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className={`fixed inset-0 z-10 bg-black bg-opacity-50 transition-transform duration-300 ease-in-out `}
      >
        <div
          className={`absolute top-0 right-0 h-full w-96 bg-white  rounded shadow-md transform transition-transform ease-in-out duration-300 -translate-x-full ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }
        `}
        >
          <div
            className="flex justify-between items-center 
            px-6
            py-2
          "
          >
            <p
              className="text-xl font-bold 
          "
            >
              {" "}
              Order Details
            </p>
            <div onClick={onClose} className="flex  font-bold cursor-pointer ">
              X
            </div>
          </div>
          <div className="w-full h-[1px] bg-slate-200" />
          <div className=" px-6 py-6 bg-slate-50 ">
            <div className="  mt-5 flex gap-6 justify-between mb-5 ">
              <img
                src={offer.gallery.images[0].url}
                alt="offerImage"
                className="w-32 h-20 rounded-md object-cover border p-1"
              />
              <p>{offer.title}</p>
            </div>
            <div className=" mx-auto w-full h-[1px] bg-slate-200" />
            <div className=" my-5 flex justify-between">
              <p className="font-semibold uppercase">
                {selectedPlan.planType === "basicPlan"
                  ? "Basic Plan"
                  : "Premium Plan"}
              </p>
              <p className="font-semibold">{selectedPlan.price}DT</p>
            </div>
            <div className=" my-5 flex justify-between uppercase">
              <p className="font-semibold">{selectedPlan.title}</p>
              <FaRegCircleCheck size={20} />
            </div>
            <div className=" my-5 flex justify-between">
              <p className="font-semibold uppercase">
                {selectedPlan.deliveryTime}
              </p>
              <FaRegCircleCheck size={20} />
            </div>
            <div className=" my-5 flex justify-between uppercase">
              <div className="font-semibold flex items-center  gap-1">
                {selectedPlan.revisionNumber} revisions{" "}
                <MdRestartAlt size={19} />
              </div>
              <FaRegCircleCheck size={20} />
            </div>
            <div className=" mx-auto w-full h-[1px] bg-slate-200" />

            {total && (
              <div>
                <div className=" my-5 flex justify-between uppercase">
                  <div className="font-semibold flex items-center  gap-1">
                    Service fee
                    <div className="relative inline-block group">
                      <RxQuestionMarkCircled size={19} />
                      <div className="absolute hidden bg-gray-800 lowercase -top-[200%] left-1/2 w-60  -translate-x-1/2  text-white text-[9px] rounded px-2 py-1 whitespace-no-wrap group-hover:block">
                        This helps us operate our platform and offer 24/7
                        customer support for your orders.{" "}
                      </div>
                    </div>
                  </div>
                  <p className="font-semibold ">{total.serviceFee} DT</p>
                </div>
                <div className=" mx-auto w-full h-[1px] bg-slate-200" />

                <div className=" my-5 flex justify-between uppercase">
                  <div className="font-semibold flex items-center  text-lg gap-1">
                    Total
                  </div>
                  <p className="font-semibold ">{total.total} DT</p>
                </div>
              </div>
            )}

            <button
              disabled={!!result}
              onClick={handlePlaceOrder}
              className="w-full h-11  flex justify-center items-center rounded-md bg-primary hover:bg-blue-400 text-white font-semibold"
            >
              {isLoading ? (
                <p className=" w-5 h-5 rounded-full  border-white border-t-transparent border animate-spin" />
              ) : (
                "Confirm"
              )}
            </button>
          </div>
        </div>
      </div>
      <Snackbar
        open={snackBar}
        onClose={handleClosePopup}
        autoHideDuration={5000}
      >
        <MuiAlert elevation={6} variant="filled" severity="error">
          Error placing the order.
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

/**
 *
 *
 */
