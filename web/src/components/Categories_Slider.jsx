import React, { useState, useRef } from "react";
import { RiArrowRightSLine, RiArrowLeftSLine } from "react-icons/ri";

export const categoriesData = [
  {
    name: "Category 1",
    image: "category1.jpg",
    subcategories: ["Subcategory 1-1", "Subcategory 1-2", "Subcategory 1-3"],
  },
  { name: "Category 2", image: "category2.jpg" },
  { name: "Category 3", image: "category2.jpg" },
  { name: "Category 4", image: "category2.jpg" },
  { name: "Category 5", image: "category2.jpg" },
  { name: "Category 6", image: "category2.jpg" },
  { name: "Category 7", image: "category2.jpg" },
  { name: "Category 8", image: "category2.jpg" },
  { name: "Category 9", image: "category2.jpg" },
  { name: "Category 10", image: "category2.jpg" },
  { name: "Category 11", image: "category2.jpg" },
  // Add more categories as needed
];

const CategoriesSlider = ({ setHoveredCategory, setHoveredSubcategory }) => {
  const containerRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  const handleScroll = () => {
    const { scrollLeft, clientWidth, scrollWidth } = containerRef.current;
    const maxScroll = scrollWidth - clientWidth;
    setScrollPosition(scrollLeft >= maxScroll ? maxScroll : scrollLeft);
  };

  const handlePrev = () => {
    setScrollPosition((prevPosition) => Math.max(prevPosition - 300, 0)); // Adjust as needed
  };

  const handleNext = () => {
    setScrollPosition((prevPosition) => {
      const { clientWidth, scrollWidth } = containerRef.current;
      const maxScroll = scrollWidth - clientWidth;
      return Math.min(prevPosition + 300, maxScroll);
    });
  };

  return (
    <div className="relative max-w-[1260px] mx-auto overflow-x-scroll whitespace-nowrap scroll-smooth scrollbar-hide">
      {scrollPosition > 0 && (
        <div className="absolute inset-y-0 left-[-1px] z-10 flex items-center">
          <RiArrowLeftSLine
            className="text-1xl text-black cursor-pointer"
            onClick={handlePrev}
          />
        </div>
      )}
      {scrollPosition < (categoriesData.length - 1) * 300 && (
        <div className="absolute inset-y-0 right-[-1px] z-10 flex items-center">
          <RiArrowRightSLine
            className="text-1xl text-black cursor-pointer"
            onClick={handleNext}
          />
        </div>
      )}
      <div
        className="relative flex gap-4 p-1"
        ref={containerRef}
        onScroll={handleScroll}
      >
        {categoriesData.map((category, index) => (
          <div
            key={index}
            className="flex-none w-36 cursor-pointer relative inline-block group"
            onMouseEnter={() => {
              setHoveredCategory(category.name);
            }}
            onMouseLeave={() => setHoveredCategory(null)}
          >
            <p className="text-center text-black m-0">{category.name}</p>
            {category.subcategories && category.subcategories.length > 0 && (
              <div className="absolute top-full left-0 bg-black p-2 hidden group-hover:block">
                <ul className="text-black">
                  {category.subcategories.map((subcategory, subIndex) => (
                    <li
                      key={subIndex}
                      onMouseEnter={() => setHoveredSubcategory(subcategory)}
                      onMouseLeave={() => setHoveredSubcategory(null)}
                    >
                      {subcategory}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const SubcategoryHover = ({ hoveredSubcategory }) => (
  <div className="absolute z-[1000] top-8 left-1/4 ml-52 max-w-[1240px] h-40">
    <div className="bg-white w-[500px] mx-auto shadow-md">
      {hoveredSubcategory && (
        <p className="text-black m-0">{hoveredSubcategory}</p>
      )}
    </div>
  </div>
);

export { CategoriesSlider, SubcategoryHover };
