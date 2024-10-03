import { FaStar } from "react-icons/fa";
import Landing3 from "../../assets/images/landing3.jpg";
import { CarouselOfferArrows } from "../../pages/Profile";
import { Link } from "react-router-dom";

export const OfferItem = ({ data }) => {
  return (
    <div className="inline-block group ">
      <div className="flex flex-col w-[300px] h-[400px]  mr-2  items-start justify-start  border-gray-300_02 border border-solid bg-white-A700 overflow-hidden">
        <div className="w-full relative">
          <div className=" rounded-lg h-[200px]  w-full">
            <CarouselOfferArrows
              key={data.offer.documentRef}
              gallery={data.offer.gallery}
            />
          </div>
          <Link
            to={`/subservices/${data.offer.serviceId}/offers/${data.offer.subServiceId}/offer/${data.offer.offerId}`}
          >
            <div className="flex flex-row justify-between  mx-2 mt-6">
              <div className="flex gap-2 justify-center items-center ">
                <img
                  src={data.user.photoURL ? data.user.photoURL : Landing3}
                  style={{ width: "30px", height: "30px", borderRadius: "50%" }}
                />
                <div className="text-sm first-letter:uppercase">
                  {data.user.username ? data.user.username : "username"}
                </div>
              </div>
              <div className="text-sm first-letter:uppercase">
                {data.levelUser.sellerLevel}
              </div>
            </div>
            <div className="mx-2 mt-6">
              <div className=" mt-2 border-b-transparent line-clamp-2 group-hover:border-b-gray-500">
                {data.offer.title}
              </div>

              <div className="my-2 font-bold flex items-center gap-1">
                <p>From</p>
                <p className="ml-3">{data.offer.basicPlan.price}</p>
                <p>TND</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};
