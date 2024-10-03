import React, { useEffect, useRef, useState } from "react";
import Footer from "../components/Footer";
import { useServices } from "../apis/services";
import {
  BASE_URL,
  LANGUAGES,
  YEARS,
  extractRootServices,
  maxDate,
} from "../util";
import { useAuth } from "../hooks/auth_context";
import NavbarAuth from "../components/NavBarAuth";
import Avatar from "../assets/images/avatar.png";
import { Carousel, IconButton } from "@material-tailwind/react";
import ReactPlayer from "react-player";
import { IoCameraOutline } from "react-icons/io5";
import {
  updateFreelancerField,
  uploadPhoto,
  useFreelancerDetails,
  useGetUser,
} from "../apis/user_api";
import { RxDotFilled } from "react-icons/rx";

import { useFreelancerPortfolio } from "../apis/freelancer_portfolio";
import { MdOutlineEdit } from "react-icons/md";
import { useQueryClient } from "@tanstack/react-query";
import Desktop from "../assets/images/desktop.jpg";
import { MdDeleteOutline } from "react-icons/md";
import UpdateProfile from "../components/modals/UpdateProfile";
import { CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { MdOutlineImageNotSupported } from "react-icons/md";
import { PortfolioPopUp } from "../components/PortfolioPopUp";
import { BsChevronCompactLeft, BsChevronCompactRight } from "react-icons/bs";
import { PortfolioDisplayPopUp } from "../components/PortfolioDisplayPopUp";

export const EditProfilePage = () => {
  const modelNavRef = React.useRef(null);
  const [nav, setNav] = useState(false);
  const { isLoading, error, data } = useServices();
  const { currentUser } = useAuth();
  const user = useGetUser(currentUser.userId, currentUser.accessToken);
  const [showModal, setShowModal] = useState(false);
  const freelancerData = useFreelancerDetails(currentUser.userId);
  let [userData, setUserData] = useState([]);
  const navigate = useNavigate();
  const queryClient = useQueryClient(); // Get the query client instance

  useEffect(() => {
    if (user.data) {
      setUserData(user.data);
    }
  }, [user.data]);
  if (isLoading) return <div />;
  if (error) return <div>An error occurred while fetching the user data </div>;
  const services = extractRootServices(data);

  const openModal = () => {
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
  };

  const updateDescription = async (description) => {
    try {
      const userData = {
        description: description,
      };
      await updateFreelancerField(
        userData,
        currentUser.userId,
        currentUser.accessToken
      );
      queryClient.invalidateQueries(["currentUser", user.userId]);
    } catch (e) {}
  };
  const updateSkills = async (skills) => {
    try {
      const userData = {
        skills: skills,
      };
      await updateFreelancerField(
        userData,
        currentUser.userId,
        currentUser.accessToken
      );
      queryClient.invalidateQueries(["currentUser", user.userId]);
    } catch (e) {}
  };
  const updateLanguages = async (languages) => {
    try {
      const userData = {
        languages: languages,
      };
      await updateFreelancerField(
        userData,
        currentUser.userId,
        currentUser.accessToken
      );
      queryClient.invalidateQueries(["currentUser", user.userId]);
    } catch (e) {}
  };
  const updateEducations = async (educations) => {
    try {
      const userData = {
        educations: educations,
      };
      await updateFreelancerField(
        userData,
        currentUser.userId,
        currentUser.accessToken
      );
      queryClient.invalidateQueries(["currentUser", user.userId]);
    } catch (e) {}
  };
  const updateCertifications = async (certifications) => {
    try {
      const userData = {
        certifications: certifications,
      };
      await updateFreelancerField(
        userData,
        currentUser.userId,
        currentUser.accessToken
      );
      queryClient.invalidateQueries(["currentUser", user.userId]);
    } catch (e) {}
  };

  return (
    <div className="bg-gray-50">
      <UpdateProfile isVisible={showModal} onClose={closeModal} />

      <NavbarAuth
        modelNavRef={modelNavRef}
        nav={nav}
        setNav={setNav}
        services={services}
        user={currentUser}
      />

      <div className="max-w-[1240px] flex flex-col md:flex-row md:items-start mx-auto my-20">
        <div className=" md:w-1/3 mr-32 flex flex-col   ">
          <div className="w-full flex flex-col items-center gap-y-5 border py-10 bg-white shadow-full ">
            <Photo user={userData} />
            <div className="flex gap-x-2 items-center">
              <p className="font-bold first-letter:uppercase text-xl">
                {userData.firstName + " " + userData.lastName}
              </p>
              <MdOutlineEdit
                size={20}
                onClick={() => openModal()}
                className="cursor-pointer text-gray-600"
              />
            </div>
          </div>
          {freelancerData.isLoading ? (
            <CircularProgress />
          ) : freelancerData.error ? (
            <div>error </div>
          ) : (
            <>
              <div className="w-full mt-10  border py-5 px-3 bg-white shadow-full ">
                <Portfolio currentUser={currentUser} />
              </div>
              <div className="w-full flex flex-col mt-10 items-center gap-y-5 border py-5 px-3 bg-white shadow-full ">
                <Description
                  initialDescription={freelancerData?.data?.description || ""}
                  onUpdate={updateDescription}
                />
                <div className="w-full h-[1px] bg-gray-600 opacity-55" />

                <Languages
                  initialLanguages={freelancerData?.data?.languages || []}
                  onUpdate={updateLanguages}
                />
                <div className="w-full h-[1px] bg-gray-600 opacity-55" />

                <Skills
                  initialSkills={freelancerData?.data?.skills || []}
                  onUpdate={updateSkills}
                />
                <div className="w-full h-[1px] bg-gray-600 opacity-55" />

                <Education
                  initialEducation={freelancerData?.data?.educations || []}
                  onUpdate={updateEducations}
                />
                <div className="w-full h-[1px] bg-gray-600 opacity-55" />

                <Certification
                  initialCertifications={
                    freelancerData?.data?.certifications || []
                  }
                  onUpdate={updateCertifications}
                />
              </div>
            </>
          )}
        </div>

        <div className="md:2/3 w-full">
          <div className="w-full flex flex-col items-center gap-y-5 border py-10 bg-white shadow-full ">
            <div className="flex flex-col justify-center items-center gap-3">
              <img
                src={Desktop}
                alt="landing page 3"
                className="w-80 h-32 rounded"
              />
              {userData.isBeenFreelancer ? (
                <>
                  <div className="text-black_04  text-[17px] ">
                    Ready to earn on your own terms
                  </div>
                  <button
                    onClick={() => navigate("/personal_info")}
                    className="bg-primary py-2 px-4 text-white rounded-sm hover:shadow-xs  text-lg"
                  >
                    Go to your professional profile
                  </button>
                </>
              ) : (
                <>
                  <div className="text-black_04  text-[17px] ">
                    Ready to earn on your own terms
                  </div>
                  <button
                    onClick={() => navigate("/become_seller")}
                    className="bg-primary py-2 px-4 text-white rounded-sm hover:shadow-xs  text-lg"
                  >
                    Become a seller
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer services={services} />
    </div>
  );
};
const Portfolio = ({ currentUser }) => {
  const [showPortfolio, setShowPortfolio] = useState(false);
  const portfolioData = useFreelancerPortfolio(currentUser.userId);
  const [displayPortfolio, setDisplayPortfolio] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const openPortfolioPopUp = () => {
    setShowPortfolio(true);
  };

  const closePortfolioPopUp = () => {
    setShowPortfolio(false);
  };
  const openDisPortfolioPopUp = (project) => {
    setSelectedItem(project);
    setDisplayPortfolio(true);
  };

  const closeDisPortfolioPopUp = () => {
    setDisplayPortfolio(false);
    setSelectedItem(null);
  };

  const portfolioItemCount = portfolioData.data?.portfolioItems?.length || 0;
  const remainingCells = 4 - portfolioItemCount;

  return (
    <div className="w-full">
      {showPortfolio && (
        <PortfolioPopUp
          isVisible={showPortfolio}
          onClose={closePortfolioPopUp}
        />
      )}
      {displayPortfolio && (
        <PortfolioDisplayPopUp
          isVisible={displayPortfolio}
          onClose={closeDisPortfolioPopUp}
          portfolioItem={selectedItem}
        />
      )}
      <p className="font-bold mb-5">My portfolio</p>

      <div className="grid grid-cols-2 gap-3">
        {portfolioData.data &&
          portfolioData.data.portfolioItems.map((project, index) => (
            <div
              onClick={() => {
                openDisPortfolioPopUp(project);
              }}
              key={index}
              className="cursor-pointer"
            >
              <CarouselPortfolio project={project} />
            </div>
          ))}
        {/* Add Project option */}
        {remainingCells > 0 && (
          <div
            onClick={openPortfolioPopUp}
            className={`flex justify-center items-center w-full h-28  cursor-pointer bg-white shadow-xl rounded-md ${
              remainingCells === 1 ? "col-span-1" : "col-span-1"
            }`}
          >
            <div className="flex flex-col items-center gap-y-2 text-primary font-semibold">
              <p>+</p>
              <p>Add a Project</p>
            </div>
          </div>
        )}
        {/* Empty widgets */}
        {Array.from({
          length: remainingCells > 0 ? remainingCells - 1 : 0,
        }).map((_, index) => (
          <div
            key={`empty-${index}`}
            className="flex justify-center items-center w-full h-28 bg-slate-50 rounded-r-sm"
          >
            <div className="flex flex-col items-center gap-y-2">
              <MdOutlineImageNotSupported
                size={30}
                className="text-slate-300"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

function CarouselPortfolio({ project }) {
  let items = [];
  const [currentIndex, setCurrentIndex] = useState(0);

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

  return (
    <div className="w-full h-28 relative group">
      {items[currentIndex].type.includes("image") ? (
        <div
          style={{ backgroundImage: `url(${items[currentIndex].url})` }}
          className="w-full h-full rounded-md bg-center bg-cover duration-500"
        ></div>
      ) : (
        <video
          className="w-full h-full rounded-md object-cover"
          src={items[currentIndex].url}
          controls
        ></video>
      )}
      {/* Left Arrow */}
      {items.length > 1 && (
        <>
          {currentIndex !== 0 && (
            <div className="hidden z-50 group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] left-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer">
              <BsChevronCompactLeft onClick={prevSlide} size={20} />
            </div>
          )}
          {/* Right Arrow */}
          {currentIndex !== items.length - 1 && (
            <div className="hidden  z-50 group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] right-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer">
              <BsChevronCompactRight onClick={nextSlide} size={20} />
            </div>
          )}
        </>
      )}
    </div>
  );
}

const Description = ({ initialDescription, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState(initialDescription);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setDescription(initialDescription);
  };

  const handleUpdate = () => {
    onUpdate(description);
    setIsEditing(false);
  };

  const handleChange = (e) => {
    setDescription(e.target.value);
  };

  return (
    <div className="w-full">
      <div className="flex flex-row justify-between items-center">
        <p className="font-bold">Description</p>
        {!isEditing && (
          <p
            className="text-xs font-semibold text-blue-500 border-b-transparent border-b cursor-pointer hover:border-b-blue-500"
            onClick={handleEdit}
          >
            Edit Description
          </p>
        )}
      </div>
      <div className="mt-3">
        {isEditing ? (
          <>
            <textarea
              className=" w-full h-40 md:w-[380px] border-none focus:outline-none resize-none"
              value={description}
              onChange={handleChange}
            />
            <div className="mt-5 w-full flex gap-2">
              <button
                className="px-4 py-1 w-1/2  text-gray-700 rounded border hover:text-primary"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                className="px-4 py-1 w-1/2 bg-primary text-white rounded hover:bg-blue-500"
                onClick={handleUpdate}
              >
                Update
              </button>
            </div>
          </>
        ) : (
          <p className=" w-full md:w-[380px] text-gray-700 text-sm break-words">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

export function Photo({ user }) {
  const [showFileInput, setShowFileInput] = useState(true);
  const queryClient = useQueryClient(); // Get the query client instance
  const [isLoading, setIsLoading] = useState();
  const handleContainerClick = () => {
    setShowFileInput(true);
  };

  const handleFileInputChange = async (event) => {
    // Handle file input change here

    const file = event.target.files[0];

    try {
      setIsLoading(true);

      await uploadPhoto(user.userId, file);
      setIsLoading(false);
      queryClient.invalidateQueries(["currentUser", user.userId]);
    } catch (error) {
      console.error("Error uploading photo:");
      // Handle error
    }
  };

  return (
    <div
      className="relative group cursor-pointer w-40 h-40"
      onClick={handleContainerClick}
    >
      {isLoading ? (
        <div className="relative">
          <img
            src={user.photoURL ? user.photoURL : Avatar}
            className="rounded-full w-40 h-40 object-cover"
            alt=""
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <CircularProgress style={{ color: "#000000" }} />
          </div>{" "}
        </div>
      ) : (
        <img
          src={user.photoURL ? user.photoURL : Avatar}
          className="rounded-full w-40 h-40 object-cover"
          alt=""
        />
      )}

      <div className="hidden group-hover:block transition ease-in-out duration-300 top-0 rounded-full absolute w-full h-full bg-black opacity-45 "></div>
      <div className="hidden absolute group-hover:flex flex-row justify-center items-center top-0 w-full h-full transition ease-in-out duration-300">
        <IoCameraOutline size={50} className="text-white" />
      </div>
      {showFileInput && (
        <input
          type="file"
          accept="image/*"
          className="absolute inset-0 opacity-0 cursor-pointer"
          onChange={handleFileInputChange}
        />
      )}
    </div>
  );
}

const Languages = ({ initialLanguages, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [languages, setLanguages] = useState(initialLanguages);
  const [newLanguage, setNewLanguage] = useState("");
  const [newLevel, setNewLevel] = useState("");
  const selectLanguage = LANGUAGES;
  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setNewLanguage("");
    setNewLevel("");
  };

  const handleAddLanguage = () => {
    if (newLanguage && newLevel) {
      const newLanguages = [
        ...languages,
        { name: newLanguage, level: newLevel },
      ];
      setLanguages(newLanguages);
      onUpdate(newLanguages);
      setNewLanguage("");
      setNewLevel("");
      setIsEditing(false);
    }
  };
  const handleDeleteLanguage = (languageToDelete) => {
    const updatedLanguages = languages.filter(
      (language) => language.name !== languageToDelete
    );
    setLanguages(updatedLanguages);
    onUpdate(updatedLanguages); // Assuming onUpdate is a function to update the data in your database
  };
  const handleLanguageChange = (e) => {
    setNewLanguage(e.target.value);
  };

  const handleLevelChange = (e) => {
    setNewLevel(e.target.value);
  };

  const isAddButtonDisabled = !newLanguage || !newLevel;

  return (
    <div className="w-full">
      <div className="flex flex-row justify-between items-center">
        <p className="font-bold">Languages</p>
        {!isEditing && (
          <p
            className="text-xs font-semibold text-blue-500 border-b-transparent border-b cursor-pointer hover:border-b-blue-500"
            onClick={handleEdit}
          >
            Add New
          </p>
        )}
      </div>
      <div className="mt-3">
        {isEditing && (
          <>
            <div className="flex flex-col gap-x-2  mb-2">
              <select
                onChange={handleLanguageChange}
                className="w-full mt-2 border border-gray-300 focus:outline-none  focus:border-transparent"
              >
                <option value="">Language</option>
                {selectLanguage.map((language, index) => (
                  <option key={index} value={language}>
                    {language}
                  </option>
                ))}
              </select>
              <select
                value={newLevel}
                onChange={handleLevelChange}
                className="w-full mt-2 border border-gray-300 focus:outline-none  focus:border-transparent"
              >
                <option className="text-gray-500" value="" disabled>
                  Select Level
                </option>
                <option value="Basic">Basic</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Fluent">Fluent</option>
              </select>
            </div>

            <div className="mt-2 w-full flex gap-2">
              <button
                className="px-4 py-1 w-1/2 text-gray-700 rounded border hover:text-primary"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                className={`px-4 py-1 w-1/2 bg-primary text-white rounded hover:bg-blue-500 ${
                  isAddButtonDisabled && "opacity-50 cursor-not-allowed"
                }`}
                onClick={handleAddLanguage}
                disabled={isAddButtonDisabled}
              >
                Add
              </button>
            </div>
            <div className="h-5" />
          </>
        )}
        {languages.map((lang, index) => (
          <div key={index} className="flex items-center mb-2 group gap-x-3">
            <p className="text-gray-700 text-sm ">{`${lang.name} - ${lang.level}`}</p>

            <MdDeleteOutline
              onClick={() => handleDeleteLanguage(lang.name)}
              size={15}
              className="cursor-pointer text-gray-600 hidden group-hover:block"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const Skills = ({ initialSkills, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [skills, setSkills] = useState(initialSkills);
  const [newSkill, setNewSkill] = useState("");
  const [newProficiency, setNewProficiency] = useState("");

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setNewSkill("");
    setNewProficiency("");
  };

  const handleAddSkill = () => {
    if (newSkill && newProficiency) {
      const newSkills = [
        ...skills,
        { name: newSkill, experience: newProficiency },
      ];
      setSkills(newSkills);
      handleUpdate(newSkills);
      setIsEditing(false);
      setNewSkill("");
      setNewProficiency("");
    }
  };
  const handleDeleteSkill = (skillNameToDelete) => {
    if (skills.length >= 1) {
      const updatedSkills = skills.filter(
        (skill) => skill.name !== skillNameToDelete
      );
      setSkills(updatedSkills);
      handleUpdate(updatedSkills);
    }
  };
  const handleSkillChange = (e) => {
    setNewSkill(e.target.value);
  };

  const handleProficiencyChange = (e) => {
    setNewProficiency(e.target.value);
  };
  const handleUpdate = (skills) => {
    onUpdate(skills);
    setIsEditing(false);
  };

  const isAddButtonDisabled = !newSkill || !newProficiency;

  return (
    <div className="w-full">
      <div className="flex flex-row justify-between items-center">
        <p className="font-bold">Skills</p>
        {!isEditing && (
          <p
            className="text-xs font-semibold text-blue-500 border-b-transparent border-b cursor-pointer hover:border-b-blue-500"
            onClick={handleEdit}
          >
            Add New
          </p>
        )}
      </div>
      <div className="mt-3">
        {isEditing && (
          <>
            <div className="flex flex-col gap-x-2  mb-2">
              <input
                type="text"
                placeholder="Skill"
                value={newSkill}
                onChange={handleSkillChange}
                className="w-full  border border-gray-300 focus:outline-none focus:border-primary"
              />
              <select
                value={newProficiency}
                onChange={handleProficiencyChange}
                className="w-full mt-2 border border-gray-300 focus:outline-none  focus:border-transparent"
              >
                <option className="text-gray-500" value="" disabled>
                  Select Proficiency
                </option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Proficient">Proficient</option>
                <option value="Expert">Expert</option>
              </select>
            </div>

            <div className="mt-2 w-full flex gap-2">
              <button
                className="px-4 py-1 w-1/2 text-gray-700 rounded border hover:text-primary"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                className={`px-4 py-1 w-1/2 bg-primary text-white rounded hover:bg-blue-500 ${
                  isAddButtonDisabled && "opacity-50 cursor-not-allowed"
                }`}
                onClick={handleAddSkill}
                disabled={isAddButtonDisabled}
              >
                Add
              </button>
            </div>
            <div className="h-5" />
          </>
        )}
        {skills.map((skill, index) => (
          <div
            key={skill.name}
            className="flex items-center mb-2 group gap-x-3"
          >
            <p className="text-gray-700 text-sm">{`${skill.name} - ${skill.experience}`}</p>
            <MdDeleteOutline
              onClick={() => {
                handleDeleteSkill(skill.name);
              }}
              size={15}
              className="cursor-pointer text-gray-600 hidden group-hover:block"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const Education = ({ initialEducation, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [education, setEducation] = useState(initialEducation);
  const [newDiplomaUniversity, setNewDiplomaUniversity] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newMajor, setNewMajor] = useState("");
  const [newYearGrad, setNewYearGrad] = useState("");

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setNewDiplomaUniversity("");
    setNewTitle("");
    setNewMajor("");
    setNewYearGrad("");
  };

  const handleAddEducation = () => {
    if (newDiplomaUniversity && newTitle && newMajor && newYearGrad) {
      const newEducations = [
        ...education,
        {
          diplomaUniversity: newDiplomaUniversity,
          title: newTitle,
          major: newMajor,
          yearGrad: newYearGrad,
        },
      ];
      setEducation(newEducations);
      onUpdate(newEducations);
      setIsEditing(false);
      setNewDiplomaUniversity("");
      setNewTitle("");
      setNewMajor("");
      setNewYearGrad("");
    }
  };

  const handleDeleteEducation = (
    diplomaUniversityToDelete,
    titleToDelete,
    majorToDelete,
    yearGradToDelete
  ) => {
    const updatedEducations = education.filter(
      (educationItem) =>
        educationItem.diplomaUniversity !== diplomaUniversityToDelete ||
        educationItem.title !== titleToDelete ||
        educationItem.major !== majorToDelete ||
        educationItem.yearGrad !== yearGradToDelete
    );
    setEducation(updatedEducations);
    onUpdate(updatedEducations); // Assuming onUpdate is a function to update the data in your database
  };

  const isAddButtonDisabled =
    !newDiplomaUniversity || !newTitle || !newMajor || !newYearGrad;

  return (
    <div className="w-full">
      <div className="flex flex-row justify-between items-center">
        <p className="font-bold">Education</p>
        {!isEditing && (
          <p
            className="text-xs font-semibold text-blue-500 border-b-transparent border-b cursor-pointer hover:border-b-blue-500"
            onClick={handleEdit}
          >
            Add New
          </p>
        )}
      </div>
      <div className="mt-3">
        {isEditing && (
          <>
            <div className="flex flex-col gap-x-2 mb-2">
              <input
                type="text"
                placeholder="Diploma/University"
                value={newDiplomaUniversity}
                onChange={(e) => setNewDiplomaUniversity(e.target.value)}
                className="w-full border border-gray-300 focus:outline-none focus:border-primary"
              />
              <input
                type="text"
                placeholder="Title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full mt-2 border border-gray-300 focus:outline-none focus:border-primary"
              />
              <input
                type="text"
                placeholder="Major"
                value={newMajor}
                onChange={(e) => setNewMajor(e.target.value)}
                className="w-full mt-2 border border-gray-300 focus:outline-none focus:border-primary"
              />
              <select
                value={newYearGrad}
                onChange={(e) => setNewYearGrad(e.target.value)}
                className="w-full mt-2 border border-gray-300 focus:outline-none focus:border-primary"
              >
                <option value="">Year</option>
                {YEARS.map((year, index) => (
                  <option key={index} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-2 w-full flex gap-2">
              <button
                className="px-4 py-1 w-1/2 text-gray-700 rounded border hover:text-primary"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                className={`px-4 py-1 w-1/2 bg-primary text-white rounded hover:bg-blue-500 ${
                  isAddButtonDisabled && "opacity-50 cursor-not-allowed"
                }`}
                onClick={handleAddEducation}
                disabled={isAddButtonDisabled}
              >
                Add
              </button>
            </div>
            <div className="h-5" />
          </>
        )}
        {education.map((edu, index) => (
          <div key={index} className="flex items-center mb-2 group gap-x-3">
            <p className="text-gray-700 text-sm">{`${edu.diplomaUniversity}, ${edu.title}, ${edu.major}, ${edu.yearGrad}`}</p>
            <MdDeleteOutline
              onClick={() =>
                handleDeleteEducation(
                  edu.diplomaUniversity,
                  edu.title,
                  edu.major,
                  edu.yearGrad
                )
              }
              size={15}
              className="cursor-pointer text-gray-600 hidden group-hover:block"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const Certification = ({ initialCertifications, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [certifications, setCertifications] = useState(initialCertifications);
  const [newTitle, setNewTitle] = useState("");
  const [newMajor, setNewMajor] = useState("");
  const [newYearObtain, setNewYearObtain] = useState("");

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setNewTitle("");
    setNewMajor("");
    setNewYearObtain("");
  };

  const handleAddCertification = () => {
    if (newTitle && newMajor && newYearObtain) {
      const newCertifications = [
        ...certifications,
        { title: newTitle, major: newMajor, yearObtain: newYearObtain },
      ];
      setCertifications(newCertifications);
      onUpdate(newCertifications);
      setIsEditing(false);
      setNewTitle("");
      setNewMajor("");
      setNewYearObtain("");
    }
  };
  const handleDeleteCertification = (
    titleToDelete,
    majorToDelete,
    yearObtainToDelete
  ) => {
    const updatedCertifications = certifications.filter(
      (certification) =>
        certification.title !== titleToDelete ||
        certification.major !== majorToDelete ||
        certification.yearObtain !== yearObtainToDelete
    );
    setCertifications(updatedCertifications);
    onUpdate(updatedCertifications); // Assuming onUpdate is a function to update the data in your database
  };
  const handleTitleChange = (e) => {
    setNewTitle(e.target.value);
  };

  const handleMajorChange = (e) => {
    setNewMajor(e.target.value);
  };

  const handleYearObtainChange = (e) => {
    setNewYearObtain(e.target.value);
  };

  const isAddButtonDisabled = !newTitle || !newMajor || !newYearObtain;

  return (
    <div className="w-full">
      <div className="flex flex-row justify-between items-center">
        <p className="font-bold">Certifications</p>
        {!isEditing && (
          <p
            className="text-xs font-semibold text-blue-500 border-b-transparent border-b cursor-pointer hover:border-b-blue-500"
            onClick={handleEdit}
          >
            Add New
          </p>
        )}
      </div>
      <div className="mt-3">
        {isEditing && (
          <>
            <div className="flex flex-col gap-y-2  mb-2">
              <input
                type="text"
                placeholder="Title"
                value={newTitle}
                onChange={handleTitleChange}
                className="w-full  border border-gray-300 focus:outline-none focus:border-primary"
              />
              <input
                type="text"
                placeholder="Major"
                value={newMajor}
                onChange={handleMajorChange}
                className="w-full  border border-gray-300 focus:outline-none focus:border-primary"
              />
              <select
                value={newYearObtain}
                onChange={(e) => setNewYearObtain(e.target.value)}
                className="w-full mt-2 border border-gray-300 focus:outline-none focus:border-primary"
              >
                <option value="">Year</option>
                {YEARS.map((year, index) => (
                  <option key={index} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-2 w-full flex gap-2">
              <button
                className="px-4 py-1 w-1/2 text-gray-700 rounded border hover:text-primary"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                className={`px-4 py-1 w-1/2 bg-primary text-white rounded hover:bg-blue-500 ${
                  isAddButtonDisabled && "opacity-50 cursor-not-allowed"
                }`}
                onClick={handleAddCertification}
                disabled={isAddButtonDisabled}
              >
                Add
              </button>
            </div>
            <div className="h-5" />
          </>
        )}
        {certifications.map((cert, index) => (
          <div key={index} className="flex items-center mb-2 group gap-x-3">
            <p className="text-gray-700 text-sm">{`${cert.title} - ${cert.major} (${cert.yearObtain})`}</p>
            <MdDeleteOutline
              onClick={() =>
                handleDeleteCertification(
                  cert.title,
                  cert.major,
                  cert.yearObtain
                )
              }
              size={15}
              className="cursor-pointer text-gray-600 hidden group-hover:block"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
