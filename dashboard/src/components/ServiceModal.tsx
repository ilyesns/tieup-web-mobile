import React, { useState } from "react";
import { searchUsers } from "../api/users";
import { Tab } from "../pages/Customers";
import { Snipper } from "./common/Snipper";
import { FormFields } from "../pages/Services";
import { useForm } from "react-hook-form";
import { deleteService, updateService, useServices } from "../api/services";
import { useQueryClient } from "@tanstack/react-query";
import { Toast } from "flowbite-react";
import { HiCheck, HiExclamation, HiX } from "react-icons/hi";

export const ServiceModal = ({
  toggleModal,
  isModalOpen,
  service,
  handleToastMessage,
  openToast,
}: {
  isModalOpen: boolean;
  toggleModal: () => void;
  service: any;
  handleToastMessage: (message: string) => void;
  openToast: () => void;
}) => {
  const queryClient = useQueryClient(); // Get the query client instance

  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    defaultValues: {
      name: service.name || "",
      description: service.description || "",
      image: service.image || null,
      parentServiceId: service.parentServiceId || null,
      topic: service.topic || "",
    },
  });
  const parentServiceId = watch("parentServiceId");
  const uploadedFile = watch("image");
  const [isDeleting, setIsDeleting] = useState(false);
  const { data, isLoading, isError } = useServices();

  const onSubmit = async (data: any) => {
    const serviceData = {
      ...data,
      serviceId: service.documentRef,
    };
    try {
      const result = await updateService(serviceData, "token");
      queryClient.invalidateQueries({ queryKey: ["services"] });
      toggleModal();
      handleToastMessage(result.message);
      openToast();
    } catch (e) {
      setError("root", {
        message: "Something went wrong!",
      });
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const result = await deleteService(service.documentRef, "token");
      queryClient.invalidateQueries({ queryKey: ["services"] });
      setIsDeleting(false);
      toggleModal();
      handleToastMessage(result.message);
      openToast();
    } catch (e) {
      setIsDeleting(false);

      setError("root", {
        message: "Something went wrong!",
      });
    }
  };

  return (
    <>
      {isModalOpen && (
        <div
          id="default-modal"
          tabIndex={-1}
          aria-hidden="true"
          className="fixed top-0 right-0 left-0 z-50 flex items-center justify-center w-full h-full overflow-y-auto overflow-x-hidden bg-gray-800 bg-opacity-50"
        >
          <div className="relative p-4 w-full max-w-[1240px]">
            <div className="relative w-full bg-white rounded-lg shadow p-4 ">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                  <div className="flex justify-between items-center">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="username"
                    >
                      Service Name <span className="text-red-500">*</span>
                    </label>
                    <div onClick={toggleModal} className="mb-2 cursor-pointer">
                      X
                    </div>
                  </div>
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
                    Describe your service{" "}
                    <span className="text-red-500">*</span>
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
                {service.isRoot ? (
                  <div className="my-5 w-full text-center">
                    This is the service root and cannot be designated as a
                    sub-service.
                  </div>
                ) : (
                  <>
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="password"
                    >
                      Please choose either a service parent from the dropdown or
                      keep it at the service root level{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="categories"
                      {...register("parentServiceId", { required: true })}
                      className="bg-gray-50 border w-1/2 h-10 border-gray-300 mb-4 text-gray-900 text-sm rounded-sm  block p-2.5"
                    >
                      <option value="">Please select..</option>
                      {data
                        .filter((service: any) => service.isRoot)
                        .map((service: any) => (
                          <option
                            key={service.documentRef}
                            value={service.documentRef}
                          >
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
                          <div className="text-red-500">
                            {errors.topic.message!}
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}

                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="dropzone-file"
                    className="flex flex-col items-center justify-center w-full h-30 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 0 hover:bg-gray-100 "
                  >
                    {typeof uploadedFile == "string" ? (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <div className="flex flex-col justify-center items-center">
                          <img
                            src={uploadedFile}
                            alt=""
                            className="w-44 h-auto rounded-lg shadow-xl"
                          />

                          <hr />
                        </div>
                      </div>
                    ) : uploadedFile && uploadedFile![0] ? (
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
                          <span className="font-semibold">Click to upload</span>{" "}
                          or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          SVG, PNG, JPG or GIF
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Max size per image:{" "}
                          <span className="font-bold">50MB</span>
                        </p>
                      </div>
                    )}
                    <input
                      id="dropzone-file"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      {...register("image", {})}
                    />
                  </label>
                </div>
                {errors.image && (
                  <div className="text-red-500">{errors.image.message!}</div>
                )}
                {errors.root && (
                  <div className="text-red-500">{errors.root.message}</div>
                )}
                <div className="flex items-center justify-between">
                  <button
                    disabled={isDeleting}
                    onClick={handleDelete}
                    className="bg-secondary mt-5 hover:bg-red-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    {isDeleting ? "Deleting..." : "Delete "}
                  </button>
                  <button
                    disabled={isSubmitting || uploadedFile.length < 1}
                    className="bg-primary mt-5 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="submit"
                  >
                    {isSubmitting ? "Updating..." : "Update "}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
