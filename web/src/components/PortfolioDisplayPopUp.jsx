import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../hooks/auth_context";
import { useQueryClient } from "@tanstack/react-query";
import {
  addPortfolioItem,
  deletePortfolioItem,
} from "../apis/freelancer_portfolio";
import { BsChevronCompactLeft, BsChevronCompactRight } from "react-icons/bs";
import DeleteModal from "./common/DeleteModal";
import {
  BsFillArrowRightCircleFill,
  BsFillArrowLeftCircleFill,
} from "react-icons/bs";
export const PortfolioDisplayPopUp = React.memo(
  ({ isVisible, onClose, portfolioItem }) => {
    const { currentUser } = useAuth();
    const queryClient = useQueryClient();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const openModal = () => {
      setShowDeleteModal(true);
    };

    const closeModal = () => {
      setShowDeleteModal(false);
    };
    const onDelete = async () => {
      try {
        setIsLoading(true);
        const data = {
          freelancerId: currentUser.userId,
          itemId: portfolioItem.portfolioItemId,
        };
        await deletePortfolioItem(data, currentUser.accessToken);
        queryClient.invalidateQueries([
          "freelancerPortfolio",
          currentUser.userId,
        ]);
        onClose();
        setIsLoading(false);
      } catch (e) {
        console.log(e);
        setIsLoading(false);
      }
    };
    if (!isVisible) return null;

    return (
      <>
        <DeleteModal
          showModal={showDeleteModal}
          closeModal={closeModal}
          onDelete={onDelete}
          loading={isLoading}
        />
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
            <div className="  overflow-y-auto px-6 py-5 bg-white rounded-md flex items-center justify-center ">
              <div className="md:w-[700px] max-h-[800px]  ">
                <div className="flex justify-between items-center">
                  <div className="font-semibold mb-2 text-xl">
                    Project Title
                  </div>
                  <div className="cursor-pointer" onClick={openModal}>
                    <svg
                      className="text-red-400 w-11 h-11 mb-3.5 mx-auto"
                      aria-hidden="true"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                <div className="mb-4">{portfolioItem.title}</div>
                <div className="font-semibold mb-2 text-xl">
                  Project Description
                </div>
                <div className="mb-4">{portfolioItem.description}</div>
                {portfolioItem.link && (
                  <>
                    <div className="font-semibold mb-2 text-xl">
                      Project Link
                    </div>
                    <div className="mb-4">{portfolioItem.link}</div>
                  </>
                )}

                <CarouselPortfolio project={portfolioItem} />
              </div>
            </div>
          </div>
        </div>{" "}
      </>
    );
  }
);

function CarouselPortfolio({ project }) {
  let items = [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    setFade(true);
    const timeout = setTimeout(() => {
      setFade(false);
    }, 500); // Set the timeout duration to match the duration of your fade-out transition
    return () => clearTimeout(timeout);
  }, [currentIndex]);

  if (project) {
    // Check if portfolio item contains images
    if (project.images && project.images.length > 0) {
      items = project.images;
    }

    // Check if portfolio item contains video
    if (project.videos) {
      items = items.concat(project.videos);
    }
  }

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? items.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const isLastSlide = currentIndex === items.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  /**
   *   <div
          style={{ backgroundImage: `url(${items[currentIndex].url})` }}
          className="w-full h-full rounded-md bg-center aspect-square object-cover bg-cover duration-500"
        ></div>
   */
  return (
    <div className="w-full  relative group ">
      <div
        className={`transition-opacity ${fade ? "opacity-0" : "opacity-100"}`}
      >
        {items[currentIndex].type.includes("image") ? (
          <img
            src={items[currentIndex].url}
            alt=""
            className="w-full h-full rounded-md bg-center aspect-auto object-cover mb-5 duration-500"
          />
        ) : (
          <video
            className="w-full h-full rounded-md object-cover"
            src={items[currentIndex].url}
            controls
          ></video>
        )}
      </div>
      {/* Left Arrow */}
      {items.length > 1 && (
        <>
          {currentIndex !== 0 && (
            <div className="hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] left-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer">
              <BsChevronCompactLeft onClick={prevSlide} size={30} />
            </div>
          )}
          {/* Right Arrow */}
          {currentIndex !== items.length - 1 && (
            <div className="hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] right-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer">
              <BsChevronCompactRight onClick={nextSlide} size={30} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
