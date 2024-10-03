import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../../hooks/auth_context";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { askWithdrawal } from "../../apis/withdrawal";
import { HiCheck } from "react-icons/hi2";
import { Toast } from "flowbite-react";
export const WithdrawalModal = React.memo(
  ({ isVisible, onClose, openToast }) => {
    const { currentUser } = useAuth();
    const {
      register,
      handleSubmit,
      setError,
      reset,
      formState: { errors, isSubmitting },
    } = useForm();

    if (!isVisible) return null;

    const onSubmit = async (data) => {
      const userData = {
        amount: data.amount,
        contactInfo: {
          email: data.email,
          phoneNumber: data.phoneNumber,
        },
        name: data.name,
        accountNumber: data.accountNumber,
        userId: currentUser.userId,
      };
      try {
        const result = await askWithdrawal(currentUser.accessToken, userData);
        reset();
        openToast();
        onClose();
      } catch (e) {}
    };

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
          <div className="w-full md:w-[700px] px-6 py-5 bg-white rounded-md flex items-center justify-center ">
            <div className="w-full h-full">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    for="fullName"
                  >
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="fullName"
                    type="text"
                    name="fullName"
                    aria-invalid={errors.fullName ? "true" : "false"}
                    placeholder="Type your full name here"
                    {...register("name", { required: true })}
                  />
                  {errors.fullName?.type === "required" && (
                    <div className="text-red-500">This field is required</div>
                  )}
                </div>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    for="accountNumber"
                  >
                    Account number
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline no-number-spinner"
                    id="accountNumber"
                    type="number"
                    name="accountNumber"
                    aria-invalid={errors.accountNumber ? "true" : "false"}
                    placeholder="Type your  account number here."
                    {...register("accountNumber", {})}
                  />
                  {errors.accountNumber && (
                    <div className="text-red-500">This field is required</div>
                  )}
                </div>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    for="amount"
                  >
                    Amount <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline no-number-spinner"
                    id="amount"
                    name="amount"
                    type="number"
                    placeholder="Please insert the amount here in DT. example 123DT"
                    {...register("amount", {
                      required: "This field is required",
                    })}
                  />
                  {errors.amount && (
                    <div className="text-red-500">{errors.amount.message}</div>
                  )}
                </div>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    for="email"
                  >
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="email"
                    name="email"
                    type="text"
                    placeholder="Please insert the email here"
                    {...register("email", {
                      required: "This field is required",
                      pattern: {
                        value: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/, // Regex for email
                        message: "Please enter a valid email address",
                      },
                    })}
                  />
                  {errors.email && (
                    <div className="text-red-500">{errors.email.message}</div>
                  )}
                </div>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    for="phoneNumber"
                  >
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline no-number-spinner"
                    id="phoneNumber"
                    name="phoneNumber"
                    type="text"
                    placeholder="Please insert the phoneNumber here"
                    maxLength={8} // Set max length (example: 10 digits)
                    onKeyDown={(e) => {
                      const isNumber = /^\d$/.test(e.key);
                      const isAllowedKey = [
                        "Backspace",
                        "ArrowLeft",
                        "ArrowRight",
                        "Delete",
                      ].includes(e.key);
                      if (!isNumber && !isAllowedKey) {
                        e.preventDefault(); // Prevent non-digit input
                      }
                    }}
                    {...register("phoneNumber", {
                      required: "This field is required",
                      validate: (value) =>
                        value.length == 8 ||
                        "Your phone number must be 8 digits long.", // Validation rule
                    })}
                  />
                  {errors.phoneNumber && (
                    <div className="text-red-500">
                      {errors.phoneNumber.message}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end">
                  <button
                    disabled={isSubmitting}
                    className="bg-primary mt-5 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="submit"
                  >
                    {isSubmitting ? "Sending..." : "Send"}
                  </button>
                </div>
                {errors.root && (
                  <div className="text-red-500">{errors.root.message}</div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
);
