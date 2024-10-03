import React, { useRef, useState } from "react";
import { RiArrowRightSLine, RiArrowLeftSLine } from "react-icons/ri";
import { OfferItem } from "./OfferItem";
import { Link } from "react-router-dom";

export const Slide = ({ data }) => {
  const sliderRef = useRef(null);

  const slideLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollLeft -= 600;
    }
  };

  const slideRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollLeft += 600;
    }
  };

  return (
    <div className="relative flex gap-3 items-center mx-auto lg:w-[1200px] w-10/12">
      <RiArrowLeftSLine
        className="opacity-50 cursor-pointer w-40 hover:opacity-100"
        onClick={slideLeft}
        size={40}
      />
      <div
        ref={sliderRef}
        className="flex-grow h-[450px] overflow-x-scroll scroll whitespace-nowrap scroll-smooth scrollbar-hide"
      >
        {data &&
          data.map((offerData) => {
            return (
              <OfferItem key={offerData.offer.documentRef} data={offerData} />
            );
          })}
      </div>
      <RiArrowRightSLine
        className="opacity-50 cursor-pointer w-40 hover:opacity-100"
        onClick={slideRight}
        size={40}
      />
    </div>
  );
};
