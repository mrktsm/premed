import { useState } from "react";
import UniversitySelector from "./UniversitySelector";

interface FormData {
  // Academic Background
  academicLevel: string;
  university: string;
  hasUniversity: boolean;
  gpa: string;
  hasGpa: boolean;

  // Medical Interests
  primarySpecialty: string;
  mdDoInterest: string;

  // Personal Background
  firstGenStudent: boolean;
  applicantType: string[];
  genderIdentity: string;

  // Application Focus
  guidanceAreas: string[];
  mentorshipGoals: string[];

  // Communication Preferences
  communicationMode: string;
  meetingFrequency: string;
  geographicalPreference: string;

  // Research & Experience
  researchExperience: string;
  researchInterest: string;

  // Mentorship Preferences
  similarIdentityPreference: string;

  // MCAT & Timeline
  mcatStatus: string;
  applicationTimeline: string;
}

const Questionnaire = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    // Academic Background
    academicLevel: "",
    university: "",
    hasUniversity: false,
    gpa: "",
    hasGpa: false,

    // Medical Interests
    primarySpecialty: "",
    mdDoInterest: "",

    // Personal Background
    firstGenStudent: false,
    applicantType: [],
    genderIdentity: "",

    // Application Focus
    guidanceAreas: [],
    mentorshipGoals: [],

    // Communication Preferences
    communicationMode: "",
    meetingFrequency: "",
    geographicalPreference: "",

    // Research & Experience
    researchExperience: "",
    researchInterest: "",

    // Mentorship Preferences
    similarIdentityPreference: "",

    // MCAT & Timeline
    mcatStatus: "",
    applicationTimeline: "",
  });

  const totalSteps = 6;

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = async () => {
    if (currentStep < totalSteps && !isLoading) {
      setIsLoading(true);

      // Simulate loading for 0.6 seconds
      await new Promise((resolve) => setTimeout(resolve, 600));

      setCurrentStep(currentStep + 1);
      setIsLoading(false);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return (
          formData.academicLevel !== "" &&
          (formData.hasUniversity || formData.university.trim() !== "")
        );
      case 2:
        return formData.primarySpecialty !== "" && formData.mdDoInterest !== "";
      case 3:
        return (
          formData.genderIdentity !== "" &&
          (formData.hasGpa || formData.gpa.trim() !== "")
        );
      case 4:
        return formData.mentorshipGoals.length > 0;
      case 5:
        return formData.applicantType.length > 0;
      case 6:
        return (
          formData.mcatStatus !== "" && formData.applicationTimeline !== ""
        );
      default:
        return true;
    }
  };

  const academicLevelOptions = [
    { value: "freshman", label: "Freshman (1st Year)" },
    { value: "sophomore", label: "Sophomore (2nd Year)" },
    { value: "junior", label: "Junior (3rd Year)" },
    { value: "senior", label: "Senior (4th Year)" },
    { value: "recent-grad", label: "Recent Graduate" },
    { value: "masters", label: "Master's Student" },
    { value: "other", label: "Other" },
  ];

  const medicalSpecialtyOptions = [
    { value: "internal-medicine", label: "Internal Medicine" },
    { value: "pediatrics", label: "Pediatrics" },
    { value: "surgery", label: "Surgery" },
    { value: "psychiatry", label: "Psychiatry" },
    { value: "emergency-medicine", label: "Emergency Medicine" },
    { value: "family-medicine", label: "Family Medicine" },
    { value: "radiology", label: "Radiology" },
    { value: "anesthesiology", label: "Anesthesiology" },
    { value: "dermatology", label: "Dermatology" },
    { value: "neurology", label: "Neurology" },
    { value: "orthopedics", label: "Orthopedics" },
    { value: "cardiology", label: "Cardiology" },
    { value: "other", label: "Other/Undecided" },
  ];

  const mdDoOptions = [
    { value: "md", label: "MD Schools Only" },
    { value: "do", label: "DO Schools Only" },
    { value: "both", label: "Both MD and DO Schools" },
  ];

  const guidanceAreaOptions = [
    { value: "mcat", label: "MCAT Preparation" },
    { value: "personal-statements", label: "Personal Statements" },
    { value: "letters", label: "Letters of Recommendation" },
    { value: "interviews", label: "Interview Skills" },
    { value: "school-list", label: "Building School List" },
    { value: "strategy", label: "General Application Strategy" },
    { value: "gap-year", label: "Gap Year Planning" },
  ];

  const researchExperienceOptions = [
    { value: "none", label: "None" },
    { value: "assistant", label: "Undergraduate Research Assistant" },
    { value: "conference", label: "Presented at a Conference" },
    { value: "published", label: "Published in a Journal" },
  ];

  const mcatStatusOptions = [
    { value: "not-started", label: "Have not started studying" },
    { value: "studying", label: "Started studying" },
    { value: "taken-waiting", label: "Taken exam (awaiting scores)" },
    { value: "received-scores", label: "Have received my scores" },
  ];

  const timelineOptions = [
    { value: "6-months", label: "Next 6 months" },
    { value: "1-2-years", label: "In 1-2 years" },
    { value: "3-plus-years", label: "In 3+ years" },
    { value: "not-sure", label: "Not sure" },
  ];

  const toggleArrayValue = (array: string[], value: string) => {
    return array.includes(value)
      ? array.filter((item) => item !== value)
      : [...array, value];
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <h1 className="mt-2 text-4xl font-semibold text-gray-900">
              Academic Background
            </h1>
            <div className="space-y-6">
              <div className="mt-6">
                <div className="mb-2 text-sm font-medium text-gray-700">
                  What is your current academic level?
                </div>
                <div className="flex flex-wrap items-center">
                  {academicLevelOptions.map((option) => (
                    <button
                      key={option.value}
                      className={`m-1 flex h-full cursor-pointer items-center justify-center rounded-lg border-2 px-4 py-2 shadow-sm focus:outline-none ${
                        formData.academicLevel === option.value
                          ? "bg-white border-primary-500 text-gray-800"
                          : "bg-white border-gray-300 text-gray-800"
                      }`}
                      onClick={() =>
                        updateFormData("academicLevel", option.value)
                      }
                    >
                      <span className="font-medium">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <div>
                  <label
                    className="m-0 inline-flex items-center text-sm font-medium mb-2 text-gray-700"
                    htmlFor="university-input"
                  >
                    Current University
                  </label>
                  <div className="flex space-x-2">
                    <UniversitySelector
                      value={formData.university}
                      onChange={(value) => updateFormData("university", value)}
                      disabled={formData.hasUniversity}
                      placeholder="Search for your university..."
                    />
                  </div>
                </div>
                <div className="relative flex items-start">
                  <div className="flex h-5 items-center">
                    <input
                      id="no-university-checkbox"
                      type="checkbox"
                      className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-primary-300 rounded accent-primary-500"
                      checked={formData.hasUniversity}
                      onChange={(e) =>
                        updateFormData("hasUniversity", e.target.checked)
                      }
                    />
                  </div>
                  <label
                    className="m-0 inline-flex items-center text-sm ml-2 text-gray-600"
                    htmlFor="no-university-checkbox"
                  >
                    I'm not currently enrolled in university.
                  </label>
                </div>
              </div>
            </div>
          </>
        );

      case 2:
        return (
          <>
            <h1 className="mt-2 text-4xl font-semibold text-gray-900">
              Medical Interests
            </h1>
            <div className="space-y-6">
              <div className="mt-6">
                <div className="mb-2 text-sm font-medium text-gray-700">
                  What is your primary medical specialty of interest?
                </div>
                <div className="flex flex-wrap items-center">
                  {medicalSpecialtyOptions.map((option) => (
                    <button
                      key={option.value}
                      className={`m-1 flex h-full cursor-pointer items-center justify-center rounded-lg border-2 px-4 py-2 shadow-sm focus:outline-none ${
                        formData.primarySpecialty === option.value
                          ? "bg-white border-primary-500 text-gray-800"
                          : "bg-white border-gray-300 text-gray-800"
                      }`}
                      onClick={() =>
                        updateFormData("primarySpecialty", option.value)
                      }
                    >
                      <span className="font-medium">{option.label}</span>
                    </button>
                  ))}
                </div>

                <div className="mt-6">
                  <div className="mb-2 text-sm font-medium text-gray-700">
                    Are you interested in MD Schools, DO Schools, or both?
                  </div>
                  <div className="flex flex-wrap items-center">
                    {mdDoOptions.map((option) => (
                      <button
                        key={option.value}
                        className={`m-1 flex h-full cursor-pointer items-center justify-center rounded-lg border-2 px-4 py-2 shadow-sm focus:outline-none ${
                          formData.mdDoInterest === option.value
                            ? "bg-white border-primary-500 text-gray-800"
                            : "bg-white border-gray-300 text-gray-800"
                        }`}
                        onClick={() =>
                          updateFormData("mdDoInterest", option.value)
                        }
                      >
                        <span className="font-medium">{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        );

      case 3:
        return (
          <>
            <h1 className="mt-2 text-4xl font-semibold text-gray-900">
              Academic Focus
            </h1>
            <div className="mt-6">
              <div className="mb-2 text-sm font-medium text-gray-700">
                What's your major or area of study?
              </div>
              <div className="flex flex-wrap items-center">
                {medicalSpecialtyOptions.map((option) => (
                  <button
                    key={option.value}
                    className={`m-1 flex h-full cursor-pointer items-center justify-center rounded-lg border-2 px-4 py-2 shadow-sm focus:outline-none ${
                      formData.genderIdentity === option.value
                        ? "bg-white border-primary-500 text-gray-800"
                        : "bg-white border-gray-300 text-gray-800"
                    }`}
                    onClick={() =>
                      updateFormData("genderIdentity", option.value)
                    }
                  >
                    <span className="font-medium">{option.label}</span>
                  </button>
                ))}
              </div>

              <div className="space-y-2 mt-6">
                <div>
                  <label
                    className="m-0 inline-flex items-center text-sm font-medium mb-2 text-gray-700"
                    htmlFor="gpa-input"
                  >
                    Current GPA
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="e.g., 3.8"
                      className="w-full px-4 py-3 border border-primary-200 rounded-lg shadow-sm focus:outline-none  focus:border-primary-500 bg-white/80 backdrop-blur-sm transition-all duration-200"
                      id="gpa-input"
                      value={formData.gpa}
                      onChange={(e) => updateFormData("gpa", e.target.value)}
                      disabled={formData.hasGpa}
                    />
                  </div>
                </div>
                <div className="relative flex items-start">
                  <div className="flex h-5 items-center">
                    <input
                      id="no-gpa-checkbox"
                      type="checkbox"
                      className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-primary-300 rounded accent-primary-500"
                      checked={formData.hasGpa}
                      onChange={(e) =>
                        updateFormData("hasGpa", e.target.checked)
                      }
                    />
                  </div>
                  <label
                    className="m-0 inline-flex items-center text-sm ml-2 text-gray-600"
                    htmlFor="no-gpa-checkbox"
                  >
                    I prefer not to share my GPA.
                  </label>
                </div>
              </div>
            </div>
          </>
        );

      case 4:
        return (
          <>
            <h1 className="mt-2 text-4xl font-semibold text-gray-900">
              Career Goals
            </h1>
            <div className="mt-6">
              <div className="mb-2 text-sm font-medium text-gray-700">
                What are your medical career interests? (Select all that apply)
              </div>
              <div className="flex flex-wrap items-center">
                {guidanceAreaOptions.map((option) => (
                  <button
                    key={option.value}
                    className={`m-1 flex h-full cursor-pointer items-center justify-center rounded-lg border-2 px-4 py-2 shadow-sm focus:outline-none ${
                      formData.mentorshipGoals.includes(option.value)
                        ? "bg-white border-primary-500 text-gray-800"
                        : "bg-white border-gray-300 text-gray-800"
                    }`}
                    onClick={() =>
                      updateFormData(
                        "mentorshipGoals",
                        toggleArrayValue(formData.mentorshipGoals, option.value)
                      )
                    }
                  >
                    <span className="font-medium">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </>
        );

      case 5:
        return (
          <>
            <h1 className="mt-2 text-4xl font-semibold text-gray-900">
              Experience & Activities
            </h1>
            <div className="mt-6">
              <div className="mb-2 text-sm font-medium text-gray-700">
                What extracurricular activities are you involved in? (Select all
                that apply)
              </div>
              <div className="flex flex-wrap items-center">
                {researchExperienceOptions.map((option) => (
                  <button
                    key={option.value}
                    className={`m-1 flex h-full cursor-pointer items-center justify-center rounded-lg border-2 px-4 py-2 shadow-sm focus:outline-none ${
                      formData.applicantType.includes(option.value)
                        ? "bg-white border-primary-500 text-gray-800"
                        : "bg-white border-gray-300 text-gray-800"
                    }`}
                    onClick={() =>
                      updateFormData(
                        "applicantType",
                        toggleArrayValue(formData.applicantType, option.value)
                      )
                    }
                  >
                    <span className="font-medium">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </>
        );

      case 6:
        return (
          <>
            <h1 className="mt-2 text-4xl font-semibold text-gray-900">
              MCAT & Application Timeline
            </h1>
            <div className="space-y-6">
              <div className="mt-6">
                <div className="mb-2 text-sm font-medium text-gray-700">
                  What is your current MCAT status?
                </div>
                <div className="flex flex-wrap items-center">
                  {mcatStatusOptions.map((option) => (
                    <button
                      key={option.value}
                      className={`m-1 flex h-full cursor-pointer items-center justify-center rounded-lg border-2 px-4 py-2 shadow-sm focus:outline-none ${
                        formData.mcatStatus === option.value
                          ? "bg-white border-primary-500 text-gray-800"
                          : "bg-white border-gray-300 text-gray-800"
                      }`}
                      onClick={() => updateFormData("mcatStatus", option.value)}
                    >
                      <span className="font-medium">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <div className="mb-2 text-sm font-medium text-gray-700">
                  When are you planning to apply to medical school?
                </div>
                <div className="flex flex-wrap items-center">
                  {timelineOptions.map((option) => (
                    <button
                      key={option.value}
                      className={`m-1 flex h-full cursor-pointer items-center justify-center rounded-lg border-2 px-4 py-2 shadow-sm focus:outline-none ${
                        formData.applicationTimeline === option.value
                          ? "bg-white border-primary-500 text-gray-800"
                          : "bg-white border-gray-300 text-gray-800"
                      }`}
                      onClick={() =>
                        updateFormData("applicationTimeline", option.value)
                      }
                    >
                      <span className="font-medium">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-primary-50/30 to-primary-100/20 relative overflow-hidden">
      {/* Background blob - half circle behind header */}
      <div className="absolute -top-48 -left-[10%] md:left-[15%] w-[500px] h-96 bg-gradient-to-br from-primary-200/40 via-primary-300/30 to-primary-100/20 rounded-full blur-2xl opacity-60"></div>

      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 border-b border-primary-100/50 bg-white/80 backdrop-blur-sm w-full">
        <div className="w-full py-8 px-8">
          {/* Header content will go here */}
        </div>
        {/* Progress bar */}
        <div className="w-full h-1 bg-transparent">
          <div
            className={`h-full bg-gradient-to-r from-primary-400 to-primary-500 transition-all duration-500 ease-out ${
              isLoading ? "animate-pulse" : ""
            }`}
            style={{
              width: isLoading ? "100%" : "0%",
              transition: isLoading
                ? "width 0.6s ease-out"
                : "width 0.3s ease-out",
            }}
          ></div>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 pt-32 pb-12 w-full">
        <div className="max-w-4xl mx-auto px-8">
          {/* Step indicator in top-left */}
          <div className="mb-8">
            <span className="inline-block rounded-full border border-primary-200 bg-white/80 backdrop-blur-sm px-4 py-2 text-sm text-primary-700 font-medium shadow-sm">
              Step {currentStep} of {totalSteps}
            </span>
          </div>

          <div className="space-y-8">{renderStep()}</div>

          <div className="flex justify-between items-center mt-12">
            {currentStep > 1 && (
              <button
                onClick={handlePrevious}
                className="px-6 py-3 text-base rounded-lg border border-primary-200 text-primary-700 hover:bg-primary-50 focus:outline-none  bg-white/80 backdrop-blur-sm"
              >
                Previous
              </button>
            )}

            <div className="flex-1"></div>

            <button
              disabled={!isStepValid() || isLoading}
              onClick={
                currentStep === totalSteps
                  ? () => console.log("Form submitted:", formData)
                  : handleNext
              }
              className={`px-12 py-3 text-base rounded-lg font-medium focus:outline-none ${
                isStepValid() && !isLoading
                  ? "bg-primary-500 text-white hover:bg-primary-600 "
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {currentStep === totalSteps ? "Complete" : "Next"}
            </button>
          </div>

          <hr className="my-8 border-primary-100" />

          <div className="flex items-start justify-between space-x-4 rounded-lg border p-6 text-sm bg-primary-50/50 text-primary-800 border-primary-200/50 backdrop-blur-sm">
            <div className="flex">
              <svg
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-3 mt-0.5 hidden h-5 w-5 shrink-0 sm:block text-primary-600"
              >
                <path
                  d="M8 0C3.6 0 0 3.6 0 8C0 12.4 3.6 16 8 16C12.4 16 16 12.4 16 8C16 3.6 12.4 0 8 0ZM9 12H7V7H9V12ZM8 6C7.4 6 7 5.6 7 5C7 4.4 7.4 4 8 4C8.6 4 9 4.4 9 5C9 5.6 8.6 6 8 6Z"
                  fill="currentColor"
                ></path>
              </svg>
              <div>
                <div className="font-semibold mb-2 text-primary-900">
                  Why are we asking this?
                </div>
                <p className="leading-relaxed">
                  This information helps us match you with the most relevant
                  mentors.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Questionnaire;
