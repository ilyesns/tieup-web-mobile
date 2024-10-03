import Desktop from "../assets/images/desktop.jpg";
import { PiIdentificationCardLight } from "react-icons/pi";
import { MdOutlineAttachment } from "react-icons/md";
import { LiaNewspaper } from "react-icons/lia";
import { RiUserAddLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/auth_context";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useState } from "react";

export const BecomeSellerPage = () => {
  const navigate = useNavigate();
  const { isLoggedIn, currentUser } = useAuth();
  const [openToast, setOpenToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleCloseToast = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenToast(false);
  };

  async function handleContinue() {
    if (isLoggedIn) {
      navigate("/personal_info", { replace: true });
    } else {
      setErrorMessage("Please log in to continue.");
      setOpenToast(true);
    }
  }
  return (
    <div className="bg-gray-50 h-svh">
      <div
        className={
          " bg-white  w-full text-black z-10 ease-in-out duration-500 border-b"
        }
      >
        <div
          className={`  flex justify-between items-center h-24 max-w-[1240px] mx-auto px-4 $ z-50`}
        >
          <div className="flex-grow flex items-center">
            <h1 className=" text-3xl font-bold text-primary mr-6">TIE-UP.</h1>
          </div>
        </div>
      </div>

      <div className="max-w-[1240px]  mx-auto mt-5 ">
        <div className="flex flex-row  w-full justify-evenly">
          <div className="w-2/5">
            <img
              alt="desktop"
              src={Desktop}
              className="w-96 rounded object-cover h-[600px] shadow-md"
            />
          </div>
          <div className="flex w-3/5 flex-col">
            <div className="text-3xl font-semibold">
              Now ,let's talk about the things you want to steer clear of.
            </div>
            <p className="mt-5 text-gray-600 ">
              Your first impression matters! Create a profile that will stand
              out from the crowd on Tie-up.
            </p>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div className="flex flex-col items-start">
                <PiIdentificationCardLight size={45} className="text-primary" />
                <p className="mt-5 text-gray-600">
                  Take your time in creating your profile so it’s exactly as you
                  want it to be.
                </p>
              </div>
              <div className="flex flex-col items-start">
                <MdOutlineAttachment size={45} className="text-primary" />
                <p className="mt-5 text-gray-600">
                  Add credibility by linking out to your relevant professional
                  networks.
                </p>
              </div>
              <div className="flex flex-col items-start">
                <LiaNewspaper size={45} className="text-primary" />
                <p className="mt-5 text-gray-600 text-pretty">
                  Accurately describe your professional skills to help you get
                  more work.
                </p>
              </div>
              <div className="flex flex-col items-start">
                <RiUserAddLine size={45} className="text-primary" />
                <p className="mt-5 text-gray-600 text-pretty">
                  Put a face to your name! Upload a profile picture that clearly
                  shows your face.
                </p>
              </div>
            </div>
            <div className="flex gap-6 mt-8">
              <button
                onClick={() => {
                  handleContinue();
                }}
                className="py-3 px-8 bg-primary text-white rounded hover:text-primary border hover:bg-white"
              >
                Continue
              </button>
              <button
                onClick={() => {
                  navigate(-1);
                }}
                className="py-3 px-8   text-primary rounded border  hover:text-blue-400 "
              >
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
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
