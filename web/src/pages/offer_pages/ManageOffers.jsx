import React, { useState } from "react";
import NavbarFreelancer from "../../components/NavBarFreelancer";
import { useAuth } from "../../hooks/auth_context";
import {
  deleteOffer,
  updateOffer,
  useFreelancerOffers,
} from "../../apis/freelancer_offer";
import empty from "../../assets/images/empty.jpg";
import { Link, useNavigate } from "react-router-dom";
import { categorizeOffers } from "../../util";
import { useQueryClient } from "@tanstack/react-query";

export const ManageOffer = () => {
  return (
    <div className="bg-slate-50 h-svh">
      <NavbarFreelancer />

      <div className="max-w-[1240px] mx-auto my-10">
        <div className="flex justify-between">
          <div className="text-xl md:text-4xl  ">Manage Offers</div>
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
          <TabBar />
        </div>
      </div>
    </div>
  );
};

const TabBar = () => {
  const [activeTab, setActiveTab] = useState("active");
  const { currentUser } = useAuth();
  const offersData = useFreelancerOffers(
    currentUser.userId,
    currentUser.accessToken
  );

  const navigate = useNavigate();
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  const categorizedOffers = categorizeOffers(offersData.data || []);
  const renderTabContent = () => {
    switch (activeTab) {
      case "active":
        return (
          <Tab
            user={currentUser}
            title={"active"}
            offers={categorizedOffers.active}
          />
        );
      case "inactive":
        return (
          <Tab
            user={currentUser}
            title={"inactive"}
            offers={categorizedOffers.inactive}
          />
        );
      case "pendingApproval":
        return (
          <Tab
            title={"pending Approval"}
            user={currentUser}
            offers={categorizedOffers.pendingApproval}
          />
        );
      case "denied":
        return <Tab title={"denied"} offers={categorizedOffers.denied} />;
      case "draft":
        return (
          <Tab
            title={"draft"}
            offers={categorizedOffers.draft}
            user={currentUser}
          />
        );
      default:
        return null;
    }
  };

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
            onClick={() => handleTabClick("inactive")}
            className={`inline-block p-4 rounded-t-lg ${
              activeTab === "inactive"
                ? "text-primary bg-gray-100 active dark:bg-gray-800 dark:text-blue-500"
                : "hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300"
            }`}
          >
            Inactive
          </button>
        </li>
        <li className="me-2">
          <button
            onClick={() => handleTabClick("pendingApproval")}
            className={`inline-block p-4 rounded-t-lg ${
              activeTab === "pendingApproval"
                ? "text-primary bg-gray-100 active dark:bg-gray-800 dark:text-blue-500"
                : "hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300"
            }`}
          >
            Pending Approval
          </button>
        </li>
        <li className="me-2">
          <button
            onClick={() => handleTabClick("denied")}
            className={`inline-block p-4 rounded-t-lg ${
              activeTab === "denied"
                ? "text-primary bg-gray-100 active dark:bg-gray-800 dark:text-blue-500"
                : "hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300"
            }`}
          >
            Denied
          </button>
        </li>
        <li className="me-2">
          <button
            onClick={() => handleTabClick("draft")}
            className={`inline-block p-4 rounded-t-lg ${
              activeTab === "draft"
                ? "text-primary bg-gray-100 active dark:bg-gray-800 dark:text-blue-500"
                : "hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300"
            }`}
          >
            Draft
          </button>
        </li>
        <li className="ml-auto">
          <button
            onClick={() => {
              navigate("/create_offer");
            }}
            className="bg-primary  hover:bg-blue-400 hover:ease-in-out hover:duration-300 ease-in-out duration-300 uppercase text-white font-semibold py-2 px-4 rounded-md"
          >
            create a new offer
          </button>
        </li>
      </ul>
      {renderTabContent()}
    </>
  );
};
const Tab = ({ user, title, offers }) => {
  return (
    <div className=" bg-gray-50 text-medium border border-t-transparent text-gray-500 dark:text-gray-400 dark:bg-gray-800  w-full">
      <h3 className=" p-3 text-lg uppercase font-bold text-gray-900 dark:text-white mb-2">
        {title} offers
      </h3>
      <div>
        <div className="w-full h-[1px] bg-slate-200" />
        <div className=" flex flex-row text-black_04 text-sm font-semibold uppercase py-2 px-6 ">
          <div className="w-3/5">
            <div>offer</div>
          </div>
          <div className="w-2/5 flex justify-between mr-14">
            <div>impressions</div>
            <div>clicks</div>
            <div>orders</div>
            <div>rating</div>
          </div>
        </div>
        <div className="w-full h-[1px] bg-slate-200" />
        {offers.length === 0 ? (
          <p className="text-center text-gray-500 mt-4">
            No {title} offers to show
          </p>
        ) : (
          offers.map((offer, index) => (
            <div
              key={index}
              className=" mt-3 flex flex-row items-center text-black_04   py-2 px-6 "
            >
              <div className="w-3/5">
                <div className="flex items-center gap-x-3">
                  <img
                    src={
                      offer.offer.gallery
                        ? offer.offer?.gallery.images
                          ? offer.offer?.gallery.images[0].url
                          : empty
                        : empty
                    } // Assuming you have the offerImage variable defined
                    className="w-20 h-10 object-cover rounded-md"
                    alt=""
                  />
                  <div>{offer.offer.title}</div>{" "}
                  {/* Assuming title is a property of the offer object */}
                </div>
              </div>
              <div className="w-2/5 flex justify-between mr-7">
                <div>{offer.statistic.impressions}</div>{" "}
                {/* Assuming impressions is a property of the offer object */}
                <div>{offer.statistic.clicks}</div>{" "}
                {/* Assuming clicks is a property of the offer object */}
                <div>{offer.statistic.totalMade}</div>{" "}
                {/* Assuming orders is a property of the offer object */}
                <div>{offer.statistic.totalRating}</div>{" "}
                {/* Assuming rating is a property of the offer object */}
              </div>
              <div className=" flex justify-end ">
                {title === "active" || title === "inactive" ? (
                  <OfferPopUp
                    user={user}
                    name={title === "active" ? "inactive" : "active"}
                    documentRef={offer.offer.documentRef}
                  />
                ) : title === "pending Approval" ? (
                  <OfferPopUpPending
                    user={user}
                    name={title === "active" ? "inactive" : "active"}
                    documentRef={offer.offer.documentRef}
                  />
                ) : title === "draft" ? (
                  <OfferPopUpDraft
                    user={user}
                    name={title === "active" ? "inactive" : "active"}
                    documentRef={offer.offer.documentRef}
                  />
                ) : (
                  <div />
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const OfferPopUp = ({ user, name, documentRef }) => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient(); // Get the query client instance

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleUpdateStatus = async () => {
    await updateOffer(documentRef, user.accessToken, {
      status: name,
    });
    queryClient.invalidateQueries(["freelancerOffers", user.userId]);
  };

  return (
    <div className="relative inline-block text-left">
      <div
        onClick={toggleDropdown}
        className="text-black_04 cursor-pointer p-3    hover:bg-gray-200  rounded   text-center inline-flex items-center "
      >
        <svg
          className={`w-2.5 h-2.5 ms-3 transform transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </div>
      <div
        className={`${
          isOpen ? "block" : "hidden"
        } z-10 absolute right-0 mt-2 w-44 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700`}
        id="dropdown"
      >
        <ul
          className="py-2 text-sm text-gray-700 dark:text-gray-200"
          aria-labelledby="dropdownDefaultButton"
        >
          <li
            onClick={handleUpdateStatus}
            className="block cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
          >
            Make it as {name}
          </li>
          <Link to={`/edit_offer/${documentRef}`}>
            <li className="block cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
              Edit
            </li>
          </Link>
        </ul>
      </div>
    </div>
  );
};

const OfferPopUpPending = ({ user, name, documentRef }) => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient(); // Get the query client instance

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative inline-block text-left">
      <div
        onClick={toggleDropdown}
        className="text-black_04 cursor-pointer p-3    hover:bg-gray-200  rounded   text-center inline-flex items-center "
      >
        <svg
          className={`w-2.5 h-2.5 ms-3 transform transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </div>
      <div
        className={`${
          isOpen ? "block" : "hidden"
        } z-10 absolute right-0 mt-2 w-44 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700`}
        id="dropdown"
      >
        <ul
          className="py-2 text-sm text-gray-700 dark:text-gray-200"
          aria-labelledby="dropdownDefaultButton"
        >
          <Link to={`/edit_offer/${documentRef}`}>
            <li className="block cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
              Edit
            </li>
          </Link>
        </ul>
      </div>
    </div>
  );
};

const OfferPopUpDraft = ({ user, name, documentRef }) => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient(); // Get the query client instance

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  const handleDelete = async () => {
    try {
      await deleteOffer(documentRef, user.accessToken);
      queryClient.invalidateQueries(["freelancerOffers", user.userId]);
    } catch {}
  };

  return (
    <div className="relative inline-block text-left">
      <div
        onClick={toggleDropdown}
        className="text-black_04 cursor-pointer p-3    hover:bg-gray-200  rounded   text-center inline-flex items-center "
      >
        <svg
          className={`w-2.5 h-2.5 ms-3 transform transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </div>
      <div
        className={`${
          isOpen ? "block" : "hidden"
        } z-10 absolute right-0 mt-2 w-44 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700`}
        id="dropdown"
      >
        <ul
          className="py-2 text-sm text-gray-700 dark:text-gray-200"
          aria-labelledby="dropdownDefaultButton"
        >
          <Link to={`/edit_offer/${documentRef}`}>
            <li className="block cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
              Edit
            </li>
          </Link>
        </ul>
      </div>
    </div>
  );
};

export default TabBar;
