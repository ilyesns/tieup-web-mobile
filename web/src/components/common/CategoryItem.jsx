export const CategoryItem = ({ service }) => {
  return (
    <div className="flex flex-col justify-center items-center group cursor-pointer">
      <img
        src={service.image}
        className="w-36 h-36 mb-2 object-cover rounded-md"
        alt=""
      />
      <span className="border-b-2  w-[30%] group-hover:border-b-[#0074E9] group-hover:w-[50%] ease-in-out duration-300"></span>
      <div className="text-[16px] text-center">{service.name}</div>
    </div>
  );
};
