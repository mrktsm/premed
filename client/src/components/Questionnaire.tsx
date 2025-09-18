import { useState } from "react";
import UniversitySelector from "./UniversitySelector";

interface FormData {
  // Academic Background
  academicLevel: string; // Year of college, recent graduate, Master's student, or other
  university: string;
  hasUniversity: boolean;
  firstGenStudent: boolean;

  // Medical Interests
  primarySpecialty: string; // Comprehensive medical specialty list
  mdDoInterest: string; // MD, DO, or both

  // Personal Background
  applicantType: string; // Traditional, Non-traditional, First-gen, URM
  genderIdentity: string;

  // Application Focus (up to 3 selections)
  guidanceAreas: string[]; // MCAT, Personal Statements, Letters, Interview Skills, School List, Strategy, Gap Year

  // Mentorship Goals (up to 2 selections)
  mentorshipGoals: string[]; // General advice, specific component help, specialty insight, networking, emotional support

  // Communication & Meeting Preferences
  communicationMode: string; // Email, Video Calls, Phone, Text, In Person
  meetingFrequency: string; // Weekly, Bi-monthly, Monthly, As needed
  geographicalPreference: string; // Any location, same state/region, same city

  // Research Experience & Interest
  researchExperience: string; // None, research assistant, conference presentation, published
  researchInterest: string; // Not interested, basic science, clinical, translational, public health, health policy, other

  // Mentorship Preferences
  similarIdentityPreference: string; // Important, nice bonus, doesn't matter

  // MCAT & Timeline
  mcatStatus: string; // Haven't started, studying, taken (awaiting), received scores
  applicationTimeline: string; // Next 6 months, 1-2 years, 3+ years, not sure
}

interface QuestionnaireProps {
  onBackToSignUp?: () => void;
}

