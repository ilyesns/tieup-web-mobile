import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../hooks/auth_context";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { addPortfolioItem } from "../apis/freelancer_portfolio";
export const PortfolioPopUp = React.memo(({ isVisible, onClose }) => {
  const { currentUser } = useAuth();
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();
  const [uploadedFiles, setUploadedFiles] = useState([]); // State to track uploaded files
  let [filesError, setFilesError] = useState("");
  const queryClient = useQueryClient(); // Get the query client instance
  if (!isVisible) return null;

  const onSubmit = async (data) => {
    // Validate file sizes before submitting
    let hasError = false;

    if (uploadedFiles.length < 1) {
      setFilesError("Upload at list one file.");

      return;
    } else {
      setFilesError("");
    }

    if (hasError) {
      // Display error message for file size exceeding 50MB
      setFilesError("File size should be less than 50MB.");
    } else {
      // Proceed with form submission

      try {
        const portfolioItem = {
          ...data,
          videos: separateFilesByType(uploadedFiles).videos,
          images: separateFilesByType(uploadedFiles).images,
          freelancerId: currentUser.userId,
        };
        await addPortfolioItem(portfolioItem, currentUser.accessToken);
        setUploadedFiles([]);
        queryClient.invalidateQueries([
          "freelancerPortfolio",
          currentUser.userId,
        ]);

        reset();
        onClose();
      } catch (e) {
        setError("root", {
          message: "Something went wrong!",
        });
      }
    }
  };

  const separateFilesByType = (filesArray) => {
    const images = [];
    const videos = [];

    filesArray.forEach((file) => {
      const fileType = file.type.split("/")[0]; // Get the file type (image or video)
      if (fileType === "image") {
        images.push(file);
      } else if (fileType === "video") {
        videos.push(file);
      }
    });

    return { images, videos };
  };

  const handleFileChange = (event) => {
    const fileList = event.target.files;
    const filesArray = Array.from(fileList);
    let hasError = false;
    for (let i = 0; i < fileList.length; i++) {
      if (filesArray[i].size > 50 * 1024 * 1024) {
        // Convert MB to bytes
        hasError = true;
        break;
      }
    }

    if (hasError) {
      // Display error message for file size exceeding 10MB
      setFilesError("File size should be less than 10MB.");
    } else {
      // Proceed with form submission
      setFilesError("");

      setUploadedFiles(filesArray);
    }
  };

  const handleRemoveFile = (index) => {
    const newFiles = [...uploadedFiles];
    newFiles.splice(index, 1);
    setUploadedFiles(newFiles);
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
        <div className="w-full md:w-[700px] min-h-[600px] px-6 py-5 bg-white rounded-md flex items-center justify-center ">
          <div className="w-full h-full">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  for="username"
                >
                  Project Title <span className="text-red-500">*</span>
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="title"
                  type="text"
                  name="title"
                  aria-invalid={errors.title ? "true" : "false"}
                  placeholder="Type your project title"
                  {...register("title", { required: true })}
                />
                {errors.title?.type === "required" && (
                  <div className="text-red-500">This field is required</div>
                )}
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  for="password"
                >
                  Describe your work <span className="text-red-500">*</span>
                </label>
                <textarea
                  className="shadow h-28 resize-none appearance-none border  rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="description"
                  type="text"
                  name="description"
                  aria-invalid={errors.description ? "true" : "false"}
                  placeholder="Write a short  description of what you did in this project."
                  {...register("description", {
                    required: "This field is required",
                  })}
                />
                {errors.description && (
                  <div className="text-red-500">This field is required</div>
                )}
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  for="username"
                >
                  Link
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="link"
                  name="link"
                  type="text"
                  placeholder="Please insert the link here, such as 'https://github.com/'."
                  {...register("link", {
                    pattern: {
                      value: /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/,
                      message: "Invalid URL",
                    },
                  })}
                />
                {errors.link && (
                  <div className="text-red-500">{errors.link.message}</div>
                )}
              </div>
              <div className="flex items-center justify-center w-full">
                <label
                  for="dropzone-file"
                  className="flex flex-col items-center justify-center w-full h-30 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                >
                  {uploadedFiles.length > 0 ? (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {uploadedFiles.map((file, index) => (
                        <div
                          className="flex flex-col justify-center items-center"
                          key={index}
                        >
                          <p>File Name: {file.name}</p>
                          <button
                            className="bg-secondary p-1 mb-1 text-xs text-center w-12 text-white rounded-md"
                            onClick={() => handleRemoveFile(index)}
                          >
                            Remove
                          </button>

                          <hr />
                        </div>
                      ))}
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
                        Max size per image/video:{" "}
                        <span className="font-bold">50MB</span>
                      </p>
                    </div>
                  )}
                  <input
                    id="dropzone-file"
                    type="file"
                    className="hidden"
                    name="files"
                    multiple
                    accept="image/*,video/*"
                    disabled={uploadedFiles.length > 0}
                    onChange={handleFileChange}
                  />
                </label>
              </div>
              {filesError && (
                <div className="text-red-500 text-xs mt-1">{filesError}</div>
              )}

              <div className="flex items-center justify-end">
                <button
                  disabled={isSubmitting}
                  className="bg-primary mt-5 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="submit"
                >
                  {isSubmitting ? "Saving..." : "Save & Publish"}
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
});
