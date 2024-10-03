import React, { useState, useRef } from "react";
import Landing1 from "../assets/images/landing1.jpg";
import {
  signInWithGoogle,
  signInWithCredentials,
  signInWithFacebook,
} from "../auth/firebase_auth";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import { Link, useNavigate } from "react-router-dom";
import { getUser, mayBeCreateUser } from "../apis/user_api";
import { splitFullName } from "../util";

const LogIn = () => {
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [openToast, setOpenToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const formRef = useRef(null);
  const navigate = useNavigate();
  const [user, setUserDetails] = useState({
    email: "",
    password: "",
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
  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormErrors(validateForm(user));

    if (Object.keys(validateForm(user)).length === 0) {
      setLoading(true);
      try {
        const credentialUser = await signInWithCredentials(
          user.email,
          user.password
        );

        setUserDetails({
          email: "",
          password: "",
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

        // Set checkbox to false
      } catch (e) {
        setErrorMessage(e.message);
        setOpenToast(true);
      }
      setLoading(false);
    }
  };

  const validateForm = (values) => {
    const error = {};
    const regex = /^[^\s+@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!values.email) {
      error.email = "Email is required";
    } else if (!regex.test(values.email)) {
      error.email = "This is not a valid email format!";
    }
    if (!values.password) {
      error.password = "Password is required";
    } else if (values.password.length < 4) {
      error.password = "Password must be more than 4 characters";
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

  const handleLinkedInSignIn = () => {
    const linkedInAuthURL = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process.env.REACT_APP_LINKEDIN_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_REDIRECT_URI}&state=foobar&scope=r_liteprofile%20r_emailaddress%20w_member_social`;

    window.location.href = linkedInAuthURL;
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
                      <h2 className="font-bold text-2xl text-primary">Login</h2>
                      <p className="text-xs mt-4 text-primary">
                        If you are already a member, easily log in
                      </p>

                      <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-2"
                      >
                        <input
                          className="p-2 mt-8 rounded-md border"
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
                        />
                        <div className="text-secondary text-sm h-4 mb-2">
                          {formErrors.email ? formErrors.email : null}
                        </div>
                        <div className="relative">
                          <input
                            className="p-2 rounded-md border w-full"
                            type="password"
                            name="password"
                            placeholder="Password"
                            required
                            label="Password"
                            id="password"
                            autoComplete="current-password"
                            value={user.password}
                            onChange={changeHandler}
                          />

                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="gray"
                            className="bi bi-eye absolute top-1/2 right-3 -translate-y-1/2"
                            viewBox="0 0 16 16"
                          >
                            <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                            <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
                          </svg>
                        </div>
                        <div className="text-secondary text-sm h-4 mb-6">
                          {formErrors.password ? formErrors.password : null}
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
                            "Sign In"
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
                        onClick={handleLinkedInSignIn}
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
                        Login with LinkedIn
                      </button> */}

                      <div className="mt-5 text-xs border-b border-primary py-4 text-primary">
                        <Link to={"/forget-password"}>
                          {" "}
                          Forgot your password?
                        </Link>
                      </div>

                      <div className="mt-3 text-xs flex justify-between items-center text-primary">
                        <p>Don't have an account?</p>
                        <button
                          onClick={() => {
                            navigate("/signup");
                          }}
                          className="py-2 px-5 bg-white border rounded-xl hover:scale-110 duration-300"
                        >
                          Register
                        </button>
                      </div>
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
export default LogIn;

/**
 *
 *  */
