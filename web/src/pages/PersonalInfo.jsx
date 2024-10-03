import React, { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useAuth } from "../hooks/auth_context";

import { Photo } from "./EditProfile";
import {
  becomeFreelancer,
  sendEmailVerif,
  useFreelancerDetails,
  useGetUser,
} from "../apis/user_api";
import { LANGUAGES, YEARS } from "../util";
import { MdEmail } from "react-icons/md";
import { CircularProgress, Snackbar } from "@mui/material";
import isEqual from "lodash/isEqual";
import { useLocation, useNavigate } from "react-router-dom";
import MuiAlert from "@mui/material/Alert";
import { handleSendEmailVerification } from "../auth/firebase_auth";
import { useQueryClient } from "@tanstack/react-query";

const steps = ["Personal Info", "Professional Info", "Account Security"];
const deepEqual = (obj1, obj2) => {
  return isEqual(obj1, obj2);
};

export const PersonalInfoPage = () => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const { currentUser } = useAuth();
  const { data } = useGetUser(currentUser.userId, currentUser.accessToken);
  const freelancerDetails = useFreelancerDetails(currentUser.userId);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const step = searchParams.get("step");
  useEffect(() => {
    if (step === "account_security") {
      setActiveStep(2);
    }
  }, [step]);

  const [loading, setLoading] = useState(false); // State to track loading
  const navigate = useNavigate();
  const [openToast, setOpenToast] = useState(false);
  const [openToast2, setOpenToast2] = useState(false);
  const [loadingVerif, setLoadingVerif] = useState(false); // State to track loading

  const queryClient = useQueryClient(); // Get the query client instance

  const [userPrevData, setUserPrevData] = useState({
    userId: "",
    firstName: "",
    lastName: "",
    username: "",
    photoURL: "",
    description: "",
    website: "",
    mat: "",
    languages: [],
    skills: [],
    educations: [],
    certifications: [],
  });
  const [user, setUserData] = useState({
    userId: "",
    firstName: "",
    lastName: "",
    username: "",
    photoURL: "",
    description: "",
    website: "",
    mat: "",
    languages: [],
    skills: [],
    educations: [],
    certifications: [],
  });
  const [formErrors, setFormErrors] = useState({});
  const [languages, setLanguages] = useState([]);
  const [skills, setSkills] = useState([]);
  const [educations, setEducations] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [message, setMessage] = useState("");

  const validateFormOne = (values) => {
    const error = {};
    if (!values.firstName || !values.lastName) {
      error.firstName = "Full Name is required";
    }
    if (!values.username) {
      error.username = "Display Name is required";
    }
    if (!values.description) {
      error.description = "description is required";
    }

    return error;
  };
  const validateFormTwo = (values) => {
    const error = {};

    return error;
  };

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...user,
      [name]: value,
    });
  };

  useEffect(() => {
    if (data && freelancerDetails.data) {
      setUserData({
        userId: data.userId,
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        username: data.username,
        photoURL: data.photoURL,
        description: freelancerDetails.data?.description || "",
        website: freelancerDetails.data?.website || "",
        mat: freelancerDetails.data?.mat || "",
        languages: freelancerDetails.data?.languages || [],
        skills: freelancerDetails.data?.skills || [],
        educations: freelancerDetails.data?.educations || [],
        certifications: freelancerDetails.data?.certifications || [],
      });
      setUserPrevData({
        userId: currentUser.userId,
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        username: data.username,
        photoURL: data.photoURL,
        description: freelancerDetails.data?.description || "",
        website: freelancerDetails.data?.website || "",
        mat: freelancerDetails.data?.mat || "",
        languages: freelancerDetails.data?.languages || [],
        skills: freelancerDetails.data?.skills || [],
        educations: freelancerDetails.data?.educations || [],
        certifications: freelancerDetails.data?.certifications || [],
      });
      setLanguages(freelancerDetails.data?.languages || []);
      setSkills(freelancerDetails.data?.skills || []);
      setEducations(freelancerDetails.data?.educations || []);
      setCertifications(freelancerDetails.data?.certifications || []);
    }
  }, [data, freelancerDetails.data]);

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };
  const handleNext = async () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    if (activeStep === 0) {
      setFormErrors(validateFormOne(user));

      if (
        Object.keys(validateFormOne(user)).length === 0 &&
        languages.length !== 0
      ) {
        const userData = {
          ...user,
          languages,
        };
        if (!deepEqual(userData, userPrevData)) {
          setLoading(true); // Start loading

          const result = await becomeFreelancer(
            userData,
            currentUser.userId,
            currentUser.accessToken
          );

          setLoading(false);
          setFormErrors({});
          if (result) {
            setUserPrevData(userData);
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
            setSkipped(newSkipped);
          }
        } else {
          // If there are no changes, directly proceed to the next step
          setActiveStep((prevActiveStep) => prevActiveStep + 1);
          setSkipped(newSkipped);
        }
      }
    }
    if (activeStep === 1) {
      setFormErrors(validateFormTwo(user));

      if (
        Object.keys(validateFormTwo(user)).length === 0 &&
        skills.length !== 0
      ) {
        const userData = {
          ...userPrevData,
          mat: user.mat,
          website: user.website,
          skills: skills,
          educations: educations,
          certifications: certifications,
        };

        if (!deepEqual(userData, userPrevData)) {
          setLoading(true); // Start loading
          const result = await becomeFreelancer(
            userData,
            currentUser.userId,
            currentUser.accessToken
          );

          setLoading(false);
          setFormErrors({});
          if (result) {
            setUserPrevData(userData);
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
            setSkipped(newSkipped);
          }
        } else {
          setActiveStep((prevActiveStep) => prevActiveStep + 1);
          setSkipped(newSkipped);
        }
      }
    }
    if (activeStep === 2) {
      setFormErrors(validateFormTwo(user));

      if (currentUser.emailVerified) {
        queryClient.invalidateQueries(["currentUser", user.userId]);

        navigate("/dashboard");
      } else {
        setErrorMessage("Verify your email!");
        setOpenToast(true);
      }
    }
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleEmailVerification = async () => {
    try {
      setLoadingVerif(true);
      setMessage("We've  sent you an Email to verify your account!");
      await sendEmailVerif(currentUser.userId, currentUser.accessToken);
      setLoadingVerif(false);
      setOpenToast2(true);
    } catch (e) {}
  };

  const handleReset = () => {
    setActiveStep(0);
  };
  const handleCloseToast = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenToast(false);
    setOpenToast2(false);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white border-b">
        <div className="max-w-[1240px] mx-auto px-4 py-4">
          <h1
            onClick={() => {
              navigate("/home");
            }}
            className="text-3xl font-bold cursor-pointer text-primary"
          >
            TIE-UP.
          </h1>
        </div>
      </div>

      <div className="max-w-[1240px] mx-auto mt-5 mb-10">
        <Box sx={{ width: "100%" }}>
          <Stepper activeStep={activeStep}>
            {steps.map((label, index) => {
              const stepProps = {};
              const labelProps = {};

              if (isStepSkipped(index)) {
                stepProps.completed = false;
              }
              return (
                <Step key={label} {...stepProps}>
                  <StepLabel {...labelProps}>{label}</StepLabel>
                </Step>
              );
            })}
          </Stepper>
          {activeStep === steps.length ? (
            <>
              <Typography sx={{ mt: 2, mb: 1 }}>
                All steps completed - you&apos;re finished
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                <Box sx={{ flex: "1 1 auto" }} />
                <Button onClick={handleReset}>Reset</Button>
              </Box>
            </>
          ) : (
            <>
              {activeStep === 0 && (
                <PersonalInfoComponent
                  data={user}
                  changeHandler={changeHandler}
                  formErrors={formErrors}
                  languages={languages}
                  setLanguages={setLanguages}
                />
              )}
              {activeStep === 1 && (
                <ProfessionalInfoComponent
                  user={user}
                  changeHandler={changeHandler}
                  formErrors={formErrors}
                  skills={skills}
                  setSkills={setSkills}
                  educations={educations}
                  setEducations={setEducations}
                  certifications={certifications}
                  setCertifications={setCertifications}
                />
              )}
              {activeStep === 2 && (
                <AccountSecurityComponent
                  handleEmailVer={handleEmailVerification}
                  loadingVerif={loadingVerif}
                />
              )}
              <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                <Button
                  color="inherit"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                >
                  Back
                </Button>
                <Box sx={{ flex: "1 1 auto" }} />

                {loading ? ( // Show circular progress if loading
                  <CircularProgress />
                ) : (
                  // Otherwise, show Save button
                  <Button onClick={handleNext}>
                    {activeStep === steps.length - 1 ? "Finish" : "Save"}
                  </Button>
                )}
              </Box>
            </>
          )}
        </Box>
      </div>
      <Snackbar
        open={openToast2}
        autoHideDuration={5000}
        onClose={handleCloseToast}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleCloseToast}
          severity="info"
        >
          {message}
        </MuiAlert>
      </Snackbar>
      <Snackbar
        open={openToast}
        autoHideDuration={5000}
        onClose={handleCloseToast}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleCloseToast}
          severity="error"
        >
          {errorMessage}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

