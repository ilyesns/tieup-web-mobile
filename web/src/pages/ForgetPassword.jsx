import React, { useState, useRef } from "react";
import Landing1 from "../assets/images/landing1.jpg";
import {
  signInWithGoogle,
  signInWithCredentials,
  signInWithFacebook,
  resetPassword,
} from "../auth/firebase_auth";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";
import { getUser, mayBeCreateUser } from "../apis/user_api";
import { splitFullName } from "../util";
import { emit } from "process";

const ForgetPassword = () => {
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

    if (user.email) {
      setLoading(true);
      try {
        await resetPassword(user.email);
        navigate("/");
      } catch (e) {
        setErrorMessage(e.message);
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
                        Forget password
                      </h2>
                      <p className="text-xs mt-4 text-primary">
                        Please enter your email address to receive instructions
                        on how to reset your password.{" "}
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
                            "Submit"
                          )}
                        </button>
                      </form>
                    </div>
                  </div>
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
export default ForgetPassword;

/**
 *
 *  */
