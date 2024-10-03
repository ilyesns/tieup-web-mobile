import React, { useRef, useState } from "react";
import { SearchUserModal } from "../components/SearchUserModal";
import { CiSearch } from "react-icons/ci";
import Image from "../assets/images/offer.jpg";
import { addService, searchServices, useServices } from "../api/services";
import { Snipper } from "../components/common/Snipper";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { ServiceModal } from "../components/ServiceModal";
import { Toast } from "flowbite-react";
import { HiCheck } from "react-icons/hi2";

export const Services = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data, isLoading, isError } = useServices();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const openToast = () => {
    setShowToast(true);
  };
  const handleToastMessage = (message: string) => {
    setToastMessage(message);
  };
  const [isSearching, setIsSearching] = useState(false);
  const [hasClicked, setHasClicked] = useState(false);
  const [services, setServices] = useState([]);
  const handleSearch = async () => {
    if (searchTerm !== "") {
      try {
        setIsSearching(true);
        setHasClicked(true);
        let res = await searchServices(searchTerm, "token");
        setServices(res);

        setIsSearching(false);
      } catch (e) {
        setIsSearching(false);
      }
    }
  };

  const resetSearch = () => {
    setServices([]);
    setHasClicked(false);
    setSearchTerm("");
  };
  const handleSearchEnter = (e: { key: string }) => {
    if (e.key === "Enter") {
      // Call your search function here
      handleSearch();
    }
  };
  return (
    <>
      <div className="flex flex-row justify-between items-center mb-5">
        <h1 className="text-3xl font-semibold first-letter:uppercase ">
          services
        </h1>

        <div className=" cursor-pointer  flex gap-2 items-center  md:order-1">
          <input
            type="text"
            name="search"
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
            value={searchTerm}
            onKeyDown={handleSearchEnter}
            placeholder="Type to search"
            className="focus:outline-none p-2 w-full cursor-pointer bg-transparent "
          />
          <CiSearch
            onClick={handleSearch}
            size={30}
            className="text-gray-600 cursor-pointer"
          />
        </div>
      </div>
      {isLoading ? (
        <div className="mt-10 w-full flex justify-center">
          <Snipper />
        </div>
      ) : isError ? (
        <div>Something went wrong!</div>
      ) : (
        data && (
          <>
            {isSearching && hasClicked ? (
              <div className="mt-10 w-full flex justify-center">
                <Snipper />
              </div>
            ) : hasClicked && services.length === 0 ? (
              <>
                <div className="w-full flex justify-end">
                  <div
                    onClick={resetSearch}
                    className="bg-secondary mb-5 p-2 text-white rounded-md cursor-pointer"
                  >
                    Close
                  </div>
                </div>
                <div className="mt-10 w-full flex justify-center">
                  No results found.
                </div>
              </>
            ) : hasClicked && services.length > 0 ? (
              <div>
                <div className="w-full flex justify-end">
                  <div
                    onClick={resetSearch}
                    className="bg-secondary mb-5 p-2 text-white rounded-md cursor-pointer"
                  >
                    Close
                  </div>
                </div>
                <ServiceComponents
                  handleToastMessage={handleToastMessage}
                  openToast={openToast}
                  services={services}
                />
              </div>
            ) : (
              <>
                <h4 className="text-lg text-gray-500 mb-5">Services List</h4>
                <ServiceComponents
                  handleToastMessage={handleToastMessage}
                  openToast={openToast}
                  services={data.filter((service: any) => service.isRoot)}
                />
                <h4 className="text-lg text-gray-500 my-5 ">
                  Sub Services List
                </h4>
                <ServiceComponents
                  handleToastMessage={handleToastMessage}
                  openToast={openToast}
                  services={data.filter((service: any) => !service.isRoot)}
                />
              </>
            )}
            <CreationServiceComponent
              handleToastMessage={handleToastMessage}
              openToast={openToast}
              services={data.filter((service: any) => service.isRoot)}
            />{" "}
          </>
        )
      )}
      {showToast && (
        <div className=" fixed bottom-10 left-20 z-30">
          <Toast>
            <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
              <HiCheck className="h-5 w-5" />
            </div>
            <div className="ml-3 text-sm font-normal first-letter:uppercase">
              {toastMessage}
            </div>
            <Toast.Toggle onClick={() => setShowToast(false)} />
          </Toast>
        </div>
      )}
    </>
  );
};