const PersonalInfoComponent = ({
  data,
  changeHandler,
  formErrors,
  languages,
  setLanguages,
}) => {
  const [selectLanguage, setSelectLanguage] = useState(LANGUAGES);
  const [newLanguageName, setNewLanguageName] = useState("");
  const [newLanguageLevel, setNewLanguageLevel] = useState("");
  const [showAddNew, setShowAddNew] = useState(false);

  const handleAddNewLanguage = () => {
    if (newLanguageName && newLanguageLevel) {
      setLanguages([
        ...languages,
        { name: newLanguageName, level: newLanguageLevel },
      ]);

      // Clear input fields after adding new language
      setNewLanguageName("");
      setNewLanguageLevel("");
    }
  };
  const handleDeleteLanguage = (name) => {
    const updatedLanguages = languages.filter(
      (language) => language.name !== name
    );
    setLanguages(updatedLanguages);
  };
  return (
    <div className="w-full my-12">
      <div className="ml-3 mb-9 flex flex-col gap-4 text-black_04">
        <p className="text-2xl font-semibold">Personal Info</p>
        <p className=" text-gray-600 ">
          Tell us a bit about yourself. This information will appear on your
          public profile, so that potential buyers can get to know you better.
        </p>
      </div>
      <div className="w-full h-[1px] bg-gray-600 opacity-50" />
      <div className="flex-col mt-10 ">
        <div className="flex flex-col md:flex-row  justify-between gap-3 ">
          <div className="w-full md:w-1/3">
            Full Name <span className="text-red-400">*</span>
          </div>
          <div className="w-full md:w-2/3 flex flex-col md:flex-row gap-4 ">
            <input
              type="text"
              id="firstName"
              name="firstName"
              className=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
              placeholder="John"
              value={data.firstName}
              onChange={changeHandler}
              required
            />
            <input
              type="text"
              id="lastName"
              name="lastName"
              className=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
              placeholder="Doe"
              value={data.lastName}
              onChange={changeHandler}
              required
            />
            <div className="text-secondary text-[10px] h-1 mb-1">
              {formErrors.firstName ? formErrors.firstName : null}
            </div>
          </div>
        </div>
        <div className="mt-5 flex flex-col md:flex-row  gap-2">
          <div className="w-full md:w-1/3">
            Display Name <span className="text-red-400">*</span>
          </div>
          <div className="w-full md:w-1/3  ">
            <input
              type="text"
              id="username"
              name="username"
              className=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
              placeholder="@johndoe"
              value={data.username}
              onChange={changeHandler}
              required
            />
            <div className="text-secondary text-[10px] h-1 mb-1">
              {formErrors.username ? formErrors.username : null}
            </div>
          </div>
        </div>
        <div className="mt-32 flex flex-col md:flex-row  gap-2">
          <div className="w-full md:w-1/3">
            Profile Picture <span className="text-red-400">*</span>
          </div>
          <div className="w-full md:w-1/3  ">
            <Photo user={data || []} />
          </div>
        </div>
        <div className="mt-10 flex flex-col md:flex-row  gap-2">
          <div className="w-full md:w-1/3">
            Description <span className="text-red-400">*</span>
          </div>
          <div className="w-full md:w-2/3  ">
            <textarea
              id="description"
              name="description"
              value={data.description}
              onChange={changeHandler}
              className=" bg-gray-50 border resize-none  h-32  border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
              placeholder="@johndoe"
            />
            <div className="text-secondary text-[10px] h-1 mb-1">
              {formErrors.description ? formErrors.description : null}
            </div>
          </div>
        </div>
        <div className="mt-10 flex flex-col md:flex-row  gap-2">
          <div className="w-full md:w-1/3">
            Languages <span className="text-red-400">*</span>
          </div>
          <div className="w-full md:w-2/3   ">
            {showAddNew && (
              <div className="mb-6 w-full flex gap-x-6">
                <select
                  onChange={(e) => setNewLanguageName(e.target.value)}
                  className="border-gray-300 border w-1/3 rounded-md px-2 py-1 focus:outline-none focus:ring focus:ring-blue-200"
                >
                  <option value="">Language</option>
                  {selectLanguage.map((language, index) => (
                    <option key={index} value={language}>
                      {language}
                    </option>
                  ))}
                </select>
                <select
                  value={newLanguageLevel}
                  onChange={(e) => setNewLanguageLevel(e.target.value)}
                  className="border-gray-300 border w-1/3 rounded-md px-2 py-1 focus:outline-none focus:ring focus:ring-blue-200"
                >
                  <option value=""> Level</option>
                  <option value="Basic">Basic</option>
                  <option value="Conversational">Conversational</option>
                  <option value="Fluent">Fluent</option>
                </select>
              </div>
            )}
            <div className="relative overflow-x-auto shadow-sm sm:rounded-lg">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Language
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Level
                    </th>
                    <th scope="col" className="px-6 py-3 flex justify-end">
                      {!showAddNew ? (
                        <button
                          className="cursor-pointer place-self-end text-primary font-semibold text-xs"
                          onClick={() => setShowAddNew(true)}
                        >
                          Add New
                        </button>
                      ) : (
                        <>
                          <button
                            className={`cursor-pointer place-self-end text-primary font-semibold text-xs mr-2 ${
                              !newLanguageName || !newLanguageLevel
                                ? "opacity-50 pointer-events-none"
                                : ""
                            }`}
                            onClick={() => {
                              handleAddNewLanguage();
                              setShowAddNew(false);
                            }}
                            disabled={!newLanguageName || !newLanguageLevel}
                          >
                            Add
                          </button>
                          <button
                            className="cursor-pointer place-self-end text-primary font-semibold text-xs"
                            onClick={() => setShowAddNew(false)}
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {languages.map((language, index) => (
                    <tr
                      key={index}
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {language.name}
                      </td>
                      <td className="px-6 py-4">{language.level}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => {
                            handleDeleteLanguage(language.name);
                          }}
                          className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="text-secondary text-[10px] h-1 mb-1">
              {languages.length === 0 ? "Add one at least" : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfessionalInfoComponent = ({
  user,
  formErrors,
  changeHandler,
  skills,
  setSkills,
  educations,
  setEducations,
  certifications,
  setCertifications,
}) => {
  const [newSkill, setNewSkill] = useState("");
  const [experience, setExperience] = useState("");
  const [showAddNew, setShowAddNew] = useState(false);

  const [newEducation, setNewEducation] = useState({
    diplomaUniversity: "",
    title: "",
    major: "",
    yearGrad: "",
  });
  const [showAddNewEd, setShowAddNewEd] = useState(false);

  const [newCertification, setNewCertification] = useState({
    title: "",
    major: "",
    yearObtain: "",
  });
  const [showAddNewCert, setShowAddNewCert] = useState(false);

  const handleAddNewCertification = () => {
    if (
      newCertification.title &&
      newCertification.major &&
      newCertification.yearObtain
    ) {
      setCertifications([
        ...certifications,
        {
          title: newCertification.title,
          major: newCertification.major,
          yearObtain: newCertification.yearObtain,
        },
      ]);
      // Clear input fields after adding new certification
      setNewCertification({ title: "", major: "", yearObtain: "" });
    }
  };
  const handleAddNewEducation = () => {
    if (
      newEducation.diplomaUniversity &&
      newEducation.title &&
      newEducation.major &&
      newEducation.yearGrad
    ) {
      setEducations([
        ...educations,
        {
          title: newEducation.title,
          yearGrad: newEducation.yearGrad,
          major: newEducation.major,
          diplomaUniversity: newEducation.diplomaUniversity,
        },
      ]);
      // Clear input fields after adding new education
      setNewEducation({
        diplomaUniversity: "",
        title: "",
        major: "",
        yearGrad: "",
      });
    }
  };

  const handleAddNewSkill = () => {
    if (newSkill && experience) {
      setSkills([...skills, { name: newSkill, experience: experience }]);
      // Clear input fields after adding new language
      setNewSkill("");
      setExperience("");
    }
  };
  const handleDeleteSkill = (skillNameToDelete, skillLevelToDelete) => {
    const updatedSkills = skills.filter(
      (skill) =>
        !(
          skill.name === skillNameToDelete && skill.level === skillLevelToDelete
        )
    );
    setSkills(updatedSkills);
  };
  const handleDeleteEducation = (
    diplomaUniversityToDelete,
    titleToDelete,
    majorToDelete,
    yearGradToDelete
  ) => {
    const updatedEducation = educations.filter(
      (education) =>
        !(
          education.diplomaUniversity === diplomaUniversityToDelete &&
          education.title === titleToDelete &&
          education.major === majorToDelete &&
          education.yearGrad === yearGradToDelete
        )
    );
    setEducations(updatedEducation);
  };
  const handleDeleteCertification = (
    certificationTitleToDelete,
    certificationMajorToDelete,
    certificationYearToDelete
  ) => {
    const updatedCertifications = certifications.filter(
      (certification) =>
        !(
          certification.title === certificationTitleToDelete &&
          certification.major === certificationMajorToDelete &&
          certification.yearObtain === certificationYearToDelete
        )
    );
    setCertifications(updatedCertifications);
  };
  return (
    <div className="w-full my-12">
      <div className="ml-3 mb-9 flex flex-col gap-4 text-black_04">
        <p className="text-2xl font-semibold">Professional Info</p>
        <p className=" text-gray-600 ">
          This is your time to shine. Let potential buyers know what you do best
          and how you gained your skills, certifications and experience.
        </p>
      </div>
      <div className="w-full h-[1px] bg-gray-600 opacity-50" />
      <div className="flex-col mt-10 ">
        <div className="mt-5 flex flex-col md:flex-row  gap-2">
          <div className="w-full md:w-1/3">Tax identification number</div>
          <div className="w-full md:w-1/3  ">
            <input
              type="text"
              id="mat"
              name="mat"
              className=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
              placeholder="1234567A"
              value={user.mat}
              onChange={changeHandler}
            />
            <div className="text-secondary text-[10px] h-1 mb-1">
              {formErrors.mat ? formErrors.mat : null}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col md:flex-row  gap-2">
          <div className="w-full md:w-1/3">
            Skills <span className="text-red-400">*</span>
          </div>
          <SkillComponent
            skills={skills}
            newSkill={newSkill}
            setNewSkill={setNewSkill}
            experience={experience}
            setExperience={setExperience}
            showAddNew={showAddNew}
            setShowAddNew={setShowAddNew}
            handleAddNewSkill={handleAddNewSkill}
            handleDeleteSkill={handleDeleteSkill}
          />
        </div>

        <div className="mt-10 flex flex-col md:flex-row  gap-2">
          <div className="w-full md:w-1/3">Education</div>
          <EducationComponent
            educations={educations}
            setEducations={setEducations}
            newEducation={newEducation}
            setNewEducation={setNewEducation}
            showAddNew={showAddNewEd}
            setShowAddNew={setShowAddNewEd}
            handleAddNewEducation={handleAddNewEducation}
            handleDeleteEducation={handleDeleteEducation}
          />
        </div>
        <div className="mt-10 flex flex-col md:flex-row  gap-2">
          <div className="w-full md:w-1/3">Certification</div>
          <CertificationComponent
            certifications={certifications}
            setCertifications={setCertifications}
            newCertification={newCertification}
            setNewCertification={setNewCertification}
            showAddNewCert={showAddNewCert}
            setShowAddNewCert={setShowAddNewCert}
            handleAddNewCertification={handleAddNewCertification}
            handleDeleteCertification={handleDeleteCertification}
          />
        </div>
        <div className="mt-10 flex flex-col md:flex-row  gap-2">
          <div className="w-full md:w-1/3">
            <div>Personal Website</div>
            <div className="text-gray-400 text-[12px] italic">Private</div>
          </div>
          <div className="w-full md:w-1/3  ">
            <input
              type="text"
              id="website"
              name="website"
              value={user.website}
              onChange={changeHandler}
              className=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
              placeholder="Link to your own professional website"
              required
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const AccountSecurityComponent = ({ handleEmailVer, loadingVerif }) => {
  const { currentUser } = useAuth();
  const { data } = useGetUser(currentUser.userId, currentUser.accessToken);

  return (
    <div className="w-full my-12">
      <div className="ml-3 mb-9 flex flex-col gap-4 text-black_04">
        <p className="text-2xl font-semibold">Account Security</p>
        <p className=" text-gray-600 ">
          Trust and safety is a big deal in our community. Please verify your
          email so that we can keep your account secured.
        </p>
      </div>
      <div className="w-full h-[1px] bg-gray-600 opacity-50" />
      <div className="flex-col mt-10 ">
        <div className="mt-5 flex flex-col md:flex-row  gap-2 justify-between">
          <div className="w-full  flex gap-3 items-center">
            <MdEmail />
            Email
            <span className="text-gray-400 text-[12px] italic">Private</span>
          </div>
          <div className="">
            {currentUser.emailVerified ? (
              <div className="w-36 py-2 px-4 text-center  rounded text-white bg-blue-400 ">
                Verified
              </div>
            ) : (
              <button
                onClick={() => {
                  handleEmailVer();
                }}
                disabled={loadingVerif}
                className="w-36 py-2 px-4  rounded text-white bg-primary hover:bg-blue-500 "
              >
                {loadingVerif ? " Verifying..." : " Verify Now"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const SkillComponent = ({
  skills,
  newSkill,
  setNewSkill,
  experience,
  setExperience,
  showAddNew,
  setShowAddNew,
  handleAddNewSkill,
  handleDeleteSkill,
}) => {
  return (
    <div className="w-full md:w-2/3">
      {showAddNew && (
        <div className="mb-6 w-full flex gap-x-6">
          <input
            type="text"
            id="skill"
            name="skill"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
            placeholder="Add Skill (e.g JS)"
            required
          />
          <select
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            className="border-gray-300 border w-1/3 rounded-md px-2 py-1 focus:outline-none focus:ring focus:ring-blue-200"
          >
            <option value="">Experience</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Expert">Expert</option>
          </select>
        </div>
      )}
      <div className="relative overflow-x-auto sm:rounded-lg border">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Skill
              </th>
              <th scope="col" className="px-6 py-3">
                Experience
              </th>
              <th scope="col" className="px-6 py-3 flex justify-end">
                {!showAddNew ? (
                  <button
                    className="cursor-pointer place-self-end text-primary font-semibold text-xs"
                    onClick={() => setShowAddNew(true)}
                  >
                    Add New
                  </button>
                ) : (
                  <>
                    <button
                      className={`cursor-pointer place-self-end text-primary font-semibold text-xs mr-2 ${
                        !newSkill || !experience
                          ? "opacity-50 pointer-events-none"
                          : ""
                      }`}
                      onClick={() => {
                        handleAddNewSkill();
                        setShowAddNew(false);
                      }}
                      disabled={!newSkill || !experience}
                    >
                      Add
                    </button>
                    <button
                      className="cursor-pointer place-self-end text-primary font-semibold text-xs"
                      onClick={() => setShowAddNew(false)}
                    >
                      Cancel
                    </button>
                  </>
                )}
              </th>
            </tr>
          </thead>
          <tbody>
            {skills.map((skill, index) => (
              <tr
                key={index}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
              >
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {skill.name}
                </td>
                <td className="px-6 py-4">{skill.experience}</td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() =>
                      handleDeleteSkill(skill.name, skill.experience)
                    }
                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="text-secondary text-[10px] h-1 mb-1">
        {skills.length === 0 ? "Add one at least!" : null}
      </div>
    </div>
  );
};

const EducationComponent = ({
  educations,
  setEducations,
  newEducation,
  setNewEducation,
  showAddNew,
  setShowAddNew,
  handleAddNewEducation,
  handleDeleteEducation,
}) => {
  return (
    <div className="w-full md:w-2/3">
      {showAddNew && (
        <div className="mb-6 w-full flex gap-x-6">
          <input
            type="text"
            id="diplomaUniversity"
            name="diplomaUniversity"
            value={newEducation.diplomaUniversity}
            onChange={(e) =>
              setNewEducation({
                ...newEducation,
                diplomaUniversity: e.target.value,
              })
            }
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
            placeholder="Diploma University"
            required
          />
          <input
            type="text"
            id="title"
            name="title"
            value={newEducation.title}
            onChange={(e) =>
              setNewEducation({ ...newEducation, title: e.target.value })
            }
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
            placeholder="Title"
            required
          />
          <input
            type="text"
            id="major"
            name="major"
            value={newEducation.major}
            onChange={(e) =>
              setNewEducation({ ...newEducation, major: e.target.value })
            }
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
            placeholder="Major"
            required
          />
          <select
            value={newEducation.yearGrad}
            onChange={(e) =>
              setNewEducation({ ...newEducation, yearGrad: e.target.value })
            }
            className="border-gray-300 border w-1/3 rounded-md px-2 py-1 focus:outline-none focus:ring focus:ring-blue-200"
          >
            <option value="">Year</option>
            {YEARS.map((year, index) => (
              <option key={index} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      )}
      <div className="relative overflow-x-auto border sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Degree
              </th>
              <th scope="col" className="px-6 py-3">
                Year
              </th>
              <th scope="col" className="px-6 py-3 flex justify-end">
                {!showAddNew ? (
                  <button
                    className="cursor-pointer place-self-end text-primary font-semibold text-xs"
                    onClick={() => setShowAddNew(true)}
                  >
                    Add New
                  </button>
                ) : (
                  <>
                    <button
                      className={`cursor-pointer place-self-end text-primary font-semibold text-xs mr-2 ${
                        !newEducation.diplomaUniversity ||
                        !newEducation.title ||
                        !newEducation.major ||
                        !newEducation.yearGrad
                          ? "opacity-50 pointer-events-none"
                          : ""
                      }`}
                      onClick={() => {
                        handleAddNewEducation();
                        setShowAddNew(false);
                      }}
                      disabled={
                        !newEducation.diplomaUniversity ||
                        !newEducation.title ||
                        !newEducation.major ||
                        !newEducation.yearGrad
                      }
                    >
                      Add
                    </button>
                    <button
                      className="cursor-pointer place-self-end text-primary font-semibold text-xs"
                      onClick={() => setShowAddNew(false)}
                    >
                      Cancel
                    </button>
                  </>
                )}
              </th>
            </tr>
          </thead>
          <tbody>
            {educations.map((education, index) => (
              <tr
                key={index}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
              >
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {education.title}
                </td>
                <td className="px-6 py-4">{education.yearGrad}</td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() =>
                      handleDeleteEducation(
                        education.diplomaUniversity,
                        education.title,
                        education.major,
                        education.yearGrad
                      )
                    }
                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const CertificationComponent = ({
  certifications,
  setCertifications,
  newCertification,
  setNewCertification,
  showAddNewCert,
  setShowAddNewCert,
  handleAddNewCertification,
  handleDeleteCertification,
}) => {
  return (
    <div className="w-full md:w-2/3">
      {showAddNewCert && (
        <div className="mb-6 w-full flex gap-x-6">
          <input
            type="text"
            id="title"
            name="title"
            value={newCertification.title}
            onChange={(e) =>
              setNewCertification({
                ...newCertification,
                title: e.target.value,
              })
            }
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
            placeholder="Title"
            required
          />
          <input
            type="text"
            id="major"
            name="major"
            value={newCertification.major}
            onChange={(e) =>
              setNewCertification({
                ...newCertification,
                major: e.target.value,
              })
            }
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
            placeholder="Major"
            required
          />
          <select
            value={newCertification.yearObtain}
            onChange={(e) =>
              setNewCertification({
                ...newCertification,
                yearObtain: e.target.value,
              })
            }
            className="border-gray-300 border w-1/3 rounded-md px-2 py-1 focus:outline-none focus:ring focus:ring-blue-200"
          >
            <option value="">Year</option>
            {YEARS.map((year, index) => (
              <option key={index} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      )}
      <div className="relative overflow-x-auto border  sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Title
              </th>
              <th scope="col" className="px-6 py-3">
                Year Obtained
              </th>
              <th scope="col" className="px-6 py-3 flex justify-end">
                {!showAddNewCert ? (
                  <button
                    className="cursor-pointer place-self-end text-primary font-semibold text-xs"
                    onClick={() => setShowAddNewCert(true)}
                  >
                    Add New
                  </button>
                ) : (
                  <>
                    <button
                      className={`cursor-pointer place-self-end text-primary font-semibold text-xs mr-2 ${
                        !newCertification.title ||
                        !newCertification.major ||
                        !newCertification.yearObtain
                          ? "opacity-50 pointer-events-none"
                          : ""
                      }`}
                      onClick={() => {
                        handleAddNewCertification();
                        setShowAddNewCert(false);
                      }}
                      disabled={
                        !newCertification.title ||
                        !newCertification.major ||
                        !newCertification.yearObtain
                      }
                    >
                      Add
                    </button>
                    <button
                      className="cursor-pointer place-self-end text-primary font-semibold text-xs"
                      onClick={() => setShowAddNewCert(false)}
                    >
                      Cancel
                    </button>
                  </>
                )}
              </th>
            </tr>
          </thead>
          <tbody>
            {certifications.map((certification, index) => (
              <tr
                key={index}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
              >
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {certification.title}
                </td>
                <td className="px-6 py-4">{certification.yearObtain}</td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() =>
                      handleDeleteCertification(
                        certification.title,
                        certification.major,
                        certification.yearObtain
                      )
                    }
                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
