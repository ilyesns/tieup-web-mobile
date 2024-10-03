import React, { useState, useRef, useEffect } from "react";
import { RiArrowRightSLine, RiArrowLeftSLine } from "react-icons/ri";
import { Link } from "react-router-dom";
const CategoryBar = ({ services }) => {
  const navRef = useRef(null);
  const ulRef = useRef(null);

  const scrollLeft = () => {
    if (navRef.current) {
      navRef.current.scrollTo({
        left: navRef.current.scrollLeft - 200,
        behavior: "smooth", // Optional: Adds smooth scrolling animation
      });
    }
  };

  const scrollRight = () => {
    navRef.current.scrollTo({
      left: navRef.current.scrollLeft + 200,
      behavior: "smooth", // Optional: Adds smooth scrolling animation
    });
  };

  return (
    <nav className="bg-white max-w-[1240px]  mx-auto relative">
      <div className="flex items-center font-medium justify-around">
        {/* <div className="z-50  md:w-auto w-full flex justify-between">
         
        </div> */}
        <button
          onClick={scrollLeft}
          className=" hidden md:flex justify-center items-center h-12 w-12  rounded-full hover:bg-gray-300"
        >
          <RiArrowLeftSLine />
        </button>
        <div
          className="     overflow-x-scroll scroll whitespace-nowrap scroll-smooth max-w-screen-lg scrollbar-hide"
          ref={navRef}
        >
          <ul className="flex space-x-2  ">
            <CategoryItems services={services} />
          </ul>{" "}
        </div>

        <button
          onClick={scrollRight}
          className=" hidden md:flex justify-center items-center h-12 w-12  rounded-full hover:bg-gray-300"
        >
          <RiArrowRightSLine />
        </button>
      </div>
    </nav>
  );
};

export const CategoryItems = ({ services }) => {
  const [heading, setHeading] = useState("");
  const [subHeading, setSubHeading] = useState("");
  return services.map((service, index) => {
    return (
      <li key={service.documentRef}>
        <div className="text-left px-3 group ">
          <h1
            className="py-3 text-[12px] flex justify-between w-full text-nowrap items-center  hover:text-primary"
            onClick={() => {
              heading !== service.name
                ? setHeading(service.name)
                : setHeading("");
              setSubHeading("");
            }}
            style={{ flex: "1", overflow: "hidden" }}
          >
            <Link to={`/subservices/${service.documentRef}`}>
              {service.name}
            </Link>
          </h1>
          {service.subServices && service.subServices.length !== 0 && (
            <div>
              <div
                className={
                  index >= 6
                    ? "absolute top-[25px] z-[999]  right-1  hidden group-hover:md:block hover:md:block"
                    : "absolute top-[25px] z-[999] hidden group-hover:md:block hover:md:block"
                }
              >
                <div className="py-3"></div>
                <div className="bg-white p-5 grid grid-cols-3 gap-10">
                  {service.subServices.map((subService) => (
                    <Link
                      key={subService.documentRef}
                      to={`/subservices/${service.documentRef}/offers/${subService.documentRef}`}
                    >
                      <div className="flex flex-col  md:cursor-pointer items-center group">
                        <img
                          src={subService.image}
                          alt=""
                          loading="lazy"
                          className="w-10 h-10 object-cover"
                        />
                        <h1 className="text-[12px] font-semibold group-last:hover:text-primary">
                          {subService.name}
                        </h1>
                        <div className="text-[10px] text-wrap text-gray-600">
                          {subService.description}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </li>
    );
  });
};
export default CategoryBar;