const ServiceComponents = ({
  services,
  handleToastMessage,
  openToast,
}: {
  services: any;
  handleToastMessage: (message: string) => void;
  openToast: () => void;
}) => {
  const [startX, setStartX] = useState<number | null>(null);
  const [scrollLeft, setScrollLeft] = useState<number>(0);
  const [isMouseDown, setIsMouseDown] = useState<boolean>(false);

  const handleStart = (event: React.MouseEvent<HTMLDivElement>) => {
    setStartX(event.pageX - event.currentTarget.offsetLeft);
    setScrollLeft(event.currentTarget.scrollLeft);
    setIsMouseDown(true);
  };

  const handleMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isMouseDown || startX === null) return;
    const x = event.pageX - event.currentTarget.offsetLeft;
    const walk = (x - startX) * 2; // Adjust this multiplier as needed
    event.currentTarget.scrollLeft = scrollLeft - walk;
  };

  const handleEnd = () => {
    setIsMouseDown(false);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    document.body.style.overflow = isModalOpen ? "auto" : "hidden";
  };
  return (
    <>
      {isModalOpen && (
        <ServiceModal
          isModalOpen={isModalOpen}
          toggleModal={toggleModal}
          service={selectedService}
          handleToastMessage={handleToastMessage}
          openToast={openToast}
        />
      )}
      {services && (
        <div
          className="w-full relative select-none	 flex space-x-3 overflow-x-scroll scroll whitespace-nowrap scroll-smooth scrollbar-hide"
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
        >
          {services.map((service: any) => (
            <div
              key={service.documentRef}
              className={`rounded-md w-60 h-48 cursor-pointer bg-white shadow-sm ${
                isMouseDown ? "cursor-grabbing" : ""
              }`}
              onMouseDown={handleStart}
              onMouseUp={handleEnd}
              onClick={() => {
                setSelectedService(service);
                toggleModal();
              }}
            >
              <div
                className={`w-full ${
                  service.isRoot ? "bg-primary " : "bg-secondary "
                } p-4 rounded-md`}
              >
                <img
                  src={service.image}
                  alt="service img"
                  className="w-14 h-14 rounded-md"
                />
                <p className="first-letter:uppercase text-lg mt-5 text-white font-semibold">
                  {service.name}
                </p>
                <p className="first-letter:uppercase  mt-2  text-white line-clamp-2">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export type FormFields = {
  name?: string;
  description?: string;
  topic?: string;
  parentServiceId?: string;
  image: FileList | string;
};
const CreationServiceComponent = ({
  services,
  handleToastMessage,
  openToast,
}: {
  services: any;
  handleToastMessage: (message: string) => void;
  openToast: () => void;
}) => {
  const queryClient = useQueryClient(); // Get the query client instance

  const {
    register,
    handleSubmit,
    setError,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>();
  const parentServiceId = watch("parentServiceId");
  const uploadedFile = watch("image");
  const onSubmit = async (data: any) => {
    // Validate file sizes before submitting
    try {
      const result = await addService(data, "token");
      queryClient.invalidateQueries({ queryKey: ["services"] });
      reset();
      handleToastMessage(result.message);
      openToast();
    } catch (e) {
      setError("root", {
        message: "Something went wrong!",
      });
    }
  };

  return (
    <div className="my-10">
      <h3 className="text-lg text-gray-500">
        Create a new service / sub service
      </h3>
      <div className="w-full border rounded-md p-3 bg-white ">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="username"
            >
              Service Name <span className="text-red-500">*</span>
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              aria-invalid={errors.name ? "true" : "false"}
              placeholder="Type your service name"
              {...register("name", { required: true })}
            />
            {errors.name?.type === "required" && (
              <div className="text-red-500">This field is required</div>
            )}
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Describe your service <span className="text-red-500">*</span>
            </label>
            <textarea
              className="shadow h-28 resize-none appearance-none border  rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="description"
              aria-invalid={errors.description ? "true" : "false"}
              placeholder="Write a short  description of what service offers."
              {...register("description", {
                required: "This field is required",
              })}
            />
            {errors.description && (
              <div className="text-red-500">This field is required</div>
            )}
          </div>
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Please choose either a service parent from the dropdown or keep it
            at the service root level <span className="text-red-500">*</span>
          </label>
          <select
            id="categories"
            {...register("parentServiceId", { required: false })}
            className="bg-gray-50 border w-1/2 h-10 border-gray-300 mb-4 text-gray-900 text-sm rounded-sm  block p-2.5"
          >
            <option value="">Please select..</option>
            {services.map((service: any) => (
              <option key={service.documentRef} value={service.documentRef}>
                {service.name}
              </option>
            ))}
          </select>

          {parentServiceId && (
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="topic"
              >
                Topic
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="topic"
                type="text"
                placeholder="Please insert the topic here"
                {...register("topic", {
                  required: "This field is required",
                })}
              />
              {errors.topic && (
                <div className="text-red-500">{errors.topic.message!}</div>
              )}
            </div>
          )}
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-30 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 0 hover:bg-gray-100 "
            >
              {uploadedFile && uploadedFile![0] ? (
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <div className="flex flex-col justify-center items-center">
                    <img
                      src={URL.createObjectURL(uploadedFile[0] as Blob)}
                      alt=""
                      className="w-44 h-auto rounded-lg shadow-xl"
                    />

                    <hr />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 16"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                    />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    SVG, PNG, JPG or GIF
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Max size per image/video:{" "}
                    <span className="font-bold">50MB</span>
                  </p>
                </div>
              )}
              <input
                id="dropzone-file"
                type="file"
                className="hidden"
                accept="image/*"
                {...register("image", {
                  required: "This field is required",
                })}
              />
            </label>
          </div>
          {errors.image && (
            <div className="text-red-500">{errors.image.message!}</div>
          )}

          <div className="flex items-center justify-end">
            <button
              disabled={isSubmitting}
              className="bg-primary mt-5 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              {isSubmitting ? "Adding..." : "Add Service "}
            </button>
          </div>
          {errors.root && (
            <div className="text-red-500">{errors.root.message}</div>
          )}
        </form>
      </div>
    </div>
  );
};
