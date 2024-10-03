import React, { useState, useRef } from "react";
import Landing1 from "../assets/images/landing1.jpg";
import { LuEye, LuEyeOff } from "react-icons/lu";
import {
  signUpWithEmailAndPassword,
  signInWithFacebook,
  signInWithGoogle,
} from "../auth/firebase_auth";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import { TEInput, TERipple } from "tw-elements-react";
import { splitFullName } from "../util";
import { createUser, getUser, mayBeCreateUser } from "../apis/user_api";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [openToast, setOpenToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const formRef = useRef(null);
  const navigate = useNavigate();

  const [user, setUserDetails] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const changeHandler = (e) => {
    const { name, value } = e.target;
    setUserDetails({
      ...user,
      [name]: value,
    });
  };

  const handleCloseToast = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenToast(false);
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setCShowPassword] = useState(false);

  const toggleCPasswordVisibility = () => {
    setCShowPassword((prevState) => !prevState);
  };
  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };
  const handleFacebookSignIn = async () => {
    try {
      const credentialUser = await signInWithFacebook().catch((e) => {
        setErrorMessage(e);
      });

      const userRole = await getUser(
        credentialUser.user.uid,
        credentialUser.user.accessToken
      );
      if (userRole.role === "freelancer") {
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/home", { replace: true });
      }
    } catch (e) {
      setErrorMessage(e.message); // Set error message to be displayed in the toast
      setOpenToast(true);
    }
  };

  const validateForm = (values) => {
    const error = {};
    const regex = /^[^\s+@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!values.firstName) {
      error.firstName = "First Name is required";
    }
    if (!values.lastName) {
      error.lastName = "Last Name is required";
    }
    if (!values.email) {
      error.email = "Email is required";
    } else if (!regex.test(values.email)) {
      error.email = "This is not a valid email format!";
    }
    if (!values.password) {
      error.password = "Password is required";
    } else if (values.password.length < 4) {
      error.password = "Password must be more than 4 characters";
    } else if (values.password.length > 10) {
      error.password = "Password cannot exceed more than 10 characters";
    }
    if (!values.confirmPassword) {
      error.confirmPassword = "Confirm Password is required";
    } else if (values.confirmPassword !== values.password) {
      error.confirmPassword = "Confirm password and password should be same";
    }
    return error;
  };

  const handleGoogleSignIn = async () => {
    try {
      const credentialUser = await signInWithGoogle().catch((e) => {
        setErrorMessage(e);
      });
      let firstName = splitFullName(credentialUser.user.displayName).firstName;
      let lastName = splitFullName(credentialUser.user.displayName).lastName;
      let userData = {
        firstName: firstName,
        lastName: lastName,
        profilePicture: credentialUser.user.photoURL,
        email: credentialUser.user.email,
        userId: credentialUser.user.uid,
      };
      await mayBeCreateUser(userData);
      const userRole = await getUser(
        credentialUser.user.uid,
        credentialUser.user.accessToken
      );
      if (userRole.role === "freelancer") {
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/home", { replace: true });
      }
    } catch (e) {
      setErrorMessage(e.message); // Set error message to be displayed in the toast
      setOpenToast(true);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormErrors(validateForm(user));
    if (Object.keys(validateForm(user)).length === 0) {
      setLoading(true);
      try {
        const credentialUser = await signUpWithEmailAndPassword(
          user.email,
          user.password
        );
        const userData = { ...user };

        userData.userId = credentialUser.user.uid;
        // await createUser(userData)

        await createUser(userData);
        navigate("/home", { replace: true });

        formRef.current.reset();
        // Clear the user details state
        setUserDetails({
          firstName: "",
          lastName: "",
          email: "",
          phoneNumber: "",
          password: "",
          confirmPassword: "",
        });
        // Set checkbox to false
      } catch (e) {
        /* empty */
        setErrorMessage(e.message); // Set error message to be displayed in the toast
        setOpenToast(true);
      }
      setLoading(false);
    }
  };
  return (
    <div>
      <section className=" h-svh bg-neutral-200 dark:bg-neutral-700">
        <div className="container h-full p-10 mx-auto">
          <div className="g-6 flex h-full flex-wrap items-center justify-center text-neutral-800 dark:text-neutral-200">
            <div className="max-w-[1240px] mx-auto">
              <div className="block rounded-lg bg-white shadow-lg dark:bg-neutral-800">
                <div className="gap-3 justify-between lg:flex lg:flex-wrap ">
                  <div className=" md:px-0 lg:w-5/12">
                    <div className="p-6">
                      <h2 className="font-bold text-2xl text-primary">
                        Sign Up
                      </h2>
                      <p className="text-xs mt-4 text-primary">
                        If you are new, easily sign up
                      </p>

                      <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-2"
                      >
                        <input
                          className="p-1 mt-8 rounded-md border"
                          type="text"
                          name="firstName"
                          placeholder="First Name"
                          required
                          value={user.firstName}
                          onChange={changeHandler}
                          style={{
                            fontSize: "12px",
                            color: "#999999",
                          }}
                        />
                        <div className="text-secondary text-[10px] h-1 mb-1">
                          {formErrors.firstName ? formErrors.firstName : null}
                        </div>

                        <input
                          className="p-1 mt-2 rounded-md border"
                          type="text"
                          name="lastName"
                          placeholder="Last Name"
                          required
                          value={user.lastName}
                          onChange={changeHandler}
                          style={{
                            fontSize: "12px",
                            color: "#999999",
                          }}
                        />
                        <div className="text-secondary text-[10px] h-1 mb-1">
                          {formErrors.lastName ? formErrors.lastName : null}
                        </div>

                        <input
                          className="p-1 mt-2 rounded-md border"
                          type="tel"
                          name="phoneNumber"
                          placeholder="Phone Number"
                          required
                          value={user.phoneNumber}
                          onChange={changeHandler}
                          style={{
                            fontSize: "12px",
                            color: "#999999",
                          }}
                        />
                        <div className="text-secondary text-[10px] h-1 mb-1">
                          {formErrors.phoneNumber
                            ? formErrors.phoneNumber
                            : null}
                        </div>
                        <input
                          className="p-1 mt-2 rounded-md border"
                          type="email"
                          name="email"
                          placeholder="Email"
                          required
                          id="email"
                          label="Email Address"
                          autoComplete="email"
                          value={user.email}
                          onChange={changeHandler}
                          autoFocus
                          style={{
                            fontSize: "12px",
                            color: "#999999",
                          }}
                        />
                        <div className="text-secondary text-[10px] h-1 mb-1">
                          {formErrors.email ? formErrors.email : null}
                        </div>
                        <div className="relative">
                          <input
                            className="p-1 rounded-md border w-full"
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Password"
                            required
                            label="Password"
                            id="password"
                            autoComplete="current-password"
                            value={user.password}
                            onChange={changeHandler}
                            style={{
                              fontSize: "12px",
                              color: "#999999",
                            }}
                          />

                          <div
                            className="bg-transparent border-transparent absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer"
                            onClick={togglePasswordVisibility}
                          >
                            {showPassword ? (
                              <LuEye />
                            ) : (
                              <>
                                <LuEyeOff />
                              </>
                            )}
                          </div>
                        </div>
                        <div className="text-secondary text-sm h-1 mb-4">
                          {formErrors.password ? formErrors.password : null}
                        </div>
                        <div className="relative">
                          <input
                            className="p-1 rounded-md border w-full"
                            type={showCPassword ? "text" : "password"}
                            name="confirmPassword"
                            placeholder="Confirm password"
                            required
                            label="Password"
                            id="confirmPassword"
                            autoComplete="current-password"
                            value={user.confirmPassword}
                            onChange={changeHandler}
                            style={{
                              fontSize: "12px",
                              color: "#999999",
                            }}
                          />

                          <div
                            className="bg-transparent border-transparent absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer"
                            onClick={toggleCPasswordVisibility}
                          >
                            {showCPassword ? (
                              <LuEye />
                            ) : (
                              <>
                                <LuEyeOff />
                              </>
                            )}
                          </div>
                        </div>
                        <div className="text-secondary text-sm h-1 mb-4">
                          {formErrors.confirmPassword
                            ? formErrors.confirmPassword
                            : null}
                        </div>
                        <button
                          disabled={loading}
                          className={
                            loading
                              ? "bg-gray-500 rounded-xl text-white py-2 "
                              : "bg-primary rounded-xl text-white py-2 hover:scale-105 duration-300"
                          }
                        >
                          {loading ? (
                            <CircularProgress size={24} color="inherit" />
                          ) : (
                            "Sign up"
                          )}
                        </button>
                      </form>

                      <div className="mt-6 grid grid-cols-3 items-center text-gray-400">
                        <hr className="border-gray-400" />
                        <p className="text-center text-sm">OR</p>
                        <hr className="border-gray-400" />
                      </div>

                      <button
                        onClick={handleGoogleSignIn}
                        className="bg-white border py-2 w-full rounded-xl mt-5 flex justify-center items-center text-sm hover:scale-105 duration-300 text-[#002D74]"
                      >
                        <svg
                          className="mr-3"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 48 48"
                          width="25px"
                        >
                          <path
                            fill="#FFC107"
                            d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                          />
                          <path
                            fill="#FF3D00"
                            d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                          />
                          <path
                            fill="#4CAF50"
                            d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                          />
                          <path
                            fill="#1976D2"
                            d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                          />
                        </svg>
                        Login with Google
                      </button>
                      {/* <button
                        onClick={handleFacebookSignIn}
                        className="bg-white border py-2 w-full rounded-xl mt-5 flex justify-center items-center text-sm hover:scale-105 duration-300 text-[#002D74]"
                      >
                        <svg
                          className="mr-3"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 48 48"
                          width="25px"
                        >
                          <path
                            fill="#3b5998"
                            d="M36 4H12c-2.2 0-4 1.8-4 4v24c0 2.2 1.8 4 4 4h12v-13h-3v-4h3V15c0-3.3 2.7-6 6-6h4v4h-4c-1.1 0-2 .9-2 2v3h5l-1 4h-4v13h8c2.2 0 4-1.8 4-4V8c0-2.2-1.8-4-4-4z"
                          ></path>
                        </svg>
                        Login with Facebook
                      </button> */}
                    </div>
                  </div>
                  {/* <!-- Right column container with background and description--> */}
                  <div className="flex items-center rounded-b-lg lg:w-6/12 lg:rounded-r-lg lg:rounded-bl-none">
                    <div className="px-4 py-6 text-white md:mx-6 md:p-12">
                      <img
                        alt=""
                        className="rounded-2xl w-full  object-cover"
                        src={Landing1}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Snackbar
        open={openToast}
        autoHideDuration={5000}
        onClose={handleCloseToast}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleCloseToast}
          severity="error"
        >
          {errorMessage}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export function ExampleV2() {
  return (
    <section className="h-full bg-neutral-200 dark:bg-neutral-700">
      <div className="container h-full p-10">
        <div className="g-6 flex h-full flex-wrap items-center justify-center text-neutral-800 dark:text-neutral-200">
          <div className="w-full">
            <div className="block rounded-lg bg-white shadow-lg dark:bg-neutral-800">
              <div className="g-0 lg:flex lg:flex-wrap">
                <div className="px-4 md:px-0 lg:w-6/12">
                  <div className="md:mx-6 md:p-12">
                    {/* <!--Logo--> */}
                    <div className="text-center">
                      <img
                        className="mx-auto w-48"
                        src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/lotus.webp"
                        alt="logo"
                      />
                      <h4 className="mb-12 mt-1 pb-1 text-xl font-semibold">
                        We are The Lotus Team
                      </h4>
                    </div>

                    <form>
                      <p className="mb-4">Please register an account</p>
                      {/* <!--Username input--> */}
                      <TEInput
                        type="text"
                        label="Username"
                        className="mb-4"
                      ></TEInput>

                      {/* <!--Password input--> */}
                      <TEInput
                        type="password"
                        label="Password"
                        className="mb-4"
                      ></TEInput>

                      {/* <!--Submit button--> */}
                      <div className="mb-12 pb-1 pt-1 text-center">
                        <TERipple rippleColor="light" className="w-full">
                          <button
                            className="mb-3 inline-block w-full rounded px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_rgba(0,0,0,0.2)] transition duration-150 ease-in-out hover:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)] focus:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)] focus:outline-none focus:ring-0 active:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)]"
                            type="button"
                            style={{
                              background:
                                "linear-gradient(to right, #ee7724, #d8363a, #dd3675, #b44593)",
                            }}
                          >
                            Sign up
                          </button>
                        </TERipple>

                        {/* <!--Forgot password link--> */}
                        <a href="#!">Terms and conditions</a>
                      </div>

                      {/* <!--Register button--> */}
                      <div className="flex items-center justify-between pb-6">
                        <p className="mb-0 mr-2">Have an account?</p>
                        <TERipple rippleColor="light">
                          <button
                            type="button"
                            className="inline-block rounded border-2 border-danger px-6 pb-[6px] pt-2 text-xs font-medium uppercase leading-normal text-danger transition duration-150 ease-in-out hover:border-danger-600 hover:bg-neutral-500 hover:bg-opacity-10 hover:text-danger-600 focus:border-danger-600 focus:text-danger-600 focus:outline-none focus:ring-0 active:border-danger-700 active:text-danger-700 dark:hover:bg-neutral-100 dark:hover:bg-opacity-10"
                          >
                            Login
                          </button>
                        </TERipple>
                      </div>
                    </form>
                  </div>
                </div>

                <div
                  className="flex items-center rounded-b-lg lg:w-6/12 lg:rounded-r-lg lg:rounded-bl-none"
                  style={{
                    background:
                      "linear-gradient(to right, #ee7724, #d8363a, #dd3675, #b44593)",
                  }}
                >
                  <div className="px-4 py-6 text-white md:mx-6 md:p-12">
                    <h4 className="mb-6 text-xl font-semibold">
                      We are more than just a company
                    </h4>
                    <p className="text-sm">
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                      ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SignUp;
