import React from "react";
import { FaFacebook } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";
import { MdLanguage } from "react-icons/md";
import { Link } from "react-router-dom";

export default function Footer({ services }) {
  return (
    <footer className=" pt-[23px] pb-6 px-6 bg-white border-t border-solid bg-white-A700">
      <div className=" max-w-[1240px] mx-auto ">
        <div className="flex flex-col items-center justify-center w-full gap-2 ">
          <div className="flex flex-row justify-center w-full">
            <div className="flex flex-col items-center justify-start w-full">
              <div className="w-full flex flex-wrap md:flex-row justify-between  md:justify-between ">
                <div className="flex flex-col items-start justify-start  py-[3px]">
                  <div className="flex flex-col items-start justify-start w-full mb-[37px] gap-[21px]">
                    <a href="#">
                      <h1 className="text-2xl font-bold">Categories</h1>
                    </a>
                    <div className="flex flex-col items-center justify-start w-full">
                      <ul className="flex flex-col items-start justify-center w-full gap-[19px]">
                        {services.map((service) => {
                          return (
                            <FooterItem
                              key={service.documentRef}
                              name={service.name}
                              reference={`/subservices/${service.documentRef}`}
                            />
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-start justify-start  gap-[22px]">
                  <h1 className="text-2xl font-bold">About</h1>
                  <div className="flex flex-col items-center justify-start w-full mb-[38px]">
                    <div className="flex flex-col items-start justify-start w-full">
                      <ul className="flex flex-col items-start justify-start gap-[19px]">
                        <FooterItem name={"Contact Us"} />
                        <FooterItem
                          name={"Privacy Policy"}
                          reference={"/privacy"}
                        />
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-px w-full bg-gray-300_02" />
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center w-[98%]">
            <div className="flex flex-row justify-start items-end w-full  md:w-[23%] gap-6 py-1">
              <div className="flex flex-row justify-center ">
                <h1 className="my-0.5 text-gray-600">© Tie-up Tunisia. 2024</h1>
              </div>
            </div>
            <div className="flex flex-row justify-center items-center  w-full md:w-[33%] pt-4">
              <div className="flex flex-row justify-start md:w-[55%] gap-7">
                <div className="flex flex-col items-center justify-center h-7 w-7  hover:bg-gray-400 rounded">
                  <a
                    target="_blank"
                    href="https://www.facebook.com/startieup?paipv=0&eav=AfZQwwCSxWKeH677Uxa9UDw9rmnHlKEbBmI34E083jjS_XtLcy3cvwjxxpFcE54kNko&_rdr"
                  >
                    <FaFacebook size={20} className="text-gray-600" />
                  </a>
                </div>

                <div className="flex flex-col items-center justify-center  h-7 w-7  hover:bg-gray-400 rounded">
                  <a
                    href="https://www.linkedin.com/company/tieup-holding "
                    target="_blank"
                  >
                    {" "}
                    <FaLinkedin size={20} className="text-gray-600" />
                  </a>
                </div>

                <div className="h-5 w-5 relative"></div>
              </div>
              <div className="flex flex-row justify-center items-center w-[46%]">
                <div className="flex flex-row justify-evenly w-[47%] gap-2 py-2.5">
                  <div className="flex items-center p-4   ">
                    <MdLanguage size={20} className="text-gray-600" />
                    <p className="pl-2 font-bold text-gray-600">English</p>
                  </div>
                </div>
                <h1 className=" mx-6 md:mx-4 text-gray-600">TND</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

const FooterItem = ({ name, reference }) => {
  return (
    <div>
      <Link to={reference}>
        <h1 className="text-[16.5px]  border-b border-transparent text-gray-600 hover:border-b hover:border-gray-600 ease-in-out duration-300">
          {name}
        </h1>
      </Link>
    </div>
  );
};
