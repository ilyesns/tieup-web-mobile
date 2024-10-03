import React, { useState, useRef, useEffect } from "react";

import CircularProgress from "@mui/material/CircularProgress";
import { updateUser, useGetUser } from "../../apis/user_api";
import { useAuth } from "../../hooks/auth_context";
import { useQueryClient } from "@tanstack/react-query";

const UpdateProfile = React.memo(({ isVisible, onClose }) => {
  const { currentUser } = useAuth();
  const user = useGetUser(currentUser.userId, currentUser.accessToken);
  const queryClient = useQueryClient();

  const [userData, setUserData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    username: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
  });

  useEffect(() => {
    if (user.data) {
      setUserData({
        firstName: user.data.firstName || "",
        lastName: user.data.lastName || "",
        username: user.data.username || "",
        phoneNumber: user.data.phoneNumber || "",
      });
    }
  }, [user.data]);
  const changeHandler = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    let hasErrors = false;

    // Check for empty fields
    Object.entries(userData).forEach(([key, value]) => {
      if (!value.trim()) {
        newErrors[key] = `${key} is required`;
        hasErrors = true;
      }
    });

    if (hasErrors) {
      setErrors(newErrors);
    } else {
      setIsLoading(true);
      try {
        const result = await updateUser(
          userData,
          currentUser.userId,
          currentUser.accessToken
        );
        queryClient.invalidateQueries(["currentUser", currentUser.userId]);
        onClose();
      } catch (e) {}
      setIsLoading(false);
    }
  };

  if (user.isLoading)
    return (
      <div>
        <CircularProgress />
      </div>
    );
  if (user.isLoading) return <div>Loading..</div>;
  if (!isVisible) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center">
      <div className="flex flex-col">
        <button
          onClick={() => {
            onClose();
            setUserData(userData);
          }}
          className="place-self-end text-white text-xl"
        >
          X
        </button>
        <div className="w-full md:w-[700px] h-[600px] bg-white rounded-md flex items-center justify-center ">
          <form className="w-full mx-10">
            <div className="mb-5">
              <label
                htmlFor="username"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                User Name
              </label>
              <input
                type="text"
                id="username"
                name="username"
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                placeholder="@username"
                value={userData.username}
                onChange={changeHandler}
                required
              />
              {errors.username && (
                <p className="text-red-500">{errors.username}</p>
              )}
            </div>
            <div className="mb-5">
              <label
                htmlFor="firstName"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                placeholder="John"
                value={userData.firstName}
                onChange={changeHandler}
                required
              />
              {errors.firstName && (
                <p className="text-red-500">{errors.firstName}</p>
              )}
            </div>
            <div className="mb-5">
              <label
                htmlFor="lastName"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                placeholder="Doe"
                value={userData.lastName}
                onChange={changeHandler}
                required
              />
              {errors.lastName && (
                <p className="text-red-500">{errors.lastName}</p>
              )}
            </div>
            <div className="mb-5">
              <label
                htmlFor="phoneNumber"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Phone Number
              </label>
              <input
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                placeholder="12345678"
                value={userData.phoneNumber}
                onChange={changeHandler}
                required
              />
              {errors.phoneNumber && (
                <p className="text-red-500">{errors.phoneNumber}</p>
              )}
            </div>

            <div className="flex gap-3 mt-7 ">
              <button
                type="reset"
                className="bg-white w-1/2 text-gray-400 hover:text-primary    font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 da"
                onClick={onClose}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="text-white w-1/2 bg-blue-700 hover:bg-blue-800  font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 "
                onClick={handleSubmit}
              >
                {isLoading ? (
                  <CircularProgress className="w-6" />
                ) : (
                  <span>Update</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
});
export default UpdateProfile;
