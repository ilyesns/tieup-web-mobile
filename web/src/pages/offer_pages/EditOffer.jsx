import React, { useEffect, useState } from "react";
import NavbarFreelancer from "../../components/NavBarFreelancer";
import { IoChevronForward } from "react-icons/io5";
import { useServices } from "../../apis/services";
import {
  DELIVERY_DAYS,
  RevisionsTimes,
  extractRootServices,
  extractSubServices,
  getOffer,
} from "../../util";
import { Card, Typography } from "@material-tailwind/react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import {
  createGallery,
  createOffer,
  createPlan,
  deleteGalleryItem,
  updateGallery,
  updateOffer,
  updatePlan,
  useFreelancerOffer,
} from "../../apis/freelancer_offer";
import { useAuth } from "../../hooks/auth_context";
import { CircularProgress } from "@mui/material";
import { unstable_usePrompt, useNavigate, useParams } from "react-router-dom";
import { FaCheck } from "react-icons/fa";
import { FiCheckCircle } from "react-icons/fi";
import { useQueryClient } from "@tanstack/react-query";

export const EditOffer = () => {
  const [isDirty, setIsDirty] = useState(false); // Set to true when form data changes
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState("overview");
  const servicesData = useServices();
  const { currentUser } = useAuth();
  const [services, setServices] = useState([]);
  const [subServices, setSubServices] = useState([]);

  const { offerId } = useParams();
  const [offerData, setOfferData] = useState(null);
  const offer = useFreelancerOffer(offerId, currentUser.accessToken);

  const [offerRef, setOfferRef] = useState(null);
  const [basicPackage, setBasicPackage] = useState({
    planType: "basicPlan",
    title: "",
    description: "",
    deliveryTime: "",
    revisionNumber: "",
    price: 30,
  });
  const [premiumPackage, setPremiumPackage] = useState({
    planType: "premiumPlan",
    title: "",
    description: "",
    deliveryTime: "",
    revisionNumber: "",
    price: 30,
  });
  const [formData, setFormData] = useState({
    selectedService: "",
    selectedServiceRef: "",
    selectedSubService: "",
    selectedSubServiceRef: "",
    offerTitle: "",
    description: "",
  });
  const [files, setFiles] = useState({
    images: [],
    video: null,
    document: null,
  });
  const [gallery, setGallery] = useState({
    images: [],
    video: null,
    document: null,
  });
  const [loading, setLoading] = useState(false);
  const [snackBar, setSnackBar] = useState(false);

  const queryClient = useQueryClient(); // Get the query client instance

  useEffect(() => {
    queryClient.invalidateQueries(["freelancerOffers", currentUser.userId]);
  }, [currentUser.userId]);

  useEffect(() => {
    if (servicesData.data) {
      setServices(extractRootServices(servicesData.data));
      setSubServices(extractSubServices(servicesData.data));
    }
  }, [servicesData.data]);
  useEffect(() => {
    if (servicesData.data) {
      setServices(extractRootServices(servicesData.data));
      setSubServices(extractSubServices(servicesData.data));
    }
  }, [servicesData.data]);

  useEffect(() => {
    if (offer.data) {
      setOfferRef(offer.data.documentRef);
      setFormData({
        offerTitle: offer.data?.title || "",
        description: offer.data?.description || "",
        selectedService: offer.data?.serviceName,
        selectedServiceRef: offer.data?.serviceId,
        selectedSubService: offer.data?.subServiceName,
        selectedSubServiceRef: offer.data?.subServiceId,
      });
      setBasicPackage({
        planType: "basicPlan",
        title: offer.data?.basicPlan.title || "",
        deliveryTime: offer.data?.basicPlan.deliveryTime,
        price: offer.data?.basicPlan.price,
        description: offer.data?.basicPlan.description,
        revisionNumber: offer.data?.basicPlan.revisionNumber,
      });
      setPremiumPackage({
        planType: "premiumPlan",
        title: offer.data?.basicPlan.title || "",
        deliveryTime: offer.data?.basicPlan.deliveryTime,
        price: offer.data?.basicPlan.price,
        description: offer.data?.basicPlan.description,
        revisionNumber: offer.data?.basicPlan.revisionNumber,
      });
      setGallery({
        images: offer.data?.gallery ? offer.data.gallery.images : [],
        video: offer.data?.gallery ? offer.data.gallery.video : null,
        document: offer.data?.gallery ? offer.data.gallery.document : null,
      });
    }
  }, [offerId, offer.data]);

  const handleItemClick = (item) => {
    // Check if the clicked step is completed
    // if (!completedSteps[item]) {
    //   // If not completed, prevent moving to the step
    //   return;
    // }
    // If completed, allow moving to the step
    setActiveItem(item);
  };

  const renderContent = () => {
    switch (activeItem) {
      case "overview":
        return (
          <OverviewContent
            setFormData={setFormData}
            formData={formData}
            services={services}
            subServices={subServices}
          />
        );
      case "pricing":
        return (
          <PricingContent
            basicPackage={basicPackage}
            premiumPackage={premiumPackage}
            setBasicPackage={setBasicPackage}
            setPremiumPackage={setPremiumPackage}
          />
        );
      case "description":
        return (
          <DescriptionContent formData={formData} setFormData={setFormData} />
        );
      case "gallery":
        return (
          <GalleryContent
            offerId={offerId}
            accessToken={currentUser.accessToken}
            files={files}
            setFiles={setFiles}
            gallery={gallery}
          />
        );
      case "publish":
        return <PublishContent />;
      default:
        return null;
    }
  };

  const handleSave = async () => {
    if (activeItem === "overview") {
      if (
        !formData.offerTitle ||
        !formData.selectedService ||
        !formData.selectedSubService
      ) {
        setSnackBar(true);
      } else {
        setIsDirty(true);
        setLoading(true);

        const offerData = {
          title: formData.offerTitle,
          serviceId: formData.selectedServiceRef,
          subserviceId: formData.selectedSubServiceRef,
          serviceName: formData.selectedService,
          subServiceName: formData.selectedSubService,

          status: "draft",
        };

        await updateOffer(offerRef, currentUser.accessToken, offerData);

        setLoading(false);
        setActiveItem("pricing");
      }
    }

    if (activeItem === "pricing") {
      if (isAnyFieldEmpty()) {
        setSnackBar(true);

        // Show the pop-up if any field is empty
      } else {
        setLoading(true);
        try {
          await updatePlan(offerRef, currentUser.accessToken, basicPackage);
          await updatePlan(offerRef, currentUser.accessToken, premiumPackage);
        } catch (e) {
          console.log(e);
        }

        setLoading(false);

        setActiveItem("description");
      }
    }
    if (activeItem === "description") {
      if (!formData.description && !formData.description.length < 50) {
        setSnackBar(true);
      } else {
        setLoading(true);

        const offerData = {
          description: formData.description,
        };

        await updateOffer(offerRef, currentUser.accessToken, offerData);
        setActiveItem("gallery");
        setLoading(false);
      }
    }
    if (activeItem === "gallery") {
      if (files.images.length === 0 && gallery.images === 0) {
        setSnackBar(true);
      } else {
        if (files.images.length > 0 || files.document || files.video) {
          setLoading(true);
          await updateGallery(offerRef, currentUser.accessToken, files);
          queryClient.invalidateQueries(["freelancerOffer", offerId]);
          setFiles({
            images: [],
            document: null,
            video: null,
          });
        }
        setLoading(false);

        setActiveItem("publish");
      }
    }
    if (activeItem === "publish") {
      setIsDirty(false);
      await updateOffer(offerRef, currentUser.accessToken, {
        status: "pendingApproval",
      });
      navigate("/dashboard", { replace: true });
    }
  };

  const isAnyFieldEmpty = () => {
    // Check if any field in basicPackage or premiumPackage is empty
    return (
      Object.values(basicPackage).some((value) => value === "") ||
      Object.values(premiumPackage).some((value) => value === "")
    );
  };
  const [completedSteps, setCompletedSteps] = useState({
    overview: false,
    pricing: false,
    description: false,
    gallery: false,
    publish: false,
  });
  useEffect(() => {
    setCompletedSteps((prevCompletedSteps) => ({
      ...prevCompletedSteps,
      [activeItem]: true,
    }));
  }, [activeItem]); // This useEffect should only run when activeItem changes

  unstable_usePrompt({
    message: "You have unsaved changes! Are you sure you want to leave?",
    when: isDirty,
  });

  // Handle page refresh or closing the tab/window
  const handleBeforeUnload = (e) => {
    if (isDirty) {
      e.preventDefault();
      e.returnValue =
        "You have unsaved changes! Are you sure you want to leave?";
    }
  };

  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDirty]);

  const handleClosePopup = () => {
    setSnackBar(false); // Close the pop-up
  };

  return (
    <div className="bg-slate-50 ">
      <NavbarFreelancer />
      <div className="bg-white">
        <div className="w-full h-[1px] bg-slate-200" />
        <div className="max-w-[1240px] mx-auto  py-4">
          <ul className="flex items-center gap-x-7 ">
            <li
              className={`cursor-pointer ${
                completedSteps.overview ? "text-primary" : "text-gray-500"
              }`}
              onClick={() => handleItemClick("overview")}
            >
              <div className="flex gap-x-2 items-center">
                <p
                  className={`w-7 h-7 rounded-full ${
                    completedSteps.overview ? "bg-primary" : "bg-gray-300"
                  } flex justify-center items-center text-white font-semibold`}
                >
                  {activeItem !== "overview" &&
                  completedSteps.overview === true ? (
                    <FaCheck />
                  ) : (
                    "1"
                  )}
                </p>
                <p className="font-semibold ">Overview</p>
              </div>
            </li>
            <li>
              <IoChevronForward />
            </li>
            <li
              className={`cursor-pointer ${
                completedSteps.pricing ? "text-primary" : "text-gray-500"
              }`}
              onClick={() => handleItemClick("pricing")}
            >
              <div className="flex gap-x-2 items-center">
                <p
                  className={`w-7 h-7 rounded-full ${
                    completedSteps.pricing ? "bg-primary" : "bg-gray-300"
                  } flex justify-center items-center text-white font-semibold`}
                >
                  {activeItem !== "pricing" &&
                  completedSteps.pricing === true ? (
                    <FaCheck />
                  ) : (
                    "2"
                  )}
                </p>
                <p className="font-semibold ">Pricing</p>
              </div>
            </li>
            <li>
              <IoChevronForward />
            </li>
            <li
              className={`cursor-pointer ${
                completedSteps.description ? "text-primary" : "text-gray-500"
              }`}
              onClick={() => handleItemClick("description")}
            >
              <div className="flex gap-x-2 items-center">
                <p
                  className={`w-7 h-7 rounded-full ${
                    completedSteps.description ? "bg-primary" : "bg-gray-300"
                  } flex justify-center items-center text-white font-semibold`}
                >
                  {activeItem !== "description" &&
                  completedSteps.description === true ? (
                    <FaCheck />
                  ) : (
                    "3"
                  )}
                </p>
                <p className="font-semibold ">Description</p>
              </div>
            </li>
            <li>
              <IoChevronForward />
            </li>
            <li
              className={`cursor-pointer ${
                completedSteps.gallery ? "text-primary" : "text-gray-500"
              }`}
              onClick={() => handleItemClick("gallery")}
            >
              <div className="flex gap-x-2 items-center">
                <p
                  className={`w-7 h-7 rounded-full ${
                    completedSteps.gallery ? "bg-primary" : "bg-gray-300"
                  } flex justify-center items-center text-white font-semibold`}
                >
                  {activeItem !== "gallery" &&
                  completedSteps.gallery === true ? (
                    <FaCheck />
                  ) : (
                    "4"
                  )}
                </p>
                <p className="font-semibold ">Gallery</p>
              </div>
            </li>
            <li>
              <IoChevronForward />
            </li>
            <li
              className={`cursor-pointer ${
                completedSteps.publish ? "text-primary" : "text-gray-500"
              }`}
              onClick={() => handleItemClick("publish")}
            >
              <div className="flex gap-x-2 items-center">
                <p
                  className={`w-7 h-7 rounded-full ${
                    completedSteps.publish ? "bg-primary" : "bg-gray-300"
                  } flex justify-center items-center text-white font-semibold`}
                >
                  {activeItem !== "publish" &&
                  completedSteps.publish === true ? (
                    <FaCheck />
                  ) : (
                    "5"
                  )}
                </p>
                <p className="font-semibold ">Publish</p>
              </div>
            </li>
          </ul>
        </div>
        <div className="w-full h-[1px] bg-slate-200" />
      </div>
      <div>{renderContent()}</div>

      <div className="max-w-[1240px]  mx-auto mt-5 mb-5 flex justify-end">
        {loading ? (
          <CircularProgress className="  w-5 h-5 text-primary " />
        ) : (
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-primary mb-8 text-white rounded"
          >
            Save & Continue
          </button>
        )}
      </div>

      <Snackbar
        open={snackBar}
        onClose={handleClosePopup}
        autoHideDuration={5000}
      >
        <MuiAlert elevation={6} variant="filled" severity="error">
          Please complete the required fields.
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

const OverviewContent = ({ services, subServices, formData, setFormData }) => {
  const handleCategoryChange = (event) => {
    const selectedService = event.target.value;
    setFormData({
      ...formData,
      selectedService,
      selectedSubService: "", // Reset subcategory when category changes
    });
  };

  const handleSubServiceChange = (event) => {
    const selectedSubService = event.target.value;
    setFormData({
      ...formData,
      selectedSubService,
    });
  };

  const handleTitleChange = (event) => {
    const offerTitle = event.target.value;
    setFormData({
      ...formData,
      offerTitle,
    });
  };

  return (
    <div className="max-w-[1240px] mx-auto mt-20">
      <div className="font-semibold text-2xl mb-8">Overview</div>
      <div className="bg-white border rounded">
        <div className="flex flex-col px-4 py-6 gap-y-10">
          <div className="flex justify-between text-black_04 gap-10">
            <div className="w-1/3">
              <p className="font-semibold text-lg">
                Offer title <span className="text-red-400">*</span>
              </p>
              <p className="text-sm md:w-[70%]">
                As your Offer storefront, your title is the most important place
                to include keywords that buyers would likely use to search for a
                service like yours.
              </p>
            </div>
            <div className="w-2/3">
              <textarea
                id="title"
                rows="4"
                className="block p-2.5 resize-none w-full h-[65%] text-base text-gray-900 bg-gray-50 rounded-sm border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Write your offer title here..."
                value={formData.offerTitle}
                onChange={handleTitleChange}
              ></textarea>
            </div>
          </div>
          <div className="flex justify-between text-black_04 gap-10">
            <div className="w-1/3">
              <p className="font-semibold text-lg">
                Category <span className="text-red-400">*</span>
              </p>
              <p className="text-sm md:w-[70%]">
                Choose the category and sub-category most suitable for your
                Offer.
              </p>
            </div>
            <div className="w-2/3 flex justify-between gap-10">
              <select
                id="categories"
                className="bg-gray-50 border w-1/2 h-10 border-gray-300 text-gray-900 text-sm rounded-sm  block p-2.5"
                value={formData.selectedService}
                disabled={true}
              >
                <option value="">{formData.selectedService}</option>
                {services.map((service) => (
                  <option key={service.documentRef} value={service.documentRef}>
                    {service.name}
                  </option>
                ))}
              </select>
              <select
                id="subcategories"
                className="bg-gray-50 border w-1/2 h-10 border-gray-300 text-gray-900 text-sm rounded-sm   block p-2.5"
                value={formData.selectedSubService}
                disabled={true}
              >
                <option value="">{formData.selectedSubService}</option>
              </select>
            </div>
          </div>
          <p className="font-semibold text-red-400 text-sm ">
            Please note that the categories of the offer cannot be modified
            after creation.
          </p>
        </div>
      </div>
    </div>
  );
};

const PricingContent = ({
  basicPackage,
  setBasicPackage,
  premiumPackage,
  setPremiumPackage,
}) => {
  const TABLE_HEAD = ["", "Basic", "Premium"];

  const handleBasicPackageChange = (event) => {
    const { name, value } = event.target;
    setBasicPackage((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handlePremiumPackageChange = (event) => {
    const { name, value } = event.target;
    setPremiumPackage((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div className="max-w-[1240px] mx-auto mt-20">
      <div className="font-semibold text-2xl mb-8">Pricing</div>

      <Card className="h-full w-full shadow-none border rounded-md ">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head) => (
                <th
                  key={head}
                  className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                >
                  <Typography
                    variant="h6"
                    color="blue-gray"
                    className="font-semibold uppercase leading-none opacity-70 "
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td />
              <td>
                <input
                  placeholder="Title"
                  name="title"
                  value={basicPackage.title}
                  onChange={handleBasicPackageChange}
                  className="block p-2.5 w-full  border-transparent focus:border-transparent  text-base text-gray-900  rounded-sm border  "
                />
              </td>
              <td>
                <input
                  placeholder="Title"
                  name="title"
                  value={premiumPackage.title}
                  onChange={handlePremiumPackageChange}
                  className="block p-2.5 w-full  border-transparent focus:border-transparent  text-base text-gray-900  rounded-sm border  "
                />
              </td>
            </tr>
            <tr className="border-b">
              <td />
              <td>
                <textarea
                  placeholder="Description"
                  name="description"
                  value={basicPackage.description}
                  onChange={handleBasicPackageChange}
                  className="block p-2.5 w-full resize-none  border-transparent focus:border-transparent  text-base text-gray-900  rounded-sm border  "
                />
              </td>
              <td>
                <textarea
                  placeholder="Description"
                  name="description"
                  value={premiumPackage.description}
                  onChange={handlePremiumPackageChange}
                  className="block p-2.5 w-full resize-none  border-transparent focus:border-transparent  text-base text-gray-900  rounded-sm border  "
                />
              </td>
            </tr>
            <tr className="border-b">
              <td />
              <td className="p-2.5">
                <select
                  id="basicDeliveryTime"
                  name="deliveryTime"
                  value={basicPackage.deliveryTime}
                  onChange={handleBasicPackageChange}
                  className="bg-gray- w-full h-10 border-transparent text-gray-900 focus:border-transparent text-sm rounded-sm   block p-2.5"
                >
                  <option value="">Select a Delivery Time</option>
                  {DELIVERY_DAYS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </td>
              <td className="p-2.5">
                <select
                  id="premiumDeliveryTime"
                  name="deliveryTime"
                  value={premiumPackage.deliveryTime}
                  onChange={handlePremiumPackageChange}
                  className="bg-gray- w-full h-10 border-transparent text-gray-900 focus:border-transparent text-sm rounded-sm   block p-2.5"
                >
                  <option value="">Select a Delivery Time</option>
                  {DELIVERY_DAYS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
            <tr className="border-b">
              <td>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal p-2.5"
                >
                  Revisions
                </Typography>
              </td>
              <td className="p-2.5">
                <select
                  id="basicRevisions"
                  name="revisions"
                  value={basicPackage.revisions}
                  onChange={handleBasicPackageChange}
                  className="bg-gray- w-full h-10 border-transparent text-gray-900 focus:border-transparent text-sm rounded-sm   block p-2.5"
                >
                  <option>Select revision number</option>
                  {RevisionsTimes.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </td>
              <td className="p-2.5">
                <select
                  id="premiumRevisions"
                  name="revisions"
                  value={premiumPackage.revisions}
                  onChange={handlePremiumPackageChange}
                  className="bg-gray- w-full h-10 border-transparent text-gray-900 focus:border-transparent text-sm rounded-sm   block p-2.5"
                >
                  <option>Select revision number</option>

                  {RevisionsTimes.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
            <tr>
              <td>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal p-2.5"
                >
                  Price
                </Typography>
              </td>
              <td className="p-2.5">
                <input
                  type="number"
                  className="bg-gray- w-full h-10 border-transparent text-gray-900 focus:border-transparent text-sm rounded-sm   block p-2.5"
                  value={basicPackage.price}
                  name="price"
                  onChange={handleBasicPackageChange}
                  min={30}
                  step={5}
                />
              </td>
              <td className="p-2.5">
                <input
                  type="number"
                  name="price"
                  className="bg-gray- w-full h-10 border-transparent text-gray-900 focus:border-transparent text-sm rounded-sm   block p-2.5"
                  value={premiumPackage.price}
                  onChange={handlePremiumPackageChange}
                  min={30}
                  step={5}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </Card>
    </div>
  );
};

const DescriptionContent = ({ formData, setFormData }) => {
  const handleChange = (event) => {
    setFormData({
      ...formData,
      description: event.target.value,
    });
  };

  const MIN_CHARACTERS = 50; // Minimum character limit
  const MAX_CHARACTERS = 1000; // Maximum character limit

  return (
    <div className="max-w-[1240px] mx-auto mt-20">
      <div className="font-semibold text-2xl mb-8">Description</div>
      <div className="bg-white border rounded">
        <div className="flex flex-col px-4 py-6 gap-y-10">
          <div className="flex justify-between text-black_04 gap-10">
            <div className="">
              <p className="font-semibold text-lg">Offer description</p>
              <p className="text-sm md:w-[70%]">
                As your Offer storefront, your description is the most important
                place to include keywords that buyers would likely use to search
                for a service like yours.
              </p>
            </div>
          </div>
          <div>
            <textarea
              id="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              className="block p-2.5 resize-none w-full h-[100%] text-base text-gray-900 bg-gray-50 rounded-sm border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Write your offer description here..."
              maxLength={MAX_CHARACTERS} // Set max length attribute
            ></textarea>
            <div className="flex justify-between text-sm mt-2">
              <span className="text-red-300">
                Minimum {MIN_CHARACTERS} characters
              </span>
              <span>
                {formData.description.length}/{MAX_CHARACTERS} characters
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const GalleryContent = ({ gallery, files, setFiles, offerId, accessToken }) => {
  const handleFileDrop = (event, fileType) => {
    event.preventDefault();
    const files = event.dataTransfer.files;

    // Handle dropped files based on file type
    switch (fileType) {
      case "video":
        handleVideoFiles(files);
        break;
      case "image":
        handleImageFiles(files);
        break;
      default:
        handleOtherFiles(files);
    }
  };

  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [isLoadingVideo, setIsLoadingVideo] = useState(false);
  const [isLoadingDoc, setIsLoadingDoc] = useState(false);
  const queryClient = useQueryClient(); // Get the query client instance

  const handleVideoFiles = (f) => {
    setFiles({
      ...files,
      video: f,
    });
  };

  const handleOtherFiles = (f) => {
    setFiles({
      ...files,
      document: f,
    });
  };
  const handleFileChange = (event, fileType) => {
    const files = event.target.files;

    // Handle dropped files based on file type
    switch (fileType) {
      case "video":
        handleVideoFiles(files);
        break;
      case "image":
        handleImageFiles(files);
        break;
      default:
        handleOtherFiles(files);
    }
  };

  const handleImageFiles = (fls) => {
    setFiles({
      ...files,
      images: [...(files.images || []), ...fls],
    });
  };
  const handleRemoveImage = (index) => {
    const updatedImages = [...files.images];
    updatedImages.splice(index - 1, 1);
    setFiles({ ...files, images: updatedImages });
  };
  const handleRemoveVideo = () => {
    setFiles({ ...files, video: null });
  };

  const handleRemoveDocument = () => {
    setFiles({ ...files, document: null });
  };
  const handleDeleteVideo = async (item) => {
    setIsLoadingVideo(true);
    await deleteGalleryItem(offerId, accessToken, item);
    queryClient.invalidateQueries(["freelancerOffer", offerId]);
    setIsLoadingVideo(false);
  };
  const handleDeleteImage = async (item) => {
    setIsLoadingImage(true);
    await deleteGalleryItem(offerId, accessToken, item);
    queryClient.invalidateQueries(["freelancerOffer", offerId]);

    setIsLoadingImage(false);
  };
  const handleDeleteDocument = async (item) => {
    setIsLoadingDoc(true);

    await deleteGalleryItem(offerId, accessToken, item);
    queryClient.invalidateQueries(["freelancerOffer", offerId]);

    setIsLoadingDoc(false);
  };

  const length = gallery.images ? gallery.images.length : 0; //2
  return (
    <div className="max-w-[1240px] mx-auto mt-20">
      <div className="font-semibold text-2xl mb-8">Gallery</div>
      <div className="bg-white border rounded p-6">
        {/* Video Section */}
        <div className="font-semibold text-2xl mb-8">
          Show case your services in a Offer Gallery
        </div>
        <div className=" w-1/2 mb-8">
          <div className="font-semibold text-lg mb-2 ">Video(only one):</div>

          {gallery.video ? (
            <div className="relative">
              <video controls className="w-full h-40 object-cover rounded-md">
                <source src={gallery.video.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <button
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                onClick={() => {
                  handleDeleteVideo(gallery.video);
                }}
              >
                {isLoadingVideo ? <CircularProgress /> : "X"}
              </button>
            </div>
          ) : files.video ? (
            <div className="relative">
              <video controls className="w-full h-40 object-cover rounded-md">
                <source
                  src={URL.createObjectURL(files.video[0])}
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
              <button
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                onClick={handleRemoveVideo}
              >
                X
              </button>
            </div>
          ) : (
            <label
              htmlFor="video"
              onDrop={(e) => handleFileDrop(e, "video")}
              onDragOver={(e) => e.preventDefault()}
              className=" flex items-center justify-center  h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  {/* Your video icon SVG */}
                </svg>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  Click to upload video
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  MP4, AVI, or other video formats
                </p>
              </div>
              <input
                id="video"
                type="file"
                accept="video/*"
                className="hidden"
                size={50 * 1024 * 1024}
                onChange={(e) => handleFileChange(e, "video")}
              />
            </label>
          )}
        </div>

        {/* Images Section */}
        <div className="mb-8">
          <div className="font-semibold text-lg mb-2">
            Images(up to 3 and at least one):
          </div>
          <div className=" w-1/2 flex justify-between gap-6">
            {[1, 2, 3].map((index) => (
              <div key={index} className="w-1/3">
                {!gallery.images ? (
                  <label
                    htmlFor={`image-input-${index}`}
                    onDrop={(e) => handleFileDrop(e, "image")}
                    onDragOver={(e) => e.preventDefault()}
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg
                        className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        {/* Your image icon SVG */}
                      </svg>
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        Click to upload image
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        JPG, PNG, or GIF
                      </p>
                      <input
                        id={`image-input-${index}`}
                        type="file"
                        className="hidden"
                        accept="image/*"
                        size={5 * 1024 * 1024}
                        onChange={(e) => handleFileChange(e, "image")}
                      />
                    </div>
                  </label>
                ) : gallery.images[index - 1] ? (
                  <div className="relative z-30">
                    <img
                      src={gallery.images[index - 1].url}
                      alt={`Image ${index}`}
                      className=" w-full h-32 object-cover rounded-md"
                    />
                    <button
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                      onClick={() =>
                        handleDeleteImage(gallery.images[index - 1])
                      }
                    >
                      {isLoadingImage ? <CircularProgress key={index} /> : "X"}
                    </button>
                  </div>
                ) : files.images[
                    gallery.images.length <= index // 2 <= 3
                      ? index - gallery.images.length - 1 // 3-2 //1
                      : index - 1 // 1 -1 //0
                  ] ? (
                  <div className="relative z-30">
                    <img
                      src={URL.createObjectURL(
                        files.images[
                          gallery.images.length <= index
                            ? index - gallery.images.length - 1
                            : index - 1
                        ]
                      )}
                      alt={`Image ${index}`}
                      className=" w-full h-32 object-cover rounded-md"
                    />
                    <button
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                      onClick={() =>
                        handleRemoveImage(
                          gallery.images.length <= index
                            ? index - gallery.images.length - 1
                            : index - 1
                        )
                      }
                    >
                      X
                    </button>
                  </div>
                ) : (
                  <label
                    htmlFor={`image-input-${index}`}
                    onDrop={(e) => handleFileDrop(e, "image")}
                    onDragOver={(e) => e.preventDefault()}
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg
                        className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        {/* Your image icon SVG */}
                      </svg>
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        Click to upload image
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        JPG, PNG, or GIF
                      </p>
                      <input
                        id={`image-input-${index}`}
                        type="file"
                        className="hidden"
                        accept="image/*"
                        size={5 * 1024 * 1024}
                        onChange={(e) => handleFileChange(e, "image")}
                      />
                    </div>
                  </label>
                )}
              </div>
            ))}
          </div>
          <div>
            {files.images.length <= 0 ? (
              <p className="text-sm text-red-400">At least uploaded one</p>
            ) : null}
          </div>
        </div>

        {/* Files Section */}
        <div className="mb-8">
          <div className="font-semibold mb-2 text-lg">
            Documents (only one):
          </div>
          <div className="w-1/2 flex items-center justify-center  h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              {gallery.document ? (
                <div className="flex flex-col  items-center gap-y-5">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm ">{gallery.document.name}</p>
                    </div>
                  </div>
                  <button
                    className="bg-red-500 text-white  px-2 py-1 rounded-md"
                    onClick={() => {
                      handleDeleteDocument(gallery.document);
                    }}
                  >
                    {isLoadingDoc ? (
                      <CircularProgress size={15} className="text-white" />
                    ) : (
                      "Delete"
                    )}
                  </button>
                </div>
              ) : files.document ? (
                <div className="flex flex-col  items-center gap-y-5">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm ">{files.document[0].name}</p>
                    </div>
                  </div>
                  <button
                    className="bg-red-500 text-white  px-2 py-1 rounded-md"
                    onClick={handleRemoveDocument}
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
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    size={5 * 1024 * 1024}
                    onChange={(e) => handleFileChange(e, "file")}
                  />
                </label>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PublishContent = () => {
  return (
    <div className="max-w-[1240px] mx-auto mt-20">
      <div className="font-semibold text-2xl mb-8">Publish</div>
      <div className="bg-white border rounded">
        <div className="flex flex-col items-center px-4 py-6 gap-y-10">
          <div className=" text-black_04 gap-10">
            <div className=" flex flex-col items-center justify-between max-w-[60%] mx-auto">
              <p className="font-semibold flex justify-center mb-10 text-lg mx-auto">
                <FiCheckCircle size={80} />
              </p>

              <p className="  text-lg text-center ">
                Congratulations! You're on the brink of completing your first
                Offer. It's currently pending approval by our admin team, which
                typically takes 24 to 36 hours. In the meantime, familiarize
                yourself with our{" "}
                <span className="text-blue-400 cursor-pointer border-b border-b-transparent hover:border-blue-400 ">
                  Privacy Policy
                </span>{" "}
                before you dive into selling on Tieup.
              </p>
            </div>
          </div>
          <div></div>
        </div>
      </div>
    </div>
  );
};