const Questionnaire = ({
  onBackToSignUp: _onBackToSignUp,
}: QuestionnaireProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    // Academic Background
    academicLevel: "",
    university: "",
    hasUniversity: false,
    firstGenStudent: false,

    // Medical Interests
    primarySpecialty: "",
    mdDoInterest: "",

    // Personal Background
    applicantType: "",
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
        return formData.genderIdentity !== "" && formData.applicantType !== "";
      case 4:
        return (
          formData.mentorshipGoals.length > 0 &&
          formData.mentorshipGoals.length <= 2
        );
      case 5:
        return (
          formData.guidanceAreas.length > 0 &&
          formData.guidanceAreas.length <= 3
        );
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
    { value: "recent-graduate", label: "Recent Graduate" },
    { value: "masters-student", label: "Master's Student" },
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
    { value: "mcat-preparation", label: "MCAT Preparation" },
    { value: "personal-statements", label: "Personal Statements" },
    { value: "letters-of-recommendation", label: "Letters of Recommendation" },
    { value: "interview-skills", label: "Interview Skills" },
    { value: "building-school-list", label: "Building School List" },
    {
      value: "general-application-strategy",
      label: "General Application Strategy",
    },
    { value: "gap-year-planning", label: "Gap Year Planning" },
  ];

  const mcatStatusOptions = [
    { value: "have-not-started-studying", label: "Have not started studying" },
    { value: "started-studying", label: "Started studying" },
    {
      value: "taken-exam-awaiting-scores",
      label: "Taken exam (awaiting scores)",
    },
    { value: "have-received-my-scores", label: "Have received my scores" },
  ];

  const timelineOptions = [
    { value: "next-6-months", label: "Next 6 months" },
    { value: "in-1-2-years", label: "In 1-2 years" },
    { value: "in-3-plus-years", label: "In 3+ years" },
    { value: "not-sure", label: "Not sure" },
  ];

  const applicantTypeOptions = [
    { value: "traditional", label: "Traditional" },
    { value: "non-traditional", label: "Non-traditional" },
    { value: "first-gen", label: "First-generation college student" },
    { value: "urm", label: "URM in medicine" },
  ];

  const mentorshipGoalOptions = [
    { value: "general-advice", label: "General advice" },
    {
      value: "specific-application-component-help",
      label: "Specific application component help",
    },
    {
      value: "insight-into-medical-specialty",
      label: "Insight into a medical specialty",
    },
    {
      value: "networking-professional-connections",
      label: "Networking/professional connections",
    },
    {
      value: "emotional-support-motivation",
      label: "Emotional support and motivation",
    },
  ];

  const genderIdentityOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "non-binary", label: "Non-Binary" },
    { value: "other", label: "Other" },
    { value: "prefer-not-to-say", label: "Prefer not to say" },
  ];

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
              Personal Background
            </h1>
            <div className="space-y-6">
              <div className="mt-6">
                <div className="mb-2 text-sm font-medium text-gray-700">
                  What is your gender identity?
                </div>
                <div className="flex flex-wrap items-center">
                  {genderIdentityOptions.map((option) => (
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
              </div>

              <div className="mt-6">
                <div className="mb-2 text-sm font-medium text-gray-700">
                  What type of applicant would you consider yourself?
                </div>
                <div className="flex flex-wrap items-center">
                  {applicantTypeOptions.map((option) => (
                    <button
                      key={option.value}
                      className={`m-1 flex h-full cursor-pointer items-center justify-center rounded-lg border-2 px-4 py-2 shadow-sm focus:outline-none ${
                        formData.applicantType === option.value
                          ? "bg-white border-primary-500 text-gray-800"
                          : "bg-white border-gray-300 text-gray-800"
                      }`}
                      onClick={() =>
                        updateFormData("applicantType", option.value)
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

      case 4:
        return (
          <>
            <h1 className="mt-2 text-4xl font-semibold text-gray-900">
              Mentorship Goals
            </h1>
            <div className="mt-6">
              <div className="mb-2 text-sm font-medium text-gray-700">
                What are your primary mentorship goals? (Select up to 2)
              </div>
              <div className="mb-4 text-xs text-gray-500">
                Selected: {formData.mentorshipGoals.length}/2
              </div>
              <div className="flex flex-wrap items-center">
                {mentorshipGoalOptions.map((option) => (
                  <button
                    key={option.value}
                    className={`m-1 flex h-full cursor-pointer items-center justify-center rounded-lg border-2 px-4 py-2 shadow-sm focus:outline-none ${
                      formData.mentorshipGoals.includes(option.value)
                        ? "bg-white border-primary-500 text-gray-800"
                        : "bg-white border-gray-300 text-gray-800"
                    }`}
                    onClick={() => {
                      const currentGoals = formData.mentorshipGoals;
                      const isSelected = currentGoals.includes(option.value);

                      if (isSelected) {
                        // Remove if already selected
                        updateFormData(
                          "mentorshipGoals",
                          currentGoals.filter((goal) => goal !== option.value)
                        );
                      } else if (currentGoals.length < 2) {
                        // Add if under limit
                        updateFormData("mentorshipGoals", [
                          ...currentGoals,
                          option.value,
                        ]);
                      }
                    }}
                    disabled={
                      !formData.mentorshipGoals.includes(option.value) &&
                      formData.mentorshipGoals.length >= 2
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
              Application Guidance
            </h1>
            <div className="mt-6">
              <div className="mb-2 text-sm font-medium text-gray-700">
                What aspects of medical application are you most interested in
                receiving guidance on? (Select up to 3)
              </div>
              <div className="mb-4 text-xs text-gray-500">
                Selected: {formData.guidanceAreas.length}/3
              </div>
              <div className="flex flex-wrap items-center">
                {guidanceAreaOptions.map((option) => (
                  <button
                    key={option.value}
                    className={`m-1 flex h-full cursor-pointer items-center justify-center rounded-lg border-2 px-4 py-2 shadow-sm focus:outline-none ${
                      formData.guidanceAreas.includes(option.value)
                        ? "bg-white border-primary-500 text-gray-800"
                        : "bg-white border-gray-300 text-gray-800"
                    }`}
                    onClick={() => {
                      const currentAreas = formData.guidanceAreas;
                      const isSelected = currentAreas.includes(option.value);

                      if (isSelected) {
                        // Remove if already selected
                        updateFormData(
                          "guidanceAreas",
                          currentAreas.filter((area) => area !== option.value)
                        );
                      } else if (currentAreas.length < 3) {
                        // Add if under limit
                        updateFormData("guidanceAreas", [
                          ...currentAreas,
                          option.value,
                        ]);
                      }
                    }}
                    disabled={
                      !formData.guidanceAreas.includes(option.value) &&
                      formData.guidanceAreas.length >= 3
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
