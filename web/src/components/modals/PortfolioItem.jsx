import React, { useState, useRef, useEffect } from "react";

import { BsChevronCompactLeft, BsChevronCompactRight } from "react-icons/bs";
import {
  BsFillArrowRightCircleFill,
  BsFillArrowLeftCircleFill,
} from "react-icons/bs";
export const PortfolioDisplayItemPopUp = React.memo(
  ({ isVisible, onClose, portfolioItem }) => {
    if (!isVisible) return null;

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
          <div className="  overflow-y-auto px-6 py-5 bg-white rounded-md flex items-center justify-center ">
            <div className="md:w-[700px] max-h-[800px]  ">
              <div className="flex justify-between items-center">
                <div className="font-semibold mb-2 text-xl">Project Title</div>
              </div>
              <div className="mb-4">{portfolioItem.title}</div>
              <div className="font-semibold mb-2 text-xl">
                Project Description
              </div>
              <div className="mb-4">{portfolioItem.description}</div>
              {portfolioItem.link && (
                <>
                  <div className="font-semibold mb-2 text-xl">Project Link</div>
                  <div className="mb-4">{portfolioItem.link}</div>
                </>
              )}

              <CarouselPortfolio project={portfolioItem} />
            </div>
          </div>
        </div>
      </div>
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
